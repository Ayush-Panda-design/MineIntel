"use client";

import { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { useStudioStore } from '@/store/useStudioStore';

interface GenerateSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GenerateSlideModal({ isOpen, onClose }: GenerateSlideModalProps) {
  const [purpose, setPurpose] = useState('');
  const [visualDirection, setVisualDirection] = useState('');
  const [density, setDensity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [visualType, setVisualType] = useState<string>('SIH Title Slide (1st Slide)');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentUser, createSlide, activeSlideId, replaceSlideElements } = useStudioStore();

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!purpose.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      // Create a blank draft slide first
      createSlide();
      
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'generateSlide',
          userId: currentUser.id,
          payload: {
            purpose,
            visualDirection,
            density,
            visualType,
            style: 'MineIntel Design System'
          }
        })
      });

      const { jobId } = await res.json();

      const poll = setInterval(async () => {
        const statusRes = await fetch(`/api/ai?id=${jobId}`);
        const job = await statusRes.json();
        
        if (job.status === 'completed') {
          clearInterval(poll);
          setIsGenerating(false);
          const result = job.result;
          
          // We must grab the newly created activeSlideId from the store
          // Since createSlide is synchronous, activeSlideId updates.
          // Wait, doing this strictly requires us to get the fresh store state.
          const currentSlideId = useStudioStore.getState().activeSlideId;
          
          if (currentSlideId) {
            replaceSlideElements(currentSlideId, result.elements);
            
            // Post a system message in the chat explaining it
            useStudioStore.getState().addComment(currentSlideId, `AI Generator: ${result.explanation}`);
          }
          onClose();
          
        } else if (job.status === 'failed' || job.status === 'timeout') {
          clearInterval(poll);
          setIsGenerating(false);
          setError(`Error generating slide: ${job.error}`);
        }
      }, 1000);

    } catch (err) {
      setIsGenerating(false);
      setError('Network error connecting to AI generator.');
    }
  };

  return (
    <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between p-5 border-b border-border bg-surface2">
          <div className="flex items-center gap-2 text-accent font-bold text-lg">
            <Sparkles size={20} /> Generate Slide
          </div>
          <button onClick={onClose} disabled={isGenerating} className="text-textDim hover:text-text disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-text">Slide Template</label>
            <p className="text-xs text-textDim -mt-2 mb-1">Select an SIH-optimized layout pattern.</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'SIH Title Slide (1st Slide)', icon: '🏛️' },
                { id: 'Problem/Solution', icon: '🎯' },
                { id: 'System Architecture', icon: '⚙️' },
                { id: 'Data Flow Pipeline', icon: '🔄' },
                { id: 'Feasibility Grid', icon: '📊' },
                { id: 'Business & Impact', icon: '📈' },
                { id: 'Sample Scenario', icon: '🚶' },
                { id: 'Custom Blank', icon: '✨' }
              ].map(tpl => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setVisualType(tpl.id)}
                  disabled={isGenerating}
                  className={`p-3 rounded-lg border-2 text-left flex items-center gap-2 transition-all ${visualType === tpl.id ? 'border-accent bg-accent/5' : 'border-border bg-surface2 text-textDim hover:border-textDim'}`}
                >
                  <span className="text-lg">{tpl.icon}</span>
                  <span className="text-xs font-bold text-text">{tpl.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text">Slide Content / Data <span className="text-accent">*</span></label>
            <textarea 
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              disabled={isGenerating}
              placeholder="e.g. Map the AWS cloud functions to the MongoDB database..."
              className="w-full bg-surface2 border border-border rounded-md p-3 text-sm outline-none focus:border-accent text-text h-24 resize-none"
            />
          </div>

          {error && <div className="text-sm font-medium text-danger bg-danger/10 p-3 rounded">{error}</div>}

        </div>

        <div className="p-5 border-t border-border bg-surface2 flex justify-between items-center">
          <span className="text-xs font-medium text-textDim flex items-center gap-1"><Sparkles size={12}/> Design system strictly enforced</span>
          <div className="flex gap-3">
            <button onClick={onClose} disabled={isGenerating} className="px-4 py-2 text-sm font-bold text-textDim hover:text-text transition-colors">Cancel</button>
            <button 
              onClick={handleGenerate}
              disabled={!purpose.trim() || isGenerating}
              className="px-6 py-2 bg-accent text-bg text-sm font-bold rounded-lg shadow-md hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating ? <><Loader2 size={16} className="animate-spin" /> Generating Plan & Assets...</> : 'Generate Elements'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
