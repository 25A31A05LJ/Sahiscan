import { Logo } from './Logo';
import {
  ShieldCheck,
  FileText,
  Search,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Zap,
} from 'lucide-react';

export function LandingPage({ onLogin }: { onLogin: (role: 'citizen' | 'inspector' | 'admin') => void }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onLogin('citizen')}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-brand-50 transition"
            >
              Citizen Login
            </button>
            <button
              onClick={() => onLogin('inspector')}
              className="text-sm font-semibold text-slate-700 hover:text-brand-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              Inspector
            </button>
            <button
              onClick={() => onLogin('admin')}
              className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-3 sm:px-4 py-2 rounded-lg transition shadow-sm"
            >
              Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-3 py-1 mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-white/90">Civic Compliance Platform · Demo</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Smart Civic Compliance.
              <br />
              <span className="text-brand-200">Faster Resolution.</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl">
              SahiScan connects citizens, field inspectors, and administrators on one platform —
              report civic issues, track them through verification, and resolve them faster with
              full transparency.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onLogin('citizen')}
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3.5 rounded-xl hover:bg-brand-50 transition shadow-lg"
              >
                Citizen Login <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onLogin('inspector')}
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/20 transition ring-1 ring-white/30"
              >
                Inspector Login
              </button>
              <button
                onClick={() => onLogin('admin')}
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/20 transition ring-1 ring-white/30"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,80 L1440,80 L1440,0 C1080,40 360,40 0,0 Z" fill="#f8fafc" />
        </svg>
      </section>

      {/* Problem / Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <span className="text-sm font-bold text-brand-600 uppercase tracking-wide">The Problem</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              Civic complaints disappear into a black hole
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Citizens report issues to scattered departments with no visibility. Complaints get lost,
              statuses are unknown, and resolution takes weeks. Inspectors lack a centralized system,
              and administrators can't measure performance.
            </p>
          </div>
          <div>
            <span className="text-sm font-bold text-emerald-600 uppercase tracking-wide">The Solution</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              One platform, end-to-end accountability
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              SahiScan digitizes the entire complaint lifecycle — from citizen report to inspector
              verification to administrative resolution. Every action is tracked, every status
              visible, and every report accountable.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-bold text-brand-600 uppercase tracking-wide">How SahiScan Works</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">Three roles, one workflow</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                step: '01',
                title: 'Citizen Reports',
                desc: 'A citizen files a complaint with details, category, and location. It lands instantly in the system.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: Search,
                step: '02',
                title: 'Inspector Verifies',
                desc: 'A field inspector reviews, visits the site, and moves the report through review and verification.',
                color: 'bg-violet-50 text-violet-600',
              },
              {
                icon: CheckCircle2,
                step: '03',
                title: 'Admin Resolves',
                desc: 'Administrators monitor everything, allocate resources, and close reports with full tracking.',
                color: 'bg-emerald-50 text-emerald-600',
              },
            ].map((s) => (
              <div key={s.step} className="relative bg-slate-50 rounded-2xl p-6 ring-1 ring-slate-200 hover:shadow-soft transition">
                <div className={`h-12 w-12 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
                  <s.icon size={24} />
                </div>
                <span className="absolute top-6 right-6 text-3xl font-extrabold text-slate-200">{s.step}</span>
                <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-bold text-brand-600 uppercase tracking-wide">Features</span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">Everything you need for civic compliance</h2>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FileText, title: 'Report Issues', desc: 'Citizens file complaints with category, location, and photo evidence.', color: 'bg-blue-50 text-blue-600' },
            { icon: Clock, title: 'Track Complaints', desc: 'Real-time status tracking from Pending to Resolved with full timelines.', color: 'bg-amber-50 text-amber-600' },
            { icon: ShieldCheck, title: 'Inspector Verification', desc: 'Field inspectors review, verify, and update report statuses on-site.', color: 'bg-violet-50 text-violet-600' },
            { icon: BarChart3, title: 'Admin Analytics', desc: 'Dashboards with resolution rates, category breakdowns, and trends.', color: 'bg-emerald-50 text-emerald-600' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 ring-1 ring-slate-200 hover:shadow-soft hover:-translate-y-0.5 transition">
              <div className={`h-11 w-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-brand-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: '1,200+', label: 'Issues Reported' },
              { value: '840+', label: 'Resolved' },
              { value: '70%', label: 'Resolution Rate' },
              { value: '< 5 days', label: 'Avg. Resolution' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-brand-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="bg-gradient-to-br from-slate-900 to-brand-900 rounded-3xl p-8 sm:p-12 text-center">
          <Zap className="mx-auto text-brand-400" size={32} />
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to see SahiScan in action?
          </h2>
          <p className="mt-3 text-slate-300 max-w-lg mx-auto">
            Try the live demo with pre-loaded reports and full functionality across all three roles.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => onLogin('citizen')}
              className="bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition"
            >
              Try as Citizen
            </button>
            <button
              onClick={() => onLogin('inspector')}
              className="bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 transition"
            >
              Try as Inspector
            </button>
            <button
              onClick={() => onLogin('admin')}
              className="bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 transition"
            >
              Try as Admin
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
          </div>
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <MapPin size={14} /> Built for civic compliance · Hackathon Demo
          </p>
        </div>
      </footer>
    </div>
  );
}
