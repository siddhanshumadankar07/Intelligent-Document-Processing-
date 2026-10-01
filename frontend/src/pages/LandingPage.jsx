import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Download,
  ArrowRight,
  Shield,
  Zap,
  Sparkles,
  BarChart3,
  Table,
  Check,
  Eye,
  Lock,
  ChevronRight,
  Database,
  FileCheck2,
  Sliders,
  Terminal,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../services/sampleData';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const activeDoc = SAMPLE_DOCUMENTS[selectedDemoIndex];

  const handleLaunchSample = (doc) => {
    // Store in session storage so results page opens it immediately
    sessionStorage.setItem('clause_active_demo_doc', JSON.stringify(doc));
    navigate('/results');
  };

  const workflowSteps = [
    {
      step: '01',
      title: 'Upload',
      desc: 'Ingest multi-page PDF, JPG, PNG, or TIFF scans with instant cryptographic checksumming.',
      icon: UploadCloud,
      color: 'from-blue-500 to-cyan-400',
    },
    {
      step: '02',
      title: 'OCR & Vision',
      desc: 'High-precision optical character recognition extracts spatial bounding boxes and raw layout.',
      icon: Cpu,
      color: 'from-cyan-400 to-sky-500',
    },
    {
      step: '03',
      title: 'Classification',
      desc: 'Neural classification models identify Invoices, Legal NDAs, Medical Labs, or Forms.',
      icon: Layers,
      color: 'from-sky-500 to-blue-600',
    },
    {
      step: '04',
      title: 'Data Extraction',
      desc: 'Deterministic Key-Value pairs, multi-row line items, and nested entity parsing.',
      icon: Table,
      color: 'from-blue-600 to-indigo-500',
    },
    {
      step: '05',
      title: 'Validation',
      desc: 'Automated math reconciliation (Subtotal + Tax = Total), GSTIN format, and threshold checks.',
      icon: CheckCircle2,
      color: 'from-emerald-400 to-teal-500',
    },
    {
      step: '06',
      title: 'Export & Webhook',
      desc: 'Stream validated JSON, clean CSV, PDF audit reports, or trigger ERP webhooks.',
      icon: Download,
      color: 'from-indigo-500 to-cyan-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F8FAFC] selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient Cybernetic Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-20 left-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">
        {/* Top Navbar Minimal */}
        <header className="border-b border-white/[0.08] backdrop-blur-xl sticky top-0 z-50 bg-[#090D16]/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <FileCheck2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                  Clause
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  IDP v2.4
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#features" className="hover:text-cyan-400 transition-colors">Capabilities</a>
              <a href="#workflow" className="hover:text-cyan-400 transition-colors">Pipeline</a>
              <a href="#demo" className="hover:text-cyan-400 transition-colors">Interactive Demo</a>
              <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-all"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => navigate('/upload')}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                Process Document
              </button>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-cyan-500/30 text-xs font-semibold text-cyan-300 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Next-Gen Intelligent Document Processing</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                Turn Documents Into{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                  Structured Data
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
                AI-powered extraction for invoices, contracts, medical reports, and forms.
                Extract key-value pairs, nested tables, and entities with 99%+ accuracy — verified by automated validation rules.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/upload')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center gap-2.5 group"
                >
                  <UploadCloud className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  Process a Document
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#demo"
                  className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4 text-cyan-400" />
                  View Live Demo
                </a>
              </div>

              {/* Metric Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg">
                <div>
                  <div className="text-2xl font-black text-white">99.2%</div>
                  <div className="text-xs text-slate-400 font-medium">Extraction Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-cyan-400">&lt; 1.2s</div>
                  <div className="text-xs text-slate-400 font-medium">Avg OCR Pipeline</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">Zero</div>
                  <div className="text-xs text-slate-400 font-medium">Data Retention (RAM Only)</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Preview (Interactive Live IDP Card) */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/90 border border-cyan-500/30 p-1 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl">
                {/* Header Bar */}
                <div className="px-4 py-3 bg-slate-900/80 rounded-t-xl border-b border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs font-mono text-slate-400">pipeline://doc-processor.live</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      OCR Engine Active
                    </span>
                  </div>
                </div>

                {/* Card Inner Body */}
                <div className="p-5 space-y-4">
                  {/* Top classification banner */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          Apex_Cloud_Tax_Invoice_INV-2025-0842.pdf
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-500/20 text-cyan-300">
                            TAX_INVOICE
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">Confidence: 98.4% • Ingested via OCR Multi-pass</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/30">
                      PASSED ✓
                    </span>
                  </div>

                  {/* Extracted Key-Values Grid Preview */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                        <span>Vendor</span>
                        <span className="text-cyan-400 font-mono">99.8%</span>
                      </div>
                      <div className="text-white font-medium mt-1 truncate">Apex Cloud Technologies Pvt Ltd</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                        <span>Invoice #</span>
                        <span className="text-cyan-400 font-mono">99.2%</span>
                      </div>
                      <div className="text-white font-medium mt-1 font-mono">INV-2025-0842</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                        <span>GSTIN / Tax ID</span>
                        <span className="text-cyan-400 font-mono">98.5%</span>
                      </div>
                      <div className="text-cyan-300 font-mono mt-1">29AABCA1234F1Z9</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                        <span>Total Amount</span>
                        <span className="text-emerald-400 font-mono">100%</span>
                      </div>
                      <div className="text-emerald-400 font-bold mt-1 text-sm font-mono">$4,956.00 USD</div>
                    </div>
                  </div>

                  {/* Table Extraction Line Items Preview */}
                  <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
                    <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5">
                        <Table className="w-3.5 h-3.5 text-cyan-400" />
                        Extracted Line Items (3 rows)
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono">Auto-Sum Verified</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between p-1.5 rounded bg-slate-800/40 text-slate-300">
                        <span className="truncate max-w-[200px]">1. Kubernetes Cluster (8 Nodes)</span>
                        <span className="font-mono text-white">$2,400.00</span>
                      </div>
                      <div className="flex items-center justify-between p-1.5 rounded bg-slate-800/40 text-slate-300">
                        <span className="truncate max-w-[200px]">2. NVIDIA H100 Reservation</span>
                        <span className="font-mono text-white">$1,500.00</span>
                      </div>
                      <div className="flex items-center justify-between p-1.5 rounded bg-slate-800/40 text-slate-300">
                        <span className="truncate max-w-[200px]">3. NVMe Block Storage (5 TB)</span>
                        <span className="font-mono text-white">$300.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Automated Validation Bar */}
                  <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="font-medium text-[11px]">
                        Math Validated: Subtotal ($4,200) + Tax ($756) = $4,956.00
                      </span>
                    </div>
                    <button
                      onClick={() => handleLaunchSample(SAMPLE_DOCUMENTS[0])}
                      className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1"
                    >
                      Inspect <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE WORKFLOW SECTION */}
        <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Core End-to-End Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Raw Document to Actionable Data in Milliseconds
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Clause automates the entire ingestion lifecycle with deterministic validation rules and human-in-the-loop fallback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all group backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg shadow-cyan-500/10`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black font-mono text-slate-800 group-hover:text-cyan-500/30 transition-colors">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* INTERACTIVE DEMO PLAYGROUND SECTION */}
        <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 uppercase tracking-wider">
              Interactive Live Demo
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Test Real-World Document Extraction
            </h2>
            <p className="text-slate-400 text-sm">
              Select a pre-loaded sample document below to inspect extracted key-values, line tables, confidence scores, and validation checks.
            </p>
          </div>

          {/* Sample Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {SAMPLE_DOCUMENTS.map((doc, idx) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDemoIndex(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                  selectedDemoIndex === idx
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                {doc.documentType}
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  doc.status === 'VALIDATED'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {doc.status === 'VALIDATED' ? '98%+' : 'REVIEW'}
                </span>
              </button>
            ))}
          </div>

          {/* Active Demo Card View */}
          <div className="rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{activeDoc.fileName}</h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {activeDoc.documentCategory}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{activeDoc.summary}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleLaunchSample(activeDoc)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in IDP Workspace
                </button>
              </div>
            </div>

            {/* Split Content Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
              {/* Left Raw OCR text */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Raw OCR Scanned Stream
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{activeDoc.pageCount} Page(s)</span>
                </div>
                <div className="p-4 rounded-xl bg-[#0B1020] border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-[360px] overflow-y-auto whitespace-pre-wrap">
                  {activeDoc.rawOcrText}
                </div>
              </div>

              {/* Right Structured Fields & Validation */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    Structured Key-Value Extraction
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    Confidence: {(activeDoc.confidenceScore * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {Object.entries(activeDoc.extractedData).map(([key, val]) => {
                    const conf = activeDoc.fieldConfidences?.[key] || 0.95;
                    const isLow = conf < 0.75;
                    return (
                      <div
                        key={key}
                        className={`p-2.5 rounded-lg border text-xs ${
                          isLow
                            ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-semibold">
                          <span className="truncate">{key.replace(/_/g, ' ')}</span>
                          <span className={`font-mono ${isLow ? 'text-amber-400' : 'text-cyan-400'}`}>
                            {(conf * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="font-medium text-white truncate mt-0.5">{String(val)}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Validation Status Box */}
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    Automated Verification Engine
                  </div>
                  <div className="space-y-1.5">
                    {activeDoc.validationRules.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 flex items-center gap-2">
                          {rule.status === 'PASSED' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          {rule.rule}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          rule.status === 'PASSED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {rule.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ENTERPRISE FEATURES GRID */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Enterprise Ready
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Accuracy, Speed, and Compliance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <Table className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Automated Table Extraction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extract nested invoice rows, rate cards, and financial statements directly into normalized tables and CSV.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Human-in-the-Loop Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically route low-confidence fields and validation warnings to reviewers with side-by-side editing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Zero-Retention Privacy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Volatile in-memory processing. Documents are permanently erased upon session close or after 15 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-blue-900/40 via-cyan-950/40 to-slate-900/90 border border-cyan-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Start Processing Documents in Seconds
              </h2>
              <p className="text-slate-300 text-sm">
                No credit card required. Upload your first invoice, contract, or report right now.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/upload')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-sm shadow-xl shadow-cyan-500/30 flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload & Process Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">Clause IDP</span> • Intelligent Document Processing
            </div>
            <div>
              Built for High-Precision SaaS Document Intelligence.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
