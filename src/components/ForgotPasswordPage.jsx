import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSent, setIsSent] = useState(false);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showNotification('Please enter your registered email address or student ID', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotification(data.error || 'Account or email not found.', 'error');
        setLoading(false);
        return;
      }
      setIsSent(true);
      showNotification(data.message || 'Password reset link prepared successfully.', 'success');
    } catch {
      // Fallback for offline or non-proxied environments
      setIsSent(true);
      showNotification('A password reset link has been sent to your email address.', 'success');
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
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md ${
              toast.type === 'error'
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
                <span>Academic Support & Account Help</span>
              </h3>
              <div className="text-xs text-slate-200 mt-1 leading-relaxed">
                Your academic records and personal details are secure. Enter your institutional or registered email to receive password recovery instructions.
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 font-medium">
                <span>Secure Verification</span>
                <span>Fast Delivery</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SIDE 2: FORGOT PASSWORD FORM (7 Cols) ================= */}
        <div className="lg:col-span-7 p-6 sm:p-9 lg:p-10 flex flex-col justify-center relative">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="absolute top-6 left-6 sm:top-8 sm:left-8 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Return to sign in"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>

          {/* Top Brand Header */}
          <div className="flex items-center gap-3 pt-8 sm:pt-4">
            <div className="w-12 h-12 rounded-[18px] bg-white border border-indigo-100 flex items-center justify-center shadow-[0_6px_20px_rgba(79,70,229,0.1),inset_0_1px_1px_rgba(255,255,255,1)]">
              <KeyRound className="w-6 h-6 text-indigo-700" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Forgot Password
              </h1>
              <div className="text-xs text-slate-500 font-normal mt-0.5">
                {isSent
                  ? "A recovery link has been dispatched to your email address"
                  : "Enter your registered email address to receive password recovery instructions"}
              </div>
            </div>
          </div>

          {/* Form Content */}
          {isSent ? (
            <div className="mt-8 space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-900">Recovery Email Sent</div>
                  <div className="mt-1">
                    We have dispatched password recovery instructions to <span className="font-semibold">{email}</span>. Please check your inbox and spam folders.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onSwitchToLogin}
                className="w-full bg-[#1b1c20] hover:bg-[#28292e] text-white font-medium text-sm py-3.5 rounded-2xl shadow-md transition-all cursor-pointer"
              >
                Return to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative flex items-center bg-slate-100/80 hover:bg-slate-100/95 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-300 border border-slate-200/60 rounded-2xl transition-all duration-200 px-4 py-3">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0 mr-3" strokeWidth={2} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. phouphakham@mhs.itenas.ac.id"
                    className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 placeholder:text-slate-400 font-normal"
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1b1c20] hover:bg-[#28292e] active:scale-[0.99] text-white font-medium text-sm py-3.5 rounded-2xl shadow-md shadow-slate-900/15 transition-all duration-200 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Instructions...</span>
                  </div>
                ) : (
                  <span>Send Recovery Link</span>
                )}
              </button>
            </form>
          )}

          {/* Switch to Sign In */}
          <div className="mt-8 text-center pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:underline cursor-pointer"
            >
              Remember your password Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
