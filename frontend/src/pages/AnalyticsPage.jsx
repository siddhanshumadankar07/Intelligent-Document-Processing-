import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Download,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { MOCK_DASHBOARD_METRICS } from '../services/sampleData';

export const AnalyticsPage = () => {
  const throughputData = [
    { hour: '08:00', invoices: 24, contracts: 8, medical: 12, receipts: 14 },
    { hour: '10:00', invoices: 62, contracts: 18, medical: 25, receipts: 30 },
    { hour: '12:00', invoices: 85, contracts: 32, medical: 40, receipts: 45 },
    { hour: '14:00', invoices: 98, contracts: 44, medical: 38, receipts: 52 },
    { hour: '16:00', invoices: 72, contracts: 28, medical: 30, receipts: 38 },
    { hour: '18:00', invoices: 45, contracts: 15, medical: 18, receipts: 22 },
  ];

  const accuracyTrends = [
    { month: 'Apr', accuracy: 96.2, latency: 1.8 },
    { month: 'May', accuracy: 97.1, latency: 1.6 },
    { month: 'Jun', accuracy: 97.8, latency: 1.4 },
    { month: 'Jul', accuracy: 98.2, latency: 1.2 },
    { month: 'Aug', accuracy: 98.4, latency: 1.1 },
    { month: 'Sep', accuracy: 98.6, latency: 1.1 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            Performance & Insights
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            IDP Analytics & ROI Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Deep dive into processing latency, model confidence curves, and ingestion throughput.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Last 30 Days
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Documents Ingested</div>
          <div className="text-3xl font-black text-white font-mono mt-2">1,482</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% vs last month
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Average Processing Latency</div>
          <div className="text-3xl font-black text-cyan-400 font-mono mt-2">1.12s</div>
          <div className="text-[11px] text-slate-400 mt-1">Per multi-page document</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Automated Pass Rate</div>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-2">96.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero human intervention needed</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Estimated Time Saved</div>
          <div className="text-3xl font-black text-blue-400 font-mono mt-2">342 hrs</div>
          <div className="text-[11px] text-slate-400 mt-1">~14.2 min saved per invoice/contract</div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Throughput By Document Type */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Ingestion Volume By Document Category</h3>
              <p className="text-xs text-slate-400">Peak daytime distribution</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend />
                <Bar dataKey="invoices" name="Invoices" fill="#00D2FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="contracts" name="Contracts" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="medical" name="Medical" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Accuracy & Latency Trend */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Accuracy vs Processing Latency</h3>
              <p className="text-xs text-slate-400">Continuous fine-tuning progression</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis domain={[94, 100]} stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  name="Accuracy (%)"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
