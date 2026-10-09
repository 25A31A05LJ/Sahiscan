import { useEffect, useState, useCallback } from 'react';
import type { Report, ReportStatus, Role, Session, TimelineEvent } from './types';
import { DEMO_REPORTS } from './demoData';

const REPORTS_KEY = 'sahiscan:reports';
const SESSION_KEY = 'sahiscan:session';

function loadReports(): Report[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (raw) return JSON.parse(raw) as Report[];
  } catch {
    /* ignore */
  }
  localStorage.setItem(REPORTS_KEY, JSON.stringify(DEMO_REPORTS));
  return DEMO_REPORTS;
}

function saveReports(reports: Report[]) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = loadReports();
    setReports(r);
    setLoading(false);
  }, []);

  const persist = useCallback((next: Report[]) => {
    setReports(next);
    saveReports(next);
  }, []);

  const addReport = useCallback(
    (input: Omit<Report, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'timeline'>) => {
      const now = Date.now();
      const id = 'RPT-' + (2048 + Math.floor(Math.random() * 9000));
      const newReport: Report = {
        ...input,
        id,
        status: 'Pending',
        assignedInspector: 'INS-1001',
        createdAt: now,
        updatedAt: now,
        timeline: [
          {
            status: 'Pending',
            note: 'Report submitted by citizen.',
            actor: input.citizenName,
            actorRole: 'citizen',
            timestamp: now,
          },
        ],
      };
      const next = [newReport, ...reports];
      persist(next);
      return newReport;
    },
    [reports, persist],
  );

  const updateStatus = useCallback(
    (id: string, status: ReportStatus, note: string, actor: string, actorRole: Role) => {
      const now = Date.now();
      const event: TimelineEvent = { status, note, actor, actorRole, timestamp: now };
      const next = reports.map((r) =>
        r.id === id ? { ...r, status, updatedAt: now, timeline: [...r.timeline, event] } : r,
      );
      persist(next);
    },
    [reports, persist],
  );

  return { reports, loading, addReport, updateStatus };
}

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as Session;
  } catch {
    /* ignore */
  }
  return null;
}

export function saveSession(s: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export const CREDENTIALS = {
  citizen: { mobile: '9999999999', otp: '123456', name: 'Rohit Sharma' },
  inspector: { id: 'INS-1001', password: 'Inspector@123', name: 'Inspector Verma' },
  admin: { email: 'admin@sahiscan.gov.in', password: 'Admin@123', name: 'Admin' },
};
