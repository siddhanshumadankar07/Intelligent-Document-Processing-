import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Download,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Shield,
  Layers,
  ArrowUpRight,
  Eye,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { SAMPLE_DOCUMENTS, MOCK_DASHBOARD_METRICS } from '../services/sampleData';
import { documentApi } from '../services/api';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState(SAMPLE_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Load any newly uploaded documents from API or session storage
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await documentApi.getAll();
        if (res.data?.documents && res.data.documents.length > 0) {
          // Merge API docs with sample docs
          const merged = [...res.data.documents, ...SAMPLE_DOCUMENTS];
          // deduplicate by id
          const unique = Array.from(new Map(merged.map((d) => [d.id || d._id, d])).values());
          setDocuments(unique);
        }
      } catch (err) {
        // Use default sample documents
      }
    };
    fetchDocs();
  }, []);

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const nameMatch = (doc.fileName || doc.originalName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatch = selectedType === 'ALL' || (doc.documentType || doc.category || '') === selectedType;
    const statusMatch = selectedStatus === 'ALL' || (doc.status || 'VALIDATED') === selectedStatus;
    return nameMatch && typeMatch && statusMatch;
  });

  const handleOpenDoc = (doc) => {
    sessionStorage.setItem('clause_active_demo_doc', JSON.stringify(doc));
    navigate('/results');
  };

  const handleExportJSON = (doc) => {
    const blob = new Blob([JSON.stringify(doc.extractedData || {}, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(doc.fileName || 'document').replace(/\.[^/.]+$/, '')}_extracted.json`;
    a.click();
  };

  const docTypes = ['ALL', 'Tax Invoice', 'Legal Contract (NDA)', 'Medical Diagnostic Report', 'Expense Receipt'];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            Enterprise Intelligent Document Processing
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            IDP Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time pipeline metrics, automated classification, and confidence distributions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/upload')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            Process Document
          </button>
        </div>
      </div>

      {/* 4 PRIMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents Processed */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Total Processed
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {MOCK_DASHBOARD_METRICS.totalProcessed.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Multi-page PDFs & Scans</div>
        </div>

        {/* Successfully Processed */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Successfully Validated
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {MOCK_DASHBOARD_METRICS.successfullyProcessed.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-400 font-mono">
              96.4%
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Passed automated rule engine</div>
        </div>

        {/* Average Extraction Accuracy */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Avg Extraction Accuracy
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-400 font-mono">
              {MOCK_DASHBOARD_METRICS.accuracyRate}%
            </span>
            <span className="text-xs font-semibold text-cyan-300 font-mono">
              Avg ~1.1s
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Multi-modal OCR & LLM blend</div>
        </div>

        {/* Documents Requiring Review */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Requiring Review
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400 font-mono">
              {MOCK_DASHBOARD_METRICS.requiringReview}
            </span>
            <span className="text-xs font-semibold text-amber-300">
              HITL Queue
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Confidence &lt; 75% or Rule Warning</div>
        </div>
      </div>

      {/* CHARTS SECTION: Processing Activity & Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Processing Activity Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Document Processing Activity (Last 7 Days)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ingested volume vs automated validation rate
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
              Live Stream
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DASHBOARD_METRICS.activityHistory}>
                <defs>
                  <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00D2FF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorValidated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="processed"
                  name="Total Ingested"
                  stroke="#00D2FF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProcessed)"
                />
                <Area
                  type="monotone"
                  dataKey="validated"
                  name="Validated (Pass)"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValidated)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Document Type Distribution Donut Chart */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-cyan-400" />
                Document Type Distribution
              </h3>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_DASHBOARD_METRICS.typeDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {MOCK_DASHBOARD_METRICS.typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-2 pt-3 border-t border-slate-800">
            {MOCK_DASHBOARD_METRICS.typeDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate max-w-[140px]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-slate-400">
                  <span>{item.count}</span>
                  <span className="text-white font-bold">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT DOCUMENTS & FILTER TABLE */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Processed Documents Repository
            </h3>
            <p className="text-xs text-slate-400">
              Inspect OCR field confidences, audit validations, and trigger instant JSON/CSV exports.
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48 sm:w-60"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {docTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Document Types' : t}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="VALIDATED">Validated (Passed)</option>
              <option value="REVIEW_NEEDED">Review Needed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Document Name</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3">Accuracy</th>
                <th className="px-4 py-3">Validation Status</th>
                <th className="px-4 py-3">Processing Speed</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No documents matched the current filters.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const fileName = doc.fileName || doc.originalName || 'Untitled Document';
                  const docType = doc.documentType || doc.category || 'General Document';
                  const conf = doc.confidenceScore || 0.96;
                  const isLow = conf < 0.75 || doc.status === 'REVIEW_NEEDED';

                  return (
                    <tr
                      key={doc.id || doc._id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                              {fileName}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {doc.fileSize || '380 KB'} • {new Date(doc.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {docType}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isLow ? 'bg-amber-500' : 'bg-cyan-400'
                              }`}
                              style={{ width: `${(conf * 100).toFixed(0)}%` }}
                            />
                          </div>
                          <span
                            className={`font-mono font-bold ${
                              isLow ? 'text-amber-400' : 'text-cyan-400'
                            }`}
                          >
                            {(conf * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <AlertTriangle className="w-3 h-3" />
                            REVIEW NEEDED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            VALIDATED
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-400">
                        {doc.processingTimeMs ? `${doc.processingTimeMs}ms` : '1,120ms'}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDoc(doc)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-[11px] border border-slate-700 flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-cyan-400" />
                            Inspect
                          </button>
                          <button
                            onClick={() => handleExportJSON(doc)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700"
                            title="Export JSON"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
