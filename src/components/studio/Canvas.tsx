"use client";

import { useState, useEffect, useRef } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { Rnd } from 'react-rnd';
import { SlideElement, TextElement, ShapeElement } from '@/types/studio';

export default function Canvas() {
  const { 
    presentation, activeSlideId, zoom, selectedElementIds, 
    setSelectedElementIds, updateElement, undo, redo, copySelected, 
    paste, duplicateSelected, deleteSelected, moveSelected, saveHistory
  } = useStudioStore();
  
  const activeSlide = presentation?.slides.find(s => s.id === activeSlideId);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmd = isMac ? e.metaKey : e.ctrlKey;

      if (cmd && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if (cmd && e.key.toLowerCase() === 'c') { e.preventDefault(); copySelected(); }
      if (cmd && e.key.toLowerCase() === 'v') { e.preventDefault(); paste(); }
      if (cmd && e.key.toLowerCase() === 'd') { e.preventDefault(); duplicateSelected(); }
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteSelected(); }

      const moveAmount = e.shiftKey ? 10 : 1;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        saveHistory(); // Optional: save history before a burst of moves
        moveSelected(
          e.key === 'ArrowLeft' ? -moveAmount : e.key === 'ArrowRight' ? moveAmount : 0,
          e.key === 'ArrowUp' ? -moveAmount : e.key === 'ArrowDown' ? moveAmount : 0
        );
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, copySelected, paste, duplicateSelected, deleteSelected, moveSelected, saveHistory]);

  if (!activeSlide) return <div className="text-textDim p-4 text-center">No slide selected</div>;

  const CANVAS_WIDTH = 1280;
  const CANVAS_HEIGHT = 720;

  // Sort elements by zIndex so they render in correct order
  const elements = activeSlide.elements || [];
  const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  const { addElement } = useStudioStore();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'asset' && activeSlideId) {
        
        // Calculate drop position relative to canvas
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;

        addElement(activeSlideId, {
          id: `el-${Date.now()}`,
          type: 'IMAGE',
          url: data.url,
          assetId: data.id,
          x: x - 100, // offset by half width to center on cursor
          y: y - 100, // offset by half height
          width: 200,
          height: 200,
          rotation: 0,
          zIndex: Math.max(0, ...(activeSlide.elements.map(el => el.zIndex || 0))) + 1
        });
      }
    } catch (err) {
      console.error("Drop parsing failed", err);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-surface relative flex items-center justify-center p-8 outline-none" tabIndex={0}>
      <div 
        className="bg-white shadow-2xl relative ring-1 ring-border/50 transition-transform origin-center" 
        style={{ 
          width: CANVAS_WIDTH * zoom, 
          height: CANVAS_HEIGHT * zoom,
          backgroundColor: activeSlide.background || '#FFFFFF'
        }}
        onMouseDown={() => setSelectedElementIds([])}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        ref={containerRef}
      >
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: CANVAS_WIDTH, height: CANVAS_HEIGHT, position: 'absolute', top: 0, left: 0 }}>
          {sortedElements.map(el => (
             <ElementRenderer 
               key={el.id} 
               element={el} 
               slideId={activeSlide.id}
               isSelected={selectedElementIds.includes(el.id)}
               onSelect={(e) => {
                 e.stopPropagation();
                 if (e.shiftKey) {
                   if (selectedElementIds.includes(el.id)) {
                     setSelectedElementIds(selectedElementIds.filter(id => id !== el.id));
                   } else {
                     setSelectedElementIds([...selectedElementIds, el.id]);
                   }
                 } else {
                   setSelectedElementIds([el.id]);
                 }
               }}
               onUpdate={(updates) => updateElement(activeSlide.id, el.id, updates)}
             />
          ))}
        </div>
      </div>
    </div>
  );
}

function ElementRenderer({ 
  element, 
  slideId, 
  isSelected, 
  onSelect, 
  onUpdate 
}: { 
  element: SlideElement, 
  slideId: string, 
  isSelected: boolean,
  onSelect: (e: React.MouseEvent) => void,
  onUpdate: (updates: Partial<SlideElement>) => void
}) {

  const { saveHistory, zoom, setSelectedElementIds } = useStudioStore();

  return (
    <Rnd
      scale={zoom}
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      onDragStart={(e) => {
        saveHistory();
        if (!isSelected) {
          setSelectedElementIds([element.id]);
        }
      }}
      onDragStop={(e, d) => {
        onUpdate({ x: d.x, y: d.y });
      }}
      onResizeStart={() => saveHistory()}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          ...position,
        });
      }}
      bounds="parent"
      className={`${isSelected ? 'ring-2 ring-accent ring-offset-1 z-50' : 'hover:ring-1 hover:ring-border'}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: element.zIndex || 0,
        opacity: element.opacity ?? 1,
      }}
    >
      <div 
        className="w-full h-full cursor-pointer relative"
        style={{
          transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined
        }}
        onMouseDown={(e) => {
          onSelect(e);
        }}
      >
        {element.type === 'TEXT' && <TextRenderer element={element as TextElement} onUpdate={onUpdate} isSelected={isSelected} />}
        {element.type === 'SHAPE' && <ShapeRenderer element={element as ShapeElement} />}
        {element.type === 'IMAGE' && <ImageRenderer element={element as any} />}
      </div>
    </Rnd>
  );
}

function TextRenderer({ element, onUpdate, isSelected }: { element: TextElement, onUpdate: (u: Partial<TextElement>) => void, isSelected: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content);
  const { saveHistory } = useStudioStore();

  useEffect(() => {
    if (!isSelected) setIsEditing(false);
  }, [isSelected]);

  const handleBlur = () => {
    setIsEditing(false);
    if (content !== element.content) {
      saveHistory();
      onUpdate({ content });
    }
  };

  const textStyles = {
    width: '100%',
    height: '100%',
    fontSize: `${element.fontSize}px`,
    fontFamily: element.fontFamily,
    fontWeight: element.fontWeight,
    color: element.color,
    textAlign: element.textAlign as any,
    lineHeight: element.lineHeight || 1.2,
    letterSpacing: `${element.letterSpacing || 0}px`,
  };

  if (isEditing) {
    return (
      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            e.currentTarget.blur();
          }
          e.stopPropagation(); // prevent global shortcuts
        }}
        style={{
          ...textStyles,
          background: 'transparent',
          border: '1px solid #B5652F',
          outline: 'none',
          resize: 'none',
          padding: 0,
          margin: 0,
          overflow: 'hidden'
        }}
      />
    );
  }

  return (
    <div 
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      style={{
        ...textStyles,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: element.textAlign === 'center' ? 'center' : 'flex-start',
        wordBreak: 'break-word',
      }}
    >
      {element.content}
    </div>
  );
}

function ShapeRenderer({ element }: { element: ShapeElement }) {
  if (element.shapeType === 'rect') {
    return (
      <div 
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: element.fill,
          border: element.strokeWidth > 0 ? `${element.strokeWidth}px solid ${element.stroke}` : 'none',
          borderRadius: element.cornerRadius ? `${element.cornerRadius}px` : 0
        }}
      />
    );
  }
  return null;
}

function ImageRenderer({ element }: { element: any }) {
  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={element.url} 
        alt="Asset" 
        className="w-full h-full"
        style={{ objectFit: element.crop ? 'none' : 'contain' }}
      />
    </div>
  );
}
