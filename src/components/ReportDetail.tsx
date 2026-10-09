import type { ReactNode } from 'react';
import type { Report } from '@/types';
import { StatusBadge } from './StatusBadge';
import { Timeline } from './Timeline';
import { DashboardHeader } from './DashboardHeader';
import { formatDateTime, timeAgo } from '@/status';
import {
  ArrowLeft, MapPin, User, Phone, Calendar, Tag, FileText,
  ImageIcon, ShieldCheck, Clock,
} from 'lucide-react';

export function ReportDetail({
  report,
  onBack,
  actions,
}: {
  report: Report;
  onBack: () => void;
  actions?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader title={`Report ${report.id}`} onHome={onBack} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 transition mb-4"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-5 sm:p-6 animate-fade-in">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-sm font-mono font-bold text-brand-600">{report.id}</span>
                  <h1 className="text-xl font-extrabold text-slate-900 mt-1 tracking-tight">{report.title}</h1>
                </div>
                <StatusBadge status={report.status} />
              </div>

              {report.image && (
                <div className="rounded-xl overflow-hidden ring-1 ring-slate-200 mb-5">
                  <img src={report.image} alt="Evidence" className="w-full max-h-80 object-cover" />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <InfoRow icon={Tag} label="Category" value={report.category} />
                <InfoRow icon={MapPin} label="Location" value={report.location} />
                <InfoRow icon={User} label="Filed by" value={report.citizenName} />
                <InfoRow icon={Phone} label="Contact" value={report.citizenContact} />
                <InfoRow icon={Calendar} label="Filed on" value={formatDateTime(report.createdAt)} />
                <InfoRow icon={Clock} label="Last updated" value={timeAgo(report.updatedAt)} />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-700">Description</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{report.description}</p>
              </div>

              {report.assignedInspector && (
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-600">
                      Assigned Inspector: <span className="font-semibold text-slate-800">{report.assignedInspector}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-5 sm:p-6">
              <h3 className="font-bold text-slate-900 mb-5">Status Timeline</h3>
              <Timeline report={report} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-5 sticky top-20">
              <h3 className="font-bold text-slate-900 mb-1">Actions</h3>
              <p className="text-xs text-slate-500 mb-4">Update the report status to move it forward.</p>
              {actions ? (
                actions
              ) : (
                <div className="text-sm text-slate-400 bg-slate-50 rounded-xl p-4 text-center">
                  <ImageIcon size={20} className="mx-auto mb-2 text-slate-300" />
                  You can view this report but cannot change its status.
                </div>
              )}

              <div className="mt-5 pt-5 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Quick Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Current Status</span>
                    <StatusBadge status={report.status} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Timeline Events</span>
                    <span className="font-semibold text-slate-800">{report.timeline.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Category</span>
                    <span className="font-semibold text-slate-800 text-xs">{report.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}
