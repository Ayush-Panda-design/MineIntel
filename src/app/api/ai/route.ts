import { NextRequest, NextResponse } from 'next/server';
import { AIQueueManager } from '@/lib/ai/AIQueueManager';
import { AIRequestType } from '@/lib/ai/types';

// POST /api/ai
// Submits a new job to the internal AI Queue
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, payload, slideId, userId } = body as {
      type: AIRequestType;
      payload: any;
      slideId?: string;
      userId: string;
    };

    if (!type || !payload || !userId) {
      return NextResponse.json({ error: 'Missing required fields: type, payload, userId' }, { status: 400 });
    }

    // Secure backend queueing - Front-end receives only a Job ID
    const jobId = AIQueueManager.enqueue(type, userId, payload, slideId);
    
    return NextResponse.json({ jobId, status: 'pending' }, { status: 202 });

  } catch (error) {
    console.error('API /ai POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET /api/ai?id=...
// Polls the status of an existing AI job
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing job id' }, { status: 400 });
  }

  const job = AIQueueManager.getStatus(id);

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    result: job.result, // Only populated if status === 'completed'
    error: job.error,   // Only populated if status === 'failed' | 'timeout'
  });
}
