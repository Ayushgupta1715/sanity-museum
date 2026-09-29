import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevGuru — AI Coding Mentor',
  description: 'AI-powered coding mentor with grounded answers from a curated Knowledge Base. No hallucinations, just facts.',
  keywords: ['AI', 'coding', 'mentor', 'Sanity', 'Knowledge Base', 'grounded AI'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface text-white antialiased">
        {children}
      </body>
    </html>
  );
}
