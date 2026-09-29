import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledgeBase } from '@/lib/sanity';
import { generateGroundedAnswer } from '@/lib/ai';

// Force dynamic to prevent build-time evaluation
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Step 1: Search Knowledge Base
    const relevantDocs = await searchKnowledgeBase(question);

    // Step 2: Generate grounded answer
    const { answer, citations } = await generateGroundedAnswer(
      question,
      relevantDocs
    );

    return NextResponse.json({ answer, citations });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
