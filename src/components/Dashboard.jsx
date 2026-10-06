// src/components/Dashboard.jsx
import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  CalendarCheck,
  CheckCircle,
  FileSignature,
  FolderOpen,
  ExternalLink,
  MessageCircle,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';

export default function Dashboard() {
  const {
    activeClass,
    classes,
    syllabuses,
    realizations,
    meetings,
    students,
    schedules,
    setActiveTab,
    setSelectedClassId
  } = useApp();

  const classSyllabus = syllabuses.filter(s => s.classId === activeClass.id);
  const classRealizations = realizations.filter(r => r.classId === activeClass.id);
  const classMeetings = meetings.filter(m => m.classId === activeClass.id);
  const classStudents = students.filter(s => s.classId === activeClass.id);
  const classSchedule = schedules.filter(s => s.classId === activeClass.id);

  // Compute metrics
  const totalPlanned = classSyllabus.length || 1;
  const completedMeetings = classRealizations.filter(r => r.status === 'Verified').length;
  const inProgressMeetings = classRealizations.filter(r => r.status === 'Submitted').length;
  const completionPercentage = Math.round((completedMeetings / totalPlanned) * 100);

  const pendingSupervisorSignOff = classMeetings.filter(m => m.signatures?.supervisor?.status === 'Pending').length;
  const pendingStudentSignOff = classMeetings.filter(m => !m.signatures?.studentRep?.signed).length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Program BIPA & Seni Budaya Nusantara — Semester Ganjil 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
              {activeClass.name}: <span className="font-sans font-light text-emerald-200">{activeClass.levelName}</span>
            </h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              {activeClass.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100 pt-2">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                <Users className="w-4 h-4 text-emerald-300" />
                <strong>Dosen:</strong> {activeClass.instructorName}
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                <MapPin className="w-4 h-4 text-amber-300" />
                <strong>Ruangan:</strong> {activeClass.room}
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                <Award className="w-4 h-4 text-purple-300" />
                <strong>Supervisor:</strong> {activeClass.supervisorName}
              </span>
            </div>
          </div>

          {/* Quick Action CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('realization')}
              className="px-5 py-3 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-700" />
              <span>Catat Realisasi Mengajar</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('meetings')}
              className="px-5 py-3 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm border border-emerald-500/40 flex items-center justify-center gap-2 transition-colors"
            >
              <FileSignature className="w-4 h-4 text-amber-300" />
              <span>Tinjau Berita Acara & TTD</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Enrolled Foreign Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mahasiswa Asing</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{classStudents.length}</span>
            <span className="text-xs text-slate-500">peserta terdaftar</span>
          </div>
          <div className="mt-3 flex items-center gap-1 overflow-x-auto py-1 text-base">
            {classStudents.slice(0, 7).map(s => (
              <span key={s.id} title={`${s.name} (${s.country})`} className="cursor-default hover:scale-125 transition-transform">
                {s.flag}
              </span>
            ))}
            {classStudents.length > 7 && (
              <span className="text-xs font-semibold text-slate-400 pl-1">+{classStudents.length - 7} negara</span>
            )}
          </div>
        </div>

        {/* Metric 2: Syllabus Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progres Silabus</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">{completionPercentage}%</span>
            <span className="text-xs text-slate-500">terlaksana ({completedMeetings}/{totalPlanned} sesi)</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Pending Student Signatures */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">TTD Mahasiswa</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <FileSignature className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{pendingStudentSignOff}</span>
            <span className="text-xs text-slate-500">perlu validasi peserta</span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {pendingStudentSignOff === 0 ? "✓ Semua sesi telah ditandatangani" : "Menunggu paraf perwakilan kelas"}
          </p>
        </div>

        {/* Metric 4: Pending Supervisor Sign-offs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Persetujuan Supervisor</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${pendingSupervisorSignOff > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${pendingSupervisorSignOff > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
              {pendingSupervisorSignOff}
            </span>
            <span className="text-xs text-slate-500">menunggu stempel resmi</span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {pendingSupervisorSignOff > 0 ? "Memerlukan review mutu koordinator" : "✓ Berita acara terverifikasi lengkap"}
          </p>
        </div>
      </div>

      {/* Two Column Layout: Shared Storage & Upcoming Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Google Drive & Cloud Media Folders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Storage & Documentation Links Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Arsip Google Drive & Dokumentasi Terintegrasi</h3>
                  <p className="text-xs text-slate-500">Pusat penyimpanan bahan ajar dosen, silabus, dan foto/video kegiatan</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Materials Drive */}
              <div className="p-4 rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 to-white hover:border-amber-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                      Folder Modul & Bahan Ajar
                    </span>
                    <FolderOpen className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">
                    Bahan Tayang & Lembar Kerja Siswa
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    Struktur folder: <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">{activeClass.instructorName}_Unit/Topik</code>
                  </p>
                </div>
                <a
                  href={activeClass.driveMaterialsFolder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline pt-2 border-t border-amber-100"
                >
                  <span>Buka Google Drive Materi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Card 2: Activities Photo & Video Drive */}
              <div className="p-4 rounded-xl border border-teal-200/80 bg-gradient-to-br from-teal-50/60 to-white hover:border-teal-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded">
                      Dokumentasi Lapangan & Kelas
                    </span>
                    <FolderOpen className="w-4 h-4 text-teal-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">
                    Foto & Video Realisasi Pembelajaran
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    Struktur folder: <code className="text-teal-700 bg-teal-50 px-1 py-0.5 rounded">{activeClass.instructorName}_Topik Kegiatan</code>
                  </p>
                </div>
                <a
                  href={activeClass.driveActivityFolder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline pt-2 border-t border-teal-100"
                >
                  <span>Buka Galeri Dokumentasi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Recent Realization Logs Feed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Riwayat Realisasi & Berita Acara Terbaru</h3>
                <p className="text-xs text-slate-500">Status pencatatan dan multi-party sign-off</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('realization')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {classRealizations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada catatan realisasi untuk kelas ini. Klik tombol di atas untuk mencatat.
                </div>
              ) : (
                classRealizations.map((item) => {
                  const meeting = classMeetings.find(m => m.realizationId === item.id);
                  const isVerified = item.status === 'Verified';

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Pertemuan #{item.meetingNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-600">{item.hariTanggalRealisasi}</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                            isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {isVerified ? '✓ Verified (Disetujui)' : '⏳ Submitted (Review)'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">{item.unitMateriTerlaksana}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{item.pelaksanaanPembelajaran}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveTab('meetings')}
                          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                        >
                          <FileSignature className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Buka Berita Acara</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Schedule & Enrolled Students */}
        <div className="space-y-6">
          {/* Class Timetable Widget */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Jadwal Kelas Mingguan</h3>
                  <p className="text-xs text-slate-500">{activeClass.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Matriks
              </button>
            </div>

            <div className="space-y-2.5">
              {classSchedule.map((sch) => (
                <div key={sch.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                    <span className="text-emerald-700">{sch.day}</span>
                    <span className="text-slate-500 font-mono">{sch.timeSlot}</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">{sch.sessionType}</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{sch.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enrolled Foreign Students Widget */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Daftar Mahasiswa Asing</h3>
                <p className="text-xs text-slate-500">Kelas {activeClass.name} ({classStudents.length} Mahasiswa)</p>
              </div>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {classStudents.map((std) => (
                <div key={std.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{std.flag}</span>
                    <div>
                      <div className="font-bold text-slate-800">{std.name}</div>
                      <div className="text-[11px] text-slate-400">{std.country} • {std.studentNumber}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Aktif
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
