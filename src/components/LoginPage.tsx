import { useState } from 'react';
import { useAuth } from '@/auth';
import { useToast } from './Toast';
import { CREDENTIALS } from '@/store';
import type { Role, Session } from '@/types';
import { Logo } from './Logo';
import { ArrowLeft, Smartphone, ShieldCheck, Mail, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';

export function LoginPage({
  initialRole,
  onBack,
}: {
  initialRole: Role;
  onBack: () => void;
}) {
  const { login } = useAuth();
  const toast = useToast();
  const [role, setRole] = useState<Role>(initialRole);
  const [showPwd, setShowPwd] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [inspectorId, setInspectorId] = useState('');
  const [inspectorPwd, setInspectorPwd] = useState('');
  const [email, setEmail] = useState('');
  const [adminPwd, setAdminPwd] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const doLogin = (s: Session) => {
    setBusy(true);
    setTimeout(() => {
      login(s);
      toast(`Welcome back, ${s.name}!`, 'success');
    }, 500);
  };

  const handleCitizen = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mobile !== CREDENTIALS.citizen.mobile) {
      setError('Mobile number not recognized. Use the demo number shown below.');
      return;
    }
    if (!otpSent) {
      setOtpSent(true);
      toast('Demo OTP sent: 123456', 'info');
      return;
    }
    if (otp !== CREDENTIALS.citizen.otp) {
      setError('Incorrect OTP. Use 123456 for the demo.');
      return;
    }
    doLogin({ role: 'citizen', name: CREDENTIALS.citizen.name, identifier: mobile });
  };

  const handleInspector = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (inspectorId !== CREDENTIALS.inspector.id) {
      setError('Inspector ID not found. Use the demo ID shown below.');
      return;
    }
    if (inspectorPwd !== CREDENTIALS.inspector.password) {
      setError('Incorrect password. Check the demo credentials below.');
      return;
    }
    doLogin({ role: 'inspector', name: CREDENTIALS.inspector.name, identifier: inspectorId });
  };

  const handleAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email !== CREDENTIALS.admin.email) {
      setError('Email not recognized. Use the demo email shown below.');
      return;
    }
    if (adminPwd !== CREDENTIALS.admin.password) {
      setError('Incorrect password. Check the demo credentials below.');
      return;
    }
    doLogin({ role: 'admin', name: CREDENTIALS.admin.name, identifier: email });
  };

  const roleTabs: { key: Role; label: string; icon: typeof Smartphone }[] = [
    { key: 'citizen', label: 'Citizen', icon: Smartphone },
    { key: 'inspector', label: 'Inspector', icon: ShieldCheck },
    { key: 'admin', label: 'Admin', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition">
          <ArrowLeft size={18} /> Back to home
        </button>
        <Logo size="sm" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-soft ring-1 ring-slate-200 p-6 sm:p-8 animate-scale-in">
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
              {roleTabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => { setRole(t.key); setError(''); setOtpSent(false); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition ${
                    role === t.key ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <t.icon size={16} />
                  {t.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-50 ring-1 ring-red-200 rounded-lg px-3 py-2.5 animate-fade-in">
                {error}
              </div>
            )}

            {role === 'citizen' && (
              <form onSubmit={handleCitizen} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <Smartphone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter 10-digit mobile"
                      maxLength={10}
                      disabled={otpSent}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>
                </div>
                {otpSent && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">OTP</label>
                    <div className="relative">
                      <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
                      />
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-xl hover:bg-brand-700 transition shadow-sm disabled:opacity-60"
                >
                  {busy ? 'Verifying...' : otpSent ? 'Verify & Login' : 'Send OTP'}
                </button>
                <DemoHint label="Demo credentials" value="Mobile: 9999999999 · OTP: 123456" />
              </form>
            )}

            {role === 'inspector' && (
              <form onSubmit={handleInspector} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Inspector ID</label>
                  <div className="relative">
                    <ShieldCheck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={inspectorId}
                      onChange={(e) => setInspectorId(e.target.value)}
                      placeholder="e.g. INS-1001"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={inspectorPwd}
                      onChange={(e) => setInspectorPwd(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={busy} className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-xl hover:bg-brand-700 transition shadow-sm disabled:opacity-60">
                  {busy ? 'Verifying...' : 'Login as Inspector'}
                </button>
                <DemoHint label="Demo credentials" value="ID: INS-1001 · Password: Inspector@123" />
              </form>
            )}

            {role === 'admin' && (
              <form onSubmit={handleAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@sahiscan.gov.in"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={adminPwd}
                      onChange={(e) => setAdminPwd(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={busy} className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-xl hover:bg-brand-700 transition shadow-sm disabled:opacity-60">
                  {busy ? 'Verifying...' : 'Login as Admin'}
                </button>
                <DemoHint label="Demo credentials" value="Email: admin@sahiscan.gov.in · Password: Admin@123" />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoHint({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center pt-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-xs text-slate-500 mt-1">{value}</p>
    </div>
  );
}
