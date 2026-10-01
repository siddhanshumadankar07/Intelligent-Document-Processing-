import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Filter,
  FileText,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Download,
} from 'lucide-react';
import api from '../services/api';
import { SAMPLE_DOCUMENTS } from '../services/sampleData';

export const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [results, setResults] = useState(SAMPLE_DOCUMENTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSearch();
  }, [selectedType, selectedStatus]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await api.get('/search', {
        params: {
          q: query,
          type: selectedType,
          status: selectedStatus,
        },
      });
      if (res.data?.success && res.data.results?.length > 0) {
        setResults(res.data.results);
      } else {
        filterLocal();
      }
    } catch (err) {
      filterLocal();
    } finally {
      setLoading(false);
    }
  };

  const filterLocal = () => {
    const q = query.toLowerCase();
    const filtered = SAMPLE_DOCUMENTS.filter((doc) => {
      const matchQ =
        !q ||
        (doc.fileName || '').toLowerCase().includes(q) ||
        (doc.summary || '').toLowerCase().includes(q) ||
        (doc.rawOcrText || '').toLowerCase().includes(q) ||
        JSON.stringify(doc.extractedData || {}).toLowerCase().includes(q);

      const matchType =
        selectedType === 'all' ||
        (doc.documentType || '').toLowerCase().includes(selectedType.toLowerCase());

      const matchStatus =
        selectedStatus === 'all' ||
        (doc.status || '').toLowerCase() === selectedStatus.toLowerCase();

      return matchQ && matchType && matchStatus;
    });
    setResults(filtered);
  };

  const handleOpenDoc = (doc) => {
    sessionStorage.setItem('clause_active_demo_doc', JSON.stringify(doc));
    navigate('/results');
  };

  const typeFilters = [
    { id: 'all', label: 'All Types' },
    { id: 'invoice', label: 'Invoices' },
    { id: 'contract', label: 'Contracts' },
    { id: 'medical', label: 'Medical Reports' },
    { id: 'receipt', label: 'Receipts' },
  ];

  const statusFilters = [
    { id: 'all', label: 'All Statuses' },
    { id: 'VALIDATED', label: 'Validated' },
    { id: 'REVIEW_NEEDED', label: 'Review Needed' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
          <SearchIcon className="w-3.5 h-3.5" />
          Cross-Document Intelligence
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Session Document Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Semantic and key-value search across OCR text streams, extracted entities, and line items.
        </p>
      </div>

      {/* Search Bar & Filter Strip */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                filterLocal();
              }}
              placeholder="Search by vendor, line item, GSTIN, amount, or contract terms..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Type:</span>
            {typeFilters.map((tf) => (
              <button
                key={tf.id}
                onClick={() => setSelectedType(tf.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedType === tf.id
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Status:</span>
            {statusFilters.map((sf) => (
              <button
                key={sf.id}
                onClick={() => setSelectedStatus(sf.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedStatus === sf.id
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Found {results.length} Match(es)
        </div>

        {results.length === 0 ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-slate-900/60 border border-slate-800">
            No matching documents found. Try adjusting search keywords or filters.
          </div>
        ) : (
          results.map((doc) => {
            const conf = doc.confidenceScore || 0.95;
            const isLow = conf < 0.75;
            return (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {doc.fileName}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {doc.documentType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 max-w-2xl leading-relaxed">
                    {doc.summary}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div
                      className={`text-xs font-bold font-mono ${
                        isLow ? 'text-amber-400' : 'text-cyan-400'
                      }`}
                    >
                      {(conf * 100).toFixed(1)}% Conf
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {doc.fileSize}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenDoc(doc)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    Inspect
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
