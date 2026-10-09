import { ShieldCheck } from 'lucide-react';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { box: 'h-8 w-8', icon: 18, text: 'text-lg' },
    md: { box: 'h-10 w-10', icon: 22, text: 'text-xl' },
    lg: { box: 'h-12 w-12', icon: 28, text: 'text-2xl' },
  };
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${s.box} rounded-xl bg-brand-600 flex items-center justify-center shadow-sm`}>
        <ShieldCheck size={s.icon} className="text-white" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${s.text} font-extrabold tracking-tight text-slate-900`}>
          Sahi<span className="text-brand-600">Scan</span>
        </span>
      </div>
    </div>
  );
}
