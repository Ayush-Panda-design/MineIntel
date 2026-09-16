import { AIRequest, AIRequestType } from './types';
import { AI_CONFIG } from '@/config/ai';
import { AIService } from './AIService';

// In a production serverless environment (like Vercel), this in-memory map 
// would be replaced by Redis, Postgres, or a durable queue like Upstash/SQS.
// For this architecture demo, an in-memory map simulates the persistent queue state.
const requestQueue = new Map<string, AIRequest>();
let activeRequests = 0;

export const AIQueueManager = {
  
  enqueue: (type: AIRequestType, userId: string, payload: any, slideId?: string): string => {
    const id = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Model Routing based on task type
    let model = AI_CONFIG.models.fastText;
    if (type === 'modifySlide' || type === 'reviewPresentation') model = AI_CONFIG.models.reasoning;
    if (type === 'generateImage' || type === 'editImage') model = AI_CONFIG.models.imageGeneration;

    const req: AIRequest = {
      id,
      type,
      model,
      status: 'pending',
      userId,
      slideId,
      payload,
      createdAt: Date.now(),
      retries: 0,
    };
    
    requestQueue.set(id, req);
    
    // Asynchronously kick off processing without blocking the enqueue return
    setTimeout(() => AIQueueManager.processQueue(), 0);
    
    return id;
  },

  getStatus: (id: string): AIRequest | undefined => {
    return requestQueue.get(id);
  },

  processQueue: async () => {
    if (activeRequests >= AI_CONFIG.settings.maxConcurrentRequests) {
      return; // Capacity reached, wait for current jobs to finish
    }

    // Find next pending job
    const pendingReqs = Array.from(requestQueue.values())
      .filter(r => r.status === 'pending')
      .sort((a, b) => a.createdAt - b.createdAt); // FIFO

    if (pendingReqs.length === 0) return;

    const req = pendingReqs[0];
    req.status = 'processing';
    requestQueue.set(req.id, req);
    activeRequests++;

    try {
      // Implement timeout logic via Promise.race
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI Request Timeout')), AI_CONFIG.settings.defaultTimeoutMs)
      );

      // Route to appropriate AIService method
      let taskPromise: Promise<any>;
      switch (req.type) {
        case 'modifySlide':
          taskPromise = AIService.modifySlide(req.payload.slideState, req.payload.instruction);
          break;
        case 'generateSlide':
          taskPromise = AIService.generateSlide(req.payload);
          break;
        case 'reviewPresentation':
          taskPromise = AIService.reviewPresentation(req.payload.presentation);
          break;
        case 'generateText':
          taskPromise = AIService.generateText(req.payload.prompt);
          break;
        case 'generateImage':
          taskPromise = AIService.generateImage(req.payload);
          break;
        case 'enforceDeckConsistency':
          taskPromise = AIService.enforceDeckConsistency(req.payload);
          break;
        default:
          taskPromise = Promise.reject(new Error(`Unsupported AI task type: ${req.type}`));
      }

      // Execute with timeout
      const result = await Promise.race([taskPromise, timeoutPromise]);
      
      req.status = 'completed';
      req.result = result;
      req.completedAt = Date.now();
      requestQueue.set(req.id, req);

    } catch (error: any) {
      console.error(`AI Queue Error for ${req.id}:`, error);
      
      if (req.retries < AI_CONFIG.settings.maxRetries) {
        req.retries++;
        req.status = 'pending'; // Re-queue
      } else {
        req.status = error.message === 'AI Request Timeout' ? 'timeout' : 'failed';
        req.error = error.message || 'Unknown API Error';
        req.completedAt = Date.now();
      }
      requestQueue.set(req.id, req);
    } finally {
      activeRequests--;
      // Process next in queue
      setTimeout(() => AIQueueManager.processQueue(), 0);
    }
  }
};
