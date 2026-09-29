import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <Header />
      <div className="pt-16">
        <ChatInterface />
      </div>
    </main>
  );
}
