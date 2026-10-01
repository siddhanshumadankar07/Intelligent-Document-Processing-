import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Table,
  Check,
  Zap,
  ArrowRight,
  Shield,
  FileCode,
  FileSpreadsheet,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { documentApi } from '../services/api';
import { SAMPLE_DOCUMENTS } from '../services/sampleData';

export const UploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0); // 0 to 5
  const [errorMsg, setErrorMsg] = useState(null);

  const stages = [
    { title: 'Uploading & Checksum', desc: 'SHA-256 integrity verification' },
    { title: 'OCR & Vision Layer', desc: 'Spatial coordinate & text extraction' },
    { title: 'Neural Classification', desc: 'Document category identification' },
    { title: 'Key-Value & Table Parser', desc: 'Extracting structured entities' },
    { title: 'Automated Rule Validation', desc: 'Math & schema reconciliation' },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    setErrorMsg(null);
    const valid = files.filter(
      (f) =>
        f.type === 'application/pdf' ||
        f.type.startsWith('image/') ||
        f.name.endsWith('.pdf') ||
        f.name.endsWith('.png') ||
        f.name.endsWith('.jpg') ||
        f.name.endsWith('.jpeg')
    );

    if (valid.length === 0) {
      setErrorMsg('Please upload a valid PDF or Image file (.pdf, .png, .jpg)');
      return;
    }

    setSelectedFiles(valid);
  };

  const processRealFiles = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);

    // Stage progression timer simulation while API runs
    let currentStage = 0;
    const stageInterval = setInterval(() => {
      currentStage = Math.min(currentStage + 1, 4);
      setProcessingStage(currentStage);
    }, 450);

    try {
      const formData = new FormData();
      selectedFiles.forEach((f) => formData.append('documents', f));

      const res = await documentApi.upload(formData);
      clearInterval(stageInterval);
      setProcessingStage(4);

      setTimeout(() => {
        if (res.data?.documents && res.data.documents.length > 0) {
          sessionStorage.setItem('clause_active_demo_doc', JSON.stringify(res.data.documents[0]));
        }
        navigate('/results');
      }, 500);
    } catch (err) {
      clearInterval(stageInterval);
      setIsProcessing(false);
      setProcessingStage(0);
      const msg = err.response?.data?.message || err.message || 'Upload failed. Please try again.';
      setErrorMsg(msg);
    }
  };

  const handleTrySample = (sampleDoc) => {
    setIsProcessing(true);
    setProcessingStage(0);

    let stage = 0;
    const interval = setInterval(() => {
      stage += 1;
      setProcessingStage(stage);
      if (stage >= 4) {
        clearInterval(interval);
        setTimeout(() => {
          sessionStorage.setItem('clause_active_demo_doc', JSON.stringify(sampleDoc));
          navigate('/results');
        }, 400);
      }
    }, 280);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Document Extraction Pipeline
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Ingest & Process Documents
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Upload PDF invoices, contracts, receipts, or medical reports to automatically extract structured key-value pairs and tables.
        </p>
      </div>

      {/* DRAG AND DROP ZONE */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-8 shadow-xl backdrop-blur-md">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.tiff"
          onChange={handleFileInput}
          className="hidden"
        />

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-cyan-400 bg-cyan-500/10 scale-[0.99]'
              : 'border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-800/30'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/10">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            Drag & drop your files here, or <span className="text-cyan-400 hover:underline">browse</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            Supports PDF, JPG, PNG, and TIFF formats. Multi-page batches up to 25MB per document.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">.PDF</span>
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">.PNG</span>
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">.JPG</span>
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">Auto OCR</span>
            <span className="px-2 py-1 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
              Zero Retention 🛡️
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Selected Files List & Action */}
        {selectedFiles.length > 0 && !isProcessing && (
          <div className="mt-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {selectedFiles.length} file(s) queued for extraction
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {selectedFiles.map((f) => f.name).join(', ')}
                </div>
              </div>
            </div>

            <button
              onClick={processRealFiles}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Start IDP Pipeline
            </button>
          </div>
        )}

        {/* PROCESSING STAGE PROGRESS BAR */}
        {isProcessing && (
          <div className="mt-6 p-6 rounded-xl bg-slate-800/80 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                Processing Document Pipeline...
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                Stage {processingStage + 1} of 5
              </span>
            </div>

            {/* Visual Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {stages.map((stg, idx) => {
                const isDone = processingStage > idx;
                const isCurrent = processingStage === idx;
                return (
                  <div
                    key={stg.title}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : isCurrent
                        ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                      {isDone ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      ) : null}
                    </div>
                    <div className="text-[11px] font-bold truncate text-white">{stg.title}</div>
                    <div className="text-[9px] text-slate-400 truncate">{stg.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* QUICK TRY SAMPLE DOCUMENTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              Quick Try Realistic Enterprise Demos
            </h3>
            <p className="text-xs text-slate-400">
              Instant one-click demo ingestion for evaluation and live hackathon showcase.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleTrySample(doc)}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/50 cursor-pointer transition-all group backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                  {doc.documentCategory}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 font-mono">
                  {(doc.confidenceScore * 100).toFixed(0)}% Conf
                </span>
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
                {doc.documentType}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight mb-3">
                {doc.summary}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800">
                <span>{doc.fileSize}</span>
                <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Load Demo <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
