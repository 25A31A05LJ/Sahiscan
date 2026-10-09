import type { Report } from '@/types';
import { StatusBadge } from './StatusBadge';
import { formatDate, timeAgo } from '@/status';
import { MapPin, ChevronRight, ImageIcon } from 'lucide-react';

export function ReportCard({ report, onClick }: { report: Report; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl ring-1 ring-slate-200 p-5 hover:shadow-soft hover:ring-brand-200 transition group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-brand-600 font-mono">{report.id}</span>
            <StatusBadge status={report.status} size="sm" />
          </div>
          <h3 className="font-semibold text-slate-900 truncate group-hover:text-brand-600 transition">
            {report.title}
          </h3>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
            <MapPin size={13} className="flex-shrink-0" />
            <span className="truncate">{report.location}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          {report.image ? (
            <div className="h-16 w-16 rounded-xl overflow-hidden ring-1 ring-slate-200 relative">
              <img src={report.image} alt="" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300">
              <ImageIcon size={20} />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">{report.category}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{formatDate(report.createdAt)}</span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-400">{timeAgo(report.updatedAt)}</span>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-500 transition" />
        </div>
      </div>
    </button>
  );
}
