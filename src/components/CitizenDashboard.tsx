import { useMemo, useState } from 'react';
import { useAuth } from '@/auth';
import { useReports } from '@/store';
import type { Report, ReportStatus } from '@/types';
import { DashboardHeader } from './DashboardHeader';
import { ReportCard } from './ReportCard';
import { ReportForm } from './ReportForm';
import { ReportDetail } from './ReportDetail';
import { useToast } from './Toast';
import { Plus, FileText, Clock, Search, CheckCircle2, Inbox, Loader2 } from 'lucide-react';

type FilterKey = 'All' | ReportStatus;

export function CitizenDashboard() {
  const { session } = useAuth();
  const { reports, loading, addReport } = useReports();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Report | null>(null);
  const [filter, setFilter] = useState<FilterKey>('All');

  const myReports = useMemo(
    () => reports.filter((r) => r.citizenContact === session?.identifier),
    [reports, session],
  );

  const counts = useMemo(() => {
    const c = { All: myReports.length, Pending: 0, 'Under Review': 0, Verified: 0, Resolved: 0 };
    myReports.forEach((r) => { (c as Record<string, number>)[r.status]++; });
    return c;
  }, [myReports]);

  const filtered = filter === 'All' ? myReports : myReports.filter((r) => r.status === filter);

  const selectedReport = selected ? reports.find((r) => r.id === selected.id) ?? null : null;

  if (selectedReport) {
    return <ReportDetail report={selectedReport} onBack={() => setSelected(null)} />;
  }

  const stats = [
    { label: 'Total Reports', value: counts.All, icon: FileText, color: 'bg-brand-50 text-brand-600' },
    { label: 'Pending', value: counts.Pending, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Under Review', value: counts['Under Review'], icon: Search, color: 'bg-blue-50 text-blue-600' },
    { label: 'Resolved', value: counts.Resolved, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader title="Citizen Dashboard" onHome={() => setSelected(null)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {session?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Track your civic complaints and report new issues.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition shadow-sm"
          >
            <Plus size={18} /> Report New Issue
          </button>
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

        {/* Filter tabs */}
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

        {/* Reports list */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState onCreate={() => setShowForm(true)} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((r) => (
              <ReportCard key={r.id} report={r} onClick={() => setSelected(r)} />
            ))}
          </div>
        )}
      </div>

      <ReportForm
        open={showForm}
        onClose={() => setShowForm(false)}
        citizenName={session?.name ?? 'Citizen'}
        citizenContact={session?.identifier ?? ''}
        onSubmit={addReport}
      />
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-slate-200 py-16 text-center">
      <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Inbox size={28} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">No reports here yet</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
        You haven't filed any reports in this category. Report a civic issue to get started.
      </p>
      <button
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition shadow-sm"
      >
        <Plus size={18} /> Report New Issue
      </button>
    </div>
  );
}
