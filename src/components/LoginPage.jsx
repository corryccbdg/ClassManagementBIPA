import React, { useState } from 'react';
import { Lock, Eye, EyeOff, LogIn, CheckCircle2, AlertCircle, CreditCard, X, ChevronRight, User } from 'lucide-react';
import { CountryFlag } from './common/CountryFlag';

export default function LoginPage({ onLoginSuccess, onSwitchToForgotPassword }) {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Google SSO Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleNim, setCustomGoogleNim] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const [googleAccounts, setGoogleAccounts] = useState([
    {
      name: 'Phouphakham Bounlom',
      email: '312024043@mhs.itenas.ac.id',
      nim: '312024043',
      role: 'student',
      country: 'la',
      countryName: 'Laos',
      avatar: '🇱🇦',
      badge: 'BIPA Student'
    },
    {
      name: 'Tam Chanthasone',
      email: '312024144@mhs.itenas.ac.id',
      nim: '312024144',
      role: 'student',
      country: 'la',
      countryName: 'Laos',
      avatar: '🇱🇦',
      badge: 'BIPA Student'
    },
    {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@mhs.itenas.ac.id',
      nim: 'BIPA-2026-081',
      role: 'student',
      country: 'au',
      countryName: 'Australia',
      avatar: '🇦🇺',
      badge: 'BIPA Student'
    },
    {
      name: 'Dianita, S.S., M.Hum.',
      email: 'dianita@itenas.ac.id',
      nip: '198704122015052001',
      role: 'teacher',
      country: 'id',
      countryName: 'Indonesia',
      avatar: 'LC',
      badge: 'Course Lecturer'
    },
    {
      name: 'Dr. Siti Rahmawati, M.Pd.',
      email: 'siti.rahmawati@itenas.ac.id',
      nip: '197508152002122001',
      role: 'teacher',
      country: 'id',
      countryName: 'Indonesia',
      avatar: 'LC',
      badge: 'Course Lecturer'
    }
  ]);

  React.useEffect(() => {
    let isMounted = true;
    async function fetchAccounts() {
      try {
        const res = await fetch('/api/auth/dummy-accounts');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            setGoogleAccounts(data);
          }
        }
      } catch (err) {
        console.warn('Failed to load dynamic accounts for login:', err);
      }
    }
    fetchAccounts();
    return () => {
      isMounted = false;
    };
  }, []);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleGoogleLogin = async (acc) => {
    setGoogleLoading(true);
    try {
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: acc.email,
          name: acc.name,
          nim: acc.nim,
          avatar: acc.avatar
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Google authentication failed');
      }

      showNotification(`Google login successful! Welcome, ${data.user?.name}`, 'success');
      setShowGoogleModal(false);
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }, 600);
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) {
      showNotification('Please enter your institutional Google email', 'error');
      return;
    }
    const clean = customGoogleEmail.trim().toLowerCase();
    if (!clean.endsWith('@mhs.itenas.ac.id') && !clean.endsWith('@itenas.ac.id')) {
      showNotification('Please use an official @mhs.itenas.ac.id (Student) or @itenas.ac.id (Lecturer) email', 'error');
      return;
    }

    handleGoogleLogin({
      email: clean,
      name: customGoogleName.trim() || undefined,
      nim: customGoogleNim.trim() || undefined
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nim.trim()) {
      showNotification('Please enter your Student ID (NIM) or Username', 'error');
      return;
    }
    if (!password) {
      showNotification('Please enter your password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: nim.trim(),
          password: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      showNotification(`Signed in successfully! Welcome, ${data.user?.name || 'User'} (${data.user?.role?.toUpperCase()})`, 'success');
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }, 700);
    } catch (err) {
      showNotification(err.message || 'Failed to connect to backend server', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-hidden select-none bg-[#e8eaf8]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d9dcf7] via-[#e8eaf8] to-[#f4f5fd]" />

      {/* Atmospheric Soft Light Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-indigo-950/10 pointer-events-none" />

      {/* Subtle Concentric Rings behind the Card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full border border-indigo-300/30 shadow-inner" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[1050px] h-[1050px] rounded-full border border-indigo-300/20" />
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md ${toast.type === 'error'
              ? 'bg-rose-50/95 text-rose-800 border-rose-200'
              : 'bg-emerald-50/95 text-emerald-900 border-emerald-200'
              }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* 2-COLUMN MAIN CARD */}
      <div className="relative z-10 w-full max-w-[1020px] rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_24px_70px_-15px_rgba(28,45,100,0.18),0_0_0_1px_rgba(255,255,255,0.8)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        {/* Subtle Bottom Glow Line */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-64 h-2 bg-gradient-to-r from-blue-400/20 via-indigo-400/30 to-purple-400/20 blur-md rounded-full pointer-events-none" />

        {/* ================= SIDE 1: FLAT DESIGN ILLUSTRATION (5 Cols) ================= */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-7 text-white overflow-hidden bg-slate-900">
          {/* Background Illustration */}
          <img
            src="/international_students_study.jpg"
            alt="International Students Learning Indonesian"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.03] transition-transform duration-700 hover:scale-105"
          />

          {/* Vignette / Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/40 to-slate-900/60 pointer-events-none" />
          <div className="absolute inset-0 bg-indigo-950/20 mix-blend-multiply pointer-events-none" />

          {/* Bottom Content Card */}
          <div className="relative z-10 mt-auto space-y-3">
            <div className="p-4 rounded-2xl bg-slate-900/75 backdrop-blur-md border border-white/20 shadow-lg">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Learning Indonesian for Global Speakers</span>
              </h3>
              <div className="text-xs text-slate-200 mt-1 leading-relaxed">
                Unified academic platform for syllabus curriculum, interactive thematic modules, QR digital attendance, and official class reports for BIPA & Darmasiswa RI.
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-200 font-medium">
                <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  <CountryFlag code="de" className="w-4 h-3 rounded-[2px] shadow-sm" />
                  <span>Germany</span>
                </span>
                <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  <CountryFlag code="jp" className="w-4 h-3 rounded-[2px] shadow-sm" />
                  <span>Japan</span>
                </span>
                <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  <CountryFlag code="au" className="w-4 h-3 rounded-[2px] shadow-sm" />
                  <span>Australia</span>
                </span>
                <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  <CountryFlag code="la" className="w-4 h-3 rounded-[2px] shadow-sm" />
                  <span>Laos</span>
                </span>
                <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  <CountryFlag code="kr" className="w-4 h-3 rounded-[2px] shadow-sm" />
                  <span>Korea</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SIDE 2: LOGIN FORM (7 Cols) ================= */}
        <div className="lg:col-span-7 p-6 sm:p-9 lg:p-10 flex flex-col justify-center">
          {/* Top Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[18px] bg-white border border-indigo-100 flex items-center justify-center shadow-[0_6px_20px_rgba(79,70,229,0.1),inset_0_1px_1px_rgba(255,255,255,1)]">
              <LogIn className="w-6 h-6 text-indigo-700 translate-x-0.5" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Sign In to Lentera BIPA
              </h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            {/* NIM / Identifier Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Student ID NIM or Institutional Email or Username
              </label>
              <div className="relative flex items-center bg-slate-100/80 hover:bg-slate-100/95 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-300 border border-slate-200/60 rounded-2xl transition-all duration-200 px-4 py-3">
                <CreditCard className="w-4 h-4 text-slate-400 shrink-0 mr-3" strokeWidth={2} />
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 placeholder:text-slate-400 font-normal"
                  autoComplete="username"
                  placeholder="Enter Student ID, Email, or Username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative flex items-center bg-slate-100/80 hover:bg-slate-100/95 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-300 border border-slate-200/60 rounded-2xl transition-all duration-200 px-4 py-3">
                <Lock className="w-4 h-4 text-slate-400 shrink-0 mr-3" strokeWidth={2} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 placeholder:text-slate-400 font-normal pr-2"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors ml-1 p-0.5 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1b1c20] hover:bg-[#28292e] active:scale-[0.99] text-white font-medium text-sm py-3.5 rounded-2xl shadow-md shadow-slate-900/15 transition-all duration-200 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Account...</span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-400">
              <span className="bg-white px-3">or</span>
            </div>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={() => {
              setIsCustomMode(false);
              setShowGoogleModal(true);
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-800 text-sm font-bold shadow-xs transition-all cursor-pointer group"
          >
            {/* Google 'G' official SVG */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.15C3.25 21.43 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.21C.44 8.1 0 9.99 0 12s.44 3.9 1.21 5.44l4.11-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.57 1.21 6.56l4.11 3.15c.94-2.82 3.58-4.96 6.68-4.96z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>

      {/* ================= MODAL: GOOGLE ACCOUNT CHOOSER (SSO ITENAS) ================= */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Google Dialog Header */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.15C3.25 21.43 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.21C.44 8.1 0 9.99 0 12s.44 3.9 1.21 5.44l4.11-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.57 1.21 6.56l4.11 3.15c.94-2.82 3.58-4.96 6.68-4.96z"
                  />
                </svg>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Choose an Itenas Google Account
                  </h3>
                  <div className="text-xs text-slate-500">
                    Sign in to Lentera BIPA Management Portal
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Google Accounts List */}
            {!isCustomMode ? (
              <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                {googleAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={googleLoading}
                    onClick={() => handleGoogleLogin(acc)}
                    className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between cursor-pointer group disabled:opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shadow-2xs">
                        {acc.country ? (
                          <CountryFlag code={acc.country} className="w-5 h-3.5 rounded-[2px]" />
                        ) : (
                          <User className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {acc.name}
                          </div>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${acc.role === 'student'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-blue-50 text-blue-700'
                              }`}
                          >
                            {acc.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{acc.email}</div>
                        {acc.nim && (
                          <div className="text-[10px] text-slate-400">NIM {acc.nim}</div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}

                {/* Option to use another Google account */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(true)}
                    className="w-full p-3 rounded-2xl text-left hover:bg-slate-50 border border-dashed border-slate-200 text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-indigo-600" />
                    <span>Use another Itenas Google account</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Custom Google Form */
              <form onSubmit={handleCustomGoogleSubmit} className="p-5 space-y-3.5">
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-800 text-xs leading-relaxed">
                  Enter your official institutional Google Workspace email. For students ending with @mhs.itenas.ac.id and lecturers ending with @itenas.ac.id
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Itenas Google Email
                  </label>
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="e.g. 312024099@mhs.itenas.ac.id or name@itenas.ac.id"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    placeholder="e.g. Alex Ferguson"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student ID NIM Students only
                  </label>
                  <input
                    type="text"
                    value={customGoogleNim}
                    onChange={(e) => setCustomGoogleNim(e.target.value)}
                    placeholder="e.g. 312024099"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={googleLoading}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-60"
                  >
                    {googleLoading ? 'Verifying' : 'Continue to Sign In'}
                  </button>
                </div>
              </form>
            )}

            {/* Google Dialog Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>Google Identity Service</span>
              <span>National Institute of Technology Bandung ITENAS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
