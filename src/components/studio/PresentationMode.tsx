"use client";

import { useState, useEffect } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { X, ChevronLeft, ChevronRight, LayoutTemplate, MessageSquare, Play } from 'lucide-react';

export default function PresentationMode() {
  const { presentation, isPresenting, setIsPresenting, activeSlideId } = useStudioStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    if (isPresenting && presentation) {
      const idx = presentation.slides.findIndex(s => s.id === activeSlideId);
      setCurrentIndex(idx >= 0 ? idx : 0);
      setTimer(0);

      const interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsPresenting(false);
        if (e.key === 'ArrowRight' || e.key === ' ') {
          setCurrentIndex(prev => Math.min(prev + 1, presentation.slides.length - 1));
        }
        if (e.key === 'ArrowLeft') {
          setCurrentIndex(prev => Math.max(prev - 1, 0));
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearInterval(interval);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isPresenting, presentation, activeSlideId, setIsPresenting]);

  if (!isPresenting || !presentation) return null;

  const currentSlide = presentation.slides[currentIndex];
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Fixed 16:9 scaling
  const scale = Math.min(
    (typeof window !== 'undefined' ? window.innerWidth : 1280) / 1280,
    (typeof window !== 'undefined' ? window.innerHeight : 720) / 720
  ) * 0.95;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-fade-in">
      
      {/* Main Slide Viewer */}
      <div 
        className="relative bg-white shadow-2xl transition-transform"
        style={{
          width: 1280,
          height: 720,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          backgroundColor: currentSlide?.background || '#F1ECE3'
        }}
      >
        {currentSlide?.elements.map(el => (
          <div 
            key={el.id}
            style={{
              position: 'absolute',
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              transform: `rotate(${el.rotation || 0}deg)`,
              zIndex: el.zIndex || 0,
              opacity: el.opacity ?? 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {el.type === 'TEXT' && (
              <div style={{
                width: '100%', height: '100%',
                fontSize: `${(el as any).fontSize}px`,
                fontFamily: (el as any).fontFamily,
                fontWeight: (el as any).fontWeight,
                color: (el as any).color,
                textAlign: (el as any).textAlign,
                wordBreak: 'break-word',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: (el as any).textAlign === 'center' ? 'center' : 'flex-start'
              }}>
                {(el as any).content}
              </div>
            )}
            {el.type === 'SHAPE' && (
              <div style={{
                width: '100%', height: '100%',
                backgroundColor: (el as any).fill,
                border: (el as any).strokeWidth > 0 ? `${(el as any).strokeWidth}px solid ${(el as any).stroke}` : 'none',
                borderRadius: (el as any).cornerRadius ? `${(el as any).cornerRadius}px` : 0
              }} />
            )}
            {el.type === 'IMAGE' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={(el as any).url} alt="" style={{ width: '100%', height: '100%', objectFit: (el as any).crop ? 'none' : 'contain' }} />
            )}
          </div>
        ))}
      </div>

      {/* Speaker Notes Overlay (Optional) */}
      {showNotes && (
        <div className="absolute right-4 top-4 bottom-24 w-80 bg-surface/90 backdrop-blur border border-border rounded-lg shadow-2xl p-6 flex flex-col gap-4 animate-fade-left text-text">
          <div className="flex items-center gap-2 font-bold border-b border-border pb-2">
            <MessageSquare size={16} className="text-accent" /> Speaker Notes
          </div>
          <div className="flex-1 overflow-auto text-sm leading-relaxed whitespace-pre-wrap">
            {currentSlide?.speakerNotes || <span className="text-textDim italic">No notes for this slide.</span>}
          </div>
        </div>
      )}

      {/* Control Bar (Hover triggers visibility, but let's make it always visible for simplicity, just translucent) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-surface/80 backdrop-blur-md px-6 py-3 rounded-full border border-border shadow-2xl transition-opacity opacity-20 hover:opacity-100 group">
        
        <div className="flex items-center gap-1 font-mono text-sm font-bold text-textDim w-16">
          <span className="text-text">{currentIndex + 1}</span> / {presentation.slides.length}
        </div>

        <div className="h-6 w-px bg-border"></div>

        <div className="flex items-center gap-2 text-text">
          <button 
            onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
            className="p-2 hover:bg-surface2 rounded-full transition-colors disabled:opacity-30"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setCurrentIndex(prev => Math.min(prev + 1, presentation.slides.length - 1))}
            disabled={currentIndex === presentation.slides.length - 1}
            className="p-2 hover:bg-surface2 rounded-full transition-colors disabled:opacity-30"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="h-6 w-px bg-border"></div>

        <div className="flex items-center gap-2 font-mono text-sm font-bold text-accent w-16 justify-center">
          {formatTime(timer)}
        </div>

        <div className="h-6 w-px bg-border"></div>

        <button 
          onClick={() => setShowNotes(!showNotes)}
          className={`p-2 rounded-full transition-colors ${showNotes ? 'bg-accent text-bg' : 'text-textDim hover:text-text hover:bg-surface2'}`}
          title="Toggle Speaker Notes"
        >
          <LayoutTemplate size={18} />
        </button>

        <button 
          onClick={() => setIsPresenting(false)}
          className="p-2 text-textDim hover:text-danger hover:bg-danger/10 rounded-full transition-colors ml-2"
          title="Exit Presentation (Esc)"
        >
          <X size={18} />
        </button>

      </div>
    </div>
  );
}
