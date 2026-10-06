// src/components/Navbar.jsx
import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Calendar,
  ClipboardList,
  CheckCircle2,
  FileSignature,
  FileSpreadsheet,
  FolderOpen,
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    classes,
    selectedClassId,
    setSelectedClassId,
    activeClass,
    handleResetData
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'schedule', label: 'Master Schedule', icon: Calendar },
    { id: 'syllabus', label: 'Rencana Silabus', icon: ClipboardList },
    { id: 'realization', label: 'Realisasi Mengajar', icon: CheckCircle2 },
    { id: 'meetings', label: 'Berita Acara & TTD', icon: FileSignature },
    { id: 'export', label: 'Ekspor & Logbook', icon: FileSpreadsheet },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Program Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bipa flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-serif">
                  Lentera <span className="text-emerald-600 font-sans">BIPA</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Sistem Manajemen Kelas & Berita Acara BIPA & Budaya
              </p>
            </div>
          </div>

          {/* Center/Right: Class Selector & Quick Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Class Level Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 pl-2 hidden md:inline">Kelas:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-white text-xs font-bold text-slate-800 py-1.5 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} — {cls.levelName}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Google Drive Storage Link */}
            {activeClass?.driveMaterialsFolder && (
              <a
                href={activeClass.driveMaterialsFolder}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold transition-colors"
                title="Buka Google Drive Materi & Arsip Foto Kelas Ini"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Drive Folder</span>
              </a>
            )}

            {/* Reset Data Button */}
            <button
              type="button"
              onClick={handleResetData}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Reset data ke standar kurikulum BIPA"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar border-t border-slate-100 pt-1 pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-2xs border border-emerald-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
