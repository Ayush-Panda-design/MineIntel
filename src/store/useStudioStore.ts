import { create } from 'zustand';
import { Presentation, Slide, SlideElement, User, Comment, Asset } from '../types/studio';

const mockTeam: User[] = [
  { id: 'u-1', name: 'Ayush', initials: 'AY', color: '#B5652F', role: 'OWNER', isOnline: true },
  { id: 'u-2', name: 'Sarah', initials: 'SA', color: '#2F6B4F', role: 'EDITOR', isOnline: true },
  { id: 'u-3', name: 'David', initials: 'DA', color: '#5B5346', role: 'EDITOR', isOnline: false },
  { id: 'u-4', name: 'Elena', initials: 'EL', color: '#A8402F', role: 'VIEWER', isOnline: true },
];

const mockComments: Comment[] = [
  {
    id: 'c-1',
    userId: 'u-2',
    text: 'Can we make this diagram more visual?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    resolved: false,
    targetId: 'slide-1',
    replies: [
      {
        id: 'c-1-1',
        userId: 'u-1',
        text: 'Working on it now. Adding an infographic.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        resolved: false,
        targetId: 'slide-1'
      }
    ]
  }
];

const initialPresentation: Presentation = {
  id: 'p-1',
  name: 'MineIntel SIH 2026 Pitch Deck',
  team: mockTeam,
  comments: mockComments,
  assets: [
    {
      id: 'asset-1',
      name: 'RAG Pipeline Diagram',
      type: 'image',
      source: 'ai_generated',
      createdBy: 'u-1',
      createdAt: new Date().toISOString(),
      thumbnail: 'https://placehold.co/400x300/201B14/EA580C.png?text=RAG+Pipeline',
      fullAsset: 'https://placehold.co/800x600/201B14/EA580C.png?text=RAG+Pipeline',
      tags: ['generated', 'diagram']
    },
    {
      id: 'asset-2',
      name: 'MineIntel Logo Primary',
      type: 'image',
      source: 'mineintel',
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      thumbnail: 'https://placehold.co/400x400/201B14/EA580C.png?text=MineIntel+Logo',
      fullAsset: 'https://placehold.co/800x800/201B14/EA580C.png?text=MineIntel+Logo',
      tags: ['mineintel', 'icon']
    },
    {
      id: 'asset-3',
      name: 'Coal Mine Isometric',
      type: 'image',
      source: 'mineintel',
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      thumbnail: 'https://placehold.co/400x300/F1ECE3/201B14.png?text=Mine+Isometric',
      fullAsset: 'https://placehold.co/800x600/F1ECE3/201B14.png?text=Mine+Isometric',
      tags: ['mineintel', 'illustration'],
      isFavorite: true
    },
    {
      id: 'asset-4',
      name: 'App Screenshot',
      type: 'image',
      source: 'uploaded',
      createdBy: 'u-1',
      createdAt: new Date().toISOString(),
      thumbnail: 'https://placehold.co/400x300/111111/FFFFFF.png?text=App+Screenshot',
      fullAsset: 'https://placehold.co/800x600/111111/FFFFFF.png?text=App+Screenshot',
      tags: ['uploaded', 'screenshot']
    }
  ],
  slides: [
    {
      id: 'slide-1',
      title: 'Basic Details (SIH Title)',
      assignedTo: 'u-1',
      status: 'done',
      isEditing: true,
      lockedBy: 'u-1', // Locked by Ayush
      lastEditedAt: new Date().toISOString(),
      background: '#FFFFFF',
      elements: [
        // 1. Top Center Blue Pill Badge
        {
          id: 'el-top-pill-bg',
          type: 'SHAPE',
          shapeType: 'rounded-rect',
          fill: '#0072C6',
          stroke: '#0072C6',
          strokeWidth: 0,
          cornerRadius: 10,
          x: 350,
          y: 30,
          width: 580,
          height: 54,
          rotation: 0,
          zIndex: 1
        },
        {
          id: 'el-top-pill-text',
          type: 'TEXT',
          content: 'SMART INDIA HACKATHON 2026',
          x: 350,
          y: 42,
          width: 580,
          height: 40,
          rotation: 0,
          zIndex: 2,
          fontSize: 24,
          fontFamily: 'Space Grotesk',
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center'
        },
        // 2. Top Right SIH Header Logo
        {
          id: 'el-top-right-logo',
          type: 'IMAGE',
          url: '/sih-logo.svg',
          x: 1010,
          y: 20,
          width: 230,
          height: 60,
          rotation: 0,
          zIndex: 3
        },
        // 3. Left Column Fields
        {
          id: 'el-field-1',
          type: 'TEXT',
          content: 'Problem Statement ID – SIH1645',
          x: 50,
          y: 135,
          width: 760,
          height: 45,
          rotation: 0,
          zIndex: 2,
          fontSize: 24,
          fontFamily: 'Space Grotesk',
          fontWeight: 'bold',
          color: '#1C1917',
          textAlign: 'left'
        },
        {
          id: 'el-field-2',
          type: 'TEXT',
          content: 'Problem Statement Title - An app and web based software for Productivity and safety management of coal mines.',
          x: 50,
          y: 205,
          width: 760,
          height: 95,
          rotation: 0,
          zIndex: 2,
          fontSize: 22,
          fontFamily: 'Space Grotesk',
          fontWeight: 'bold',
          color: '#1C1917',
          textAlign: 'left'
        },
        {
          id: 'el-field-3',
          type: 'TEXT',
          content: 'Theme - Smart Automation',
          x: 50,
          y: 330,
          width: 760,
          height: 45,
          rotation: 0,
          zIndex: 2,
          fontSize: 22,
          fontFamily: 'Space Grotesk',
          fontWeight: 'bold',
          color: '#1C1917',
          textAlign: 'left'
        },
        {
          id: 'el-field-4',
          type: 'TEXT',
          content: 'PS Category- Software',
          x: 50,
          y: 400,
          width: 760,
          height: 45,
          rotation: 0,
          zIndex: 2,
          fontSize: 22,
          fontFamily: 'Space Grotesk',
          fontWeight: 'bold',
          color: '#1C1917',
          textAlign: 'left'
        },
        {
          id: 'el-field-5',
          type: 'TEXT',
          content: 'Team ID- 289',
          x: 50,
          y: 470,
          width: 760,
          height: 45,
          rotation: 0,
          zIndex: 2,
          fontSize: 22,
          fontFamily: 'Space Grotesk',
          fontWeight: 'bold',
          color: '#1C1917',
          textAlign: 'left'
        },
        {
          id: 'el-field-6',
          type: 'TEXT',
          content: 'Team Name(Registered on Portal) - Arize',
          x: 50,
          y: 540,
          width: 760,
          height: 45,
          rotation: 0,
          zIndex: 2,
          fontSize: 22,
          fontFamily: 'Space Grotesk',
          fontWeight: 'bold',
          color: '#1C1917',
          textAlign: 'left'
        },
        // 4. Right Side Full SIH Hexagon Shading Watermark & Brain Lightbulb Emblem Graphic
        {
          id: 'el-right-watermark-graphic',
          type: 'IMAGE',
          url: '/sih-watermark.svg',
          x: 700,
          y: 50,
          width: 550,
          height: 620,
          rotation: 0,
          zIndex: 0
        }
      ]
    },
    {
      id: 'slide-2',
      title: 'Existing Workflow',
      assignedTo: 'u-2',
      status: 'in-progress',
      isEditing: true,
      lockedBy: 'u-2', // Locked by Sarah (Simulating remote collaboration)
      lastEditedAt: new Date(Date.now() - 60000).toISOString(),
      background: '#FFFFFF',
      elements: []
    },
    {
      id: 'slide-3',
      title: 'MineIntel Solution',
      assignedTo: 'u-3',
      status: 'not-started',
      isEditing: false,
      background: '#FFFFFF',
      elements: []
    }
  ]
};

interface HistoryState { past: Presentation[]; future: Presentation[]; }

interface StudioState {
  currentUser: User;
  presentation: Presentation | null;
  activeSlideId: string | null;
  selectedElementIds: string[];
  clipboard: SlideElement[];
  zoom: number;
  history: HistoryState;
  
  // Actions
  setPresentation: (p: Presentation) => void;
  setActiveSlideId: (id: string) => void;
  setSelectedElementIds: (ids: string[]) => void;
  setZoom: (zoom: number) => void;
  
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;

  addElement: (slideId: string, element: SlideElement) => void;
  updateElement: (slideId: string, elementId: string, updates: Partial<SlideElement>) => void;
  updateSelectedElements: (updates: Partial<SlideElement>) => void;
  replaceSlideElements: (slideId: string, elements: SlideElement[]) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  copySelected: () => void;
  paste: () => void;
  moveSelected: (dx: number, dy: number) => void;
  
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;

  createSlide: () => void;
  duplicateSlide: (slideId: string) => void;
  deleteSlide: (slideId: string) => void;
  assignSlide: (slideId: string, userId: string) => void;
  updateSlideStatus: (slideId: string, status: Slide['status']) => void;

  addComment: (targetId: string, text: string) => void;
  replyToComment: (commentId: string, text: string) => void;
  resolveComment: (commentId: string) => void;

  addAsset: (asset: Asset) => void;
  deleteAsset: (assetId: string) => void;
  toggleFavoriteAsset: (assetId: string) => void;
  applyDesignSystemToDeck: () => void;

  isPresenting: boolean;
  setIsPresenting: (v: boolean) => void;
  updateSlideNotes: (slideId: string, notes: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStudioStore = create<StudioState>((set, get) => ({
  currentUser: mockTeam[0],
  presentation: initialPresentation,
  activeSlideId: 'slide-1',
  selectedElementIds: [],
  clipboard: [],
  zoom: 1,
  history: { past: [], future: [] },

  // ... (rest of the state functions)

  saveHistory: () => {
    const { presentation, history } = get();
    if (!presentation) return;
    set({
      history: {
        past: [...history.past.slice(-20), presentation],
        future: []
      }
    });
  },

  undo: () => {
    const { presentation, history } = get();
    if (history.past.length === 0 || !presentation) return;
    const newPast = [...history.past];
    const previous = newPast.pop()!;
    set({
      presentation: previous,
      history: { past: newPast, future: [presentation, ...history.future] },
      selectedElementIds: []
    });
  },

  redo: () => {
    const { presentation, history } = get();
    if (history.future.length === 0 || !presentation) return;
    const newFuture = [...history.future];
    const next = newFuture.shift()!;
    set({
      presentation: next,
      history: { past: [...history.past, presentation], future: newFuture },
      selectedElementIds: []
    });
  },

  setPresentation: (presentation) => set({ presentation }),
  
  setActiveSlideId: (activeSlideId) => {
    const { presentation, currentUser } = get();
    if (!presentation) return;
    
    const newSlides = presentation.slides.map(s => {
      if (s.id === activeSlideId && (!s.lockedBy || s.lockedBy === currentUser.id)) {
        return { ...s, lockedBy: currentUser.id, isEditing: true };
      }
      if (s.lockedBy === currentUser.id && s.id !== activeSlideId) {
        return { ...s, lockedBy: undefined, isEditing: false };
      }
      return s;
    });

    set({ 
      activeSlideId, 
      selectedElementIds: [],
      presentation: { ...presentation, slides: newSlides }
    });
  },
  
  setSelectedElementIds: (selectedElementIds) => set({ selectedElementIds }),
  setZoom: (zoom) => set({ zoom }),

  addElement: (slideId, element) => {
    const state = get();
    state.saveHistory();
    set((state) => {
      if (!state.presentation) return state;
      return {
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(s => 
            s.id === slideId ? { ...s, elements: [...s.elements, element] } : s
          )
        },
        selectedElementIds: [element.id]
      };
    });
  },

  updateElement: (slideId, elementId, updates) => {
    set((state) => {
      if (!state.presentation) return state;
      return {
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(s => {
            if (s.id !== slideId) return s;
            return {
              ...s,
              elements: s.elements.map(el => el.id === elementId ? { ...el, ...updates } as SlideElement : el)
            };
          })
        }
      };
    });
  },

  updateSelectedElements: (updates) => {
    const state = get();
    state.saveHistory();
    set((state) => {
      if (!state.presentation || !state.activeSlideId) return state;
      return {
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(s => {
            if (s.id !== state.activeSlideId) return s;
            return {
              ...s,
              elements: s.elements.map(el => state.selectedElementIds.includes(el.id) ? { ...el, ...updates } as SlideElement : el)
            };
          })
        }
      };
    });
  },

  replaceSlideElements: (slideId, elements) => {
    const state = get();
    state.saveHistory();
    set((state) => {
      if (!state.presentation) return state;
      return {
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(s => 
            s.id === slideId ? { ...s, elements } : s
          )
        }
      };
    });
  },

  deleteSelected: () => {
    const state = get();
    if (state.selectedElementIds.length === 0) return;
    state.saveHistory();
    set((state) => {
      if (!state.presentation || !state.activeSlideId) return state;
      return {
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(s => {
            if (s.id !== state.activeSlideId) return s;
            return {
              ...s,
              elements: s.elements.filter(el => !state.selectedElementIds.includes(el.id))
            };
          })
        },
        selectedElementIds: []
      };
    });
  },

  duplicateSelected: () => {
    const state = get();
    if (state.selectedElementIds.length === 0 || !state.presentation || !state.activeSlideId) return;
    state.saveHistory();
    const slide = state.presentation.slides.find(s => s.id === state.activeSlideId);
    if (!slide) return;
    const toDuplicate = slide.elements.filter(el => state.selectedElementIds.includes(el.id));
    const newElements = toDuplicate.map(el => ({
      ...el,
      id: `el-${generateId()}`,
      x: el.x + 20,
      y: el.y + 20,
      zIndex: Math.max(...slide.elements.map(e => e.zIndex || 0)) + 1
    }));
    set((state) => {
      if (!state.presentation) return state;
      return {
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(s => s.id === state.activeSlideId ? { ...s, elements: [...s.elements, ...newElements] } : s)
        },
        selectedElementIds: newElements.map(e => e.id)
      };
    });
  },

  copySelected: () => {
    const state = get();
    if (state.selectedElementIds.length === 0 || !state.presentation || !state.activeSlideId) return;
    const slide = state.presentation.slides.find(s => s.id === state.activeSlideId);
    if (!slide) return;
    const copied = slide.elements.filter(el => state.selectedElementIds.includes(el.id));
    set({ clipboard: JSON.parse(JSON.stringify(copied)) });
  },

  paste: () => {
    const state = get();
    if (state.clipboard.length === 0 || !state.presentation || !state.activeSlideId) return;
    state.saveHistory();
    const slide = state.presentation.slides.find(s => s.id === state.activeSlideId);
    const maxZ = slide ? Math.max(0, ...slide.elements.map(e => e.zIndex || 0)) : 0;
    const newElements = state.clipboard.map((el, index) => ({
      ...el, id: `el-${generateId()}`, x: el.x + 20, y: el.y + 20, zIndex: maxZ + index + 1
    }));
    set((state) => {
      if (!state.presentation) return state;
      return {
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(s => s.id === state.activeSlideId ? { ...s, elements: [...s.elements, ...newElements] } : s)
        },
        selectedElementIds: newElements.map(e => e.id)
      };
    });
  },

  moveSelected: (dx, dy) => {
    const state = get();
    if (state.selectedElementIds.length === 0) return;
    set((state) => {
      if (!state.presentation || !state.activeSlideId) return state;
      return {
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(s => {
            if (s.id !== state.activeSlideId) return s;
            return {
              ...s,
              elements: s.elements.map(el => state.selectedElementIds.includes(el.id) ? { ...el, x: el.x + dx, y: el.y + dy } as SlideElement : el)
            };
          })
        }
      };
    });
  },

  bringForward: () => {
    const state = get();
    state.saveHistory();
    set((state) => {
      if (!state.presentation || !state.activeSlideId) return state;
      return { presentation: { ...state.presentation, slides: state.presentation.slides.map(s => s.id === state.activeSlideId ? { ...s, elements: s.elements.map(el => state.selectedElementIds.includes(el.id) ? { ...el, zIndex: (el.zIndex || 0) + 1 } as SlideElement : el) } : s) } };
    });
  },

  sendBackward: () => {
    const state = get();
    state.saveHistory();
    set((state) => {
      if (!state.presentation || !state.activeSlideId) return state;
      return { presentation: { ...state.presentation, slides: state.presentation.slides.map(s => s.id === state.activeSlideId ? { ...s, elements: s.elements.map(el => state.selectedElementIds.includes(el.id) ? { ...el, zIndex: Math.max(0, (el.zIndex || 0) - 1) } as SlideElement : el) } : s) } };
    });
  },

  bringToFront: () => {
    const state = get();
    state.saveHistory();
    set((state) => {
      if (!state.presentation || !state.activeSlideId) return state;
      const slide = state.presentation.slides.find(s => s.id === state.activeSlideId);
      if (!slide) return state;
      const maxZ = Math.max(0, ...slide.elements.map(e => e.zIndex || 0));
      return { presentation: { ...state.presentation, slides: state.presentation.slides.map(s => s.id === state.activeSlideId ? { ...s, elements: s.elements.map(el => state.selectedElementIds.includes(el.id) ? { ...el, zIndex: maxZ + 1 } as SlideElement : el) } : s) } };
    });
  },

  sendToBack: () => {
    const state = get();
    state.saveHistory();
    set((state) => {
      if (!state.presentation || !state.activeSlideId) return state;
      const slide = state.presentation.slides.find(s => s.id === state.activeSlideId);
      if (!slide) return state;
      const minZ = Math.min(0, ...slide.elements.map(e => e.zIndex || 0));
      return { presentation: { ...state.presentation, slides: state.presentation.slides.map(s => s.id === state.activeSlideId ? { ...s, elements: s.elements.map(el => state.selectedElementIds.includes(el.id) ? { ...el, zIndex: minZ - 1 } as SlideElement : el) } : s) } };
    });
  },

  createSlide: () => {
    const state = get();
    state.saveHistory();
    const newSlideId = `slide-${generateId()}`;
    set((state) => {
      if (!state.presentation) return state;
      return {
        presentation: {
          ...state.presentation,
          slides: [...state.presentation.slides, {
            id: newSlideId, title: `New Slide`, assignedTo: state.currentUser.id, status: 'not-started', isEditing: true, lockedBy: state.currentUser.id, elements: [], background: '#FFFFFF'
          }]
        },
        activeSlideId: newSlideId,
        selectedElementIds: []
      };
    });
  },

  duplicateSlide: (slideId) => {
    const state = get();
    state.saveHistory();
    const newSlideId = `slide-${generateId()}`;
    set((state) => {
      if (!state.presentation) return state;
      const slideToCopy = state.presentation.slides.find(s => s.id === slideId);
      if (!slideToCopy) return state;
      const newSlide = JSON.parse(JSON.stringify(slideToCopy));
      newSlide.id = newSlideId;
      newSlide.title = `${newSlide.title} (Copy)`;
      newSlide.lockedBy = state.currentUser.id;
      newSlide.assignedTo = state.currentUser.id;
      const idx = state.presentation.slides.findIndex(s => s.id === slideId);
      const newSlides = [...state.presentation.slides];
      newSlides.splice(idx + 1, 0, newSlide);
      return { presentation: { ...state.presentation, slides: newSlides }, activeSlideId: newSlideId, selectedElementIds: [] };
    });
  },

  deleteSlide: (slideId) => {
    const state = get();
    state.saveHistory();
    set((state) => {
      if (!state.presentation || state.presentation.slides.length <= 1) return state;
      const newSlides = state.presentation.slides.filter(s => s.id !== slideId);
      return { presentation: { ...state.presentation, slides: newSlides }, activeSlideId: state.activeSlideId === slideId ? newSlides[Math.max(0, newSlides.findIndex(s => s.id === slideId) - 1)]?.id || newSlides[0].id : state.activeSlideId, selectedElementIds: [] };
    });
  },

  assignSlide: (slideId, userId) => {
    set((state) => {
      if (!state.presentation) return state;
      return { presentation: { ...state.presentation, slides: state.presentation.slides.map(s => s.id === slideId ? { ...s, assignedTo: userId } : s) } };
    });
  },

  updateSlideStatus: (slideId, status) => {
    set((state) => {
      if (!state.presentation) return state;
      return { presentation: { ...state.presentation, slides: state.presentation.slides.map(s => s.id === slideId ? { ...s, status } : s) } };
    });
  },

  addComment: (targetId, text) => {
    const state = get();
    set((state) => {
      if (!state.presentation) return state;
      const newComment: Comment = {
        id: `c-${generateId()}`,
        userId: state.currentUser.id,
        text,
        timestamp: new Date().toISOString(),
        resolved: false,
        targetId
      };
      return { presentation: { ...state.presentation, comments: [...state.presentation.comments, newComment] } };
    });
  },

  replyToComment: (commentId, text) => {
    const state = get();
    set((state) => {
      if (!state.presentation) return state;
      const reply: Comment = {
        id: `c-${generateId()}`,
        userId: state.currentUser.id,
        text,
        timestamp: new Date().toISOString(),
        resolved: false,
        targetId: ''
      };
      return {
        presentation: {
          ...state.presentation,
          comments: state.presentation.comments.map(c => c.id === commentId ? { ...c, replies: [...(c.replies || []), reply] } : c)
        }
      };
    });
  },

  resolveComment: (commentId) => {
    set((state) => {
      if (!state.presentation) return state;
      return {
        presentation: {
          ...state.presentation,
          comments: state.presentation.comments.map(c => c.id === commentId ? { ...c, resolved: true } : c)
        }
      };
    });
  },

  addAsset: (asset) => {
    set((state) => {
      if (!state.presentation) return state;
      return {
        presentation: {
          ...state.presentation,
          assets: [...(state.presentation.assets || []), asset]
        }
      };
    });
  },

  deleteAsset: (assetId) => {
    set((state) => {
      if (!state.presentation || !state.presentation.assets) return state;
      return {
        presentation: {
          ...state.presentation,
          assets: state.presentation.assets.filter(a => a.id !== assetId)
        }
      };
    });
  },

  toggleFavoriteAsset: (assetId) => {
    set((state) => {
      if (!state.presentation || !state.presentation.assets) return state;
      return {
        presentation: {
          ...state.presentation,
          assets: state.presentation.assets.map(a => 
            a.id === assetId ? { ...a, isFavorite: !a.isFavorite } : a
          )
        }
      };
    });
  },

  applyDesignSystemToDeck: () => {
    set((state) => {
      if (!state.presentation) return state;
      
      const newSlides = state.presentation.slides.map(slide => {
        const newElements = slide.elements.map(el => {
          if (el.type === 'TEXT') {
            return {
              ...el,
              fontFamily: 'Space Grotesk',
              color: '#201B14' // Dark Charcoal
            };
          }
          if (el.type === 'SHAPE' && el.fill !== 'transparent') {
            return {
              ...el,
              fill: '#EAE4D9', // Subtle warm neutral
              cornerRadius: 4
            };
          }
          return el;
        });
        
        return {
          ...slide,
          background: '#F1ECE3', // Warm ivory
          elements: newElements
        };
      });

      return {
        presentation: {
          ...state.presentation,
          slides: newSlides
        }
      };
    });
  },

  isPresenting: false,
  setIsPresenting: (v) => set({ isPresenting: v }),
  
  updateSlideNotes: (slideId, notes) => {
    set((state) => {
      if (!state.presentation) return state;
      return {
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(s => 
            s.id === slideId ? { ...s, speakerNotes: notes } : s
          )
        }
      };
    });
  }

}));
