export const AI_CONFIG = {
  models: {
    // Advanced reasoning, complex layout changes, full deck reviews
    reasoning: process.env.GEMINI_REASONING_MODEL || 'gemini-2.5-flash',
    // Quick text edits, simple classification, fast responses
    fastText: process.env.GEMINI_FAST_MODEL || 'gemini-2.5-flash',
    // Image generation
    imageGeneration: process.env.GEMINI_IMAGE_MODEL || 'imagen-3.0-generate-001',
  },
  keys: {
    primary: process.env.GEMINI_API_KEY || '',
    // E.g. For fallback when rate limits are hit on primary
    fallback: process.env.GEMINI_API_KEY_FALLBACK || '', 
  },
  settings: {
    maxConcurrentRequests: parseInt(process.env.AI_MAX_CONCURRENT || '3', 10),
    defaultTimeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '30000', 10),
    maxRetries: 2,
  }
};
