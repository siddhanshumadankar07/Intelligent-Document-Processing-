import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileCode,
  FileSpreadsheet,
} from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../services/sampleData';

export const DocumentsPage = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState(SAMPLE_DOCUMENTS);
  const [search, setSearch] = useState('');
  const [selectedDocs, setSelectedDocs] = useState([]);

  const filtered = documents.filter((d) =>
    (d.fileName || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.documentType || '').toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleOpen = (doc) => {
    sessionStorage.setItem('clause_active_demo_doc', JSON.stringify(doc));
    navigate('/results');
  };

  const handleBulkExportJSON = () => {
    const toExport = documents.filter((d) => selectedDocs.includes(d.id));
    const blob = new Blob([JSON.stringify(toExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk_export_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" />
            Document Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            All Processed Documents
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Filter, search, and bulk export structured extraction outputs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedDocs.length > 0 && (
            <button
              onClick={handleBulkExportJSON}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Selected ({selectedDocs.length})
            </button>
          )}

          <button
            onClick={() => navigate('/upload')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            Upload New
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name or document type..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Showing {filtered.length} of {documents.length} items
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => {
          const isSelected = selectedDocs.includes(doc.id);
          const isHighConf = doc.confidenceScore >= 0.9;

          return (
            <div
              key={doc.id}
              className={`p-5 rounded-2xl border transition-all relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/20 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                    {doc.documentCategory}
                  </span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(doc.id)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-1 line-clamp-1">
                  {doc.fileName}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {doc.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-bold ${
                      isHighConf ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {(doc.confidenceScore * 100).toFixed(1)}%
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{doc.fileSize}</span>
                </div>

                <button
                  onClick={() => handleOpen(doc)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-[11px] border border-slate-700 flex items-center gap-1"
                >
                  <Eye className="w-3 h-3 text-cyan-400" />
                  Inspect
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
