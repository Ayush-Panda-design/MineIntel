"use client";

import { useState } from 'react';
import { X, FileDown, Loader2, CheckCircle2, FileType2, Image as ImageIcon, FileText } from 'lucide-react';
import { useStudioStore } from '@/store/useStudioStore';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { presentation } = useStudioStore();
  const [format, setFormat] = useState<'PPTX' | 'PDF' | 'PNG'>('PPTX');
  const [status, setStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!presentation) return;
    
    if (format !== 'PPTX') {
      setErrorMsg(`Server-side ${format} export is not configured in this prototype. Please use PPTX.`);
      setStatus('error');
      return;
    }

    setStatus('exporting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presentation })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Export failed');
      }

      // Handle file download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${presentation.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'An error occurred during export.');
    }
  };

  return (
    <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between p-5 border-b border-border bg-surface2">
          <div className="flex items-center gap-2 text-text font-bold text-lg">
            <FileDown size={20} className="text-accent" /> Export Presentation
          </div>
          <button onClick={onClose} disabled={status === 'exporting'} className="text-textDim hover:text-text disabled:opacity-50 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-text">Select Format</label>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => { setFormat('PPTX'); setStatus('idle'); setErrorMsg(''); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${format === 'PPTX' ? 'border-accent bg-accent/5 text-accent' : 'border-border bg-surface2 text-textDim hover:border-textDim'}`}
              >
                <FileType2 size={24} />
                <span className="text-xs font-bold">.PPTX</span>
              </button>
              
              <button 
                onClick={() => { setFormat('PDF'); setStatus('idle'); setErrorMsg(''); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${format === 'PDF' ? 'border-accent bg-accent/5 text-accent' : 'border-border bg-surface2 text-textDim hover:border-textDim'}`}
              >
                <FileText size={24} />
                <span className="text-xs font-bold">.PDF</span>
              </button>
              
              <button 
                onClick={() => { setFormat('PNG'); setStatus('idle'); setErrorMsg(''); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${format === 'PNG' ? 'border-accent bg-accent/5 text-accent' : 'border-border bg-surface2 text-textDim hover:border-textDim'}`}
              >
                <ImageIcon size={24} />
                <span className="text-xs font-bold">.PNGs</span>
              </button>
            </div>
          </div>

          <div className="bg-surface2 p-4 rounded-lg border border-border">
            <p className="text-xs text-textDim">
              <strong className="text-text">Native Export Elements:</strong><br />
              Text, Shapes, and Images are mapped directly to editable PowerPoint equivalents.
            </p>
          </div>

          {status === 'error' && (
            <div className="p-3 bg-danger/10 text-danger text-xs font-bold rounded border border-danger/20">
              {errorMsg}
            </div>
          )}

          {status === 'success' && (
            <div className="p-3 bg-accent2/10 text-accent2 text-xs font-bold rounded border border-accent2/20 flex items-center gap-2">
              <CheckCircle2 size={16} /> File downloaded successfully!
            </div>
          )}

        </div>

        <div className="p-5 border-t border-border flex justify-between items-center bg-surface2">
          <button onClick={onClose} disabled={status === 'exporting'} className="px-4 py-2 text-sm font-bold text-textDim hover:text-text transition-colors">
            Cancel
          </button>
          
          <button 
            onClick={handleExport}
            disabled={status === 'exporting' || status === 'success'}
            className="px-6 py-2 bg-accent text-bg text-sm font-bold rounded-lg shadow-md hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {status === 'exporting' ? (
              <><Loader2 size={16} className="animate-spin" /> Compiling PPTX...</>
            ) : status === 'success' ? (
              'Exported'
            ) : (
              'Export'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
