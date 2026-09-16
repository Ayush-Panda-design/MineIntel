"use client";

import { useState, useRef, useEffect } from 'react';
import { Sparkles, AlignLeft, AlignCenter, AlignRight, AlignJustify, Layers, MessageSquare, CornerDownRight, Check, Undo2 } from 'lucide-react';
import { useStudioStore } from '@/store/useStudioStore';
import { SlideElement, TextElement, ShapeElement } from '@/types/studio';

interface AiMessage {
  id: string;
  role: 'user' | 'agent';
  text: string;
  proposedElements?: SlideElement[]; // AI returns new layout
  applied?: boolean; // Whether the user accepted it
}

export default function StudioSidebarRight() {
  const [activeTab, setActiveTab] = useState<'properties' | 'comments' | 'ai'>('properties');
  const [newCommentText, setNewCommentText] = useState('');
  
  // AI State
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    { id: 'm-0', role: 'agent', text: 'I am the **Slide Agent**. I coordinate with the Design Agent and Asset Agent to modify this specific slide.\n\nTell me what to change, like:\n*"Make this less text-heavy"*' }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const aiScrollRef = useRef<HTMLDivElement>(null);

  const { presentation, currentUser, activeSlideId, selectedElementIds, updateSelectedElements, bringForward, sendBackward, bringToFront, sendToBack, addComment, resolveComment, replaceSlideElements, undo } = useStudioStore();
  
  const activeSlide = presentation?.slides.find(s => s.id === activeSlideId);
  const selectedElements = activeSlide?.elements.filter(el => selectedElementIds.includes(el.id)) || [];
  
  const el = selectedElements[0];

  const handleUpdate = (updates: Partial<SlideElement>) => {
    updateSelectedElements(updates);
  };

  const slideComments = presentation?.comments.filter(c => c.targetId === activeSlideId && !c.resolved) || [];

  useEffect(() => {
    if (aiScrollRef.current) {
      aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight;
    }
  }, [aiMessages, isAiThinking]);

  const handleAiSubmit = async () => {
    if (!aiInput.trim() || !activeSlideId) return;
    
    const instruction = aiInput.trim();
    const userMsg: AiMessage = { id: `m-${Date.now()}`, role: 'user', text: instruction };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setIsAiThinking(true);

    try {
      // 1. Submit job to backend queue
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'modifySlide',
          userId: currentUser.id,
          slideId: activeSlideId,
          payload: {
            slideState: activeSlide,
            instruction: instruction
          }
        })
      });

      const { jobId } = await res.json();

      // 2. Poll job status
      const poll = setInterval(async () => {
        const statusRes = await fetch(`/api/ai?id=${jobId}`);
        const job = await statusRes.json();
        
        if (job.status === 'completed') {
          clearInterval(poll);
          setIsAiThinking(false);
          const result = job.result;
          
          setAiMessages(prev => [...prev, {
            id: `m-${Date.now()}`,
            role: 'agent',
            text: result.explanation || "I modified the slide securely via the backend AI router.",
            proposedElements: result.elements,
            applied: false
          }]);
        } else if (job.status === 'failed' || job.status === 'timeout') {
          clearInterval(poll);
          setIsAiThinking(false);
          setAiMessages(prev => [...prev, {
            id: `m-${Date.now()}`,
            role: 'agent',
            text: `Error processing request: ${job.error}`,
          }]);
        }
      }, 1000);

    } catch (err) {
      setIsAiThinking(false);
      console.error(err);
      setAiMessages(prev => [...prev, {
        id: `m-${Date.now()}`,
        role: 'agent',
        text: `Network error connecting to AI service.`,
      }]);
    }
  };

  const applyAiElements = (msgId: string, elements: SlideElement[]) => {
    if (!activeSlideId) return;
    replaceSlideElements(activeSlideId, elements);
    setAiMessages(prev => prev.map(m => m.id === msgId ? { ...m, applied: true } : m));
  };

  const undoAiElements = (msgId: string) => {
    undo();
    setAiMessages(prev => prev.map(m => m.id === msgId ? { ...m, applied: false } : m));
  };

  return (
    <div className="w-80 border-l border-border bg-surface flex flex-col shrink-0">
      
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button onClick={() => setActiveTab('properties')} className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${activeTab === 'properties' ? 'border-accent text-accent' : 'border-transparent text-textDim hover:text-text'}`}>
          Config
        </button>
        <button onClick={() => setActiveTab('comments')} className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${activeTab === 'comments' ? 'border-accent text-accent' : 'border-transparent text-textDim hover:text-text'} relative`}>
          <MessageSquare size={14} className="inline mr-1 mb-0.5" />
          {slideComments.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full"></span>}
        </button>
        <button onClick={() => setActiveTab('ai')} className={`flex flex-1 items-center justify-center gap-2 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${activeTab === 'ai' ? 'border-accent text-accent' : 'border-transparent text-textDim hover:text-text'}`}>
          <Sparkles size={14}/> Slide AI
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'properties' && el && (
          <div className="flex flex-col p-4 gap-6">
            
            {/* Position & Size */}
            <div className="flex flex-col gap-3">
              <div className="text-xs font-bold text-textDim uppercase tracking-wider">Transform</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 bg-surface2 border border-border rounded px-2 py-1">
                  <span className="text-textDim text-xs font-mono">X</span>
                  <input type="number" value={Math.round(el.x)} onChange={e => handleUpdate({ x: parseInt(e.target.value) })} className="w-full bg-transparent outline-none text-sm text-text font-mono" />
                </div>
                <div className="flex items-center gap-2 bg-surface2 border border-border rounded px-2 py-1">
                  <span className="text-textDim text-xs font-mono">Y</span>
                  <input type="number" value={Math.round(el.y)} onChange={e => handleUpdate({ y: parseInt(e.target.value) })} className="w-full bg-transparent outline-none text-sm text-text font-mono" />
                </div>
                <div className="flex items-center gap-2 bg-surface2 border border-border rounded px-2 py-1">
                  <span className="text-textDim text-xs font-mono">W</span>
                  <input type="number" value={Math.round(el.width)} onChange={e => handleUpdate({ width: parseInt(e.target.value) })} className="w-full bg-transparent outline-none text-sm text-text font-mono" />
                </div>
                <div className="flex items-center gap-2 bg-surface2 border border-border rounded px-2 py-1">
                  <span className="text-textDim text-xs font-mono">H</span>
                  <input type="number" value={Math.round(el.height)} onChange={e => handleUpdate({ height: parseInt(e.target.value) })} className="w-full bg-transparent outline-none text-sm text-text font-mono" />
                </div>
              </div>
              <div className="flex items-center gap-2 bg-surface2 border border-border rounded px-2 py-1 w-1/2">
                <span className="text-textDim text-xs font-mono">R°</span>
                <input type="number" value={Math.round(el.rotation || 0)} onChange={e => handleUpdate({ rotation: parseInt(e.target.value) })} className="w-full bg-transparent outline-none text-sm text-text font-mono" />
              </div>
              
              <div className="flex gap-2 mt-2">
                <button onClick={bringForward} className="flex-1 py-1 text-xs border border-border rounded hover:bg-surface2 text-textDim hover:text-text">Forward</button>
                <button onClick={sendBackward} className="flex-1 py-1 text-xs border border-border rounded hover:bg-surface2 text-textDim hover:text-text">Backward</button>
              </div>
            </div>

            <div className="w-full h-px bg-border"></div>

            {/* Typography */}
            {el.type === 'TEXT' && (
              <>
                <div className="flex flex-col gap-3">
                  <div className="text-xs font-bold text-textDim uppercase tracking-wider">Typography</div>
                  <select 
                    value={(el as TextElement).fontFamily} 
                    onChange={e => handleUpdate({ fontFamily: e.target.value })}
                    className="w-full bg-surface2 border border-border rounded px-2 py-1.5 text-sm outline-none text-text"
                  >
                    <option value="Space Grotesk">Space Grotesk</option>
                    <option value="IBM Plex Mono">IBM Plex Mono</option>
                    <option value="sans-serif">Sans-serif</option>
                  </select>
                  
                  <div className="flex gap-2">
                    <select 
                      value={(el as TextElement).fontWeight}
                      onChange={e => handleUpdate({ fontWeight: e.target.value })}
                      className="w-24 bg-surface2 border border-border rounded px-2 py-1.5 text-sm outline-none text-text"
                    >
                      <option value="bold">Bold</option>
                      <option value="medium">Medium</option>
                      <option value="normal">Regular</option>
                    </select>
                    <div className="flex items-center gap-2 bg-surface2 border border-border rounded px-2 py-1 flex-1">
                      <input 
                        type="number" 
                        value={(el as TextElement).fontSize}
                        onChange={e => handleUpdate({ fontSize: parseInt(e.target.value) })}
                        className="w-full bg-transparent outline-none text-sm text-text font-mono" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-1 bg-surface2 p-1 rounded border border-border w-fit">
                    <button onClick={() => handleUpdate({ textAlign: 'left' })} className={`p-1 rounded ${(el as TextElement).textAlign === 'left' ? 'bg-surface text-text' : 'hover:bg-surface text-textDim'}`}><AlignLeft size={16}/></button>
                    <button onClick={() => handleUpdate({ textAlign: 'center' })} className={`p-1 rounded ${(el as TextElement).textAlign === 'center' ? 'bg-surface text-text' : 'hover:bg-surface text-textDim'}`}><AlignCenter size={16}/></button>
                    <button onClick={() => handleUpdate({ textAlign: 'right' })} className={`p-1 rounded ${(el as TextElement).textAlign === 'right' ? 'bg-surface text-text' : 'hover:bg-surface text-textDim'}`}><AlignRight size={16}/></button>
                    <button onClick={() => handleUpdate({ textAlign: 'justify' })} className={`p-1 rounded ${(el as TextElement).textAlign === 'justify' ? 'bg-surface text-text' : 'hover:bg-surface text-textDim'}`}><AlignJustify size={16}/></button>
                  </div>
                </div>
                <div className="w-full h-px bg-border"></div>
              </>
            )}

            {/* Appearance */}
            <div className="flex flex-col gap-3">
              <div className="text-xs font-bold text-textDim uppercase tracking-wider">Appearance</div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-textDim">Color</span>
                <div className="flex items-center gap-2 bg-surface2 border border-border rounded p-1">
                  <div className="w-4 h-4 rounded-sm border border-border/50" style={{ backgroundColor: el.type === 'TEXT' ? (el as TextElement).color : (el as ShapeElement).fill }}></div>
                  <input 
                    type="text" 
                    value={(el.type === 'TEXT' ? (el as TextElement).color : (el as ShapeElement).fill) || ''}
                    onChange={e => {
                      if (el.type === 'TEXT') handleUpdate({ color: e.target.value });
                      else if (el.type === 'SHAPE') handleUpdate({ fill: e.target.value });
                    }}
                    className="w-20 bg-transparent outline-none text-xs text-text font-mono uppercase" 
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'properties' && !el && activeSlide && (
          <div className="p-4 flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-textDim uppercase tracking-wider">Slide Background</label>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded border border-border shrink-0" style={{ backgroundColor: activeSlide.background || '#F1ECE3' }}></div>
                <input 
                  type="text" 
                  value={activeSlide.background || '#F1ECE3'}
                  readOnly
                  className="flex-1 bg-surface2 border border-border rounded text-xs px-2 outline-none font-mono text-textDim"
                />
              </div>
            </div>

            <div className="w-full h-px bg-border"></div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-textDim uppercase tracking-wider">Speaker Notes</label>
                <button 
                  onClick={async () => {
                    const btn = document.getElementById('gen-notes-btn');
                    if (btn) btn.innerHTML = '<span class="animate-pulse">Generating...</span>';
                    
                    try {
                      // Generate notes using AI via the queue manager
                      const prompt = `Generate concise speaker notes for this slide. Do not narrate everything. Return ONLY the text of the notes. \nSlide Data: ${JSON.stringify(activeSlide.elements)}`;
                      const res = await fetch('/api/ai', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'generateText', userId: 'u-1', payload: { prompt } })
                      });
                      
                      const { jobId } = await res.json();
                      
                      const poll = setInterval(async () => {
                        const statusRes = await fetch(`/api/ai?id=${jobId}`);
                        const job = await statusRes.json();
                        
                        if (job.status === 'completed') {
                          clearInterval(poll);
                          if (btn) btn.innerHTML = '✨ Generate';
                          // Update notes
                          let generated = job.result;
                          // Clean up markdown block if present
                          if (generated.startsWith('```')) {
                            generated = generated.replace(/```[a-z]*\n?/g, '').replace(/```/g, '').trim();
                          }
                          useStudioStore.getState().updateSlideNotes(activeSlide.id, generated);
                        } else if (job.status === 'failed') {
                          clearInterval(poll);
                          if (btn) btn.innerHTML = 'Failed';
                        }
                      }, 1000);
                    } catch (e) {
                      if (btn) btn.innerHTML = 'Error';
                    }
                  }}
                  id="gen-notes-btn"
                  className="text-[10px] font-bold text-accent hover:text-accent/80 transition-colors"
                >
                  ✨ Generate
                </button>
              </div>
              <textarea 
                value={activeSlide.speakerNotes || ''}
                onChange={(e) => useStudioStore.getState().updateSlideNotes(activeSlide.id, e.target.value)}
                placeholder="Type speaker notes here..."
                className="w-full h-40 bg-surface2 border border-border rounded-md p-3 text-sm outline-none focus:border-accent text-text resize-none"
              />
              <p className="text-[10px] text-textDim italic mt-1">
                Notes will be visible during Presentation Mode.
              </p>
            </div>

          </div>
        )}

        {activeTab === 'comments' && (
          <div className="flex flex-col h-full bg-surface2">
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
              {slideComments.length === 0 ? (
                <div className="text-center text-textDim text-sm mt-10">No comments on this slide.</div>
              ) : (
                slideComments.map(comment => {
                  const author = presentation?.team.find(u => u.id === comment.userId);
                  return (
                    <div key={comment.id} className="bg-surface border border-border p-3 rounded-lg shadow-sm flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full text-[8px] flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: author?.color }}>
                            {author?.initials}
                          </div>
                          <span className="text-xs font-bold text-text">{author?.name}</span>
                        </div>
                        <span className="text-[10px] text-textDim">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-sm text-text mt-1">{comment.text}</p>
                      
                      {comment.replies && comment.replies.map(reply => {
                        const replyAuthor = presentation?.team.find(u => u.id === reply.userId);
                        return (
                          <div key={reply.id} className="ml-4 pl-3 border-l-2 border-border mt-2 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-textDim">{replyAuthor?.name}</span>
                              <span className="text-[9px] text-textDim/50">{new Date(reply.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p className="text-xs text-text">{reply.text}</p>
                          </div>
                        )
                      })}
                      
                      <div className="flex justify-end mt-2 pt-2 border-t border-border/50 gap-2">
                        <button className="text-xs font-medium text-textDim hover:text-text">Reply</button>
                        <button onClick={() => resolveComment(comment.id)} className="text-xs font-medium text-accent hover:text-accent/80">Resolve</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="p-4 border-t border-border bg-surface">
              <div className="flex flex-col gap-2">
                <textarea 
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  placeholder="Add a comment..." 
                  className="w-full bg-surface2 border border-border rounded-lg p-2 text-sm outline-none focus:border-accent text-text resize-none"
                  rows={2}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (activeSlideId && newCommentText.trim()) {
                        addComment(activeSlideId, newCommentText.trim());
                        setNewCommentText('');
                      }
                    }
                    e.stopPropagation();
                  }}
                />
                <button 
                  onClick={() => {
                    if (activeSlideId && newCommentText.trim()) {
                      addComment(activeSlideId, newCommentText.trim());
                      setNewCommentText('');
                    }
                  }}
                  className="self-end px-3 py-1 bg-accent text-bg text-xs font-bold rounded hover:bg-accent/90"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-full bg-surface">
            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto" ref={aiScrollRef}>
              
              {aiMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.role === 'agent' && <div className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-1"><Sparkles size={10}/> Slide Agent</div>}
                  <div className={`p-3 rounded-lg text-sm whitespace-pre-wrap max-w-[90%] ${msg.role === 'user' ? 'bg-accent text-bg' : 'bg-surface2 border border-border text-text'}`}>
                    {/* Basic markdown-like bold rendering for demo */}
                    {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part.split('*').map((p, j) => j % 2 === 1 ? <em key={j} className="text-textDim">{p}</em> : p)}</span>)}
                  </div>
                  
                  {/* AI Action Panel */}
                  {msg.proposedElements && msg.proposedElements.length > 0 && (
                    <div className="mt-1 w-[90%] bg-surface border border-border rounded-lg overflow-hidden shadow-sm self-start">
                      <div className="bg-surface2 px-3 py-1.5 border-b border-border flex items-center gap-2 text-xs font-medium text-textDim">
                        <Layers size={14} /> Elements Modified
                      </div>
                      <div className="p-3 bg-surface flex justify-end gap-2">
                        {msg.applied ? (
                          <button 
                            onClick={() => undoAiElements(msg.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-text text-xs font-medium hover:bg-surface2 rounded transition-colors"
                          >
                            <Undo2 size={14} /> Undo
                          </button>
                        ) : (
                          <button 
                            onClick={() => applyAiElements(msg.id, msg.proposedElements!)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-bg text-xs font-bold hover:bg-accent/90 rounded transition-colors"
                          >
                            <Check size={14} /> Apply Changes
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isAiThinking && (
                <div className="flex flex-col gap-2 items-start animate-fade-up">
                  <div className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-1"><Sparkles size={10}/> Slide Agent</div>
                  <div className="p-3 rounded-lg text-sm bg-surface2 border border-border text-textDim flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <span className="ml-2 text-xs">Consulting Design Agent...</span>
                  </div>
                </div>
              )}

            </div>

            <div className="p-4 border-t border-border bg-surface">
              <div className="relative">
                <input 
                  type="text" 
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAiSubmit();
                  }}
                  placeholder="Ask AI to modify this slide..." 
                  className="w-full bg-surface2 border border-border rounded-lg pl-3 pr-10 py-2.5 text-sm outline-none focus:border-accent text-text transition-colors"
                />
                <button 
                  onClick={handleAiSubmit}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-accent text-bg rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={!aiInput.trim() || isAiThinking}
                >
                  <CornerDownRight size={14}/>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
