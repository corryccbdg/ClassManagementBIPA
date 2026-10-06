// src/App.jsx
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import RoleBanner from './components/RoleBanner';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ScheduleMatrix from './components/ScheduleMatrix';
import SyllabusPlan from './components/SyllabusPlan';
import ClassRealization from './components/ClassRealization';
import MeetingSignOff from './components/MeetingSignOff';
import ExportTab from './components/ExportTab';
import { BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';

function MainApp() {
  const { activeTab, toast, loading } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold ${
              toast.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
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

      {/* Interactive Role Switcher Banner */}
      <RoleBanner />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-semibold">Memuat data kurikulum BIPA...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'schedule' && <ScheduleMatrix />}
            {activeTab === 'syllabus' && <SyllabusPlan />}
            {activeTab === 'realization' && <ClassRealization />}
            {activeTab === 'meetings' && <MeetingSignOff />}
            {activeTab === 'export' && <ExportTab />}
          </>
        )}
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg gradient-bipa flex items-center justify-center text-white font-bold">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-800 font-serif">Lentera BIPA</span>
            <span>— Sistem Manajemen Kelas & Berita Acara Multi-Level</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Standar Kurikulum BIPA Kemendikbud</span>
            <span>•</span>
            <span>Relational Role-Based Architecture</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">2026/2027</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
