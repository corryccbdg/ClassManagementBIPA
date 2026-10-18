import React, { useState, useEffect } from 'react';
import AttendanceManagerTable from './attendance/AttendanceManagerTable';
import TeacherSignPadModal from './attendance/TeacherSignPadModal';
import { initialCourses } from '../data/coursesData';
import {
  LayoutGrid,
  Calendar as CalendarIcon,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Bell,
  Clock,
  MapPin,
  User,
  ExternalLink,
  FolderOpen,
  Headphones,
  Camera,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  PenTool,
  Award,
  Sparkles,
  Gamepad2,
  Folder,
  ShieldCheck,
  Users,
  Video,
  X,
  Check,
  Eye,
  Download,
  Filter,
  Layers,
  Play,
  Pause,
  Volume2
} from 'lucide-react';

export default function TeacherDashboard({
  currentUser,
  sessionInfo,
  students,
  attendances,
  onStatusChange,
  onNoteChange,
  onMarkAllPresent,
  teacherSignData,
  studentRepSignData,
  meetingStatus,
  onTeacherSignComplete,
  onSupervisorApprove,
  onLogout,
  onSwitchToStudentView,
  // Darmasiswa shared state
  darmasiswaSessions,
  onDarmasiswaFacilitatorSign,
  courses: propCourses,
}) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'history'
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDate, setActiveDate] = useState(26);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);

  // Synchronized Courses & Syllabus State (1:1 with Student & Coordinator)
  const [coursesList, setCoursesList] = useState(() => propCourses || initialCourses);
  useEffect(() => {
    if (propCourses && propCourses.length > 0) {
      setCoursesList(propCourses);
    }
  }, [propCourses]);

  const [selectedSyllabusCourse, setSelectedSyllabusCourse] = useState(null);
  const [syllabusSearch, setSyllabusSearch] = useState('');
  const [syllabusFilterLevel, setSyllabusFilterLevel] = useState('ALL');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(30);
  const [audioSpeed, setAudioSpeed] = useState('1.0x');

  const filteredSyllabusCourses = (coursesList || []).filter((course) => {
    const matchesLevel =
      syllabusFilterLevel === 'ALL' ||
      (course.level && course.level.toUpperCase().includes(syllabusFilterLevel.toUpperCase()));
    const q = (syllabusSearch || '').toLowerCase();
    const matchesQuery =
      !q ||
      course.title?.toLowerCase().includes(q) ||
      course.description?.toLowerCase().includes(q) ||
      course.bookTitle?.toLowerCase().includes(q) ||
      course.category?.toLowerCase().includes(q) ||
      course.unitTitle?.toLowerCase().includes(q) ||
      course.grammarFocus?.toLowerCase().includes(q) ||
      course.topics?.some((t) => t.toLowerCase().includes(q)) ||
      course.vocabularies?.some((v) => v.term.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q));
    return matchesLevel && matchesQuery;
  });
  const [calendarMonthIndex, setCalendarMonthIndex] = useState(2);
  const months = ['January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026'];

  const activeTeacherName = currentUser?.name || sessionInfo?.teacherName || 'Dra. Siti Rahmawati, M.Hum.';
  const activeTeacherNip = currentUser?.nip || currentUser?.identifier || '198704122015052001';

  // Table Modal States for Teacher Cards
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [activeMetricTab, setActiveMetricTab] = useState('schedule'); // 'schedule' | 'curriculum' | 'pendingBap'
  const [isClassDetailModalOpen, setIsClassDetailModalOpen] = useState(false);
  const [activeRosterTab, setActiveRosterTab] = useState('roster'); // 'roster' | 'rps' | 'logbook'
  const [isTeacherDriveModalOpen, setIsTeacherDriveModalOpen] = useState(false);
  const [scheduleFilter, setScheduleFilter] = useState('ALL');

  const [logbookForm, setLogbookForm] = useState({
    startTime: '10:00',
    endTime: '11:40',
    topic: 'Unit 4: Bargaining in Traditional Markets & Shopping Etiquette',
    narration: 'Students carried out market transaction roleplays in the BIPA Popup Market using replica mock rupiah currency.',
    pedagogicalNotes: 'Persuasive intonation was commendable; additional reinforcement drills on currency classifiers recommended.',
    driveLink: 'https://drive.google.com'
  });

  const handleSaveLogbook = (e) => {
    if (e) e.preventDefault();
    showToast('Teaching execution logbook saved successfully!');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Darmasiswa sign-off state
  const [isDarmasiswaPanelOpen, setIsDarmasiswaPanelOpen] = useState(false);
  const [darmasiswaForm, setDarmasiswaForm] = useState({
    dayDate: new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
    material: '',
    facilitatorName: activeTeacherName,
    facilitatorNip: activeTeacherNip,
  });
  const [darmasiswaSubmitted, setDarmasiswaSubmitted] = useState(false);

  const handleDarmasiswaSubmit = (e) => {
    e.preventDefault();
    if (!darmasiswaForm.material.trim()) return;
    if (!onDarmasiswaFacilitatorSign) {
      showToast('Darmasiswa feature is not available in this mode.');
      return;
    }
    const nextNo = (darmasiswaSessions?.length ?? 0) + 1;
    const newSession = {
      id: `sesi-${Date.now()}`,
      no: nextNo,
      dayDate: darmasiswaForm.dayDate,
      dateIso: new Date().toISOString().split('T')[0],
      material: darmasiswaForm.material,
      facilitatorName: darmasiswaForm.facilitatorName || activeTeacherName,
      facilitatorNip: darmasiswaForm.facilitatorNip || activeTeacherNip,
      facilitatorSigned: true,
      facilitatorSignTime: new Date().toLocaleString('en-US') + ' WIB',
      attendances: {},
    };
    onDarmasiswaFacilitatorSign(newSession);
    setDarmasiswaSubmitted(true);
    showToast('Darmasiswa session recorded & submitted to Coordinator successfully!');
    setIsDarmasiswaPanelOpen(false);
    setDarmasiswaForm({
      dayDate: new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
      material: '',
      facilitatorName: activeTeacherName,
      facilitatorNip: activeTeacherNip,
    });
  };

  const counts = {
    PRESENT: Object.values(attendances).filter((a) => a.status === 'PRESENT').length,
    EXCUSED: Object.values(attendances).filter((a) => a.status === 'EXCUSED').length,
    LATE: Object.values(attendances).filter((a) => a.status === 'LATE').length,
    ABSENT: Object.values(attendances).filter((a) => a.status === 'ABSENT').length,
  };

  const calendarDays = [
    { day: 'Mon', date: 23 },
    { day: 'Tue', date: 24 },
    { day: 'Wed', date: 25 },
    { day: 'Thu', date: 26 },
    { day: 'Fri', date: 27 },
    { day: 'Sat', date: 28 },
    { day: 'Sun', date: 29 },
  ];

  return (
    <div className="min-h-screen bg-[#e3e2fc] p-3 sm:p-5 lg:p-8 flex items-center justify-center font-sans antialiased text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-indigo-600 text-white shadow-xl text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main App Container Card */}
      <div className="w-full max-w-[1440px] bg-white rounded-[36px] sm:rounded-[44px] shadow-[0_25px_70px_rgba(115,105,245,0.15)] border border-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 relative overflow-hidden">
        {/* ================= MAIN CONTENT DASHBOARD ================= */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
          {/* TOP BAR: Search & User Header */}
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-20 py-2">
            {/* Rounded Pill Search Bar */}
            <div className="w-full sm:max-w-md relative">
              <div className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white border border-slate-200/80 rounded-full px-4 py-2.5 transition-all shadow-sm">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search BAP, students, or class schedule..."
                  className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-normal"
                />
              </div>
            </div>

            {/* Right Profile & Actions */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                title="Google Drive Storage"
              >
                <Folder className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2.5 right-2.5 border-2 border-white" />
              </button>

              {/* User Avatar & Name */}
              <div className="flex items-center gap-3 pl-2">
                <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center shadow-sm text-lg">
                  {currentUser?.avatar || <User className="w-5 h-5 text-indigo-600" />}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{activeTeacherName}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{currentUser?.title || `NIP NIDN ${activeTeacherNip}`}</div>
                </div>
              </div>
            </div>
          </header>

          {/* FULL WIDTH CONTENT AREA */}
          <div className="space-y-6 pb-24">
            {/* 1. HERO BANNER: Today's Session Card */}
            <section className="relative rounded-[32px] bg-[#d7d5fc] p-6 sm:p-8 overflow-hidden shadow-sm border border-indigo-100/50">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="space-y-4 max-w-lg text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm text-indigo-950 text-xs font-bold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Current Teaching Session
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {sessionInfo.className}
                  </h2>

                  {/* Class Details Badge Row */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl shadow-xs">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {sessionInfo.start_time} - {sessionInfo.end_time} WIB
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl shadow-xs">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      {sessionInfo.room}
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl shadow-xs">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      Meeting 4 (Week 3)
                    </span>
                  </div>
                  
                  <div className="p-3 bg-white/50 rounded-xl mt-2 border border-white/60 space-y-1">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      {sessionInfo.actual_unit}: {sessionInfo.actual_topic}
                    </div>
                    <div className="text-[11px] text-slate-600 pl-4">Focus Persuasive intonation tens of thousands numbers classifier words</div>
                    <div className="text-[11px] text-slate-600 pl-4 italic">Game Idea: Roleplay 'BIPA Popup Market' using replica mock currency.</div>
                  </div>

                  {/* CTA Actions */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="inline-flex items-center gap-2 bg-[#1b1c20] hover:bg-[#28292e] text-white text-xs font-semibold px-5 py-3 rounded-full shadow-md shadow-slate-900/15 transition-all cursor-pointer active:scale-95"
                    >
                      <PenTool className="w-4 h-4 text-purple-300" />
                      Record Attendance & Logbook
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsClassDetailModalOpen(true)}
                      className="inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-semibold px-5 py-3 rounded-full shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <Users className="w-4 h-4 text-indigo-600" />
                      Student Roster Details (Table)
                    </button>
                    <button
                      onClick={() => setIsSyllabusModalOpen(true)}
                      className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold px-5 py-3 rounded-full shadow-sm transition-all cursor-pointer active:scale-95"
                    >
                      <FileText className="w-4 h-4 text-slate-500" />
                      View Full Syllabus
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. METRICS WIDGETS */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Today's Teaching Schedule */}
              <div
                onClick={() => {
                  setActiveMetricTab('schedule');
                  setIsMetricModalOpen(true);
                }}
                className="rounded-3xl bg-[#c8c5fa] p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
                    <CalendarIcon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 bg-white/70 px-2 py-0.5 rounded-full">
                    2 Classes Today
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">Today's Teaching Schedule</h4>
                    <span className="text-[10px] font-bold text-indigo-700 bg-white/80 group-hover:bg-white px-2 py-0.5 rounded-full flex items-center gap-0.5 transition-colors shadow-xs">
                      Detail Table 
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700 mt-1">
                    Next: 13:00 BIPA B2<br/>Room 205
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-800 pt-1 border-t border-slate-900/10">
                  <span>Teaching Status</span>
                  <span className="text-emerald-800 font-extrabold text-xs">1 Active   1 Upcoming</span>
                </div>
              </div>

              {/* Curriculum Progress */}
              <div
                onClick={() => {
                  setActiveMetricTab('curriculum');
                  setIsMetricModalOpen(true);
                }}
                className="rounded-3xl bg-[#fed68f] p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5 text-amber-300" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 bg-white/70 px-2 py-0.5 rounded-full">
                    4/16 Sessions
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">Curriculum / Syllabus Progress</h4>
                    <span className="text-[10px] font-bold text-amber-900 bg-white/80 group-hover:bg-white px-2 py-0.5 rounded-full flex items-center gap-0.5 transition-colors shadow-xs">
                      Detail Table 
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700 mt-0.5">Meeting 4 Completed</div>
                  <div className="w-full bg-white/60 h-2 rounded-full overflow-hidden mt-3">
                    <div className="bg-slate-900 h-full rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-800 pt-1 border-t border-slate-900/10">
                  <span>16 Sessions Target</span>
                  <span className="text-sm font-extrabold text-amber-950">25% Reached</span>
                </div>
              </div>

              {/* Pending BAP */}
              <div
                onClick={() => {
                  setActiveMetricTab('pendingBap');
                  setIsMetricModalOpen(true);
                }}
                className="rounded-3xl bg-[#ffa6d5] p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-5 h-5 text-pink-300" />
                  </div>
                  <span className="text-[11px] font-bold text-white bg-pink-600 px-2 py-0.5 rounded-full animate-pulse">
                    1 Pending
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">Pending BAP Sign-Off</h4>
                    <span className="text-[10px] font-bold text-pink-900 bg-white/80 group-hover:bg-white px-2 py-0.5 rounded-full flex items-center gap-0.5 transition-colors shadow-xs">
                      Detail Table 
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700 mt-0.5">
                    Current session is not yet finalized. Complete attendance promptly.
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-800 pt-1 border-t border-slate-900/10">
                  <span>Teaching Report Validation</span>
                  <span className="text-xs font-bold text-pink-900">Teacher Action Required</span>
                </div>
              </div>
            </section>

            {/* 3. TABS CONTENT AREA */}
            <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-4 sm:p-6 overflow-hidden">
              {/* TABS HEADER */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-4 overflow-x-auto custom-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab('attendance')}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === 'attendance'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Attendance & Logbook Checklist
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    activeTab === 'history'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Execution History
                </button>
              </div>

              {/* TAB 1: ATTENDANCE CHECKLIST */}
              {activeTab === 'attendance' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Brief Logbook Form */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4 mb-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Learning Delivery Realization (Logbook)</h4>
                        <div className="text-[10px] text-slate-500">Complete class execution details prior to generating the Official Report BAP</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Execution Time */}
                      <div className="flex flex-col gap-1.5">
                         <label className="text-xs font-bold text-slate-700">Actual Class Execution Time (Start - End)</label>
                         <div className="flex items-center gap-2">
                           <input
                             type="time"
                             value={logbookForm.startTime}
                             onChange={(e) => setLogbookForm(prev => ({ ...prev, startTime: e.target.value }))}
                             className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:border-indigo-500 outline-none transition-colors"
                           />
                           <span className="text-slate-400">-</span>
                           <input
                             type="time"
                             value={logbookForm.endTime}
                             onChange={(e) => setLogbookForm(prev => ({ ...prev, endTime: e.target.value }))}
                             className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:border-indigo-500 outline-none transition-colors"
                           />
                         </div>
                      </div>

                      {/* Covered Topic */}
                      <div className="flex flex-col gap-1.5">
                         <label className="text-xs font-bold text-slate-700">Actual Unit & Topic Covered</label>
                         <input
                           type="text"
                           value={logbookForm.topic}
                           onChange={(e) => setLogbookForm(prev => ({ ...prev, topic: e.target.value }))}
                           className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:border-indigo-500 outline-none transition-colors"
                           placeholder="e.g., Unit 4: Bargaining in Traditional Markets"
                         />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Activity Narrative */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Session Narrative / Class Activities</label>
                        <textarea
                          value={logbookForm.narration}
                          onChange={(e) => setLogbookForm(prev => ({ ...prev, narration: e.target.value }))}
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white outline-none transition-colors"
                          rows="3"
                          placeholder="Describe class progression, student activities, etc..."
                        />
                      </div>
                      
                      {/* Pedagogical Notes */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700 flex justify-between">
                          Pedagogical / Evaluation Notes <span className="text-slate-400 font-normal text-[10px]">(Reviewed by QA)</span>
                        </label>
                        <textarea
                          value={logbookForm.pedagogicalNotes}
                          onChange={(e) => setLogbookForm(prev => ({ ...prev, pedagogicalNotes: e.target.value }))}
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white outline-none transition-colors"
                          rows="3"
                          placeholder="Notes on pacing, student pronunciation, method recommendations..."
                        />
                      </div>
                    </div>

                    {/* Media Link */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Media Link / Immersive Photos (Google Drive)</label>
                      <input
                        type="url"
                        value={logbookForm.driveLink}
                        onChange={(e) => setLogbookForm(prev => ({ ...prev, driveLink: e.target.value }))}
                        placeholder="https://drive.google.com/..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:border-indigo-500 outline-none transition-colors"
                      />
                    </div>

                    {/* Submit Logbook Button */}
                    <div className="flex justify-end pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleSaveLogbook}
                        className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Save Learning Delivery (Logbook)
                      </button>
                    </div>
                  </div>

                  <AttendanceManagerTable
                    students={students}
                    attendances={attendances}
                    onStatusChange={onStatusChange}
                    onNoteChange={onNoteChange}
                    onMarkAllPresent={onMarkAllPresent}
                    disabled={meetingStatus === 'SUPERVISOR_APPROVED'}
                  />

                  {/* Bottom Action Footer for Teacher */}
                  <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-600">
                      <div className="font-bold text-slate-900">
                        Attendance Recap: {counts.PRESENT} Present, {counts.EXCUSED} Excused, {counts.LATE} Late, {counts.ABSENT} Absent
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Click the button on the right to verify and sign off on this session.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsTeacherModalOpen(true)}
                      className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
                    >
                      <PenTool className="w-4 h-4 text-indigo-200" />
                      {teacherSignData ? 'Update Teacher Signature' : 'Sign Session & Issue QR'}
                    </button>
                  </div>

                  {/* ── DARMASISWA SIGN-OFF PANEL ────────────────────────────── */}
                  {onDarmasiswaFacilitatorSign && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 overflow-hidden">
                      {/* Panel Header */}
                      <button
                        type="button"
                        onClick={() => setIsDarmasiswaPanelOpen((v) => !v)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-emerald-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                            D
                          </span>
                          <div>
                            <span className="text-xs font-bold text-emerald-900">Record Darmasiswa Session</span>
                            {darmasiswaSubmitted && (
                              <span className="ml-2 text-[10px] text-emerald-600 font-semibold">Submitted to Coordinator</span>
                            )}
                          </div>
                        </div>
                        <span className="text-emerald-600 text-xs font-bold">
                          {isDarmasiswaPanelOpen ? '▲ Close' : '▼ Open'}
                        </span>
                      </button>

                      {isDarmasiswaPanelOpen && (
                        <form onSubmit={handleDarmasiswaSubmit} className="px-4 pb-4 pt-2 space-y-3 border-t border-emerald-200">
                          <div className="text-[11px] text-emerald-700">
                            Fill out this form after the Darmasiswa session finishes. Data will appear immediately in the Coordinator's Darmasiswa Attendance table.
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Day & Date</label>
                            <input
                              type="text"
                              required
                              value={darmasiswaForm.dayDate}
                              onChange={(e) => setDarmasiswaForm({ ...darmasiswaForm, dayDate: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:border-emerald-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Topic / Class Activities</label>
                            <textarea
                              required
                              rows="2"
                              value={darmasiswaForm.material}
                              onChange={(e) => setDarmasiswaForm({ ...darmasiswaForm, material: e.target.value })}
                              placeholder="Description of topic or activities conducted today..."
                              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:border-emerald-500 outline-none resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">Facilitator Name</label>
                              <select
                                value={darmasiswaForm.facilitatorName}
                                onChange={(e) => setDarmasiswaForm({ ...darmasiswaForm, facilitatorName: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:border-emerald-500 outline-none cursor-pointer"
                              >
                                <option>Dra. Siti Rahmawati, M.Hum.</option>
                                <option>Dianita, S.S., M.Hum.</option>
                                <option>Iis Tjuhartika Pandi, S.Psi.</option>
                                <option>Siti Sopiah, S.S., M.Pd.</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP/NIDN</label>
                              <input
                                type="text"
                                value={darmasiswaForm.facilitatorNip}
                                onChange={(e) => setDarmasiswaForm({ ...darmasiswaForm, facilitatorNip: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 font-mono focus:border-emerald-500 outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setIsDarmasiswaPanelOpen(false)}
                              className="px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 active:scale-95"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Sign & Submit to Coordinator
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: HISTORY (Simulation Table) */}
              {activeTab === 'history' && (
                <div className="animate-in fade-in duration-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700">Previous Meetings Official Report BAP History</h4>
                    <span className="text-[11px] text-slate-400">Total 2 Approved Reports</span>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-xs font-bold text-slate-800 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Meeting</th>
                          <th className="px-4 py-3">Date & Time</th>
                          <th className="px-4 py-3">Unit/Topic</th>
                          <th className="px-4 py-3">Attendance</th>
                          <th className="px-4 py-3">BAP Status</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="bg-white hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-900">Meeting 3</td>
                          <td className="px-4 py-3 text-xs">Tuesday, 24 Mar 2026<br/>10:00 - 11:30 WIB</td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-800">Unit 3: Numbers, Currency & Time</td>
                          <td className="px-4 py-3 text-xs font-bold text-emerald-600">100% Present (15/15)</td>
                          <td className="px-4 py-3">
                            <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Approved</span>
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => showToast('Downloading Meeting 3 BAP (PDF)...')}
                              className="text-indigo-600 hover:text-indigo-800 text-xs font-bold cursor-pointer hover:underline"
                            >
                              Download PDF
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab('attendance')}
                              className="text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer hover:underline"
                            >
                              View Document
                            </button>
                          </td>
                        </tr>
                        <tr className="bg-white hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-900">Meeting 2</td>
                          <td className="px-4 py-3 text-xs">Thursday, 19 Mar 2026<br/>10:00 - 11:30 WIB</td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-800">Unit 2: Advanced Introductions & Culture</td>
                          <td className="px-4 py-3 text-xs font-bold text-emerald-600">93% Present (14/15)</td>
                          <td className="px-4 py-3">
                            <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Approved</span>
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => showToast('Downloading Meeting 2 BAP (PDF)...')}
                              className="text-indigo-600 hover:text-indigo-800 text-xs font-bold cursor-pointer hover:underline"
                            >
                              Download PDF
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab('attendance')}
                              className="text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer hover:underline"
                            >
                              View Document
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ====== RIGHT COLUMN (4 COLS) ====== */}
          <div className="xl:col-span-4 space-y-6">
            {/* 1. MINI CALENDAR WIDGET */}
            <div className="rounded-[32px] bg-slate-50 border border-slate-100 p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCalendarMonthIndex((prev) => (prev > 0 ? prev - 1 : months.length - 1))}
                    className="p-1.5 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {months[calendarMonthIndex]}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCalendarMonthIndex((prev) => (prev < months.length - 1 ? prev + 1 : 0))}
                    className="p-1.5 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMetricTab('schedule');
                    setIsMetricModalOpen(true);
                  }}
                  className="text-[10px] font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-full flex items-center gap-0.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  Schedule Table 
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((item) => (
                  <div
                    key={item.date}
                    onClick={() => {
                      setActiveDate(item.date);
                      setActiveMetricTab('schedule');
                      setIsMetricModalOpen(true);
                    }}
                    className={`py-2 px-1 rounded-2xl flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      activeDate === item.date
                        ? 'bg-[#c6c3fa] text-slate-900 font-extrabold shadow-sm'
                        : 'hover:bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      {item.day}
                    </span>
                    <span className="text-xs sm:text-sm font-bold">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* COMPACT WIDGETS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 2. PENDING SIGN-OFF ALERT / STATUS ACTION CARD */}
              <div className="rounded-[32px] bg-white border-2 border-indigo-200/70 p-5 sm:p-6 space-y-4 shadow-lg shadow-indigo-100/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-bl-full pointer-events-none" />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    BAP Status
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMetricTab('pendingBap');
                        setIsMetricModalOpen(true);
                      }}
                      className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-0.5 transition-colors cursor-pointer"
                    >
                      Detail Table 
                    </button>
                    {studentRepSignData ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete
                      </span>
                    ) : teacherSignData ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        Awaiting Student
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Unsigned
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                    Dual Signoff Verification (QR)
                  </h4>
                  <div className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Each session requires digital verification from both the Faculty and the Student Representative to generate an Official Report BAP
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Teacher Sign Status */}
                  <div className={`p-3 rounded-2xl flex items-center gap-3 border ${teacherSignData ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${teacherSignData ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <PenTool className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${teacherSignData ? 'text-emerald-900' : 'text-slate-700'}`}>Faculty Signature</div>
                      <div className={`text-[10px] ${teacherSignData ? 'text-emerald-700' : 'text-slate-500'}`}>{teacherSignData ? `Completed ${teacherSignData.signedAt}` : 'Not yet signed'}</div>
                    </div>
                  </div>
                  
                  {/* Student Rep Sign Status */}
                  <div className={`p-3 rounded-2xl flex items-center gap-3 border ${studentRepSignData ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${studentRepSignData ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${studentRepSignData ? 'text-emerald-900' : 'text-slate-700'}`}>Student Rep Signature</div>
                      <div className={`text-[10px] ${studentRepSignData ? 'text-emerald-700' : 'text-slate-500'}`}>{studentRepSignData ? `Completed ${studentRepSignData.signedAt}` : 'Not yet signed'}</div>
                    </div>
                  </div>
                </div>

                {!teacherSignData && (
                  <button
                    type="button"
                    onClick={() => setIsTeacherModalOpen(true)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                  >
                    Sign Session Now
                  </button>
                )}
              </div>

              {/* 3. QUICK DRIVE SHORTCUTS */}
              <div className="rounded-[32px] bg-slate-50 border border-slate-100 p-5 sm:p-6 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-indigo-600" />
                    Teaching Drive Folders
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsTeacherDriveModalOpen(true)}
                    className="text-[10px] font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-full flex items-center gap-0.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    Detail Table 
                  </button>
                </div>

                <div className="space-y-2.5">
                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-indigo-50/50 border border-slate-200/60 shadow-xs hover:border-indigo-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Folder className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Course Modules and Materials</div>
                        <div className="text-[11px] text-slate-400">SitiRahmawati_BIPA_B1</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </a>

                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-pink-50/50 border border-slate-200/60 shadow-xs hover:border-pink-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Activity Documentation Archive</div>
                        <div className="text-[11px] text-slate-400">Field Mission and Roleplay Proofs</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600 transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Signature Modal */}
      <TeacherSignPadModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onSignComplete={(data) => {
          onTeacherSignComplete(data);
          showToast('Faculty signature issued successfully!');
        }}
        sessionInfo={sessionInfo}
        attendances={attendances}
        students={students}
        teacherName={sessionInfo.teacherName}
      />

      {/* ================= TEACHER METRIC TABLE MODAL ================= */}
      {isMetricModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMetricModalOpen(false)}
          />

          <div className="relative w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      Faculty Portal   Even Semester 2026
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      {sessionInfo.teacherName}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {activeMetricTab === 'schedule' && 'Teaching Schedule & Class Agenda Table'}
                    {activeMetricTab === 'curriculum' && 'Syllabus & Curriculum Completion Table (16 Meetings)'}
                    {activeMetricTab === 'pendingBap' && 'Teaching Report (BAP) Backlog & Validation Table'}
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
                  onClick={() => setActiveMetricTab('schedule')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMetricTab === 'schedule'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  Teaching Schedule (2 Classes Today)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMetricTab('curriculum')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMetricTab === 'curriculum'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Curriculum Progress (4/16 Done)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMetricTab('pendingBap')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMetricTab === 'pendingBap'
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  BAP Backlog (1 Action Required)
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-slate-50/50">
              {/* TAB 1: TEACHING SCHEDULE TABLE */}
              {activeMetricTab === 'schedule' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Today's Class Load</div>
                      <div className="text-xl font-extrabold text-indigo-600">2 Sessions <span className="text-xs font-bold text-slate-400">of 5 Teaching Hours</span></div>
                      <div className="text-[10px] text-slate-500 mt-0.5">BIPA B1 Morning and BIPA B2 Afternoon</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Total Enrolled Students</div>
                      <div className="text-xl font-extrabold text-slate-900">27 Students</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">From 15 Partner Countries</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 shadow-xs">
                      <div className="text-[10px] font-bold text-indigo-900 uppercase">Active Session</div>
                      <div className="text-sm font-extrabold text-indigo-950 mt-0.5">BIPA B1 Conversation and Culture</div>
                      <div className="text-[10px] text-indigo-700">09:00 to 11:30 WIB Room 102</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Time & Day</th>
                          <th className="px-4 py-3.5">Class Name & Code</th>
                          <th className="px-4 py-3.5">BIPA Level</th>
                          <th className="px-4 py-3.5">Room</th>
                          <th className="px-4 py-3.5 text-center">Students</th>
                          <th className="px-4 py-3.5">Session</th>
                          <th className="px-4 py-3.5 text-center">Status</th>
                          <th className="px-4 py-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          {
                            time: 'Today, 09:00 - 11:30 WIB',
                            className: 'BIPA B1 Conversation and Culture Class',
                            code: 'CLS-B1-04',
                            level: 'B1 Intermediate',
                            room: 'Cultural Room 102',
                            studentsCount: 15,
                            session: 'Meeting 4/16',
                            status: 'ACTIVE',
                            topic: 'Unit 4: Bargaining in Traditional Markets'
                          },
                          {
                            time: 'Today, 13:00 - 15:30 WIB',
                            className: 'BIPA B2 — Grammar & Discourse',
                            code: 'CLS-B2-02',
                            level: 'B2 Upper-Int',
                            room: 'Cultural Room 205',
                            studentsCount: 12,
                            session: 'Meeting 4/16',
                            status: 'UPCOMING',
                            topic: 'Unit 4: Discourse Structure & Affixes Ber-kan'
                          },
                          {
                            time: 'Friday, 08:30 - 11:00 WIB',
                            className: 'BIPA A1 — Vocabulary Fundamentals',
                            code: 'CLS-A1-01',
                            level: 'A1 Beginner',
                            room: 'Language Lab 1',
                            studentsCount: 18,
                            session: 'Meeting 5/16',
                            status: 'SCHEDULED',
                            topic: 'Unit 5: Directions & Public Transportation'
                          },
                          {
                            time: 'Monday, 10:00 - 12:30 WIB',
                            className: 'BIPA B1 Conversation and Culture Class',
                            code: 'CLS-B1-04',
                            level: 'B1 Intermediate',
                            room: 'Cultural Room 102',
                            studentsCount: 15,
                            session: 'Meeting 5/16',
                            status: 'SCHEDULED',
                            topic: 'Unit 5: Ordering Food in Padang Restaurants'
                          }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-indigo-50/40 transition-colors">
                            <td className="px-4 py-3.5 font-semibold text-slate-800">
                              {row.time}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="font-bold text-slate-900">{row.className}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{row.code}</div>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-slate-700">
                              {row.level}
                            </td>
                            <td className="px-4 py-3.5 text-slate-600 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              {row.room}
                            </td>
                            <td className="px-4 py-3.5 text-center font-bold text-slate-800">
                              {row.studentsCount} students
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-slate-700">
                              {row.session}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              {row.status === 'ACTIVE' ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold animate-pulse">
                                  <Sparkles className="w-3 h-3" /> In Progress
                                </span>
                              ) : row.status === 'UPCOMING' ? (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                  <Clock className="w-3 h-3" /> Later Today
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                  Scheduled
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              {row.status === 'ACTIVE' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsMetricModalOpen(false);
                                    setActiveTab('attendance');
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                                >
                                  Manage Attendance 
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => showToast(`Syllabus for ${row.className} is ready.`)}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                                >
                                  View Module
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: CURRICULUM SYLLABUS TABLE */}
              {activeMetricTab === 'curriculum' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Completed</div>
                      <div className="text-xl font-extrabold text-amber-600">4 <span className="text-xs font-bold text-slate-400">of 16 Sessions</span></div>
                      <div className="text-[10px] text-slate-500 mt-0.5">25.0% Semester Syllabus</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Current Session</div>
                      <div className="text-xl font-extrabold text-indigo-600">Meeting 4</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Traditional Market</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Remaining Sessions</div>
                      <div className="text-xl font-extrabold text-slate-800">12 Meetings</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Until June 2026</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs">
                      <div className="text-[10px] font-bold text-emerald-800 uppercase">Midterm Exam UTS</div>
                      <div className="text-base font-extrabold text-emerald-900 mt-0.5">Meeting 8</div>
                      <div className="text-[10px] text-emerald-700">Spoken Conversation Practice</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Meeting</th>
                          <th className="px-4 py-3.5">Date</th>
                          <th className="px-4 py-3.5">Unit</th>
                          <th className="px-4 py-3.5">Topic & Syllabus Focus</th>
                          <th className="px-4 py-3.5 text-center">Attendance</th>
                          <th className="px-4 py-3.5 text-center">Session Status</th>
                          <th className="px-4 py-3.5">Google Drive Module</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { meet: 1, date: '12 Mar 2026', unit: 'Unit 1', topic: 'Orientation & Formal Self-Introduction Vocabulary', rate: '100%', status: 'COMPLETED' },
                          { meet: 2, date: '16 Mar 2026', unit: 'Unit 2', topic: 'Family, Occupations & Kinship Terminology', rate: '93.3%', status: 'COMPLETED' },
                          { meet: 3, date: '19 Mar 2026', unit: 'Unit 3', topic: 'Numbers, Currency Figures, & Digital/Analog Time', rate: '100%', status: 'COMPLETED' },
                          { meet: 4, date: '26 Mar 2026', unit: 'Unit 4', topic: 'Bargaining in Traditional Markets & Shopping Etiquette', rate: '86.7%', status: 'IN_PROGRESS' },
                          { meet: 5, date: '02 Apr 2026', unit: 'Unit 5', topic: 'Indonesian Culinary: Ordering Menus & Taste Varieties', rate: '-', status: 'UPCOMING' },
                          { meet: 6, date: '09 Apr 2026', unit: 'Unit 6', topic: 'Local Transportation: Angkot, Ride-Hailing & Commuter Train', rate: '-', status: 'UPCOMING' },
                          { meet: 7, date: '16 Apr 2026', unit: 'Unit 7', topic: 'Bandung Local Resident Interview Simulation', rate: '-', status: 'UPCOMING' },
                          { meet: 8, date: '23 Apr 2026', unit: 'Unit 8', topic: 'Midterm Practical Conversation Examination (UTS)', rate: '-', status: 'UPCOMING' },
                          { meet: 9, date: '30 Apr 2026', unit: 'Unit 9', topic: 'Healthcare: Pharmacy Consultation & Describing Symptoms', rate: '-', status: 'UPCOMING' },
                          { meet: 10, date: '07 May 2026', unit: 'Unit 10', topic: 'Tourism & Historical Site Exploration Descriptions', rate: '-', status: 'UPCOMING' },
                          { meet: 11, date: '14 May 2026', unit: 'Unit 11', topic: 'Field Mission: Traditional Market Exploration', rate: '-', status: 'UPCOMING' },
                          { meet: 12, date: '21 May 2026', unit: 'Unit 12', topic: 'Expressing Emotion, Opinions & Structured Debates', rate: '-', status: 'UPCOMING' },
                          { meet: 13, date: '28 May 2026', unit: 'Unit 13', topic: 'Puppet Performance Arts & Indonesian Folklore', rate: '-', status: 'UPCOMING' },
                          { meet: 14, date: '04 Jun 2026', unit: 'Unit 14', topic: 'Group Cultural Project Final Presentations', rate: '-', status: 'UPCOMING' },
                          { meet: 15, date: '11 Jun 2026', unit: 'Unit 15', topic: 'Comprehensive Review & UKBI Simulation Test', rate: '-', status: 'UPCOMING' },
                          { meet: 16, date: '18 Jun 2026', unit: 'Unit 16', topic: 'Final Examination (UAS) & Cultural Exhibition', rate: '-', status: 'UPCOMING' }
                        ].map((row) => (
                          <tr key={row.meet} className="hover:bg-amber-50/40 transition-colors">
                            <td className="px-4 py-3 font-bold text-slate-900">
                              Meeting {row.meet}
                            </td>
                            <td className="px-4 py-3 text-slate-600 font-medium">
                              {row.date}
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-amber-700">
                              {row.unit}
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-800 max-w-[260px] truncate" title={row.topic}>
                              {row.topic}
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-slate-700">
                              {row.rate}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {row.status === 'COMPLETED' ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                  <Check className="w-3 h-3" /> Completed
                                </span>
                              ) : row.status === 'IN_PROGRESS' ? (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                                  Active Session
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                  Upcoming
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <a
                                href="https://drive.google.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-bold text-[11px]"
                              >
                                <Folder className="w-3 h-3" /> Open Module
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: PENDING BAP TABLE */}
              {activeMetricTab === 'pendingBap' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="space-y-1 text-left">
                      <div className="text-xs font-bold text-pink-900 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-pink-600" />
                        Current Session BAP Validation Alert
                      </div>
                      <div className="text-[11px] text-pink-800">
                        Meeting 4 today requires faculty digital signature before the student representative can perform dual sign-off.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMetricModalOpen(false);
                        setIsTeacherModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      <PenTool className="w-3.5 h-3.5 text-white" />
                      {teacherSignData ? 'Update Teacher Signature' : 'Sign Meeting 4 Now'}
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Meeting</th>
                          <th className="px-4 py-3.5">Class Date</th>
                          <th className="px-4 py-3.5">Discussion Topic</th>
                          <th className="px-4 py-3.5 text-center">Faculty Sign</th>
                          <th className="px-4 py-3.5 text-center">Student Rep Sign</th>
                          <th className="px-4 py-3.5 text-center">QA Supervisor</th>
                          <th className="px-4 py-3.5">BAP Status</th>
                          <th className="px-4 py-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-pink-50/40 transition-colors bg-pink-50/10">
                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            Meeting 4 (Today)
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-800">
                            26 Mar 2026, 09:00 - 11:30
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-800 max-w-[220px] truncate">
                            Unit 4: Bargaining in Markets
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            {teacherSignData ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                <Check className="w-3 h-3" /> Issued (QR)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                                Unsigned
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            {studentRepSignData ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                <Check className="w-3 h-3" /> Valid (QR)
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px] italic">
                                Awaiting Faculty
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              QA Queue
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-pink-700 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full text-[10px]">
                              Action Required
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setIsMetricModalOpen(false);
                                setIsTeacherModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                            >
                              Open Sign Pad
                            </button>
                          </td>
                        </tr>

                        {/* Meeting 3 */}
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            Meeting 3
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">
                            19 Mar 2026, 10:00 - 11:30
                          </td>
                          <td className="px-4 py-3.5 text-slate-800 max-w-[220px] truncate">
                            Unit 3: Numbers, Currency & Time
                          </td>
                          <td className="px-4 py-3.5 text-center font-bold text-emerald-600 text-[11px]">
                            Faculty Signed
                          </td>
                          <td className="px-4 py-3.5 text-center font-bold text-emerald-600 text-[11px]">
                            Student Signed
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              Approved
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px]">
                              Completed (Archived)
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => showToast('Downloading Meeting 3 BAP (PDF)...')}
                              className="text-indigo-600 hover:underline font-bold text-xs cursor-pointer"
                            >
                              Download PDF
                            </button>
                          </td>
                        </tr>

                        {/* Meeting 2 */}
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            Meeting 2
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">
                            16 Mar 2026, 10:00 - 11:30
                          </td>
                          <td className="px-4 py-3.5 text-slate-800 max-w-[220px] truncate">
                            Unit 2: Advanced Introductions & Culture
                          </td>
                          <td className="px-4 py-3.5 text-center font-bold text-emerald-600 text-[11px]">
                            Faculty Signed
                          </td>
                          <td className="px-4 py-3.5 text-center font-bold text-emerald-600 text-[11px]">
                            Student Signed
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              Approved
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px]">
                              Completed (Archived)
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => showToast('Downloading Meeting 2 BAP (PDF)...')}
                              className="text-indigo-600 hover:underline font-bold text-xs cursor-pointer"
                            >
                              Download PDF
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Data is synchronized in real-time with the BIPA coordinator and academic supervision portals.
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

      {/* ================= CLASS ROSTER DETAIL MODAL ================= */}
      {isClassDetailModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsClassDetailModalOpen(false)}
          />

          <div className="relative w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[92vh]">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      Class Session   {sessionInfo.className}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Meeting 4 (Week 3)
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
                    Class Details, Student Roster & Semester Plan (RPS)
                  </h3>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Lead Teacher: {sessionInfo.teacherName}   Room: {sessionInfo.room}   10:00 to 11:40 WIB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsClassDetailModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setActiveRosterTab('roster')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeRosterTab === 'roster'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Roster of 15 Students & Attendance
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRosterTab('rps')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeRosterTab === 'rps'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Semester Learning Plan (RPS Meeting 4)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRosterTab('logbook')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeRosterTab === 'logbook'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  Actual Delivery & Teaching Logbook
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-7 overflow-y-auto custom-scrollbar flex-1 space-y-4 bg-slate-50/50">
              {activeRosterTab === 'roster' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Total Enrolled</div>
                      <div className="text-xl font-extrabold text-slate-900">15 Students</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Present This Session</div>
                      <div className="text-xl font-extrabold text-emerald-600">{counts.PRESENT} Students</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Excused or Late</div>
                      <div className="text-xl font-extrabold text-amber-600">{counts.EXCUSED + counts.LATE} Students</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Absences</div>
                      <div className="text-xl font-extrabold text-rose-600">{counts.ABSENT} Absent</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">No</th>
                          <th className="px-4 py-3.5">Student</th>
                          <th className="px-4 py-3.5">ID (NIM)</th>
                          <th className="px-4 py-3.5">Origin Country</th>
                          <th className="px-4 py-3.5 text-center">Meeting 4 Status</th>
                          <th className="px-4 py-3.5">Instructor Special Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {students.map((std, idx) => {
                          const att = attendances[std.id] || { status: 'PRESENT', notes: '' };
                          return (
                            <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 font-semibold text-slate-500">{idx + 1}</td>
                              <td className="px-4 py-3">
                                <span className="font-bold text-slate-900">{std.name}</span>
                              </td>
                              <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{std.nim}</td>
                              <td className="px-4 py-3 text-slate-600 flex items-center gap-1.5">
                                <span className="text-base">{std.avatar}</span>
                                <span>{std.country}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {att.status === 'PRESENT' && (
                                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                                    Present
                                  </span>
                                )}
                                {att.status === 'EXCUSED' && (
                                  <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                                    Excused
                                  </span>
                                )}
                                {att.status === 'LATE' && (
                                  <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                                    Late
                                  </span>
                                )}
                                {att.status === 'ABSENT' && (
                                  <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                                    Absent
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-slate-500 italic max-w-[200px] truncate">
                                {att.notes || '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeRosterTab === 'rps' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5 w-1/4">RPS Component</th>
                          <th className="px-4 py-3.5">Planned Syllabus Description (Meeting 4)</th>
                          <th className="px-4 py-3.5 text-center">Weight / Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { comp: 'Learning Outcome (CPMK)', desc: 'Students are capable of performing polite bargaining dialogues in traditional markets using classifier terms and large currency figures accurately.', dur: 'Core Competency' },
                          { comp: 'Core Topic & Theme', desc: 'Unit 4: Bargaining in Traditional Markets. Phrases such as "Can you lower it a bit?", units like bunch/piece/kilo, respectful market etiquette in Indonesia.', dur: 'Pages 42-55' },
                          { comp: 'Pedagogical Methodology', desc: 'Paired Roleplay Simulation (Seller vs Buyer) with mock currency props and replica traditional market goods/spices.', dur: '50 Minutes' },
                          { comp: 'Listening Activity', desc: 'Audio Track 04: Authentic native dialogue between Beringharjo Yogyakarta market merchants (analyzing bargaining pitch and number pronunciation).', dur: '20 Minutes' },
                          { comp: 'Evaluation & Reflection', desc: 'Phonetic feedback on question vs rhetorical pitch intonation, nominal pricing pronunciation drills, and execution logbook completion.', dur: '30 Minutes' },
                          { comp: 'Assessment Instrument', desc: 'Spoken Proficiency Rubric (Fluency, Classifier Grammar Accuracy, Cultural Politeness, Vocabulary Precision).', dur: 'Formative (15%)' },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-900">{row.comp}</td>
                            <td className="px-4 py-3.5 text-slate-700 leading-relaxed">{row.desc}</td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-extrabold text-[10px] border border-amber-200">
                                {row.dur}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeRosterTab === 'logbook' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5 w-1/3">Execution Parameter</th>
                          <th className="px-4 py-3.5">Teacher Actual Delivery</th>
                          <th className="px-4 py-3.5 text-center">BAP Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { param: 'Actual Execution Time', val: `${logbookForm.startTime} - ${logbookForm.endTime} WIB (Full 100 Minutes)`, st: 'On Time' },
                          { param: 'Completed Topic', val: logbookForm.topic, st: '100% Matches RPS' },
                          { param: 'Class Narrative Realization', val: logbookForm.narration, st: 'Verified' },
                          { param: 'Pedagogical / Field Observations', val: logbookForm.pedagogicalNotes, st: 'Recorded' },
                          { param: 'Student Attendance Rate', val: `${counts.PRESENT} Present of ${students.length} Students (93.3%)`, st: 'Quorum Met' },
                          { param: 'Google Drive Documentation Link', val: logbookForm.driveLink, st: 'Cloud Linked' },
                          { param: 'Dual Signoff Validation', val: teacherSignData ? 'Faculty Signed (Awaiting Student Representative)' : 'Unsigned by Faculty', st: teacherSignData ? 'Pending Student Rep' : 'Draft' },
                        ].map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-800">{item.param}</td>
                            <td className="px-4 py-3.5 font-semibold text-slate-900">{item.val}</td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                                {item.st}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                BIPA Center   Directly linked to official Teaching Reports BAP
              </span>
              <button
                type="button"
                onClick={() => setIsClassDetailModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SYLLABUS & LESSON PLAN MODAL (STUDENT-MIRRORED VIEW FOR TEACHER) ================= */}
      {isSyllabusModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSyllabusModalOpen(false)}
          />

          <div className="relative w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                      Syllabus & Learning Modules Mirror
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      Synchronized with Student View (1:1)
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-slate-200">
                      Lead: {activeTeacherName}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    Syllabus, Learning Modules & Class Directives
                  </h3>
                  <div className="text-xs text-slate-300">
                    BIPA B1 Conversation and Culture Class — Tampilan materi terpadu sama persis dengan yang dilihat mahasiswa di Student Dashboard agar dosen dapat mengarahkan materi, audio dialog, kosakata, dan lembar kerja secara sinkron.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSyllabusModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer shrink-0 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {['ALL', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSyllabusFilterLevel(lvl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        syllabusFilterLevel === lvl
                          ? 'bg-emerald-500 text-slate-900 shadow-sm font-extrabold'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {lvl === 'ALL' ? 'All Levels' : `Level ${lvl}`}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari modul, topik, kosakata, grammar..."
                    value={syllabusSearch}
                    onChange={(e) => setSyllabusSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white/10 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-slate-50/60">
              {/* Teaching Directive Guidance Tip */}
              <div className="p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200/80 flex items-start gap-3 text-xs text-indigo-950">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs font-bold mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="font-extrabold text-indigo-900">
                    Mode Pengarahan Dosen (Teacher Teaching Directive Mode)
                  </div>
                  <div className="text-indigo-800 text-[11px] leading-relaxed">
                    Setiap kartu modul di bawah ini memuat materi, native audio listening, daftar kosakata esensial, fokus tata bahasa, dan berkas ajar yang terhubung langsung dengan apa yang dibuka mahasiswa. Klik modul untuk memutar audio rekaman atau melihat arahan kompetensi per pertemuan.
                  </div>
                </div>
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold shrink-0">
                  {filteredSyllabusCourses.length} Registered Units
                </span>
              </div>

              {/* Course Modules Grid (Mirror of Student View) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSyllabusCourses.map((course) => {
                  const isCurrentActive = course.unitNumber === 4 || course.id === 'unit-4';
                  return (
                    <div
                      key={course.id}
                      onClick={() => setSelectedSyllabusCourse(course)}
                      className={`group rounded-3xl bg-white border p-4 sm:p-5 flex flex-col justify-between hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer relative ${
                        isCurrentActive ? 'border-indigo-300 ring-2 ring-indigo-500/20 shadow-md' : 'border-slate-200/80 shadow-xs'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Thumbnail & Badges */}
                        <div className="overflow-hidden rounded-2xl bg-slate-100 border border-slate-100 relative h-40">
                          <img
                            src={course.image || '/task_market.jpg'}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
                              {course.level || 'B1 Intermediate'}
                            </span>
                            {course.isMission && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                                <Award className="w-3 h-3" /> Misi Lapangan
                              </span>
                            )}
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs ${
                              isCurrentActive
                                ? 'bg-indigo-600 text-white animate-pulse'
                                : course.isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-900/70 text-slate-200'
                            }`}>
                              {isCurrentActive ? 'Active Sesi 4' : course.isCompleted ? 'Completed' : `${course.progress || 75}% Studied`}
                            </span>
                          </div>
                        </div>

                        {/* Unit & Book Title */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            course.isMission
                              ? 'text-amber-800 bg-amber-100 flex items-center gap-1'
                              : 'text-violet-700 bg-violet-100'
                          }`}>
                            {course.unitTitle || `Unit ${course.unitNumber}`}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium truncate">
                            {course.bookTitle || 'BIPA Textbook'}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {course.title}
                          </h4>
                          <div className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {course.description}
                          </div>
                        </div>

                        {/* Audio Listening Track Preview */}
                        <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                              <Headphones className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-800 truncate">
                                {course.audioTitle || 'Audio Track'}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Native Audio: {course.audioDuration || '15 Min'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Topics Snippets */}
                        {course.topics && course.topics.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Target Kompetensi:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {course.topics.slice(0, 2).map((t, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md truncate max-w-[200px]"
                                >
                                  {t}
                                </span>
                              ))}
                              {course.topics.length > 2 && (
                                <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                                  +{course.topics.length - 2} lagi
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Action */}
                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          className="w-full py-2 rounded-xl bg-slate-900 group-hover:bg-indigo-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Buka Detail & Panduan Ajar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredSyllabusCourses.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Tidak ada modul silabus yang sesuai</h4>
                  <div className="text-xs text-slate-500 max-w-sm mx-auto">
                    Coba sesuaikan kata kunci pencarian atau ganti filter level kurikulum di atas.
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Materi disinkronkan langsung dari Kurikulum BIPA Itenas & RPS Koordinator.
              </span>
              <button
                type="button"
                onClick={() => setIsSyllabusModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                Tutup Tampilan Silabus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TEACHER DETAILED COURSE & DIRECTIVES MODAL (EXACT 1:1 WITH STUDENT) ================= */}
      {selectedSyllabusCourse && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedSyllabusCourse(null)}
          />

          <div className="relative w-full max-w-3xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white">
                      {selectedSyllabusCourse.level}
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200">
                      {selectedSyllabusCourse.category}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/80 text-white flex items-center gap-1">
                      <Check className="w-3 h-3" /> Teacher Directives Active
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {selectedSyllabusCourse.title}
                  </h2>
                  <div className="text-xs sm:text-sm text-indigo-200 font-medium">
                    {selectedSyllabusCourse.unitTitle} — {selectedSyllabusCourse.bookTitle}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSyllabusCourse(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 custom-scrollbar">
              {/* Module Overview Card */}
              <div className="flex flex-col sm:flex-row gap-5 items-center bg-slate-50 p-4 rounded-3xl border border-slate-200/60">
                <img
                  src={selectedSyllabusCourse.image || '/task_market.jpg'}
                  alt={selectedSyllabusCourse.title}
                  className="w-full sm:w-48 h-32 object-cover rounded-2xl shadow-sm"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="space-y-2 text-left">
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    Module Overview & Ringkasan Materi Mahasiswa
                  </span>
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {selectedSyllabusCourse.description}
                  </div>
                </div>
              </div>

              {/* Teacher Directive Guidance Note */}
              <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h5 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wide">
                    Panduan & Arahan Pembelajaran Dosen (Teacher Instruction Guide)
                  </h5>
                </div>
                <div className="text-xs text-emerald-800 leading-relaxed space-y-1">
                  <div>• <strong>Strategi Kelas:</strong> Mulai pertemuan dengan memutar audio dialog native di bawah ini untuk melatih kepekaan telinga mahasiswa asing.</div>
                  <div>• <strong>Latihan Praktik:</strong> Bagi mahasiswa berpasangan untuk melatih kosakata kunci dan simulasi percakapan tawar-menawar santun (*"Bolehkah kurang sedikit?"*).</div>
                  <div>• <strong>Evaluasi:</strong> Pastikan mahasiswa mengunduh lembar kerja PDF untuk tugas mandiri atau persiapan ujian.</div>
                </div>
              </div>

              {/* Target Learning Objectives */}
              {selectedSyllabusCourse.topics && selectedSyllabusCourse.topics.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Target Kompetensi & Tujuan Pembelajaran Mahasiswa
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedSyllabusCourse.topics.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-white border border-slate-200/70 flex items-start gap-2.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 font-medium leading-snug">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Native Audio Listening Player (Fully Interactive for Teacher) */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">
                        {selectedSyllabusCourse.audioTitle || 'Native Listening Audio Track'}
                      </h5>
                      <span className="text-[10px] text-slate-500">
                        Native Audio Duration: {selectedSyllabusCourse.audioDuration || '15 Minutes'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-indigo-200 text-[10px] font-bold text-slate-700">
                    <span>Speed:</span>
                    {['0.8x', '1.0x', '1.2x'].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setAudioSpeed(spd)}
                        className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                          audioSpeed === spd ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'
                        }`}
                      >
                        {spd}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-indigo-200/60 p-0.5 flex items-center">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                    <span>04:12</span>
                    <span>{selectedSyllabusCourse.audioDuration || '15:00'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setAudioProgress((p) => Math.max(0, p - 10))}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer transition-colors shadow-xs"
                    title="-10s"
                  >
                    -10s
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlayingAudio(!isPlayingAudio);
                      showToast(isPlayingAudio ? 'Audio paused' : `Memutar dialog ajar: "${selectedSyllabusCourse.audioTitle}" untuk kelas...`);
                    }}
                    className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-4 h-4" /> Pause Audio
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" /> Putar Audio Latihan di Kelas
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAudioProgress((p) => Math.min(100, p + 10))}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer transition-colors shadow-xs"
                    title="+10s"
                  >
                    +10s
                  </button>
                </div>
              </div>

              {/* Key Vocabulary */}
              {selectedSyllabusCourse.vocabularies && selectedSyllabusCourse.vocabularies.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Kosakata Kunci Mahasiswa (Key Vocabulary)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedSyllabusCourse.vocabularies.map((vocab, vIdx) => (
                      <div
                        key={vIdx}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">{vocab.term}</div>
                          <div className="text-[11px] text-slate-500">{vocab.meaning}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast(`Uji pelafalan kelas: "${vocab.term}" (${vocab.meaning})`)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors"
                          title="Dengarkan / Uji Pelafalan"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grammar Focus & Cultural Etiquette */}
              {selectedSyllabusCourse.grammarFocus && (
                <div className="p-4 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                  <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Fokus Tata Bahasa & Etika Budaya (Grammar & Cultural Etiquette)
                  </h5>
                  <div className="text-xs text-amber-800 leading-relaxed">
                    {selectedSyllabusCourse.grammarFocus}
                  </div>
                </div>
              )}

              {/* Downloadable Courseware & Worksheets */}
              {selectedSyllabusCourse.downloadableDocs && selectedSyllabusCourse.downloadableDocs.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Berkas & Lembar Kerja Mahasiswa (Courseware & Worksheets)
                  </h4>
                  <div className="space-y-2">
                    {selectedSyllabusCourse.downloadableDocs.map((doc, dIdx) => (
                      <div
                        key={dIdx}
                        className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{doc}</div>
                            <div className="text-[10px] text-slate-400">PDF Document tersedia di portal mahasiswa</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast(`Mengunduh lembar materi mahasiswa: ${doc}`)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Unduh Dokumen
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium">
                💡 Disinkronkan dengan silabus modul mahasiswa BIPA Itenas.
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {selectedSyllabusCourse.driveUrl && (
                  <a
                    href={selectedSyllabusCourse.driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Buka Google Drive Modul
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedSyllabusCourse(null)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Tutup Panduan Modul
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TEACHER CLOUD DRIVE REPOSITORY MODAL ================= */}
      {isTeacherDriveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsTeacherDriveModalOpen(false)}
          />

          <div className="relative w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[92vh]">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      Faculty Cloud Storage Repository
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      {sessionInfo.teacherName}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    Digital Archive Repository & Google Drive Teaching Table
                  </h3>
                  <div className="text-xs text-slate-300">
                    Collection of learning materials, evaluation rubrics, audio dialogues, and classroom documentation.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTeacherDriveModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-7 overflow-y-auto space-y-4 custom-scrollbar flex-1 bg-slate-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Cloud Capacity Used</div>
                  <div className="text-xl font-extrabold text-indigo-600">3.4 GB <span className="text-xs font-bold text-slate-400">of 30 GB</span></div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Google Workspace for Education</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total Teaching Files</div>
                  <div className="text-xl font-extrabold text-emerald-600">48 Documents and Media</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Synchronized in Real Time</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Access Privileges</div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">Faculty Instructor and Supervisor</div>
                  <div className="text-[10px] text-slate-500">Student access via student portal</div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                  <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5">Folder / File Name</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Format</th>
                      <th className="px-4 py-3.5 text-center">Size</th>
                      <th className="px-4 py-3.5">Last Updated</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: 'BIPA B1 Module: Lecture Presentation PPT Slides Units 1-16', cat: 'Presentation Slides', ext: 'PPTX & PDF (16 Files)', size: '185 MB', updated: 'Yesterday, 14:15', link: 'https://drive.google.com' },
                      { name: 'Native Speaker Audio Bank: Market Dialogues & Thematic Transactions', cat: 'Listening Audio', ext: 'MP3 320kbps (24 Tracks)', size: '420 MB', updated: '20 Mar 2026', link: 'https://drive.google.com' },
                      { name: 'Official Teaching Report (BAP) & Dual Signoff Template', cat: 'Administration', ext: 'DOCX & PDF Form', size: '12 MB', updated: '01 Mar 2026', link: 'https://drive.google.com' },
                      { name: 'Spoken Rubrics & Field Market Bargaining Criteria', cat: 'Evaluation Rubric', ext: 'CEFR Standard PDF', size: '8.4 MB', updated: '18 Mar 2026', link: 'https://drive.google.com' },
                      { name: 'Independent Practice Worksheets & Grammar Answer Keys', cat: 'Student Worksheet', ext: 'DOCX / PDF', size: '22 MB', updated: 'Yesterday, 09:30', link: 'https://drive.google.com' },
                      { name: 'Photo & Video Gallery Documentation: BIPA Market Roleplay', cat: 'Documentation', ext: 'Google Drive ZIP Archive', size: '1.4 GB', updated: '17 Mar 2026', link: 'https://drive.google.com' },
                      { name: 'Phonetic & Pitch Intonation Video Teaching Guide', cat: 'Instructor Media', ext: 'MP4 Video (1080p)', size: '950 MB', updated: '10 Mar 2026', link: 'https://drive.google.com' },
                      { name: 'Accredited Semester Learning Plan (RPS) BIPA B1 2026', cat: 'RPS Document', ext: 'Official PDF', size: '6.2 MB', updated: '28 Feb 2026', link: 'https://drive.google.com' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900">{row.name}</div>
                          <div className="text-[10px] text-slate-400">Folder ID G DRIVE BIPA 2026</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                            {row.cat}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-700">{row.ext}</td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-800">{row.size}</td>
                        <td className="px-4 py-3.5 text-slate-500">{row.updated}</td>
                        <td className="px-4 py-3.5 text-right">
                          <a
                            href={row.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Access Drive
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Cloud storage is directly connected with Google Workspace for Education.
              </span>
              <button
                type="button"
                onClick={() => setIsTeacherDriveModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
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
