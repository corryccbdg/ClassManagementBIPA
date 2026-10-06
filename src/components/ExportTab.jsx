// src/components/ExportTab.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ExportModal from './ExportModal';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  CheckCircle,
  Clock,
  ShieldCheck,
  Award,
  Users,
  FileText,
  Search
} from 'lucide-react';

export default function ExportTab() {
  const {
    activeClass,
    classes,
    syllabuses,
    realizations,
    meetings,
    students,
    setSelectedClassId
  } = useApp();

  const classSyllabuses = syllabuses.filter(s => s.classId === activeClass.id);
  const classMeetings = meetings.filter(m => m.classId === activeClass.id);
  const classRealizations = realizations.filter(r => r.classId === activeClass.id);
  const classStudents = students.filter(s => s.classId === activeClass.id);

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedMeetingForExport, setSelectedMeetingForExport] = useState(classMeetings[0] || null);

  const handleOpenExport = (m) => {
    setSelectedMeetingForExport(m || classMeetings[0]);
    setExportModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Logbook Kumulatif & Ekspor Laporan Semester ({activeClass.name})
              </h2>
              <p className="text-xs text-slate-500">
                Rekapitulasi berkas pertanggungjawaban mengajar, kehadiran mahasiswa asing, dan status tanda tangan digital
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleOpenExport(classMeetings[0])}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor PDF / Excel</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Logbook</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-400 font-medium">Target Pertemuan Silabus</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{classSyllabuses.length} Sesi</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-400 font-medium">Realisasi Terlaksana</span>
          <div className="text-xl font-extrabold text-emerald-700 mt-1">{classRealizations.length} Sesi</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-400 font-medium">Berita Acara Disahkan</span>
          <div className="text-xl font-extrabold text-purple-700 mt-1">
            {classMeetings.filter(m => m.signatures?.supervisor?.status === 'Approved').length} Sesi
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-400 font-medium">Peserta Didik Aktif</span>
          <div className="text-xl font-extrabold text-blue-700 mt-1">{classStudents.length} Mahasiswa</div>
        </div>
      </div>

      {/* Cumulative Table View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            Tabel Rekapitulasi Sesi & Status Multi-Party Sign-Off
          </h3>
          <span className="text-xs text-slate-500">
            Dosen Pengampu: <strong className="text-slate-800">{activeClass.instructorName}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 w-16 text-center">Ptm</th>
                <th className="py-3 px-4 w-40">Hari & Tanggal</th>
                <th className="py-3 px-4">Unit & Materi Terlaksana</th>
                <th className="py-3 px-3 w-28 text-center">Presensi Mhs</th>
                <th className="py-3 px-3 w-28 text-center">TTD Dosen</th>
                <th className="py-3 px-3 w-28 text-center">TTD Mhs</th>
                <th className="py-3 px-3 w-36 text-center">Supervisor</th>
                <th className="py-3 px-3 w-24 text-center">Unduh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {classMeetings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    Belum ada pertemuan yang dicatat untuk kelas ini.
                  </td>
                </tr>
              ) : (
                classMeetings.map((m) => {
                  const hadir = m.attendance.filter(a => a.status === 'Hadir').length;
                  const isTeacherSigned = m.signatures?.teacher?.signed;
                  const isStudentSigned = m.signatures?.studentRep?.signed;
                  const supervisorStatus = m.signatures?.supervisor?.status || 'Pending';

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                        #{m.meetingNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div>{m.date}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{m.time}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-emerald-900">{m.topic}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{m.plannedVsActual?.outcomeAchieved}</div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                          {hadir} / {m.attendance.length}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isTeacherSigned ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isTeacherSigned ? '✓ Ditandatangani' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isStudentSigned ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isStudentSigned ? '✓ Valid' : 'Belum'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          supervisorStatus === 'Approved'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {supervisorStatus === 'Approved' ? '★ Disetujui' : '⏳ Review'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenExport(m)}
                          className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg transition-colors"
                          title="Unduh Berita Acara Pertemuan Ini"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {exportModalOpen && selectedMeetingForExport && (
        <ExportModal
          meeting={selectedMeetingForExport}
          classInfo={activeClass}
          allMeetings={classMeetings}
          onClose={() => setExportModalOpen(false)}
        />
      )}
    </div>
  );
}
