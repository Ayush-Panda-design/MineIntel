"use client";

import { useState, useEffect } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import StudioHeader from '@/components/studio/StudioHeader';
import StudioSidebarLeft from '@/components/studio/StudioSidebarLeft';
import StudioSidebarRight from '@/components/studio/StudioSidebarRight';
import StudioBottomBar from '@/components/studio/StudioBottomBar';
import Canvas from '@/components/studio/Canvas';
import PresentationMode from '@/components/studio/PresentationMode';

export default function StudioPage() {
  const [mounted, setMounted] = useState(false);
  const { presentation } = useStudioStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !presentation) return null;

  return (
    <div className="h-screen w-screen flex flex-col bg-surface overflow-hidden font-sans">
      <StudioHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <StudioSidebarLeft />
        
        <main className="flex-1 flex flex-col relative bg-[#E1D8C9] overflow-hidden shadow-inner">
          <Canvas />
          <StudioBottomBar />
        </main>
        
        <StudioSidebarRight />
      </div>

      <PresentationMode />
    </div>
  );
}
