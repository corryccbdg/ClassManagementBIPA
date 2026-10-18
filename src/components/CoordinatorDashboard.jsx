import React, { useState } from 'react';
import {
  LayoutGrid,
  Calendar as CalendarIcon,
  BookOpen,
  Settings,
  LogOut,
  Search,
  Bell,
  Clock,
  MapPin,
  User,
  ExternalLink,
  FolderOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  PenTool,
  Award,
  Sparkles,
  Folder,
  ShieldCheck,
  Users,
  Video,
  BarChart3,
  ListTodo,
  FileBadge2,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  Eye,
  Download,
  Send,
  QrCode,
  Printer,
  Headphones
} from 'lucide-react';
import DarmasiswaDashboardTable from './attendance/DarmasiswaDashboardTable';
import DarmasiswaRecapReport from './attendance/DarmasiswaRecapReport';
import CoordinatorMaterialModal from './materials/CoordinatorMaterialModal';

export default function CoordinatorDashboard({
  currentUser,
  sessionInfo,
  onLogout,
  onSwitchToTeacherView,
  meetingStatus,
  teacherSignData,
  studentRepSignData,
  onSupervisorApprove,
  darmasiswaSessions,
  onDarmasiswaSessionsChange,
  courses = [],
  onSaveCourse,
  onDeleteCourse,
}) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('darmasiswa'); // default to darmasiswa to see the Itenas QR attendance recap table
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isSuperviseModalOpen, setIsSuperviseModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isItenasReportModalOpen, setIsItenasReportModalOpen] = useState(false);

  // Material CRUD State for Coordinator
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materialFilterLevel, setMaterialFilterLevel] = useState('ALL');
  const [materialSearch, setMaterialSearch] = useState('');

  const filteredCourses = (courses || []).filter((course) => {
    const matchesLevel =
      materialFilterLevel === 'ALL' ||
      (course.level && course.level.toUpperCase().includes(materialFilterLevel.toUpperCase()));
    const q = (materialSearch || searchQuery || '').toLowerCase();
    const matchesQuery =
      !q ||
      course.title?.toLowerCase().includes(q) ||
      course.description?.toLowerCase().includes(q) ||
      course.bookTitle?.toLowerCase().includes(q) ||
      course.category?.toLowerCase().includes(q) ||
      course.topics?.some((t) => t.toLowerCase().includes(q));
    return matchesLevel && matchesQuery;
  });

  const handleOpenAddMaterial = () => {
    setEditingMaterial(null);
    setIsMaterialModalOpen(true);
  };

  const handleOpenEditMaterial = (course) => {
    setEditingMaterial(course);
    setIsMaterialModalOpen(true);
  };

  const handleDeleteMaterial = (courseId, title) => {
    if (window.confirm(`Are you sure you want to delete material "${title}"?`)) {
      if (onDeleteCourse) onDeleteCourse(courseId);
      showToast(`Material "${title}" successfully deleted.`);
    }
  };

  // Table Modal for Coordinator Metric Cards
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [activeMetricTab, setActiveMetricTab] = useState('classes'); // 'classes' | 'pendingBap' | 'compliance' | 'attendance'
  const [metricFilter, setMetricFilter] = useState('ALL');
  const [selectedClassDossier, setSelectedClassDossier] = useState(null);
  const [isClassDossierModalOpen, setIsClassDossierModalOpen] = useState(false);

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [classForm, setClassForm] = useState({
    name: '',
    level: 'B1',
    room: '',
    teacher: 'Dra. Siti Rahmawati, M.Hum.',
    driveLink: ''
  });
  const [classes, setClasses] = useState([]);

  React.useEffect(() => {
    let isMounted = true;
    async function fetchClasses() {
      try {
        const res = await fetch('/api/classes');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && isMounted) {
            const normalized = data.map((c) => ({
              id: c.id,
              name: c.name && c.description ? `${c.name} — ${c.description}` : c.name,
              level: c.code || c.level || 'B1',
              room: c.room || 'R. Nusantara 101',
              teacher: c.instructorName || c.teacher || 'Dra. Siti Rahmawati, M.Hum.',
              driveLink: c.driveMaterialsFolder || c.driveLink || 'https://drive.google.com',
            }));
            setClasses(normalized);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch classes from DB:', err);
      }
    }
    fetchClasses();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAddClass = () => {
    setEditingClassId(null);
    setClassForm({
      name: '',
      level: 'B1',
      room: '',
      teacher: 'Dra. Siti Rahmawati, M.Hum.',
      driveLink: ''
    });
    setIsClassModalOpen(true);
  };

  const handleOpenEditClass = (cls) => {
    setEditingClassId(cls.id);
    setClassForm({
      name: cls.name,
      level: cls.level,
      room: cls.room,
      teacher: cls.teacher,
      driveLink: cls.driveLink || ''
    });
    setIsClassModalOpen(true);
  };

  const handleSaveClass = async (e) => {
    if (e) e.preventDefault();
    if (!classForm.name.trim()) {
      showToast('Please enter the class name!');
      return;
    }

    const payload = {
      name: classForm.name,
      code: classForm.level,
      room: classForm.room,
      instructorName: classForm.teacher,
      driveMaterialsFolder: classForm.driveLink || 'https://drive.google.com'
    };

    if (editingClassId) {
      try {
        const res = await fetch(`/api/classes/${editingClassId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setClasses((prev) =>
            prev.map((c) => (c.id === editingClassId ? { ...c, ...classForm } : c))
          );
          showToast(`Class "${classForm.name}" updated successfully!`);
        }
      } catch (err) {
        console.warn('Failed to update class in DB:', err);
      }
    } else {
      try {
        const res = await fetch('/api/classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const newClass = await res.json();
          setClasses((prev) => [
            {
              id: newClass.id,
              name: newClass.name,
              level: newClass.code || classForm.level,
              room: newClass.room || classForm.room,
              teacher: newClass.instructorName || classForm.teacher,
              driveLink: newClass.driveMaterialsFolder || classForm.driveLink
            },
            ...prev
          ]);
          showToast(`New class "${classForm.name}" added successfully!`);
        }
      } catch (err) {
        console.warn('Failed to create class in DB:', err);
      }
    }
    setIsClassModalOpen(false);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = () => {
    onSupervisorApprove(feedback);
    setIsSuperviseModalOpen(false);
    showToast('Session verified & locked successfully. Official Teaching Report (BAP) has been issued.');
  };

  return (
    <div className="min-h-screen bg-[#e8f1ec] p-3 sm:p-5 lg:p-8 flex items-center justify-center font-sans antialiased text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-xl text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main App Container Card */}
      <div className="w-full max-w-[1440px] bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 relative">
        {/* ================= MAIN CONTENT DASHBOARD ================= */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar pb-24">
          {/* TOP BAR: Search & User Header */}
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 bg-white z-20 py-2 border-b border-slate-100">
            {/* Search Bar */}
            <div className="w-full sm:max-w-md relative">
              <div className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white border border-slate-200 rounded-xl px-3.5 py-2 transition-colors">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search classes, teachers, or BAP reports..."
                  className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-normal"
                />
              </div>
            </div>

            {/* Right Profile & Actions */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => showToast('No critical notifications')}
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2 border-2 border-white" />
              </button>

              {/* User Avatar & Name */}
              <div className="flex items-center gap-2.5 pl-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-lg">
                  {currentUser?.avatar || <User className="w-4 h-4 text-emerald-700" />}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{currentUser?.name || 'Prof. Dr. Irwan Susanto'}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{currentUser?.title || 'BIPA & Culture Program Coordinator'}</div>
                </div>
              </div>
            </div>
          </header>

          {/* METRICS WIDGETS (4 Columns) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. Total Active Classes */}
            <div
              onClick={() => {
                setActiveMetricTab('classes');
                setIsMetricModalOpen(true);
              }}
              className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col justify-between space-y-2.5 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  Even Semester
                </span>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">8 Classes</div>
                <span className="text-xs text-slate-500 font-medium">Active Classes</span>
              </div>
              <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-500">
                2 A1   1 A2   2 B1   1 B2   1 C1
              </div>
            </div>

            {/* 2. Pending BAP Verification */}
            <div
              onClick={() => {
                setActiveMetricTab('pendingBap');
                setIsMetricModalOpen(true);
              }}
              className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col justify-between space-y-2.5 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  Needs Review
                </span>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">3 Reports</div>
                <span className="text-xs text-slate-500 font-medium">Pending Approval</span>
              </div>
              <div className="pt-1.5 border-t border-slate-100 text-[11px] text-rose-600 font-medium">
                BIPA A1 session not yet verified
              </div>
            </div>

            {/* 3. Syllabus Compliance */}
            <div
              onClick={() => {
                setActiveMetricTab('compliance');
                setIsMetricModalOpen(true);
              }}
              className="rounded-xl bg-emerald-50/50 border border-emerald-200 p-4 flex flex-col justify-between space-y-2.5 shadow-xs hover:border-emerald-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-emerald-800">
                  Target 100%
                </span>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">92%</div>
                <span className="text-xs text-slate-600 font-medium">On-Schedule Curriculum</span>
                <div className="w-full bg-emerald-200/60 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
              <div className="pt-1.5 border-t border-emerald-200/60 text-[11px] text-emerald-800 font-medium">
                All units progressing well
              </div>
            </div>

            {/* 4. Average Attendance */}
            <div
              onClick={() => {
                setActiveMetricTab('attendance');
                setIsMetricModalOpen(true);
              }}
              className="rounded-xl bg-sky-50/50 border border-sky-200 p-4 flex flex-col justify-between space-y-2.5 shadow-xs hover:border-sky-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-sky-800">
                  Target 80%
                </span>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">88%</div>
                <span className="text-xs text-slate-600 font-medium">Average Attendance</span>
                <div className="w-full bg-sky-200/60 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-sky-600 h-full rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
              <div className="pt-1.5 border-t border-sky-200/60 text-[11px] text-slate-600 font-medium">
                2 students require attention
              </div>
            </div>
          </section>

          {/* MAIN CONTENT TABS (Queue vs Schedule vs Darmasiswa vs Materials) */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 overflow-visible flex-1 min-w-0">
            {/* TABS HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab('darmasiswa')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    activeTab === 'darmasiswa'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                  Itenas Attendance Recap
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('queue')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                    activeTab === 'queue'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Pending Approvals
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('schedule')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    activeTab === 'schedule'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  Class Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('materials')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    activeTab === 'materials'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  BIPA Materials & Syllabus ({courses.length})
                </button>
              </div>
            </div>

            {/* TAB 1: QUEUE TABLE */}
            {activeTab === 'queue' && (
              <div className="animate-in fade-in duration-200 h-full flex flex-col">
                <div className="overflow-x-auto rounded-2xl border border-slate-200 flex-1">
                  <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-800 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Course / Level</th>
                        <th className="px-4 py-3">Meeting</th>
                        <th className="px-4 py-3">Lead Teacher</th>
                        <th className="px-4 py-3">QR Status (Teacher & Student)</th>
                        <th className="px-4 py-3">Syllabus Compliance</th>
                        <th className="px-4 py-3 text-right">Supervision Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* Current Active Session Row (from Props) */}
                      {meetingStatus !== 'SUPERVISOR_APPROVED' && (
                        <tr className="bg-white hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="font-bold text-slate-900">{sessionInfo.className}</div>
                            <div className="text-[10px] text-slate-500">{sessionInfo.room}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-bold">M. 4</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-slate-800 text-xs">{sessionInfo.teacherName}</div>
                            <div className="text-[10px] text-slate-400">26 Mar 2026</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {teacherSignData ? (
                                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center" title="Teacher QR Verified"><CheckCircle2 className="w-3.5 h-3.5"/></span>
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center" title="Teacher QR Pending"><Clock className="w-3.5 h-3.5"/></span>
                              )}
                              {studentRepSignData ? (
                                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center" title="Student QR Verified"><CheckCircle2 className="w-3.5 h-3.5"/></span>
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center" title="Student QR Pending"><Clock className="w-3.5 h-3.5"/></span>
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
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                              >
                                Review & Approve BAP
                              </button>
                            ) : (
                              <button disabled className="bg-slate-100 text-slate-400 px-3 py-1.5 rounded-xl text-xs font-bold cursor-not-allowed">
                                Awaiting Dual-QR
                              </button>
                            )}
                          </td>
                        </tr>
                      )}

                      {/* Demo Mock Data */}
                      <tr className="bg-white hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-bold text-slate-900">BIPA A1 — Fundamentals 1</div>
                          <div className="text-[10px] text-slate-500">Room 101</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-bold">M. 5</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-800 text-xs">Pak Andi Wijaya</div>
                          <div className="text-[10px] text-slate-400">25 Mar 2026</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                             <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center" title="Teacher QR Verified"><CheckCircle2 className="w-3.5 h-3.5"/></span>
                             <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center" title="Student QR Verified"><CheckCircle2 className="w-3.5 h-3.5"/></span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">Material 1 Unit Behind</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button onClick={() => setIsSuperviseModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer">
                            Review & Approve BAP
                          </button>
                        </td>
                      </tr>

                      {meetingStatus === 'SUPERVISOR_APPROVED' && (
                        <tr className="bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="font-bold text-slate-900">{sessionInfo.className}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg text-xs font-bold">M. 4</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-slate-800 text-xs">{sessionInfo.teacherName}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Fully Approved (3 QRs)</span>
                          </td>
                          <td className="px-4 py-4">-</td>
                          <td className="px-4 py-4 text-right">
                            <button className="text-emerald-700 hover:underline text-xs font-bold flex items-center justify-end gap-1 w-full cursor-pointer">
                              <FileText className="w-4 h-4"/> Download Official BAP PDF
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: SCHEDULE & RESOURCES */}
            {activeTab === 'schedule' && (
              <div className="animate-in fade-in duration-200 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Class Management & Master Schedule</h3>
                    <div className="text-xs text-slate-500">Manage class rosters, lecture rooms, and teacher assignments.</div>
                  </div>
                  <button 
                    onClick={handleOpenAddClass}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Add New Class
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 flex-1">
                  <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-800 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Class Name</th>
                        <th className="px-4 py-3">Level</th>
                        <th className="px-4 py-3">Room</th>
                        <th className="px-4 py-3">Lead Teacher</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classes
                        .filter((cls) => {
                          if (!searchQuery) return true;
                          const q = searchQuery.toLowerCase();
                          return (
                            cls.name.toLowerCase().includes(q) ||
                            cls.teacher.toLowerCase().includes(q) ||
                            cls.room.toLowerCase().includes(q)
                          );
                        })
                        .map((cls) => (
                          <tr key={cls.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => { setSelectedClassDossier(cls); setIsClassDossierModalOpen(true); }}>
                            <td className="px-4 py-4 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{cls.name}</td>
                            <td className="px-4 py-4"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-bold">{cls.level}</span></td>
                            <td className="px-4 py-4 text-xs">{cls.room}</td>
                            <td className="px-4 py-4 font-semibold text-slate-800 text-xs">{cls.teacher}</td>
                            <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedClassDossier(cls);
                                    setIsClassDossierModalOpen(true);
                                  }}
                                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                  title="Class Dossier Details (Table)"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditClass(cls)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Class"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await fetch(`/api/classes/${cls.id}`, { method: 'DELETE' });
                                      setClasses((prev) => prev.filter((c) => c.id !== cls.id));
                                      showToast(`Class "${cls.name}" deleted successfully.`);
                                    } catch (err) {
                                      console.warn('Failed to delete class:', err);
                                    }
                                  }}
                                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Class"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: DARMASISWA ITENAS RECAP TABLE */}
            {activeTab === 'darmasiswa' && (
              <div className="animate-in fade-in duration-200 flex flex-col">
                <DarmasiswaDashboardTable
                  onOpenOfficialReportView={() => setIsItenasReportModalOpen(true)}
                  sessions={darmasiswaSessions}
                  onSessionsChange={onDarmasiswaSessionsChange}
                />
              </div>
            )}

            {/* TAB 4: MATERI & SILABUS BIPA (FULL CRUD FOR COORDINATOR) */}
            {activeTab === 'materials' && (
              <div className="animate-in fade-in duration-200 space-y-6">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 border border-slate-200/80 p-4 sm:p-5 rounded-2xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        BIPA Curriculum & Learning Materials
                      </h3>
                      <span className="bg-purple-100 text-purple-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {courses.length} Registered Units
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 max-w-2xl">
                      Manage syllabi, native listening audio files, vocabulary lists, grammar focuses, and student PDF documents in real-time.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddMaterial}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    + Add New Learning Unit
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {['ALL', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setMaterialFilterLevel(lvl)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          materialFilterLevel === lvl
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {lvl === 'ALL' ? 'All Levels' : `Level ${lvl}`}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search units, topics, vocabulary..."
                      value={materialSearch}
                      onChange={(e) => setMaterialSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                    >
                      {/* Thumbnail & Badges */}
                      <div className="relative h-40 overflow-hidden bg-slate-100 border-b border-slate-100">
                        <img
                          src={course.image || '/task_market.jpg'}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
                            {course.level || 'B1 Intermediate'}
                          </span>
                          {course.isMission && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                              <Award className="w-3 h-3" /> Immersive Mission
                            </span>
                          )}
                        </div>
                        <div className="absolute top-2.5 right-2.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-700/90 text-white backdrop-blur-xs">
                            {course.unitTitle || `Unit ${course.unitNumber}`}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                            <span className="truncate max-w-[140px]">{course.bookTitle || 'BIPA Textbook'}</span>
                            <span className="text-purple-600 font-semibold">{course.category}</span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-purple-600 transition-colors">
                            {course.title}
                          </h4>

                          <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {course.description}
                          </div>

                          {/* Audio Listening Track */}
                          <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                                <Headphones className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 truncate">{course.audioTitle || 'Audio Listening Track'}</div>
                                <div className="text-[10px] text-slate-500">Duration: {course.audioDuration || '15 Minutes'}</div>
                              </div>
                            </div>
                          </div>

                          {/* Topics List */}
                          {course.topics && course.topics.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Topics:</div>
                              <div className="flex flex-wrap gap-1">
                                {course.topics.slice(0, 3).map((topic, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                                  >
                                    {topic}
                                  </span>
                                ))}
                                {course.topics.length > 3 && (
                                  <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                                    +{course.topics.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Vocabulary Highlight */}
                          {course.vocabularies && course.vocabularies.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Essential Vocabulary ({course.vocabularies.length} words):
                              </div>
                              <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono">
                                {course.vocabularies.slice(0, 2).map((v, i) => (
                                  <div key={i} className="truncate">
                                    <strong className="text-purple-700">{v.term}</strong> = {v.meaning}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Grammar Focus */}
                          {course.grammarFocus && (
                            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 space-y-0.5">
                              <div className="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                Grammar Focus:
                              </div>
                              <div className="text-[11px] text-amber-800 line-clamp-1 italic">
                                {course.grammarFocus}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Actions Footer */}
                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          {course.driveUrl && (
                            <a
                              href={course.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-semibold text-slate-600 hover:text-purple-600 flex items-center gap-1 transition-colors"
                              title="Open Google Drive"
                            >
                              <ExternalLink className="w-3 h-3" /> Drive
                            </a>
                          )}
                          <div className="flex items-center gap-1.5 ml-auto">
                            <button
                              type="button"
                              onClick={() => handleOpenEditMaterial(course)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Edit Material Details"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMaterial(course.id, course.title)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs transition-colors cursor-pointer"
                              title="Delete Material"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredCourses.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">No matching learning materials</h4>
                    <div className="text-xs text-slate-500 max-w-sm mx-auto">
                      No material units found matching this level filter or search. Add a new unit or reset filters.
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenAddMaterial}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Learning Unit
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* SUPERVISOR APPROVAL MODAL */}
      {isSuperviseModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSuperviseModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Class Report (BAP) Verification & Signoff</h2>
              <button
                onClick={() => setIsSuperviseModalOpen(false)}
                className="w-7 h-7 rounded text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              ><X className="w-4 h-4" /></button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {/* Session Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1">
                   <div className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">Class & Topic</div>
                   <div className="font-bold text-slate-900 text-sm">{sessionInfo.className}</div>
                   <div className="text-xs text-slate-600">{sessionInfo.actual_unit}: {sessionInfo.actual_topic}</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                   <div className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Validation Status (Dual-QR)</div>
                   <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Valid</div>
                   <div className="text-xs text-emerald-700">Teacher and Student Representative have signed off.</div>
                </div>
              </div>

              {/* Evidence & Links Audit */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-slate-400"/> Activity Evidence Verification
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Folder className="w-4 h-4"/></div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Immersive Photo or Video Link</div>
                        <div className="text-[10px] text-slate-400">3 photos uploaded by teacher</div>
                      </div>
                    </div>
                    <a href="#" className="text-xs font-bold text-indigo-600 hover:underline">Open Link</a>
                  </div>
                </div>
              </div>

              {/* Evaluation Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Evaluation Notes / Supervisory Recommendations (Optional)</h4>
                <textarea 
                  className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  rows="3"
                  placeholder="Enter pedagogical feedback for the teacher..."
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
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-lg shadow-slate-900/20 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <FileBadge2 className="w-4 h-4 text-emerald-400" />
                  Approve & Lock Teaching Report
                </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT CLASS MODAL */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsClassModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {editingClassId ? 'Edit Class' : 'Add New Class'}
              </h2>
              <button
                type="button"
                onClick={() => setIsClassModalOpen(false)}
                className="w-7 h-7 rounded text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              ><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveClass}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Class Name</label>
                  <input
                    type="text"
                    required
                    value={classForm.name}
                    onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                    placeholder="e.g., BIPA B1 — Conversation & Culture Class"
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Level</label>
                    <select
                      value={classForm.level}
                      onChange={(e) => setClassForm({ ...classForm, level: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    >
                      <option value="A1">A1 — Beginner Basics</option>
                      <option value="A2">A2 — Upper Beginner</option>
                      <option value="B1">B1 — Intermediate</option>
                      <option value="B2">B2 — Upper Intermediate</option>
                      <option value="C1">C1 — Advanced Academic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Room</label>
                    <input
                      type="text"
                      required
                      value={classForm.room}
                      onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                      placeholder="e.g., Room 402, Language Building"
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Lead Teacher</label>
                  <select
                    value={classForm.teacher}
                    onChange={(e) => setClassForm({ ...classForm, teacher: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                  >
                    <option value="Dra. Siti Rahmawati, M.Hum.">Dra. Siti Rahmawati, M.Hum.</option>
                    <option value="Pak Andi Wijaya">Pak Andi Wijaya</option>
                    <option value="Ahmad Subagja, M.Hum.">Ahmad Subagja, M.Hum.</option>
                    <option value="Dr. Maman Suryaman">Dr. Maman Suryaman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Google Drive Folder Link (Materials & Syllabus)</label>
                  <input
                    type="url"
                    value={classForm.driveLink}
                    onChange={(e) => setClassForm({ ...classForm, driveLink: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
                >
                  {editingClassId ? 'Save Changes' : 'Save New Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= COORDINATOR METRIC TABLE MODAL ================= */}
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
                    <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                      BIPA Program Coordinator Panel   Even Semester 2026
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-slate-200">
                      Prof. Dr. Irwan Susanto
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {activeMetricTab === 'classes' && 'Master Data Table: 8 BIPA Classes & Cohorts'}
                    {activeMetricTab === 'pendingBap' && 'Class-Wide BAP Validation Backlog Monitoring Table'}
                    {activeMetricTab === 'compliance' && 'Syllabus Compliance Matrix & Material Deviation Audit Table'}
                    {activeMetricTab === 'attendance' && 'Cross-Class Student Attendance Recapitulation Table'}
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
                  onClick={() => setActiveMetricTab('classes')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMetricTab === 'classes'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Active Classes (8 Classes)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMetricTab('pendingBap')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMetricTab === 'pendingBap'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  BAP Backlog (3 Sessions)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMetricTab('compliance')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMetricTab === 'compliance'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Syllabus Compliance (92%)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMetricTab('attendance')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMetricTab === 'attendance'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Student Attendance (88%)
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-slate-50/50">
              {/* TAB 1: MASTER 8 CLASSES TABLE */}
              {activeMetricTab === 'classes' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">Total 8 Active Scheduled Classes:</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        2 A1   1 A2   2 B1   1 B2   1 C1   1 Culture
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMetricModalOpen(false);
                        handleOpenAddClass();
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add New Class
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Code</th>
                          <th className="px-4 py-3.5">Class & Cohort Name</th>
                          <th className="px-4 py-3.5">Level</th>
                          <th className="px-4 py-3.5">Lead Teacher</th>
                          <th className="px-4 py-3.5">Room</th>
                          <th className="px-4 py-3.5 text-center">Students</th>
                          <th className="px-4 py-3.5">Current Session</th>
                          <th className="px-4 py-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { code: 'CLS-B1-04', name: 'BIPA B1 — Conversation & Culture Class', level: 'B1', teacher: 'Dra. Siti Rahmawati, M.Hum.', room: 'Room 402, Language Building', students: 15, session: 'Meeting 4/16' },
                          { code: 'CLS-A1-01', name: 'BIPA A1 — Daily Communication (Class A)', level: 'A1', teacher: 'Pak Andi Wijaya', room: 'Room 101, Language Lab', students: 18, session: 'Meeting 5/16' },
                          { code: 'CLS-A1-02', name: 'BIPA A1 — Daily Communication (Class B)', level: 'A1', teacher: 'Pak Andi Wijaya', room: 'Room 102, Language Lab', students: 17, session: 'Meeting 4/16' },
                          { code: 'CLS-A2-01', name: 'BIPA A2 — Upper Beginner & Social Interaction', level: 'A2', teacher: 'Ahmad Subagja, M.Hum.', room: 'Room 201', students: 14, session: 'Meeting 4/16' },
                          { code: 'CLS-B1-02', name: 'BIPA B1 — Grammar & Thematic Vocabulary', level: 'B1', teacher: 'Dra. Siti Rahmawati, M.Hum.', room: 'Room 404', students: 16, session: 'Meeting 4/16' },
                          { code: 'CLS-B2-01', name: 'BIPA B2 — Discourse Structure & Rhetoric', level: 'B2', teacher: 'Dr. Maman Suryaman', room: 'Culture Hall 205', students: 12, session: 'Meeting 4/16' },
                          { code: 'CLS-C1-01', name: 'BIPA C1 — Academic Indonesian & Research', level: 'C1', teacher: 'Dr. Maman Suryaman', room: 'Seminar Room 301', students: 10, session: 'Meeting 3/16' },
                          { code: 'CLS-BDY-01', name: 'BIPA Culture — Gamelan & Batik Arts', level: 'Culture', teacher: 'Ki Dalang Suwondo', room: 'Art Pavilion', students: 20, session: 'Meeting 3/16' },
                        ].map((cls, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                              {cls.code}
                            </td>
                            <td className="px-4 py-3.5 font-bold text-slate-900">
                              {cls.name}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-lg text-[10px]">
                                Level {cls.level}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-slate-700 font-medium">
                              {cls.teacher}
                            </td>
                            <td className="px-4 py-3.5 text-slate-600 flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {cls.room}
                            </td>
                            <td className="px-4 py-3.5 text-center font-bold text-slate-800">
                              {cls.students} students
                            </td>
                            <td className="px-4 py-3.5 text-slate-600 font-semibold">
                              {cls.session}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsMetricModalOpen(false);
                                  handleOpenEditClass({ id: idx + 1, name: cls.name, level: cls.level, room: cls.room, teacher: cls.teacher, driveLink: 'https://drive.google.com' });
                                }}
                                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                              >
                                Edit Class
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: PENDING BAP TABLE */}
              {activeMetricTab === 'pendingBap' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Total Pending</div>
                      <div className="text-xl font-extrabold text-amber-600">3 BAP Sessions</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Awaiting teacher or student finalization</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Longest Delay</div>
                      <div className="text-xl font-extrabold text-rose-600">2 Days</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">BIPA A1 Fundamentals 1 M 5</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs">
                      <div className="text-[10px] font-bold text-amber-900 uppercase">Coordinator Action</div>
                      <div className="text-xs font-extrabold text-amber-950 mt-1">Send automated reminder broadcast to teacher</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Class & Cohort</th>
                          <th className="px-4 py-3.5">Meeting</th>
                          <th className="px-4 py-3.5">Lead Teacher</th>
                          <th className="px-4 py-3.5">Date</th>
                          <th className="px-4 py-3.5 text-center">Delay</th>
                          <th className="px-4 py-3.5 text-center">Validation Status</th>
                          <th className="px-4 py-3.5 text-right">Quick Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { className: 'BIPA A1 — Daily Communication (Class A)', meet: 'M. 5', teacher: 'Pak Andi Wijaya', date: '24 Mar 2026', delay: '2 Days Overdue', status: 'Teacher has not recorded attendance' },
                          { className: 'BIPA B1 — Conversation & Culture Class', meet: 'M. 4', teacher: 'Dra. Siti Rahmawati, M.Hum.', date: '26 Mar 2026', delay: 'Today', status: 'Session currently active' },
                          { className: 'BIPA C1 — Academic Indonesian', meet: 'M. 3', teacher: 'Dr. Maman Suryaman', date: '25 Mar 2026', delay: '1 Day Overdue', status: 'Awaiting student rep signature' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-900">
                              {row.className}
                            </td>
                            <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                              {row.meet}
                            </td>
                            <td className="px-4 py-3.5 text-slate-700 font-medium">
                              {row.teacher}
                            </td>
                            <td className="px-4 py-3.5 text-slate-600">
                              {row.date}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                                {row.delay}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center text-slate-600 italic">
                              {row.status}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => showToast(`BAP reminder notification sent to ${row.teacher}!`)}
                                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ml-auto"
                              >
                                <Send className="w-3 h-3" /> Send Reminder
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: CURRICULUM COMPLIANCE TABLE */}
              {activeMetricTab === 'compliance' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm">Program Average Syllabus Compliance: 92.4%</div>
                      <div className="text-[11px] text-emerald-700 mt-0.5">Based on Semester Learning Plan RPS vs teacher actual logbook alignment</div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-xs shrink-0">
                      Superior Accreditation Standard
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Class & Level</th>
                          <th className="px-4 py-3.5">Planned Curriculum (RPS)</th>
                          <th className="px-4 py-3.5">Teacher Actual Delivery</th>
                          <th className="px-4 py-3.5 text-center">Match</th>
                          <th className="px-4 py-3.5">Evaluation / Deviation Notes</th>
                          <th className="px-4 py-3.5 text-center">QA Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { cls: 'BIPA B1 — Conversation & Culture', rps: 'Unit 4: Bargaining in Traditional Markets', real: 'Unit 4: BIPA Pop-up Market Roleplay', score: '98%', note: 'Highly aligned; simulated rupiah mock currency included', status: 'VERIFIED' },
                          { cls: 'BIPA A1 — Fundamentals', rps: 'Unit 5: Directions & Public Transport', real: 'Unit 4: Drill on Tens of Thousands Numbers', score: '82%', note: 'Deviation: Foreign students required extra pronunciation drill', status: 'ADJUSTED' },
                          { cls: 'BIPA B2 — Grammar Structure', rps: 'Unit 4: Affixes Ber-kan / Di-kan', real: 'Unit 4: Discourse Text Analysis of Ber-kan', score: '95%', note: 'Fully compliant with syllabus target', status: 'VERIFIED' },
                          { cls: 'BIPA C1 — Academic', rps: 'Unit 3: Scientific Abstract Writing', real: 'Unit 3: Journal Article Structure Analysis', score: '94%', note: 'Method tailored for postgraduate researchers', status: 'VERIFIED' },
                        ].map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-900">{r.cls}</td>
                            <td className="px-4 py-3.5 text-slate-600">{r.rps}</td>
                            <td className="px-4 py-3.5 text-slate-800 font-medium">{r.real}</td>
                            <td className="px-4 py-3.5 text-center font-bold text-emerald-700">{r.score}</td>
                            <td className="px-4 py-3.5 text-slate-500 max-w-[240px] truncate" title={r.note}>{r.note}</td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: ATTENDANCE RECAP TABLE */}
              {activeMetricTab === 'attendance' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Program Average</div>
                      <div className="text-xl font-extrabold text-sky-600">88.4%</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Minimum graduation threshold: 75%</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">At-Risk Students</div>
                      <div className="text-xl font-extrabold text-rose-600">2 Students</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Attendance under 80% Requires counseling</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Total Enrolled Students</div>
                      <div className="text-xl font-extrabold text-slate-900">122 Students</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">From 24 partner countries</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                      <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">Class</th>
                          <th className="px-4 py-3.5">Lead Teacher</th>
                          <th className="px-4 py-3.5 text-center">Total Students</th>
                          <th className="px-4 py-3.5 text-center">Average Attendance</th>
                          <th className="px-4 py-3.5 text-center">Excused / Sick</th>
                          <th className="px-4 py-3.5 text-center">Students &lt; 75%</th>
                          <th className="px-4 py-3.5 text-right">Class Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { cls: 'BIPA B1 — Conversation & Culture', teacher: 'Dra. Siti Rahmawati, M.Hum.', total: 15, att: '87.5%', excused: '6.2%', atRisk: 0, status: 'NORMAL' },
                          { cls: 'BIPA A1 — Fundamentals (Class A)', teacher: 'Pak Andi Wijaya', total: 18, att: '91.2%', excused: '4.8%', atRisk: 0, status: 'NORMAL' },
                          { cls: 'BIPA A1 — Fundamentals (Class B)', teacher: 'Pak Andi Wijaya', total: 17, att: '84.0%', excused: '8.0%', atRisk: 1, status: 'WATCH' },
                          { cls: 'BIPA A2 — Upper Beginner', teacher: 'Ahmad Subagja, M.Hum.', total: 14, att: '89.0%', excused: '5.5%', atRisk: 0, status: 'NORMAL' },
                          { cls: 'BIPA B2 — Grammar Structure', teacher: 'Dr. Maman Suryaman', total: 12, att: '93.5%', excused: '3.0%', atRisk: 0, status: 'NORMAL' },
                          { cls: 'BIPA C1 — Academic Research', teacher: 'Dr. Maman Suryaman', total: 10, att: '82.0%', excused: '10.0%', atRisk: 1, status: 'WATCH' },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-sky-50/30 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-900">{row.cls}</td>
                            <td className="px-4 py-3.5 text-slate-700">{row.teacher}</td>
                            <td className="px-4 py-3.5 text-center font-bold text-slate-800">{row.total}</td>
                            <td className="px-4 py-3.5 text-center font-bold text-emerald-700">{row.att}</td>
                            <td className="px-4 py-3.5 text-center text-slate-600">{row.excused}</td>
                            <td className="px-4 py-3.5 text-center font-bold">
                              {row.atRisk > 0 ? (
                                <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px]">
                                  {row.atRisk} Students
                                </span>
                              ) : (
                                <span className="text-slate-400">0</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                row.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Quick Shortcut to Itenas Darmasiswa Recap */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-indigo-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900">Format Lembar Rekap Presensi Resmi (Kop Surat Itenas Bandung)</div>
                        <div className="text-[11px] text-slate-600">Presensi Darmasiswa RI dengan Tanda Tangan QR Code Digital Mahasiswa dan Fasilitator</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMetricModalOpen(false);
                        setActiveTab('darmasiswa');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      Open Itenas Format Table 
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                BIPA Internal Quality Assurance System   Data automatically synchronized.
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

      {/* ================= CLASS DOSSIER DETAIL TABLE MODAL ================= */}
      {isClassDossierModalOpen && selectedClassDossier && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsClassDossierModalOpen(false)}
          />

          <div className="relative w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[92vh]">
            <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                      Class Academic Dossier   {selectedClassDossier.level}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-slate-200">
                      {selectedClassDossier.room}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {selectedClassDossier.name}
                  </h3>
                  <div className="text-xs text-slate-300">
                    Lead Teacher: <strong>{selectedClassDossier.teacher}</strong>   Even Semester 2026 BIPA Itenas
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsClassDossierModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-7 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-slate-50/50">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Class Capacity</div>
                  <div className="text-xl font-extrabold text-slate-900">{selectedClassDossier.students || 15} Students</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Average Attendance</div>
                  <div className="text-xl font-extrabold text-emerald-600">92.4%</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Sessions Completed</div>
                  <div className="text-xl font-extrabold text-indigo-600">4 of 16 Sessions</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Syllabus Compliance</div>
                  <div className="text-xl font-extrabold text-amber-600">96% Aligned</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Enrolled Student Roster
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                    <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Student ID</th>
                        <th className="px-4 py-3">Origin Country</th>
                        <th className="px-4 py-3 text-center">Attendance Rate</th>
                        <th className="px-4 py-3 text-center">Academic Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: 'Johnathan Michael Smith', nim: 'BIPA-2026-081', country: 'Australia 🇦🇺', att: '100% (4/4)', st: 'Active Regular' },
                        { name: 'Aiko Tanaka', nim: 'BIPA-2026-082', country: 'Japan 🇯🇵', att: '100% (4/4)', st: 'Active Regular' },
                        { name: 'Pierre Dubois', nim: 'BIPA-2026-083', country: 'France 🇫🇷', att: '75% (3/4)', st: 'Excused (Sick)' },
                        { name: 'Kim Min-seo', nim: 'BIPA-2026-084', country: 'South Korea 🇰🇷', att: '100% (4/4)', st: 'Active Regular' },
                        { name: 'Elena Rostova', nim: 'BIPA-2026-085', country: 'Russia 🇷🇺', att: '100% (4/4)', st: 'Active Regular' },
                        { name: 'Chen Wei', nim: 'BIPA-2026-086', country: 'China 🇨🇳', att: '100% (4/4)', st: 'Active Regular' },
                        { name: 'Lukas Schneider', nim: 'BIPA-2026-087', country: 'Germany 🇩🇪', att: '100% (4/4)', st: 'Active Regular' },
                      ].map((std, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-500">{idx + 1}</td>
                          <td className="px-4 py-3 font-bold text-slate-900">{std.name}</td>
                          <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{std.nim}</td>
                          <td className="px-4 py-3 text-slate-700">{std.country}</td>
                          <td className="px-4 py-3 text-center font-bold text-emerald-700">{std.att}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                              {std.st}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Teaching Report (BAP) Validation History (Sessions 1-4)
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                    <thead className="bg-slate-100/80 text-slate-800 font-extrabold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Session</th>
                        <th className="px-4 py-3">Execution Date</th>
                        <th className="px-4 py-3">Curriculum Topic (RPS)</th>
                        <th className="px-4 py-3 text-center">Dual-QR Status</th>
                        <th className="px-4 py-3 text-center">Supervisor Approval</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { meet: 'Meeting 1', date: '03 Mar 2026', topic: 'Orientation & Initial Proficiency Diagnostics', qr: 'Complete (2 QRs)', sup: 'Approved', status: 'LOCKED' },
                        { meet: 'Meeting 2', date: '10 Mar 2026', topic: 'Unit 1: Advanced Introductions & Professions', qr: 'Complete (2 QRs)', sup: 'Approved', status: 'LOCKED' },
                        { meet: 'Meeting 3', date: '17 Mar 2026', topic: 'Unit 2: Public Transport & Giving Directions', qr: 'Complete (2 QRs)', sup: 'Approved', status: 'LOCKED' },
                        { meet: 'Meeting 4', date: '24 Mar 2026 (Today)', topic: 'Unit 4: Bargaining in Traditional Markets', qr: 'Signing in Progress', sup: 'Pending', status: 'PENDING' },
                      ].map((bap, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900">{bap.meet}</td>
                          <td className="px-4 py-3 text-slate-500">{bap.date}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{bap.topic}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              bap.status === 'LOCKED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {bap.qr}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              bap.status === 'LOCKED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {bap.sup}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => showToast(`Downloading archived BAP document ${bap.meet} (PDF)...`)}
                              className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer"
                            >
                              Download PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                BIPA Curriculum & Class Management Center, Institut Teknologi Nasional Bandung.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast(`Printing Collective Report & Attendance for ${selectedClassDossier.name} (PDF)...`)}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  Print Class Recap (PDF)
                </button>
                <button
                  type="button"
                  onClick={() => setIsClassDossierModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
                >
                  Close
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
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Lembar Rekapitulasi Presensi Resmi (Kop Surat Resmi Itenas Bandung)
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

      {/* ================= COORDINATOR MATERIAL CRUD MODAL ================= */}
      <CoordinatorMaterialModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        onSave={onSaveCourse}
        initialData={editingMaterial}
      />
    </div>
  );
}
