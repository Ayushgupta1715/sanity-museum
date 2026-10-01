'use client';

import React, { useState, Component, ErrorInfo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Settings2, Info, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Moon, Sun } from 'lucide-react';

class ErrorBoundary extends Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Canvas Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="absolute inset-0 flex items-center justify-center bg-red-900 z-50 text-white p-10"><pre>{this.state.error?.message}</pre></div>;
    }
    return this.props.children;
  }
}

const MuseumScene = dynamic(() => import('@/components/MuseumScene'), { ssr: false });

export default function Home() {
  const [selectedExhibit, setSelectedExhibit] = useState<any>(null);
  const [targetZ, setTargetZ] = useState<number>(18);
  const [targetX, setTargetX] = useState<number>(0);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  if (typeof window !== 'undefined') {
    (window as any).__setSelectedExhibit = setSelectedExhibit;
  }

  // Walk constraints
  const moveForward = () => setTargetZ(prev => Math.max(prev - 5, -120));
  const moveBackward = () => setTargetZ(prev => Math.min(prev + 5, 20));
  const moveLeft = () => setTargetX(prev => Math.max(prev - 5, -15));
  const moveRight = () => setTargetX(prev => Math.min(prev + 5, 15));

  // WASD controls are now natively handled by MuseumScene for butter smooth 60fps movement.

  return (
    <main className="w-screen h-screen bg-black overflow-hidden relative font-sans">
      {/* Sleek UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-8">
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-extrabold tracking-widest text-white drop-shadow-lg font-sans">
              THE LIVING MUSEUM
            </h1>
            <p className="text-sm font-medium text-white/70 tracking-widest mt-1 flex items-center gap-2">
              <Info className="w-4 h-4" /> W A S D TO WALK • DRAG TO EXPLORE • CLICK TO INSPECT
            </p>
          </div>
          
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setIsNightMode(!isNightMode)}
              className="pointer-events-auto p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              title="Toggle Day/Night Mode"
            >
              {isNightMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-200" />}
            </button>
            <Link href="/control-room" className="pointer-events-auto group relative px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold tracking-widest rounded-full hover:bg-white/20 transition-all flex items-center gap-2 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Settings2 className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              CONTROL ROOM
            </Link>
          </div>
        </header>

        <footer className="flex justify-between items-end">
          <div className="pointer-events-auto space-x-4">
            <Link href="/studio" className="text-xs text-white/50 hover:text-white transition-colors border-b border-white/20 pb-1">
              Sanity Studio
            </Link>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 font-mono">Sanity App SDK • React Three Fiber</p>
          </div>
        </footer>
      </div>

      {/* Exhibit Details Panel */}
      {selectedExhibit && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto w-[400px] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in">
          <button 
            onClick={() => setSelectedExhibit(null)}
            className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/50 p-2 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {selectedExhibit.imageUrl && (
            <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden bg-black/50 relative border border-white/10">
              <img 
                src={selectedExhibit.imageUrl} 
                alt={selectedExhibit.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="mb-6">
            <span className="text-[10px] tracking-[0.2em] text-white/50 uppercase">{selectedExhibit.category || 'EXHIBIT'}</span>
            <h2 className="text-3xl font-bold text-white mt-1 mb-2">{selectedExhibit.name}</h2>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">{selectedExhibit.era || 'Unknown Era'}</span>
              <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">{selectedExhibit.creator || 'Unknown Creator'}</span>
            </div>
          </div>
          
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            {selectedExhibit.description || 'No description available for this artifact.'}
          </p>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <div className="flex justify-between text-xs text-white/50 mb-2">
              <span>LIFECYCLE STATUS</span>
              <span className={
                selectedExhibit.control?.lifecycle === 'ACTIVE' ? 'text-green-400' :
                selectedExhibit.control?.lifecycle === 'REVIVED' ? 'text-blue-400' :
                selectedExhibit.control?.lifecycle === 'COOLING' ? 'text-yellow-400' : 'text-neutral-400'
              }>{selectedExhibit.control?.lifecycle || 'UNKNOWN'}</span>
            </div>
            
            <div className="flex justify-between text-xs text-white/50 mb-1">
              <span>VITALITY INDEX</span>
              <span>{selectedExhibit.control?.vitality || 0}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/80"
                style={{ width: `${selectedExhibit.control?.vitality || 0}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Room Navigation Buttons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-auto flex gap-4 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10">
        <NavBtn label="ROOM 1" subLabel="INVENTIONS" target={18} current={targetZ} onClick={(z) => { setTargetZ(z); setTargetX(0); }} />
        <NavBtn label="ROOM 2" subLabel="ART" target={-12} current={targetZ} onClick={(z) => { setTargetZ(z); setTargetX(0); }} />
        <NavBtn label="ROOM 3" subLabel="HISTORY" target={-42} current={targetZ} onClick={(z) => { setTargetZ(z); setTargetX(0); }} />
        <NavBtn label="ROOM 4" subLabel="FUTURE" target={-72} current={targetZ} onClick={(z) => { setTargetZ(z); setTargetX(0); }} />
      </div>

      {/* Smooth Continuous Manual Walk Controls (D-Pad) */}
      <div className="absolute bottom-8 right-8 z-10 pointer-events-auto flex flex-col items-center gap-2 bg-black/50 backdrop-blur-md p-4 rounded-3xl border border-white/10">
        <DPadButton keyCode="w" icon={<ArrowUp className="w-6 h-6" />} />
        <div className="flex gap-2">
          <DPadButton keyCode="a" icon={<ArrowLeft className="w-6 h-6" />} />
          <DPadButton keyCode="s" icon={<ArrowDown className="w-6 h-6" />} />
          <DPadButton keyCode="d" icon={<ArrowRight className="w-6 h-6" />} />
        </div>
      </div>

      <ErrorBoundary>
        <MuseumScene onSelectExhibit={setSelectedExhibit} targetZ={targetZ} targetX={targetX} isNightMode={isNightMode} />
      </ErrorBoundary>
    </main>
  );
}

function DPadButton({ keyCode, icon }: { keyCode: string, icon: React.ReactNode }) {
  const trigger = (type: string) => window.dispatchEvent(new KeyboardEvent(type, { key: keyCode }));
  return (
    <button 
      onPointerDown={(e) => { e.preventDefault(); trigger('keydown'); }}
      onPointerUp={(e) => { e.preventDefault(); trigger('keyup'); }}
      onPointerLeave={(e) => { e.preventDefault(); trigger('keyup'); }}
      onPointerCancel={(e) => { e.preventDefault(); trigger('keyup'); }}
      onContextMenu={(e) => e.preventDefault()}
      className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors touch-none select-none"
    >
      {icon}
    </button>
  );
}

function NavBtn({ label, subLabel, target, current, onClick }: { label: string, subLabel: string, target: number, current: number, onClick: (v: number) => void }) {
  const active = Math.abs(current - target) < 10;
  return (
    <button 
      onClick={() => onClick(target)}
      className={`px-6 py-2 flex flex-col items-center rounded-full transition-all ${active ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
    >
      <span className="text-xs font-bold tracking-widest">{label}</span>
      <span className="text-[10px] opacity-70 tracking-wider">{subLabel}</span>
    </button>
  );
}
