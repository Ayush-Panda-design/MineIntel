"use client";

import { useState } from 'react';
import { Type, Image as ImageIcon, Square, Minus, MoveUpRight, Table, BarChart3, MessageSquare, Sparkles, ImagePlus } from 'lucide-react';
import { useStudioStore } from '@/store/useStudioStore';
import GenerateSlideModal from './ai/GenerateSlideModal';
import AIIllustrationModal from './ai/AIIllustrationModal';

export default function StudioBottomBar() {
  const { addElement, activeSlideId, presentation } = useStudioStore();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isIllustrationModalOpen, setIsIllustrationModalOpen] = useState(false);

  const handleAddText = () => {
    if (!activeSlideId || !presentation) return;
    const slide = presentation.slides.find(s => s.id === activeSlideId);
    if (!slide) return;
    const maxZ = Math.max(0, ...slide.elements.map(e => e.zIndex || 0));

    addElement(activeSlideId, {
      id: `el-${Math.random().toString(36).substr(2, 9)}`,
      type: 'TEXT',
      content: 'New Text',
      x: 100,
      y: 100,
      width: 400,
      height: 60,
      rotation: 0,
      zIndex: maxZ + 1,
      fontSize: 32,
      fontFamily: 'Space Grotesk',
      fontWeight: 'bold',
      color: '#201B14',
      textAlign: 'left'
    });
  };

  const handleAddShape = () => {
    if (!activeSlideId || !presentation) return;
    const slide = presentation.slides.find(s => s.id === activeSlideId);
    if (!slide) return;
    const maxZ = Math.max(0, ...slide.elements.map(e => e.zIndex || 0));

    addElement(activeSlideId, {
      id: `el-${Math.random().toString(36).substr(2, 9)}`,
      type: 'SHAPE',
      shapeType: 'rect',
      fill: '#B5652F',
      stroke: 'none',
      strokeWidth: 0,
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      rotation: 0,
      zIndex: maxZ + 1
    });
  };

  return (
    <div className="h-14 border-t border-border bg-surface flex items-center justify-center shrink-0 z-10">
      <div className="flex items-center gap-1 bg-surface2 p-1 rounded-lg border border-border shadow-sm">
        <ToolbarButton icon={<Type size={18} />} label="Text" onClick={handleAddText} />
        <ToolbarButton icon={<ImageIcon size={18} />} label="Image" />
        <ToolbarButton icon={<Square size={18} />} label="Shape" onClick={handleAddShape} />
        <ToolbarButton icon={<Minus size={18} />} label="Line" />
        <ToolbarButton icon={<MoveUpRight size={18} />} label="Arrow" />
        
        <div className="w-px h-6 bg-border mx-1"></div>
        
        <ToolbarButton icon={<Table size={18} />} label="Table" />
        <ToolbarButton icon={<BarChart3 size={18} />} label="Chart" />
        
        <div className="w-px h-6 bg-border mx-1"></div>
        
        <ToolbarButton icon={<MessageSquare size={18} />} label="Comment" />
        
        <div className="w-px h-6 bg-border mx-1"></div>

        <button 
          onClick={() => setIsIllustrationModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 ml-1 bg-accent/5 text-accent hover:bg-accent/10 rounded-md transition-colors text-sm font-bold border border-accent/20"
        >
          <ImagePlus size={16} /> AI Asset
        </button>

        <button 
          onClick={() => setIsGenerateModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 ml-1 bg-accent/10 text-accent hover:bg-accent/20 rounded-md transition-colors text-sm font-bold"
        >
          <Sparkles size={16} /> AI Slide
        </button>
      </div>

      {isGenerateModalOpen && (
        <GenerateSlideModal 
          isOpen={isGenerateModalOpen} 
          onClose={() => setIsGenerateModalOpen(false)} 
        />
      )}

      {isIllustrationModalOpen && (
        <AIIllustrationModal
          isOpen={isIllustrationModalOpen}
          onClose={() => setIsIllustrationModalOpen(false)}
        />
      )}
    </div>
  );
}

function ToolbarButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-2 text-textDim hover:text-text hover:bg-surface rounded-md transition-colors flex flex-col items-center justify-center gap-1 w-12" 
      title={label}
    >
      {icon}
    </button>
  );
}
