// src/components/MeetingSignOff.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SignaturePad from './SignaturePad';
import ExportModal from './ExportModal';
import confetti from 'canvas-confetti';
import {
  FileSignature,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Award,
  Users,
  PenTool,
  Printer,
  FileSpreadsheet,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function MeetingSignOff() {
  const {
    activeClass,
    meetings,
    students,
    currentRole,
    roleInfo,
    handleSignMeeting,
    handleUpdateAttendance,
    showToast
  } = useApp();

  const classMeetings = meetings.filter(m => m.classId === activeClass.id);
  const [selectedMeetingId, setSelectedMeetingId] = useState(
    classMeetings[0]?.id || ''
  );

  const activeMeeting = classMeetings.find(m => m.id === selectedMeetingId) || classMeetings[0];

  // Signature modal state
  const [signingRole, setSigningRole] = useState(null); // 'teacher' | 'student' | 'supervisor' | null

  // Supervisor review state
  const [supervisorStatus, setSupervisorStatus] = useState('Approved');
  const [supervisorNotes, setSupervisorNotes] = useState('');

  // Export modal state
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Quick attendance status updater
  const handleToggleAttendance = (studentId, newStatus) => {
    if (!activeMeeting) return;
    const updatedList = activeMeeting.attendance.map(a => {
      if (a.studentId === studentId) {
        return { ...a, status: newStatus };
      }
      return a;
    });
    handleUpdateAttendance(activeMeeting.id, updatedList);
  };

  const handleSignatureSave = async (payload) => {
    try {
      if (signingRole === 'supervisor') {
        payload.status = supervisorStatus;
        payload.reviewNotes = supervisorNotes || payload.note;
      }

      await handleSignMeeting(activeMeeting.id, signingRole, payload);

      // Trigger celebratory confetti on supervisor approval
      if (signingRole === 'supervisor' && supervisorStatus === 'Approved') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      setSigningRole(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (!activeMeeting) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
        <FileSignature className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-bold text-slate-700 text-base">Belum Ada Berita Acara</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Catat realisasi pembelajaran terlebih dahulu di menu "Realisasi Mengajar" untuk menghasilkan Berita Acara Pertemuan ini.
        </p>
      </div>
    );
  }

  // Attendance stats for current meeting
  const totalStudents = activeMeeting.attendance.length;
  const hadirCount = activeMeeting.attendance.filter(a => a.status === 'Hadir').length;
  const izinCount = activeMeeting.attendance.filter(a => a.status === 'Izin').length;
  const sakitCount = activeMeeting.attendance.filter(a => a.status === 'Sakit').length;
  const alpaCount = activeMeeting.attendance.filter(a => a.status === 'Alpa').length;

  const isSupervisorApproved = activeMeeting.signatures?.supervisor?.status === 'Approved';
  const isTeacherSigned = activeMeeting.signatures?.teacher?.signed;
  const isStudentSigned = activeMeeting.signatures?.studentRep?.signed;

  return (
    <div className="space-y-6">
      {/* Top Meeting Switcher & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <FileSignature className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Berita Acara Perkuliahan & Multi-Party Sign-Off ({activeClass.name})
              </h2>
              <p className="text-xs text-slate-500">
                Dokumen resmi pertanggungjawaban mengajar BIPA dengan validasi tiga pihak (Dosen, Mahasiswa, Supervisor)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Meeting Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 pl-1">Pertemuan:</span>
            <select
              value={activeMeeting.id}
              onChange={(e) => setSelectedMeetingId(e.target.value)}
              className="bg-white text-xs font-bold text-slate-800 py-1 px-3 rounded-lg border border-slate-200 focus:outline-none"
            >
              {classMeetings.map(m => (
                <option key={m.id} value={m.id}>
                  Pertemuan #{m.meetingNumber} — {m.date}
                </option>
              ))}
            </select>
          </div>

          {/* Export / Print Button */}
          <button
            type="button"
            onClick={() => setExportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Ekspor PDF / Excel</span>
          </button>
        </div>
      </div>

      {/* Main Berita Acara Document Sheet */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-lg p-6 sm:p-10 space-y-8 max-w-5xl mx-auto">
        {/* Official Header */}
        <div className="border-b-2 border-slate-800 pb-5 text-center space-y-1 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="text-left text-[11px] text-slate-500">
              <span className="font-bold text-slate-800 block">KEMENTERIAN PENDIDIKAN & KEBUDAYAAN</span>
              PROGRAM BAHASA INDONESIA BAGI PENUTUR ASING (BIPA)
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <span className="font-bold text-slate-800 block">KODE DOKUMEN: BIPA-BA-{activeMeeting.meetingNumber}</span>
              SEMESTER GANJIL 2026/2027
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-slate-900 font-serif">
            BERITA ACARA PERKULIAHAN & PRESENSI BIPA
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Program Pembelajaran Bahasa & Budaya Nusantara — Tingkat {activeClass.name} ({activeClass.levelName})
          </p>
        </div>

        {/* Meeting Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Pertemuan Ke-</span>
            <span className="font-extrabold text-slate-900 text-base">#{activeMeeting.meetingNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Hari & Tanggal</span>
            <span className="font-bold text-slate-800">{activeMeeting.date}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Waktu & Ruang</span>
            <span className="font-bold text-slate-800">{activeMeeting.time} • {activeMeeting.room}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Dosen Pengampu</span>
            <span className="font-bold text-emerald-800">{activeMeeting.teacherName}</span>
          </div>
        </div>

        {/* 1. Session Summary Box (Planned vs Actual Outcomes) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
              Ringkasan Sesi (Session Summary: Planned vs. Actual Outcomes)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Planned */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-700" />
                <span>Rencana Silabus (Planned Target)</span>
              </div>
              <div className="font-semibold text-slate-800">{activeMeeting.plannedVsActual.plannedUnit}</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Unit kurikulum resmi yang dijadwalkan pada minggu berjalan.
              </p>
            </div>

            {/* Actual */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Realisasi Pelaksanaan (Actual Outcomes)</span>
              </div>
              <div className="font-semibold text-slate-800">{activeMeeting.plannedVsActual.actualUnit}</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {activeMeeting.plannedVsActual.outcomeAchieved}
              </p>
              {activeMeeting.plannedVsActual.deviation && (
                <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                  <strong>Catatan Deviasi/Penyesuaian:</strong> {activeMeeting.plannedVsActual.deviation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Participant Attendance Tracker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                Daftar Kehadiran Peserta Didik (Participant Attendance Tracker)
              </h3>
            </div>

            {/* Quick counters */}
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Hadir: {hadirCount}</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">Izin: {izinCount}</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">Sakit: {sakitCount}</span>
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800">Alpa: {alpaCount}</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3 w-12 text-center">No</th>
                  <th className="py-2.5 px-3">Nama Mahasiswa Asing</th>
                  <th className="py-2.5 px-3">Asal Negara</th>
                  <th className="py-2.5 px-3 w-48 text-center">Status Kehadiran</th>
                  <th className="py-2.5 px-3">Catatan Khusus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activeMeeting.attendance.map((std, idx) => {
                  const studentData = students.find(s => s.id === std.studentId);
                  const isCurrentRoleAdmin = currentRole === 'coordinator' || currentRole === 'teacher';

                  return (
                    <tr key={std.studentId} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {std.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        <span className="mr-1.5">{studentData?.flag}</span>
                        <span>{studentData?.country || "Internasional"}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                          {['Hadir', 'Izin', 'Sakit', 'Alpa'].map((st) => {
                            const isSelected = std.status === st;
                            return (
                              <button
                                key={st}
                                type="button"
                                disabled={!isCurrentRoleAdmin}
                                onClick={() => handleToggleAttendance(std.studentId, st)}
                                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                                  isSelected
                                    ? st === 'Hadir'
                                      ? 'bg-emerald-600 text-white'
                                      : st === 'Izin'
                                      ? 'bg-blue-600 text-white'
                                      : st === 'Sakit'
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-rose-600 text-white'
                                    : 'text-slate-500 hover:bg-slate-200/60'
                                } ${!isCurrentRoleAdmin ? 'cursor-default' : ''}`}
                              >
                                {st}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-500">
                        {std.note || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Digital Sign-Off Workflow (Three Distinct Roles) */}
        <div className="space-y-4 pt-4 border-t-2 border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                Validasi & Pengesahan Tiga Pihak (Multi-Party Sign-Off)
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Otentikasi Berbasis Peran
            </span>
          </div>

          {/* Three Sign-Off Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Block 1: Teacher / Dosen */}
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/70 space-y-4 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Pihak I: Dosen Pengampu
                  </span>
                  {isTeacherSigned ? (
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Terverifikasi</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold text-xs">Belum TTD</span>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-800 mb-1">
                  {activeMeeting.signatures.teacher?.signerName || activeClass.instructorName}
                </div>
                <div className="text-[11px] text-slate-500">
                  Dosen Pengampu {activeClass.name}
                </div>
              </div>

              {/* Signature Display or Action */}
              <div className="my-2 p-3 bg-white rounded-xl border border-slate-200 min-h-[90px] flex items-center justify-center">
                {activeMeeting.signatures.teacher?.signatureDataUrl ? (
                  <div className="text-center">
                    <img
                      src={activeMeeting.signatures.teacher.signatureDataUrl}
                      alt="Tanda Tangan Dosen"
                      className="max-h-16 mx-auto object-contain"
                    />
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(activeMeeting.signatures.teacher.signedAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                ) : isTeacherSigned ? (
                  <div className="text-center text-emerald-700">
                    <Check className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs font-serif font-bold italic">Siti Rahmawati, M.Pd.</span>
                    <div className="text-[10px] text-slate-400">Tanda Tangan Digital Tersimpan</div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 text-xs">
                    Tanda tangan belum dibubuhkan
                  </div>
                )}
              </div>

              {/* Action Button for Teacher */}
              {(currentRole === 'teacher' || currentRole === 'coordinator') && (
                <button
                  type="button"
                  onClick={() => setSigningRole('teacher')}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>{isTeacherSigned ? 'Perbarui Tanda Tangan' : 'Tanda Tangani Sbg Dosen'}</span>
                </button>
              )}
            </div>

            {/* Block 2: Student Representative / Peserta Didik */}
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/70 space-y-4 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    Pihak II: Peserta Didik
                  </span>
                  {isStudentSigned ? (
                    <span className="text-blue-600 font-bold text-xs flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Terverifikasi</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold text-xs">Perlu Validasi</span>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-800 mb-1">
                  {activeMeeting.signatures.studentRep?.signerName || "Perwakilan Mahasiswa BIPA"}
                </div>
                <div className="text-[11px] text-slate-500">
                  Perwakilan Peserta Didik Terdaftar
                </div>
              </div>

              {/* Signature Display or Action */}
              <div className="my-2 p-3 bg-white rounded-xl border border-slate-200 min-h-[90px] flex items-center justify-center">
                {activeMeeting.signatures.studentRep?.signatureDataUrl ? (
                  <div className="text-center">
                    <img
                      src={activeMeeting.signatures.studentRep.signatureDataUrl}
                      alt="Tanda Tangan Mahasiswa"
                      className="max-h-16 mx-auto object-contain"
                    />
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(activeMeeting.signatures.studentRep.signedAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                ) : isStudentSigned ? (
                  <div className="text-center text-blue-700">
                    <Check className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs font-serif font-bold italic">
                      {activeMeeting.signatures.studentRep?.signerName}
                    </span>
                    <div className="text-[10px] text-slate-400">Validasi Peserta Disetujui</div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 text-xs">
                    Menunggu tanda tangan perwakilan kelas
                  </div>
                )}
              </div>

              {/* Action Button for Student */}
              {(currentRole === 'student' || currentRole === 'coordinator') && (
                <button
                  type="button"
                  onClick={() => setSigningRole('student')}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>{isStudentSigned ? 'Ubah Tanda Tangan' : 'Tanda Tangani Sbg Mahasiswa'}</span>
                </button>
              )}
            </div>

            {/* Block 3: Supervisor / Program Coordinator */}
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/70 space-y-4 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                    Pihak III: Supervisor / Mutu
                  </span>
                  {isSupervisorApproved ? (
                    <span className="text-emerald-700 font-extrabold text-xs flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>APPROVED</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold text-xs">Menunggu Pengesahan</span>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-800 mb-1">
                  {activeMeeting.signatures.supervisor?.signerName || activeClass.supervisorName}
                </div>
                <div className="text-[11px] text-slate-500">
                  {activeMeeting.signatures.supervisor?.signerTitle || "Koordinator Program BIPA & Kebudayaan"}
                </div>
              </div>

              {/* Signature Display & Official Stamp */}
              <div className="my-2 p-3 bg-white rounded-xl border border-slate-200 min-h-[90px] flex flex-col items-center justify-center relative overflow-hidden">
                {isSupervisorApproved ? (
                  <div className="text-center space-y-1">
                    {/* Official Stamp */}
                    <div className="official-stamp text-[10px]">
                      DISETUJUI & DISAHKAN
                    </div>
                    {activeMeeting.signatures.supervisor?.signatureDataUrl ? (
                      <img
                        src={activeMeeting.signatures.supervisor.signatureDataUrl}
                        alt="Tanda Tangan Supervisor"
                        className="max-h-12 mx-auto object-contain mt-1"
                      />
                    ) : (
                      <div className="text-[11px] font-serif font-bold text-slate-800 italic">
                        {activeMeeting.signatures.supervisor?.signerName}
                      </div>
                    )}
                    <div className="text-[9px] text-slate-400">
                      Disahkan: {new Date(activeMeeting.signatures.supervisor.signedAt || Date.now()).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-1">
                    <div className="official-stamp-pending text-[10px]">
                      PENDING REVIEW
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Menunggu evaluasi & stempel resmi
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button for Supervisor */}
              {(currentRole === 'supervisor' || currentRole === 'coordinator') && (
                <button
                  type="button"
                  onClick={() => setSigningRole('supervisor')}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{isSupervisorApproved ? 'Perbarui Pengesahan' : 'Review & Sahkan Berita Acara'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Supervisor Notes & Audit Log */}
          {activeMeeting.signatures.supervisor?.reviewNotes && (
            <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-purple-900">
                <ShieldCheck className="w-4 h-4 text-purple-700" />
                <span>Catatan Evaluasi Supervisor / Penjaminan Mutu Akademik:</span>
              </div>
              <p className="text-purple-800 text-[11px] leading-relaxed">
                "{activeMeeting.signatures.supervisor.reviewNotes}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Signature Modal */}
      {signingRole && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            {signingRole === 'supervisor' && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-t-2xl text-xs text-amber-900 mb-[-1px] relative z-10 flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-700" />
                  Persetujuan Supervisor Mutu
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={supervisorStatus}
                    onChange={(e) => setSupervisorStatus(e.target.value)}
                    className="bg-white px-2 py-1 rounded text-xs font-bold border border-amber-300 focus:outline-none"
                  >
                    <option value="Approved">Status: Disetujui (Approved)</option>
                    <option value="Revision Requested">Status: Perlu Revisi</option>
                  </select>
                </div>
              </div>
            )}
            <SignaturePad
              role={signingRole}
              defaultName={
                signingRole === 'teacher'
                  ? activeClass.instructorName
                  : signingRole === 'student'
                  ? students[0]?.name || 'John Alexander Doe'
                  : activeClass.supervisorName
              }
              onSave={handleSignatureSave}
              onCancel={() => setSigningRole(null)}
            />
          </div>
        </div>
      )}

      {/* Export & Report Modal */}
      {exportModalOpen && (
        <ExportModal
          meeting={activeMeeting}
          classInfo={activeClass}
          allMeetings={classMeetings}
          onClose={() => setExportModalOpen(false)}
        />
      )}
    </div>
  );
}
