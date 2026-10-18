import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  FileCheck2,
  Users,
  LogOut,
  Search,
  Bell,
  Clock,
  AlertTriangle,
  MessageCircleWarning,
  CheckCircle2,
  FolderOpen,
  FileText,
  BadgeAlert,
  BarChart,
  ShieldAlert,
  ThumbsUp,
  Link as LinkIcon,
  BookOpen,
  X,
  Check,
  Eye,
  Download,
  Send,
  Filter,
  MapPin,
  ListTodo,
  Sparkles,
  QrCode,
  Printer
} from 'lucide-react';
import DarmasiswaDashboardTable from './attendance/DarmasiswaDashboardTable';
import DarmasiswaRecapReport from './attendance/DarmasiswaRecapReport';

const pedagogicalLogs = [
  {
    id: 'LOG-01',
    date: '26 Mar 2026',
    time: '11:45 WIB',
    cls: 'BIPA A2 Elementary 2',
    session: 'Meeting 4',
    teacher: 'Ahmad Subagja, M.Hum.',
    category: 'PRONUNCIATION',
    catLabel: 'Pronunciation and Intonation',
    targetGroup: 'Students from Japan & Korea (4 students)',
    quote: '"Japanese students struggle to differentiate question vs. rhetorical intonation; supplementary audio drill practice is required."',
    recommendation: 'Provide a dedicated audio drill module with pitch waveforms and rising inflection exercises at sentence endings.',
    status: 'UNDER_SUPERVISION',
    statusLabel: 'Under Supervision',
    driveUrl: 'https://drive.google.com'
  },
  {
    id: 'LOG-02',
    date: '25 Mar 2026',
    time: '14:20 WIB',
    cls: 'BIPA B1 — Conversation & Culture',
    session: 'Meeting 4',
    teacher: 'Dra. Siti Rahmawati, M.Hum.',
    category: 'CULTURE',
    catLabel: 'Cultural & Field Adaptation',
    targetGroup: 'Entire B1 Cohort (15 students)',
    quote: '"During market simulations, several foreign students hesitated to bargain, fearing it would be perceived as impolite in Indonesian culture."',
    recommendation: 'Explain the welcoming philosophy of Indonesian marketplace bargaining ("convivial social interaction") prior to field excursions.',
    status: 'RESOLVED',
    statusLabel: 'Solution Applied',
    driveUrl: 'https://drive.google.com'
  },
  {
    id: 'LOG-03',
    date: '24 Mar 2026',
    time: '16:00 WIB',
    cls: 'BIPA B2 — Grammar & Discourse',
    session: 'Meeting 3',
    teacher: 'Dr. Maman Suryaman',
    category: 'GRAMMAR',
    catLabel: 'Grammar Morphology',
    targetGroup: 'Students from Middle East & Europe (5 students)',
    quote: '"Students frequently confuse the affix per-...-an (process/location) with ke-...-an (state/abstract noun)."',
    recommendation: 'Provide visual comparison matrix tables with contextual example sentences from authentic online journalism.',
    status: 'RESOLVED',
    statusLabel: 'Solution Applied',
    driveUrl: 'https://drive.google.com'
  },
  {
    id: 'LOG-04',
    date: '24 Mar 2026',
    time: '10:30 WIB',
    cls: 'BIPA C1 — Academic Research',
    session: 'Meeting 3',
    teacher: 'Dr. Maman Suryaman',
    category: 'METHOD',
    catLabel: 'Teaching Methodology',
    targetGroup: 'C1 Class (8 students)',
    quote: '"Discussion was dynamic regarding deforestation and peatland conservation; students demonstrated enthusiastic spoken argumentation."',
    recommendation: 'Academic debate format is highly effective; recommend maintaining this approach for upcoming socio-economic themes.',
    status: 'RESOLVED',
    statusLabel: 'Best Practice',
    driveUrl: 'https://drive.google.com'
  },
  {
    id: 'LOG-05',
    date: '23 Mar 2026',
    time: '09:15 WIB',
    cls: 'BIPA A1 — Fundamentals 1',
    session: 'Meeting 4',
    teacher: 'Pak Andi Wijaya',
    category: 'PRONUNCIATION',
    catLabel: 'Pronunciation and Intonation',
    targetGroup: 'Western Students (6 students)',
    quote: '"Pronunciation of word-initial velar nasal /ng/ such as in \\"ngantuk\\", \\"ngobrol\\" remains rigid."',
    recommendation: 'Conduct rhythmic pronunciation practice aided by Indonesian rhythmic nursery rhymes and tonal drills.',
    status: 'UNDER_SUPERVISION',
    statusLabel: 'Under Supervision',
    driveUrl: 'https://drive.google.com'
  },
  {
    id: 'LOG-06',
    date: '22 Mar 2026',
    time: '13:00 WIB',
    cls: 'BIPA A1 — Fundamentals 1',
    session: 'Meeting 3',
    teacher: 'Pak Andi Wijaya',
    category: 'GRAMMAR',
    catLabel: 'Grammar (Sentence Structure)',
    targetGroup: 'Students from Japan & Korea (4 students)',
    quote: '"Difficulty adapting to Head-Modifier (Diterangkan-Menerangkan) word order versus Modifier-Head in native languages."',
    recommendation: 'Utilize colorful flashcards repeatedly reversing noun and adjective positions in structured pairs.',
    status: 'RESOLVED',
    statusLabel: 'Solution Applied',
    driveUrl: 'https://drive.google.com'
  }
];

export default function SupervisorDashboard({
  currentUser,
  sessionInfo,
  onLogout,
  onSwitchToCoordinatorView,
  meetingStatus,
  teacherSignData,
  studentRepSignData,
  onSupervisorApprove
}) {
  const [activeNav, setActiveNav] = useState('audit'); // 'dashboard' | 'audit' | 'analytics'
  const [activeMainTab, setActiveMainTab] = useState('audit'); // 'audit' | 'recap'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isSuperviseModalOpen, setIsSuperviseModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isItenasReportModalOpen, setIsItenasReportModalOpen] = useState(false);

  // Table Modal for Supervisor Metric Cards
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [activeMetricTab, setActiveMetricTab] = useState('endorsements'); // 'endorsements' | 'deviations' | 'issues' | 'approved'
  const [isPedagogicalModalOpen, setIsPedagogicalModalOpen] = useState(false);
  const [pedagogicalFilter, setPedagogicalFilter] = useState('ALL');

  // Dynamic Pedagogical Logs State synced with Database API
  const [logs, setLogs] = useState(pedagogicalLogs);

  React.useEffect(() => {
    let isMounted = true;
    async function fetchLogs() {
      try {
        const res = await fetch('/api/pedagogical-logs');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && isMounted) {
            setLogs(data);
          }
        }
      } catch (err) {
        console.warn('Failed to load pedagogical logs:', err);
      }
    }
    fetchLogs();
    return () => { isMounted = false; };
  }, []);

  const handleRespondLog = async (logId, teacherName) => {
    try {
      const res = await fetch(`/api/pedagogical-logs/${logId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responseText: 'Supervision feedback provided and pedagogical follow-up confirmed.',
          recommendation: 'Material and method recommendation applied by academic supervisor.'
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setLogs((prev) => prev.map((l) => (l.id === logId ? updated : l)));
        showToast(`Pedagogical supervision feedback sent to teacher ${teacherName}`);
        return;
      }
    } catch {
      // offline fallback
    }
    setLogs((prev) =>
      prev.map((l) =>
        l.id === logId ? { ...l, status: 'RESOLVED', statusLabel: 'Solution Applied' } : l
      )
    );
    showToast(`Pedagogical supervision feedback sent to teacher ${teacherName}`);
  };

  const totalLogs = logs.length;
  const resolvedLogs = logs.filter((l) => l.status === 'RESOLVED').length;
  const underSupervisionLogs = logs.filter((l) => l.status === 'UNDER_SUPERVISION').length;
  const pronunciationCount = logs.filter((l) => l.category === 'PRONUNCIATION').length;
  const grammarCount = logs.filter((l) => l.category === 'GRAMMAR').length;
  const cultureCount = logs.filter((l) => l.category === 'CULTURE').length;
  const methodCount = logs.filter((l) => l.category === 'METHOD').length;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = () => {
    onSupervisorApprove(feedback);
    setIsSuperviseModalOpen(false);
    showToast('Official Teaching Report (BAP) has been approved by the Academic Supervisor.');
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] p-3 sm:p-5 lg:p-8 flex items-center justify-center font-sans antialiased text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-sky-600 text-white shadow-xl text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main App Container Card */}
      <div className="w-full max-w-[1440px] bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 relative overflow-hidden">
        {/* ================= MAIN CONTENT DASHBOARD ================= */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
          {/* TOP BAR */}
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 bg-white z-20 py-2 border-b border-slate-100">
            <div className="w-full sm:max-w-md relative">
              <div className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white border border-slate-200 rounded-xl px-3.5 py-2 transition-colors">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search teachers, pedagogical notes, or BAP reports..."
                  className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-normal"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => showToast('No critical reports')}
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 border-2 border-white" />
              </button>

              <div className="flex items-center gap-2.5 pl-2">
                <div className="w-9 h-9 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center text-lg">
                  {currentUser?.avatar || <ShieldAlert className="w-4 h-4 text-sky-700" />}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{currentUser?.name || 'Dra. Ratna Handayani, M.Hum.'}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{currentUser?.title || 'Quality Assurance and Curriculum Supervisor QA'}</div>
                </div>
              </div>
            </div>
          </header>

          {/* ACADEMIC OVERSIGHT WIDGETS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. Pending Endorsements */}
            <div
              onClick={() => {
                setActiveMetricTab('endorsements');
                setIsMetricModalOpen(true);
              }}
              className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col justify-between space-y-2.5 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <BadgeAlert className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  Needs Review
                </span>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">4 Reports</div>
                <span className="text-xs text-slate-500 font-medium">Pending Approval</span>
              </div>
              <div className="pt-1.5 border-t border-slate-100 text-[11px] font-medium text-rose-600">
                2 BIPA B1 classes pending verification
              </div>
            </div>

            {/* 2. Curriculum Deviation Tracker */}
            <div
              onClick={() => {
                setActiveMetricTab('deviations');
                setIsMetricModalOpen(true);
              }}
              className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col justify-between space-y-2.5 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  This Week
                </span>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">2 Sessions</div>
                <span className="text-xs text-slate-500 font-medium">Schedule Divergence</span>
              </div>
              <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-500">
                1 C1 topic, 1 A1 material
              </div>
            </div>

            {/* 3. Pedagogical Hurdles Summary */}
            <div
              onClick={() => {
                setActiveMetricTab('issues');
                setIsMetricModalOpen(true);
              }}
              className="rounded-xl bg-emerald-50/50 border border-emerald-200 p-4 flex flex-col justify-between space-y-2.5 shadow-xs hover:border-emerald-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <MessageCircleWarning className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-emerald-800">
                  Faculty Reports
                </span>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Learning Observations</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-[10px] font-medium bg-white text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded">Pronunciation (3)</span>
                  <span className="text-[10px] font-medium bg-white text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded">Grammar (2)</span>
                  <span className="text-[10px] font-medium bg-white text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded">Culture (1)</span>
                </div>
              </div>
            </div>

            {/* 4. Supervised Sessions Stat */}
            <div
              onClick={() => {
                setActiveMetricTab('approved');
                setIsMetricModalOpen(true);
              }}
              className="rounded-xl bg-sky-50/50 border border-sky-200 p-4 flex flex-col justify-between space-y-2.5 shadow-xs hover:border-sky-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-sky-800">
                  85% Complete
                </span>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">34 Sessions</div>
                <span className="text-xs text-slate-600 font-medium">Approved Reports</span>
                <div className="w-full bg-sky-200/60 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-sky-600 h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="pt-1.5 border-t border-sky-200/60 text-[11px] text-slate-600 font-medium">
                Month of March 2026
              </div>
            </div>
          </section>

          {/* FULL WIDTH CONTENT AREA */}
          <div className="space-y-6 pb-24">
            {/* Audit Table / Recap Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 overflow-hidden flex flex-col min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
                  <button
                    type="button"
                    onClick={() => setActiveMainTab('audit')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeMainTab === 'audit'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4 text-sky-400" />
                    Class Reports
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMainTab('recap')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeMainTab === 'recap'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    Itenas Attendance Recap
                  </button>
                </div>

                {activeMainTab === 'audit' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMetricTab('approved');
                      setIsMetricModalOpen(true);
                    }}
                    className="text-[10px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 px-2.5 py-1 rounded-full flex items-center gap-0.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    Complete History Table 34 Sessions 
                  </button>
                )}
              </div>

              {activeMainTab === 'recap' ? (
                <div className="animate-in fade-in duration-200">
                  <DarmasiswaDashboardTable
                    onOpenOfficialReportView={() => setIsItenasReportModalOpen(true)}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 flex-1">
                <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-800 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Level & Class</th>
                      <th className="px-4 py-3">Meeting</th>
                      <th className="px-4 py-3">Validation (Dual-QR)</th>
                      <th className="px-4 py-3">Plan vs Delivery Deviation</th>
                      <th className="px-4 py-3 text-right">Audit Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Active Session Row (from Props) */}
                    {meetingStatus !== 'SUPERVISOR_APPROVED' && (
                      <tr className="bg-white hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-bold text-slate-900">{sessionInfo.className}</div>
                          <div className="text-[10px] text-slate-500">{sessionInfo.teacherName}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-bold">M. 4</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {teacherSignData ? (
                              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center" title="Teacher QR Verified"><CheckCircle2 className="w-3.5 h-3.5"/></span>
                            ) : (
                              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center" title="Awaiting Teacher"><Clock className="w-3.5 h-3.5"/></span>
                            )}
                            {studentRepSignData ? (
                              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center" title="Student Rep QR Verified"><CheckCircle2 className="w-3.5 h-3.5"/></span>
                            ) : (
                              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center" title="Awaiting Student Rep"><Clock className="w-3.5 h-3.5"/></span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">100% On Plan</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          {meetingStatus === 'SIGNED' ? (
                            <button 
                              onClick={() => setIsSuperviseModalOpen(true)}
                              className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                            >
                              Open Audit and Sign
                            </button>
                          ) : (
                            <button disabled className="bg-slate-100 text-slate-400 px-3 py-1.5 rounded-xl text-xs font-bold cursor-not-allowed">
                              Awaiting Dual-QR
                            </button>
                          )}
                        </td>
                      </tr>
                    )}

                    {/* Mock Demo Data */}
                    <tr className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900">BIPA A2 Elementary 2</div>
                        <div className="text-[10px] text-slate-500">Ahmad Subagja, M.Hum.</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-bold">M. 4</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                           <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center" title="Teacher QR Verified"><CheckCircle2 className="w-3.5 h-3.5"/></span>
                           <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center" title="Student QR Verified"><CheckCircle2 className="w-3.5 h-3.5"/></span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Pedagogical Issue Reported
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button onClick={() => setIsSuperviseModalOpen(true)} className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer">
                          Open Audit and Sign
                        </button>
                      </td>
                    </tr>

                    {meetingStatus === 'SUPERVISOR_APPROVED' && (
                      <tr className="bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-bold text-slate-900">{sessionInfo.className}</div>
                          <div className="text-[10px] text-slate-500">{sessionInfo.teacherName}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg text-xs font-bold">M. 4</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Approved (3 QRs)</span>
                        </td>
                        <td className="px-4 py-4">-</td>
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => showToast(`Downloading official BAP PDF document: ${sessionInfo.className}`)}
                            className="text-emerald-700 hover:underline text-xs font-bold flex items-center justify-end gap-1 w-full cursor-pointer"
                          >
                            <FileText className="w-4 h-4"/> Download BAP PDF
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              )}
            </div>

            {/* Pedagogical Monitoring Feed */}
            {activeMainTab !== 'recap' && (
              <div className="bg-[#fff] rounded-[32px] border border-slate-100 shadow-sm p-4 sm:p-6 space-y-4 min-w-0">
               <div className="flex items-center justify-between">
                 <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                   <MessageCircleWarning className="w-5 h-5 text-amber-500" />
                   Field Notes & Class Dynamics
                 </h3>
                 <button
                   type="button"
                   onClick={() => setIsPedagogicalModalOpen(true)}
                   className="text-[10px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1 rounded-full flex items-center gap-0.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                 >
                   Dynamics Log Table 
                 </button>
               </div>
               <div className="text-[11px] text-slate-500">Recent learning issues and incidents reported by teachers.</div>

               <div className="space-y-4 mt-4">
                  {logs.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className={`relative p-4 rounded-2xl ${
                        item.status === 'RESOLVED'
                          ? 'bg-slate-50 border border-slate-200'
                          : 'bg-amber-50 border border-amber-100'
                      }`}
                    >
                      <div
                        className={`absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'RESOLVED'
                            ? 'text-slate-500 bg-slate-200/50'
                            : 'text-amber-800 bg-amber-200/50'
                        }`}
                      >
                        {item.session?.replace('Meeting ', 'M. ') || 'M. 4'}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-white bg-slate-800 px-2 py-0.5 rounded-full">
                          {item.cls?.split(' ')[0] + ' ' + (item.cls?.split(' ')[1] || '')}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">{item.teacher}</span>
                      </div>
                      <div
                        className={`text-sm font-medium mt-2 leading-relaxed ${
                          item.status === 'RESOLVED' ? 'text-slate-700 italic' : 'text-slate-900'
                        }`}
                      >
                        {item.quote}
                      </div>
                      <div
                        className={`mt-3 pt-3 flex justify-between items-center ${
                          item.status === 'RESOLVED' ? 'border-t border-slate-200' : 'border-t border-amber-200'
                        }`}
                      >
                        <a
                          href={item.driveUrl || 'https://drive.google.com'}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          Recording Evidence (Drive)
                        </a>
                        {item.status === 'RESOLVED' ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            ✓ Solution Applied
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRespondLog(item.id, item.teacher)}
                            className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-100 cursor-pointer shadow-xs active:scale-95"
                          >
                            Respond
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
           )}
          </div>
        </div>
      </div>

      {/* SUPERVISOR APPROVAL MODAL */}
      {isSuperviseModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSuperviseModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Pedagogical Audit & BAP Endorsement</h2>
                <div className="text-xs text-slate-500 mt-1">Perform final review of curriculum realization before affixing the endorsement seal.</div>
              </div>
              <button
                onClick={() => setIsSuperviseModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              ><X className="w-4 h-4" /></button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {/* Session Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                   <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Syllabus Planned</div>
                   <div className="font-bold text-slate-900 text-sm">{sessionInfo.actual_unit}</div>
                   <div className="text-xs text-slate-600">{sessionInfo.actual_topic}</div>
                </div>
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-1">
                   <div className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">Execution Delivered</div>
                   <div className="font-bold text-sky-900 text-sm">{sessionInfo.actual_unit}</div>
                   <div className="text-xs text-sky-700">{sessionInfo.actual_topic}</div>
                   <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1">
                     <ThumbsUp className="w-3 h-3" /> 100% Match
                   </div>
                </div>
              </div>

              {/* Links & Evidence */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400"/> Instructor Notes & Classroom Evidence
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                     <div className="text-[11px] font-bold text-slate-600 mb-1">Teacher Pedagogical and Evaluation Notes</div>
                     <div className="text-sm font-medium text-slate-800 italic">"Students participated enthusiastically in bargaining roleplay, though still confused between 'thousand' vs 'hundred'."</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><FolderOpen className="w-4 h-4"/></div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Activity Evidence and Documentation Drive</div>
                        <div className="text-[10px] text-slate-400">3 Popup Market Immersive Photos</div>
                      </div>
                    </div>
                    <a href="#" className="text-xs font-bold text-sky-600 hover:underline">Inspect Link</a>
                  </div>
                </div>
              </div>

              {/* Feedback Input */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Academic Supervisory Feedback (Mandatory for BAP)</h4>
                <textarea 
                  className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all shadow-sm"
                  rows="3"
                  placeholder="Enter pedagogical recommendations for the teacher regarding reported issues..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setIsSuperviseModalOpen(false)}
                  className="px-6 py-3 rounded-2xl text-slate-500 hover:bg-slate-200 text-sm font-bold transition-colors cursor-pointer"
                >
                  Reject (Revision)
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-lg shadow-slate-900/20 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <ShieldAlert className="w-4 h-4 text-sky-400" />
                  Approve Official BAP (Supervision OK)
                </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUPERVISOR METRIC TABLE MODAL ================= */}
      {isMetricModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMetricModalOpen(false)}
          />

          <div className="relative w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30">
                      Quality Assurance and Academic Supervision   Even Semester 2026
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-slate-200">
                      Dra. Ratna Handayani, M.Hum.
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {activeMetricTab === 'endorsements' && 'Queue Table: 4 BAPs Awaiting Supervisory Endorsement'}
                    {activeMetricTab === 'deviations' && 'Curriculum Deviation Log: Realization vs Planned RPS (QA Monitoring)'}
                    {activeMetricTab === 'issues' && 'Learning Issues & Foreign Student Obstacles Log Table'}
                    {activeMetricTab === 'approved' && 'Archived Table: 34 Endorsed BAPs (Official Audit Trail)'}
                  </h2>
                  <div className="text-xs text-slate-300">
                    BIPA Center   Institut Teknologi Nasional Bandung
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMetricModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setActiveMetricTab('endorsements')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMetricTab === 'endorsements'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <BadgeAlert className="w-4 h-4" />
                  BAP Queue (4 BAP)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMetricTab('deviations')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMetricTab === 'deviations'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Syllabus Deviations (2 Deviations)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMetricTab('issues')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMetricTab === 'issues'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <MessageCircleWarning className="w-4 h-4" />
                  Pedagogical Issues (6 Cases)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMetricTab('approved')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMetricTab === 'approved'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                  Endorsed Sessions (34 Sessions)
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-slate-50/50">
              {/* TAB 1: PENDING ENDORSEMENTS TABLE */}
              {activeMetricTab === 'endorsements' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Awaiting Supervision Validation</div>
                      <div className="text-xl font-extrabold text-amber-600">4 Teaching Reports</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Attendance and dual signatures complete</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Top Priority</div>
                      <div className="text-xl font-extrabold text-slate-900">2 B1 Sessions</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">BAP submission deadline tonight</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs">
                      <div className="text-[10px] font-bold text-amber-900 uppercase">Average RPS Match</div>
                      <div className="text-base font-extrabold text-amber-950 mt-0.5">96.8% Alignment</div>
                      <div className="text-[10px] text-amber-700">Course quality standards fulfilled</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Level & Class</th>
                          <th className="px-4 py-3.5">Meeting</th>
                          <th className="px-4 py-3.5">Lead Teacher</th>
                          <th className="px-4 py-3.5">Class Date</th>
                          <th className="px-4 py-3.5 text-center">Dual-QR Status</th>
                          <th className="px-4 py-3.5 text-center">RPS Match</th>
                          <th className="px-4 py-3.5 text-right">Audit Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { cls: 'BIPA B1 — Conversation & Culture Class', meet: 'M. 4', teacher: 'Dra. Siti Rahmawati, M.Hum.', date: 'Today (26 Mar)', dualQr: meetingStatus === 'SIGNED' ? 'Dual-QR Valid' : 'Awaiting Teacher Sign', match: '100%', isCurrent: true },
                          { cls: 'BIPA A2 Elementary 2', meet: 'M. 4', teacher: 'Ahmad Subagja, M.Hum.', date: '25 Mar 2026', dualQr: 'Dual-QR Valid', match: '95%', isCurrent: false },
                          { cls: 'BIPA B2 — Grammar & Discourse', meet: 'M. 3', teacher: 'Dr. Maman Suryaman', date: '24 Mar 2026', dualQr: 'Dual-QR Valid', match: '96%', isCurrent: false },
                          { cls: 'BIPA C1 — Academic Indonesian', meet: 'M. 3', teacher: 'Dr. Maman Suryaman', date: '24 Mar 2026', dualQr: 'Dual-QR Valid', match: '94%', isCurrent: false }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-900">
                              {row.cls}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg text-xs font-bold font-mono">
                                {row.meet}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-slate-700 font-medium">
                              {row.teacher}
                            </td>
                            <td className="px-4 py-3.5 text-slate-600">
                              {row.date}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                row.dualQr === 'Dual-QR Valid' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {row.dualQr}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center font-bold text-emerald-700">
                              {row.match}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsMetricModalOpen(false);
                                  setIsSuperviseModalOpen(true);
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                              >
                                Open Audit and Sign 
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: DEVIATIONS TABLE */}
              {activeMetricTab === 'deviations' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm">2 Deviations Detected Between RPS Plan vs Actual Delivery</div>
                      <div className="text-[11px] text-rose-700 mt-0.5">The system identified topic divergence or milestone postponement by faculty.</div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-xs shrink-0">
                      QA Review Required
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Class & Level</th>
                          <th className="px-4 py-3.5">Meeting</th>
                          <th className="px-4 py-3.5">Planned RPS Topic</th>
                          <th className="px-4 py-3.5">Actual Delivery</th>
                          <th className="px-4 py-3.5 text-center">Deviation (%)</th>
                          <th className="px-4 py-3.5">Pedagogical Rationale</th>
                          <th className="px-4 py-3.5">Supervisory QA Recommendation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          {
                            cls: 'BIPA A1 — Fundamentals 1',
                            meet: 'M. 4',
                            rps: 'Unit 5: Directions & City Maps',
                            real: 'Unit 4: Advanced Number & Currency Drills',
                            dev: '18%',
                            reason: 'Students from Japan & Korea need additional reinforcement on tens of thousands vs hundreds of thousands currency denominations.',
                            rec: 'Approved for foundation reinforcement. Unit 5 schedule shifted to next meeting.'
                          },
                          {
                            cls: 'BIPA C1 — Academic Research',
                            meet: 'M. 3',
                            rps: 'Unit 3: Argumentative Paragraph Writing',
                            real: 'Unit 3: Critical Debate on Indonesian Forest Conservation',
                            dev: '12%',
                            reason: 'Instructor altered format to oral debate to build confidence in formal scholarly argumentation.',
                            rec: 'Highly effective contextual pedagogical approach. BAP endorsed without penalty.'
                          }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-rose-50/20 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-900">{row.cls}</td>
                            <td className="px-4 py-3.5 font-mono font-bold text-slate-700">{row.meet}</td>
                            <td className="px-4 py-3.5 text-slate-600">{row.rps}</td>
                            <td className="px-4 py-3.5 text-slate-800 font-medium">{row.real}</td>
                            <td className="px-4 py-3.5 text-center font-bold text-rose-700">{row.dev}</td>
                            <td className="px-4 py-3.5 text-slate-600 max-w-[220px] truncate" title={row.reason}>{row.reason}</td>
                            <td className="px-4 py-3.5 text-emerald-700 font-medium max-w-[220px] truncate" title={row.rec}>{row.rec}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: PEDAGOGICAL ISSUES TABLE */}
              {activeMetricTab === 'issues' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Pronunciation and Intonation</div>
                      <div className="text-xl font-extrabold text-amber-600">3 Reports</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Question vs flat pitch difficulty</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Grammar Morphology</div>
                      <div className="text-xl font-extrabold text-blue-600">2 Reports</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">mekan vs dikan affixes</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs">
                      <div className="text-[10px] font-bold text-emerald-800 uppercase">Cultural Adaptation</div>
                      <div className="text-base font-extrabold text-emerald-950 mt-0.5">1 Report</div>
                      <div className="text-[10px] text-emerald-700">Traditional market bargaining etiquette</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Issue Category</th>
                          <th className="px-4 py-3.5">Class & Level</th>
                          <th className="px-4 py-3.5">Reporting Faculty</th>
                          <th className="px-4 py-3.5">Impacted Group</th>
                          <th className="px-4 py-3.5">Linguistic Description</th>
                          <th className="px-4 py-3.5 text-right">QA Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { cat: 'Pronunciation Intonation', cls: 'BIPA A2 Elementary 2', teacher: 'Ahmad Subagja, M.Hum.', group: 'Students from Japan & Korea (4 students)', desc: 'Difficulty in polite question intonation vs command intonation', action: 'Provide audio drill module' },
                          { cat: 'Pronunciation Intonation', cls: 'BIPA B1 — Conversation', teacher: 'Dra. Siti Rahmawati, M.Hum.', group: 'Students from Europe (3 students)', desc: 'Nasal vowels and Indonesian trilled r pronunciation', action: 'Market roleplay drills' },
                          { cat: 'Grammar Affixation', cls: 'BIPA B2 — Grammar', teacher: 'Dr. Maman Suryaman', group: 'Students from Middle East (2 students)', desc: 'Confused between ke-an (noun) vs per-an', action: 'Provide morphology worksheet' },
                          { cat: 'Cultural Adaptation', cls: 'BIPA B1 — Conversation', teacher: 'Dra. Siti Rahmawati, M.Hum.', group: 'Entire B1 Cohort (15 students)', desc: 'Politeness norms when bargaining with local merchants', action: 'Field mission briefing' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5">
                              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-lg text-[10px]">
                                {row.cat}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-bold text-slate-900">{row.cls}</td>
                            <td className="px-4 py-3.5 text-slate-700">{row.teacher}</td>
                            <td className="px-4 py-3.5 text-slate-600">{row.group}</td>
                            <td className="px-4 py-3.5 text-slate-800 font-medium max-w-[240px] truncate" title={row.desc}>{row.desc}</td>
                            <td className="px-4 py-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => showToast(`Recommendation "${row.action}" forwarded to ${row.teacher}`)}
                                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                              >
                                Recommend Solution
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: APPROVED SESSIONS AUDIT TRAIL */}
              {activeMetricTab === 'approved' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm">34 Teaching Report Sessions Endorsed This Month March 2026</div>
                      <div className="text-[11px] text-sky-700 mt-0.5">All sessions have been verified fulfilling the 75% minimum attendance threshold and bearing valid tripartite digital signatures.</div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-sky-600 text-white font-bold text-xs shrink-0">
                      Legal Compliance Verified
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">BAP Registration No</th>
                          <th className="px-4 py-3.5">Class & Level</th>
                          <th className="px-4 py-3.5">Meeting</th>
                          <th className="px-4 py-3.5">Lead Teacher</th>
                          <th className="px-4 py-3.5">Endorsement Timestamp</th>
                          <th className="px-4 py-3.5 text-center">Audit Status</th>
                          <th className="px-4 py-3.5 text-right">Document Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { no: 'BAP/BIPA/2026/03/034', cls: 'BIPA B1 — Conversation & Culture', meet: 'M. 3', teacher: 'Dra. Siti Rahmawati, M.Hum.', time: '20 Mar 2026, 14:15 WIB', status: 'VERIFIED_LEGAL' },
                          { no: 'BAP/BIPA/2026/03/033', cls: 'BIPA A2 Elementary 2', meet: 'M. 3', teacher: 'Ahmad Subagja, M.Hum.', time: '19 Mar 2026, 16:30 WIB', status: 'VERIFIED_LEGAL' },
                          { no: 'BAP/BIPA/2026/03/032', cls: 'BIPA A1 — Fundamentals 1 (Class A)', meet: 'M. 4', teacher: 'Pak Andi Wijaya', time: '19 Mar 2026, 12:00 WIB', status: 'VERIFIED_LEGAL' },
                          { no: 'BAP/BIPA/2026/03/031', cls: 'BIPA B2 — Grammar Structure', meet: 'M. 3', teacher: 'Dr. Maman Suryaman', time: '18 Mar 2026, 15:40 WIB', status: 'VERIFIED_LEGAL' },
                          { no: 'BAP/BIPA/2026/03/030', cls: 'BIPA B1 — Conversation & Culture', meet: 'M. 2', teacher: 'Dra. Siti Rahmawati, M.Hum.', time: '17 Mar 2026, 13:20 WIB', status: 'VERIFIED_LEGAL' },
                          { no: 'BAP/BIPA/2026/03/029', cls: 'BIPA Culture — Gamelan Arts', meet: 'M. 2', teacher: 'Ki Dalang Suwondo', time: '16 Mar 2026, 17:00 WIB', status: 'VERIFIED_LEGAL' },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5 font-mono font-bold text-slate-800">{row.no}</td>
                            <td className="px-4 py-3.5 font-bold text-slate-900">{row.cls}</td>
                            <td className="px-4 py-3.5 font-bold text-slate-700">{row.meet}</td>
                            <td className="px-4 py-3.5 text-slate-600">{row.teacher}</td>
                            <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">{row.time}</td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                                3 Valid QRs
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => showToast(`Downloading official PDF document ${row.no}...`)}
                                className="text-sky-600 hover:underline font-bold text-xs cursor-pointer flex items-center justify-end gap-1 ml-auto"
                              >
                                <Download className="w-3.5 h-3.5" /> Download PDF
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Official Teaching Reports (BAP) are legally binding pursuant to Rector's Decree No. 2026/BIPA-QA.
              </span>
              <button
                type="button"
                onClick={() => setIsMetricModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUPERVISOR PEDAGOGICAL MONITORING TABLE MODAL ================= */}
      {isPedagogicalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsPedagogicalModalOpen(false)}
          />

          <div className="relative w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/30">
                      Field Supervision & Teaching Quality Monitoring
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-slate-200">
                      Dra. Ratna Handayani, M.Hum.
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    Class Dynamics & Faculty Pedagogical Observations Log Table
                  </h2>
                  <div className="text-xs text-slate-300">
                    BIPA Center   Institut Teknologi Nasional Bandung — Real-Time Student Learning Obstacles and QA Recommendations
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPedagogicalModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800/80">
                {[
                  { key: 'ALL', label: `All Categories (${totalLogs})` },
                  { key: 'PRONUNCIATION', label: `Pronunciation and Intonation (${pronunciationCount})` },
                  { key: 'GRAMMAR', label: `Grammar / Morphology (${grammarCount})` },
                  { key: 'CULTURE', label: `Cultural Adaptation (${cultureCount})` },
                  { key: 'METHOD', label: `Methodology & Practice (${methodCount})` }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setPedagogicalFilter(item.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      pedagogicalFilter === item.key
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-slate-50/50">
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total Field Observations</div>
                  <div className="text-xl font-extrabold text-slate-900">{totalLogs} Reports</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Submitted by faculty this week</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Solutions Applied</div>
                  <div className="text-xl font-extrabold text-emerald-950">{resolvedLogs} Resolved</div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">Material and method recommendations dispatched</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs">
                  <div className="text-[10px] font-bold text-amber-900 uppercase">Under Supervision</div>
                  <div className="text-xl font-extrabold text-amber-950">{underSupervisionLogs} Active Cases</div>
                  <div className="text-[10px] text-amber-700 mt-0.5">Follow up observation scheduled next session</div>
                </div>
              </div>

              {/* Main Log Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                  <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5">ID & Time</th>
                      <th className="px-4 py-3.5">Class & Meeting</th>
                      <th className="px-4 py-3.5">Lead Teacher</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Target Group</th>
                      <th className="px-4 py-3.5">Teacher Problem Note</th>
                      <th className="px-4 py-3.5">Supervisory QA Recommendation</th>
                      <th className="px-4 py-3.5 text-center">Status</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs
                      .filter((log) => pedagogicalFilter === 'ALL' || log.category === pedagogicalFilter)
                      .map((log) => (
                        <tr key={log.id} className="hover:bg-amber-50/20 transition-colors">
                          <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                            <span className="block text-slate-900">{log.id}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{log.date}   {log.time}</span>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            <div>{log.cls}</div>
                            <span className="inline-block mt-0.5 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">
                              {log.session}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-800">
                            {log.teacher}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {log.catLabel}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">
                            {log.targetGroup}
                          </td>
                          <td className="px-4 py-3.5 text-slate-800 italic max-w-[260px] truncate" title={log.quote}>
                            {log.quote}
                          </td>
                          <td className="px-4 py-3.5 text-emerald-800 font-medium max-w-[260px] truncate" title={log.recommendation}>
                            {log.recommendation}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              log.status === 'RESOLVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {log.statusLabel}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right space-x-2">
                            {log.status === 'RESOLVED' ? (
                              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs inline-block">
                                Resolved
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRespondLog(log.id, log.teacher)}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
                              >
                                Respond
                              </button>
                            )}
                            <a
                              href={log.driveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors inline-block"
                              title="Open Recording / Evidence in Drive"
                            >
                              Drive
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Field Dynamics Logs are evaluated weekly for curriculum quality audits and BIPA certification.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Exporting all pedagogical log history to CSV & PDF...')}
                  className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download Log Report
                </button>
                <button
                  type="button"
                  onClick={() => setIsPedagogicalModalOpen(false)}
                  className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= DARMASISWA ITENAS OFFICIAL REPORT MODAL ================= */}
      {isItenasReportModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={() => setIsItenasReportModalOpen(false)}
          />
          <div className="relative w-full max-w-6xl bg-slate-50 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[95vh] z-10 custom-scrollbar border border-slate-200">
            <div className="mb-4 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Lembar Rekapitulasi Presensi Resmi (Kop Surat Resmi Itenas Bandung) — Mode Supervisor
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsItenasReportModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
            <DarmasiswaRecapReport
              onBack={() => setIsItenasReportModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
