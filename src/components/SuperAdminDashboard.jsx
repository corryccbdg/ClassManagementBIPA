import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  RefreshCw,
  FileText,
  Copy,
  AlertCircle,
  ExternalLink,
  Users,
  Award,
  Layers,
  Sparkles,
  LogOut,
  Building2,
  ChevronRight,
  ArrowRight,
  X,
  Printer
} from 'lucide-react';
import { CountryFlag } from './common/CountryFlag';

export default function SuperAdminDashboard({
  currentUser,
  onLogout,
  onSwitchView
}) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form State
  const [role, setRole] = useState('coordinator');
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [skNumber, setSkNumber] = useState(`SK-REK/08${Math.floor(10 + Math.random() * 89)}/BIPA/2026`);
  const [department, setDepartment] = useState('Faculty of Industrial Technology & Academic Bureau');
  const [notes, setNotes] = useState('');

  // Active Invitation Modal State
  const [invitationModal, setInvitationModal] = useState(null);
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' | 'users'

  // Registered Users list from DB
  const [allUsers, setAllUsers] = useState([]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch assignments and users
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAsg, resUsers] = await Promise.all([
        fetch('/api/admin/assignments'),
        fetch('/api/auth/dummy-accounts')
      ]);

      if (resAsg.ok) {
        const dataAsg = await resAsg.json();
        setAssignments(Array.isArray(dataAsg) ? dataAsg : []);
      }
      if (resUsers.ok) {
        const dataUsers = await resUsers.json();
        setAllUsers(Array.isArray(dataUsers) ? dataUsers : []);
      }
    } catch {
      // Fallback local mock if offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Form Submit
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification('Please enter the officer\'s full name', 'error');
      return;
    }

    // Process email: ensure @itenas.ac.id
    let fullEmail = emailUser.trim().toLowerCase();
    if (!fullEmail) {
      showNotification('Please enter the Itenas email address', 'error');
      return;
    }
    if (!fullEmail.includes('@')) {
      fullEmail = `${fullEmail}@itenas.ac.id`;
    }
    if (!fullEmail.endsWith('@itenas.ac.id')) {
      showNotification('Faculty and officers must use an @itenas.ac.id email address', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/assign-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name: name.trim(),
          nip: nip.trim(),
          email: fullEmail,
          skNumber: skNumber.trim(),
          department: department.trim(),
          notes: notes.trim()
        })
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to assign appointment');
      }

      showNotification(`${role === 'coordinator' ? 'Coordinator' : 'Supervisor'} appointment assigned successfully! Invitation email has been sent.`);

      // Open Invitation Modal Preview
      if (result.invitation) {
        setInvitationModal({
          ...result.invitation,
          assignment: result.assignment
        });
      }

      // Reset Form fields
      setName('');
      setNip('');
      setEmailUser('');
      setNotes('');
      setSkNumber(`SK-REK/08${Math.floor(10 + Math.random() * 89)}/BIPA/2026`);

      fetchData();
    } catch (err) {
      showNotification(err.message || 'An error occurred while processing the appointment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Resend Invitation
  const handleResend = async (assignmentId) => {
    try {
      const res = await fetch('/api/admin/resend-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend invitation');

      showNotification('Invitation email resent successfully to the officer\'s address');
      if (data.invitation) {
        setInvitationModal({
          ...data.invitation,
          assignment: data.assignment
        });
      }
      fetchData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotification('Appointment activation link copied to clipboard!');
  };

  const currentCoordinator = assignments.find(a => a.role === 'coordinator' && (a.status === 'ACTIVE' || a.status === 'INVITED')) || {
    name: 'Prof. Dr. Irwan Susanto',
    nip: '196807141994031002',
    email: 'irwan.susanto@itenas.ac.id',
    skNumber: 'SK-REK/082/BIPA/2026',
    department: 'Faculty of Industrial Technology & Academic Bureau',
    status: 'ACTIVE',
    lastInviteSent: '2026-01-15T08:00:00Z'
  };

  const currentSupervisor = assignments.find(a => a.role === 'supervisor' && (a.status === 'ACTIVE' || a.status === 'INVITED')) || {
    name: 'Dra. Ratna Handayani, M.Hum.',
    nip: '197203151998021001',
    email: 'ratna.handayani@itenas.ac.id',
    skNumber: 'SK-REK/083/BIPA/2026',
    department: 'Quality Assurance & Learning Agency',
    status: 'ACTIVE',
    lastInviteSent: '2026-01-15T08:00:00Z'
  };

  return (
    <div className="min-h-screen bg-[#f3f5fa] text-slate-900 pb-12 select-none">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md ${notification.type === 'error'
              ? 'bg-rose-50/95 text-rose-800 border-rose-200'
              : 'bg-emerald-50/95 text-emerald-900 border-emerald-200'
              }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <ShieldCheck className="w-5 h-5 text-indigo-200" strokeWidth={2.3} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                  Lentera BIPA IT Governance
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
              <div className="text-[11px] text-slate-500">Institut Teknologi Nasional Bandung</div>
            </div>
          </div>

          {/* Quick Preview Links & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
              <span className="px-2 py-1 text-[11px] text-slate-400 font-semibold">View Portal:</span>
              <button
                type="button"
                onClick={() => onSwitchView && onSwitchView('coordinator')}
                className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-xs transition-all cursor-pointer"
              >
                Coordinator
              </button>
              <button
                type="button"
                onClick={() => onSwitchView && onSwitchView('supervisor')}
                className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-xs transition-all cursor-pointer"
              >
                Supervisor
              </button>
              <button
                type="button"
                onClick={() => onSwitchView && onSwitchView('teacher')}
                className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-xs transition-all cursor-pointer"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => onSwitchView && onSwitchView('student')}
                className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-xs transition-all cursor-pointer"
              >
                Student
              </button>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-semibold transition-all cursor-pointer"
              title="Log out of Super Admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Banner Welcome */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                BIPA Leadership Appointments & Assignments
              </h1>
            </div>
          </div>
        </div>

        {/* ================= CURRENT APPOINTED LEADERSHIP (2 CARDS) ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card: Koordinator */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                    Active BIPA Coordinator
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {currentCoordinator.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    NIP: {currentCoordinator.nip || '196807141994031002'}
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {currentCoordinator.status === 'INVITED' ? 'Invitation Sent' : 'Active Mandate'}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Official Email:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {currentCoordinator.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Decree No SK:</span>
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {currentCoordinator.skNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Unit and Department:</span>
                <span className="font-medium text-slate-700 truncate max-w-[200px]">
                  {currentCoordinator.department}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleResend(currentCoordinator.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-slate-500" />
                <span>Resend Invitation</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('coordinator');
                  window.scrollTo({ top: 500, behavior: 'smooth' });
                }}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                <span>Replace Officer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card: Supervisor */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase tracking-wider">
                    Active Supervisor and Quality Assurance
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {currentSupervisor.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    NIP: {currentSupervisor.nip || '197203151998021001'}
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {currentSupervisor.status === 'INVITED' ? 'Invitation Sent' : 'Active Mandate'}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Official Email:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {currentSupervisor.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Decree No SK:</span>
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {currentSupervisor.skNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Unit and Institution:</span>
                <span className="font-medium text-slate-700 truncate max-w-[200px]">
                  {currentSupervisor.department}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleResend(currentSupervisor.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-slate-500" />
                <span>Resend Invitation</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('supervisor');
                  window.scrollTo({ top: 500, behavior: 'smooth' });
                }}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                <span>Replace Officer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ================= FORM PENUGASAN (ASSIGN ROLE) ================= */}
        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
              <UserPlus className="w-5 h-5" strokeWidth={2.3} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Leadership Appointment & Invitation Dispatch Form
              </h2>
              <div className="text-xs text-slate-500">
                Select the role to appoint, complete decree (SK) details, and send an official invitation email.
              </div>
            </div>
          </div>

          <form onSubmit={handleAssignSubmit} className="mt-6 space-y-5">
            {/* 1. Choice of Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. Select Role / Appointment Mandate
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${role === 'coordinator'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="coordinator"
                    checked={role === 'coordinator'}
                    onChange={() => setRole('coordinator')}
                    className="w-4 h-4 text-indigo-600 accent-indigo-600 cursor-pointer"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">BIPA and Culture Coordinator</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Oversees curriculum, official attendance recap, teaching reports (BAP), and certifications.
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${role === 'supervisor'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="supervisor"
                    checked={role === 'supervisor'}
                    onChange={() => setRole('supervisor')}
                    className="w-4 h-4 text-indigo-600 accent-indigo-600 cursor-pointer"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">BIPA Supervisor Quality Assurance</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Verifies teaching reports (BAP), monitors pedagogical standards, and provides academic approvals.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Grid Inputs: Name, NIP, Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name & Degree <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Prof. Dr. Irwan Susanto"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Employee / Lecturer ID (NIP / NIDN)
                </label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="e.g., 196807141994031002"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Itenas Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={emailUser}
                    onChange={(e) => setEmailUser(e.target.value)}
                    placeholder="lecturer.name"
                    className="w-full px-3.5 py-2.5 pr-28 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all font-mono"
                    required
                  />
                  <span className="absolute right-3 text-xs font-semibold text-slate-400 pointer-events-none">
                    @itenas.ac.id
                  </span>
                </div>
              </div>
            </div>

            {/* 3. SK Number & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Appointment Decree Number (SK)
                </label>
                <input
                  type="text"
                  value={skNumber}
                  onChange={(e) => setSkNumber(e.target.value)}
                  placeholder="SK-REK/082/BIPA/2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Working Unit / Faculty / Directorate
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Faculty of Industrial Technology & Academic Bureau"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* 4. Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Mandate / Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g., Coordinate the implementation of Regular BIPA and Darmasiswa RI programs for Odd Semester 2026/2027."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-md shadow-slate-900/10 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Issuing Decree & Sending Invitation...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-indigo-300" />
                    <span>Assign & Send Invitation Email</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ================= TABS: APPOINTMENTS HISTORY & SSO DIRECTORY ================= */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Header Tabs */}
          <div className="border-b border-slate-100 px-6 pt-4 flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('assignments')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'assignments'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
            >
              Appointment Decree History ({assignments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'users'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
            >
              Itenas SSO Account Directory ({allUsers.length})
            </button>
          </div>

          {/* Tab 1: Assignments Table */}
          {activeTab === 'assignments' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/70 text-slate-500 font-semibold">
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Officer / Faculty Name</th>
                    <th className="py-3.5 px-4">Itenas Email</th>
                    <th className="py-3.5 px-4">Decree Number</th>
                    <th className="py-3.5 px-4">Invitation Status</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {assignments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${item.role === 'coordinator'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                            }`}
                        >
                          {item.role === 'coordinator' ? 'Coordinator' : 'Supervisor'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">NIP: {item.nip || '-'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{item.email}</td>
                      <td className="py-3.5 px-4 font-mono text-indigo-700 font-semibold">{item.skNumber}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${item.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'INVITED'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-500'
                            }`}
                        >
                          {item.status === 'ACTIVE' ? 'Active' : item.status === 'INVITED' ? 'Invitation Sent' : 'Archived Decree'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleResend(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 font-medium transition-all cursor-pointer text-[11px]"
                          title="Resend invitation email"
                        >
                          Resend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: All Users SSO Directory */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/70 text-slate-500 font-semibold">
                    <th className="py-3.5 px-4">Account Type</th>
                    <th className="py-3.5 px-4">Full Name</th>
                    <th className="py-3.5 px-4">ID / Student No</th>
                    <th className="py-3.5 px-4">Itenas SSO Domain</th>
                    <th className="py-3.5 px-4">Access Password</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'superadmin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'coordinator'
                              ? 'bg-amber-100 text-amber-800'
                              : u.role === 'supervisor'
                                ? 'bg-indigo-100 text-indigo-800'
                                : u.role === 'teacher'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                            }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                        {u.country && (
                          <CountryFlag country={u.country} className="w-4 h-3 rounded-[2px]" />
                        )}
                        <span>{u.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {u.identifier || u.nim || '-'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {u.role === 'student'
                          ? `${(u.identifier || u.nim || 'mhs').toLowerCase()}@mhs.itenas.ac.id`
                          : u.role === 'superadmin'
                            ? 'admin@itenas.ac.id'
                            : `${(u.username || 'dosen')}@itenas.ac.id`}
                      </td>
                      <td className="py-3 px-4 font-mono text-indigo-700 font-semibold">
                        {u.samplePassword || (u.role === 'superadmin' ? 'admin234' : 'password123')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ================= MODAL: PREVIEW OFFICIAL INVITATION LETTER ================= */}
      {invitationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Official Invitation Email Issued Successfully</h3>
                  <div className="text-[11px] text-slate-300">BIPA Leadership Appointment Notification</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInvitationModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Letter Preview Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700">
              {/* Kop Surat Digital */}
              <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                    Yayasan Pendidikan Dayang Sumbi
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 tracking-tight uppercase">
                    Institut Teknologi Nasional (Itenas) Bandung
                  </h4>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Biro Akademik & Pusat Bahasa BIPA
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-400">
                  Ref: {invitationModal.skNumber}
                </div>
              </div>

              {/* Email Meta */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-1.5 border border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 w-16">To:</span>
                  <span className="font-bold text-slate-900">{invitationModal.name}</span>
                  <span className="text-slate-500 font-mono">({invitationModal.to})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 w-16">Subject:</span>
                  <span className="font-bold text-indigo-700">{invitationModal.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 w-16">Date:</span>
                  <span className="text-slate-600">{new Date(invitationModal.sentAt).toLocaleString('en-US')}</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-3 pt-2">
                <div className="text-sm font-semibold text-slate-800">
                  Dear <strong>{invitationModal.name}</strong>
                </div>
                <div className="text-xs text-slate-600">
                  Pursuant to the Decree of the Rectorate of Institut Teknologi Nasional Bandung <strong>{invitationModal.skNumber}</strong> we hereby convey the official appointment mandate as
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-center">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                    Appointed Position
                  </span>
                  <span className="text-base font-extrabold text-indigo-950">
                    {invitationModal.role}
                  </span>
                </div>
                <div className="text-xs text-slate-700">
                  Account provisioned with administrative privileges for BIPA and Darmasiswa RI <strong>{invitationModal.to}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 font-mono text-[11px] text-slate-800 break-all flex items-center justify-between gap-2">
                  <span>{invitationModal.inviteLink}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(invitationModal.inviteLink)}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200 shrink-0 cursor-pointer"
                    title="Copy Link"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-white text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invitation</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(invitationModal.inviteLink)}
                  className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 text-xs font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Activation Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInvitationModal(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
