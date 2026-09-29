'use client';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-bold shadow-lg shadow-brand-500/20">
            🧑💻
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Dev<span className="text-brand-400">Guru</span>
            </h1>
            <p className="text-xs text-gray-400">AI Coding Mentor • Grounded in Knowledge</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Knowledge Base Active
          </span>
        </div>
      </div>
    </header>
  );
}
