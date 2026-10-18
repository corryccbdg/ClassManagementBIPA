import React, { useState } from 'react';
import {
  ShieldCheck,
  Crown,
  Award,
  BookOpen,
  UserCheck,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  ExternalLink
} from 'lucide-react';

export const SUPERADMIN_PERSONAS = {
  superadmin: {
    id: 'usr-admin-01',
    name: 'Super Administrator BIPA',
    username: 'admin',
    email: 'admin@itenas.ac.id',
    role: 'superadmin',
    avatar: 'SA',
    title: 'Principal Administrator and IT Governance',
    badge: 'Master Admin'
  },
  coordinator: {
    id: 'usr-coord-01',
    name: 'Prof. Dr. Irwan Susanto, M.T.',
    username: 'koordinator',
    email: 'irwan.susanto@itenas.ac.id',
    role: 'coordinator',
    avatar: 'CO',
    title: 'BIPA and Cultural Program Coordinator',
    badge: 'Coordinator'
  },
  supervisor: {
    id: 'usr-super-01',
    name: 'Dra. Ratna Handayani, M.Hum.',
    username: 'supervisor',
    email: 'ratna.handayani@itenas.ac.id',
    role: 'supervisor',
    avatar: 'QA',
    title: 'BIPA Quality Assurance Supervisor',
    badge: 'Supervisor'
  },
  teacher: {
    id: 'usr-teach-01',
    name: 'Dianita, S.S., M.Hum.',
    username: 'dosen',
    email: 'dianita@itenas.ac.id',
    role: 'teacher',
    avatar: 'LC',
    title: 'BIPA Course Lecturer',
    badge: 'Lecturer'
  },
  student: {
    id: 'usr-std-01',
    name: 'Phouphakham Bounlom',
    username: '312024043',
    nim: '312024043',
    email: '312024043@mhs.itenas.ac.id',
    role: 'student',
    country: 'Laos',
    avatar: '🇱🇦',
    title: 'Darmasiswa RI Student B1',
    badge: 'Student'
  },
  'itenas-recap': {
    id: 'usr-coord-01',
    name: 'Prof. Dr. Irwan Susanto, M.T.',
    username: 'koordinator',
    email: 'irwan.susanto@itenas.ac.id',
    role: 'coordinator',
    avatar: 'RP',
    title: 'Itenas Darmasiswa Class Official Reports BAP',
    badge: 'BAP Report'
  }
};

export default function SuperAdminSidebar({
  currentView,
  onSwitchRole,
  onLogout,
  currentUser,
  isCollapsed,
  onToggleCollapse
}) {
  const menuItems = [
    {
      key: 'superadmin',
      label: 'Super Admin Hub',
      sublabel: 'SK Decree and Governance',
      icon: ShieldCheck,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      activeColor: 'bg-purple-600 text-white shadow-purple-600/30'
    },
    {
      key: 'coordinator',
      label: 'Coordinator Portal',
      sublabel: 'Prof. Dr. Irwan Susanto',
      icon: Crown,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      activeColor: 'bg-amber-600 text-white shadow-amber-600/30'
    },
    {
      key: 'supervisor',
      label: 'Supervisor Portal',
      sublabel: 'Dra. Ratna Handayani',
      icon: Award,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      activeColor: 'bg-sky-600 text-white shadow-sky-600/30'
    },
    {
      key: 'teacher',
      label: 'Lecturer Portal',
      sublabel: 'Dianita, S.S., M.Hum.',
      icon: BookOpen,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      activeColor: 'bg-emerald-600 text-white shadow-emerald-600/30'
    },
    {
      key: 'student',
      label: 'Student Portal',
      sublabel: 'Phouphakham 312024043',
      icon: UserCheck,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      activeColor: 'bg-rose-600 text-white shadow-rose-600/30'
    },
    {
      key: 'itenas-recap',
      label: 'Darmasiswa BAP Recap',
      sublabel: 'Official Course Reports',
      icon: FileSpreadsheet,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      activeColor: 'bg-blue-600 text-white shadow-blue-600/30'
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 bg-[#0f172a] text-slate-200 border-r border-slate-800/80 shadow-2xl transition-all duration-300 flex flex-col justify-between ${isCollapsed ? 'w-20' : 'w-72'
        }`}
    >
      {/* Top Header */}
      <div>
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-purple-600/20 shrink-0">
                <Sliders className="w-5 h-5 text-white" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-white tracking-tight">Super Admin</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">BIPA Management System</div>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shrink-0">
              <Sliders className="w-5 h-5 text-white" />
            </div>
          )}

          <button
            type="button"
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ${isCollapsed ? 'hidden' : 'block'
              }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Navigation List */}
        <div className="px-3 space-y-1.5 mt-2">
          {!isCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              All Roles and Portals
            </div>
          )}

          {menuItems.map((item) => {
            const isActive = currentView === item.key;
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSwitchRole(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-150 cursor-pointer text-left group ${isActive
                  ? `${item.activeColor} shadow-md font-bold`
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                title={isCollapsed ? `${item.label} ${item.sublabel}` : undefined}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-white/20 text-white' : item.color
                    }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!isCollapsed && (
                  <div className="truncate flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs truncate">{item.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-white shrink-0 animate-pulse" />
                      )}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                      {item.sublabel}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom User Card & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        {!isCollapsed ? (
          <div className="space-y-2.5">
            {/* Current Active Persona Simulation */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">{currentUser?.avatar || 'SA'}</span>
                <div className="truncate">
                  <div className="text-[11px] font-bold text-white truncate">
                    {currentUser?.name || 'Super Admin'}
                  </div>
                  <div className="text-[10px] text-amber-400 font-medium capitalize truncate">
                    Active: {currentView}
                  </div>
                </div>
              </div>
              {currentView !== 'superadmin' && (
                <button
                  type="button"
                  onClick={() => onSwitchRole('superadmin')}
                  className="p-1 rounded-md bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-[10px] font-bold cursor-pointer shrink-0 transition-all"
                  title="Return to Super Admin Hub"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Log Out Super Admin</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => onSwitchRole('superadmin')}
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-white text-xs font-bold border border-slate-800 cursor-pointer"
              title={`Active Role: ${currentView}`}
            >
              {currentUser?.avatar || 'SA'}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="w-9 h-9 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/20 cursor-pointer"
              title="Log Out Super Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
