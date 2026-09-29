import { GoogleGenAI } from '@google/genai';
import { Tutorial, Citation } from './types';

function getAI() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
}

const SYSTEM_PROMPT = `You are DevGuru, an AI coding mentor. You ONLY answer questions based on the knowledge base context provided to you.

RULES:
1. ONLY use information from the provided context documents to answer questions.
2. If the context does not contain relevant information, say: "I don't have information about that in my knowledge base. Try asking about React, Next.js, TypeScript, Node.js, CSS, Git, or JavaScript."
3. Always be helpful, clear, and concise.
4. When showing code, use proper markdown code blocks with the language specified.
5. Reference which tutorial/document your answer comes from.
6. Do NOT make up information or use knowledge outside the provided context.
7. Format your response in markdown for readability.
8. If multiple documents are relevant, synthesize the information and cite all sources.

You are grounded — accuracy over creativity. Never hallucinate.`;

export async function generateGroundedAnswer(
  question: string,
  contextDocs: Tutorial[]
): Promise<{ answer: string; citations: Citation[] }> {
  if (!contextDocs || contextDocs.length === 0) {
    return {
      answer:
        "I don't have information about that in my knowledge base. Try asking about **React**, **Next.js**, **TypeScript**, **Node.js**, **CSS**, **Git**, or **JavaScript**.",
      citations: [],
    };
  }

  // Build context from Knowledge Base documents
  const contextText = contextDocs
    .map((doc, i) => {
      const codeSection = doc.codeExamples
        ?.map(
          (ex) =>
            `\nCode Example - ${ex.title}:\n\`\`\`${ex.language}\n${ex.code}\n\`\`\`\n${ex.explanation}`
        )
        .join('\n');

      return `--- Document ${i + 1}: "${doc.title}" (${doc.topicName}, ${doc.difficulty}) ---\n${doc.content}\n${codeSection || ''}`;
    })
    .join('\n\n');

  const prompt = `Context from Knowledge Base:\n${contextText}\n\n---\nUser Question: ${question}\n\nProvide a grounded answer based ONLY on the context above. Cite which document(s) you used.`;

  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    });

    const answer = response.text || 'Sorry, I could not generate an answer.';

    // Build citations from the context documents used
    const citations: Citation[] = contextDocs.map((doc) => ({
      id: doc._id,
      title: doc.title,
      topic: doc.topicName,
      topicIcon: doc.topicIcon,
      difficulty: doc.difficulty,
      slug: doc.slug,
    }));

    return { answer, citations };
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      answer: 'Sorry, I encountered an error. Please try again.',
      citations: [],
    };
  }
}
