import React, { useState } from 'react';
import {
  LayoutGrid,
  Calendar as CalendarIcon,
  BookOpen,
  MessageSquare,
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
  Play,
  Pause,
  Download,
  X,
  Check,
  RotateCcw,
  Volume2,
  HelpCircle
} from 'lucide-react';
import DigitalSignatureModal from './DigitalSignatureModal';
import StudentRepSignPadModal from './attendance/StudentRepSignPadModal';
import { initialCourses } from '../data/coursesData';

const initialAttendanceRecords = [
  { meet: 1, date: 'Feb 12 2026', time: '10:00 to 11:40', topic: 'Unit 1: Formal Introduction and Academic Goals', status: 'PRESENT', checkIn: '09:55 WIB', note: 'On time', bapStatus: 'Approved' },
  { meet: 2, date: 'Feb 19 2026', time: '10:00 to 11:40', topic: 'Unit 2: Daily Routines and Time Adverbials', status: 'PRESENT', checkIn: '09:58 WIB', note: 'Active participation', bapStatus: 'Approved' },
  { meet: 3, date: 'Feb 26 2026', time: '10:00 to 11:40', topic: 'Unit 3: Public Transport and City Directions', status: 'PRESENT', checkIn: '10:00 WIB', note: 'Dialogue practice', bapStatus: 'Approved' },
  { meet: 4, date: 'Mar 05 2026', time: '10:00 to 11:40', topic: 'Unit 4: Bargaining in Traditional Markets', status: 'PRESENT', checkIn: '09:52 WIB', note: 'Current active session', bapStatus: 'In Progress' },
  { meet: 5, date: 'Mar 12 2026', time: '10:00 to 11:40', topic: 'Unit 5: Healthcare and Medical Consultations', status: 'EXCUSED', checkIn: 'None', note: 'Embassy appointment verified', bapStatus: 'Approved' },
  { meet: 6, date: 'Mar 19 2026', time: '10:00 to 11:40', topic: 'Unit 6: Traditional Culinary and Recipes', status: 'PRESENT', checkIn: '09:56 WIB', note: 'On time', bapStatus: 'Approved' },
  { meet: 7, date: 'Mar 26 2026', time: '10:00 to 11:40', topic: 'Unit 7: Tourism and Hospitality Reservations', status: 'LATE', checkIn: '10:18 WIB', note: 'Late by 18 min transit delay', bapStatus: 'Approved' },
  { meet: 8, date: 'Apr 02 2026', time: '10:00 to 11:40', topic: 'Midterm Evaluation Oral Proficiency Exam', status: 'PRESENT', checkIn: '09:45 WIB', note: 'Oral assessment completed Grade A', bapStatus: 'Approved' },
  { meet: 9, date: 'Apr 09 2026', time: '10:00 to 11:40', topic: 'Unit 8: Environmental Care and Urban Ecology', status: 'PRESENT', checkIn: '09:50 WIB', note: 'On time', bapStatus: 'Approved' },
  { meet: 10, date: 'Apr 16 2026', time: '10:00 to 11:40', topic: 'Unit 9: Professional Careers and Job Interviews', status: 'PRESENT', checkIn: '09:57 WIB', note: 'On time', bapStatus: 'Approved' },
  { meet: 11, date: 'Apr 23 2026', time: '10:00 to 11:40', topic: 'Unit 10: Traditional Batik Arts and Crafts', status: 'PRESENT', checkIn: '09:55 WIB', note: 'Hands on batik workshop', bapStatus: 'Approved' },
  { meet: 12, date: 'Apr 30 2026', time: '10:00 to 11:40', topic: 'Unit 11: Folklore and Sundanese Local Wisdom', status: 'PRESENT', checkIn: '09:51 WIB', note: 'On time', bapStatus: 'Approved' },
  { meet: 13, date: 'May 07 2026', time: '10:00 to 11:40', topic: 'Unit 12: Social Media and Current Affairs', status: 'PRESENT', checkIn: '10:02 WIB', note: 'On time', bapStatus: 'Approved' },
  { meet: 14, date: 'May 14 2026', time: '10:00 to 11:40', topic: 'Unit 13: Academic Debate and Contemporary Issues', status: 'PRESENT', checkIn: '09:54 WIB', note: 'Debate completed smoothly', bapStatus: 'Approved' },
  { meet: 15, date: 'May 21 2026', time: '10:00 to 11:40', topic: 'Unit 14: Formal Public Speaking in Indonesian', status: 'UPCOMING', checkIn: 'None', note: 'Upcoming scheduled session', bapStatus: 'Scheduled' },
  { meet: 16, date: 'May 28 2026', time: '10:00 to 11:40', topic: 'Final Semester Evaluation and Class Completion', status: 'UPCOMING', checkIn: 'None', note: 'Upcoming scheduled session', bapStatus: 'Scheduled' }
];

const initialMissionRecords = [
  {
    code: 'MISSION 01',
    title: 'Public Transit Driver Interview and Route Navigation',
    location: 'Dago Terminal and Jl Ir H Juanda',
    deadline: 'Feb 20 2026',
    status: 'COMPLETED',
    score: 95,
    proofUrl: 'https://drive.google.com',
    feedback: 'Clear pronunciation and polite demeanor. Excellent field engagement.'
  },
  {
    code: 'MISSION 02',
    title: 'Produce Bargaining at Sederhana Market',
    location: 'Sederhana Traditional Market Bandung',
    deadline: 'Mar 06 2026',
    status: 'COMPLETED',
    score: 90,
    proofUrl: 'https://drive.google.com',
    feedback: 'Successfully negotiated with respectful language without offending merchants.'
  },
  {
    code: 'MISSION 03',
    title: 'Campus Canteen Ordering and Local Ingredient Inquiry',
    location: 'BIPA Language Center Main Canteen',
    deadline: 'Mar 27 2026',
    status: 'COMPLETED',
    score: 88,
    proofUrl: 'https://drive.google.com',
    feedback: 'Independent ordering completed successfully photo and notes verified.'
  },
  {
    code: 'MISSION 04',
    title: 'Batik Exploration and Artisan Dialogue',
    location: 'Komar Batik Studio Cigadung',
    deadline: 'Apr 10 2026',
    status: 'ACTIVE',
    score: null,
    proofUrl: null,
    feedback: 'Active mission this week. Prepare 5 interview questions.'
  }
];

export default function StudentDashboard({
  onLogout,
  studentName = 'Sarah Jenkins',
  currentUser,
  sessionInfo,
  students = [],
  attendances = {},
  teacherSignData,
  studentRepSignData,
  meetingStatus = 'PENDING_REP_SIGN',
  onStudentRepSignComplete,
  onViewBap,
  onSwitchToTeacherView,
  darmasiswaSessions = [],
  onDarmasiswaStudentAttend,
  courses: propCourses,
}) {
  const activeStudentName = currentUser?.name || studentName;
  const activeStudentNim = currentUser?.nim || currentUser?.identifier || '312024043';
  const activeStudentTitle = currentUser?.title || 'BIPA B1 Intermediate';

  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDate, setActiveDate] = useState(26);
  const [toastMessage, setToastMessage] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [activeProgressTab, setActiveProgressTab] = useState('attendance');
  const [attendanceFilter, setAttendanceFilter] = useState('ALL');

  const [courses, setCourses] = useState(() => {
    return propCourses || initialCourses;
  });

  React.useEffect(() => {
    if (propCourses && propCourses.length > 0) {
      setCourses(propCourses);
    }
  }, [propCourses]);

  // Dynamic Missions State synced with Database API
  const [missions, setMissions] = useState(initialMissionRecords);

  React.useEffect(() => {
    let isMounted = true;
    async function fetchMissions() {
      try {
        const res = await fetch('/api/student/missions');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            setMissions(data);
          }
        }
      } catch (err) {
        console.warn('Failed to load student missions:', err);
      }
    }
    fetchMissions();
    return () => { isMounted = false; };
  }, []);

  // Live Attendance Records computed with active meeting state
  const attendanceRecords = React.useMemo(() => {
    const activeStudentAtt = attendances[activeStudentNim] || { status: 'PRESENT', notes: 'Present in class' };
    return initialAttendanceRecords.map((rec) => {
      if (rec.meet === 4) {
        return {
          ...rec,
          status: activeStudentAtt.status || 'PRESENT',
          note: activeStudentAtt.notes || rec.note,
          bapStatus: meetingStatus === 'SUPERVISOR_APPROVED' ? 'Approved' : studentRepSignData ? 'Student Signed' : teacherSignData ? 'Faculty Signed' : 'In Progress'
        };
      }
      return rec;
    });
  }, [attendances, activeStudentNim, meetingStatus, studentRepSignData, teacherSignData]);

  const [showAllCourses, setShowAllCourses] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(30);
  const [audioSpeed, setAudioSpeed] = useState('1.0x');

  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameAnswers, setGameAnswers] = useState({});

  const [isStudentProfileModalOpen, setIsStudentProfileModalOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState('biodata');
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);

  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Audio Track 04 Uploaded', desc: 'Dra. Siti Rahmawati uploaded listening audio for Unit 4.', time: '10m ago', unread: true },
    { id: 2, title: 'Session 3 Logbook Verified', desc: 'Academic Supervisor endorsed Session 3 Official Minutes.', time: 'Yesterday', unread: true },
    { id: 3, title: 'Canteen Mission Deadline', desc: 'Deadline to submit photo and reflection notes: This Friday.', time: '2 days ago', unread: false }
  ]);

  const [calendarMonthIndex, setCalendarMonthIndex] = useState(2);
  const months = ['January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026'];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [darmasiswaCheckedIn, setDarmasiswaCheckedIn] = useState({});

  const handleDarmasiswaCheckIn = (sessionId) => {
    if (!onDarmasiswaStudentAttend) return;
    const now = new Date();
    const signTime = now.toLocaleTimeString('en-US') + ' WIB';
    onDarmasiswaStudentAttend(sessionId, activeStudentNim, {
      note: 'Checked in by student (' + activeStudentName + ')',
      signTime,
    });
    setDarmasiswaCheckedIn((prev) => ({ ...prev, [sessionId]: signTime }));
    showToast('Check-in confirmed for ' + activeStudentName);
  };

  const handleMarkCourseComplete = (courseId) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, isCompleted: !c.isCompleted, progress: !c.isCompleted ? 100 : 75 } : c
      )
    );
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse((prev) => ({
        ...prev,
        isCompleted: !prev.isCompleted,
        progress: !prev.isCompleted ? 100 : 75
      }));
    }
    showToast('Module progress updated');
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

  const filteredCourses = courses.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.unitTitle.toLowerCase().includes(q) ||
      c.topics.some((t) => t.toLowerCase().includes(q))
    );
  });

  const displayedCourses = searchQuery || showAllCourses ? filteredCourses : filteredCourses.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#e3e2fc] p-3 sm:p-5 lg:p-8 flex items-center justify-center font-sans antialiased text-slate-800">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-xl text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1440px] bg-white rounded-[36px] sm:rounded-[44px] shadow-[0_25px_70px_rgba(115,105,245,0.15)] border border-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 relative">
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-md relative">
              <div className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white border border-slate-200/80 rounded-full px-4 py-2.5 transition-all shadow-sm">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search materials, field tasks, instructors, or syllabus..."
                  className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-normal"
                />
              </div>
            </div>

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
                onClick={() => setIsNotifModalOpen(true)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2.5 right-2.5 border-2 border-white" />
              </button>

              <div className="flex items-center gap-3 pl-2">
                <img
                  src="/avatar.jpg"
                  alt={activeStudentName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 shadow-sm"
                />
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{activeStudentName}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{activeStudentTitle}</div>
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6 pb-24">

            {/* 1. HERO BANNER */}
            <section className="relative rounded-[32px] bg-[#d7d5fc] p-6 sm:p-8 overflow-hidden shadow-sm border border-indigo-100/50">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-4 max-w-md text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm text-indigo-950 text-xs font-bold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Today's Class Schedule & Agenda
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    BIPA B1 — Conversation & Culture Class
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl shadow-xs">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      10:00 to 11:40 WIB
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl shadow-xs">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      Room 402 Language Building
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl shadow-xs">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                      Dra. Siti Rahmawati, M.Hum.
                    </span>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    <a
                      href="https://drive.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-[#1b1c20] hover:bg-[#28292e] text-white text-xs font-semibold px-5 py-3 rounded-full shadow-md shadow-slate-900/15 transition-all cursor-pointer active:scale-95"
                    >
                      <FolderOpen className="w-4 h-4 text-purple-300" />
                      Google Drive Learning Materials
                      <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-400" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsStudentProfileModalOpen(true)}
                      className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-950 border border-indigo-200 text-xs font-bold px-5 py-3 rounded-full shadow-sm transition-all cursor-pointer active:scale-95 group"
                    >
                      <User className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                      Student Profile and Academic Record
                    </button>
                  </div>
                </div>

                <div className="w-48 sm:w-56 shrink-0 relative">
                  <img
                    src="/hero_study.jpg"
                    alt="BIPA Studies"
                    className="w-full h-auto rounded-2xl drop-shadow-md object-contain transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </section>

            {/* 2. PROGRESS & ATTENDANCE */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  Learning Progress and Attendance
                </h3>
                <span className="text-xs text-slate-500 font-semibold">Spring Semester 2026</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div
                  onClick={() => {
                    setActiveProgressTab('attendance');
                    setIsProgressModalOpen(true);
                  }}
                  className="rounded-xl bg-[#c8c5fa] p-4 flex flex-col justify-between space-y-3 shadow-xs cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800 bg-white/70 px-2 py-0.5 rounded">
                      14 of 16 Sessions
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">Class Attendance</h4>
                      <span className="text-[11px] font-medium text-indigo-900">
                        Details
                      </span>
                    </div>
                    <div className="w-full bg-white/60 h-1.5 rounded-full overflow-hidden mt-3">
                      <div className="bg-slate-900 h-full rounded-full" style={{ width: '87.5%' }} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 pt-1 border-t border-slate-900/10">
                    <span>Attendance Rate</span>
                    <span className="text-sm">88%</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveProgressTab('missions');
                    setIsProgressModalOpen(true);
                  }}
                  className="rounded-xl bg-[#fed68f] p-4 flex flex-col justify-between space-y-3 shadow-xs cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                      <Award className="w-4 h-4 text-amber-300" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800 bg-white/70 px-2 py-0.5 rounded">
                      3 of 4 Tasks
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">Field Missions</h4>
                      <span className="text-[11px] font-medium text-amber-900">
                        Details
                      </span>
                    </div>
                    <div className="w-full bg-white/60 h-1.5 rounded-full overflow-hidden mt-3">
                      <div className="bg-slate-900 h-full rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 pt-1 border-t border-slate-900/10">
                    <span>Completed</span>
                    <span className="text-sm">75%</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveProgressTab('bap');
                    setIsProgressModalOpen(true);
                  }}
                  className="rounded-xl bg-[#ffa6d5] p-4 flex flex-col justify-between space-y-3 shadow-xs cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                      <PenTool className="w-4 h-4 text-pink-300" />
                    </div>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        studentRepSignData
                          ? 'bg-emerald-700 text-white'
                          : teacherSignData
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {studentRepSignData
                        ? 'Signed'
                        : teacherSignData
                        ? 'Student Rep Turn'
                        : 'Active Session'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">Dual Signoff Status</h4>
                      <span className="text-[11px] font-medium text-pink-950">
                        Details
                      </span>
                    </div>
                    <div className="w-full bg-white/60 h-1.5 rounded-full overflow-hidden mt-3">
                      <div
                        className="bg-slate-900 h-full rounded-full"
                        style={{
                          width: studentRepSignData ? '100%' : teacherSignData ? '50%' : '15%',
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 pt-1 border-t border-slate-900/10">
                    <span>Status</span>
                    <span className="text-sm">
                      {studentRepSignData ? '100%' : teacherSignData ? '50%' : '0%'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* DARMASISWA CHECK-IN PANEL */}
            {onDarmasiswaStudentAttend && darmasiswaSessions.length > 0 && (
              <section className="rounded-xl border border-emerald-200 bg-emerald-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">D</span>
                    <span className="text-xs font-bold text-emerald-900">Darmasiswa Attendance</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    {Object.keys(darmasiswaCheckedIn).length} of {darmasiswaSessions.length} sessions attended
                  </span>
                </div>

                <div className="p-3 space-y-2">
                  {darmasiswaSessions.slice(-3).map((session) => {
                    const alreadyCheckedIn =
                      darmasiswaCheckedIn[session.id] ||
                      session.attendances?.[activeStudentNim]?.attended;
                    return (
                      <div
                        key={session.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white border border-emerald-100"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-800 truncate">{session.dayDate}</div>
                          <div className="text-[11px] text-slate-500 truncate">{session.material}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Facilitator: {session.facilitatorName}
                          </div>
                        </div>
                        {alreadyCheckedIn ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full shrink-0">
                            <CheckCircle2 className="w-3 h-3" /> Attended
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDarmasiswaCheckIn(session.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer transition-colors active:scale-95 shrink-0"
                          >
                            Check in
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 3. COURSE MODULES */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                  Course Modules and Immersive Tasks
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayedCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className="group rounded-3xl bg-slate-50 border border-slate-200/60 p-4 sm:p-5 flex flex-col justify-between hover:bg-white hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer relative"
                  >
                    <div className="space-y-3">
                      <div className="overflow-hidden rounded-2xl bg-white border border-slate-100 relative">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                            course.isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900/80 text-white backdrop-blur-sm'
                          }`}>
                            {course.isCompleted ? 'Completed' : `${course.progress}% Studied`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          course.isMission
                            ? 'text-amber-800 bg-amber-100 flex items-center gap-1'
                            : 'text-violet-700 bg-violet-100'
                        }`}>
                          {course.isMission && <Award className="w-3 h-3" />}
                          {course.unitTitle}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium truncate">
                          {course.bookTitle}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                        {course.title}
                      </h4>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                      {course.isMission ? (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsGameModalOpen(true);
                            }}
                            className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Gamepad2 className="w-3.5 h-3.5 text-emerald-600" />
                            Game: Indonesian Flavors and Spices
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsUploadModalOpen(true);
                            }}
                            className="text-xs font-bold text-slate-800 hover:text-indigo-600 underline cursor-pointer"
                          >
                            Upload Verification
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
                            <Headphones className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span className="truncate max-w-[150px]">{course.audioTitle}</span>
                          </span>
                          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                            View Module
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setShowAllCourses(!showAllCourses)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-purple-300" />
                  {showAllCourses ? 'Show Less' : `View All Modules ${courses.length}`}
                </button>
                <span className="text-xs text-slate-500 font-medium">
                  {displayedCourses.length} of {courses.length} modules
                </span>
              </div>
            </section>

            {/* COMPACT WIDGETS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* 1. MINI CALENDAR */}
              <div className="rounded-[32px] bg-slate-50 border border-slate-100 p-5 sm:p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCalendarMonthIndex((prev) => (prev > 0 ? prev - 1 : months.length - 1))}
                      className="p-1.5 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title="Previous Month"
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
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAgendaModalOpen(true)}
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
                        setIsAgendaModalOpen(true);
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

              {/* 2. DUAL SIGNOFF CARD */}
              <div className="rounded-[32px] bg-white border-2 border-indigo-200/70 p-5 sm:p-6 space-y-4 shadow-lg shadow-indigo-100/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-pink-200/30 rounded-bl-full pointer-events-none" />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    Attendance and Verification
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveProgressTab('bap');
                        setIsProgressModalOpen(true);
                      }}
                      className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-0.5 transition-colors cursor-pointer"
                    >
                      Audit Table
                    </button>
                    {studentRepSignData ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Dual QR Complete
                      </span>
                    ) : teacherSignData ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full animate-pulse">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Signature Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        Awaiting Faculty
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                    {studentRepSignData
                      ? 'Session 4 Official Minutes Fully Verified'
                      : teacherSignData
                      ? 'Faculty Signed Awaiting Student Representative Signature'
                      : 'Session 4 Awaiting Faculty Signoff'}
                  </h4>
                </div>

                {studentRepSignData ? (
                  <div className="space-y-2">
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Student Signature Endorsed
                      </div>
                      <div className="text-[11px] text-emerald-700">
                        Signed by {studentRepSignData.representativeName} {studentRepSignData.signedAt}
                      </div>
                    </div>
                    {onViewBap && (
                      <button
                        type="button"
                        onClick={onViewBap}
                        className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                      >
                        <FileText className="w-4 h-4 text-purple-300" />
                        View Official Minutes and Dual QR
                      </button>
                    )}
                  </div>
                ) : teacherSignData ? (
                  <button
                    type="button"
                    onClick={() => setIsSignModalOpen(true)}
                    className="w-full bg-pink-600 hover:bg-pink-700 active:scale-[0.99] text-white font-bold text-xs py-3.5 rounded-2xl shadow-md shadow-pink-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <PenTool className="w-4 h-4 text-white" />
                    Sign as Student Representative
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 text-center italic">
                      Student signature enables once faculty verification is submitted
                    </div>
                    {onSwitchToTeacherView && (
                      <button
                        type="button"
                        onClick={onSwitchToTeacherView}
                        className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors cursor-pointer"
                      >
                        Switch to Faculty View
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 3. RESOURCES HUB */}
              <div className="rounded-[32px] bg-slate-50 border border-slate-100 p-5 sm:p-6 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-indigo-600" />
                    Resources Hub
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsResourcesModalOpen(true)}
                    className="text-[10px] font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-full flex items-center gap-0.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    Repository Table
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
                        <div className="text-xs font-bold text-slate-800">BIPA B1 Courseware Drive</div>
                        <div className="text-[11px] text-slate-400">Slides E books and Practice Worksheets</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </a>

                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-violet-50/50 border border-slate-200/60 shadow-xs hover:border-violet-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Headphones className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Listening Audio & Podcasts</div>
                        <div className="text-[11px] text-slate-400">Native Speaker Dialogues (MP3)</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 transition-colors" />
                  </a>

                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-pink-50/50 border border-slate-200/60 shadow-xs hover:border-pink-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Cultural & Workshop Gallery</div>
                        <div className="text-[11px] text-slate-400">Batik Workshops & Market Field Photos</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600 transition-colors" />
                  </a>

                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-amber-50/50 border border-slate-200/60 shadow-xs hover:border-amber-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Syllabus & Lesson Plans</div>
                        <div className="text-[11px] text-slate-400">16 Sessions Competency Roadmap</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      <StudentRepSignPadModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onSignComplete={(data) => {
          if (onStudentRepSignComplete) {
            onStudentRepSignComplete(data);
          }
          showToast('Student representative signature verified');
        }}
        sessionInfo={sessionInfo}
        students={students && students.length > 0 ? students : [{ id: 'std-1', name: studentName, nim: 'BIPA-2026-081', country: 'Australia' }]}
      />

      {/* MISSION UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Upload Field Mission Verification</h2>
                <div className="text-xs text-slate-500 mt-1 font-medium">Campus Canteen Ordering & Local Student Interview</div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Verification Photo (Canteen Selfie)</label>
                <div className="w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
                  <Folder className="w-6 h-6 mb-2 text-slate-400" />
                  <span className="text-xs font-semibold">Click to select photo</span>
                  <span className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 10MB</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Learning Reflection Notes</label>
                <textarea className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:border-indigo-500 focus:bg-white outline-none transition-colors" rows="3" placeholder="Share your experience..."></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button onClick={() => setIsUploadModalOpen(false)} className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={() => { setIsUploadModalOpen(false); showToast('Mission verification uploaded'); }} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer">
                Submit Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COURSE DETAIL MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedCourse(null)}
          />

          <div className="relative w-full max-w-3xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white">
                      {selectedCourse.level}
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200">
                      {selectedCourse.category}
                    </span>
                    {selectedCourse.isCompleted && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1">
                        <Check className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {selectedCourse.title}
                  </h2>
                  <div className="text-xs sm:text-sm text-indigo-200 font-medium">
                    {selectedCourse.unitTitle} {selectedCourse.bookTitle}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 custom-scrollbar">
              <div className="flex flex-col sm:flex-row gap-5 items-center bg-slate-50 p-4 rounded-3xl border border-slate-200/60">
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="w-full sm:w-48 h-32 object-cover rounded-2xl shadow-sm"
                />
                <div className="space-y-2 text-left">
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    Module Overview
                  </span>
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {selectedCourse.description}
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  Target Learning Objectives
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCourse.topics.map((t, idx) => (
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

              {/* Audio Listening Player */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{selectedCourse.audioTitle}</h5>
                      <span className="text-[10px] text-slate-500">Native Audio Duration {selectedCourse.audioDuration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-indigo-200 text-[10px] font-bold text-slate-700">
                    <span>Speed:</span>
                    {['0.8x', '1.0x', '1.2x'].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setAudioSpeed(spd)}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${
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
                    <span>{selectedCourse.audioDuration}</span>
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
                      showToast(isPlayingAudio ? 'Audio paused' : 'Playing dialogue audio...');
                    }}
                    className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-4 h-4" /> Pause Audio
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" /> Play Practice Audio
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
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Key Vocabulary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCourse.vocabularies.map((vocab, vIdx) => (
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
                        onClick={() => showToast(`Pronunciation audio: "${vocab.term}"`)}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors"
                        title="Listen to Pronunciation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grammar & Etiquette */}
              <div className="p-4 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Grammar Focus & Cultural Etiquette
                </h5>
                <div className="text-xs text-amber-800 leading-relaxed">
                  {selectedCourse.grammarFocus}
                </div>
              </div>

              {/* Downloadable Docs */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Courseware & Worksheets (Downloads)
                </h4>
                <div className="space-y-2">
                  {selectedCourse.downloadableDocs.map((doc, dIdx) => (
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
                          <div className="text-[10px] text-slate-400">PDF Document Available for BIPA Students</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast(`Downloading: ${doc}`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleMarkCourseComplete(selectedCourse.id)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
                    selectedCourse.isCompleted
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {selectedCourse.isCompleted ? 'Marked Complete (Click to Undo)' : 'Mark as Completed'}
                </button>

                {selectedCourse.isMission && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCourse(null);
                      setIsUploadModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Award className="w-4 h-4" />
                    Upload Mission Proof
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <a
                  href={selectedCourse.driveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Module Google Drive
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MINI GAME MODAL */}
      {isGameModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsGameModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 duration-200 border border-slate-100 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">BIPA Game: Indonesian Flavors & Spices</h3>
                  <div className="text-[11px] text-slate-500">Test your culinary vocabulary and cultural dining etiquette!</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGameModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-800">
                1. If you order food at a local stall and do not want any chili pepper, what do you say?
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { text: 'A. "Minta yang pedas banget, ya!"', correct: false },
                  { text: 'B. "Tolong jangan pakai cabai sama sekali ya, Bu."', correct: true },
                  { text: 'C. "Bumbu rendangnya ditambah dua sendok."', correct: false }
                ].map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setGameAnswers((prev) => ({ ...prev, q1: opt.correct }));
                      if (opt.correct) showToast('Correct answer! +10 Points');
                      else showToast('Incorrect, try again!');
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      gameAnswers.q1 !== undefined
                        ? opt.correct
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-rose-50 border-rose-200 text-rose-700'
                        : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-800">
                2. What is the traditional Indonesian counting unit for bunches of greens (spinach/water spinach)?
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { text: 'A. Tiga ikat kangkung (Three bunches)', correct: true },
                  { text: 'B. Tiga sisir kangkung', correct: false },
                  { text: 'C. Tiga ekor kangkung', correct: false }
                ].map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setGameAnswers((prev) => ({ ...prev, q2: opt.correct }));
                      if (opt.correct) showToast('Excellent! Greens are counted with "ikat".');
                      else showToast('Incorrect: "sisir" is for bananas, "ekor" is for fish/poultry!');
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      gameAnswers.q2 !== undefined
                        ? opt.correct
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-rose-50 border-rose-200 text-rose-700'
                        : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setGameAnswers({});
                  showToast('Game reset');
                }}
                className="text-xs text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Quiz
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsGameModalOpen(false);
                  showToast('Mini-game score saved to profile');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Done & Save Score
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {isNotifModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsNotifModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Student Notifications</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNotifModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-2xl border transition-colors ${
                    n.unread ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-bold text-slate-900 leading-snug">{n.title}</div>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">{n.desc}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                  showToast('All notifications marked as read');
                }}
                className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Mark All as Read
              </button>
              <button
                type="button"
                onClick={() => setIsNotifModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROGRESS & ATTENDANCE TABLE MODAL */}
      {isProgressModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsProgressModalOpen(false)}
          />

          <div className="relative w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[92vh]">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      Student Academic Recap Spring Semester 2026
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      {studentName} (NIM: BIPA-2026-081)
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {activeProgressTab === 'attendance' && 'Semester Attendance Audit Table (16 Sessions)'}
                    {activeProgressTab === 'missions' && 'Field Mission Progress Table (4 Missions)'}
                    {activeProgressTab === 'bap' && 'Logbook Signing & Official Minutes Verification (Dual-QR)'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsProgressModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setActiveProgressTab('attendance')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeProgressTab === 'attendance'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Semester Attendance (16 Sessions)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveProgressTab('missions')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeProgressTab === 'missions'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Field Missions (4 Missions)
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-7 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-slate-50/50">
              {activeProgressTab === 'attendance' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Present</div>
                      <div className="text-xl font-extrabold text-emerald-600">14 <span className="text-xs font-bold text-slate-400">of 16 Sessions</span></div>
                      <div className="text-[10px] text-slate-500 mt-0.5">87.5% Attendance Rate</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Excused Absence</div>
                      <div className="text-xl font-extrabold text-blue-600">1 <span className="text-xs font-bold text-slate-400">Session</span></div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Embassy Appointment</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Late</div>
                      <div className="text-xl font-extrabold text-amber-600">1 <span className="text-xs font-bold text-slate-400">Session</span></div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Transit Delay</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs">
                      <div className="text-[10px] font-bold text-emerald-800 uppercase">Completion Eligibility</div>
                      <div className="text-base font-extrabold text-emerald-800 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ELIGIBLE (≥ 75%)
                      </div>
                      <div className="text-[10px] text-emerald-700">Eligible for Final Exam</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <span className="text-xs font-bold text-slate-500 mr-1">Filter:</span>
                      {[
                        { id: 'ALL', label: 'All (16)' },
                        { id: 'PRESENT', label: 'Present (14)' },
                        { id: 'EXCUSED', label: 'Excused (1)' },
                        { id: 'LATE', label: 'Late (1)' },
                        { id: 'UPCOMING', label: 'Upcoming (2)' }
                      ].map((flt) => (
                        <button
                          key={flt.id}
                          type="button"
                          onClick={() => setAttendanceFilter(flt.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            attendanceFilter === flt.id
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {flt.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">16 Total Semester Sessions</span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Session</th>
                          <th className="px-4 py-3.5">Date & Time</th>
                          <th className="px-4 py-3.5">Topic & Syllabus</th>
                          <th className="px-4 py-3.5 text-center">Status</th>
                          <th className="px-4 py-3.5">Check-In</th>
                          <th className="px-4 py-3.5">Student Notes</th>
                          <th className="px-4 py-3.5 text-center">Minutes Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {attendanceRecords
                          .filter((rec) => (attendanceFilter === 'ALL' ? true : rec.status === attendanceFilter))
                          .map((rec) => (
                            <tr key={rec.meet} className="hover:bg-indigo-50/40 transition-colors">
                              <td className="px-4 py-3 font-bold text-slate-900">
                                Session {rec.meet}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                <span className="font-semibold text-slate-800">{rec.date}</span>
                                <br />
                                <span className="text-[10px] text-slate-400">{rec.time}</span>
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-800 max-w-[220px] truncate" title={rec.topic}>
                                {rec.topic}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {rec.status === 'PRESENT' && (
                                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                    <Check className="w-3 h-3" /> Present
                                  </span>
                                )}
                                {rec.status === 'EXCUSED' && (
                                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                    <Clock className="w-3 h-3" /> Excused
                                  </span>
                                )}
                                {rec.status === 'LATE' && (
                                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                    <AlertCircle className="w-3 h-3" /> Late
                                  </span>
                                )}
                                {rec.status === 'UPCOMING' && (
                                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                    Upcoming
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                                {rec.checkIn}
                              </td>
                              <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate" title={rec.note}>
                                {rec.note}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    rec.bapStatus === 'Approved'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : rec.bapStatus === 'In Progress'
                                      ? 'bg-pink-50 text-pink-700 border border-pink-200 animate-pulse'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {rec.bapStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeProgressTab === 'missions' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Missions Completed</div>
                      <div className="text-xl font-extrabold text-amber-600">
                        {missions.filter((m) => m.status === 'COMPLETED').length}{' '}
                        <span className="text-xs font-bold text-slate-400">of {missions.length} Missions</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {Math.round((missions.filter((m) => m.status === 'COMPLETED').length / (missions.length || 1)) * 100)}% Field Practicum Fulfilled
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Average Practicum Score</div>
                      <div className="text-xl font-extrabold text-emerald-600">91.0 <span className="text-xs font-bold text-slate-400">of 100</span></div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Faculty Evaluation Grade</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs">
                      <div className="text-[10px] font-bold text-amber-900 uppercase">Active Mission This Week</div>
                      <div className="text-base font-extrabold text-amber-900 mt-0.5">
                        Batik Workshop in Cigadung
                      </div>
                      <div className="text-[10px] text-amber-700">Deadline: April 10, 2026</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Code</th>
                          <th className="px-4 py-3.5">Mission Title</th>
                          <th className="px-4 py-3.5">Location</th>
                          <th className="px-4 py-3.5">Deadline</th>
                          <th className="px-4 py-3.5 text-center">Status</th>
                          <th className="px-4 py-3.5 text-center">Score</th>
                          <th className="px-4 py-3.5">Faculty Feedback</th>
                          <th className="px-4 py-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {missions.map((m) => (
                          <tr key={m.code} className="hover:bg-amber-50/40 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-900">
                              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg text-[11px]">
                                {m.code}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-bold text-slate-900">
                              {m.title}
                            </td>
                            <td className="px-4 py-3.5 text-slate-600 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              {m.location}
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-slate-700">
                              {m.deadline}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              {m.status === 'COMPLETED' ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                  <Check className="w-3 h-3" /> Completed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold animate-pulse">
                                  <Award className="w-3 h-3" /> Active
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-center font-bold">
                              {m.score ? (
                                <span className="text-emerald-700 font-extrabold text-sm">{m.score} of 100</span>
                              ) : (
                                <span className="text-slate-400 italic">Ungraded</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-slate-500 max-w-[220px] truncate" title={m.feedback}>
                              {m.feedback}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              {m.status === 'ACTIVE' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsProgressModalOpen(false);
                                    setIsUploadModalOpen(true);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                                >
                                  Upload Proof
                                </button>
                              ) : (
                                <a
                                  href={m.proofUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-bold text-xs"
                                >
                                  <ExternalLink className="w-3 h-3" /> View Photo
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeProgressTab === 'bap' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="space-y-1 text-left">
                      <div className="text-xs font-bold text-pink-900 flex items-center gap-2">
                        <PenTool className="w-4 h-4 text-pink-600" />
                        Dual-Verification & QR Digital Sign Protocol
                      </div>
                    </div>
                    {onViewBap && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsProgressModalOpen(false);
                          onViewBap();
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                      >
                        <FileText className="w-3.5 h-3.5 text-pink-300" />
                        Open Official Minutes
                      </button>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Session</th>
                          <th className="px-4 py-3.5">Class Date</th>
                          <th className="px-4 py-3.5">Faculty Signoff</th>
                          <th className="px-4 py-3.5">Student Representative</th>
                          <th className="px-4 py-3.5 text-center">Supervisor QA</th>
                          <th className="px-4 py-3.5 text-center">Cycle Status</th>
                          <th className="px-4 py-3.5 text-right">Document</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          {
                            meet: 1,
                            date: 'Feb 12, 2026',
                            teacherSigned: true,
                            teacherTime: 'Feb 12, 2026, 11:45 WIB',
                            studentSigned: true,
                            studentTime: 'Feb 12, 2026, 11:48 WIB',
                            supervisorApproved: true,
                            status: 'APPROVED'
                          },
                          {
                            meet: 2,
                            date: 'Feb 19, 2026',
                            teacherSigned: true,
                            teacherTime: 'Feb 19, 2026, 11:42 WIB',
                            studentSigned: true,
                            studentTime: 'Feb 19, 2026, 11:46 WIB',
                            supervisorApproved: true,
                            status: 'APPROVED'
                          },
                          {
                            meet: 3,
                            date: 'Feb 26, 2026',
                            teacherSigned: true,
                            teacherTime: 'Feb 26, 2026, 11:40 WIB',
                            studentSigned: true,
                            studentTime: 'Feb 26, 2026, 11:44 WIB',
                            supervisorApproved: true,
                            status: 'APPROVED'
                          },
                          {
                            meet: 4,
                            date: 'Mar 05, 2026',
                            teacherSigned: Boolean(teacherSignData),
                            teacherTime: teacherSignData ? teacherSignData.signedAt : 'Awaiting Faculty',
                            studentSigned: Boolean(studentRepSignData),
                            studentTime: studentRepSignData ? studentRepSignData.signedAt : teacherSignData ? 'Awaiting Student Rep' : 'Awaiting Faculty',
                            supervisorApproved: meetingStatus === 'SUPERVISOR_APPROVED',
                            status: meetingStatus === 'SUPERVISOR_APPROVED' ? 'APPROVED' : studentRepSignData ? 'SIGNED' : teacherSignData ? 'PENDING_REP' : 'DRAFT'
                          }
                        ].map((b) => (
                          <tr key={b.meet} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-900">
                              Session {b.meet}
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-slate-800">
                              {b.date}
                            </td>
                            <td className="px-4 py-3.5">
                              {b.teacherSigned ? (
                                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Faculty Signed ({b.teacherTime})</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-slate-400 italic">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Unsigned</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              {b.studentSigned ? (
                                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Student Signed ({b.studentTime})</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-pink-600 font-bold">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>{b.studentTime}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              {b.supervisorApproved ? (
                                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                  Endorsed (Prof. Hendra)
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                  b.status === 'APPROVED'
                                    ? 'bg-emerald-600 text-white'
                                    : b.status === 'SIGNED'
                                    ? 'bg-indigo-600 text-white'
                                    : b.status === 'PENDING_REP'
                                    ? 'bg-pink-600 text-white animate-pulse'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              {onViewBap && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsProgressModalOpen(false);
                                    onViewBap();
                                  }}
                                  className="text-indigo-600 hover:text-indigo-800 hover:underline font-bold text-xs cursor-pointer"
                                >
                                  View Minutes
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
            </div>

            <div className="p-5 sm:p-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => showToast('Downloading transcript in PDF...')}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  Download PDF Transcript
                </button>
                <button
                  type="button"
                  onClick={() => setIsProgressModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT PROFILE & DOSSIER MODAL */}
      {isStudentProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsStudentProfileModalOpen(false)}
          />

          <div className="relative w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[92vh]">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center text-white overflow-hidden shadow-md">
                    <img src="/student_avatar.jpg" alt="John Smith" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                        Regular BIPA B1 Student
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        NIM: BIPA-2026-081
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                      Johnathan Michael Smith 🇦🇺
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsStudentProfileModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setActiveProfileTab('biodata')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeProfileTab === 'biodata'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Biodata & Immigration Dossier
                </button>
                <button
                  type="button"
                  onClick={() => setActiveProfileTab('cefr')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeProfileTab === 'cefr'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Academic Transcript & CEFR
                </button>
                <button
                  type="button"
                  onClick={() => setActiveProfileTab('facilities')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeProfileTab === 'facilities'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Room Schedule & Campus Facilities
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-7 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-slate-50/50">
              {activeProfileTab === 'biodata' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5 w-1/3">Document Field</th>
                          <th className="px-4 py-3.5">Verified Data</th>
                          <th className="px-4 py-3.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { param: 'Student Identification Number (NIM)', val: 'BIPA-2026-081', status: 'Verified' },
                          { param: 'Full Name (Passport)', val: 'Johnathan Michael Smith', status: 'Matches Passport' },
                          { param: 'Nationality & Origin', val: 'Australia (Perth, WA)', status: 'Valid 🇦🇺' },
                          { param: 'Passport Number', val: 'PA-98214472 (Exp: Dec 14, 2029)', status: 'Active' },
                          { param: 'Stay Permit & Visa', val: 'Visa C316 (Student / BIPA Regular)', status: 'Valid until Nov 2026' },
                          { param: 'Program Sponsor', val: 'Darmasiswa RI / University Exchange', status: 'Active' },
                          { param: 'Academic Faculty Advisor', val: 'Dra. Siti Rahmawati, M.Hum. (NIDN: 0418097501)', status: 'Assigned' },
                          { param: 'Class & Cohort', val: 'BIPA B1 — Intermediate 1 (Spring 2026 Cohort)', status: 'Active Semester 2' },
                          { param: 'Emergency Contact', val: '+62 812-9988-1234 (UPI International House)', status: 'Registered' },
                        ].map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-800">{item.param}</td>
                            <td className="px-4 py-3.5 font-semibold text-indigo-900">{item.val}</td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeProfileTab === 'cefr' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Current GPA</div>
                      <div className="text-2xl font-extrabold text-emerald-600">3.85 <span className="text-xs font-bold text-slate-400">of 4.00</span></div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Proficiency Level</div>
                      <div className="text-2xl font-extrabold text-indigo-600">B1.2</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Total Study Hours</div>
                      <div className="text-2xl font-extrabold text-slate-900">96 Hours</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">UKBI Score</div>
                      <div className="text-2xl font-extrabold text-amber-600">580 <span className="text-xs font-bold text-slate-400">Points</span></div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Proficiency Component</th>
                          <th className="px-4 py-3.5">CEFR Level</th>
                          <th className="px-4 py-3.5 text-center">Score</th>
                          <th className="px-4 py-3.5 text-center">Grade</th>
                          <th className="px-4 py-3.5">Evaluator Assessment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { comp: 'Listening Comprehension', cefr: 'B1.2', score: 88, grade: 'A', note: 'Understands natural speed native speech with high comprehension.' },
                          { comp: 'Speaking & Field Dialogue', cefr: 'B1.1', score: 85, grade: 'A-', note: 'Confident in market bargaining; persuasive tone executed well.' },
                          { comp: 'Reading & Cultural Texts', cefr: 'B1.2', score: 90, grade: 'A', note: 'Market narrative and culinary vocabulary mastered.' },
                          { comp: 'Writing & Reflection Logbook', cefr: 'B1.1', score: 82, grade: 'B+', note: 'Affixation with ber- and ter- needs continued consistency.' },
                          { comp: 'Intercultural Competence', cefr: 'Superior', score: 94, grade: 'A+', note: 'Very polite, adapts rapidly to local etiquette and gestures.' },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-900">{row.comp}</td>
                            <td className="px-4 py-3.5">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold text-[11px]">
                                {row.cefr}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center font-extrabold text-slate-900">{row.score}</td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                                {row.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-slate-600 text-[11px]">{row.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeProfileTab === 'facilities' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Facility and Campus Location</th>
                          <th className="px-4 py-3.5">Building & Room</th>
                          <th className="px-4 py-3.5">Access Schedule</th>
                          <th className="px-4 py-3.5">Faculty in Charge</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { fac: 'BIPA B1 Theory Classroom', room: 'Language Building — Room 402', schedule: 'Mon & Wed, 10:00 - 11:40 WIB', pic: 'Dra. Siti Rahmawati' },
                          { fac: 'Multimedia Language Laboratory', room: 'Building B — Computer Lab 201', schedule: 'Tue, 13:00 - 15:00 WIB', pic: 'Dani (Lab Manager)' },
                          { fac: 'BIPA Library & Reading Corner', room: 'Central Library, 2nd Fl.', schedule: 'Mon - Fri, 08:00 - 16:30 WIB', pic: 'Ratna (Librarian)' },
                          { fac: 'Cultural Gastronomy Immersion Hall', room: 'Archipelago Cultural Building, 1st Fl.', schedule: 'Scheduled Thursday Practicums', pic: 'Dr. Maman Suryaman' },
                          { fac: 'Grammar & Remedial Clinic', room: 'BIPA Office — Consultation Rm 104', schedule: 'Fri, 09:00 - 11:00 WIB (By Appointment)', pic: 'Faculty Academic Advisor' },
                        ].map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-900">{item.fac}</td>
                            <td className="px-4 py-3.5 font-semibold text-indigo-700">{item.room}</td>
                            <td className="px-4 py-3.5 text-slate-600">{item.schedule}</td>
                            <td className="px-4 py-3.5 font-medium text-slate-800">{item.pic}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Generating Academic Record (PDF)...')}
                  className="px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  Print Academic Record (PDF)
                </button>
                <button
                  type="button"
                  onClick={() => setIsStudentProfileModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MASTER AGENDA & SCHEDULE TABLE MODAL */}
      {isAgendaModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsAgendaModalOpen(false)}
          />

          <div className="relative w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[92vh]">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      Academic Calendar Spring Semester 2026
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      Total 16 Sessions
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    BIPA B1 Master Agenda & Lecture Schedule Table
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAgendaModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-7 overflow-y-auto space-y-4 custom-scrollbar flex-1 bg-slate-50/50">
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                  <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5">Session & Date</th>
                      <th className="px-4 py-3.5">Time & Room</th>
                      <th className="px-4 py-3.5">Syllabus Topic</th>
                      <th className="px-4 py-3.5">Format</th>
                      <th className="px-4 py-3.5 text-center">Status</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { session: 'Session 1', date: 'Mar 03, 2026', time: '10:00 - 11:40', room: 'Room 402', topic: 'Course Orientation & Proficiency Pre-Test', type: 'Theory', status: 'COMPLETED' },
                      { session: 'Session 2', date: 'Mar 10, 2026', time: '10:00 - 11:40', room: 'Room 402', topic: 'Unit 1: Advanced Introductions & Professions', type: 'Theory & Discussion', status: 'COMPLETED' },
                      { session: 'Session 3', date: 'Mar 17, 2026', time: '10:00 - 11:40', room: 'Room 402', topic: 'Unit 2: City Navigation & Asking for Directions', type: 'Theory & Audio', status: 'COMPLETED' },
                      { session: 'Session 4', date: 'Today (Mar 24)', time: '10:00 - 11:40', room: 'Room 402', topic: 'Unit 4: Bargaining at Traditional Markets', type: 'Roleplay Simulation', status: 'ACTIVE' },
                      { session: 'Session 5', date: 'Mar 31, 2026', time: '10:00 - 11:40', room: 'Campus Canteen', topic: 'Mission 1: Independent Food Ordering & Practicum', type: 'Immersive Mission', status: 'UPCOMING' },
                      { session: 'Session 6', date: 'Apr 07, 2026', time: '10:00 - 11:40', room: 'Room 402', topic: 'Unit 5: Indonesian Culinary & Traditional Recipes', type: 'Theory & Audio', status: 'UPCOMING' },
                      { session: 'Session 7', date: 'Apr 14, 2026', time: '10:00 - 11:40', room: 'Room 402', topic: 'Unit 6: Medical Consultations & Health Services', type: 'Theory & Dialogue', status: 'UPCOMING' },
                      { session: 'Session 8', date: 'Apr 21, 2026', time: '09:00 - 12:00', room: 'Language Lab 201', topic: 'MIDTERM EVALUATION — Oral & Written Examination', type: 'Official Exam', status: 'UPCOMING' },
                      { session: 'Session 9', date: 'Apr 28, 2026', time: '10:00 - 11:40', room: 'Room 402', topic: 'Unit 7: Indonesian Cultural Traditions & Ceremonies', type: 'Cultural Theory', status: 'UPCOMING' },
                      { session: 'Session 10', date: 'May 05, 2026', time: '10:00 - 11:40', room: 'City Museum', topic: 'Mission 2: Educational Museum Visit & Interview', type: 'Immersive Mission', status: 'UPCOMING' },
                      { session: 'Session 11', date: 'May 12, 2026', time: '10:00 - 11:40', room: 'Room 402', topic: 'Unit 8: Regional Folklore & Traditional Legends', type: 'Critical Reading', status: 'UPCOMING' },
                      { session: 'Session 12', date: 'May 19, 2026', time: '10:00 - 11:40', room: 'Room 402', topic: 'Unit 9: Sustainable Tourism & Ecotourism', type: 'Presentation', status: 'UPCOMING' },
                      { session: 'Session 13', date: 'May 26, 2026', time: '10:00 - 11:40', room: 'Language Lab 201', topic: 'Unit 10: Broadcast News Listening & Interviews', type: 'Audio Lab', status: 'UPCOMING' },
                      { session: 'Session 14', date: 'Jun 02, 2026', time: '10:00 - 11:40', room: 'Room 402', topic: 'Unit 11: Argumentative Essay Composition', type: 'Guided Writing', status: 'UPCOMING' },
                      { session: 'Session 15', date: 'Jun 09, 2026', time: '10:00 - 11:40', room: 'BIPA Auditorium', topic: 'Cultural Performance & Final Dialogue Showcase', type: 'Showcase', status: 'UPCOMING' },
                      { session: 'Session 16', date: 'Jun 16, 2026', time: '09:00 - 12:00', room: 'Language Lab 201', topic: 'FINAL EXAMINATION (UAS) & B1 Certification', type: 'Final Exam', status: 'UPCOMING' },
                    ].map((row, idx) => (
                      <tr key={idx} className={`transition-colors ${row.status === 'ACTIVE' ? 'bg-indigo-50/70 font-semibold' : 'hover:bg-slate-50'}`}>
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900">{row.session}</div>
                          <div className="text-[10px] text-slate-500">{row.date}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-800">{row.time} WIB</div>
                          <div className="text-[10px] text-indigo-600 font-bold">{row.room}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900">{row.topic}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                            {row.type}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {row.status === 'COMPLETED' && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Completed
                            </span>
                          )}
                          {row.status === 'ACTIVE' && (
                            <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-bold text-[10px] shadow-sm animate-pulse">
                              ● Active Today
                            </span>
                          )}
                          {row.status === 'UPCOMING' && (
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px]">
                              Scheduled
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => showToast(`Opening courseware: ${row.session}`)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer text-xs"
                          >
                            Material
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-white border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsAgendaModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESOURCES REPOSITORY TABLE MODAL */}
      {isResourcesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsResourcesModalOpen(false)}
          />

          <div className="relative w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[92vh]">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      BIPA Cloud Digital Library
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Google Drive Cloud Sync
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    BIPA B1 Digital Learning Resources & Archive Repository Table
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsResourcesModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-7 overflow-y-auto space-y-4 custom-scrollbar flex-1 bg-slate-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Google Drive Storage</div>
                  <div className="text-xl font-extrabold text-indigo-600">1.2 GB <span className="text-xs font-bold text-slate-400">of 15 GB</span></div>
                  <div className="text-[10px] text-slate-500 mt-0.5">32 Verified Files</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Native Listening Audio</div>
                  <div className="text-xl font-extrabold text-violet-600">16 MP3 Recordings</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Standard & Conversational Indonesian</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Student Access Level</div>
                  <div className="text-sm font-extrabold text-emerald-700 mt-0.5">Full Download & Streaming</div>
                  <div className="text-[10px] text-slate-500">Enrolled B1 Spring 2026 Cohort</div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                  <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5">Resource Name</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Format</th>
                      <th className="px-4 py-3.5 text-center">Size</th>
                      <th className="px-4 py-3.5">Last Updated</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: 'BIPA B1 Course Module: Grammar & Thematic Dialogue', cat: 'Main E-Book', ext: 'PDF (240 Pages)', size: '18.4 MB', updated: 'Mar 02, 2026', link: 'https://drive.google.com' },
                      { name: 'Lecture Slides Unit 4: Bargaining in Traditional Markets', cat: 'Slides', ext: 'PPTX & PDF', size: '8.2 MB', updated: 'Yesterday, 14:20', link: 'https://drive.google.com' },
                      { name: 'Audio Track 04: Native Dialogue at Beringharjo Market', cat: 'Listening Audio', ext: 'MP3 (320 kbps)', size: '14.5 MB', updated: 'Mar 20, 2026', link: 'https://drive.google.com' },
                      { name: 'Student Worksheet: Counting Classifiers & Currency Numbers', cat: 'Worksheet', ext: 'DOCX / PDF', size: '2.1 MB', updated: 'Yesterday, 09:15', link: 'https://drive.google.com' },
                      { name: 'Cultural Photo & Video Gallery: Traditional Stalls', cat: 'Gallery', ext: 'Google Drive Album', size: '180 MB', updated: 'Mar 18, 2026', link: 'https://drive.google.com' },
                      { name: 'Semester Lesson Plan (RPS) BIPA B1 2026', cat: 'Official Syllabus', ext: 'PDF', size: '4.8 MB', updated: 'Mar 01, 2026', link: 'https://drive.google.com' },
                      { name: 'Independent Practice Question Bank & Answer Key Unit 1-4', cat: 'Self-Study', ext: 'Interactive PDF', size: '5.6 MB', updated: 'Mar 22, 2026', link: 'https://drive.google.com' },
                      { name: 'Immersive Field Mission Handbook & Evaluation Rubrics', cat: 'Field Guide', ext: 'PDF', size: '3.4 MB', updated: 'Mar 15, 2026', link: 'https://drive.google.com' },
                    ].map((file, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900">{file.name}</div>
                          <div className="text-[10px] text-slate-400">Published by BIPA Faculty Team</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                            {file.cat}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-700">{file.ext}</td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-800">{file.size}</td>
                        <td className="px-4 py-3.5 text-slate-500">{file.updated}</td>
                        <td className="px-4 py-3.5 text-right">
                          <a
                            href={file.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                          >
                            <Download className="w-3 h-3" />
                            Open / Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-white border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsResourcesModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
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
