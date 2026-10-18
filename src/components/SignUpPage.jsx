import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle2, AlertCircle, CreditCard } from 'lucide-react';
import { CountryFlag } from './common/CountryFlag';

export default function SignUpPage({ onSwitchToLogin, onSignUpSuccess }) {
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification('Please enter your full name', 'error');
      return;
    }
    if (!nim.trim()) {
      showNotification('Please enter your Student ID (NIM)', 'error');
      return;
    }
    if (!email.trim()) {
      showNotification('Please enter your email address', 'error');
      return;
    }
    if (!password || password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }
    if (!agreeTerms) {
      showNotification('Please agree to the terms and privacy policy', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          nim: nim.trim(),
          email: email.trim(),
          password,
          role: 'student'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      showNotification('Registration successful! Your account has been saved in the database.', 'success');
      setTimeout(() => {
        if (onSignUpSuccess) {
          onSignUpSuccess(data.user);
        }
      }, 700);
    } catch (err) {
      showNotification(err.message || 'Failed to register account', 'error');
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
          <div className="relative z-10 mt-auto pt-24 space-y-3">
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

        {/* ================= SIDE 2: SIGN UP FORM (7 Cols) ================= */}
        <div className="lg:col-span-7 p-6 sm:p-9 lg:p-10 flex flex-col justify-center">
          {/* Top Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[18px] bg-white border border-indigo-100 flex items-center justify-center shadow-[0_6px_20px_rgba(79,70,229,0.1),inset_0_1px_1px_rgba(255,255,255,1)]">
              <UserPlus className="w-6 h-6 text-indigo-700" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Student Registration
              </h1>
              <div className="text-xs text-slate-500 font-normal mt-0.5">
                Register an account for BIPA learning materials and digital attendance
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            {/* Full Name Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative flex items-center bg-slate-100/80 hover:bg-slate-100/95 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-300 border border-slate-200/60 rounded-2xl transition-all duration-200 px-4 py-2.5">
                <User className="w-4 h-4 text-slate-400 shrink-0 mr-3" strokeWidth={2} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Phouphakham Bounlom"
                  className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 placeholder:text-slate-400 font-normal"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* NIM Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Student ID NIM
              </label>
              <div className="relative flex items-center bg-slate-100/80 hover:bg-slate-100/95 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-300 border border-slate-200/60 rounded-2xl transition-all duration-200 px-4 py-2.5">
                <CreditCard className="w-4 h-4 text-slate-400 shrink-0 mr-3" strokeWidth={2} />
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="e.g. 312024043 or BIPA-2026-096"
                  className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 placeholder:text-slate-400 font-normal"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative flex items-center bg-slate-100/80 hover:bg-slate-100/95 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-300 border border-slate-200/60 rounded-2xl transition-all duration-200 px-4 py-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mr-3" strokeWidth={2} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mhs.itenas.ac.id"
                  className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 placeholder:text-slate-400 font-normal"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative flex items-center bg-slate-100/80 hover:bg-slate-100/95 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-300 border border-slate-200/60 rounded-2xl transition-all duration-200 px-4 py-2.5">
                <Lock className="w-4 h-4 text-slate-400 shrink-0 mr-3" strokeWidth={2} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 placeholder:text-slate-400 font-normal pr-2"
                  autoComplete="new-password"
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

            {/* Terms Agreement Checkbox */}
            <label className="flex items-center gap-2.5 pt-0.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded-md border-slate-300 text-slate-900 focus:ring-0 cursor-pointer accent-slate-900"
              />
              <span className="text-[12px] text-slate-500 leading-tight">
                I agree to the <span className="text-indigo-800 font-semibold hover:underline">Terms of Service</span> and <span className="text-indigo-800 font-semibold hover:underline">Privacy Policy</span>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1b1c20] hover:bg-[#28292e] active:scale-[0.99] text-white font-medium text-sm py-3.5 rounded-2xl shadow-md shadow-slate-900/15 transition-all duration-200 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Registering Account in Database...</span>
                </div>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Switch to Sign In */}
          <div className="mt-5 text-center pt-2 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Already have an account{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-bold text-indigo-700 hover:text-indigo-900 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
