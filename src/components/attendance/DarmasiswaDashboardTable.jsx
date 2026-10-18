// src/components/attendance/DarmasiswaDashboardTable.jsx
import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Search,
  Printer,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react';
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

export default function DarmasiswaDashboardTable({
  onOpenOfficialReportView,
  sessions: externalSessions,
  onSessionsChange,
}) {
  const [localSessions, setLocalSessions] = useState(initialDarmasiswaSessions);

  // Use external sessions if provided (lifted state from App), else local
  const sessions = externalSessions ?? localSessions;
  const setSessions = onSessionsChange ?? setLocalSessions;

  const [searchQuery, setSearchQuery] = useState('');
  const [qrMap, setQrMap] = useState({});
  const [selectedQrInfo, setSelectedQrInfo] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);

  // New session form
  const [newSessionForm, setNewSessionForm] = useState({
    dayDate: 'Monday / 10 March 2025',
    material: '',
    facilitatorName: 'Dianita, S.S., M.Hum.',
    facilitatorNip: '198704122015052001',
  });

  // Pre-generate QR codes
  useEffect(() => {
    let isMounted = true;
    async function loadQrs() {
      const newQrMap = {};
      for (const session of sessions) {
        if (session.facilitatorSigned) {
          const facPayload = buildFacilitatorQrPayload(session);
          const facQrUrl = await generateQrDataUrl(facPayload, { width: 140 });
          newQrMap[`fac_${session.id}`] = {
            url: facQrUrl,
            payload: facPayload,
          };
        }

        for (const student of darmasiswaStudentsList) {
          const att = session.attendances[student.nim] || { attended: false };
          if (att.attended) {
            const stdPayload = buildStudentQrPayload(session, student, att);
            const stdQrUrl = await generateQrDataUrl(stdPayload, { width: 140 });
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
    loadQrs();
    return () => {
      isMounted = false;
    };
  }, [sessions]);

  // Toggle student attendance
  const handleToggleAttendance = (sessionId, nim) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const currentAtt = s.attendances[nim] || { attended: false };
        const newAttended = !currentAtt.attended;
        return {
          ...s,
          attendances: {
            ...s.attendances,
            [nim]: {
              ...currentAtt,
              attended: newAttended,
              status: newAttended ? 'PRESENT' : 'ABSENT',
              signTime: newAttended ? `${s.dateIso || '2025-03-08'} 08:00:00` : null,
            },
          },
        };
      })
    );
  };

  // Add new session handler
  const handleAddSession = (e) => {
    e.preventDefault();
    if (!newSessionForm.material.trim()) return;

    const nextNo = sessions.length + 1;
    const newSession = {
      id: `sesi-${Date.now()}`,
      no: nextNo,
      dayDate: newSessionForm.dayDate,
      dateIso: '2025-03-10',
      material: newSessionForm.material,
      facilitatorName: newSessionForm.facilitatorName,
      facilitatorNip: newSessionForm.facilitatorNip,
      facilitatorSigned: true,
      facilitatorSignTime: '2025-03-10 11:30:00',
      attendances: {
        '312024043': { attended: true, status: 'PRESENT', note: 'Present', signTime: '2025-03-10 08:00:00' },
        '312024144': { attended: true, status: 'PRESENT', note: 'Present', signTime: '2025-03-10 08:00:00' },
      },
    };

    setSessions([...sessions, newSession]);
    setIsAddSessionModalOpen(false);
    setNewSessionForm({
      dayDate: 'Wednesday / 12 March 2025',
      material: '',
      facilitatorName: 'Dianita, S.S., M.Hum.',
      facilitatorNip: '198704122015052001',
    });
  };

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    // 1. Date Range Filter
    if (startDate && s.dateIso) {
      if (new Date(s.dateIso) < new Date(startDate)) return false;
    }
    if (endDate && s.dateIso) {
      if (new Date(s.dateIso) > new Date(endDate)) return false;
    }

    // 2. Search Query Filter
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchMaterial = s.material.toLowerCase().includes(q);
    const matchFac = s.facilitatorName.toLowerCase().includes(q);
    const matchDate = s.dayDate.toLowerCase().includes(q);
    const matchStudents = darmasiswaStudentsList.some(
      (std) => std.name.toLowerCase().includes(q) || std.nim.includes(q)
    );
    return matchMaterial || matchFac || matchDate || matchStudents;
  });

  // Calculate statistics
  const totalSessions = sessions.length;
  let totalPresences = 0;
  const possiblePresences = totalSessions * darmasiswaStudentsList.length;

  sessions.forEach((s) => {
    darmasiswaStudentsList.forEach((std) => {
      if (s.attendances[std.nim]?.attended) totalPresences++;
    });
  });

  const attendanceRate = possiblePresences > 0 ? Math.round((totalPresences / possiblePresences) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Itenas Darmasiswa Attendance
            </h2>
            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              Coordinator & Supervisor Portal
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenOfficialReportView && (
              <button
                type="button"
                onClick={onOpenOfficialReportView}
                className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Document</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddSessionModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Session</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Total Sessions</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{totalSessions} Meetings</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Enrolled Students</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">2 International</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Attendance Rate</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{attendanceRate}%</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Signatures</span>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">Digital QR</div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic, student name, or lecturer..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-400 outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide hidden lg:block">From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-700 outline-none focus:ring-0 cursor-pointer w-24 sm:w-auto"
            />
            <span className="text-slate-400 text-xs font-medium">to</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide hidden lg:block">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-700 outline-none focus:ring-0 cursor-pointer w-24 sm:w-auto"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium px-2 py-1.5 bg-slate-100 rounded shrink-0">
            {filteredSessions.length} Sessions
          </span>
        </div>
      </div>

      {/* THE DATA TABLE */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto shadow-xs">
        <div className="min-w-max">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/75 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3 w-12 text-center border-r border-slate-200">No</th>
                <th className="py-2.5 px-3 w-36 border-r border-slate-200">DAY AND DATE</th>
                <th className="py-2.5 px-3 w-28 text-center border-r border-slate-200">NIM</th>
                <th className="py-2.5 px-3 w-48 border-r border-slate-200">STUDENT NAME</th>
                <th className="py-2.5 px-3 w-32 text-center border-r border-slate-200 bg-slate-50/50">
                  STUDENT SIGNATURE
                </th>
                <th className="py-2.5 px-3 border-r border-slate-200">TOPIC AND MATERIAL</th>
                <th className="py-2.5 px-3 w-44 border-r border-slate-200">FACILITATOR NAME</th>
                <th className="py-2.5 px-3 w-32 text-center bg-slate-50/50">
                  FACILITATOR SIGNATURE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSessions.map((session) => {
                const facQrKey = `fac_${session.id}`;
                const facQr = qrMap[facQrKey];

                return (
                  <React.Fragment key={session.id}>
                    {darmasiswaStudentsList.map((student, stdIdx) => {
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
                              rowSpan={darmasiswaStudentsList.length}
                              className="py-3 px-3 text-center font-semibold text-slate-700 align-middle border-r border-slate-200 bg-white"
                            >
                              {session.no}.
                            </td>
                          )}

                          {/* 2. HARI/TGL (Rowspan) */}
                          {isFirst && (
                            <td
                              rowSpan={darmasiswaStudentsList.length}
                              className="py-3 px-3 font-medium text-slate-800 align-middle border-r border-slate-200 bg-white"
                            >
                              {session.dayDate}
                            </td>
                          )}

                          {/* 3. NIM */}
                          <td className="py-2 px-3 text-center font-mono text-slate-600 border-r border-slate-200">
                            {student.nim}
                          </td>

                          {/* 4. STUDENT NAME */}
                          <td className="py-2 px-3 font-medium text-slate-900 border-r border-slate-200">
                            <div className="flex items-center gap-1.5">
                              <span>{student.name}</span>
                              <span className="text-slate-400 text-[11px]">{student.flag}</span>
                            </div>
                          </td>

                          {/* 5. STUDENT QR */}
                          <td className="py-2 px-2 text-center align-middle border-r border-slate-200 bg-slate-50/30">
                            {att.attended ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    stdQr &&
                                    setSelectedQrInfo({
                                      title: 'Student Signature Verification',
                                      person: student.name,
                                      idNum: student.nim,
                                      role: 'Darmasiswa RI Student (Laos 🇱🇦)',
                                      session: session,
                                      qrUrl: stdQr.url,
                                      payload: stdQr.payload,
                                    })
                                  }
                                  className="inline-flex flex-col items-center justify-center p-1 rounded border border-slate-200 bg-white hover:border-slate-400 transition-colors cursor-pointer"
                                  title="View QR certificate details"
                                >
                                  {stdQr?.url ? (
                                    <img
                                      src={stdQr.url}
                                      alt={`QR ${student.name}`}
                                      className="w-9 h-9 object-contain bg-white"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 flex items-center justify-center bg-slate-100 rounded">
                                      <QrCode className="w-4 h-4 text-slate-400" />
                                    </div>
                                  )}
                                  <span className="text-[9px] font-medium text-emerald-700 mt-0.5">
                                    Verified QR
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleAttendance(session.id, student.nim)}
                                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Toggle attendance status"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1.5">
                                <span className="font-bold text-slate-400 px-2 py-0.5">
                                  —
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleToggleAttendance(session.id, student.nim)}
                                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Mark as present"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* 6. TOPIC (Rowspan) */}
                          {isFirst && (
                            <td
                              rowSpan={darmasiswaStudentsList.length}
                              className="py-3 px-3 align-middle border-r border-slate-200 bg-white text-slate-800 leading-relaxed"
                            >
                              {session.material}
                            </td>
                          )}

                          {/* 7. FACILITATOR NAME (Rowspan) */}
                          {isFirst && (
                            <td
                              rowSpan={darmasiswaStudentsList.length}
                              className="py-3 px-3 font-medium text-slate-900 align-middle border-r border-slate-200 bg-white"
                            >
                              <div>{session.facilitatorName}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                NIP: {session.facilitatorNip || '-'}
                              </div>
                            </td>
                          )}

                          {/* 8. FACILITATOR QR (Rowspan) */}
                          {isFirst && (
                            <td
                              rowSpan={darmasiswaStudentsList.length}
                              className="py-3 px-2 text-center align-middle bg-slate-50/30"
                            >
                              {session.facilitatorSigned && facQr ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedQrInfo({
                                      title: 'Course Lecturer Signature Verification',
                                      person: session.facilitatorName,
                                      idNum: session.facilitatorNip || '-',
                                      role: 'Course Lecturer / Facilitator',
                                      session: session,
                                      qrUrl: facQr.url,
                                      payload: facQr.payload,
                                    })
                                  }
                                  className="inline-flex flex-col items-center justify-center p-1 rounded border border-slate-200 bg-white hover:border-slate-400 transition-colors cursor-pointer"
                                  title="View Lecturer QR Certificate details"
                                >
                                  {facQr.url ? (
                                    <img
                                      src={facQr.url}
                                      alt={`QR ${session.facilitatorName}`}
                                      className="w-9 h-9 object-contain bg-white"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 flex items-center justify-center bg-slate-100 rounded">
                                      <QrCode className="w-4 h-4 text-slate-400" />
                                    </div>
                                  )}
                                  <span className="text-[9px] font-medium text-slate-700 mt-0.5">
                                    Lecturer QR
                                  </span>
                                </button>
                              ) : (
                                <span className="text-slate-400">Not Signed</span>
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
      </div>

      {/* MODAL ADD SESSION */}
      {isAddSessionModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setIsAddSessionModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Add Class Session</h3>
              <button
                type="button"
                onClick={() => setIsAddSessionModalOpen(false)}
                className="w-7 h-7 rounded text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSession} className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Day and Date</label>
                <input
                  type="text"
                  required
                  value={newSessionForm.dayDate}
                  onChange={(e) => setNewSessionForm({ ...newSessionForm, dayDate: e.target.value })}
                  placeholder="Monday 10 March 2025"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800 text-xs focus:border-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Topic and Learning Activity</label>
                <textarea
                  required
                  rows="3"
                  value={newSessionForm.material}
                  onChange={(e) => setNewSessionForm({ ...newSessionForm, material: e.target.value })}
                  placeholder="Enter lesson topic practice drills or cultural immersion activities"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800 text-xs focus:border-slate-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Facilitator Name</label>
                  <select
                    value={newSessionForm.facilitatorName}
                    onChange={(e) => setNewSessionForm({ ...newSessionForm, facilitatorName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800 text-xs focus:border-slate-500 outline-none cursor-pointer"
                  >
                    <option value="Dianita, S.S., M.Hum.">Dianita, S.S., M.Hum.</option>
                    <option value="Iis Tjuhartika Pandi, S.Psi.">Iis Tjuhartika Pandi, S.Psi.</option>
                    <option value="Siti Sopiah, S.S., M.Pd.">Siti Sopiah, S.S., M.Pd.</option>
                    <option value="Dra. Siti Rahmawati, M.Hum.">Dra. Siti Rahmawati, M.Hum.</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Facilitator NIP</label>
                  <input
                    type="text"
                    value={newSessionForm.facilitatorNip}
                    onChange={(e) => setNewSessionForm({ ...newSessionForm, facilitatorNip: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800 font-mono text-xs focus:border-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSessionModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors cursor-pointer"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR VERIFICATION MODAL POPUP */}
      {selectedQrInfo && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setSelectedQrInfo(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h4 className="font-bold text-xs text-slate-900 leading-tight">
                QR Digital Signature Certificate
              </h4>
              <button
                type="button"
                onClick={() => setSelectedQrInfo(null)}
                className="w-6 h-6 rounded text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 text-center space-y-3">
              <div className="inline-block p-2 border border-slate-200 rounded-lg bg-white">
                <img
                  src={selectedQrInfo.qrUrl}
                  alt="QR Code"
                  className="w-32 h-32 object-contain"
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
                  <span className="text-slate-500">Timestamp</span>
                  <span className="font-mono text-slate-700">
                    {selectedQrInfo.payload.signTimestamp}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-slate-500">Certificate Hash</span>
                  <span className="font-mono text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {selectedQrInfo.payload.certHash}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedQrInfo(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
