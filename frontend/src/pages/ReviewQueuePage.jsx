import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Sliders,
  Check,
  Eye,
  Shield,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../services/sampleData';

export const ReviewQueuePage = () => {
  const navigate = useNavigate();
  // Filter for docs with confidence < 0.9 or flagged status
  const [queueDocs, setQueueDocs] = useState(
    SAMPLE_DOCUMENTS.filter((d) => d.status === 'REVIEW_NEEDED' || d.confidenceScore < 0.98)
  );
  const [selectedDoc, setSelectedDoc] = useState(queueDocs[0] || SAMPLE_DOCUMENTS[3]);
  const [fields, setFields] = useState(selectedDoc?.extractedData || {});
  const [approvedDocs, setApprovedDocs] = useState([]);

  const handleSelect = (d) => {
    setSelectedDoc(d);
    setFields(d.extractedData || {});
  };

  const handleApprove = (docId) => {
    setApprovedDocs((prev) => [...prev, docId]);
    setQueueDocs((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleFieldChange = (k, v) => {
    setFields((prev) => ({ ...prev, [k]: v }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" />
            Human-In-The-Loop Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            HITL Review Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manually review, edit, and approve fields with low OCR clarity or automated rule warnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">
            {queueDocs.length} Pending Review
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
            {approvedDocs.length} Approved Today
          </span>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Queue List */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3 backdrop-blur-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Flagged Documents ({queueDocs.length})
          </div>

          <div className="space-y-2">
            {queueDocs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs rounded-xl bg-slate-800/40 border border-slate-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                Review Queue is Clear! All documents validated.
              </div>
            ) : (
              queueDocs.map((item) => {
                const isSelected = selectedDoc?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                        {item.documentCategory}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-amber-400">
                        {(item.confidenceScore * 100).toFixed(0)}% Conf
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white truncate mb-1">
                      {item.fileName}
                    </div>

                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {item.summary}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Quick Correction & Approval Pane */}
        {selectedDoc && (
          <div className="lg:col-span-8 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedDoc.fileName}</h3>
                <div className="text-xs text-amber-400 flex items-center gap-1.5 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Reason: Low OCR Clarity on numeric tax lines (&lt; 70% threshold)
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApprove(selectedDoc.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Approve & Validate
                </button>
              </div>
            </div>

            {/* Editable Fields Grid */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Correct Extracted Fields
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(fields).map(([k, v]) => {
                  const conf = selectedDoc.fieldConfidences?.[k] || 0.9;
                  const isLow = conf < 0.75;
                  return (
                    <div
                      key={k}
                      className={`p-3 rounded-xl border ${
                        isLow
                          ? 'bg-amber-950/30 border-amber-500/50'
                          : 'bg-slate-800/60 border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                        <span>{k.replace(/_/g, ' ')}</span>
                        <span className={`font-mono ${isLow ? 'text-amber-400' : 'text-cyan-400'}`}>
                          {(conf * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="text"
                        value={String(v)}
                        onChange={(e) => handleFieldChange(k, e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-lg bg-slate-900 border text-xs text-white focus:outline-none ${
                          isLow ? 'border-amber-500/60 focus:border-amber-400' : 'border-slate-700 focus:border-cyan-400'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Raw OCR Reference */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-2">
              <div className="text-xs font-mono font-bold text-slate-400">
                Scanned Stream Reference:
              </div>
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedDoc.rawOcrText}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
