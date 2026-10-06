// src/components/RoleBanner.jsx
import React from 'react';
import { useApp, ROLES } from '../context/AppContext';
import { ShieldCheck, UserCheck, GraduationCap, Award, ArrowRight } from 'lucide-react';

export default function RoleBanner() {
  const { currentRole, setCurrentRole, roleInfo } = useApp();

  const roleButtons = [
    {
      id: 'coordinator',
      title: 'Admin / Koordinator',
      short: 'Koordinator',
      icon: ShieldCheck,
      color: 'hover:border-purple-400',
      activeBg: 'bg-purple-600 text-white shadow-purple-200'
    },
    {
      id: 'teacher',
      title: 'Dosen Pengampu',
      short: 'Dosen',
      icon: UserCheck,
      color: 'hover:border-emerald-400',
      activeBg: 'bg-emerald-600 text-white shadow-emerald-200'
    },
    {
      id: 'student',
      title: 'Peserta Didik (BIPA)',
      short: 'Mahasiswa Asing',
      icon: GraduationCap,
      color: 'hover:border-blue-400',
      activeBg: 'bg-blue-600 text-white shadow-blue-200'
    },
    {
      id: 'supervisor',
      title: 'Supervisor Akademik',
      short: 'Supervisor Mutu',
      icon: Award,
      color: 'hover:border-amber-400',
      activeBg: 'bg-amber-600 text-white shadow-amber-200'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white px-4 py-3 sm:px-6 shadow-md border-b border-emerald-900/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Active Persona Details */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-emerald-300 font-bold shrink-0">
            {currentRole === 'coordinator' && <ShieldCheck className="w-5 h-5 text-purple-300" />}
            {currentRole === 'teacher' && <UserCheck className="w-5 h-5 text-emerald-300" />}
            {currentRole === 'student' && <GraduationCap className="w-5 h-5 text-blue-300" />}
            {currentRole === 'supervisor' && <Award className="w-5 h-5 text-amber-300" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Simulasi Peran Aktif:</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${roleInfo.badgeColor}`}>
                {roleInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
              <strong className="text-white">{roleInfo.name}</strong> — {roleInfo.description}
            </p>
          </div>
        </div>

        {/* Right: Quick Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-black/30 backdrop-blur rounded-xl border border-white/10 self-stretch md:self-auto overflow-x-auto">
          <span className="text-[11px] text-slate-400 px-2 font-medium hidden lg:inline">Ganti Peran:</span>
          {roleButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = currentRole === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setCurrentRole(btn.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? `${btn.activeBg} shadow-sm ring-1 ring-white/30 scale-100`
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{btn.short}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
