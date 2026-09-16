"use client";

import { useState } from 'react';
import { Undo, Redo, Play, Share, Download, Settings, Users, ArrowLeft } from 'lucide-react';
import { useStudioStore } from '@/store/useStudioStore';
import Link from 'next/link';
import ExportModal from './ExportModal';

export default function StudioHeader() {
  const { presentation, undo, redo, history } = useStudioStore();
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  return (
    <>
      <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg text-text tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity" title="Back to Explainer">
            <ArrowLeft size={16} className="text-textDim mr-1" /> MineIntel <span className="font-normal text-textDim">Studio</span>
          </Link>
          <div className="w-px h-6 bg-border"></div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-text">{presentation?.name}</span>
            <span className="text-xs text-textDim">Saved to cloud</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={undo}
            disabled={history.past.length === 0}
            className="p-2 text-textDim hover:text-text hover:bg-surface2 rounded transition-colors disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={18} />
          </button>
          <button 
            onClick={redo}
            disabled={history.future.length === 0}
            className="p-2 text-textDim hover:text-text hover:bg-surface2 rounded transition-colors disabled:opacity-30"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo size={18} />
          </button>
          
          <div className="w-px h-6 bg-border mx-2"></div>
          
          <div className="flex -space-x-2 mr-2">
            {presentation?.team.filter(u => u.isOnline).map((user, idx) => (
              <div 
                key={user.id} 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-surface relative"
                style={{ backgroundColor: user.color, color: '#fff', zIndex: 30 - idx }}
                title={`${user.name} (${user.role})`}
              >
                {user.initials}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent2 border-2 border-surface rounded-full"></div>
              </div>
            ))}
          </div>
          
          <div className="w-px h-6 bg-border mx-2"></div>
          
          <button 
            onClick={() => useStudioStore.getState().setIsPresenting(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-text hover:bg-surface2 rounded transition-colors"
          >
            <Play size={16} /> Present
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-text hover:bg-surface2 rounded transition-colors">
            <Share size={16} /> Share
          </button>
          
          <button 
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-bg bg-text hover:bg-text/90 rounded transition-colors ml-2"
          >
            <Download size={16} /> Export
          </button>
          
          <div className="w-px h-6 bg-border mx-2"></div>
          
          <button className="p-2 text-textDim hover:text-text hover:bg-surface2 rounded transition-colors"><Settings size={18} /></button>
        </div>
      </header>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </>
  );
}
