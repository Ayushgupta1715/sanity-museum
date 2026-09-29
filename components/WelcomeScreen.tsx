'use client';

interface WelcomeScreenProps {
  onSelectQuestion: (question: string) => void;
}

const SUGGESTED_QUESTIONS = [
  { icon: '⚛️', text: 'How does useEffect work in React?', color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30' },
  { icon: '🔷', text: 'What are TypeScript generics?', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30' },
  { icon: '▲', text: 'Explain Next.js App Router', color: 'from-white/10 to-gray-500/10 border-white/20' },
  { icon: '🟢', text: 'How to create a REST API in Node.js?', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
  { icon: '🎨', text: 'Explain CSS Grid layout', color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30' },
  { icon: '🔀', text: 'How to resolve Git merge conflicts?', color: 'from-orange-500/20 to-amber-500/20 border-orange-500/30' },
];

export default function WelcomeScreen({ onSelectQuestion }: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 animate-fade-in">
      <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-4xl shadow-2xl shadow-brand-500/30">
        🧑💻
      </div>
      <h2 className="mt-4 text-3xl font-bold tracking-tight">
        Dev<span className="text-brand-400">Guru</span>
      </h2>
      <p className="mt-2 max-w-md text-center text-gray-400">
        Your AI coding mentor. Ask any programming question — I'll answer with{' '}
        <span className="text-brand-300 font-medium">verified knowledge</span> and{' '}
        <span className="text-brand-300 font-medium">source citations</span>.
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Grounded in Sanity Knowledge Base • Zero hallucinations
      </p>

      <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q.text}
            onClick={() => onSelectQuestion(q.text)}
            className={`group flex items-center gap-3 rounded-xl border bg-gradient-to-r p-4 text-left transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${q.color}`}
          >
            <span className="text-2xl">{q.icon}</span>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              {q.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
