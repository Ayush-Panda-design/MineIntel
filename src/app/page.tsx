"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FileText, UploadCloud, ScanText, Database, MessageSquare, 
  Search, Calculator, FileSpreadsheet, AlertTriangle, Info,
  CheckCircle2, Server, Layers, HardDrive, Cpu, ArrowRight,
  ArrowDown, Factory, Settings, Map, FileStack, ShieldCheck, FileKey, XCircle,
  HelpCircle, Eye, Sparkles, ChevronDown, RefreshCw, Layers3, Lightbulb,
  Play, Pause, Zap, Check, ArrowLeft, RotateCcw, Clock, Target, Layers2,
  Trophy, CheckSquare, Crosshair, Award, MousePointerClick, Sliders
} from "lucide-react";

function useInView(options = { threshold: 0.2 }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options.threshold]);
  return [ref, inView] as const;
}

function AnimatedSection({ id, children, className = "", delay = "" }: { id?: string, children: React.ReactNode, className?: string, delay?: string }) {
  const [ref, inView] = useInView();
  return (
    <section id={id} ref={ref} className={`transition-all duration-1000 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className} ${delay}`}>
      {children}
    </section>
  );
}

function InteractiveGuide({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center align-middle ml-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-6 h-6 md:w-8 md:h-8 rounded-full border flex items-center justify-center transition-all ${isOpen ? 'bg-accent border-accent text-bg shadow-md scale-110' : 'bg-surface2 border-border text-textDim hover:text-accent hover:border-accent'}`}
        title="How to interact"
        aria-label="Help guide"
      >
        <Info size={16} />
      </button>
      {isOpen && (
        <span className="absolute left-10 md:left-12 top-1/2 -translate-y-1/2 w-56 md:w-72 bg-surface border-2 border-accent/40 p-3.5 rounded-xl shadow-2xl text-xs md:text-sm font-sans font-normal text-text z-50 animate-fade-up flex items-start gap-2.5">
          <span className="text-accent text-base mt-0.5">💡</span>
          <span className="leading-snug">{text}</span>
        </span>
      )}
    </span>
  );
}

// Plain-English explainer definitions for every node in Section 1
const NODE_EXPLAINERS: Record<string, { title: string; tag: string; icon: any; summary: string; detail: string; example: string }> = {
  cil: {
    title: "Coal India Limited (CIL)",
    tag: "Parent Mining Enterprise",
    icon: Factory,
    summary: "The world's largest coal producer, operating 300+ opencast and underground mines across India.",
    detail: "Every single day, CIL subsidiaries generate thousands of shift reports, coal excavation targets, diesel logs, and equipment dispatch records.",
    example: "Example: Mahanadi Coalfields Ltd (MCL) filling out daily production reports in Odisha."
  },
  ops: {
    title: "Mining Operations",
    tag: "Ground Zero Activity",
    icon: Settings,
    summary: "Heavy machinery excavating coal seams and moving millions of cubic meters of waste rock (overburden).",
    detail: "Heavy dumpers, excavators, and draglines operate 24/7. Operators log every truckload on paper forms and digital spreadsheets.",
    example: "Example: 45 excavators removing 7.5 million m³ of waste rock in Month X."
  },
  records: {
    title: "Mining Records",
    tag: "Operational Raw Data",
    icon: FileStack,
    summary: "The accumulated stack of daily logs, monthly statistics, and machine maintenance records.",
    detail: "These records accumulate over decades in local mine offices. Some exist as modern PDFs, while older records are physical paper folders.",
    example: "Example: 15-year-old monthly production logs stored in mine site archives."
  },
  files: {
    title: "PDFs, Scans & Spreadsheets",
    tag: "Scattered File Formats",
    icon: FileText,
    summary: "Unstructured files coming in 3 formats: digital PDFs, hand-scanned documents, and Excel sheets.",
    detail: "Because files arrive from different mine sites, numbers are hidden inside tables, scanned images, or multi-tab Excel workbooks.",
    example: "Example: A scanned paper PDF where table text is embedded inside an image."
  },
  cmpdi: {
    title: "CMPDI (Mine Planning & Geology)",
    tag: "Technical Subsidiary",
    icon: Map,
    summary: "Central Mine Planning & Design Institute — CIL's premier engineering and exploration division.",
    detail: "CMPDI prepares 3D geological models, carries out borehole core drilling, and estimates coal reserve quality before mining begins.",
    example: "Example: Borehole drilling reports identifying coal seam thickness at 120m depth."
  },
  planning: {
    title: "Planning / Design / Exploration",
    tag: "Engineering Workflows",
    icon: Layers,
    summary: "Geological mapping, mine sequence layout, and environmental feasibility studies.",
    detail: "Engineers calculate the Stripping Ratio (how much waste rock must be removed to reach 1 tonne of coal) to plan mine profitability.",
    example: "Example: Calculating if a mine expansion is economically viable."
  },
  tech_records: {
    title: "Technical Records",
    tag: "Geological Evidence",
    icon: Database,
    summary: "High-precision geological reports, survey maps, borehole drill logs, and feasibility docs.",
    detail: "These documents contain precise coordinates, rock density measurements, and chemical ash-content analysis.",
    example: "Example: CMPDI Technical Feasibility Report Block B (2024)."
  },
  mineintel: {
    title: "MINEINTEL AI System",
    tag: "Unified Intelligence Engine",
    icon: ShieldCheck,
    summary: "The single AI platform that ingests all CIL & CMPDI records, cross-links facts, and proves every number.",
    detail: "Instead of searching through 10,000 files by hand, team members type questions in plain English. MineIntel answers in seconds and highlights the exact line in the original PDF scan!",
    example: "Example: Instantly proving coal production was 2.5 MT with 1-click link to Page 47 of Annual Report."
  }
};

const TOUR_STEPS = [
  { id: "context", title: "1. Raw Data Sources", text: "Mine data originates from Coal India Limited (operations) and CMPDI (geological planning)." },
  { id: "problem", title: "2. The File Complexity", text: "Crucial numbers get buried across scattered PDFs, scanned paper logs, and spreadsheets." },
  { id: "builder", title: "3. Pipeline Builder Game", text: "Connect the 5 pipeline blocks to build an automated mine record processor!" },
  { id: "flow", title: "4. 7-Step AI Pipeline", text: "Watch how MineIntel ingests, OCRs, embeds, searches, and verifies every record." },
  { id: "search", title: "5. Fast Vector Retrieval (RAG)", text: "MineIntel filters 10,000 pages down to the exact 2 source pages needed in milliseconds." },
  { id: "verify", title: "6. Deterministic Code Math", text: "Arithmetic division is calculated in Python, guaranteeing zero AI math errors." },
  { id: "evidence", title: "7. Traceable Proof & Pitch Deck", text: "Every number links to the highlighted scanned PDF line and exports into presentation slides!" }
];

export default function Home() {
  const [selectedNodeKey, setSelectedNodeKey] = useState<string | null>("cil");
  const [showTeamGuide, setShowTeamGuide] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [searchQueryIndex, setSearchQueryIndex] = useState(0);

  // Guided Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  // Mini-Game 1: Pipeline Builder State
  const [selectedPipelineBlocks, setSelectedPipelineBlocks] = useState<number[]>([]);
  const [pipelineConnected, setPipelineConnected] = useState(false);

  // Mini-Game 2: Math Quiz State
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Scanner Simulator State
  const [selectedScanFile, setSelectedScanFile] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanLog, setScanLog] = useState<string[]>([]);

  // Speed Race Simulator State
  const [raceState, setRaceState] = useState<"idle" | "running" | "done">("idle");
  const [humanSeconds, setHumanSeconds] = useState(0);
  const [aiSeconds, setAiSeconds] = useState(0);

  // Sliders for interactive math calculator
  const [calcOverburden, setCalcOverburden] = useState<number>(7.5);
  const [calcProduction, setCalcProduction] = useState<number>(2.5);
  const calculatedRatio = (calcOverburden / (calcProduction || 1)).toFixed(2);

  // Search simulation state
  const [searchState, setSearchState] = useState<"idle" | "searching" | "done">("idle");
  const [searchProgress, setSearchProgress] = useState<number>(0);

  // Auto-playing pipeline state
  const [pipelineStep, setPipelineStep] = useState(0);
  const [pipelineRef, pipelineInView] = useInView({ threshold: 0.5 });
  
  useEffect(() => {
    if (!pipelineInView) return;
    const interval = setInterval(() => {
      setPipelineStep((prev) => (prev + 1) % 7);
    }, 2800);
    return () => clearInterval(interval);
  }, [pipelineInView]);

  // Handle Pipeline Builder Toggle
  const togglePipelineBlock = (blockId: number) => {
    if (selectedPipelineBlocks.includes(blockId)) {
      setSelectedPipelineBlocks(prev => prev.filter(b => b !== blockId));
      setPipelineConnected(false);
    } else {
      const next = [...selectedPipelineBlocks, blockId];
      setSelectedPipelineBlocks(next);
      if (next.length === 5) {
        setPipelineConnected(true);
      }
    }
  };

  const resetPipelineBuilder = () => {
    setSelectedPipelineBlocks([]);
    setPipelineConnected(false);
  };

  // Handle Math Quiz Option
  const answerQuiz = (isCorrectChoice: boolean) => {
    setQuizAnswered(true);
    if (isCorrectChoice) {
      setQuizScore(prev => prev + 1);
      setQuizFeedback("🎉 Correct! Raw LLMs guess math numbers, but MineIntel passes calculations to Python code (7.5 ÷ 2.5 = 3.00) to guarantee 100% precision!");
    } else {
      setQuizFeedback("❌ Incorrect! An unverified LLM hallucinated 3.5. MineIntel's Python engine calculates the true ratio 3.00.");
    }
  };

  // Handle Guided Tour Step Jump
  const jumpTourStep = (stepIdx: number) => {
    setTourIndex(stepIdx);
    const targetId = TOUR_STEPS[stepIdx].id;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const startTour = () => {
    setIsTourActive(true);
    jumpTourStep(0);
  };

  const nextTourStep = () => {
    if (tourIndex < TOUR_STEPS.length - 1) {
      jumpTourStep(tourIndex + 1);
    } else {
      setIsTourActive(false);
    }
  };

  const prevTourStep = () => {
    if (tourIndex > 0) {
      jumpTourStep(tourIndex - 1);
    }
  };

  // Run File Scanner Simulator
  const runFileScanner = (filename: string) => {
    setSelectedScanFile(filename);
    setIsScanning(true);
    setScanLog([`[00.1s] Initiating layout parser on ${filename}...`]);

    setTimeout(() => {
      setScanLog(prev => [...prev, `[00.4s] OCR engine detected 2 tables and 4 text blocks.`]);
    }, 600);

    setTimeout(() => {
      setScanLog(prev => [...prev, `[00.8s] Extracted key metric: Coal Production = 2.5 MT.`]);
    }, 1200);

    setTimeout(() => {
      setScanLog(prev => [...prev, `[01.2s] Extracted key metric: Overburden = 7.5 Mm³.`]);
    }, 1800);

    setTimeout(() => {
      setScanLog(prev => [...prev, `[01.5s] Executed Python formula (7.5 / 2.5) -> Ratio = 3.00.`]);
      setIsScanning(false);
    }, 2400);
  };

  // Run Speed Race Simulation
  const runSpeedRace = () => {
    if (raceState === "running") return;
    setRaceState("running");
    setHumanSeconds(0);
    setAiSeconds(0);

    // AI finishes in 0.4s
    setTimeout(() => {
      setAiSeconds(0.4);
    }, 400);

    // Human timer counts up to 45 mins
    let currentHuman = 0;
    const interval = setInterval(() => {
      currentHuman += 5;
      setHumanSeconds(currentHuman);
      if (currentHuman >= 45) {
        clearInterval(interval);
        setRaceState("done");
      }
    }, 150);
  };

  const searchQueries = [
    { query: "What was Mine X coal production in 2024?", doc: "Annual_Report_2024.pdf", val: "2.5 MT", page: "Page 47" },
    { query: "What is the overburden volume for Block B?", doc: "Geology_Survey.pdf", val: "7.5 Mm³", page: "Page 23" },
    { query: "What is the calculated Stripping Ratio?", doc: "Production_2024.xlsx", val: "3.00 Ratio", page: "Sheet 1" }
  ];

  const runSearchSimulation = () => {
    if (searchState !== "idle") return;
    setSearchState("searching");
    setSearchProgress(0);
    setTimeout(() => setSearchProgress(1), 500);
    setTimeout(() => setSearchProgress(2), 1400);
    setTimeout(() => setSearchProgress(3), 2200);
    setTimeout(() => {
      setSearchProgress(4);
      setSearchState("done");
      setTimeout(() => {
        setSearchState("idle");
        setSearchProgress(0);
      }, 4500);
    }, 3000);
  };

  const navLinks = [
    { name: "Context", id: "context" },
    { name: "Problem", id: "problem" },
    { name: "Builder", id: "builder" },
    { name: "Flow", id: "flow" },
    { name: "Search", id: "search" },
    { name: "Verify", id: "verify" },
    { name: "Trust", id: "trust" },
    { name: "Evidence", id: "evidence" },
    { name: "Reports", id: "reports" },
  ];

  const currentNodeInfo = selectedNodeKey ? NODE_EXPLAINERS[selectedNodeKey] : null;

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-surface/95 backdrop-blur-md border-b border-border z-50 flex items-center shadow-sm">
        <div className="w-full max-w-[920px] mx-auto px-5 flex items-center justify-between">
          <div className="font-sans font-bold text-text whitespace-nowrap mr-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent"/> MineIntel
          </div>
          <nav className="flex-1 overflow-x-auto no-scrollbar mask-linear-fade">
            <ul className="flex items-center space-x-5 min-w-max">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="text-textDim hover:text-text transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm px-1 py-0.5">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-4 shrink-0 flex items-center gap-2">
            <button 
              onClick={startTour}
              className="bg-accent2 text-bg px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md hover:bg-accent2/90 transition-all flex items-center gap-1.5"
            >
              <Zap size={14}/> Guided Tour
            </button>
            <button 
              onClick={() => setShowTeamGuide(!showTeamGuide)}
              className="hidden sm:flex items-center gap-1.5 bg-surface2 border border-border text-text px-3 py-1.5 rounded-full text-xs font-bold hover:border-accent transition-all shadow-xs"
            >
              <Lightbulb size={14} className="text-accent"/> Team Explainer
            </button>
            <a href="/studio" className="bg-accent text-bg px-4 py-1.5 rounded-full text-sm font-bold shadow-md hover:bg-accent/90 transition-all flex items-center gap-1.5">
              Open Studio <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </header>

      {/* Floating Guided Tour Bottom Bar */}
      {isTourActive && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg border-2 border-accent2 p-4 rounded-2xl shadow-2xl z-50 max-w-xl w-[92%] flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between border-b border-bg/20 pb-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-accent2">
              <Sparkles size={14}/> INTERACTIVE GUIDED TOUR — STEP {tourIndex + 1} OF {TOUR_STEPS.length}
            </div>
            <button onClick={() => setIsTourActive(false)} className="text-bg/70 hover:text-bg font-mono text-xs">✕ Close Tour</button>
          </div>
          
          <div className="space-y-1">
            <div className="font-bold text-base font-sans text-bg">{TOUR_STEPS[tourIndex].title}</div>
            <p className="text-xs text-bg/80 leading-relaxed font-sans">{TOUR_STEPS[tourIndex].text}</p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button 
              onClick={prevTourStep}
              disabled={tourIndex === 0}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all ${tourIndex === 0 ? 'opacity-30 border-bg/20' : 'bg-surface2/20 border-bg/30 hover:bg-surface2/40'}`}
            >
              <ArrowLeft size={12}/> Previous
            </button>

            <div className="flex gap-1.5">
              {TOUR_STEPS.map((_, idx) => (
                <button key={idx} onClick={() => jumpTourStep(idx)} className={`w-2.5 h-2.5 rounded-full transition-all ${tourIndex === idx ? 'bg-accent2 scale-125' : 'bg-bg/30'}`} />
              ))}
            </div>

            <button 
              onClick={nextTourStep}
              className="bg-accent2 text-bg px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md hover:bg-accent2/90 transition-all"
            >
              {tourIndex === TOUR_STEPS.length - 1 ? 'Finish Tour ✓' : 'Next Step →'}
            </button>
          </div>
        </div>
      )}

      {/* Team Explainer Banner Drawer */}
      {showTeamGuide && (
        <div className="fixed top-14 left-0 right-0 bg-surface border-b-2 border-accent shadow-2xl z-40 p-6 animate-fade-down">
          <div className="max-w-[880px] mx-auto flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-bold text-lg text-text flex items-center gap-2">
                <Sparkles size={18} className="text-accent" /> Simple English Team Guide: How MineIntel Solves Coal Data
              </h3>
              <button onClick={() => setShowTeamGuide(false)} className="text-textDim hover:text-text font-mono text-sm">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-surface2/60 border border-border p-4 rounded-xl">
                <div className="font-bold text-accent mb-1">1. Ingest Scattered Files</div>
                <div className="text-textDim text-xs leading-relaxed">Collects thousands of daily mine PDFs, hand-scanned legacy papers, and Excel sheets from CIL & CMPDI.</div>
              </div>
              <div className="bg-surface2/60 border border-border p-4 rounded-xl">
                <div className="font-bold text-accent mb-1">2. AI Search + Code Math</div>
                <div className="text-textDim text-xs leading-relaxed">AI reads every page in seconds. Deterministic python code does the division so numbers are 100% accurate.</div>
              </div>
              <div className="bg-surface2/60 border border-border p-4 rounded-xl">
                <div className="font-bold text-accent mb-1">3. 100% Traceable Proof</div>
                <div className="text-textDim text-xs leading-relaxed">Every number in reports links directly to the exact highlighted line on the original scanned PDF page.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="w-full max-w-[880px] mx-auto px-5 pt-32 pb-32 space-y-48">
        
        {/* SECTION 1: CONTEXT (CIL / CMPDI) */}
        <AnimatedSection id="context" className="flex flex-col items-center">
          <div className="text-center mb-10 max-w-xl">
            <span className="bg-accent/10 text-accent font-mono text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-accent/20">
              Interactive Architecture Map
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text mt-4 flex items-center justify-center flex-wrap">
              Where the data comes from <InteractiveGuide text="Click on ANY node below (CIL, Mining Operations, PDFs, CMPDI, MINEINTEL AI) to see what it means in simple English!" />
            </h2>
            <p className="text-textDim text-sm md:text-base mt-2">
              Click any box below to inspect how mining data originates and flows into MineIntel.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 w-full items-start">
            
            {/* Left Diagram Column */}
            <div className="flex flex-col items-center w-full font-mono text-sm relative bg-surface2/40 border border-border/70 p-6 rounded-2xl shadow-xs">
              
              {/* CIL Flow */}
              <button 
                onClick={() => setSelectedNodeKey("cil")}
                className={`w-full max-w-md bg-surface border-2 px-6 py-4 rounded-xl shadow-sm text-lg font-bold flex items-center justify-between gap-3 transition-all ${selectedNodeKey === "cil" ? 'border-accent text-accent scale-105 shadow-lg ring-4 ring-accent/20' : 'border-accent/50 text-accent hover:border-accent'}`}
              >
                <span className="flex items-center gap-3"><Factory /> CIL — Coal India Limited</span>
                <span className="text-xs bg-accent/10 px-2 py-0.5 rounded font-sans font-normal">Click to explore</span>
              </button>
              <div className="text-center text-textDim mt-2 font-sans text-xs max-w-sm">
                Large-scale coal mining operations across 300+ mines.
              </div>
              
              <div className="w-px h-12 bg-border my-2 relative overflow-hidden">
                 <div className="absolute inset-0 w-full animate-flow-dash"></div>
                 <div className="w-2 h-2 rounded-full bg-accent absolute top-0 left-1/2 -translate-x-1/2 animate-particle-down"></div>
              </div>
              
              <button 
                onClick={() => setSelectedNodeKey("ops")}
                className={`bg-surface2 border px-6 py-2.5 rounded-full flex items-center gap-2 transition-all ${selectedNodeKey === "ops" ? 'border-accent text-accent font-bold scale-105 shadow-md ring-2 ring-accent/30' : 'border-border text-text hover:border-accent'}`}
              >
                <Settings size={18}/> Mining Operations
              </button>
              
              <div className="w-px h-12 bg-border my-2 relative overflow-hidden">
                 <div className="absolute inset-0 w-full animate-flow-dash"></div>
                 <div className="w-2 h-2 rounded-full bg-accent absolute top-0 left-1/2 -translate-x-1/2 animate-particle-down"></div>
              </div>
              
              <button 
                onClick={() => setSelectedNodeKey("records")}
                className={`bg-surface border-2 px-8 py-3 rounded-xl shadow-sm font-bold text-base text-text transition-all ${selectedNodeKey === "records" ? 'border-accent text-accent scale-105 shadow-lg ring-2 ring-accent/30' : 'border-border hover:border-accent'}`}
              >
                Mining Records
              </button>
              
              <div className="w-px h-8 bg-border my-2 relative overflow-hidden">
                 <div className="absolute inset-0 w-full animate-flow-dash-text"></div>
              </div>
              
              <div className="w-64 border-t-2 border-border h-4 border-l-2 border-r-2 flex justify-between rounded-t relative overflow-hidden"></div>
              
              <button 
                onClick={() => setSelectedNodeKey("files")}
                className={`flex justify-between w-80 text-text p-2 rounded-xl border transition-all ${selectedNodeKey === "files" ? 'border-accent bg-accent/5 ring-2 ring-accent/30 scale-105' : 'border-transparent hover:border-border'}`}
              >
                <div className="bg-surface border border-border p-2.5 flex flex-col items-center gap-1.5 shadow-xs rounded-lg hover:-translate-y-1 transition-transform w-24">
                  <FileText className="text-accent" size={20}/>
                  <span className="text-xs font-bold">PDFs</span>
                </div>
                <div className="bg-surface border border-border p-2.5 flex flex-col items-center gap-1.5 shadow-xs rounded-lg hover:-translate-y-1 transition-transform w-24">
                  <ScanText className="text-textDim" size={20}/>
                  <span className="text-xs font-bold">Scans</span>
                </div>
                <div className="bg-surface border border-border p-2.5 flex flex-col items-center gap-1.5 shadow-xs rounded-lg hover:-translate-y-1 transition-transform w-24">
                  <FileSpreadsheet className="text-accent2" size={20}/>
                  <span className="text-xs font-bold">Sheets</span>
                </div>
              </button>
              
              <div className="w-px h-16 bg-border my-3 relative overflow-hidden">
                 <div className="absolute inset-0 w-full animate-flow-dash-text"></div>
              </div>
              
              {/* CMPDI Flow */}
              <button 
                onClick={() => setSelectedNodeKey("cmpdi")}
                className={`w-full max-w-md bg-surface border-2 px-6 py-4 rounded-xl shadow-sm text-lg font-bold flex items-center justify-between gap-3 transition-all ${selectedNodeKey === "cmpdi" ? 'border-accent2 text-accent2 scale-105 shadow-lg ring-4 ring-accent2/20' : 'border-accent2/50 text-accent2 hover:border-accent2'}`}
              >
                <span className="flex items-center gap-3"><Map /> CMPDI</span>
                <span className="text-xs bg-accent2/10 px-2 py-0.5 rounded font-sans font-normal">Mine Planning & Geology</span>
              </button>
              <div className="text-center text-textDim mt-2 font-sans text-xs max-w-sm">
                CIL subsidiary for mine design, exploration, and geological survey.
              </div>
              
              <div className="w-px h-12 bg-border my-2 relative overflow-hidden">
                 <div className="absolute inset-0 w-full animate-flow-dash-2"></div>
              </div>
              
              <button 
                onClick={() => setSelectedNodeKey("planning")}
                className={`bg-surface2 border px-6 py-2.5 rounded-full flex flex-col items-center text-center text-xs transition-all ${selectedNodeKey === "planning" ? 'border-accent2 text-accent2 font-bold scale-105 shadow-md ring-2 ring-accent2/30' : 'border-border text-text hover:border-accent2'}`}
              >
                <div>Planning / Design / Geology</div>
              </button>
              
              <div className="w-px h-12 bg-border my-2 relative overflow-hidden">
                 <div className="absolute inset-0 w-full animate-flow-dash-2"></div>
              </div>
              
              <button 
                onClick={() => setSelectedNodeKey("tech_records")}
                className={`bg-surface border-2 px-8 py-3 rounded-xl shadow-sm font-bold text-base text-text transition-all ${selectedNodeKey === "tech_records" ? 'border-accent2 text-accent2 scale-105 shadow-lg ring-2 ring-accent2/30' : 'border-border hover:border-accent2'}`}
              >
                Technical Records
              </button>
              
              <div className="w-px h-16 bg-border my-3 relative overflow-hidden">
                 <div className="absolute inset-0 w-full animate-flow-dash-text"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-accent absolute top-0 left-1/2 -translate-x-1/2 animate-particle-down"></div>
              </div>
              
              <button 
                onClick={() => setSelectedNodeKey("mineintel")}
                className={`bg-text text-bg px-8 py-5 text-2xl font-bold rounded-2xl shadow-2xl flex items-center gap-3 transition-all ${selectedNodeKey === "mineintel" ? 'ring-4 ring-accent scale-105 shadow-accent/20' : 'hover:scale-102'}`}
              >
                <ShieldCheck size={32} className="text-accent2"/> MINEINTEL AI
              </button>
              
            </div>

            {/* Right Side Simple Explainer Card */}
            <div className="bg-surface border-2 border-accent/40 rounded-2xl p-6 shadow-xl sticky top-20 flex flex-col gap-4 animate-fade-up">
              {currentNodeInfo ? (
                <>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2 text-accent">
                      <currentNodeInfo.icon size={22} />
                      <span className="font-bold text-lg font-sans text-text">{currentNodeInfo.title}</span>
                    </div>
                  </div>
                  
                  <span className="bg-accent/10 text-accent font-mono text-xs px-2.5 py-1 rounded-md font-bold w-fit">
                    {currentNodeInfo.tag}
                  </span>

                  <div className="space-y-3 font-sans text-sm">
                    <div>
                      <div className="font-bold text-text text-xs uppercase tracking-wider text-textDim mb-1">Simple English Summary</div>
                      <p className="text-text leading-relaxed font-medium">{currentNodeInfo.summary}</p>
                    </div>

                    <div className="bg-surface2/60 p-3 rounded-lg border border-border">
                      <div className="font-bold text-accent text-xs uppercase tracking-wider mb-1">What Happens Here</div>
                      <p className="text-textDim text-xs leading-relaxed">{currentNodeInfo.detail}</p>
                    </div>

                    <div className="bg-accent2/10 p-3 rounded-lg border border-accent2/20">
                      <div className="font-bold text-accent2 text-xs uppercase tracking-wider mb-1">Real-World Example</div>
                      <p className="text-text text-xs font-mono">{currentNodeInfo.example}</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-textDim text-center pt-2 font-mono">
                    💡 Click another node on the map to switch topics
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-textDim text-sm">
                  Click any node on the left map to see simple explanations.
                </div>
              )}
            </div>

          </div>
        </AnimatedSection>

        {/* SECTION 2: DATA EVERYWHERE */}
        <AnimatedSection className="flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text flex items-center max-w-2xl justify-center">
            A mining organization generates information everywhere. <InteractiveGuide text="Keep scrolling to see how thousands of documents stack up." />
          </h2>
          
          <div className="relative w-72 h-64 mt-16 flex items-center justify-center">
             {[
               { icon: FileText, label: "Annual Report 2024", rotate: "-rotate-6", delay: "delay-100" },
               { icon: Map, label: "Geological Survey", rotate: "rotate-3", delay: "delay-300" },
               { icon: Layers, label: "Borehole Record B12", rotate: "-rotate-12", delay: "delay-500" },
               { icon: FileSpreadsheet, label: "Production Shift Log", rotate: "rotate-12", delay: "delay-700" },
               { icon: ScanText, label: "Legacy Mine Scan 2008", rotate: "-rotate-3", delay: "delay-[900ms]" },
               { icon: Database, label: "CMPDI Tech Report", rotate: "rotate-6", delay: "delay-[1100ms]" },
             ].map((doc, i) => {
               const [docRef, docInView] = useInView();
               return (
                 <div key={i} ref={docRef} className={`absolute w-52 bg-surface border-2 border-border p-4 shadow-2xl rounded-xl flex items-center gap-3 font-mono text-sm text-text transition-all duration-700 ease-out hover:scale-110 cursor-pointer ${doc.rotate} ${docInView ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-110 -translate-y-24'}`} style={{ zIndex: i }}>
                   <doc.icon className="text-accent shrink-0" size={20}/>
                   <span className="truncate font-bold text-xs">{doc.label}</span>
                 </div>
               )
             })}
          </div>
          
          <div className="text-2xl font-bold text-text mt-8">Thousands of records</div>
          <p className="text-textDim text-base md:text-lg mt-3 max-w-xl leading-relaxed">
            The information exists in binders and servers. Finding the exact page and verifying the numbers is the real challenge.
          </p>

          {/* INTERACTIVE SPEED RACE SIMULATOR */}
          <div className="w-full max-w-xl bg-surface2 border-2 border-accent/30 rounded-2xl p-6 mt-10 shadow-lg space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="font-bold text-text flex items-center gap-2">
                <Zap className="text-accent2" size={20}/> Interactive Speed Test: Human Engineer vs MineIntel AI
              </div>
              <button 
                onClick={runSpeedRace} 
                disabled={raceState === "running"}
                className="bg-accent text-bg px-4 py-1.5 rounded-full text-xs font-bold hover:bg-accent/90 transition-all shadow-xs flex items-center gap-1"
              >
                {raceState === "running" ? <RotateCcw size={12} className="animate-spin"/> : <Play size={12}/>} Run Test
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface p-4 rounded-xl border border-border flex flex-col justify-between">
                <div className="text-xs font-bold text-textDim uppercase">Manual Engineer Search</div>
                <div className="text-3xl font-mono font-bold text-text my-2 flex items-baseline gap-1">
                  {humanSeconds} <span className="text-xs text-textDim">minutes</span>
                </div>
                <div className="text-xs text-textDim">Opening folders, PDF scrolling, manual eye verification...</div>
              </div>

              <div className="bg-surface p-4 rounded-xl border-2 border-accent2/50 flex flex-col justify-between">
                <div className="text-xs font-bold text-accent2 uppercase flex items-center gap-1">
                  <ShieldCheck size={14}/> MineIntel AI Search
                </div>
                <div className="text-3xl font-mono font-bold text-accent2 my-2 flex items-baseline gap-1">
                  {aiSeconds ? '0.4' : '0.0'} <span className="text-xs text-accent2">seconds</span>
                </div>
                <div className="text-xs text-accent2 font-medium">Vector search + 100% Python verified math!</div>
              </div>
            </div>
          </div>

        </AnimatedSection>

        {/* SECTION 3: THE PROBLEM */}
        <AnimatedSection id="problem" className="flex flex-col gap-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-accent/10 blur-[100px] -z-10 rounded-full mix-blend-multiply pointer-events-none"></div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-text leading-tight max-w-3xl tracking-tight flex items-center flex-wrap">
            One key metric, buried in three different files. <InteractiveGuide text="Hover over each document card below to see where the exact number lives." />
          </h1>
          
          <div className="mt-8 flex flex-col gap-12 relative overflow-hidden py-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
              <div className="bg-surface border-2 border-border p-6 flex flex-col gap-4 rounded-xl shadow-lg hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center text-accent"><FileText size={18} /></div>
                  <div className="font-mono text-xs text-textDim truncate">Annual_Report_2024.pdf</div>
                </div>
                <div className="text-text font-bold text-xl leading-snug">Coal production</div>
                <div className="font-mono bg-accent/10 text-accent px-3 py-1.5 rounded-lg w-fit border border-accent/30 font-bold text-lg">2.5 million tonnes</div>
                <div className="text-xs text-textDim mt-2">Source: Page 47</div>
              </div>
              
              <div className="bg-surface border-2 border-border p-6 flex flex-col gap-4 rounded-xl shadow-lg hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center text-accent"><ScanText size={18} /></div>
                  <div className="font-mono text-xs text-textDim truncate">Geology_Survey.pdf</div>
                </div>
                <div className="text-text font-bold text-xl leading-snug">Overburden volume</div>
                <div className="font-mono bg-accent/10 text-accent px-3 py-1.5 rounded-lg w-fit border border-accent/30 font-bold text-lg">7.5 million m³</div>
                <div className="text-xs text-textDim mt-2">Source: Page 23</div>
              </div>
              
              <div className="bg-surface border-2 border-border p-6 flex flex-col gap-4 rounded-xl shadow-lg hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center text-accent2"><FileSpreadsheet size={18} /></div>
                  <div className="font-mono text-xs text-textDim truncate">Production_2024.xlsx</div>
                </div>
                <div className="text-text font-bold text-xl leading-snug">Calculated Ratio</div>
                <div className="font-mono bg-accent2/10 text-accent2 px-3 py-1.5 rounded-lg w-fit border border-accent2/30 font-bold text-lg">3.00 Ratio</div>
                <div className="text-xs text-textDim mt-2">Source: Sheet 1 (Calculated)</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider text-textDim font-mono flex-wrap bg-surface2/60 p-4 rounded-xl border border-border">
              <span className="text-accent flex items-center gap-1">1. Find</span> <ArrowRight size={14}/>
              <span className="text-accent flex items-center gap-1">2. Extract</span> <ArrowRight size={14}/>
              <span className="text-accent flex items-center gap-1">3. Verify</span> <ArrowRight size={14}/>
              <span className="text-accent2 flex items-center gap-1">4. Calculate</span>
            </div>
            
          </div>
        </AnimatedSection>

        {/* NEW MINI-GAME: PIPELINE BUILDER PLAYGROUND */}
        <AnimatedSection id="builder" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="bg-accent2/10 text-accent2 font-mono text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-accent2/20 w-fit flex items-center gap-1.5">
              <Trophy size={14}/> Mini-Game Playground
            </span>
            <h2 className="text-3xl font-bold text-text flex items-center flex-wrap">
              Build Your Mine Pipeline <InteractiveGuide text="Click on the 5 building blocks below in order to construct an automated data processor!" />
            </h2>
          </div>

          <div className="bg-surface2 border-2 border-accent2/40 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="text-xs font-mono text-textDim">
                Click blocks to activate components (5 required):
              </div>
              <button onClick={resetPipelineBuilder} className="text-xs font-mono text-accent hover:underline flex items-center gap-1">
                <RotateCcw size={12}/> Reset Blocks
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { id: 1, name: "1. CIL Report", icon: Factory, color: "text-accent" },
                { id: 2, name: "2. OCR Parser", icon: ScanText, color: "text-text" },
                { id: 3, name: "3. Vector RAG", icon: Database, color: "text-accent2" },
                { id: 4, name: "4. Python Math", icon: Calculator, color: "text-accent2" },
                { id: 5, name: "5. Pitch Deck", icon: FileText, color: "text-accent" },
              ].map((block) => (
                <button
                  key={block.id}
                  onClick={() => togglePipelineBlock(block.id)}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all font-mono text-xs font-bold ${selectedPipelineBlocks.includes(block.id) ? 'bg-surface border-accent2 text-accent2 scale-105 shadow-md ring-2 ring-accent2/30' : 'bg-surface/50 border-border text-textDim hover:border-accent2/50'}`}
                >
                  <block.icon size={24} className={block.color}/>
                  <span>{block.name}</span>
                  {selectedPipelineBlocks.includes(block.id) && <Check size={16} className="text-accent2 mt-1"/>}
                </button>
              ))}
            </div>

            {pipelineConnected ? (
              <div className="bg-accent2/10 border-2 border-accent2 text-accent2 p-5 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-up">
                <div className="flex items-center gap-3">
                  <Trophy size={28}/>
                  <div>
                    <div className="font-bold text-base font-sans">🎉 Pipeline Connected & Verified!</div>
                    <div className="text-xs font-mono text-text">Ingested 1,200 Mine Reports. Coal Production 2.5 MT + Overburden 7.5 Mm³ ➔ Stripping Ratio 3.00.</div>
                  </div>
                </div>
                <a href="/studio" className="bg-accent2 text-bg px-4 py-2 rounded-full font-bold text-xs shrink-0 hover:bg-accent2/90 shadow-md">
                  Export to Pitch Deck →
                </a>
              </div>
            ) : (
              <div className="text-center py-4 text-xs font-mono text-textDim border border-dashed border-border rounded-xl">
                Select all 5 blocks above to activate your custom MineIntel pipeline! ({selectedPipelineBlocks.length}/5 selected)
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* SECTION 4: CORE PIPELINE & FILE SCANNER SIMULATOR */}
        <AnimatedSection id="flow" className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="bg-accent/10 text-accent font-mono text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-accent/20 w-fit">
              Step-by-Step Story Mode
            </span>
            <h2 className="text-3xl font-bold text-text flex items-center flex-wrap">
              The MineIntel Pipeline <InteractiveGuide text="Click any step on the left to manually explore what happens, or watch it step automatically." />
            </h2>
          </div>
          
          <div ref={pipelineRef} className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 bg-surface2 border border-border rounded-2xl overflow-hidden shadow-sm p-6">
            
            {/* Steps list */}
            <div className="flex flex-col gap-2 relative">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-border z-0"></div>
              {[
                { id: 0, label: "01 Upload PDF" },
                { id: 1, label: "02 OCR Extract" },
                { id: 2, label: "03 Vector Index" },
                { id: 3, label: "04 User Question" },
                { id: 4, label: "05 Page Retrieve" },
                { id: 5, label: "06 Code Math" },
                { id: 6, label: "07 Verified Report" },
              ].map((step) => (
                <button key={step.id} onClick={() => setPipelineStep(step.id)} className={`relative z-10 flex items-center gap-4 p-2.5 transition-all rounded-xl ${pipelineStep === step.id ? 'bg-surface shadow-md text-accent font-bold scale-105 border border-accent/40' : 'text-textDim hover:text-text hover:bg-surface/50'}`}>
                   <div className={`w-3 h-3 rounded-full ${pipelineStep === step.id ? 'bg-accent ring-4 ring-accent/20' : 'bg-border'}`}></div>
                   <span className="font-mono text-xs md:text-sm">{step.label}</span>
                </button>
              ))}
            </div>
            
            {/* Display Area */}
            <div className="bg-surface border border-border rounded-xl shadow-inner flex flex-col items-center justify-center p-8 min-h-[320px] relative overflow-hidden">
              
              {pipelineStep === 0 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                    <UploadCloud size={36}/>
                  </div>
                  <div className="text-xl font-bold text-text">Step 1: Document Upload</div>
                  <p className="text-textDim text-sm leading-relaxed">
                    PDFs, scanned images, and Excel spreadsheets enter the system securely. MineIntel automatically tags them with mine site, year, and author metadata.
                  </p>
                </div>
              )}
              {pipelineStep === 1 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                    <ScanText size={36}/>
                  </div>
                  <div className="text-xl font-bold text-text">Step 2: Intelligent OCR Text Extraction</div>
                  <p className="text-textDim text-sm leading-relaxed">
                    Optical Character Recognition converts blurry hand-scanned pages into digital text and tables.
                  </p>
                </div>
              )}
              {pipelineStep === 2 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                    <Database size={36}/>
                  </div>
                  <div className="text-xl font-bold text-text">Step 3: Vector Indexing & Semantic Search</div>
                  <p className="text-textDim text-sm leading-relaxed">
                    Text is broken into semantic chunks and converted into high-dimensional vector embeddings stored in a vector database.
                  </p>
                </div>
              )}
              {pipelineStep === 3 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                    <MessageSquare size={36}/>
                  </div>
                  <div className="text-xl font-bold text-text">Step 4: Ask in Plain English</div>
                  <div className="bg-surface2 text-text px-4 py-2 rounded-xl font-mono text-sm border border-border shadow-xs">
                    "What was Mine X production and stripping ratio in 2024?"
                  </div>
                </div>
              )}
              {pipelineStep === 4 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                    <Search size={36}/>
                  </div>
                  <div className="text-xl font-bold text-text">Step 5: Precise Page Retrieval (RAG)</div>
                  <p className="text-textDim text-sm leading-relaxed">
                    MineIntel searches 10,000 pages in milliseconds and highlights the 2 exact pages containing the verified numbers.
                  </p>
                </div>
              )}
              {pipelineStep === 5 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-accent2/10 border border-accent2/30 flex items-center justify-center text-accent2">
                    <Calculator size={36}/>
                  </div>
                  <div className="text-xl font-bold text-text">Step 6: Deterministic Code Math</div>
                  <div className="font-mono bg-surface2 text-text px-5 py-2 rounded-xl text-lg font-bold border border-border">
                    7.5 ÷ 2.5 = 3.00 Ratio
                  </div>
                  <p className="text-textDim text-xs leading-relaxed">
                    Calculations are run through Python code, avoiding AI math mistakes.
                  </p>
                </div>
              )}
              {pipelineStep === 6 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-accent2/10 border border-accent2/30 flex items-center justify-center text-accent2">
                    <FileText size={36}/>
                  </div>
                  <div className="text-xl font-bold text-text">Step 7: Traceable Verified Report</div>
                  <p className="text-textDim text-sm leading-relaxed">
                    Generates a pitch slide or executive summary report where every number has a 1-click link back to the original PDF scan line.
                  </p>
                </div>
              )}
              
            </div>
          </div>

          {/* INTERACTIVE FILE SCANNER MINI SIMULATOR */}
          <div className="bg-surface border-2 border-accent/30 rounded-2xl p-6 shadow-md flex flex-col gap-4">
            <div className="font-bold text-text text-base flex items-center gap-2">
              <ScanText size={20} className="text-accent"/> Try the Interactive OCR File Scanner:
            </div>
            <p className="text-xs text-textDim leading-relaxed">
              Click a sample document below to watch how MineIntel's OCR layout engine scans pages and extracts text live!
            </p>

            <div className="flex flex-wrap gap-3">
              {["Annual_Report_2024.pdf", "Geology_Survey.pdf", "Production_Sheet.xlsx"].map((fname) => (
                <button
                  key={fname}
                  onClick={() => runFileScanner(fname)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all ${selectedScanFile === fname ? 'bg-accent text-bg border-accent shadow-md' : 'bg-surface2 text-text border-border hover:border-accent'}`}
                >
                  <FileText size={14}/> {fname}
                </button>
              ))}
            </div>

            {selectedScanFile && (
              <div className="bg-black/90 text-green-400 p-4 rounded-xl font-mono text-xs space-y-1 shadow-inner relative overflow-hidden">
                {isScanning && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-accent animate-pulse"></div>
                )}
                {scanLog.map((logLine, idx) => (
                  <div key={idx} className="animate-fade-in">{logLine}</div>
                ))}
              </div>
            )}
          </div>

        </AnimatedSection>

        {/* SECTION 5: RAG RETRIEVAL SIMULATION */}
        <AnimatedSection id="search" className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-text flex items-center flex-wrap">
            How Retrieval works (RAG) <InteractiveGuide text="Click the query button below to test a live simulation of AI retrieval." />
          </h2>
          <p className="text-textDim text-base md:text-lg leading-relaxed">
            The system acts like a hyper-fast librarian. It doesn't guess numbers from memory — it scans thousands of pages and isolates the exact 2 source pages needed.
          </p>
          
          <div className="bg-surface2 border border-border rounded-2xl p-8 flex flex-col items-center gap-8 shadow-sm">
             
             {/* Query Switcher Buttons */}
             <div className="flex flex-wrap justify-center gap-2 w-full max-w-xl">
               {searchQueries.map((item, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setSearchQueryIndex(idx)}
                   className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${searchQueryIndex === idx ? 'bg-accent text-bg font-bold border-accent shadow-xs' : 'bg-surface text-textDim border-border hover:border-accent'}`}
                 >
                   Query {idx + 1}
                 </button>
               ))}
             </div>

             <button 
               onClick={runSearchSimulation}
               disabled={searchState !== "idle"}
               className={`font-mono bg-surface border-2 px-6 py-4 rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-xl transition-all ${searchState !== "idle" ? 'border-accent ring-4 ring-accent/20' : 'border-border hover:border-accent cursor-pointer'}`}
             >
                <div className="flex items-center gap-3 text-text">
                  <Search size={20} className={searchState !== "idle" ? "text-accent animate-spin" : "text-textDim"} />
                  <span className="text-sm font-bold">"{searchQueries[searchQueryIndex].query}"</span>
                </div>
                {searchState === "idle" && (
                  <span className="text-xs bg-accent text-bg px-3 py-1 rounded-full font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                    <Sparkles size={12}/> Run AI Search
                  </span>
                )}
             </button>
             
             <ArrowDown className={`text-textDim transition-all ${searchProgress >= 1 ? 'animate-bounce text-accent' : ''}`} />
             
             <div className={`flex flex-col items-center transition-opacity duration-500 ${searchState === "idle" ? 'opacity-30 grayscale' : 'opacity-100'}`}>
                <div className="text-xs font-bold text-textDim uppercase tracking-wider mb-3">Scanning 100 Mining Documents</div>
                <div className="flex flex-wrap justify-center gap-1.5 w-64">
                   {Array.from({length: 100}).map((_, i) => <div key={i} className={`w-3 h-3 rounded-sm transition-colors duration-300 ${searchProgress >= 1 ? (i % 17 === 0 ? 'bg-accent animate-pulse' : 'bg-border') : 'bg-border'}`} />)}
                </div>
             </div>
             
             <div className={`flex flex-col items-center transition-opacity duration-500 ${searchState === "idle" ? 'opacity-30 grayscale' : (searchProgress >= 2 ? 'opacity-100' : 'opacity-30')}`}>
                <div className="text-xs font-bold text-accent uppercase tracking-wider mb-3">5 Relevant Passages Filtered</div>
                <div className="flex gap-3">
                   {Array.from({length: 5}).map((_, i) => <div key={i} className="w-8 h-12 bg-surface border-2 border-accent rounded-md shadow-xs" />)}
                </div>
             </div>
             
             <div className={`flex flex-col items-center transition-opacity duration-500 ${searchState === "idle" ? 'opacity-30 grayscale' : (searchProgress >= 3 ? 'opacity-100' : 'opacity-30')}`}>
                <div className="text-xs font-bold text-accent2 uppercase tracking-wider mb-3">Verified Source Found</div>
                <div className="flex gap-4">
                   <div className="px-5 py-2.5 bg-accent2 text-bg font-bold font-mono text-sm rounded-xl shadow-lg flex items-center gap-2">
                     <CheckCircle2 size={16}/> {searchQueries[searchQueryIndex].doc} ({searchQueries[searchQueryIndex].page})
                   </div>
                </div>
             </div>
             
             <div className={`bg-surface border-2 p-5 text-center rounded-xl shadow-lg font-bold text-lg max-w-sm transition-all duration-500 ${searchProgress >= 4 ? 'border-accent2 text-text scale-105 ring-4 ring-accent2/20' : 'border-border text-textDim opacity-30 grayscale'}`}>
               AI Answer: "{searchQueries[searchQueryIndex].val}" (Cited from {searchQueries[searchQueryIndex].page})
             </div>
          </div>
        </AnimatedSection>

        {/* SECTION 6: INTERACTIVE MATH CALCULATOR & MATH QUIZ */}
        <AnimatedSection id="verify" className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="bg-accent2/10 text-accent2 font-mono text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-accent2/20 w-fit">
              Interactive Math Demo
            </span>
            <h2 className="text-3xl font-bold text-text flex items-center flex-wrap">
              The AI explains. Code verifies. <InteractiveGuide text="Drag the sliders below to test how the python code computes stripping ratio live!" />
            </h2>
          </div>
          <p className="text-textDim text-base md:text-lg leading-relaxed">
            Language models can make arithmetic errors when dividing big numbers. MineIntel passes numbers to a deterministic Python engine to calculate ratios with 100% precision.
          </p>

          <div className="bg-surface2 border border-border rounded-2xl p-8 shadow-sm flex flex-col gap-8">
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* Sliders Box */}
                <div className="bg-surface border border-border p-6 rounded-xl space-y-6">
                   <div className="font-bold text-text flex items-center gap-2">
                     <Calculator size={18} className="text-accent"/> Try the Math Controls:
                   </div>

                   <div>
                     <div className="flex justify-between text-xs font-mono font-bold text-text mb-2">
                       <span>Overburden Waste Rock (m³):</span>
                       <span className="text-accent text-sm">{calcOverburden} million m³</span>
                     </div>
                     <input 
                       type="range" 
                       min="1.0" 
                       max="20.0" 
                       step="0.5" 
                       value={calcOverburden} 
                       onChange={(e) => setCalcOverburden(parseFloat(e.target.value))}
                       className="w-full accent-accent cursor-pointer"
                     />
                   </div>

                   <div>
                     <div className="flex justify-between text-xs font-mono font-bold text-text mb-2">
                       <span>Coal Production (Tonnes):</span>
                       <span className="text-accent2 text-sm">{calcProduction} million tonnes</span>
                     </div>
                     <input 
                       type="range" 
                       min="0.5" 
                       max="10.0" 
                       step="0.5" 
                       value={calcProduction} 
                       onChange={(e) => setCalcProduction(parseFloat(e.target.value))}
                       className="w-full accent-accent2 cursor-pointer"
                     />
                   </div>
                </div>

                {/* Calculation Output */}
                <div className="flex flex-col items-center justify-center gap-4 bg-surface border-2 border-accent2/40 p-6 rounded-xl shadow-inner text-center">
                   <div className="text-xs font-mono font-bold text-textDim uppercase tracking-wider">
                     Deterministic Calculation Formula
                   </div>
                   <div className="font-mono text-xl font-bold text-text bg-surface2 px-4 py-2 rounded-lg border border-border">
                     {calcOverburden} ÷ {calcProduction}
                   </div>
                   <ArrowDown className="text-accent2 animate-bounce" />
                   <div className="text-5xl font-mono font-extrabold text-accent2 tracking-tight">
                     {calculatedRatio}
                   </div>
                   <div className="text-xs font-mono text-textDim">Stripping Ratio (Waste ÷ Coal)</div>
                   <div className="bg-accent2/10 text-accent2 border border-accent2/30 px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5">
                     <CheckCircle2 size={14}/> 100% Python Verified Math
                   </div>
                </div>

             </div>

             {/* NEW MINI-GAME 2: MATH QUIZ */}
             <div className="bg-surface p-6 rounded-xl border border-border space-y-4 text-left">
               <div className="flex items-center justify-between border-b border-border pb-2">
                 <div className="font-bold text-text text-sm flex items-center gap-2">
                   <Target className="text-accent2" size={18}/> Mini Quiz: Test Your AI Math Knowledge
                 </div>
                 <div className="font-mono text-xs font-bold text-accent2">Score: {quizScore}</div>
               </div>

               <p className="text-xs text-textDim">
                 Scenario: Overburden = 7.5 million m³, Production = 2.5 million tonnes. An unverified AI chatbot claims: "Stripping Ratio is 3.5". Is the AI chatbot correct?
               </p>

               <div className="flex flex-wrap gap-3">
                 <button
                   onClick={() => answerQuiz(false)}
                   disabled={quizAnswered}
                   className="bg-surface2 border border-border px-4 py-2 rounded-xl text-xs font-bold text-text hover:border-accent transition-all"
                 >
                   ✓ Yes, trust the AI chatbot
                 </button>
                 <button
                   onClick={() => answerQuiz(true)}
                   disabled={quizAnswered}
                   className="bg-accent text-bg px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-accent/90 transition-all"
                 >
                   ❌ No! Raw LLMs hallucinate math, real ratio is 3.00!
                 </button>
               </div>

               {quizFeedback && (
                 <div className="bg-accent2/10 border border-accent2/30 text-accent2 p-3 rounded-xl text-xs font-bold animate-fade-in">
                   {quizFeedback}
                 </div>
               )}
             </div>

          </div>
        </AnimatedSection>

        {/* SECTION 7: TRUST & CONFLICTS */}
        <AnimatedSection id="trust" className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-text flex items-center flex-wrap">
            Honest about conflicts and missing data <InteractiveGuide text="Review these cards to see how MineIntel flags discrepancies instead of guessing." />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Conflict Visual */}
            <div className="bg-surface2 border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center gap-6">
               <h3 className="font-bold text-text text-lg text-center flex items-center gap-2">
                 <AlertTriangle size={18} className="text-danger"/> Conflict Detection
               </h3>
               
               <div className="flex items-center gap-4 w-full justify-center text-text">
                 <div className="bg-surface border-2 border-border p-4 rounded-xl text-center shadow-sm w-32">
                    <div className="text-xs text-textDim mb-1 truncate">Doc A (Page 12)</div>
                    <div className="font-mono text-lg font-bold">2.5 MT</div>
                 </div>
                 
                 <div className="flex flex-col items-center text-danger font-bold text-xs">
                    <AlertTriangle className="w-6 h-6 animate-pulse mb-1" />
                    <span>Mismatch</span>
                 </div>
                 
                 <div className="bg-surface border-2 border-border p-4 rounded-xl text-center shadow-sm w-32">
                    <div className="text-xs text-textDim mb-1 truncate">Doc B (Page 4)</div>
                    <div className="font-mono text-lg font-bold">2.7 MT</div>
                 </div>
               </div>
               
               <div className="bg-danger/10 text-danger border border-danger/20 px-4 py-2.5 rounded-xl text-xs font-medium text-center max-w-sm">
                 Human review required. MineIntel flags conflict instead of guessing.
               </div>
            </div>

            {/* Abstention Visual */}
            <div className="bg-surface2 border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center gap-6">
               <h3 className="font-bold text-text text-lg text-center flex items-center gap-2">
                 <XCircle size={18} className="text-textDim"/> Missing Evidence Refusal
               </h3>
               
               <div className="font-mono bg-surface text-text border border-border px-4 py-2 text-xs shadow-xs rounded-xl flex items-center gap-2">
                 <Search size={14} className="text-textDim"/> Mine X production in year 1995
               </div>
               
               <div className="flex flex-col items-center gap-2 text-textDim text-xs text-center">
                 <XCircle size={28} className="text-danger"/>
                 <div className="font-medium">No reliable document found in CIL archives.<br/><span className="font-bold text-text">MineIntel refuses to hallucinate data.</span></div>
               </div>
            </div>
            
          </div>
        </AnimatedSection>

        {/* SECTION 8: PROVENANCE & INTERACTIVE DOCUMENT EVIDENCE MODAL */}
        <AnimatedSection id="evidence" className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-text flex items-center flex-wrap">
            Every number leads back to its source page <InteractiveGuide text="Click the button below to inspect the original highlighted scanned PDF page proof!" />
          </h2>
          
          <div className="bg-surface2 border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center gap-6 text-center">
             
             <div className="text-5xl font-mono font-extrabold text-text">
               2.5 MT
             </div>
             
             <div className="flex flex-wrap justify-center gap-3 font-mono text-xs bg-surface text-text border-2 border-border p-5 rounded-xl shadow-md">
               <div className="flex gap-2"><span className="text-textDim">Source:</span> <span className="font-bold">Annual_Report_2024.pdf</span></div>
               <div className="flex gap-2"><span className="text-textDim">Page:</span> <span className="font-bold">47</span></div>
               <div className="flex gap-2"><span className="text-textDim">Confidence:</span> <span className="text-accent2 font-bold flex items-center gap-1">96% <CheckCircle2 size={14}/></span></div>
             </div>

             <button 
               onClick={() => setShowEvidenceModal(true)}
               className="bg-accent text-bg px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-accent/90 transition-all flex items-center gap-2"
             >
               <Eye size={18}/> 🔍 Open Interactive Document Proof
             </button>
             
          </div>
        </AnimatedSection>

        {/* SECTION 9: REPORTS & PITCH DECK STUDIO */}
        <AnimatedSection id="reports" className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-text flex items-center flex-wrap">
            Verified facts assemble the pitch deck <InteractiveGuide text="Hover over rows in the report below to trace back to source pages, or open Studio to build slides." />
          </h2>
          
          <div className="flex flex-col items-center">
            
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <div className="bg-text text-bg px-4 py-2 font-mono text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"><CheckCircle2 size={14}/> 2.5 MT Production</div>
              <div className="bg-text text-bg px-4 py-2 font-mono text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"><CheckCircle2 size={14}/> 7.5 Mm³ Overburden</div>
              <div className="bg-accent2 text-bg px-4 py-2 font-mono text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"><CheckCircle2 size={14}/> 3.00 Stripping Ratio</div>
            </div>
            
            <div className="bg-surface border-2 border-border p-8 shadow-2xl w-full max-w-md rounded-2xl relative group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out"></div>
              
              <h3 className="text-xl font-serif text-text font-bold mb-6 border-b border-border pb-3">Executive Summary — Mine X</h3>
              
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex justify-between items-center group/row cursor-default p-2 rounded-lg hover:bg-surface2 transition-colors">
                   <div className="font-sans text-textDim flex flex-col">
                     <span className="font-bold text-text group-hover/row:text-accent transition-colors">Coal Production</span>
                     <span className="text-xs text-accent">Verified: Page 47</span>
                   </div>
                   <span className="font-mono text-base font-bold text-text">2.5 MT</span>
                </div>
                
                <div className="flex justify-between items-center group/row cursor-default p-2 rounded-lg hover:bg-surface2 transition-colors">
                   <div className="font-sans text-textDim flex flex-col">
                     <span className="font-bold text-text group-hover/row:text-accent transition-colors">Overburden Removal</span>
                     <span className="text-xs text-accent">Verified: Page 23</span>
                   </div>
                   <span className="font-mono text-base font-bold text-text">7.5 Mm³</span>
                </div>
                
                <div className="flex justify-between items-center mt-2 pt-3 border-t border-border group/row cursor-default p-2 rounded-lg hover:bg-accent2/10 transition-colors">
                   <div className="font-sans text-textDim flex flex-col">
                     <span className="font-bold text-text group-hover/row:text-accent2 transition-colors">Stripping Ratio</span>
                     <span className="text-xs text-accent2">Calculated via Python</span>
                   </div>
                   <span className="font-mono text-lg font-bold text-accent2">3.00</span>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between items-center border-t border-border pt-4">
                 <div className="text-xs font-mono text-textDim flex items-center gap-1">
                   <CheckCircle2 size={14} className="text-accent2"/> Status: Verified & Approved
                 </div>
                 <a href="/studio" className="bg-accent text-bg text-xs font-bold px-4 py-2 rounded-full shadow-md hover:bg-accent/90 transition-all flex items-center gap-1">
                   Open in Studio <ArrowRight size={12}/>
                 </a>
              </div>
            </div>
            
          </div>
        </AnimatedSection>
        
      </main>

      {/* Interactive Document Proof Overlay Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface border-2 border-accent rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col gap-4 animate-scale-up">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="flex items-center gap-2 font-bold text-text text-lg">
                <FileText className="text-accent"/> Original PDF Page Proof (Annual_Report_2024.pdf)
              </div>
              <button onClick={() => setShowEvidenceModal(false)} className="text-textDim hover:text-text font-mono font-bold">✕ Close</button>
            </div>

            <div className="bg-white border-2 border-border rounded-xl p-6 shadow-inner font-mono text-xs text-slate-800 space-y-3 relative overflow-hidden">
              <div className="text-slate-400 text-right border-b border-slate-200 pb-1">Page 47 — Section 4.2 Production Summary</div>
              
              <p>MAHANADI COALFIELDS LIMITED — ANNUAL OPERATIONAL REPORT 2024</p>
              <p>4.2.1 Coal Extraction Performance</p>
              
              {/* Highlight Bounding Box */}
              <div className="bg-yellow-200 border-2 border-yellow-500 p-3 rounded-lg text-slate-900 font-bold shadow-md my-2 flex items-center justify-between">
                <span>TOTAL COAL PRODUCTION (2024): 2.5 MILLION TONNES</span>
                <span className="bg-accent text-white px-2 py-0.5 rounded text-[10px]">BOUNDING BOX HIGHLIGHT</span>
              </div>

              <p>4.2.2 Machinery Deployment & Shift Hours...</p>
              <p>4.2.3 Mine Expansion Feasibility...</p>
            </div>

            <div className="flex justify-between items-center bg-surface2 p-3 rounded-xl text-xs font-mono">
              <span className="text-textDim">OCR Confidence Score: 96%</span>
              <span className="text-accent font-bold">✓ Source Document Verified</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
