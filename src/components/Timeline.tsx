import type { Report } from '@/types';
import { STATUS_ORDER } from '@/status';
import { CheckCircle2, Circle } from 'lucide-react';

export function Timeline({ report }: { report: Report }) {
  const reachedIdx = STATUS_ORDER.indexOf(report.status);
  return (
    <div className="relative">
      {STATUS_ORDER.map((status, idx) => {
        const event = [...report.timeline].reverse().find((e) => e.status === status);
        const done = idx <= reachedIdx;
        const isLast = idx === STATUS_ORDER.length - 1;
        return (
          <div key={status} className="flex gap-3 pb-6 last:pb-0 relative">
            {!isLast && (
              <div
                className={`absolute left-[15px] top-7 bottom-0 w-0.5 ${
                  done ? 'bg-brand-500' : 'bg-slate-200'
                }`}
              />
            )}
            <div className="flex-shrink-0 mt-0.5">
              {done ? (
                <CheckCircle2 size={30} className="text-brand-600" fill="currentColor" />
              ) : (
                <Circle size={30} className="text-slate-300" />
              )}
            </div>
            <div className={`pt-0.5 ${done ? '' : 'opacity-50'}`}>
              <p className={`text-sm font-semibold ${done ? 'text-slate-900' : 'text-slate-500'}`}>
                {status}
              </p>
              {event ? (
                <>
                  <p className="text-xs text-slate-500 mt-0.5">{event.note}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {event.actor} · {new Date(event.timestamp).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-400 mt-0.5">Awaiting update</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
