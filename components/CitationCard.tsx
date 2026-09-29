'use client';

import { Citation } from '@/lib/types';

interface CitationCardProps {
  citations: Citation[];
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-300',
  intermediate: 'bg-yellow-500/20 text-yellow-300',
  advanced: 'bg-red-500/20 text-red-300',
};

export default function CitationCard({ citations }: CitationCardProps) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Sources from Knowledge Base
      </div>
      {citations.map((citation) => (
        <div
          key={citation.id}
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10"
        >
          <span className="text-lg">{citation.topicIcon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">{citation.title}</p>
            <p className="text-xs text-gray-500">{citation.topic}</p>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${difficultyColors[citation.difficulty] || 'bg-gray-500/20 text-gray-300'}`}>
            {citation.difficulty}
          </span>
        </div>
      ))}
    </div>
  );
}
