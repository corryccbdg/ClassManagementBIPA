// src/components/ExportModal.jsx
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Printer,
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle,
  FolderOpen,
  X
} from 'lucide-react';

export default function ExportModal({ meeting, classInfo, allMeetings, onClose }) {
  const [exportType, setExportType] = useState('single'); // 'single' | 'cumulative'
  const [format, setFormat] = useState('pdf'); // 'pdf' | 'excel'
  const [isExporting, setIsExporting] = useState(false);

  // 1. Generate Clean Formal PDF Report
  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(11, 74, 58); // BIPA Green
      doc.text("KEMENTERIAN PENDIDIKAN & KEBUDAYAAN", 105, 18, { align: 'center' });
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text("PROGRAM BAHASA INDONESIA BAGI PENUTUR ASING (BIPA)", 105, 24, { align: 'center' });

      doc.setDrawColor(11, 74, 58);
      doc.setLineWidth(0.8);
      doc.line(15, 27, 195, 27);

      if (exportType === 'single') {
        // --- Single Meeting Berita Acara ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(20, 20, 20);
        doc.text(`BERITA ACARA PERKULIAHAN BIPA — PERTEMUAN #${meeting.meetingNumber}`, 105, 35, { align: 'center' });

        // Meta Box
        doc.autoTable({
          startY: 40,
          theme: 'grid',
          head: [['Parameter', 'Detail Keterangan']],
          body: [
            ['Kelas / Tingkat', `${classInfo.name} — ${classInfo.levelName}`],
            ['Hari & Tanggal', meeting.date],
            ['Waktu & Ruang', `${meeting.time} (${meeting.room})`],
            ['Dosen Pengampu', meeting.teacherName],
            ['Topik Sesi', meeting.topic],
            ['Capaian Pembelajaran', meeting.plannedVsActual?.outcomeAchieved || 'Materi tercapai optimal'],
            ['Catatan Penyesuaian', meeting.plannedVsActual?.deviation || 'Sesuai silabus'],
          ],
          headStyles: { fillColor: [11, 74, 58], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
          bodyStyles: { fontSize: 8.5 },
          margin: { left: 15, right: 15 }
        });

        // Attendance Table
        const attendanceRows = meeting.attendance.map((a, i) => [
          i + 1,
          a.name,
          a.status,
          a.note || '-'
        ]);

        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 6,
          theme: 'striped',
          head: [['No', 'Nama Mahasiswa Asing', 'Status Kehadiran', 'Keterangan']],
          body: attendanceRows,
          headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          margin: { left: 15, right: 15 }
        });

        // Signatures Block
        const finalY = doc.lastAutoTable.finalY + 12;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text("Pihak I (Dosen Pengampu):", 20, finalY);
        doc.text("Pihak II (Perwakilan Mahasiswa):", 85, finalY);
        doc.text("Pihak III (Supervisor Mutu):", 150, finalY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(meeting.signatures.teacher?.signerName || classInfo.instructorName, 20, finalY + 18);
        doc.text("[ TERVERIFIKASI DIGITAL ]", 20, finalY + 22);

        doc.text(meeting.signatures.studentRep?.signerName || "Mahasiswa BIPA", 85, finalY + 18);
        doc.text(meeting.signatures.studentRep?.signed ? "[ TERVERIFIKASI ]" : "[ PENDING ]", 85, finalY + 22);

        doc.text(meeting.signatures.supervisor?.signerName || classInfo.supervisorName, 150, finalY + 18);
        doc.text(`[ STATUS: ${meeting.signatures.supervisor?.status || 'APPROVED'} ]`, 150, finalY + 22);

        doc.save(`Berita_Acara_${classInfo.name}_Pertemuan_${meeting.meetingNumber}.pdf`);
      } else {
        // --- Cumulative Semester Logbook ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(20, 20, 20);
        doc.text(`LOGBOOK KUMULATIF PERKULIAHAN & REALISASI — ${classInfo.name}`, 105, 35, { align: 'center' });

        const summaryRows = allMeetings.map((m) => {
          const hadir = m.attendance.filter(a => a.status === 'Hadir').length;
          return [
            `#${m.meetingNumber}`,
            m.date,
            m.topic,
            m.room,
            `${hadir}/${m.attendance.length} Hadir`,
            m.signatures?.supervisor?.status || 'Approved'
          ];
        });

        doc.autoTable({
          startY: 42,
          theme: 'grid',
          head: [['Ptm', 'Tanggal', 'Unit & Materi Terlaksana', 'Ruang', 'Presensi', 'Status Supervisor']],
          body: summaryRows,
          headStyles: { fillColor: [11, 74, 58], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          margin: { left: 15, right: 15 }
        });

        const finalY = doc.lastAutoTable.finalY + 14;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')} melalui Lentera BIPA Management System`, 15, finalY);

        doc.save(`Logbook_Kumulatif_${classInfo.name}_Semester_Ganjil.pdf`);
      }
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Generate Clean Excel (.xlsx) Report
  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      const wb = XLSX.utils.book_new();

      if (exportType === 'single') {
        // Single meeting data
        const wsData = [
          ['BERITA ACARA PERKULIAHAN BIPA'],
          ['Kelas / Program', `${classInfo.name} (${classInfo.levelName})`],
          ['Pertemuan Ke-', `#${meeting.meetingNumber}`],
          ['Hari / Tanggal', meeting.date],
          ['Waktu & Ruang', `${meeting.time} (${meeting.room})`],
          ['Dosen Pengampu', meeting.teacherName],
          ['Topik Sesi', meeting.topic],
          ['Capaian Terlaksana', meeting.plannedVsActual?.outcomeAchieved || 'Materi terlaksana optimal'],
          ['Catatan Penyesuaian', meeting.plannedVsActual?.deviation || 'Sesuai silabus'],
          [],
          ['No', 'Nama Mahasiswa Asing', 'Status Kehadiran', 'Catatan Khusus']
        ];

        meeting.attendance.forEach((a, idx) => {
          wsData.push([idx + 1, a.name, a.status, a.note || '']);
        });

        wsData.push([]);
        wsData.push(['--- PENGESAHAN DOKUMEN ---']);
        wsData.push(['Pihak I (Dosen)', meeting.signatures.teacher?.signerName || classInfo.instructorName, 'Status: Terverifikasi']);
        wsData.push(['Pihak II (Mahasiswa)', meeting.signatures.studentRep?.signerName || 'Mahasiswa BIPA', meeting.signatures.studentRep?.signed ? 'Status: Ditandatangani' : 'Status: Menunggu']);
        wsData.push(['Pihak III (Supervisor)', meeting.signatures.supervisor?.signerName || classInfo.supervisorName, `Status: ${meeting.signatures.supervisor?.status || 'Approved'}`]);

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, `Pertemuan_${meeting.meetingNumber}`);
        XLSX.writeFile(wb, `Berita_Acara_${classInfo.name}_Pertemuan_${meeting.meetingNumber}.xlsx`);
      } else {
        // Cumulative Logbook
        const wsData = [
          ['LOGBOOK KUMULATIF PERKULIAHAN & PRESENSI BIPA'],
          ['Kelas / Program', `${classInfo.name} (${classInfo.levelName})`],
          ['Dosen Pengampu', classInfo.instructorName],
          ['Supervisor', classInfo.supervisorName],
          [],
          ['Pertemuan', 'Tanggal', 'Waktu', 'Ruang', 'Topik / Unit Terlaksana', 'Jumlah Hadir', 'Total Peserta', 'Status Supervisor', 'Catatan Evaluasi']
        ];

        allMeetings.forEach((m) => {
          const hadir = m.attendance.filter(a => a.status === 'Hadir').length;
          wsData.push([
            `#${m.meetingNumber}`,
            m.date,
            m.time,
            m.room,
            m.topic,
            hadir,
            m.attendance.length,
            m.signatures?.supervisor?.status || 'Approved',
            m.signatures?.supervisor?.reviewNotes || '-'
          ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Logbook_Semester');
        XLSX.writeFile(wb, `Logbook_Kumulatif_${classInfo.name}.xlsx`);
      }
    } catch (err) {
      console.error("Excel export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Ekspor Laporan & Berita Acara</h3>
              <p className="text-xs text-slate-500">Unduh dokumen resmi dalam format PDF atau Excel</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          {/* Scope Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Pilih Cakupan Laporan:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportType('single')}
                className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                  exportType === 'single'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-slate-900 mb-0.5">Sesi Pertemuan #{meeting.meetingNumber}</div>
                <div className="text-[11px] text-slate-500">Berita Acara & presensi tunggal</div>
              </button>

              <button
                type="button"
                onClick={() => setExportType('cumulative')}
                className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                  exportType === 'cumulative'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-slate-900 mb-0.5">Logbook Kumulatif Semester</div>
                <div className="text-[11px] text-slate-500">Rekap seluruh pertemuan kelas</div>
              </button>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Pilih Format Berkas:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 font-semibold transition-all ${
                  format === 'pdf'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-5 h-5 text-rose-600" />
                <div>
                  <div className="font-bold text-slate-900">Format PDF</div>
                  <div className="text-[10px] text-slate-500">Dokumen Cetak Resmi</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('excel')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 font-semibold transition-all ${
                  format === 'excel'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-bold text-slate-900">Format Excel (.xlsx)</div>
                  <div className="text-[10px] text-slate-500">Lembar Kerja Analisis</div>
                </div>
              </button>
            </div>
          </div>

          {/* Direct Print Option */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Cetak langsung ke printer fisik</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                window.print();
              }}
              className="text-emerald-700 hover:underline font-bold"
            >
              Buka Dialog Cetak
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
          >
            Tutup
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={format === 'pdf' ? handleExportPDF : handleExportExcel}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Memproses...' : 'Unduh Berkas'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
