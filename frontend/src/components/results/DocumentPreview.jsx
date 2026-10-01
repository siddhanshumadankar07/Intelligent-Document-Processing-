import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Copy, Check, FileText, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const DocumentPreview = ({ document, highlightKeyword = '' }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copied, setCopied] = useState(false);

  if (!document) {
    return (
      <Card className="h-full flex items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center text-text-mutedLight dark:text-text-mutedDark">
          <FileText className="w-10 h-10 mb-2 opacity-50" />
          <p className="text-xs">Select a document to inspect text contents</p>
        </div>
      </Card>
    );
  }

  const handleCopy = () => {
    if (document.extractedText) {
      navigator.clipboard.writeText(document.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleZoom = (delta) => {
    setZoomLevel((prev) => Math.min(150, Math.max(75, prev + delta)));
  };

  return (
    <Card padding="none" className="h-full flex flex-col overflow-hidden">
      {/* Preview Header / Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark bg-slate-50/70 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-bold text-text-light dark:text-text-dark truncate">
            {document.fileName}
          </span>
          <Badge variant="neutral" size="sm">
            {document.pageCount || 1} {document.pageCount === 1 ? 'Page' : 'Pages'}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleZoom(-10)}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-text-mutedLight dark:text-text-mutedDark transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-text-mutedLight dark:text-text-mutedDark min-w-[36px] text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => handleZoom(10)}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-text-mutedLight dark:text-text-mutedDark transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            onClick={handleCopy}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-text-mutedLight dark:text-text-mutedDark transition-colors"
            title="Copy Text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Document Document Surface View */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100 dark:bg-slate-950/60">
        <div
          style={{ fontSize: `${zoomLevel}%` }}
          className="max-w-2xl mx-auto bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm min-h-[400px] font-mono text-xs leading-relaxed text-text-light dark:text-text-dark whitespace-pre-wrap selection:bg-teal-500 selection:text-white"
        >
          {document.extractedText || '(No text content extracted for this document.)'}
        </div>
      </div>
    </Card>
  );
};
