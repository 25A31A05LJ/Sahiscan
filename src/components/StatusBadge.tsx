import type { ReportStatus } from '@/types';
import { STATUS_STYLES } from '@/status';

export function StatusBadge({ status, size = 'md' }: { status: ReportStatus; size?: 'sm' | 'md' }) {
  const s = STATUS_STYLES[status];
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${pad} ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}
