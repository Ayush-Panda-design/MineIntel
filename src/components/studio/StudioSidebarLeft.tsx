"use client";

import { useState, useMemo } from 'react';
import { Copy, LayoutTemplate, Images, Palette, CheckCircle2, Circle, Plus, Trash2, Copy as CopyIcon, Sparkles, AlertTriangle, Search, Filter, Heart, FileImage, Replace } from 'lucide-react';
import { useStudioStore } from '@/store/useStudioStore';

export default function StudioSidebarLeft() {
  const [activeTab, setActiveTab] = useState<'slides' | 'review' | 'assets' | 'brand'>('slides');
  const [reviewData, setReviewData] = useState<any>(null);
  
  // Asset Library State
  const [assetSearch, setAssetSearch] = useState('');
  const [assetFilter, setAssetFilter] = useState('All');
  
  const { presentation, activeSlideId, setActiveSlideId, createSlide, duplicateSlide, deleteSlide, addElement, deleteAsset, toggleFavoriteAsset, selectedElementIds, updateElement, applyDesignSystemToDeck } = useStudioStore();

  const filteredAssets = useMemo(() => {
    if (!presentation?.assets) return [];
    let filtered = presentation.assets;
    
    // Text search
    if (assetSearch.trim()) {
      const q = assetSearch.toLowerCase();
      filtered = filtered.filter(a => a.name.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)));
    }
    
    // Category filter
    if (assetFilter !== 'All') {
      if (assetFilter === 'Favorites') {
        filtered = filtered.filter(a => a.isFavorite);
      } else {
        const tag = assetFilter.toLowerCase();
        filtered = filtered.filter(a => a.tags.includes(tag) || a.source === tag);
      }
    }
    
    return filtered;
  }, [presentation?.assets, assetSearch, assetFilter]);

  const handleDragStart = (e: React.DragEvent, asset: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'asset',
      id: asset.id,
      url: asset.fullAsset
    }));
  };

  const handleInsertAsset = (asset: any) => {
    if (!activeSlideId) return;
    addElement(activeSlideId, {
      id: `el-${Date.now()}`,
      type: 'IMAGE',
      url: asset.fullAsset,
      assetId: asset.id,
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      rotation: 0,
      zIndex: 10
    });
  };

  const handleReplaceSelected = (asset: any) => {
    if (!activeSlideId || selectedElementIds.length !== 1) return;
    const activeSlide = presentation?.slides.find(s => s.id === activeSlideId);
    if (!activeSlide) return;
    const selectedEl = activeSlide.elements.find(el => el.id === selectedElementIds[0]);
    
    if (selectedEl && selectedEl.type === 'IMAGE') {
      updateElement(activeSlideId, selectedEl.id, {
        url: asset.fullAsset,
        assetId: asset.id
      });
    }
  };

  const isImageSelected = useMemo(() => {
    if (selectedElementIds.length !== 1 || !activeSlideId) return false;
    const activeSlide = presentation?.slides.find(s => s.id === activeSlideId);
    const selectedEl = activeSlide?.elements.find(el => el.id === selectedElementIds[0]);
    return selectedEl?.type === 'IMAGE';
  }, [selectedElementIds, activeSlideId, presentation]);

  return (
    <div className="w-64 border-r border-border bg-surface flex flex-col shrink-0">
      
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button onClick={() => setActiveTab('slides')} className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${activeTab === 'slides' ? 'border-accent text-accent' : 'border-transparent text-textDim hover:text-text'}`}>
          Slides
        </button>
        <button onClick={() => setActiveTab('review')} className={`flex flex-1 items-center justify-center gap-1 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${activeTab === 'review' ? 'border-accent text-accent' : 'border-transparent text-textDim hover:text-text'}`}>
          <Sparkles size={12}/> Review
        </button>
        <button onClick={() => setActiveTab('assets')} className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${activeTab === 'assets' ? 'border-accent text-accent' : 'border-transparent text-textDim hover:text-text'}`}>
          Assets
        </button>
        <button onClick={() => setActiveTab('brand')} className={`flex-1 py-3 text-[10px] font-bold tracking-wider uppercase border-b-2 transition-colors ${activeTab === 'brand' ? 'border-accent text-accent' : 'border-transparent text-textDim hover:text-text'}`}>
          Brand
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 relative">
        {activeTab === 'slides' && (
          <div className="flex flex-col gap-4">
            {presentation?.slides.map((slide, index) => (
              <div 
                key={slide.id} 
                onClick={() => setActiveSlideId(slide.id)}
                className={`relative group rounded-lg border-2 transition-all cursor-pointer ${activeSlideId === slide.id ? 'border-accent shadow-md' : 'border-transparent hover:border-border'}`}
              >
                <div className="text-[10px] font-bold text-textDim mb-1 ml-1 flex items-center justify-between">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {slide.status === 'done' && <CheckCircle2 size={12} className="text-accent2" />}
                </div>
                
                <div className="w-full aspect-video bg-surface2 rounded-md overflow-hidden relative border border-border">
                  <div className="absolute inset-0 flex items-center justify-center text-border">
                    <LayoutTemplate size={24} />
                  </div>
                  
                  {slide.lockedBy && slide.lockedBy !== 'u-1' && (
                    <div className="absolute inset-0 bg-bg/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                      <div className="bg-surface px-2 py-1 rounded text-[10px] font-bold text-text shadow-sm border border-border flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                        Sarah is editing
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute -bottom-2 -right-2">
                  {slide.assignedTo && presentation.team.find(u => u.id === slide.assignedTo) && (
                    <div className="w-6 h-6 rounded-full border-2 border-surface flex items-center justify-center text-[9px] font-bold text-white shadow-sm" style={{ backgroundColor: presentation.team.find(u => u.id === slide.assignedTo)?.color }}>
                      {presentation.team.find(u => u.id === slide.assignedTo)?.initials}
                    </div>
                  )}
                </div>

                {activeSlideId === slide.id && (
                  <div className="absolute -right-12 top-6 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); duplicateSlide(slide.id); }} className="p-1.5 bg-surface border border-border rounded text-textDim hover:text-text shadow-sm"><CopyIcon size={14}/></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteSlide(slide.id); }} className="p-1.5 bg-surface border border-border rounded text-danger hover:bg-danger/10 shadow-sm"><Trash2 size={14}/></button>
                  </div>
                )}
              </div>
            ))}

            <button onClick={createSlide} className="w-full py-3 mt-2 border border-dashed border-border rounded-lg text-sm font-bold text-textDim hover:text-accent hover:border-accent transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> New Slide
            </button>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-textDim" />
                <input 
                  type="text" 
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  placeholder="Search assets..." 
                  className="w-full bg-surface2 border border-border rounded-md pl-8 pr-3 py-1.5 text-xs text-text outline-none focus:border-accent"
                />
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
                {['All', 'MineIntel', 'Generated', 'Uploaded', 'Favorites', 'Illustrations', 'Diagrams'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setAssetFilter(cat)}
                    className={`shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-full border transition-colors ${assetFilter === cat ? 'bg-accent/10 border-accent text-accent' : 'bg-surface2 border-border text-textDim hover:border-textDim'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredAssets.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 pb-10">
                  {filteredAssets.map(asset => (
                    <div 
                      key={asset.id} 
                      draggable 
                      onDragStart={(e) => handleDragStart(e, asset)}
                      className="aspect-square bg-surface2 border border-border rounded overflow-hidden relative group cursor-grab active:cursor-grabbing hover:border-accent shadow-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
                      
                      {asset.isFavorite && (
                        <div className="absolute top-1 right-1 text-accent drop-shadow-md">
                          <Heart size={12} fill="currentColor" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-text line-clamp-2 leading-tight">{asset.name}</span>
                        
                        <div className="flex flex-col gap-1">
                          {isImageSelected && (
                            <button onClick={() => handleReplaceSelected(asset)} className="w-full py-1 bg-surface border border-border rounded text-[10px] font-bold text-text hover:text-accent hover:border-accent flex justify-center items-center gap-1">
                              <Replace size={10} /> Replace
                            </button>
                          )}
                          <div className="flex gap-1">
                            <button onClick={() => handleInsertAsset(asset)} className="flex-1 py-1 bg-accent text-bg rounded text-[10px] font-bold hover:bg-accent/90">
                              Insert
                            </button>
                            <button onClick={() => toggleFavoriteAsset(asset.id)} className="w-6 py-1 bg-surface border border-border rounded text-textDim hover:text-accent flex justify-center items-center">
                              <Heart size={10} fill={asset.isFavorite ? "currentColor" : "none"} className={asset.isFavorite ? "text-accent" : ""} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-sm text-textDim flex flex-col items-center gap-2">
                  <FileImage size={24} className="opacity-50" />
                  No assets found.
                </div>
              )}
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 bg-surface p-2 border border-border shadow-lg rounded-lg">
              <button className="w-full py-1.5 border border-dashed border-border rounded text-xs font-bold text-textDim hover:text-accent hover:border-accent transition-colors flex justify-center items-center gap-2">
                <Plus size={14} /> Upload Asset
              </button>
            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="flex flex-col gap-4 pb-10">
            <div className="text-sm font-medium text-text">Presentation Director</div>
            <p className="text-xs text-textDim leading-relaxed">
              Analyze the entire deck for Story, Visuals, Technical accuracy, and Presentation timing.
            </p>

            <button 
              onClick={async () => {
                if (!presentation) return;
                // Simulating review loading state (in real app, we use AIQueueManager)
                const res = await fetch('/api/ai', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ type: 'reviewPresentation', userId: 'u-1', payload: { presentation } })
                });
                const job = await res.json();
                
                // For this demo, let's just trigger a local mock to avoid writing full polling logic in this component
                const mockReview = {
                  summary: "The presentation has a strong technical foundation, but pace and visual density need adjustment in the middle sections.",
                  slides: [
                    {
                      slideId: "slide-1",
                      slideTitle: "Title Slide",
                      category: "STORY",
                      observation: "Strong opening, but lacks an immediate hook establishing the geology data problem.",
                      suggestion: "Add a subtitle explicitly stating the problem MineIntel solves."
                    },
                    {
                      slideId: "slide-2",
                      slideTitle: "Architecture",
                      category: "VISUAL",
                      observation: "The architecture contains many components but their relationships are visually dense.",
                      suggestion: "Group the architecture into ingestion, intelligence and verification layers."
                    },
                    {
                      slideId: "slide-3",
                      slideTitle: "Verification",
                      category: "PRESENTATION",
                      observation: "This slide has too much text and will likely take over 3 minutes to explain.",
                      suggestion: "Move the technical calculation details into the speaker notes."
                    }
                  ]
                };
                
                // Set the review data in state
                setReviewData(mockReview);
              }}
              className="w-full py-2 bg-text text-bg rounded font-bold text-sm shadow-md hover:bg-text/90 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={16} /> Review Entire Presentation
            </button>

            {/* Simulated Review Results rendered if available */}
            {reviewData && (
              <div className="flex flex-col gap-5 mt-2 animate-fade-in">
                <div className="bg-surface2 border border-border p-3 rounded-lg">
                  <span className="text-xs font-bold text-text block mb-1">Director Summary</span>
                  <p className="text-xs text-textDim leading-relaxed">
                    {reviewData.summary}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {reviewData.slides.map((item: any, i: number) => (
                    <div key={i} className="flex flex-col gap-2 bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-surface2 px-3 py-2 border-b border-border flex justify-between items-center">
                        <span className="text-[10px] font-bold text-text uppercase tracking-wider">{item.slideTitle || item.slideId}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.category === 'STORY' ? 'bg-blue-500/10 text-blue-600' :
                          item.category === 'VISUAL' ? 'bg-purple-500/10 text-purple-600' :
                          item.category === 'PRESENTATION' ? 'bg-accent/10 text-accent' :
                          item.category === 'JUDGE_EXPERIENCE' ? 'bg-orange-500/10 text-orange-600' :
                          'bg-green-500/10 text-green-600'
                        }`}>{item.category}</span>
                      </div>
                      <div className="p-3 flex flex-col gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-textDim uppercase">Observation</span>
                          <p className="text-xs text-text mt-0.5">{item.observation}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-textDim uppercase">Suggestion</span>
                          <p className="text-xs text-text mt-0.5">{item.suggestion}</p>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <button 
                            onClick={() => setActiveSlideId(item.slideId)}
                            className="flex-1 py-1.5 border border-border rounded text-[10px] font-bold text-text hover:bg-surface2"
                          >
                            Open Slide
                          </button>
                          <button className="flex-1 py-1.5 bg-accent text-bg rounded text-[10px] font-bold hover:bg-accent/90">
                            Apply Suggestion
                          </button>
                          <button className="px-3 py-1.5 border border-border rounded text-[10px] font-bold text-textDim hover:text-danger">
                            Ignore
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'brand' && (
          <div className="flex flex-col gap-5 pb-10">
            <div className="text-sm font-medium text-text">Global Design System</div>
            
            <button 
              onClick={() => {
                applyDesignSystemToDeck();
                // We're mocking the AI processing queue via UI for immediate visual feedback,
                // but usually this would fire an async AI enforceDeckConsistency task.
              }}
              className="w-full py-2 bg-accent text-bg rounded font-bold text-sm shadow-md hover:bg-accent/90 transition-all flex justify-center items-center gap-2"
            >
              <Sparkles size={16} /> Enforce on Entire Deck
            </button>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-textDim uppercase tracking-wider">Colors</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 border border-border p-1.5 rounded bg-surface2">
                  <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: '#F1ECE3' }}></div>
                  <span className="text-xs font-bold">Ivory</span>
                </div>
                <div className="flex items-center gap-2 border border-border p-1.5 rounded bg-surface2">
                  <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: '#201B14' }}></div>
                  <span className="text-xs font-bold text-text">Charcoal</span>
                </div>
                <div className="flex items-center gap-2 border border-border p-1.5 rounded bg-surface2">
                  <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: '#8B2626' }}></div>
                  <span className="text-xs font-bold text-text">Maroon</span>
                </div>
                <div className="flex items-center gap-2 border border-border p-1.5 rounded bg-surface2">
                  <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: '#EAE4D9' }}></div>
                  <span className="text-xs font-bold text-text">Surface</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-textDim uppercase tracking-wider">Typography</span>
              
              <div className="border border-border rounded p-3 flex flex-col gap-3 bg-surface2">
                <div>
                  <div className="font-bold text-xl text-text" style={{ fontFamily: 'Space Grotesk' }}>Display</div>
                  <div className="text-[10px] text-textDim font-mono mt-0.5">Space Grotesk • Bold • 72px</div>
                </div>
                <hr className="border-border" />
                <div>
                  <div className="font-medium text-lg text-text" style={{ fontFamily: 'Space Grotesk' }}>Heading</div>
                  <div className="text-[10px] text-textDim font-mono mt-0.5">Space Grotesk • Medium • 48px</div>
                </div>
                <hr className="border-border" />
                <div>
                  <div className="font-normal text-sm text-text" style={{ fontFamily: 'IBM Plex Mono' }}>Body Text</div>
                  <div className="text-[10px] text-textDim font-mono mt-0.5">IBM Plex Mono • Regular • 24px</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-textDim uppercase tracking-wider">AI Guidelines</span>
              <div className="border border-border rounded p-3 bg-surface2 text-xs text-textDim leading-relaxed">
                <strong className="text-text">Style:</strong> Technical, clean, professional, engineering, restrained.<br/><br/>
                <strong className="text-text">Avoid:</strong> Corporate stock art, random gradients, 3D styles, excess decoration.
              </div>
            </div>

            <p className="text-[10px] text-textDim italic mt-2 text-center">
              The AI Slide Agent and Generator strictly inherit this context for all visual operations.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
