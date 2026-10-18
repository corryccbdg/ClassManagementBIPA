// src/components/attendance/DarmasiswaRecapReport.jsx
import React, { useState, useEffect } from 'react';
import {
  Printer,
  FileDown,
  ArrowLeft,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Info,
  Maximize2,
  Sparkles,
  X,
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  itenasInstitutionInfo,
  darmasiswaStudentsList,
  initialDarmasiswaSessions,
} from '../../data/darmasiswaRecapData';
import {
  generateQrDataUrl,
  buildStudentQrPayload,
  buildFacilitatorQrPayload,
} from '../../utils/qrGenerator';

export default function DarmasiswaRecapReport({
  onBack,
  period = 'Maret 2025',
  customSessions = null,
}) {
  const [sessions, setSessions] = useState(customSessions || initialDarmasiswaSessions);
  const [institutionInfo, setInstitutionInfo] = useState(itenasInstitutionInfo);
  const [studentsList, setStudentsList] = useState(darmasiswaStudentsList);
  const [qrMap, setQrMap] = useState({});
  const [selectedQrInfo, setSelectedQrInfo] = useState(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Fetch live institution metadata & Darmasiswa student list from DB
  useEffect(() => {
    let isMounted = true;
    async function fetchMetadata() {
      try {
        const [instRes, stdRes] = await Promise.all([
          fetch('/api/darmasiswa/institution-info'),
          fetch('/api/darmasiswa/students')
        ]);
        if (instRes.ok) {
          const instData = await instRes.json();
          if (instData && isMounted) setInstitutionInfo(instData);
        }
        if (stdRes.ok) {
          const stdData = await stdRes.json();
          if (Array.isArray(stdData) && stdData.length > 0 && isMounted) setStudentsList(stdData);
        }
      } catch (err) {
        console.warn('Failed to load Darmasiswa info from DB:', err);
      }
    }
    fetchMetadata();
    return () => { isMounted = false; };
  }, []);

  // Pre-generate all QR codes
  useEffect(() => {
    let isMounted = true;
    async function loadAllQrs() {
      const newQrMap = {};
      for (const session of sessions) {
        // Facilitator QR
        if (session.facilitatorSigned) {
          const facPayload = buildFacilitatorQrPayload(session);
          const facQrUrl = await generateQrDataUrl(facPayload, { width: 160 });
          newQrMap[`fac_${session.id}`] = {
            url: facQrUrl,
            payload: facPayload,
          };
        }

        // Students QRs
        for (const student of studentsList) {
          const att = session.attendances[student.nim] || { attended: false };
          if (att.attended) {
            const stdPayload = buildStudentQrPayload(session, student, att);
            const stdQrUrl = await generateQrDataUrl(stdPayload, { width: 160 });
            newQrMap[`std_${session.id}_${student.nim}`] = {
              url: stdQrUrl,
              payload: stdPayload,
            };
          }
        }
      }
      if (isMounted) {
        setQrMap(newQrMap);
      }
    }
    loadAllQrs();
    return () => {
      isMounted = false;
    };
  }, [sessions, studentsList]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    setIsExportingPdf(true);
    try {
      // 1. Fetch the logo image and convert to Base64 data URL
      let logoDataUrl = null;
      try {
        const response = await fetch('/logo-itenas.png');
        const blob = await response.blob();
        logoDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.warn('Failed to load logo for PDF:', err);
      }

      // Landscape A4 for wide table presentation
      const doc = new jsPDF('l', 'mm', 'a4');

      // 2. KOP SURAT ITENAS (Bahasa Indonesia)
      if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', 14, 12, 22, 22);
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(institutionInfo.foundation, 148, 14, { align: 'center' });
      doc.setFontSize(15);
      doc.text(institutionInfo.institution, 148, 20, { align: 'center' });
      doc.setFontSize(10);
      doc.text(institutionInfo.bureau, 148, 25, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(institutionInfo.address, 148, 29, { align: 'center' });
      doc.text(institutionInfo.webEmail, 148, 33, { align: 'center' });

      // Garis Ganda Pembatas Kop Surat
      doc.setLineWidth(0.8);
      doc.line(14, 36, 283, 36);
      doc.setLineWidth(0.2);
      doc.line(14, 37, 283, 37);

      // 2. JUDUL DOKUMEN
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(institutionInfo.programTitle, 148, 43, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(period, 148, 48, { align: 'center' });

      // 3. SUSUN DATA TABEL
      const body = [];

      sessions.forEach((s) => {
        studentsList.forEach((std, stdIdx) => {
          const isFirstStudent = stdIdx === 0;
          const att = s.attendances[std.nim] || { attended: false };

          const row = [];

          if (isFirstStudent) {
            row.push({
              content: `${s.no}.`,
              rowSpan: studentsList.length,
              styles: { halign: 'center', valign: 'middle' },
            });
            row.push({
              content: s.dayDate,
              rowSpan: studentsList.length,
              styles: { valign: 'middle', fontStyle: 'bold' },
            });
          }

          // NIM
          row.push({
            content: std.nim,
            styles: { halign: 'center', valign: 'middle' },
          });

          // Student Name
          row.push({
            content: std.name,
            styles: { valign: 'middle' },
          });

          // Student Signature (QR or -)
          const stdQrKey = `std_${s.id}_${std.nim}`;
          const stdQr = qrMap[stdQrKey];

          if (att.attended && stdQr?.url) {
            row.push({
              content: '',
              styles: { halign: 'center', valign: 'middle', minCellHeight: 18 },
              qrType: 'student',
              qrUrl: stdQr.url,
            });
          } else {
            row.push({
              content: '-',
              styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: 12 },
            });
          }

          if (isFirstStudent) {
            // Materi
            row.push({
              content: s.material,
              rowSpan: studentsList.length,
              styles: { valign: 'middle' },
            });

            // Nama Fasilitator
            row.push({
              content: s.facilitatorName,
              rowSpan: studentsList.length,
              styles: { valign: 'middle', fontStyle: 'bold' },
            });

            // TTD Fasilitator (QR)
            const facQrKey = `fac_${s.id}`;
            const facQr = qrMap[facQrKey];
            if (s.facilitatorSigned && facQr?.url) {
              row.push({
                content: '',
                rowSpan: studentsList.length,
                styles: { halign: 'center', valign: 'middle', minCellHeight: 18 },
                qrType: 'facilitator',
                qrUrl: facQr.url,
              });
            } else {
              row.push({
                content: '-',
                rowSpan: studentsList.length,
                styles: { halign: 'center', valign: 'middle' },
              });
            }
          }

          body.push(row);
        });
      });

      doc.autoTable({
        startY: 52,
        head: [
          [
            { content: 'No.', styles: { halign: 'center' } },
            { content: 'DAY / DATE', styles: { halign: 'center' } },
            { content: 'NIM', styles: { halign: 'center' } },
            { content: 'STUDENT NAME', styles: { halign: 'center' } },
            { content: 'SIGNATURE (Student)', styles: { halign: 'center' } },
            { content: 'TOPIC / MATERIAL', styles: { halign: 'center' } },
            { content: 'FACILITATOR NAME', styles: { halign: 'center' } },
            { content: 'FACILITATOR SIGNATURE', styles: { halign: 'center' } },
          ],
        ],
        body: body,
        theme: 'grid',
        tableWidth: 269,
        margin: { left: 14, right: 14 },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          textColor: [15, 23, 42],
          lineColor: [30, 41, 59],
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: [241, 245, 249],
          textColor: [15, 23, 42],
          fontStyle: 'bold',
          lineColor: [30, 41, 59],
          lineWidth: 0.3,
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 32 },
          2: { cellWidth: 24 },
          3: { cellWidth: 42 },
          4: { cellWidth: 22 },
          5: { cellWidth: 77 },
          6: { cellWidth: 38 },
          7: { cellWidth: 24 },
        },
        didDrawCell: (data) => {
          const raw = data.cell.raw;
          if (raw && typeof raw === 'object' && raw.qrUrl) {
            try {
              const qrSize = 13;
              const xPos = data.cell.x + (data.cell.width - qrSize) / 2;
              const yPos = data.cell.y + (data.cell.height - qrSize) / 2;
              doc.addImage(raw.qrUrl, 'PNG', xPos, yPos, qrSize, qrSize);
            } catch (e) {
              console.error('Error drawing QR into PDF cell:', e);
            }
          }
        },
      });

      doc.save(`Itenas_Darmasiswa_Attendance_${period.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF: ' + error.message);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ACTION BAR (Hidden when printed) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 text-white border border-slate-800 no-print">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">
                Rekapitulasi Presensi Resmi (Kop Surat Resmi Itenas)
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Verified QR Signatures
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            disabled={isExportingPdf}
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
          >
            <FileDown className="w-4 h-4 text-emerald-400" />
            <span>{isExportingPdf ? 'Exporting...' : 'Download PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>
        </div>
      </div>

      {/* INSTRUCTIONS */}
      <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-center gap-2 no-print">
        <Info className="w-4 h-4 text-sky-600 shrink-0" />
        <span>Click any QR code on the table to view its digital signature verification certificate.</span>
      </div>

      {/* PAPER CANVAS CONTAINER */}
      <div className="bg-white rounded-md p-6 sm:p-10 lg:p-12 border border-slate-300 shadow-xs print:p-0 print:border-none print:shadow-none print:rounded-none max-w-[1240px] mx-auto text-slate-900 font-serif">
        
        {/* KOP SURAT RESMI ITENAS BANDUNG */}
        <div className="border-b-[3px] border-double border-slate-900 pb-4 mb-6 text-center relative">
          <div className="flex items-center justify-center gap-5 sm:gap-6">
            
            {/* ITENAS LOGO */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
              <img src="/logo-itenas.png" alt="Logo Resmi Itenas Bandung" className="w-full h-full object-contain drop-shadow-xs" />
            </div>

            {/* INSTITUTION TEXT HEADINGS */}
            <div className="space-y-0.5 text-center font-sans">
              <h2 className="text-xs sm:text-sm font-bold tracking-wider text-slate-800 uppercase">
                {institutionInfo.foundation}
              </h2>
              <h1 className="text-base sm:text-2xl font-black tracking-tight text-slate-950 uppercase">
                {institutionInfo.institution}
              </h1>
              <h3 className="text-xs sm:text-sm font-extrabold tracking-wide text-slate-900 uppercase">
                {institutionInfo.bureau}
              </h3>
              <div className="text-[10px] sm:text-[11px] text-slate-600 leading-tight pt-1">
                {institutionInfo.address}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-600 leading-tight">
                {institutionInfo.webEmail}
              </div>
            </div>
          </div>
        </div>

        {/* DOCUMENT TITLE & MONTH */}
        <div className="text-center mb-6 space-y-1 font-sans">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wide">
            {institutionInfo.programTitle}
          </h2>
          <div className="text-xs sm:text-sm font-bold text-slate-700">
            {period}
          </div>
        </div>

        {/* OFFICIAL RECAP TABLE WITH QR CODE SIGNATURES */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-slate-900 text-xs text-slate-900 font-sans">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-900 font-bold text-center text-[11px] sm:text-xs">
                <th className="border border-slate-900 py-2 px-1 w-10">No</th>
                <th className="border border-slate-900 py-2 px-2 w-32">DAY AND DATE</th>
                <th className="border border-slate-900 py-2 px-2 w-28">NIM</th>
                <th className="border border-slate-900 py-2 px-3 w-48 text-left">STUDENT NAME</th>
                <th className="border border-slate-900 py-2 px-2 w-28 text-center bg-slate-50">STUDENT SIGNATURE</th>
                <th className="border border-slate-900 py-2 px-3 text-left">TOPIC AND MATERIAL</th>
                <th className="border border-slate-900 py-2 px-3 w-44 text-left">FACILITATOR NAME</th>
                <th className="border border-slate-900 py-2 px-2 w-32 text-center bg-slate-50">FACILITATOR SIGNATURE</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                const facQrKey = `fac_${session.id}`;
                const facQr = qrMap[facQrKey];

                return (
                  <React.Fragment key={session.id}>
                    {studentsList.map((student, stdIdx) => {
                      const isFirst = stdIdx === 0;
                      const att = session.attendances[student.nim] || { attended: false };
                      const stdQrKey = `std_${session.id}_${student.nim}`;
                      const stdQr = qrMap[stdQrKey];

                      return (
                        <tr
                          key={`${session.id}-${student.nim}`}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          {/* 1. NO (Rowspan) */}
                          {isFirst && (
                            <td
                              rowSpan={studentsList.length}
                              className="border border-slate-900 text-center font-bold align-middle py-3 px-1"
                            >
                              {session.no}.
                            </td>
                          )}

                          {/* 2. DAY/DATE (Rowspan) */}
                          {isFirst && (
                            <td
                              rowSpan={studentsList.length}
                              className="border border-slate-900 font-semibold align-middle py-3 px-2 text-xs leading-snug"
                            >
                              {session.dayDate}
                            </td>
                          )}

                          {/* 3. NIM */}
                          <td className="border border-slate-900 font-mono text-center py-2.5 px-2 text-xs text-slate-800">
                            {student.nim}
                          </td>

                          {/* 4. STUDENT NAME */}
                          <td className="border border-slate-900 font-semibold py-2.5 px-3 text-xs text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>{student.name}</span>
                              <span className="text-[10px] text-slate-400 no-print">{student.flag}</span>
                            </div>
                          </td>

                          {/* 5. STUDENT QR */}
                          <td className="border border-slate-900 text-center py-1.5 px-2 align-middle bg-slate-50/40">
                            {att.attended ? (
                              <button
                                type="button"
                                onClick={() =>
                                  stdQr &&
                                  setSelectedQrInfo({
                                    title: 'Student Attendance Signature Verification',
                                    person: student.name,
                                    idNum: student.nim,
                                    role: 'Darmasiswa RI Student (Laos 🇱🇦)',
                                    session: session,
                                    qrUrl: stdQr.url,
                                    payload: stdQr.payload,
                                  })
                                }
                                className="inline-flex flex-col items-center justify-center cursor-pointer p-1 rounded hover:bg-slate-100 transition-colors"
                                title="Click to verify QR certificate"
                              >
                                {stdQr?.url ? (
                                  <img
                                    src={stdQr.url}
                                    alt={`QR TTD ${student.name}`}
                                    className="w-12 h-12 object-contain border border-slate-300 rounded-xs p-0.5 bg-white shadow-2xs"
                                  />
                                ) : (
                                  <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded text-slate-400">
                                    <QrCode className="w-6 h-6" />
                                  </div>
                                )}
                                <span className="text-[9px] font-mono text-emerald-800 font-semibold mt-0.5">
                                  Valid QR
                                </span>
                              </button>
                            ) : (
                              <span className="font-extrabold text-base text-slate-700 block">
                                Absent
                              </span>
                            )}
                          </td>

                          {/* 6. TOPIC Rowspan */}
                          {isFirst && (
                            <td
                              rowSpan={darmasiswaStudentsList.length}
                              className="border border-slate-900 align-middle py-3 px-3 text-xs leading-relaxed text-slate-800"
                            >
                              {session.material}
                            </td>
                          )}

                          {/* 7. FACILITATOR NAME Rowspan */}
                          {isFirst && (
                            <td
                              rowSpan={studentsList.length}
                              className="border border-slate-900 font-bold align-middle py-3 px-3 text-xs text-slate-900"
                            >
                              {session.facilitatorName}
                            </td>
                          )}

                          {/* 8. FACILITATOR QR Rowspan */}
                          {isFirst && (
                            <td
                              rowSpan={studentsList.length}
                              className="border border-slate-900 text-center align-middle py-2 px-2 bg-slate-50/40"
                            >
                              {session.facilitatorSigned ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    facQr &&
                                    setSelectedQrInfo({
                                      title: 'Lecturer or Facilitator Signature Verification',
                                      person: session.facilitatorName,
                                      idNum: session.facilitatorNip || '',
                                      role: 'BIPA Course Facilitator',
                                      session: session,
                                      qrUrl: facQr.url,
                                      payload: facQr.payload,
                                    })
                                  }
                                  className="inline-flex flex-col items-center justify-center cursor-pointer p-1 rounded hover:bg-slate-100 transition-colors"
                                  title="Click to verify QR certificate"
                                >
                                  {facQr?.url ? (
                                    <img
                                      src={facQr.url}
                                      alt={`QR ${session.facilitatorName}`}
                                      className="w-12 h-12 object-contain border border-slate-300 rounded-xs p-0.5 bg-white shadow-2xs"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded text-slate-400">
                                      <QrCode className="w-6 h-6" />
                                    </div>
                                  )}
                                  <span className="text-[9px] font-mono text-emerald-800 font-semibold mt-0.5">
                                    Facilitator QR
                                  </span>
                                </button>
                              ) : (
                                <span className="font-bold text-slate-400">Not Signed</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* BOTTOM OFFICIAL NOTES / FOOTER */}
        <div className="mt-8 pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 font-sans gap-3">
          <div>
            <div>
              Tanda tangan Mahasiswa dan Fasilitator pada lembar rekapitulasi ini disahkan melalui sistem verifikasi presensi digital berbasis QR Code
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              Verifikasi Dokumen Digital Resmi: https://itenas.ac.id/verify-presensi-darmasiswa
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-semibold text-slate-700">Bandung, {period}</div>
            <div className="font-bold text-slate-900">Biro Kerja Sama, Hubungan Masyarakat dan Pemasaran ITENAS</div>
          </div>
        </div>

      </div>

      {/* QR MODAL POPUP FOR VERIFICATION DETAIL */}
      {selectedQrInfo && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={() => setSelectedQrInfo(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-white">
                  Digital Signature Verification
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQrInfo(null)}
                className="w-7 h-7 rounded text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 text-center space-y-3">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg inline-block shadow-2xs">
                <img
                  src={selectedQrInfo.qrUrl}
                  alt="QR Code"
                  className="w-32 h-32 object-contain mx-auto"
                />
              </div>

              <div className="text-left space-y-1.5 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Name</span>
                  <span className="font-semibold text-slate-900">{selectedQrInfo.person}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">ID NIM NIP</span>
                  <span className="font-mono text-slate-800">{selectedQrInfo.idNum}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Role</span>
                  <span className="text-slate-700">{selectedQrInfo.role}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Session</span>
                  <span className="text-slate-800">
                    Session {selectedQrInfo.session.no} {selectedQrInfo.session.dayDate}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Topic</span>
                  <span className="text-slate-800 max-w-[200px] truncate" title={selectedQrInfo.session.material}>
                    {selectedQrInfo.session.material}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Timestamp</span>
                  <span className="font-mono text-slate-700">
                    {selectedQrInfo.payload.signTimestamp}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-slate-500">Certificate Hash</span>
                  <span className="font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                    {selectedQrInfo.payload.certHash}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedQrInfo(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
