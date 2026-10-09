import type { ReportStatus } from './types';

export const STATUS_ORDER: ReportStatus[] = ['Pending', 'Under Review', 'Verified', 'Resolved'];

export const STATUS_STYLES: Record<ReportStatus, { badge: string; dot: string; text: string }> = {
  Pending: {
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dot: 'bg-amber-500',
    text: 'text-amber-600',
  },
  'Under Review': {
    badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    dot: 'bg-blue-500',
    text: 'text-blue-600',
  },
  Verified: {
    badge: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
    dot: 'bg-violet-500',
    text: 'text-violet-600',
  },
  Resolved: {
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dot: 'bg-emerald-500',
    text: 'text-emerald-600',
  },
};

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const day = 86400000;
  const hour = 3600000;
  const min = 60000;
  if (diff >= day) return `${Math.floor(diff / day)}d ago`;
  if (diff >= hour) return `${Math.floor(diff / hour)}h ago`;
  if (diff >= min) return `${Math.floor(diff / min)}m ago`;
  return 'just now';
}
