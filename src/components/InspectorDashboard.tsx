import { useMemo, useState } from 'react';
import { useAuth } from '@/auth';
import { useReports } from '@/store';
import type { Report, ReportStatus } from '@/types';
import { DashboardHeader } from './DashboardHeader';
import { ReportDetail } from './ReportDetail';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '@/status';
import { useToast } from './Toast';
import { STATUS_ORDER } from '@/status';
import { ClipboardList, Clock, ShieldCheck, CheckCircle2, ChevronRight, Loader2, MapPin, User, Search } from 'lucide-react';

type FilterKey = 'All' | ReportStatus;

export function InspectorDashboard() {
  const { session } = useAuth();
  const { reports, loading, updateStatus } = useReports();
  const toast = useToast();
  const [selected, setSelected] = useState<Report | null>(null);
  const [filter, setFilter] = useState<FilterKey>('All');
  const [search, setSearch] = useState('');

  const myReports = useMemo(
    () => reports.filter((r) => r.assignedInspector === session?.identifier),
    [reports, session],
  );

  const counts = useMemo(() => {
    const c = { All: myReports.length, Pending: 0, 'Under Review': 0, Verified: 0, Resolved: 0 };
    myReports.forEach((r) => { (c as Record<string, number>)[r.status]++; });
    return c;
  }, [myReports]);

  const filtered = useMemo(() => {
    let result = filter === 'All' ? myReports : myReports.filter((r) => r.status === filter);
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
  }, [myReports, filter, search]);

  const selectedReport = selected ? reports.find((r) => r.id === selected.id) ?? null : null;

  const handleAdvance = (report: Report) => {
    const idx = STATUS_ORDER.indexOf(report.status);
    if (idx >= STATUS_ORDER.length - 1) return;
    const nextStatus = STATUS_ORDER[idx + 1];
    const notes: Record<ReportStatus, string> = {
      Pending: '',
      'Under Review': 'Inspector started reviewing the report.',
      Verified: 'Inspector verified the issue on-site.',
      Resolved: 'Issue has been resolved and closed.',
    };
    updateStatus(report.id, nextStatus, notes[nextStatus], session?.identifier ?? 'INS-1001', 'inspector');
    toast(`Report moved to "${nextStatus}"`, 'success');
  };

  if (selectedReport) {
    return (
      <ReportDetail
        report={selectedReport}
        onBack={() => setSelected(null)}
        actions={
          <AdvanceButton report={selectedReport} onAdvance={handleAdvance} />
        }
      />
    );
  }

  const stats = [
    { label: 'Assigned', value: counts.All, icon: ClipboardList, color: 'bg-brand-50 text-brand-600' },
    { label: 'Pending', value: counts.Pending, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Verified', value: counts.Verified, icon: ShieldCheck, color: 'bg-violet-50 text-violet-600' },
    { label: 'Resolved', value: counts.Resolved, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader title="Inspector Dashboard" onHome={() => setSelected(null)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Inspector Panel</h1>
          <p className="text-sm text-slate-500 mt-1">
            {session?.identifier} · Review and verify assigned civic reports.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl ring-1 ring-slate-200 p-4 sm:p-5">
              <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <s.icon size={20} />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, issue, location, or citizen..."
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
              <ClipboardList size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No reports found</h3>
            <p className="text-sm text-slate-500 mt-1">No reports match your current filter or search.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl ring-1 ring-slate-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Report ID</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Issue</th>
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
                      <td className="px-5 py-3.5 text-sm text-slate-500 max-w-[180px] truncate">{r.location}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{r.citizenName}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={r.status} size="sm" /></td>
                      <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">{formatDate(r.createdAt)}</td>
                      <td className="px-5 py-3.5"><ChevronRight size={18} className="text-slate-300" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
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

function AdvanceButton({ report, onAdvance }: { report: Report; onAdvance: (r: Report) => void }) {
  const idx = STATUS_ORDER.indexOf(report.status);
  const isLast = idx >= STATUS_ORDER.length - 1;
  if (isLast) return null;
  const nextStatus = STATUS_ORDER[idx + 1];
  const labels: Record<ReportStatus, string> = {
    Pending: '',
    'Under Review': 'Mark Under Review',
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
