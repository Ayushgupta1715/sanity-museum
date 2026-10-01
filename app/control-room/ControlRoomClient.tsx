'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@sanity/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Archive, Zap, ShieldAlert, CheckCircle2, RotateCw } from 'lucide-react';
import { apiVersion, dataset, projectId } from '@/sanity/env';

const client = createClient({
  projectId: projectId || 'placeholder',
  dataset: dataset || 'production',
  apiVersion,
  useCdn: false, // Live queries need Cdn disabled
});

type Exhibit = {
  _id: string;
  name: string;
  control: {
    lifecycle: 'ACTIVE' | 'COOLING' | 'ARCHIVED' | 'REVIVED';
    vitality: number;
    x: number;
    y: number;
    z: number;
    rotation: number;
  };
  workflowState: string;
};

export default function ControlRoomClient() {
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [liveEvents, setLiveEvents] = useState<{ id: string; message: string; type: string }[]>([]);
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null);

  useEffect(() => {
    // Initial fetch
    client.fetch('*[_type == "exhibit"]').then((data) => {
      setExhibits(data);
    });

    // Listen for real-time updates
    const subscription = client.listen('*[_type == "exhibit"]').subscribe((update) => {
      if (update.transition === 'update') {
        const updatedExhibit = update.result as unknown as Exhibit;
        setExhibits((prev) => prev.map((e) => (e._id === updatedExhibit._id ? updatedExhibit : e)));
        
        // Push a live event
        const eventId = Math.random().toString(36).substring(7);
        let msg = `${updatedExhibit.name} updated`;
        let type = 'info';

        if (updatedExhibit.control?.lifecycle === 'REVIVED') {
          msg = `"${updatedExhibit.name}" revived`;
          type = 'revive';
        } else if (updatedExhibit.control?.lifecycle === 'COOLING') {
          msg = `"${updatedExhibit.name}" cooling`;
          type = 'cooling';
        } else if (updatedExhibit.control?.lifecycle === 'ARCHIVED') {
          msg = `"${updatedExhibit.name}" archived`;
          type = 'archive';
        }

        setLiveEvents((prev) => [{ id: eventId, message: msg, type }, ...prev].slice(0, 10));
      } else if (update.transition === 'appear') {
        const newExhibit = update.result as unknown as Exhibit;
        setExhibits((prev) => [...prev, newExhibit]);
        const eventId = Math.random().toString(36).substring(7);
        setLiveEvents((prev) => [{ id: eventId, message: `🔵 "${newExhibit.name}" added`, type: 'new' }, ...prev].slice(0, 10));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const simulateAction = (action: string) => {
    if (!selectedExhibit) return;
    
    // Simulate updating the exhibit locally for the UI (without DB write token)
    let newLifecycle = selectedExhibit.control?.lifecycle || 'ACTIVE';
    let newVitality = selectedExhibit.control?.vitality || 50;

    if (action === 'REVIVE') { newLifecycle = 'REVIVED'; newVitality = 100; }
    if (action === 'COOLING') { newLifecycle = 'COOLING'; newVitality -= 20; }
    if (action === 'ARCHIVE') { newLifecycle = 'ARCHIVED'; newVitality = 0; }
    if (action === 'BOOST') { newVitality = Math.min(100, newVitality + 30); }

    const updated = { ...selectedExhibit, control: { ...selectedExhibit.control, lifecycle: newLifecycle as any, vitality: newVitality } };
    
    setExhibits((prev) => prev.map(e => e._id === updated._id ? updated : e));
    setSelectedExhibit(updated);

    // Push local event
    const eventId = Math.random().toString(36).substring(7);
    setLiveEvents((prev) => [{ id: eventId, message: `⚠️ COMMAND EXECUTED: ${action} on ${updated.name}`, type: 'command' }, ...prev].slice(0, 10));
  };

  const activeCount = exhibits.filter((e) => e.control?.lifecycle === 'ACTIVE').length;
  const coolingCount = exhibits.filter((e) => e.control?.lifecycle === 'COOLING').length;
  const archivedCount = exhibits.filter((e) => e.control?.lifecycle === 'ARCHIVED').length;

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/20 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-widest text-white mb-2 flex items-center gap-3">
            <ShieldAlert className="text-red-500 w-10 h-10 animate-pulse" />
            CENTRAL COMMAND
          </h1>
          <p className="text-red-400/80 text-sm font-mono tracking-widest">AUTHORIZED PERSONNEL ONLY • SYSTEM ONLINE</p>
        </div>
        <div className="flex gap-4 mt-6 md:mt-0">
          <a href="/" className="bg-white/5 border border-white/20 hover:bg-white/10 transition px-6 py-3 rounded-none font-mono text-xs tracking-widest text-white flex items-center gap-2">
            <RotateCw className="w-4 h-4" />
            RETURN TO MUSEUM
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="ACTIVE NODES" value={activeCount} color="text-green-500" />
            <StatCard label="COOLING STATE" value={coolingCount} color="text-yellow-500" />
            <StatCard label="OFFLINE / ARCHIVED" value={archivedCount} color="text-neutral-500" />
          </div>

          <div className="bg-black/60 border border-white/10 rounded-none p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0 opacity-50"></div>
            <h2 className="text-lg font-mono tracking-widest mb-6 text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              EXHIBIT VITALITY GRID
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence>
                {exhibits.map((exhibit) => (
                  <motion.div
                    key={exhibit._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelectedExhibit(exhibit)}
                    className="p-4 bg-white/5 border border-white/10 hover:border-red-500/50 cursor-pointer transition-colors flex flex-col gap-3 group"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-mono text-sm tracking-wider text-white truncate group-hover:text-red-400 transition-colors">{exhibit.name}</h3>
                      <LifecycleBadge status={exhibit.control?.lifecycle || 'ACTIVE'} />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-mono tracking-widest text-neutral-500 mb-1">
                        <span>VTL_INDEX</span>
                        <span>{exhibit.control?.vitality || 0}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 overflow-hidden">
                        <motion.div
                          className={`h-full ${getVitalityColor(exhibit.control?.vitality || 0)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${exhibit.control?.vitality || 0}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-black/60 border border-white/10 rounded-none p-6 sticky top-8 font-mono">
            <h2 className="text-sm tracking-widest mb-6 flex items-center gap-2 text-white border-b border-white/10 pb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 bg-red-500"></span>
              </span>
              SYSTEM LOGS
            </h2>
            <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {liveEvents.length === 0 && (
                  <p className="text-neutral-600 text-xs tracking-widest">AWAITING TELEMETRY...</p>
                )}
                {liveEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 text-xs border-l-2 border-white/10 pl-3 py-1"
                  >
                    <EventIcon type={event.type} />
                    <span className="text-neutral-400">{event.message.toUpperCase()}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* COMMAND CONSOLE MODAL */}
      <AnimatePresence>
        {selectedExhibit && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0a0a0a] border border-red-500/30 w-full max-w-2xl p-8 relative shadow-[0_0_50px_rgba(239,68,68,0.1)]"
            >
              <button onClick={() => setSelectedExhibit(null)} className="absolute top-6 right-6 text-neutral-500 hover:text-white">✕</button>
              
              <div className="text-xs text-red-500 tracking-[0.3em] mb-2">TARGET LOCKED</div>
              <h2 className="text-3xl text-white font-black uppercase tracking-wider mb-8">{selectedExhibit.name}</h2>
              
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <div className="text-xs text-neutral-500 tracking-widest mb-2">CURRENT LIFECYCLE</div>
                  <LifecycleBadge status={selectedExhibit.control?.lifecycle || 'ACTIVE'} />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 tracking-widest mb-2">VITALITY QUOTIENT</div>
                  <div className="text-3xl text-white">{selectedExhibit.control?.vitality || 0}%</div>
                </div>
              </div>

              <div className="text-xs text-neutral-500 tracking-widest mb-4 border-b border-white/10 pb-2">COMMAND OVERRIDES</div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => simulateAction('BOOST')} className="p-4 border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs tracking-widest transition-colors text-left">
                  &gt; INITIATE POWER BOOST
                </button>
                <button onClick={() => simulateAction('REVIVE')} className="p-4 border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs tracking-widest transition-colors text-left">
                  &gt; EXECUTE REVIVAL PROTOCOL
                </button>
                <button onClick={() => simulateAction('COOLING')} className="p-4 border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs tracking-widest transition-colors text-left">
                  &gt; ENGAGE COOLING FANS
                </button>
                <button onClick={() => simulateAction('ARCHIVE')} className="p-4 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs tracking-widest transition-colors text-left">
                  &gt; AUTHORIZE ARCHIVE (OFFLINE)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 flex flex-col items-start justify-center">
      <div className={`text-4xl font-black mb-1 ${color}`}>{value}</div>
      <div className="text-[10px] text-neutral-500 font-mono tracking-[0.2em]">{label}</div>
    </div>
  );
}

function LifecycleBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: 'text-green-500 border-green-500/30',
    COOLING: 'text-yellow-500 border-yellow-500/30',
    ARCHIVED: 'text-neutral-500 border-neutral-500/30',
    REVIVED: 'text-blue-500 border-blue-500/30',
  };
  const style = styles[status] || styles.ACTIVE;
  return (
    <span className={`text-[10px] px-2 py-1 border ${style} font-mono tracking-widest uppercase`}>
      {status}
    </span>
  );
}

function getVitalityColor(vitality: number) {
  if (vitality > 75) return 'bg-green-500';
  if (vitality > 30) return 'bg-yellow-500';
  return 'bg-red-500';
}

function EventIcon({ type }: { type: string }) {
  if (type === 'command') return <span className="text-red-500">▶</span>;
  if (type === 'revive') return <span className="text-blue-500">↑</span>;
  if (type === 'cooling') return <span className="text-yellow-500">↓</span>;
  if (type === 'archive') return <span className="text-neutral-500">■</span>;
  if (type === 'new') return <span className="text-green-500">+</span>;
  return <span className="text-purple-500">•</span>;
}
