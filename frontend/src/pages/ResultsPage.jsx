import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Table,
  Sliders,
  Sparkles,
  Shield,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Terminal,
  Database,
  Edit3,
  Bot,
  Send,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  FileCode,
  ArrowLeft,
  ChevronDown,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../services/sampleData';
import { chatApi } from '../services/api';

/**
 * Normalize a document from either backend API response or sampleData format.
 * Backend uses confidence as 0-100 and fieldConfidences as 0-100.
 * SampleData uses confidenceScore as 0-1 and fieldConfidences as 0-1.
 */
const normalizeDoc = (raw) => {
  if (!raw) return null;

  // Determine if this is sample data (has confidenceScore 0-1) or backend data (has confidence 0-100)
  const isSampleData = raw.confidenceScore !== undefined && raw.confidenceScore <= 1;

  const confidence = isSampleData
    ? Math.round(raw.confidenceScore * 100)
    : (raw.confidence || 0);

  // Normalize field confidences to 0-100 scale
  const rawFieldConf = raw.fieldConfidences || {};
  const fieldConfidences = {};
  for (const [k, v] of Object.entries(rawFieldConf)) {
    fieldConfidences[k] = (typeof v === 'number' && v <= 1) ? Math.round(v * 100) : (v || 0);
  }

  // Determine extraction success
  const extractedText = raw.extractedText || raw.rawOcrText || '';
  const hasRealText = extractedText.length > 0 && !extractedText.startsWith('[Document Content:');
  const extractionSuccess = raw.extractionSuccess !== undefined ? raw.extractionSuccess : hasRealText;

  return {
    ...raw,
    confidence,
    fieldConfidences,
    extractedText,
    extractionSuccess,
    type: raw.type || raw.documentType || 'Unknown',
    category: raw.category || raw.documentCategory || 'General',
    summary: raw.summary || '',
    extractedData: raw.extractedData || {},
    flags: raw.flags || [],
    status: raw.status || 'Needs Review',
    processingTimeMs: raw.processingTimeMs || 0,
    fileName: raw.fileName || 'Untitled Document',
  };
};

export const ResultsPage = () => {
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [activeTab, setActiveTab] = useState('fields'); // 'fields', 'tables', 'validation', 'json'
  const [leftTab, setLeftTab] = useState('visual'); // 'visual', 'ocr'
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copied, setCopied] = useState(false);

  // Editable fields for Human-in-the-Loop review
  const [editableFields, setEditableFields] = useState({});
  const [editMode, setEditMode] = useState({});

  // PDF Download state
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  // Document Copilot Chat State
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello! I'm your IDP Copilot. Ask me anything about this document (e.g., "What is the total amount?", "Verify line item tax", or "Check payment terms").`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('clause_active_demo_doc');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const normalized = normalizeDoc(parsed);
        setDoc(normalized);
        setEditableFields(normalized.extractedData || {});
      } catch (e) {
        // Fallback to first sample doc
        const normalized = normalizeDoc(SAMPLE_DOCUMENTS[0]);
        setDoc(normalized);
        setEditableFields(normalized.extractedData || {});
      }
    } else {
      const normalized = normalizeDoc(SAMPLE_DOCUMENTS[0]);
      setDoc(normalized);
      setEditableFields(normalized.extractedData || {});
    }
  }, []);

  if (!doc) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-400 text-sm">Loading document results...</div>
      </div>
    );
  }

  const handleFieldChange = (key, val) => {
    setEditableFields((prev) => ({ ...prev, [key]: val }));
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(editableFields, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(editableFields, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(doc.fileName || 'extracted_doc').replace(/\.[^/.]+$/, '')}_structured.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    let csvContent = 'Field,Value,Confidence\n';
    Object.entries(editableFields).forEach(([k, v]) => {
      const conf = doc.fieldConfidences?.[k] || '';
      const valStr = typeof v === 'object' ? JSON.stringify(v) : String(v);
      csvContent += `"${k}","${valStr.replace(/"/g, '""')}","${conf ? conf + '%' : 'N/A'}"\n`;
    });

    if (doc.tables && doc.tables[0]) {
      csvContent += '\n\nTable: Line Items\n';
      csvContent += doc.tables[0].headers.join(',') + '\n';
      doc.tables[0].rows.forEach((row) => {
        csvContent += `"${row.description}","${row.qty}","${row.unitPrice}","${row.tax}","${row.total}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(doc.fileName || 'extracted_doc').replace(/\.[^/.]+$/, '')}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    setPdfGenerating(true);
    setPdfError(null);

    try {
      // Generate a structured PDF report from extracted data
      const reportContent = [];
      reportContent.push(`CLAUSE AI — Document Extraction Report`);
      reportContent.push(`${'='.repeat(50)}`);
      reportContent.push(`File: ${doc.fileName}`);
      reportContent.push(`Type: ${doc.type}`);
      reportContent.push(`Category: ${doc.category}`);
      reportContent.push(`Extraction Confidence: ${doc.confidence}%`);
      reportContent.push(`Status: ${doc.status}`);
      reportContent.push(`Processing Time: ${doc.processingTimeMs}ms`);
      reportContent.push('');
      reportContent.push(`AI Summary:`);
      reportContent.push(doc.summary || 'Summary unavailable');
      reportContent.push('');
      reportContent.push(`Extracted Fields:`);
      reportContent.push(`${'-'.repeat(40)}`);
      Object.entries(editableFields).forEach(([k, v]) => {
        const conf = doc.fieldConfidences?.[k];
        const confStr = conf ? ` [${conf}%]` : '';
        const valStr = typeof v === 'object' ? JSON.stringify(v) : String(v);
        reportContent.push(`  ${k.replace(/_/g, ' ').toUpperCase()}: ${valStr}${confStr}`);
      });

      if (doc.flags && doc.flags.length > 0) {
        reportContent.push('');
        reportContent.push(`Validation Flags:`);
        reportContent.push(`${'-'.repeat(40)}`);
        doc.flags.forEach((f) => {
          reportContent.push(`  [${(f.type || 'info').toUpperCase()}] ${f.message}`);
          if (f.explanation) reportContent.push(`    → ${f.explanation}`);
        });
      }

      reportContent.push('');
      reportContent.push(`Generated: ${new Date().toISOString()}`);
      reportContent.push(`Privacy: Document processed in-memory. No raw data retained.`);

      const blob = new Blob([reportContent.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(doc.fileName || 'report').replace(/\.[^/.]+$/, '')}_report.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setPdfGenerating(false);
    } catch (err) {
      setPdfError('Failed to generate report. Please try again.');
      setPdfGenerating(false);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await chatApi.ask({
        question: userMsg,
        userProfession: 'Enterprise Analyst',
      });
      const reply = res.data?.answer || res.data?.reply || generateLocalAnswer(userMsg, doc);
      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
    } catch (err) {
      const reply = generateLocalAnswer(userMsg, doc);
      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
    } finally {
      setChatLoading(false);
    }
  };

  const generateLocalAnswer = (query, currentDoc) => {
    const q = query.toLowerCase();
    const data = currentDoc.extractedData || {};

    if (q.includes('total') || q.includes('amount') || q.includes('cost')) {
      const total = data.total_amount || data.total_charge;
      return total
        ? `The total amount extracted is ${typeof total === 'number' ? '$' + total : total}.`
        : `No total amount was detected in this document.`;
    }
    if (q.includes('vendor') || q.includes('who') || q.includes('company')) {
      const vendor = data.vendor_name || data.disclosing_party || data.merchant_name;
      return vendor && vendor !== 'Not detected'
        ? `The vendor/party identified is "${vendor}".`
        : `No vendor or company name was detected in this document.`;
    }
    if (q.includes('summary') || q.includes('summarize')) {
      return currentDoc.summary || 'No summary is available for this document.';
    }
    if (q.includes('confidence')) {
      return `The overall extraction confidence is ${currentDoc.confidence}%. Individual field confidences are shown in the Key-Values tab.`;
    }
    return `Based on "${currentDoc.fileName}": This document is classified as ${currentDoc.type} (${currentDoc.category}) with ${currentDoc.confidence}% extraction confidence. ${Object.keys(data).length} fields were extracted.`;
  };

  const isHighConf = doc.confidence >= 80;
  const isExtractionFailed = !doc.extractionSuccess;

  // Format a field value for display
  const formatFieldValue = (val) => {
    if (val === null || val === undefined) return 'Not detected';
    if (typeof val === 'object') return JSON.stringify(val, null, 1);
    return String(val);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Workspace Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-white truncate max-w-md">
                {doc.fileName}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
                {doc.type}
              </span>
              {isExtractionFailed && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex-shrink-0">
                  Extraction Issue
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-0.5 flex-wrap">
              <span>
                Extraction Confidence:{' '}
                <strong className={`font-mono ${isHighConf ? 'text-emerald-400' : isExtractionFailed ? 'text-red-400' : 'text-amber-400'}`}>
                  {doc.confidence}%
                </strong>
              </span>
              <span>•</span>
              <span>
                Processing Time:{' '}
                <strong className="text-white font-mono">{doc.processingTimeMs}ms</strong>
              </span>
              <span>•</span>
              <span>
                Status:{' '}
                <strong className={`font-mono ${doc.status === 'Approved' ? 'text-emerald-400' : doc.status === 'Rejected' ? 'text-red-400' : 'text-amber-400'}`}>
                  {doc.status}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              copilotOpen
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            AI Document Copilot
          </button>

          <button
            onClick={handleCopyJSON}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy JSON'}
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 text-xs font-medium border border-slate-700 flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5" />
            Export JSON
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 text-xs font-medium border border-slate-700 flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export CSV
          </button>

          {/* Download PDF Report */}
          <button
            onClick={handleDownloadPDF}
            disabled={pdfGenerating}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center gap-1.5 disabled:opacity-60"
          >
            {pdfGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            {pdfGenerating ? 'Generating...' : 'Download Report'}
          </button>
        </div>
      </div>

      {pdfError && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {pdfError}
          <button onClick={handleDownloadPDF} className="ml-auto text-red-400 hover:text-red-300 underline">Retry</button>
        </div>
      )}

      {/* AI Summary Banner */}
      <div className={`p-4 rounded-2xl border backdrop-blur-md ${
        isExtractionFailed
          ? 'bg-red-950/20 border-red-500/30'
          : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl flex-shrink-0 ${
            isExtractionFailed ? 'bg-red-500/10' : 'bg-cyan-500/10'
          }`}>
            {isExtractionFailed ? (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            ) : (
              <Sparkles className="w-5 h-5 text-cyan-400" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              {isExtractionFailed ? 'Extraction Warning' : 'AI Executive Summary'}
            </div>
            <p className="text-sm text-slate-200 leading-relaxed break-words">
              {isExtractionFailed && (!doc.summary || doc.summary.startsWith('Summary unavailable'))
                ? 'Summary unavailable — document text could not be extracted. The file may be a scanned image, blank, or corrupted. Try re-uploading a higher quality version.'
                : (doc.summary || 'No summary generated for this document.')
              }
            </p>
          </div>
        </div>
      </div>

      {/* MAIN SPLIT-SCREEN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE (50%): Document Viewer / OCR Text */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            {/* View Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/80 border border-slate-700">
              <button
                onClick={() => setLeftTab('visual')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  leftTab === 'visual'
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Extracted Text
              </button>
              <button
                onClick={() => setLeftTab('ocr')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  leftTab === 'ocr'
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Document Info
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 w-10 text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Left Container Content */}
          {leftTab === 'visual' ? (
            <div
              className="rounded-xl bg-[#090D16] border border-slate-800 p-5 min-h-[520px] max-h-[620px] overflow-auto"
              style={{ fontSize: `${zoomLevel}%` }}
            >
              {doc.extractionSuccess ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      Text Successfully Extracted
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({doc.extractedText.length.toLocaleString()} chars)
                    </span>
                  </div>
                  <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                    {doc.extractedText}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <XCircle className="w-10 h-10 text-red-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-red-300 mb-1">Text Extraction Failed</div>
                    <p className="text-xs text-slate-400 max-w-sm">
                      No machine-readable text could be extracted from this document.
                      It may be a scanned image, blank page, or corrupted file.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/upload')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold border border-slate-700 flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Re-upload Document
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-[#090D16] border border-slate-800 p-5 min-h-[520px] max-h-[620px] overflow-y-auto space-y-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Document Metadata</div>
              <div className="space-y-2 text-xs">
                {[
                  ['File Name', doc.fileName],
                  ['MIME Type', doc.mimeType || 'Unknown'],
                  ['File Size', doc.fileSize ? (typeof doc.fileSize === 'number' ? `${(doc.fileSize / 1024).toFixed(1)} KB` : doc.fileSize) : 'Unknown'],
                  ['Pages', doc.pageCount || 1],
                  ['Document Type', doc.type],
                  ['Category', doc.category],
                  ['Status', doc.status],
                  ['Extraction Confidence', `${doc.confidence}%`],
                  ['Processing Time', `${doc.processingTimeMs}ms`],
                  ['OCR Used', doc.ocrUsed ? 'Yes' : 'No'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-start p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                    <span className="text-slate-400 font-medium">{label}</span>
                    <span className="text-white font-mono text-right break-words max-w-[60%]">{String(value)}</span>
                  </div>
                ))}
              </div>

              {/* Privacy Notice */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 mt-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Privacy</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your uploaded document is processed securely in-memory and is not retained longer than necessary.
                  Extracted text and metadata are stored only within your active session and are removed when the session ends.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANE (50%): Extracted Fields, Tables, Validation, JSON Inspector */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-4 overflow-hidden">
          {/* Sub-Tabs Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab('fields')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'fields'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Key-Values ({Object.keys(editableFields).length})
              </button>

              <button
                onClick={() => setActiveTab('tables')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'tables'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                Table Rows
              </button>

              <button
                onClick={() => setActiveTab('validation')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'validation'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Validation
              </button>

              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'json'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                JSON
              </button>
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="min-h-[500px] max-h-[600px] overflow-y-auto pr-1 space-y-4">
            {/* 1. KEY-VALUE FIELDS TAB */}
            {activeTab === 'fields' && (
              <div className="space-y-3">
                {isExtractionFailed ? (
                  <div className="p-6 text-center space-y-3">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                    <div className="text-sm font-bold text-amber-300">Limited Extraction Results</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Text extraction did not produce enough content for reliable field detection.
                      Fields shown below may be incomplete or inaccurate.
                    </p>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Review and adjust extracted fields. Low confidence fields are flagged for review.</span>
                    <span className="text-cyan-400 font-mono">Editable inline</span>
                  </div>
                )}

                <div className="space-y-2.5">
                  {Object.entries(editableFields).map(([key, val]) => {
                    const conf = doc.fieldConfidences?.[key] || 0;
                    const isNotDetected = val === 'Not detected';
                    const isLow = conf < 70 || isNotDetected;

                    return (
                      <div
                        key={key}
                        className={`p-3 rounded-xl border transition-all ${
                          isNotDetected
                            ? 'bg-slate-800/30 border-slate-700/40 opacity-70'
                            : isLow
                            ? 'bg-amber-950/20 border-amber-500/40'
                            : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isNotDetected && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-700/50 text-slate-500 flex items-center gap-1">
                                Not Detected
                              </span>
                            )}
                            {!isNotDetected && isLow && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Low Confidence
                              </span>
                            )}
                            {conf > 0 && (
                              <span
                                className={`text-[11px] font-mono font-bold ${
                                  isNotDetected ? 'text-slate-600' : isLow ? 'text-amber-400' : 'text-cyan-400'
                                }`}
                              >
                                {conf}%
                              </span>
                            )}
                          </div>
                        </div>

                        {isNotDetected ? (
                          <div className="px-3 py-1.5 rounded-lg bg-slate-900/50 text-xs text-slate-500 italic">
                            Field not detected in document
                          </div>
                        ) : typeof val === 'object' ? (
                          <pre className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap break-words">
                            {JSON.stringify(val, null, 2)}
                          </pre>
                        ) : (
                          <input
                            type="text"
                            value={formatFieldValue(val)}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            className={`w-full px-3 py-1.5 rounded-lg bg-slate-900/90 border text-xs font-medium focus:outline-none transition-colors break-words ${
                              isLow
                                ? 'border-amber-500/40 text-amber-100 focus:border-amber-400'
                                : 'border-slate-700 text-white focus:border-cyan-400'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. TABLE ITEMS TAB */}
            {activeTab === 'tables' && (
              <div className="space-y-4">
                <div className="text-[11px] text-slate-400">
                  Tabular line item extraction with normalized columns.
                </div>

                {doc.tables && doc.tables[0] ? (
                  <div className="rounded-xl border border-slate-800 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                        <tr>
                          {doc.tables[0].headers.map((h, i) => (
                            <th key={i} className="p-3 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200">
                        {doc.tables[0].rows.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-800/30">
                            <td className="p-3 font-medium text-white break-words">{row.description}</td>
                            <td className="p-3 font-mono">{row.qty}</td>
                            <td className="p-3 font-mono">${row.unitPrice}</td>
                            <td className="p-3 font-mono text-cyan-400">{row.tax}</td>
                            <td className="p-3 font-mono font-bold text-emerald-400">
                              ${row.total}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No multi-row table structure detected in this document.
                  </div>
                )}
              </div>
            )}

            {/* 3. VALIDATION / FLAGS TAB */}
            {activeTab === 'validation' && (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-400">
                  Automated validation checks and extraction flags.
                </div>

                {/* Show validation rules if present (from sample data) */}
                {doc.validationRules && doc.validationRules.length > 0 && (
                  <div className="space-y-2.5">
                    {doc.validationRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {rule.status === 'PASSED' ? (
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white">{rule.name}</div>
                            <div className="text-[11px] text-slate-400 break-words">{rule.rule}</div>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex-shrink-0 ml-2 ${
                            rule.status === 'PASSED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {rule.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Show flags from backend */}
                {doc.flags && doc.flags.length > 0 && (
                  <div className="space-y-2.5 mt-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Extraction Flags
                    </div>
                    {doc.flags.map((flag, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border flex items-start gap-3 ${
                          flag.type === 'error' ? 'bg-red-950/20 border-red-500/30' :
                          flag.type === 'warning' ? 'bg-amber-950/20 border-amber-500/30' :
                          flag.type === 'risk' ? 'bg-orange-950/20 border-orange-500/30' :
                          'bg-slate-800/60 border-slate-700'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                          flag.type === 'error' ? 'bg-red-500/10 text-red-400' :
                          flag.type === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                          flag.type === 'risk' ? 'bg-orange-500/10 text-orange-400' :
                          'bg-cyan-500/10 text-cyan-400'
                        }`}>
                          {flag.type === 'error' ? <XCircle className="w-4 h-4" /> :
                           flag.type === 'warning' || flag.type === 'risk' ? <AlertTriangle className="w-4 h-4" /> :
                           <AlertCircle className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">{flag.message}</div>
                          {flag.explanation && (
                            <div className="text-[11px] text-slate-400 mt-0.5 break-words">{flag.explanation}</div>
                          )}
                          {flag.field && (
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Field: {flag.field}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No validation data at all */}
                {(!doc.validationRules || doc.validationRules.length === 0) && (!doc.flags || doc.flags.length === 0) && (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No validation rules or flags generated for this document.
                  </div>
                )}
              </div>
            )}

            {/* 4. RAW JSON INSPECTOR */}
            {activeTab === 'json' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Structured output ready for ingestion via REST API or database sync.</span>
                  <button
                    onClick={handleCopyJSON}
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy JSON
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#0B1020] border border-slate-800 text-cyan-300 font-mono text-xs leading-relaxed overflow-x-auto max-h-[460px] whitespace-pre-wrap break-words">
                  {JSON.stringify(editableFields, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI DOCUMENT COPILOT DRAWER / MODAL */}
      {copilotOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl z-50 overflow-hidden flex flex-col backdrop-blur-xl">
          {/* Header */}
          <div className="p-3.5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                IDP Document Copilot
              </span>
            </div>
            <button
              onClick={() => setCopilotOpen(false)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 max-h-72 min-h-48 overflow-y-auto text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed break-words ${
                    m.sender === 'user'
                      ? 'bg-cyan-500 text-black font-medium'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Analyzing document context...
                </div>
              </div>
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900/90 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about this document..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
