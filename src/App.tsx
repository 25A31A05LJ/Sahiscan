import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './auth';
import { ToastProvider } from './components/Toast';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { CitizenDashboard } from './components/CitizenDashboard';
import { InspectorDashboard } from './components/InspectorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import type { Role } from './types';

type View = 'landing' | 'login' | 'dashboard';

function AppInner() {
  const { session } = useAuth();
  const [view, setView] = useState<View>('landing');
  const [loginRole, setLoginRole] = useState<Role>('citizen');

  useEffect(() => {
    if (session) setView('dashboard');
    else if (view === 'dashboard') setView('landing');
  }, [session]);

  const handleLoginClick = (role: Role) => {
    setLoginRole(role);
    setView('login');
  };

  if (view === 'dashboard' && session) {
    return (
      <>
        {session.role === 'citizen' && <CitizenDashboard />}
        {session.role === 'inspector' && <InspectorDashboard />}
        {session.role === 'admin' && <AdminDashboard />}
      </>
    );
  }

  if (view === 'login') {
    return <LoginPage initialRole={loginRole} onBack={() => setView('landing')} />;
  }

  return <LandingPage onLogin={handleLoginClick} />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </AuthProvider>
  );
}
