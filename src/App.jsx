import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import SuperAdminSidebar, { SUPERADMIN_PERSONAS } from './components/common/SuperAdminSidebar';

import DarmasiswaRecapReport from './components/attendance/DarmasiswaRecapReport';
import { initialDarmasiswaSessions } from './data/darmasiswaRecapData';
import { initialCourses } from './data/coursesData';

const initialStudents = [
  { id: 'std-1', name: 'Sarah Jenkins', country: 'Australia', nim: 'BIPA-2026-081', avatar: '🇦🇺' },
  { id: 'std-2', name: 'Kenji Sato', country: 'Japan', nim: 'BIPA-2026-082', avatar: '🇯🇵' },
  { id: 'std-3', name: 'Min-jun Park', country: 'South Korea', nim: 'BIPA-2026-083', avatar: '🇰🇷' },
  { id: 'std-4', name: 'Emma Watson-Brown', country: 'United Kingdom', nim: 'BIPA-2026-084', avatar: '🇬🇧' },
  { id: 'std-5', name: 'Hans Müller', country: 'Germany', nim: 'BIPA-2026-085', avatar: '🇩🇪' },
  { id: 'std-6', name: 'Camille Dubois', country: 'France', nim: 'BIPA-2026-086', avatar: '🇫🇷' },
  { id: 'std-7', name: 'Alexander Rossi', country: 'Italy', nim: 'BIPA-2026-087', avatar: '🇮🇹' },
  { id: 'std-8', name: 'Li Wei', country: 'China', nim: 'BIPA-2026-088', avatar: '🇨🇳' },
  { id: 'std-9', name: 'Elena Petrova', country: 'Russia', nim: 'BIPA-2026-089', avatar: '🇷🇺' },
  { id: 'std-10', name: 'Carlos Mendoza', country: 'Spain', nim: 'BIPA-2026-090', avatar: '🇪🇸' },
  { id: 'std-11', name: 'Fatima Al-Mansoor', country: 'United Arab Emirates', nim: 'BIPA-2026-091', avatar: '🇦🇪' },
  { id: 'std-12', name: 'Lucas Silva', country: 'Brazil', nim: 'BIPA-2026-092', avatar: '🇧🇷' },
  { id: 'std-13', name: 'Amina Diallo', country: 'Senegal', nim: 'BIPA-2026-093', avatar: '🇸🇳' },
  { id: 'std-14', name: 'Oliver Schmidt', country: 'Austria', nim: 'BIPA-2026-094', avatar: '🇦🇹' },
  { id: 'std-15', name: 'Ananya Sharma', country: 'India', nim: 'BIPA-2026-095', avatar: '🇮🇳' },
];

// Valid views across Lentera BIPA
const VALID_VIEWS = [
  'login',
  'superadmin',
  'coordinator',
  'supervisor',
  'teacher',
  'student',
  'itenas-recap',
  'forgot-password'
];

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lentera BIPA ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn(e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 text-white">
          <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Display Issue Encountered</h2>
            <div className="text-xs text-slate-300 leading-relaxed mb-6">
              The browser session encountered an unexpected cache or component issue. Please click below to reset your session and return to the login screen.
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                Reset Session & Return to Login
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
              >
                Reload Page
              </button>
            </div>
            {this.state.error && (
              <div className="mt-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-left overflow-x-auto text-[10px] font-mono text-red-400">
                {String(this.state.error?.message || this.state.error)}
              </div>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [currentView, setCurrentView] = useState(() => {
    try {
      const saved = localStorage.getItem('bipa_current_view');
      if (saved && VALID_VIEWS.includes(saved)) {
        return saved;
      }
      // Clean up legacy or invalid views (e.g. 'signup', 'bap')
      localStorage.removeItem('bipa_current_view');
    } catch (e) {
      console.warn(e);
    }
    return 'login';
  });
  const [lastAuthorizedRole, setLastAuthorizedRole] = useState(() => {
    return localStorage.getItem('bipa_last_role') || 'coordinator';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bipa_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Super Admin Omni-Access Session State
  const [isSuperAdmin, setIsSuperAdmin] = useState(() => {
    try {
      const savedUser = localStorage.getItem('bipa_current_user');
      const parsed = savedUser ? JSON.parse(savedUser) : null;
      return (
        localStorage.getItem('bipa_is_superadmin') === 'true' ||
        parsed?.role === 'superadmin' ||
        parsed?.username === 'admin'
      );
    } catch {
      return false;
    }
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('bipa_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      localStorage.setItem('bipa_admin_sidebar_collapsed', !prev ? 'true' : 'false');
      return !prev;
    });
  };

  useEffect(() => {
    localStorage.setItem('bipa_is_superadmin', isSuperAdmin ? 'true' : 'false');
  }, [isSuperAdmin]);

  // Handler for Super Admin switching across all roles & views seamlessly
  const handleSuperAdminSwitchRole = (roleKey) => {
    const persona = SUPERADMIN_PERSONAS[roleKey] || SUPERADMIN_PERSONAS.superadmin;
    setCurrentUser(persona);
    setCurrentView(roleKey);
    if (['coordinator', 'supervisor', 'superadmin'].includes(roleKey)) {
      setLastAuthorizedRole(roleKey);
    }
  };

  // Persist session to localStorage
  useEffect(() => {
    if (VALID_VIEWS.includes(currentView)) {
      localStorage.setItem('bipa_current_view', currentView);
    } else {
      localStorage.setItem('bipa_current_view', 'login');
    }
  }, [currentView]);

  useEffect(() => {
    if (lastAuthorizedRole) {
      localStorage.setItem('bipa_last_role', lastAuthorizedRole);
    }
  }, [lastAuthorizedRole]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bipa_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Dynamic Students State & Database Sync
  const [students, setStudents] = useState(initialStudents);

  useEffect(() => {
    let isMounted = true;
    async function fetchStudents() {
      try {
        const res = await fetch('/api/students');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            setStudents(data);
          }
        }
      } catch (err) {
        console.warn('Failed to load students from DB:', err);
      }
    }
    fetchStudents();
    return () => { isMounted = false; };
  }, []);

  // Session & Meeting State (Synced from Database)
  const [sessionInfo, setSessionInfo] = useState({
    id: 'meet-bipa-2026-04',
    class_id: 'cls-bipa-b1',
    className: 'BIPA B1 — Kelas Percakapan & Budaya',
    meeting_number: 4,
    meeting_date: '2026-03-26',
    start_time: '10:00',
    end_time: '11:40',
    actual_unit: 'Unit 4',
    actual_topic: 'Tawar-Menawar di Pasar Tradisional & Etika Berbelanja',
    room: 'Ruang 402, Gedung Bahasa',
    teacherName: currentUser?.role === 'teacher' ? currentUser.name : 'Dra. Siti Rahmawati, M.Hum.',
  });

  const [attendances, setAttendances] = useState(() => {
    const map = {};
    initialStudents.forEach((s, idx) => {
      if (idx === 4) {
        map[s.id] = { status: 'EXCUSED', notes: 'Excused: Embassy appointment' };
      } else if (idx === 7) {
        map[s.id] = { status: 'LATE', notes: 'Late: 15 mins bus delay' };
      } else {
        map[s.id] = { status: 'PRESENT', notes: '' };
      }
    });
    return map;
  });

  const [teacherSignData, setTeacherSignData] = useState(null);
  const [studentRepSignData, setStudentRepSignData] = useState(null);
  const [meetingStatus, setMeetingStatus] = useState('DRAFT'); // 'DRAFT' | 'PENDING_REP_SIGN' | 'SIGNED' | 'SUPERVISOR_APPROVED'

  // Fetch meeting record & attendance from DB
  useEffect(() => {
    let isMounted = true;
    async function fetchMeetings() {
      try {
        const res = await fetch('/api/meetings');
        if (res.ok) {
          const records = await res.json();
          if (Array.isArray(records) && records.length > 0 && isMounted) {
            const activeMeet = records.find(m => m.id === 'meet-bipa-2026-04') || records[records.length - 1];
            if (activeMeet) {
              setSessionInfo(prev => ({
                ...prev,
                id: activeMeet.id,
                class_id: activeMeet.classId || prev.class_id,
                className: activeMeet.className || prev.className,
                meeting_number: activeMeet.meetingNumber || prev.meeting_number,
                meeting_date: activeMeet.date || prev.meeting_date,
                start_time: activeMeet.time?.split(' - ')[0] || prev.start_time,
                end_time: activeMeet.time?.split(' - ')[1] || prev.end_time,
                actual_topic: activeMeet.topic || prev.actual_topic,
                room: activeMeet.room || prev.room,
                teacherName: activeMeet.teacherName || prev.teacherName,
              }));

              if (Array.isArray(activeMeet.attendance) && activeMeet.attendance.length > 0) {
                const attMap = {};
                activeMeet.attendance.forEach(a => {
                  attMap[a.studentId] = {
                    status: a.status === 'Hadir' ? 'PRESENT' : a.status === 'Izin' ? 'EXCUSED' : a.status === 'Sakit' ? 'EXCUSED' : a.status || 'PRESENT',
                    notes: a.note || a.notes || ''
                  };
                });
                setAttendances(attMap);
              }

              if (activeMeet.signatures) {
                if (activeMeet.signatures.teacher?.signed) {
                  setTeacherSignData(activeMeet.signatures.teacher.signatureDataUrl || 'signed');
                }
                if (activeMeet.signatures.studentRep?.signed) {
                  setStudentRepSignData(activeMeet.signatures.studentRep.signatureDataUrl || 'signed');
                }
                if (activeMeet.signatures.supervisor?.status === 'Approved') {
                  setMeetingStatus('SUPERVISOR_APPROVED');
                } else if (activeMeet.signatures.studentRep?.signed && activeMeet.signatures.teacher?.signed) {
                  setMeetingStatus('SIGNED');
                } else if (activeMeet.signatures.teacher?.signed) {
                  setMeetingStatus('PENDING_REP_SIGN');
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load meeting from DB:', err);
      }
    }
    fetchMeetings();
    return () => { isMounted = false; };
  }, []);

  // ── Darmasiswa Shared State & Backend Synchronization ─────────────────────
  const [darmasiswaSessions, setDarmasiswaSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('bipa_darmasiswa_sessions');
      return saved ? JSON.parse(saved) : initialDarmasiswaSessions;
    } catch {
      return initialDarmasiswaSessions;
    }
  });

  // Fetch latest sessions from backend API on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchSessions() {
      try {
        const res = await fetch('/api/darmasiswa/sessions');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            setDarmasiswaSessions(data);
            localStorage.setItem('bipa_darmasiswa_sessions', JSON.stringify(data));
          }
        }
      } catch {
        // Use local state if server is not reachable
      }
    }
    fetchSessions();
    return () => { isMounted = false; };
  }, []);

  // Save to localStorage whenever sessions change
  useEffect(() => {
    if (darmasiswaSessions && darmasiswaSessions.length > 0) {
      localStorage.setItem('bipa_darmasiswa_sessions', JSON.stringify(darmasiswaSessions));
    }
  }, [darmasiswaSessions]);

  // ── Courses / Materials Shared State & DB Synchronization ─────────────────
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('bipa_courses');
      return saved ? JSON.parse(saved) : initialCourses;
    } catch {
      return initialCourses;
    }
  });

  // Fetch latest courses from DB
  useEffect(() => {
    let isMounted = true;
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            setCourses(data);
            localStorage.setItem('bipa_courses', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.warn('Failed to fetch courses from DB:', err);
      }
    }
    fetchCourses();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (courses && courses.length > 0) {
      localStorage.setItem('bipa_courses', JSON.stringify(courses));
    }
  }, [courses]);

  const handleSaveCourse = (savedCourse) => {
    setCourses((prev) => {
      const exists = prev.find((c) => c.id === savedCourse.id);
      if (exists) {
        return prev.map((c) => (c.id === savedCourse.id ? savedCourse : c));
      }
      return [savedCourse, ...prev];
    });

    // Persist to Database API
    fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savedCourse),
    }).catch((err) => console.warn('Failed to sync course to DB:', err));
  };

  const handleDeleteCourse = (courseId) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));

    // Delete in Database API
    fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    }).catch((err) => console.warn('Failed to delete course in DB:', err));
  };

  /**
   * Called when a Dosen/Facilitator finishes a Darmasiswa session and signs.
   * Creates a new session entry (or marks an existing one as signed).
   */
  const handleDarmasiswaFacilitatorSign = (newSession) => {
    const sessionPayload = { ...newSession, facilitatorSigned: true };
    setDarmasiswaSessions((prev) => {
      const exists = prev.find((s) => s.id === sessionPayload.id);
      if (exists) {
        return prev.map((s) =>
          s.id === sessionPayload.id ? { ...s, ...sessionPayload } : s
        );
      }
      return [...prev, sessionPayload];
    });

    // Sync to backend API
    fetch('/api/darmasiswa/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionPayload),
    }).catch((err) => console.warn('Failed to sync session to backend:', err));
  };

  /**
   * Called when a Darmasiswa student checks in for a session.
   * Updates the attendance record for that student in that session.
   */
  const handleDarmasiswaStudentAttend = (sessionId, nim, attendData) => {
    const checkInData = {
      attended: true,
      status: 'PRESENT',
      note: attendData?.note || 'Present via student check-in',
      signTime: attendData?.signTime || new Date().toLocaleString('en-US') + ' (Local Time)',
    };

    setDarmasiswaSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          attendances: {
            ...s.attendances,
            [nim]: checkInData,
          },
        };
      })
    );

    // Sync to backend API
    fetch(`/api/darmasiswa/sessions/${sessionId}/student-checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nim, ...checkInData }),
    }).catch((err) => console.warn('Failed to sync student attendance to backend:', err));
  };

  // Helper to persist attendance map to backend DB
  const syncAttendanceToDb = (updatedMap) => {
    if (!sessionInfo?.id) return;
    const attArray = Object.entries(updatedMap).map(([studentId, data]) => ({
      studentId,
      status: data.status,
      notes: data.notes || ''
    }));
    fetch(`/api/meetings/${sessionInfo.id}/attendance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendance: attArray })
    }).catch(err => console.warn('Failed to sync attendance to DB:', err));
  };

  // Teacher Handlers
  const handleStatusChange = (studentId, newStatus) => {
    setAttendances((prev) => {
      const updated = {
        ...prev,
        [studentId]: { ...(prev[studentId] || {}), status: newStatus },
      };
      syncAttendanceToDb(updated);
      return updated;
    });
  };

  const handleNoteChange = (studentId, note) => {
    setAttendances((prev) => {
      const updated = {
        ...prev,
        [studentId]: { ...(prev[studentId] || {}), notes: note },
      };
      syncAttendanceToDb(updated);
      return updated;
    });
  };

  const handleMarkAllPresent = () => {
    const updated = {};
    students.forEach((s) => {
      updated[s.id] = { status: 'PRESENT', notes: '' };
    });
    setAttendances(updated);
    syncAttendanceToDb(updated);
  };

  const handleTeacherSignComplete = (data) => {
    setTeacherSignData(data);
    setMeetingStatus('PENDING_REP_SIGN');

    // Sync to backend DB
    if (sessionInfo?.id) {
      fetch(`/api/meetings/${sessionInfo.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'teacher',
          payload: {
            signerName: sessionInfo.teacherName,
            signatureDataUrl: data,
            note: 'Tanda tangan dosen diverifikasi secara digital'
          }
        })
      }).catch(err => console.warn('Failed to sync teacher sign to DB:', err));
    }
  };

  // Student Rep Handler
  const handleStudentRepSignComplete = (data) => {
    setStudentRepSignData(data);
    setMeetingStatus('SIGNED');

    // Sync to backend DB
    if (sessionInfo?.id) {
      fetch(`/api/meetings/${sessionInfo.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'student',
          payload: {
            signerName: currentUser?.name || 'Sarah Jenkins',
            signatureDataUrl: data,
            note: 'Tanda tangan perwakilan mahasiswa diverifikasi'
          }
        })
      }).catch(err => console.warn('Failed to sync student rep sign to DB:', err));
    }
  };

  // Supervisor Approval Handler
  const handleSupervisorApprove = (feedback) => {
    setMeetingStatus('SUPERVISOR_APPROVED');

    // Sync to backend DB
    if (sessionInfo?.id) {
      fetch(`/api/meetings/${sessionInfo.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'supervisor',
          payload: {
            status: 'Approved',
            signerName: currentUser?.name || 'Prof. Dr. Irwan Susanto',
            signerTitle: currentUser?.title || 'Koordinator Program BIPA & Kebudayaan',
            reviewNotes: feedback || 'Telah ditinjau dan disetujui secara resmi.'
          }
        })
      }).catch(err => console.warn('Failed to sync supervisor approve to DB:', err));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bipa_current_user');
    localStorage.removeItem('bipa_token');
    localStorage.removeItem('bipa_is_superadmin');
    setIsSuperAdmin(false);
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleLoginSuccess = (user) => {
    if (user?.role === 'superadmin' || user?.username === 'admin') {
      setIsSuperAdmin(true);
      setCurrentUser(SUPERADMIN_PERSONAS.superadmin);
      setCurrentView('superadmin');
      setLastAuthorizedRole('superadmin');
    } else {
      setIsSuperAdmin(false);
      setCurrentUser(user);
      if (user?.role === 'teacher') {
        setCurrentView('teacher');
      } else if (user?.role === 'student') {
        setCurrentView('student');
      } else if (user?.role === 'supervisor') {
        setCurrentView('supervisor');
        setLastAuthorizedRole('supervisor');
      } else {
        setCurrentView('coordinator');
        setLastAuthorizedRole('coordinator');
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full font-sans antialiased bg-slate-50">
      {/* Super Admin Omni-Access Sidebar */}
      {isSuperAdmin && currentView !== 'login' && (
        <SuperAdminSidebar
          currentView={currentView}
          onSwitchRole={handleSuperAdminSwitchRole}
          onLogout={handleLogout}
          currentUser={currentUser}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
      )}

      {/* Main Content Area with dynamic left padding for Super Admin Sidebar */}
      <div
        className={`transition-all duration-300 min-h-screen ${
          isSuperAdmin && currentView !== 'login'
            ? isSidebarCollapsed
              ? 'md:pl-20'
              : 'md:pl-72'
            : ''
        }`}
      >
        {/* ================= VIEW: COORDINATOR DASHBOARD ================= */}
        {currentView === 'coordinator' && (
        <CoordinatorDashboard
          currentUser={currentUser}
          sessionInfo={sessionInfo}
          onLogout={handleLogout}
          onSwitchToTeacherView={() => setCurrentView('teacher')}
          meetingStatus={meetingStatus}
          teacherSignData={teacherSignData}
          studentRepSignData={studentRepSignData}
          onSupervisorApprove={handleSupervisorApprove}
          darmasiswaSessions={darmasiswaSessions}
          onDarmasiswaSessionsChange={setDarmasiswaSessions}
          courses={courses}
          onSaveCourse={handleSaveCourse}
          onDeleteCourse={handleDeleteCourse}
        />
      )}

      {/* ================= VIEW: SUPERVISOR DASHBOARD ================= */}
      {currentView === 'supervisor' && (
        <SupervisorDashboard
          currentUser={currentUser}
          sessionInfo={sessionInfo}
          onLogout={handleLogout}
          onSwitchToCoordinatorView={() => setCurrentView('coordinator')}
          meetingStatus={meetingStatus}
          teacherSignData={teacherSignData}
          studentRepSignData={studentRepSignData}
          onSupervisorApprove={handleSupervisorApprove}
        />
      )}

      {/* ================= VIEW: TEACHER DASHBOARD ================= */}
      {currentView === 'teacher' && (
        <TeacherDashboard
          currentUser={currentUser}
          sessionInfo={sessionInfo}
          students={students}
          attendances={attendances}
          onStatusChange={handleStatusChange}
          onNoteChange={handleNoteChange}
          onMarkAllPresent={handleMarkAllPresent}
          teacherSignData={teacherSignData}
          studentRepSignData={studentRepSignData}
          meetingStatus={meetingStatus}
          onTeacherSignComplete={handleTeacherSignComplete}
          onSupervisorApprove={handleSupervisorApprove}
          onLogout={handleLogout}
          onSwitchToStudentView={() => setCurrentView('student')}
          darmasiswaSessions={darmasiswaSessions}
          onDarmasiswaFacilitatorSign={handleDarmasiswaFacilitatorSign}
          courses={courses}
        />
      )}

      {/* ================= VIEW: STUDENT DASHBOARD ================= */}
      {currentView === 'student' && (
        <StudentDashboard
          currentUser={currentUser}
          studentName={currentUser?.name || 'Sarah Jenkins'}
          sessionInfo={sessionInfo}
          students={students}
          attendances={attendances}
          teacherSignData={teacherSignData}
          studentRepSignData={studentRepSignData}
          meetingStatus={meetingStatus}
          onStudentRepSignComplete={handleStudentRepSignComplete}
          onViewBap={() => setCurrentView('itenas-recap')}
          onSwitchToTeacherView={() => setCurrentView('teacher')}
          onLogout={handleLogout}
          darmasiswaSessions={darmasiswaSessions}
          onDarmasiswaStudentAttend={handleDarmasiswaStudentAttend}
          courses={courses}
        />
      )}

      {/* ================= VIEW: DARMASISWA ITENAS RECAP REPORT (KHUSUS KOORDINATOR & SUPERVISOR) ================= */}
      {currentView === 'itenas-recap' && (
        <div className="min-h-screen bg-[#e8f1ec] p-3 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="w-full max-w-[1300px]">
            <div className="mb-4 flex items-center justify-between no-print">
              <button
                type="button"
                onClick={() => setCurrentView(lastAuthorizedRole || 'login')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                ← Return to {lastAuthorizedRole === 'supervisor' ? 'Supervisor' : lastAuthorizedRole === 'student' ? 'Student' : 'Coordinator'} Portal
              </button>
            </div>
            <DarmasiswaRecapReport
              onBack={() => setCurrentView(lastAuthorizedRole || 'login')}
              customSessions={darmasiswaSessions}
            />
          </div>
        </div>
      )}

      {/* ================= VIEW: LOGIN PAGE ================= */}
      {currentView === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
        />
      )}

      {/* ================= VIEW: SUPER ADMIN DASHBOARD ================= */}
      {currentView === 'superadmin' && (
        <SuperAdminDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchView={(view) => {
            handleSuperAdminSwitchRole(view);
          }}
        />
      )}

      {/* ================= VIEW: FORGOT PASSWORD PAGE ================= */}
      {currentView === 'forgot-password' && (
        <ForgotPasswordPage
          onSwitchToLogin={() => setCurrentView('login')}
        />
      )}

      {/* ================= FALLBACK: JIKA VIEW TIDAK DIKENAL / OBJEK USANG ================= */}
      {!VALID_VIEWS.includes(currentView) && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
        />
      )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
