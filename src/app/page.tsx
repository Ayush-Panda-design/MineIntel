"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FileText, UploadCloud, ScanText, Database, MessageSquare, 
  Search, Calculator, FileSpreadsheet, AlertTriangle, Info,
  CheckCircle2, Server, Layers, HardDrive, Cpu, ArrowRight,
  ArrowDown, Factory, Settings, Map, FileStack, ShieldCheck, FileKey, XCircle
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
        className={`w-6 h-6 md:w-8 md:h-8 rounded-full border flex items-center justify-center transition-all ${isOpen ? 'bg-accent border-accent text-bg' : 'bg-surface2 border-border text-textDim hover:text-accent hover:border-accent'}`}
        title="How to interact"
        aria-label="Help guide"
      >
        <Info size={16} />
      </button>
      {isOpen && (
        <span className="absolute left-10 md:left-12 top-1/2 -translate-y-1/2 w-48 md:w-64 bg-surface border border-border p-3 rounded-lg shadow-xl text-xs md:text-sm font-sans font-normal text-textDim z-50 animate-fade-up flex items-start gap-2">
          <span className="text-accent mt-0.5">💡</span>
          <span className="leading-tight">{text}</span>
        </span>
      )}
    </span>
  );
}

export default function Home() {
  const [evidenceTab, setEvidenceTab] = useState<"scanned" | "extracted">("scanned");
  
  const [overburden, setOverburden] = useState<string>("7.5");
  const [production, setProduction] = useState<string>("2.5");
  
  const [searchState, setSearchState] = useState<"idle" | "searching" | "done">("idle");
  const [searchProgress, setSearchProgress] = useState<number>(0);

  // Auto-playing pipeline state
  const [pipelineStep, setPipelineStep] = useState(0);
  const [pipelineRef, pipelineInView] = useInView({ threshold: 0.5 });
  
  useEffect(() => {
    if (!pipelineInView) return;
    const interval = setInterval(() => {
      setPipelineStep((prev) => (prev + 1) % 7);
    }, 2500);
    return () => clearInterval(interval);
  }, [pipelineInView]);

  const runSearchSimulation = () => {
    if (searchState !== "idle") return;
    setSearchState("searching");
    setSearchProgress(0);
    setTimeout(() => setSearchProgress(1), 400);
    setTimeout(() => setSearchProgress(2), 1200);
    setTimeout(() => setSearchProgress(3), 2000);
    setTimeout(() => {
      setSearchProgress(4);
      setSearchState("done");
      setTimeout(() => {
        setSearchState("idle");
        setSearchProgress(0);
      }, 4000);
    }, 2800);
  };

  const navLinks = [
    { name: "Context", id: "context" },
    { name: "Problem", id: "problem" },
    { name: "Flow", id: "flow" },
    { name: "Search", id: "search" },
    { name: "Verify", id: "verify" },
    { name: "Trust", id: "trust" },
    { name: "Evidence", id: "evidence" },
    { name: "Reports", id: "reports" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-surface/90 backdrop-blur-sm border-b border-border z-50 flex items-center">
        <div className="w-full max-w-[880px] mx-auto px-5 flex items-center justify-between">
          <div className="font-sans font-medium text-text whitespace-nowrap mr-6">
            MineIntel
          </div>
          <nav className="flex-1 overflow-x-auto no-scrollbar mask-linear-fade">
            <ul className="flex items-center space-x-6 min-w-max">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="text-textDim hover:text-text transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm px-1 py-0.5">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-6 shrink-0 flex items-center">
            <a href="/studio" className="bg-accent text-bg px-4 py-1.5 rounded-full text-sm font-bold shadow-md hover:bg-accent/90 transition-colors flex items-center gap-2">
              Open Studio <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[880px] mx-auto px-5 pt-32 pb-32 space-y-48">
        
        {/* NEW SECTION: CONTEXT (CIL / CMPDI) */}
        <AnimatedSection id="context" className="flex flex-col items-center">
          <h2 className="text-3xl font-bold text-text text-center mb-16 flex items-center justify-center">
            Where the data comes from <InteractiveGuide text="Scroll down to watch how mining records flow into the AI system." />
          </h2>
          
          <div className="flex flex-col items-center w-full max-w-2xl font-mono text-sm relative">
            
            {/* CIL Flow */}
            <div className="bg-surface border-2 border-accent text-accent px-8 py-4 rounded shadow-sm text-xl font-bold flex items-center gap-3">
              <Factory /> CIL — Coal India Limited
            </div>
            <div className="text-center text-textDim mt-4 font-sans max-w-sm">
              Large-scale coal mining operations generate large volumes of technical and operational records.
            </div>
            
            <div className="w-px h-16 bg-border my-2 relative overflow-hidden">
               <div className="absolute inset-0 w-full animate-flow-dash"></div>
            </div>
            
            <div className="bg-surface2 border border-border px-6 py-3 rounded-full flex items-center gap-2">
              <Settings size={18}/> Mining Operations
            </div>
            
            <div className="w-px h-16 bg-border my-2 relative overflow-hidden">
               <div className="absolute inset-0 w-full animate-flow-dash"></div>
            </div>
            
            <div className="bg-surface border-2 border-border px-10 py-5 rounded shadow-sm font-bold text-lg text-text">
              Mining Records
            </div>
            
            <div className="w-px h-8 bg-border my-2 relative overflow-hidden">
               <div className="absolute inset-0 w-full animate-flow-dash-text"></div>
            </div>
            
            <div className="w-64 border-t-2 border-border h-4 border-l-2 border-r-2 flex justify-between rounded-t relative overflow-hidden"></div>
            <div className="flex justify-between w-80 text-text">
              <div className="bg-surface border border-border p-3 flex flex-col items-center gap-2 shadow-sm rounded hover:-translate-y-1 transition-transform"><FileText className="text-accent"/> PDFs</div>
              <div className="bg-surface border border-border p-3 flex flex-col items-center gap-2 shadow-sm rounded hover:-translate-y-1 transition-transform"><ScanText className="text-textDim"/> Scans</div>
              <div className="bg-surface border border-border p-3 flex flex-col items-center gap-2 shadow-sm rounded hover:-translate-y-1 transition-transform"><FileSpreadsheet className="text-accent2"/> Spreadsheets</div>
            </div>
            
            <div className="w-px h-24 bg-border my-4 relative overflow-hidden">
               <div className="absolute inset-0 w-full animate-flow-dash-text"></div>
            </div>
            
            {/* CMPDI Flow */}
            <div className="bg-surface border-2 border-accent2 text-accent2 px-8 py-4 rounded shadow-sm text-xl font-bold flex items-center gap-3">
              <Map /> CMPDI
            </div>
            <div className="text-center text-textDim mt-4 font-sans max-w-sm">
              A CIL subsidiary involved in mine planning, design, exploration, and geological work.
            </div>
            
            <div className="w-px h-16 bg-border my-2 relative overflow-hidden">
               <div className="absolute inset-0 w-full animate-flow-dash-2"></div>
            </div>
            
            <div className="bg-surface2 border border-border px-6 py-3 rounded-full flex flex-col items-center text-center text-text">
              <div>Planning / Design /</div>
              <div>Exploration / Geology</div>
            </div>
            
            <div className="w-px h-16 bg-border my-2 relative overflow-hidden">
               <div className="absolute inset-0 w-full animate-flow-dash-2"></div>
            </div>
            
            <div className="bg-surface border-2 border-border px-10 py-5 rounded shadow-sm font-bold text-lg text-text">
              Technical Records
            </div>
            
            <div className="w-px h-24 bg-border my-4 relative overflow-hidden">
               <div className="absolute inset-0 w-full animate-flow-dash-text"></div>
            </div>
            
            <div className="bg-text text-bg px-10 py-6 text-3xl font-bold rounded-lg shadow-xl flex items-center gap-3 animate-float">
              <ShieldCheck size={32}/> MINEINTEL AI
            </div>
            
          </div>
        </AnimatedSection>

        {/* SECTION: DATA EVERYWHERE */}
        <AnimatedSection className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-text flex items-center max-w-2xl justify-center">
            A mining organization generates information everywhere. <InteractiveGuide text="Keep scrolling to see the sheer volume of documents visually stack up." />
          </h2>
          
          <div className="relative w-64 h-64 mt-16 flex items-center justify-center">
             {[
               { icon: FileText, label: "Annual Report", rotate: "-rotate-6", delay: "delay-100" },
               { icon: Map, label: "Geological Survey", rotate: "rotate-3", delay: "delay-300" },
               { icon: Layers, label: "Borehole Record", rotate: "-rotate-12", delay: "delay-500" },
               { icon: FileSpreadsheet, label: "Production Sheet", rotate: "rotate-12", delay: "delay-700" },
               { icon: ScanText, label: "Legacy Scan", rotate: "-rotate-3", delay: "delay-[900ms]" },
               { icon: Database, label: "Technical Report", rotate: "rotate-6", delay: "delay-[1100ms]" },
             ].map((doc, i) => {
               const [docRef, docInView] = useInView();
               return (
                 <div key={i} ref={docRef} className={`absolute w-48 bg-surface border-2 border-border p-4 shadow-xl flex items-center gap-3 font-mono text-sm text-text transition-all duration-700 ease-out ${doc.rotate} ${docInView ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-110 -translate-y-24'}`} style={{ zIndex: i }}>
                   <doc.icon className="text-textDim shrink-0" size={16}/>
                   <span className="truncate">{doc.label}</span>
                 </div>
               )
             })}
          </div>
          
          <div className="text-2xl font-bold text-text mt-8">Thousands of records</div>
          <p className="text-textDim text-lg mt-4 max-w-xl">
            The information exists. Finding and verifying it is the problem.
          </p>
        </AnimatedSection>

        {/* SECTION: THE PROBLEM */}
        <AnimatedSection id="problem" className="flex flex-col gap-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-accent/10 blur-[100px] -z-10 rounded-full mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text leading-tight max-w-3xl tracking-tight flex items-center flex-wrap">
            One number, buried in three different files. <InteractiveGuide text="Hover over each document card below to see how the system tracks exact sources." />
          </h1>
          
          <div className="mt-8 md:mt-12 flex flex-col gap-12 relative overflow-hidden group py-4">
            
            {/* The sweeping beam */}
            <div className="absolute top-0 bottom-0 w-32 bg-accent/10 -skew-x-12 blur-2xl animate-beam z-0 pointer-events-none"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
              <div className="bg-surface border-2 border-border p-6 flex flex-col gap-4 rounded-xl shadow-lg hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center text-accent"><FileText size={18} /></div>
                  <div className="font-mono text-xs text-textDim truncate">Annual_Report_2024.pdf</div>
                </div>
                <div className="text-text font-bold text-xl leading-snug">Coal production</div>
                <div className="font-mono bg-surface2 text-text px-3 py-1 rounded w-fit border border-border">2.5 million tonnes</div>
                <div className="text-xs text-textDim mt-2">Page 47</div>
              </div>
              
              <div className="bg-surface border-2 border-border p-6 flex flex-col gap-4 rounded-xl shadow-lg hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center text-accent"><ScanText size={18} /></div>
                  <div className="font-mono text-xs text-textDim truncate">Geology_Survey.pdf</div>
                </div>
                <div className="text-text font-bold text-xl leading-snug">Overburden volume</div>
                <div className="font-mono bg-surface2 text-text px-3 py-1 rounded w-fit border border-border">7.5 million m³</div>
                <div className="text-xs text-textDim mt-2">Page 23</div>
              </div>
              
              <div className="bg-surface border-2 border-border p-6 flex flex-col gap-4 rounded-xl shadow-lg hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center text-accent2"><FileSpreadsheet size={18} /></div>
                  <div className="font-mono text-xs text-textDim truncate">Production_2024.xlsx</div>
                </div>
                <div className="text-text font-bold text-xl leading-snug">Production</div>
                <div className="font-mono bg-surface2 text-text px-3 py-1 rounded w-fit border border-border">2,500,000 tonnes</div>
                <div className="text-xs text-textDim mt-2">Sheet: Production</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-wider text-textDim font-mono flex-wrap">
              <span className="text-accent">Find</span> <ArrowRight size={16}/>
              <span className="text-accent">Compare</span> <ArrowRight size={16}/>
              <span className="text-accent">Verify</span> <ArrowRight size={16}/>
              <span className="text-accent2">Calculate</span>
            </div>
            
          </div>
        </AnimatedSection>

        {/* SECTION: CORE PIPELINE */}
        <AnimatedSection id="flow" className="flex flex-col gap-10">
          <h2 className="text-3xl font-bold text-text flex items-center flex-wrap">
            The MineIntel Pipeline <InteractiveGuide text="Click the steps on the left to manually explore the pipeline, or just watch it auto-play." />
          </h2>
          
          <div ref={pipelineRef} className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 bg-surface2 border border-border rounded-xl overflow-hidden shadow-sm p-6">
            
            {/* Steps list */}
            <div className="flex flex-col gap-2 relative">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-border z-0"></div>
              {[
                { id: 0, label: "01 Upload" },
                { id: 1, label: "02 Extract" },
                { id: 2, label: "03 Index" },
                { id: 3, label: "04 Ask" },
                { id: 4, label: "05 Retrieve" },
                { id: 5, label: "06 Verify" },
                { id: 6, label: "07 Report" },
              ].map((step) => (
                <button key={step.id} onClick={() => setPipelineStep(step.id)} className={`relative z-10 flex items-center gap-4 p-2 transition-all rounded ${pipelineStep === step.id ? 'bg-surface shadow-sm text-accent font-bold scale-105 border border-border' : 'text-textDim hover:text-text hover:bg-surface/50'}`}>
                   <div className={`w-2 h-2 rounded-full ${pipelineStep === step.id ? 'bg-accent' : 'bg-border'}`}></div>
                   <span className="font-mono text-sm">{step.label}</span>
                </button>
              ))}
            </div>
            
            {/* Display Area */}
            <div className="bg-surface border border-border rounded-lg shadow-inner flex flex-col items-center justify-center p-8 min-h-[300px] relative overflow-hidden">
              
              {pipelineStep === 0 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center">
                  <UploadCloud size={48} className="text-accent"/>
                  <div className="text-xl font-bold text-text">PDF enters system</div>
                  <div className="text-textDim">Documents are uploaded and tagged with metadata.</div>
                </div>
              )}
              {pipelineStep === 1 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center">
                  <ScanText size={48} className="text-accent"/>
                  <div className="text-xl font-bold text-text">Scanned page transforms into text/table</div>
                  <div className="text-textDim">OCR converts images into structured machine-readable data.</div>
                </div>
              )}
              {pipelineStep === 2 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center">
                  <Database size={48} className="text-accent"/>
                  <div className="text-xl font-bold text-text">Text becomes searchable chunks</div>
                  <div className="text-textDim">Facts and tables are embedded into a vector database.</div>
                </div>
              )}
              {pipelineStep === 3 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center">
                  <MessageSquare size={48} className="text-accent"/>
                  <div className="text-xl font-bold text-text">Engineer types a question</div>
                  <div className="bg-surface2 text-text px-4 py-2 rounded-full font-mono text-sm border border-border">"What was Mine X production in 2024?"</div>
                </div>
              )}
              {pipelineStep === 4 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center">
                  <Search size={48} className="text-accent"/>
                  <div className="text-xl font-bold text-text">Relevant page gets highlighted</div>
                  <div className="text-textDim">The system finds specific evidence across thousands of files.</div>
                </div>
              )}
              {pipelineStep === 5 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center">
                  <Calculator size={48} className="text-accent2"/>
                  <div className="text-xl font-bold text-text">7.5 ÷ 2.5 = 3.00</div>
                  <div className="text-textDim">Values are deterministically calculated.</div>
                </div>
              )}
              {pipelineStep === 6 && (
                <div className="flex flex-col items-center gap-4 animate-fade-up text-center">
                  <FileText size={48} className="text-accent2"/>
                  <div className="text-xl font-bold text-text">Verified value appears in report</div>
                  <div className="text-textDim">A traceable, human-reviewable document is drafted.</div>
                </div>
              )}
              
            </div>
          </div>
        </AnimatedSection>

        {/* SECTION: SEARCH / RAG VISUALIZATION */}
        <AnimatedSection id="search" className="flex flex-col gap-10">
          <h2 className="text-3xl font-bold text-text flex items-center flex-wrap">
            How Retrieval works (RAG) <InteractiveGuide text="Click the query button below to run a live simulation of the AI retrieval pipeline." />
          </h2>
          <p className="text-textDim text-lg md:text-xl leading-relaxed">
            The system doesn't generate answers from memory. It acts as an incredibly fast librarian, filtering thousands of documents down to the exact paragraphs needed.
          </p>
          
          <div className="bg-surface2 border border-border rounded-xl p-8 flex flex-col items-center gap-8 shadow-sm">
             <button 
               onClick={runSearchSimulation}
               disabled={searchState !== "idle"}
               className={`font-mono bg-surface border px-6 py-3 rounded shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-lg transition-all ${searchState !== "idle" ? 'border-accent' : 'border-border hover:border-accent cursor-pointer'}`}
             >
                <div className="flex items-center gap-3 text-text">
                  <Search size={18} className={searchState !== "idle" ? "text-accent animate-pulse" : "text-textDim"} />
                  <span className="text-sm">"What was Mine X production in 2024?"</span>
                </div>
                {searchState === "idle" && <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded font-bold uppercase tracking-wider shrink-0">Click to run</span>}
             </button>
             
             <ArrowDown className={`text-textDim transition-all ${searchProgress >= 1 ? 'animate-bounce text-accent' : ''}`} />
             
             <div className={`flex flex-col items-center transition-opacity duration-500 ${searchState === "idle" ? 'opacity-20 grayscale' : 'opacity-100'}`}>
                <div className="text-xs font-bold text-textDim uppercase tracking-wider mb-4">100 Documents</div>
                <div className="flex flex-wrap justify-center gap-1.5 w-64">
                   {Array.from({length: 100}).map((_, i) => <div key={i} className={`w-3 h-3 rounded-sm transition-colors duration-300 ${searchProgress >= 1 ? (i % 17 === 0 ? 'bg-accent animate-pulse' : 'bg-border') : 'bg-border'}`} />)}
                </div>
             </div>
             
             <div className={`flex gap-4 items-center transition-opacity duration-500 ${searchState === "idle" ? 'opacity-20 grayscale' : 'opacity-100'}`}>
                <ArrowDown className="text-textDim" /> <span className="font-mono text-xs uppercase text-textDim font-bold">Search</span> <ArrowDown className="text-textDim" />
             </div>
             
             <div className={`flex flex-col items-center transition-opacity duration-500 ${searchState === "idle" ? 'opacity-20 grayscale' : (searchProgress >= 2 ? 'opacity-100' : 'opacity-30')}`}>
                <div className="text-xs font-bold text-accent uppercase tracking-wider mb-4">5 Relevant Passages</div>
                <div className="flex gap-3">
                   {Array.from({length: 5}).map((_, i) => <div key={i} className="w-8 h-12 bg-surface border border-accent rounded-sm shadow-sm" />)}
                </div>
             </div>
             
             <div className={`flex gap-4 items-center transition-opacity duration-500 ${searchState === "idle" ? 'opacity-20 grayscale' : (searchProgress >= 3 ? 'opacity-100' : 'opacity-30')}`}>
                <ArrowDown className="text-textDim" /> <span className="font-mono text-xs uppercase text-textDim font-bold">Re-rank</span> <ArrowDown className="text-textDim" />
             </div>
             
             <div className={`flex flex-col items-center transition-opacity duration-500 ${searchState === "idle" ? 'opacity-20 grayscale' : (searchProgress >= 3 ? 'opacity-100' : 'opacity-30')}`}>
                <div className="text-xs font-bold text-accent2 uppercase tracking-wider mb-4">2 Strongest Sources</div>
                <div className="flex gap-4">
                   <div className="px-4 py-2 bg-accent2 text-bg font-bold font-mono text-sm rounded shadow-lg">Source A</div>
                   <div className="px-4 py-2 bg-accent2 text-bg font-bold font-mono text-sm rounded shadow-lg">Source B</div>
                </div>
             </div>
             
             <ArrowDown className={`transition-all duration-500 ${searchProgress >= 4 ? 'text-accent2 animate-bounce' : 'text-textDim opacity-20'}`} />
             
             <div className={`bg-surface border-2 p-4 text-center rounded-lg shadow-sm font-bold text-lg max-w-sm transition-all duration-500 ${searchProgress >= 4 ? 'border-accent2 text-text scale-105' : 'border-border text-textDim opacity-20 grayscale'}`}>
               AI produces the cited answer using only these two sources.
             </div>
          </div>
        </AnimatedSection>

        {/* SECTION: VERIFICATION */}
        <AnimatedSection id="verify" className="flex flex-col gap-10">
          <h2 className="text-3xl font-bold text-text flex items-center flex-wrap">
            The AI explains. Code verifies. <InteractiveGuide text="Follow the flow from AI Retrieval down to the Deterministic Code execution." />
          </h2>
          <p className="text-textDim text-lg md:text-xl leading-relaxed">
            Language models can hallucinate math. We explicitly separate text reasoning from deterministic calculation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-surface2 border border-border rounded-xl p-8 shadow-sm">
             
             <div className="flex flex-col items-center gap-6">
                <div className="text-sm font-bold text-textDim uppercase tracking-wider flex items-center gap-2"><FileKey size={16}/> AI Retrieval</div>
                <div className="flex flex-col gap-3 w-full max-w-xs text-text">
                   <div className="bg-surface border-2 border-border p-4 shadow-sm text-center font-mono text-lg rounded hover:border-accent transition-colors cursor-default">Overburden = 7.5</div>
                   <div className="bg-surface border-2 border-border p-4 shadow-sm text-center font-mono text-lg rounded hover:border-accent transition-colors cursor-default">Production = 2.5</div>
                </div>
             </div>
             
             <div className="flex flex-col items-center gap-6 border-t md:border-t-0 md:border-l border-border pt-8 md:pt-0 pl-0 md:pl-8">
                <div className="text-sm font-bold text-accent uppercase tracking-wider flex items-center gap-2"><Cpu size={16}/> Deterministic Code</div>
                
                <div className="flex flex-col items-center gap-4">
                   <div className="bg-text text-bg px-6 py-3 font-mono text-xl rounded-lg shadow-inner">
                      7.5 ÷ 2.5
                   </div>
                   <ArrowDown className="text-text" />
                   <div className="text-5xl font-mono font-bold text-text tracking-tighter">3.00</div>
                   <div className="mt-2 bg-accent2/10 border border-accent2/30 text-accent2 px-4 py-2 font-bold flex items-center gap-2 rounded-full tracking-wider">
                      <CheckCircle2 size={20} /> VERIFIED
                   </div>
                </div>
             </div>
             
          </div>
        </AnimatedSection>

        {/* SECTION: TRUST & CONFLICTS */}
        <AnimatedSection id="trust" className="flex flex-col gap-10">
          <h2 className="text-3xl font-bold text-text flex items-center flex-wrap">
            Honest about conflicts and unknowns <InteractiveGuide text="Review these two cards to see how the system refuses to guess when it encounters bad data." />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Conflict Visual */}
            <div className="bg-surface2 border border-border rounded-xl p-8 shadow-sm flex flex-col items-center justify-center gap-6">
               <h3 className="font-bold text-text text-xl mb-4 w-full text-center">Conflict Detection</h3>
               
               <div className="flex items-center gap-4 w-full justify-center text-text">
                 <div className="bg-surface border-2 border-border p-4 rounded text-center shadow-sm w-32 relative">
                    <div className="text-xs text-textDim mb-2 truncate">Doc A</div>
                    <div className="font-mono text-xl font-bold">2.5 MT</div>
                 </div>
                 
                 <div className="flex flex-col items-center text-danger">
                    <AlertTriangle className="w-8 h-8 animate-pulse mb-2" />
                    <div className="h-px w-8 bg-danger"></div>
                 </div>
                 
                 <div className="bg-surface border-2 border-border p-4 rounded text-center shadow-sm w-32 relative">
                    <div className="text-xs text-textDim mb-2 truncate">Doc B</div>
                    <div className="font-mono text-xl font-bold">2.7 MT</div>
                 </div>
               </div>
               
               <div className="bg-danger/10 text-danger border border-danger/20 px-6 py-3 rounded-md font-medium text-center max-w-sm mt-4">
                 Human review required. The system will not arbitrarily guess which is correct.
               </div>
            </div>

            {/* Abstention Visual */}
            <div className="bg-surface2 border border-border rounded-xl p-8 shadow-sm flex flex-col items-center justify-center gap-6">
               <h3 className="font-bold text-text text-xl mb-4 w-full text-center">Missing Evidence</h3>
               
               <div className="font-mono bg-surface text-text border border-border px-4 py-2 text-sm shadow-sm rounded flex items-center gap-2">
                 <Search size={14} className="text-textDim"/> Mine X production in 2010
               </div>
               
               <div className="flex gap-4 opacity-20 grayscale scale-90">
                 <div className="w-12 h-16 bg-surface border-2 border-border rounded"></div>
                 <div className="w-12 h-16 bg-surface border-2 border-border rounded"></div>
                 <div className="w-12 h-16 bg-surface border-2 border-border rounded"></div>
               </div>
               
               <div className="flex flex-col items-center gap-2 mt-4 text-textDim">
                 <XCircle size={24} />
                 <div className="font-medium text-center">No reliable evidence found.<br/>MineIntel will not guess.</div>
               </div>
            </div>
            
          </div>
        </AnimatedSection>

        {/* SECTION: PROVENANCE */}
        <AnimatedSection id="evidence" className="flex flex-col gap-10">
          <h2 className="text-3xl font-bold text-text flex items-center flex-wrap">
            Every number leads back to its source <InteractiveGuide text="Follow the dashed line. This guarantees zero hallucinations for critical numbers." />
          </h2>
          
          <div className="bg-surface2 border border-border rounded-xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-center gap-12 overflow-hidden relative group">
             
             <div className="text-5xl font-mono font-bold text-text z-10 bg-surface2 px-4">
               2.5 MT
             </div>
             
             <div className="hidden md:block absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-64 h-px bg-border z-0">
               <div className="absolute inset-0 w-full h-full animate-flow-dash group-hover:bg-accent/20 transition-colors"></div>
             </div>
             
             <div className="flex flex-col gap-3 font-mono text-sm bg-surface text-text border-2 border-border p-6 rounded-lg shadow-lg z-10 hover:border-accent transition-colors cursor-default">
               <div className="flex gap-3"><span className="text-textDim w-24">Source</span> <span className="font-bold">Annual_Report_2024.pdf</span></div>
               <div className="flex gap-3"><span className="text-textDim w-24">Page</span> <span className="font-bold">47</span></div>
               <div className="flex gap-3"><span className="text-textDim w-24">Table</span> <span className="font-bold">Production Summary</span></div>
               <div className="flex gap-3"><span className="text-textDim w-24">Method</span> <span className="font-bold">OCR + Table Parser</span></div>
               <div className="flex gap-3"><span className="text-textDim w-24">Confidence</span> <span className="text-accent2 font-bold flex items-center gap-1">96% <CheckCircle2 size={14}/></span></div>
             </div>
             
          </div>
        </AnimatedSection>

        {/* SECTION: REPORTS */}
        <AnimatedSection id="reports" className="flex flex-col gap-10">
          <h2 className="text-3xl font-bold text-text flex items-center flex-wrap">
            Verified facts assemble the report <InteractiveGuide text="Hover over the rows in the generated report below to trace them back to their origin pages." />
          </h2>
          
          <div className="flex flex-col items-center">
            
            <div className="flex flex-wrap justify-center gap-4 mb-8 z-10">
              <div className="bg-text text-bg px-4 py-2 font-mono text-sm font-bold rounded shadow-xl flex items-center gap-2"><CheckCircle2 size={16}/> 2.5 MT</div>
              <div className="bg-text text-bg px-4 py-2 font-mono text-sm font-bold rounded shadow-xl flex items-center gap-2"><CheckCircle2 size={16}/> 7.5 Mm³</div>
              <div className="bg-accent2 text-bg px-4 py-2 font-mono text-sm font-bold rounded shadow-xl flex items-center gap-2"><CheckCircle2 size={16}/> 3.00 Ratio</div>
            </div>
            
            <div className="w-px h-12 bg-border relative -mt-4 mb-4">
              <div className="absolute inset-0 w-full h-full animate-flow-dash-text"></div>
            </div>
            
            <div className="bg-surface border-2 border-border p-8 md:p-12 shadow-2xl w-full max-w-lg rounded-sm relative group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-accent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out"></div>
              
              <h3 className="text-2xl font-serif text-text font-bold mb-6 border-b border-border pb-4">Mine X Report</h3>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center group/row cursor-default">
                   <div className="font-sans text-textDim flex flex-col">
                     <span className="font-medium text-text group-hover/row:text-accent transition-colors">Production</span>
                     <span className="text-xs opacity-0 group-hover/row:opacity-100 transition-opacity text-accent">Source: Page 47</span>
                   </div>
                   <span className="font-mono text-lg font-bold text-text">2.5 MT</span>
                </div>
                
                <div className="flex justify-between items-center group/row cursor-default">
                   <div className="font-sans text-textDim flex flex-col">
                     <span className="font-medium text-text group-hover/row:text-accent transition-colors">Overburden</span>
                     <span className="text-xs opacity-0 group-hover/row:opacity-100 transition-opacity text-accent">Source: Page 23</span>
                   </div>
                   <span className="font-mono text-lg font-bold text-text">7.5 Mm³</span>
                </div>
                
                <div className="flex justify-between items-center mt-2 pt-4 border-t border-border group/row cursor-default">
                   <div className="font-sans text-textDim flex flex-col">
                     <span className="font-medium text-text group-hover/row:text-accent2 transition-colors">Stripping Ratio</span>
                     <span className="text-xs opacity-0 group-hover/row:opacity-100 transition-opacity text-accent2">Calculated internally</span>
                   </div>
                   <span className="font-mono text-xl font-bold text-accent2">3.00</span>
                </div>
              </div>
              
              <div className="mt-12 flex justify-between items-center border-t border-border pt-4">
                 <div className="text-xs font-mono text-textDim flex items-center gap-1 hover:text-accent2 transition-colors cursor-pointer">
                   <CheckCircle2 size={14}/> Human Review: Approved
                 </div>
                 <div className="border border-border text-textDim text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                   Draft
                 </div>
              </div>
            </div>
            
          </div>
        </AnimatedSection>
        
      </main>
    </>
  );
}
