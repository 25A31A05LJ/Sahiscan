import { useAuth } from '@/auth';
import { Logo } from './Logo';
import { LogOut, Home } from 'lucide-react';
import type { Role } from '@/types';

const ROLE_LABEL: Record<Role, string> = {
  citizen: 'Citizen',
  inspector: 'Inspector',
  admin: 'Admin',
};

export function DashboardHeader({
  onHome,
  title,
}: {
  onHome: () => void;
  title: string;
}) {
  const { session, logout } = useAuth();
  if (!session) return null;
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onHome} className="flex items-center gap-2 hover:opacity-80 transition">
            <Logo size="sm" />
          </button>
          <span className="hidden sm:inline text-slate-300">/</span>
          <span className="hidden sm:inline text-sm font-medium text-slate-600">{title}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onHome}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 transition px-2 sm:px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100">
            <div className="h-7 w-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div className="leading-none">
              <p className="text-xs font-semibold text-slate-800">{session.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{ROLE_LABEL[session.role]}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-red-600 transition px-2 sm:px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
