"use client";

import { useState } from 'react';
import { Sparkles, X, Loader2, Image as ImageIcon, Download } from 'lucide-react';
import { useStudioStore } from '@/store/useStudioStore';

interface AIIllustrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIIllustrationModal({ isOpen, onClose }: AIIllustrationModalProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [style, setStyle] = useState('Technical');
  const [isTransparent, setIsTransparent] = useState(false);
  
  const [status, setStatus] = useState<'idle' | 'generating' | 'preview'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ url: string, explanation: string } | null>(null);

  const { currentUser, activeSlideId, addElement, addAsset } = useStudioStore();

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setStatus('generating');
    setError(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'generateImage',
          userId: currentUser.id,
          payload: {
            prompt,
            aspectRatio,
            style,
            isTransparent,
            visualType: 'Illustration'
          }
        })
      });

      const { jobId } = await res.json();

      const poll = setInterval(async () => {
        const statusRes = await fetch(`/api/ai?id=${jobId}`);
        const job = await statusRes.json();
        
        if (job.status === 'completed') {
          clearInterval(poll);
          setPreviewData(job.result);
          setStatus('preview');
        } else if (job.status === 'failed' || job.status === 'timeout') {
          clearInterval(poll);
          setStatus('idle');
          setError(`Error generating illustration: ${job.error}`);
        }
      }, 1000);

    } catch (err) {
      setStatus('idle');
      setError('Network error connecting to AI generator.');
    }
  };

  const handleUseInSlide = () => {
    if (!previewData || !activeSlideId) return;
    
    // Save to Asset Library
    const assetId = `asset-${Date.now()}`;
    addAsset({
      id: assetId,
      name: `AI Gen: ${prompt.substring(0, 20)}...`,
      type: 'image',
      source: 'ai_generated',
      prompt,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      thumbnail: previewData.url,
      fullAsset: previewData.url,
      tags: ['ai-generated', style.toLowerCase()]
    });

    // Add to Slide
    addElement(activeSlideId, {
      id: `el-${Date.now()}`,
      type: 'IMAGE',
      url: previewData.url,
      assetId,
      x: 100,
      y: 100,
      width: 400,
      height: 300,
      rotation: 0,
      zIndex: 10
    });

    onClose();
  };

  const handleSaveToAssets = () => {
    if (!previewData) return;
    const assetId = `asset-${Date.now()}`;
    addAsset({
      id: assetId,
      name: `AI Gen: ${prompt.substring(0, 20)}...`,
      type: 'image',
      source: 'ai_generated',
      prompt,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      thumbnail: previewData.url,
      fullAsset: previewData.url,
      tags: ['ai-generated', style.toLowerCase()]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex h-[600px]">
        
        {/* Left Config Panel */}
        <div className="w-1/2 border-r border-border flex flex-col h-full bg-surface2">
          <div className="flex items-center gap-2 p-5 border-b border-border text-accent font-bold text-lg">
            <ImageIcon size={20} /> AI Illustration Studio
          </div>

          <div className="p-6 flex flex-col gap-5 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text">Illustration Prompt <span className="text-accent">*</span></label>
              <textarea 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                disabled={status === 'generating'}
                placeholder="e.g. Create a clean technical illustration showing geological reports flowing into an AI evidence system."
                className="w-full bg-surface border border-border rounded-lg p-3 text-sm outline-none focus:border-accent text-text resize-none h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text">Visual Style</label>
                <select 
                  value={style}
                  onChange={e => setStyle(e.target.value)}
                  disabled={status === 'generating'}
                  className="w-full bg-surface border border-border rounded-lg p-3 text-sm outline-none text-text appearance-none"
                >
                  <option value="Technical">Technical Diagram</option>
                  <option value="Isometric">Isometric</option>
                  <option value="Editorial">Editorial</option>
                  <option value="Minimal">Minimal Line Art</option>
                  <option value="Realistic">Realistic</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text">Aspect Ratio</label>
                <select 
                  value={aspectRatio}
                  onChange={e => setAspectRatio(e.target.value)}
                  disabled={status === 'generating'}
                  className="w-full bg-surface border border-border rounded-lg p-3 text-sm outline-none text-text appearance-none"
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:3">4:3 (Standard)</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={isTransparent} onChange={e => setIsTransparent(e.target.checked)} className="accent-accent w-4 h-4" />
              <span className="text-sm text-textDim font-medium">Transparent Background (if supported)</span>
            </label>

            {error && <div className="text-sm font-medium text-danger bg-danger/10 p-3 rounded mt-2">{error}</div>}
          </div>

          <div className="p-5 border-t border-border flex justify-between items-center bg-surface2">
            <button onClick={onClose} disabled={status === 'generating'} className="px-4 py-2 text-sm font-bold text-textDim hover:text-text transition-colors">Cancel</button>
            <button 
              onClick={handleGenerate}
              disabled={!prompt.trim() || status === 'generating'}
              className="px-6 py-2 bg-accent text-bg text-sm font-bold rounded-lg shadow-md hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {status === 'generating' ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : 'Generate Illustration'}
            </button>
          </div>
        </div>

        {/* Right Preview Panel */}
        <div className="w-1/2 flex flex-col h-full bg-surface">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <span className="font-bold text-text text-lg">Preview</span>
            <button onClick={onClose} disabled={status === 'generating'} className="text-textDim hover:text-text disabled:opacity-50">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-6 flex flex-col items-center justify-center bg-[url('/grid-pattern.png')] bg-repeat relative">
            
            {status === 'idle' && (
              <div className="text-textDim text-sm flex flex-col items-center gap-2">
                <ImageIcon size={32} className="opacity-50" />
                Describe an illustration to preview it here.
              </div>
            )}

            {status === 'generating' && (
              <div className="text-accent flex flex-col items-center gap-4 animate-pulse">
                <Sparkles size={32} />
                <span className="text-sm font-bold">Painting via MineIntel AI Engine...</span>
              </div>
            )}

            {status === 'preview' && previewData && (
              <div className="w-full flex flex-col items-center gap-4 animate-fade-up">
                <div className="w-full aspect-video border-2 border-border/50 rounded-lg overflow-hidden shadow-xl bg-surface2 relative">
                  {/* Rendering standard HTML img element */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewData.url} alt="Generated Asset" className="w-full h-full object-contain" />
                </div>
                <p className="text-xs text-textDim text-center px-4">
                  <strong className="text-accent">AI Asset Agent:</strong> {previewData.explanation}
                </p>
              </div>
            )}

          </div>

          {status === 'preview' && (
            <div className="p-5 border-t border-border flex justify-between gap-3 bg-surface">
              <button 
                onClick={handleGenerate}
                className="px-4 py-2 border border-border text-text text-sm font-bold rounded-lg hover:bg-surface2 transition-colors flex-1"
              >
                Regenerate
              </button>
              <button 
                onClick={handleSaveToAssets}
                className="px-4 py-2 border border-accent text-accent text-sm font-bold rounded-lg hover:bg-accent/10 transition-colors flex-1 flex justify-center items-center gap-2"
              >
                <Download size={14} /> Save to Assets
              </button>
              <button 
                onClick={handleUseInSlide}
                className="px-6 py-2 bg-accent text-bg text-sm font-bold rounded-lg shadow-md hover:bg-accent/90 transition-all flex-[2] flex justify-center items-center"
              >
                Use in Slide
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
