import { Slide, SlideElement } from '@/types/studio';

export type AIRequestType = 'generateText' | 'analyzeSlide' | 'modifySlide' | 'generateImage' | 'editImage' | 'reviewPresentation' | 'generateSlide' | 'enforceDeckConsistency';

export interface GenerateSlideParams {
  purpose: string;
  visualDirection?: string;
  density?: string;
  visualType: string;
  style: string;
}

export interface AIRequest {
  id: string;
  type: AIRequestType;
  model: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'timeout';
  userId: string;
  slideId?: string;
  payload: any;
  result?: any;
  error?: string;
  createdAt: number;
  completedAt?: number;
  retries: number;
}

export interface ModifySlideResult {
  explanation: string;
  elements: SlideElement[];
}

export interface ReviewPresentationResult {
  narrativeFlow: string;
  repetitionWarnings: string[];
  designIssues: string[];
}
