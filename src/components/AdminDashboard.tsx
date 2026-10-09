import { useMemo, useState } from 'react';
import { useReports } from '@/store';
import type { Report, ReportCategory, ReportStatus } from '@/types';
import { DashboardHeader } from './DashboardHeader';
import { ReportDetail } from './ReportDetail';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '@/status';
import { STATUS_ORDER } from '@/status';
import {
  FileText, Clock, Search, ShieldCheck, CheckCircle2, TrendingUp,
  ChevronRight, Loader2, MapPin, User, BarChart3, PieChart,
} from 'lucide-react';

type FilterKey = 'All' | ReportStatus;

export function AdminDashboard() {
  const { reports, loading, updateStatus } = useReports();
  const [selected, setSelected] = useState<Report | null>(null);
  const [filter, setFilter] = useState<FilterKey>('All');
  const [search, setSearch] = useState('');

  const counts = useMemo(() => {
    const c = { All: reports.length, Pending: 0, 'Under Review': 0, Verified: 0, Resolved: 0 };
    reports.forEach((r) => { (c as Record<string, number>)[r.status]++; });
    return c;
  }, [reports]);

  const resolutionRate = counts.All > 0 ? Math.round((counts.Resolved / counts.All) * 100) : 0;

  const categoryCounts = useMemo(() => {
    const map = new Map<ReportCategory, number>();
    reports.forEach((r) => map.set(r.category, (map.get(r.category) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [reports]);

  const filtered = useMemo(() => {
    let result = filter === 'All' ? reports : reports.filter((r) => r.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.citizenName.toLowerCase().includes(q),
      );
    }
    return result;
  }, [reports, filter, search]);

  const selectedReport = selected ? reports.find((r) => r.id === selected.id) ?? null : null;

  const handleAdvance = (report: Report) => {
    const idx = STATUS_ORDER.indexOf(report.status);
    if (idx >= STATUS_ORDER.length - 1) return;
    const nextStatus = STATUS_ORDER[idx + 1];
    const notes: Record<ReportStatus, string> = {
      Pending: '',
      'Under Review': 'Admin escalated for review.',
      Verified: 'Admin verified the report.',
      Resolved: 'Admin marked the issue as resolved.',
    };
    updateStatus(report.id, nextStatus, notes[nextStatus], 'admin@sahiscan.gov.in', 'admin');
  };

  if (selectedReport) {
    return (
      <ReportDetail
        report={selectedReport}
        onBack={() => setSelected(null)}
        actions={
          <AdminAdvanceButton report={selectedReport} onAdvance={handleAdvance} />
        }
      />
    );
  }

  const stats = [
    { label: 'Total Reports', value: counts.All, icon: FileText, color: 'bg-brand-50 text-brand-600' },
    { label: 'Pending', value: counts.Pending, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Under Review', value: counts['Under Review'], icon: Search, color: 'bg-blue-50 text-blue-600' },
    { label: 'Resolved', value: counts.Resolved, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  ];

  const maxCat = Math.max(...categoryCounts.map((c) => c[1]), 1);
  const statusBars = STATUS_ORDER.map((s) => ({
    status: s,
    count: (counts as Record<string, number>)[s],
    pct: counts.All > 0 ? ((counts as Record<string, number>)[s] / counts.All) * 100 : 0,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader title="Admin Dashboard" onHome={() => setSelected(null)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor all civic reports and system performance.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl ring-1 ring-slate-200 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center`}>
                  <s.icon size={20} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-3">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Resolution rate + status distribution */}
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <PieChart size={18} className="text-brand-600" />
              <h3 className="font-bold text-slate-900">Status Distribution</h3>
            </div>
            {/* Donut */}
            <div className="flex items-center gap-6 flex-wrap">
              <DonutChart counts={counts} />
              <div className="flex-1 min-w-[160px] space-y-2.5">
                {statusBars.map((s) => (
                  <div key={s.status}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-600">{s.status}</span>
                      <span className="text-slate-400">{s.count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${DONUT_COLORS[s.status]}`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-600" />
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 leading-none">{resolutionRate}%</p>
                  <p className="text-xs text-slate-500 mt-1">Resolution Rate</p>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-extrabold text-slate-900 leading-none">{counts.Verified}</p>
                <p className="text-xs text-slate-500 mt-1">Verified</p>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={18} className="text-brand-600" />
              <h3 className="font-bold text-slate-900">Reports by Category</h3>
            </div>
            <div className="space-y-3">
              {categoryCounts.map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600 truncate">{cat}</span>
                    <span className="text-slate-400">{count}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
                      style={{ width: `${(count / maxCat) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search all reports..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition bg-white"
            />
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4">
          {(['All', 'Pending', 'Under Review', 'Verified', 'Resolved'] as FilterKey[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                filter === f ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
              {f !== 'All' && (counts as Record<string, number>)[f] > 0 && (
                <span className={`ml-1.5 text-xs ${filter === f ? 'text-white/70' : 'text-slate-400'}`}>
                  {(counts as Record<string, number>)[f]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 py-16 text-center">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No reports found</h3>
            <p className="text-sm text-slate-500 mt-1">No reports match your filter or search.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white rounded-2xl ring-1 ring-slate-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Report ID</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Issue</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Category</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Location</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Citizen</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Date</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelected(r)}>
                      <td className="px-5 py-3.5 text-sm font-mono font-semibold text-brand-600">{r.id}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-800 max-w-xs truncate">{r.title}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">{r.category}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-500 max-w-[160px] truncate">{r.location}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{r.citizenName}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={r.status} size="sm" /></td>
                      <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">{formatDate(r.createdAt)}</td>
                      <td className="px-5 py-3.5"><ChevronRight size={18} className="text-slate-300" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {filtered.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="w-full text-left bg-white rounded-2xl ring-1 ring-slate-200 p-4 hover:shadow-soft transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-brand-600">{r.id}</span>
                    <StatusBadge status={r.status} size="sm" />
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{r.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{r.category}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                    <MapPin size={12} /> <span className="truncate">{r.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-xs text-slate-500"><User size={12} /> {r.citizenName}</span>
                    <span className="text-xs text-slate-400">{formatDate(r.createdAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const DONUT_COLORS: Record<ReportStatus, string> = {
  Pending: '#f59e0b',
  'Under Review': '#3b82f6',
  Verified: '#8b5cf6',
  Resolved: '#10b981',
};

function DonutChart({ counts }: { counts: Record<string, number> }) {
  const total = counts.All;
  const segments = STATUS_ORDER.map((s) => ({
    status: s,
    count: counts[s] ?? 0,
    color: DONUT_COLORS[s],
  })).filter((s) => s.count > 0);

  if (total === 0) {
    return (
      <div className="h-36 w-36 rounded-full bg-slate-100 flex items-center justify-center">
        <span className="text-sm text-slate-400">No data</span>
      </div>
    );
  }

  let offset = 0;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-36 w-36 flex-shrink-0">
      <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="14" />
        {segments.map((seg) => {
          const len = (seg.count / total) * circumference;
          const circle = (
            <circle
              key={seg.status}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeDasharray={`${len} ${circumference - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          );
          offset += len;
          return circle;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-slate-900 leading-none">{total}</span>
        <span className="text-[10px] text-slate-400 mt-1">Total</span>
      </div>
    </div>
  );
}

function AdminAdvanceButton({ report, onAdvance }: { report: Report; onAdvance: (r: Report) => void }) {
  const idx = STATUS_ORDER.indexOf(report.status);
  const isLast = idx >= STATUS_ORDER.length - 1;
  if (isLast) return null;
  const nextStatus = STATUS_ORDER[idx + 1];
  const labels: Record<ReportStatus, string> = {
    Pending: '',
    'Under Review': 'Move to Under Review',
    Verified: 'Mark Verified',
    Resolved: 'Mark Resolved',
  };
  return (
    <button
      onClick={() => onAdvance(report)}
      className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-brand-700 transition shadow-sm"
    >
      {labels[nextStatus]} <ChevronRight size={16} />
    </button>
  );
}
