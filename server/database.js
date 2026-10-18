// server/database.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialClasses,
  initialStudents,
  initialSchedule,
  initialSyllabus,
  initialRealizations,
  initialMeetingRecords,
  initialUsers,
  initialAssignments,
  initialDarmasiswaSessions,
  darmasiswaStudentsList,
  itenasInstitutionInfo,
  initialCourses,
  initialPedagogicalLogs,
  initialMissionRecords
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

class Database {
  constructor() {
    this.data = {
      classes: [],
      students: [],
      schedules: [],
      syllabuses: [],
      realizations: [],
      meetingRecords: [],
      users: [],
      assignments: [],
      darmasiswaSessions: [],
      courses: [],
      pedagogicalLogs: [],
      missions: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
        let modified = false;

        // Ensure users exist
        if (!this.data.users || this.data.users.length === 0) {
          this.data.users = [...initialUsers];
          modified = true;
        } else {
          // Guarantee admin user is present
          const hasAdmin = this.data.users.some(u => u.username === 'admin' || u.role === 'superadmin');
          if (!hasAdmin) {
            const adminUser = initialUsers.find(u => u.username === 'admin');
            if (adminUser) this.data.users.unshift(adminUser);
            modified = true;
          }
        }

        // Ensure assignments exist
        if (!this.data.assignments || this.data.assignments.length === 0) {
          this.data.assignments = [...initialAssignments];
          modified = true;
        }

        if (!this.data.darmasiswaSessions || this.data.darmasiswaSessions.length === 0) {
          this.data.darmasiswaSessions = [...initialDarmasiswaSessions];
          modified = true;
        }

        // Ensure courses exist
        if (!this.data.courses || this.data.courses.length === 0) {
          this.data.courses = [...initialCourses];
          modified = true;
        }

        // Ensure BIPA students exist
        if (!this.data.students || !this.data.students.some(s => s.id === 'std-1')) {
          this.data.students = [...initialStudents];
          modified = true;
        }

        // Ensure active meeting record meet-bipa-2026-04 exists
        if (!this.data.meetingRecords || !this.data.meetingRecords.some(m => m.id === 'meet-bipa-2026-04')) {
          const targetMeeting = initialMeetingRecords.find(m => m.id === 'meet-bipa-2026-04');
          if (targetMeeting) {
            this.data.meetingRecords.push(targetMeeting);
            modified = true;
          }
        }

        // Ensure pedagogical logs exist
        if (!this.data.pedagogicalLogs || this.data.pedagogicalLogs.length === 0) {
          this.data.pedagogicalLogs = [...initialPedagogicalLogs];
          modified = true;
        }

        // Ensure mission records exist
        if (!this.data.missions || this.data.missions.length === 0) {
          this.data.missions = [...initialMissionRecords];
          modified = true;
        }

        if (modified) {
          this.persist();
        }
      } else {
        this.resetToSeed();
      }
    } catch (err) {
      console.warn("Error reading db.json, initializing with seed data:", err.message);
      this.resetToSeed();
    }
  }

  resetToSeed() {
    this.data = {
      classes: [...initialClasses],
      students: [...initialStudents],
      schedules: [...initialSchedule],
      syllabuses: [...initialSyllabus],
      realizations: [...initialRealizations],
      meetingRecords: [...initialMeetingRecords],
      users: [...initialUsers],
      assignments: [...initialAssignments],
      darmasiswaSessions: [...initialDarmasiswaSessions],
      courses: [...initialCourses],
      pedagogicalLogs: [...initialPedagogicalLogs],
      missions: [...initialMissionRecords]
    };
    this.persist();
  }

  persist() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error("Failed to persist database to file:", err);
    }
  }

  // --- Classes ---
  getClasses() {
    return this.data.classes;
  }

  getClassById(id) {
    return this.data.classes.find(c => c.id === id);
  }

  addClass(newClass) {
    const item = {
      id: newClass.id || `class-${Date.now()}`,
      ...newClass
    };
    this.data.classes.push(item);
    this.persist();
    return item;
  }

  updateClass(id, updates) {
    const idx = this.data.classes.findIndex(c => String(c.id) === String(id));
    if (idx !== -1) {
      this.data.classes[idx] = { ...this.data.classes[idx], ...updates };
      this.persist();
      return this.data.classes[idx];
    }
    return null;
  }

  deleteClass(id) {
    const prevLen = this.data.classes.length;
    this.data.classes = this.data.classes.filter(c => String(c.id) !== String(id));
    if (this.data.classes.length !== prevLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Courses / Learning Materials ---
  getCourses() {
    return this.data.courses || [];
  }

  getCourseById(id) {
    return (this.data.courses || []).find(c => String(c.id) === String(id));
  }

  saveCourse(course) {
    if (!this.data.courses) this.data.courses = [];
    const idx = this.data.courses.findIndex(c => String(c.id) === String(course.id));
    let item;
    if (idx !== -1) {
      item = { ...this.data.courses[idx], ...course };
      this.data.courses[idx] = item;
    } else {
      item = {
        id: course.id || `unit-${Date.now()}`,
        ...course
      };
      this.data.courses.unshift(item);
    }
    this.persist();
    return item;
  }

  deleteCourse(id) {
    if (!this.data.courses) return false;
    const prevLen = this.data.courses.length;
    this.data.courses = this.data.courses.filter(c => String(c.id) !== String(id));
    if (this.data.courses.length !== prevLen) {
      this.persist();
      return true;
    }
    return false;
  }

  saveMeetingRecord(meeting) {
    if (!this.data.meetingRecords) this.data.meetingRecords = [];
    const idx = this.data.meetingRecords.findIndex(m => String(m.id) === String(meeting.id));
    let item;
    if (idx !== -1) {
      item = { ...this.data.meetingRecords[idx], ...meeting };
      this.data.meetingRecords[idx] = item;
    } else {
      item = {
        id: meeting.id || `meet-${Date.now()}`,
        ...meeting
      };
      this.data.meetingRecords.push(item);
    }
    this.persist();
    return item;
  }

  // --- Students ---
  getStudents(classId) {
    if (!classId || classId === 'all') return this.data.students || [];
    return (this.data.students || []).filter(s => s.classId === classId);
  }

  addStudent(student) {
    const item = {
      id: student.id || `std-${Date.now()}`,
      ...student
    };
    this.data.students.push(item);
    this.persist();
    return item;
  }

  // --- Schedules ---
  getSchedule(classId) {
    if (!classId || classId === 'all') return this.data.schedules;
    return this.data.schedules.filter(s => s.classId === classId);
  }

  addSchedule(slot) {
    const item = {
      id: slot.id || `sch-${Date.now()}`,
      ...slot
    };
    this.data.schedules.push(item);
    this.persist();
    return item;
  }

  updateSchedule(id, slot) {
    const idx = this.data.schedules.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.schedules[idx] = { ...this.data.schedules[idx], ...slot };
      this.persist();
      return this.data.schedules[idx];
    }
    return null;
  }

  deleteSchedule(id) {
    this.data.schedules = this.data.schedules.filter(s => s.id !== id);
    this.persist();
    return true;
  }

  // --- Syllabus ---
  getSyllabus(classId) {
    if (!classId || classId === 'all') return this.data.syllabuses;
    return this.data.syllabuses.filter(s => s.classId === classId);
  }

  getSyllabusById(id) {
    return this.data.syllabuses.find(s => s.id === id);
  }

  addSyllabus(entry) {
    const item = {
      id: entry.id || `syl-${Date.now()}`,
      status: entry.status || 'Planned',
      ...entry
    };
    this.data.syllabuses.push(item);
    this.persist();
    return item;
  }

  updateSyllabus(id, updates) {
    const idx = this.data.syllabuses.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.syllabuses[idx] = { ...this.data.syllabuses[idx], ...updates };
      this.persist();
      return this.data.syllabuses[idx];
    }
    return null;
  }

  deleteSyllabus(id) {
    this.data.syllabuses = this.data.syllabuses.filter(s => s.id !== id);
    this.persist();
    return true;
  }

  // --- Realizations ---
  getRealizations(classId) {
    if (!classId || classId === 'all') return this.data.realizations;
    return this.data.realizations.filter(r => r.classId === classId);
  }

  getRealizationById(id) {
    return this.data.realizations.find(r => r.id === id);
  }

  saveRealization(data) {
    let item;
    const existingIdx = this.data.realizations.findIndex(r => r.id === data.id || (r.syllabusId && r.syllabusId === data.syllabusId));
    
    if (existingIdx !== -1) {
      item = { ...this.data.realizations[existingIdx], ...data };
      this.data.realizations[existingIdx] = item;
    } else {
      item = {
        id: data.id || `real-${Date.now()}`,
        status: data.status || 'Submitted',
        ...data
      };
      this.data.realizations.push(item);
    }

    // Sync syllabus status
    if (item.syllabusId) {
      this.updateSyllabus(item.syllabusId, {
        status: item.status === 'Verified' ? 'Completed' : 'In Progress'
      });
    }

    // Check or create corresponding meeting record
    let meeting = this.data.meetingRecords.find(m => m.realizationId === item.id || m.syllabusId === item.syllabusId);
    if (!meeting) {
      const syllabus = this.getSyllabusById(item.syllabusId) || {};
      const classInfo = this.getClassById(item.classId) || {};
      const students = this.getStudents(item.classId);

      meeting = {
        id: `meet-${Date.now()}`,
        syllabusId: item.syllabusId,
        realizationId: item.id,
        classId: item.classId,
        meetingNumber: item.meetingNumber || syllabus.pertemuan || 1,
        topic: item.unitMateriTerlaksana || syllabus.unit || "Pertemuan BIPA",
        date: item.hariTanggalRealisasi || syllabus.hariTanggal || new Date().toLocaleDateString('id-ID'),
        time: item.waktuRealisasi || syllabus.waktu || "08:00 - 09:40 WIB",
        room: classInfo.room || "Lab Bahasa / R. Kelas",
        teacherName: classInfo.instructorName || "Dosen BIPA",
        attendance: students.map(s => ({
          studentId: s.id,
          name: s.name,
          status: 'Hadir',
          note: ''
        })),
        plannedVsActual: {
          plannedUnit: syllabus.unit || "Unit Sesuai Silabus",
          actualUnit: item.unitMateriTerlaksana,
          deviation: item.kesesuaianRencana || "Sesuai silabus",
          outcomeAchieved: "Target kompetensi pembelajaran telah tercapai secara optimal."
        },
        signatures: {
          teacher: {
            signed: true,
            signerName: classInfo.instructorName || "Dosen BIPA",
            signedAt: new Date().toISOString(),
            signatureDataUrl: null,
            note: "Realisasi pembelajaran telah diinput dan diverifikasi dosen pengampu."
          },
          studentRep: {
            signed: false,
            signerName: students[0]?.name || "Perwakilan Mahasiswa",
            signedAt: null,
            signatureDataUrl: null,
            note: ""
          },
          supervisor: {
            status: "Pending",
            signerName: classInfo.supervisorName || "Prof. Dr. Irwan Susanto",
            signerTitle: "Koordinator Program BIPA & Kebudayaan",
            signedAt: null,
            signatureDataUrl: null,
            reviewNotes: ""
          }
        }
      };
      this.data.meetingRecords.push(meeting);
    } else {
      meeting.topic = item.unitMateriTerlaksana || meeting.topic;
      meeting.date = item.hariTanggalRealisasi || meeting.date;
      meeting.time = item.waktuRealisasi || meeting.time;
      meeting.plannedVsActual.actualUnit = item.unitMateriTerlaksana;
    }

    this.persist();
    return { realization: item, meetingRecord: meeting };
  }

  // --- Meeting Records & Multi-Party Sign-Off ---
  getMeetingRecords(classId) {
    if (!classId || classId === 'all') return this.data.meetingRecords;
    return this.data.meetingRecords.filter(m => m.classId === classId);
  }

  getMeetingRecordById(id) {
    return this.data.meetingRecords.find(m => m.id === id);
  }

  signMeetingRecord(meetingId, role, payload) {
    const meeting = this.data.meetingRecords.find(m => m.id === meetingId);
    if (!meeting) return null;

    const now = new Date().toISOString();

    if (role === 'teacher' || role === 'dosen') {
      meeting.signatures.teacher = {
        signed: true,
        signerName: payload.signerName || meeting.signatures.teacher.signerName,
        signedAt: now,
        signatureDataUrl: payload.signatureDataUrl || meeting.signatures.teacher.signatureDataUrl,
        note: payload.note || meeting.signatures.teacher.note
      };
    } else if (role === 'student') {
      meeting.signatures.studentRep = {
        signed: true,
        signerName: payload.signerName || meeting.signatures.studentRep.signerName,
        signedAt: now,
        signatureDataUrl: payload.signatureDataUrl,
        note: payload.note || "Materi dan perkuliahan telah terlaksana dengan baik."
      };
    } else if (role === 'supervisor') {
      meeting.signatures.supervisor = {
        status: payload.status || 'Approved', // Approved or Revision Requested
        signerName: payload.signerName || meeting.signatures.supervisor.signerName,
        signerTitle: payload.signerTitle || meeting.signatures.supervisor.signerTitle,
        signedAt: now,
        signatureDataUrl: payload.signatureDataUrl,
        reviewNotes: payload.reviewNotes || payload.note || "Telah ditinjau dan disahkan."
      };

      // If approved, update realization status to Verified
      if (payload.status === 'Approved' && meeting.realizationId) {
        const real = this.getRealizationById(meeting.realizationId);
        if (real) {
          real.status = 'Verified';
          if (real.syllabusId) {
            this.updateSyllabus(real.syllabusId, { status: 'Completed' });
          }
        }
      }
    }

    this.persist();
    return meeting;
  }

  updateMeetingAttendance(meetingId, attendanceList) {
    const meeting = this.data.meetingRecords.find(m => m.id === meetingId);
    if (!meeting) return null;

    meeting.attendance = attendanceList;
    
    // Update summary counts
    let total = attendanceList.length;
    let hadir = attendanceList.filter(a => a.status === 'Hadir').length;
    let izin = attendanceList.filter(a => a.status === 'Izin').length;
    let sakit = attendanceList.filter(a => a.status === 'Sakit').length;
    let alpa = attendanceList.filter(a => a.status === 'Alpa').length;

    if (meeting.realizationId) {
      const real = this.getRealizationById(meeting.realizationId);
      if (real) {
        real.attendanceSummary = { total, hadir, izin, sakit, alpa };
      }
    }

    this.persist();
    return meeting;
  }

  // --- User Authentication & Dummy Accounts ---
  getUsers(role) {
    if (!role) return this.data.users || [];
    return (this.data.users || []).filter(u => u.role === role);
  }

  getUserById(id) {
    return (this.data.users || []).find(u => u.id === id);
  }

  findUser(identifier) {
    if (!identifier) return null;
    const clean = identifier.toString().trim().toLowerCase();
    return (this.data.users || []).find(u => {
      const uId = (u.id || '').toLowerCase();
      const uUsername = (u.username || '').toLowerCase();
      const uIdentifier = (u.identifier || '').toLowerCase();
      const uNim = (u.nim || '').toLowerCase();
      const uNip = (u.nip || '').toLowerCase();
      const uEmail = (u.email || '').toLowerCase();
      return (
        uId === clean ||
        uUsername === clean ||
        uIdentifier === clean ||
        uNim === clean ||
        uNip === clean ||
        uEmail === clean
      );
    });
  }

  parseItenasIdentifier(identifier) {
    if (!identifier) return { user: null, parsed: null };
    const raw = identifier.toString().trim();
    const clean = raw.toLowerCase();

    // 1. Direct match with existing users
    const existing = this.findUser(clean);
    if (existing) {
      return { user: existing, parsed: null };
    }

    // 2. Try to parse combined "NIM NAMA", e.g. "312024099 David Wilson" or "BIPA-2026-099 David Wilson"
    const nimNamePattern = /^([0-9]{6,12}|BIPA-\d{4}-\d{2,4})\s*[-–:]?\s+(.+)$/i;
    const match = raw.match(nimNamePattern);
    if (match) {
      const parsedNim = match[1].trim();
      const parsedName = match[2].trim();

      // Check if this NIM already exists in database
      const existingByNim = (this.data.users || []).find(u => (u.nim || '').toLowerCase() === parsedNim.toLowerCase());
      if (existingByNim) {
        if (parsedName && existingByNim.name !== parsedName) {
          existingByNim.name = parsedName;
          this.persist();
        }
        return { user: existingByNim, parsed: null };
      }

      // New student with NIM & NAMA separated cleanly
      return {
        user: null,
        parsed: {
          nim: parsedNim,
          name: parsedName,
          email: `${parsedNim.toLowerCase().replace(/[^a-z0-9]/g, '')}@mhs.itenas.ac.id`,
          role: 'student'
        }
      };
    }

    // 3. Try to parse student email: e.g. 312024099@mhs.itenas.ac.id
    if (clean.endsWith('@mhs.itenas.ac.id')) {
      const localPart = clean.replace('@mhs.itenas.ac.id', '');
      return {
        user: null,
        parsed: {
          nim: localPart.toUpperCase(),
          name: localPart.replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          email: clean,
          role: 'student'
        }
      };
    }

    // 4. Try to parse lecturer email: e.g. dianita@itenas.ac.id
    if (clean.endsWith('@itenas.ac.id')) {
      const localPart = clean.replace('@itenas.ac.id', '');
      return {
        user: null,
        parsed: {
          name: localPart.replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ', S.T., M.T.',
          email: clean,
          role: 'teacher'
        }
      };
    }

    // 5. If pure digits (e.g. 312024099), treated as new student NIM
    if (/^[0-9]{7,10}$/.test(clean)) {
      return {
        user: null,
        parsed: {
          nim: raw,
          name: `Mahasiswa ${raw}`,
          email: `${raw}@mhs.itenas.ac.id`,
          role: 'student'
        }
      };
    }

    return { user: null, parsed: null };
  }

  authenticate(identifier, password) {
    if (!identifier) {
      return { success: false, error: 'Silakan masukkan NIM, Username, atau Email Itenas Anda.' };
    }

    const clean = identifier.toString().trim().toLowerCase();

    // 1. Super Admin authentication: username 'admin', password 'admin234'
    if (clean === 'admin' || clean === 'admin@itenas.ac.id') {
      let adminUser = (this.data.users || []).find(u => u.username === 'admin' || u.role === 'superadmin');
      if (!adminUser) {
        adminUser = {
          id: 'user-admin-01',
          username: 'admin',
          email: 'admin@itenas.ac.id',
          identifier: 'admin',
          password: 'admin234',
          name: 'Super Administrator IT',
          role: 'superadmin',
          title: 'Super Administrator Sistem BIPA',
          avatar: '⚡'
        };
        if (!this.data.users) this.data.users = [];
        this.data.users.unshift(adminUser);
        this.persist();
      }

      if (password !== (adminUser.password || 'admin234')) {
        return { success: false, error: 'Password Super Admin salah. Harap periksa kembali.' };
      }

      const { password: _, ...safeUser } = adminUser;
      return {
        success: true,
        user: safeUser,
        token: `bipa-token-admin-${Date.now()}`
      };
    }

    // 2. Check Itenas SSO credentials & separate NIM / NAMA if combined
    const { user: existingUser, parsed } = this.parseItenasIdentifier(identifier);
    let user = existingUser;

    // Auto-provision if valid Itenas SSO account format (student or lecturer)
    if (!user && parsed) {
      user = {
        id: `user-${parsed.role === 'student' ? 'mhs' : 'dsn'}-${Date.now()}`,
        username: parsed.nim || parsed.email.split('@')[0],
        identifier: parsed.nim || parsed.email,
        nim: parsed.nim || null,
        name: parsed.name,
        email: parsed.email,
        password: password || 'password123',
        role: parsed.role,
        title: parsed.role === 'student' ? 'Mahasiswa BIPA Itenas' : 'Dosen Pengampu BIPA Itenas',
        country: 'Indonesia',
        avatar: parsed.role === 'student' ? '🎓' : '👨‍🏫',
        createdAt: new Date().toISOString()
      };
      if (!this.data.users) this.data.users = [];
      this.data.users.push(user);
      this.persist();
    }

    if (!user) {
      return {
        success: false,
        error: 'Akun tidak ditemukan. Gunakan NIM atau email @mhs.itenas.ac.id untuk mahasiswa, dan @itenas.ac.id untuk dosen.'
      };
    }

    // Password validation (default password123 or admin234)
    const validPassword = user.password || 'password123';
    if (password !== validPassword && password !== 'admin234' && password !== 'password123') {
      return { success: false, error: 'Password yang Anda masukkan salah. Coba periksa kembali.' };
    }

    const { password: _, ...safeUser } = user;
    const token = `bipa-token-${user.id}-${Date.now()}`;

    return {
      success: true,
      user: safeUser,
      token
    };
  }

  authenticateGoogle({ email, name, avatar, nim }) {
    if (!email || !email.trim()) {
      return { success: false, error: 'Email Google institusi wajib diisi.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Validate domain: @mhs.itenas.ac.id (Student) or @itenas.ac.id (Staff/Lecturer)
    const isStudent = cleanEmail.endsWith('@mhs.itenas.ac.id');
    const isStaff = cleanEmail.endsWith('@itenas.ac.id');

    if (!isStudent && !isStaff) {
      return {
        success: false,
        error: 'Login Google dibatasi untuk akun resmi Itenas: @mhs.itenas.ac.id (Mahasiswa) atau @itenas.ac.id (Dosen & Tendik).'
      };
    }

    if (!this.data.users) this.data.users = [];

    // Check existing by email
    let user = this.data.users.find(u => (u.email || '').toLowerCase() === cleanEmail);

    if (user) {
      if (nim && !user.nim) {
        user.nim = nim.trim();
      }
      if (name && name.trim() && (!user.name || user.name.startsWith('Mahasiswa'))) {
        user.name = name.trim();
      }
      this.persist();

      const { password: _, ...safeUser } = user;
      return {
        success: true,
        user: safeUser,
        token: `bipa-token-google-${user.id}-${Date.now()}`
      };
    }

    // Auto-provision new profile from Google OAuth data
    const localPart = cleanEmail.split('@')[0];
    let parsedNim = nim ? nim.trim() : null;
    let parsedName = name ? name.trim() : null;

    if (isStudent) {
      if (!parsedNim && /^[0-9]{6,12}$/.test(localPart)) {
        parsedNim = localPart;
      } else if (!parsedNim) {
        parsedNim = `312024${Math.floor(100 + Math.random() * 899)}`;
      }

      if (!parsedName) {
        parsedName = localPart
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
      }

      user = {
        id: `user-mhs-${Date.now()}`,
        username: parsedNim || localPart,
        identifier: parsedNim || localPart,
        nim: parsedNim,
        name: parsedName,
        email: cleanEmail,
        password: 'password123',
        role: 'student',
        title: 'Mahasiswa BIPA Itenas',
        country: 'Indonesia',
        avatar: avatar || '🎓',
        authProvider: 'google',
        createdAt: new Date().toISOString()
      };
    } else {
      if (!parsedName) {
        parsedName = localPart
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase()) + ', S.T., M.T.';
      }

      const asg = (this.data.assignments || []).find(a => 
        (a.email || '').toLowerCase() === cleanEmail && (a.status === 'ACTIVE' || a.status === 'INVITED')
      );
      const role = asg ? asg.role : 'teacher';
      const roleTitle = asg ? asg.roleLabel : 'Dosen Pengampu BIPA Itenas';

      user = {
        id: `user-${role}-${Date.now()}`,
        username: localPart,
        identifier: localPart,
        email: cleanEmail,
        name: parsedName,
        password: 'password123',
        role,
        title: roleTitle,
        avatar: role === 'coordinator' ? '👑' : role === 'supervisor' ? '🛡️' : '👨‍🏫',
        authProvider: 'google',
        createdAt: new Date().toISOString()
      };
    }

    this.data.users.push(user);
    this.persist();

    const { password: _, ...safeUser } = user;
    return {
      success: true,
      user: safeUser,
      token: `bipa-token-google-${user.id}-${Date.now()}`
    };
  }

  // --- Super Admin Role Assignments & Invitations ---
  getAssignments() {
    return this.data.assignments || [];
  }

  assignRole({ role, name, nip, email, skNumber, department, notes }) {
    if (!role || !['coordinator', 'supervisor'].includes(role)) {
      return { error: 'Role penugasan harus berupa Koordinator (coordinator) atau Supervisor (supervisor).' };
    }
    if (!name || !name.trim()) {
      return { error: 'Nama pejabat wajib diisi lengkap beserta gelar.' };
    }
    if (!email || !email.trim()) {
      return { error: 'Email resmi Itenas wajib diisi.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@itenas.ac.id')) {
      return { error: 'Email penugasan dosen/pejabat wajib menggunakan domain resmi @itenas.ac.id' };
    }

    const cleanName = name.trim();
    const cleanNip = (nip || '').trim();
    const cleanSk = (skNumber || `SK-REK/${Math.floor(100 + Math.random() * 900)}/BIPA/${new Date().getFullYear()}`).trim();
    const cleanDept = (department || 'Institut Teknologi Nasional Bandung').trim();
    const nowIso = new Date().toISOString();

    if (!this.data.assignments) this.data.assignments = [];

    const roleLabel = role === 'coordinator' 
      ? 'Koordinator Program BIPA & Kebudayaan' 
      : 'Supervisor / Penjamin Mutu BIPA';

    const newAssignment = {
      id: `asg-${Date.now()}`,
      role,
      roleLabel,
      name: cleanName,
      nip: cleanNip,
      email: cleanEmail,
      skNumber: cleanSk,
      department: cleanDept,
      notes: notes || '',
      assignedAt: nowIso,
      status: 'INVITED', // Starts as invited
      invitedAt: nowIso,
      lastInviteSent: nowIso,
      inviteToken: `inv-${role}-${Date.now().toString(36)}`
    };

    // Mark previous active assignment for this role as ARCHIVED
    this.data.assignments.forEach(a => {
      if (a.role === role && a.status === 'ACTIVE') {
        a.status = 'ARCHIVED';
        a.replacedAt = nowIso;
      }
    });

    this.data.assignments.unshift(newAssignment);

    // Synchronize into users collection
    if (!this.data.users) this.data.users = [];
    let user = this.data.users.find(u => u.email?.toLowerCase() === cleanEmail);

    if (user) {
      user.role = role;
      user.name = cleanName;
      if (cleanNip) user.nip = cleanNip;
      user.title = roleLabel;
      user.avatar = role === 'coordinator' ? '👑' : '🛡️';
    } else {
      user = {
        id: `user-${role}-${Date.now()}`,
        username: cleanEmail.split('@')[0],
        identifier: cleanNip || cleanEmail.split('@')[0],
        email: cleanEmail,
        nip: cleanNip || null,
        name: cleanName,
        password: 'password123',
        role,
        title: roleLabel,
        avatar: role === 'coordinator' ? '👑' : '🛡️',
        createdAt: nowIso
      };
      this.data.users.push(user);
    }

    this.persist();

    return {
      success: true,
      assignment: newAssignment,
      invitation: {
        to: cleanEmail,
        name: cleanName,
        role: roleLabel,
        skNumber: cleanSk,
        inviteLink: `http://localhost:3000/?invite=${newAssignment.inviteToken}&role=${role}`,
        subject: `[UNDANGAN RESMI] Penetapan ${roleLabel} - Institut Teknologi Nasional`,
        sentAt: nowIso
      }
    };
  }

  resendInvitation(assignmentId) {
    if (!this.data.assignments) return { error: 'Data penugasan belum tersedia.' };
    const asg = this.data.assignments.find(a => a.id === assignmentId);
    if (!asg) {
      return { error: 'Penugasan tidak ditemukan.' };
    }

    const nowIso = new Date().toISOString();
    asg.lastInviteSent = nowIso;
    asg.inviteToken = `inv-${asg.role}-${Date.now().toString(36)}`;
    this.persist();

    return {
      success: true,
      assignment: asg,
      invitation: {
        to: asg.email,
        name: asg.name,
        role: asg.roleLabel,
        skNumber: asg.skNumber,
        inviteLink: `http://localhost:3000/?invite=${asg.inviteToken}&role=${asg.role}`,
        subject: `[KIRIM ULANG] Undangan Aktivasi Tugas ${asg.roleLabel} - Itenas`,
        sentAt: nowIso
      }
    };
  }

  revokeAssignment(assignmentId) {
    if (!this.data.assignments) return { error: 'Data penugasan tidak ditemukan.' };
    const asg = this.data.assignments.find(a => a.id === assignmentId);
    if (!asg) return { error: 'Penugasan tidak ditemukan.' };
    asg.status = 'REVOKED';
    asg.revokedAt = new Date().toISOString();
    this.persist();
    return { success: true, assignment: asg };
  }

  registerUser(userData) {
    const cleanNim = (userData.nim || '').trim();
    const cleanEmail = (userData.email || '').trim().toLowerCase();

    // Check existing
    const existing = (this.data.users || []).find(u => 
      (cleanNim && (u.nim === cleanNim || u.identifier === cleanNim)) ||
      (cleanEmail && u.email?.toLowerCase() === cleanEmail)
    );

    if (existing) {
      return { error: 'NIM atau Email sudah terdaftar. Silakan gunakan kredensial lain atau login.' };
    }

    const newUser = {
      id: `user-mhs-${Date.now()}`,
      username: cleanNim || `mhs_${Date.now().toString().slice(-4)}`,
      identifier: cleanNim,
      nim: cleanNim,
      name: userData.name || 'Mahasiswa Baru',
      email: cleanEmail,
      password: userData.password || 'password123',
      role: userData.role || 'student',
      title: 'Mahasiswa BIPA',
      country: userData.country || 'Indonesia',
      avatar: userData.avatar || '🎓',
      createdAt: new Date().toISOString()
    };

    if (!this.data.users) this.data.users = [];
    this.data.users.push(newUser);
    this.persist();

    const { password: _, ...safeUser } = newUser;
    return { success: true, user: safeUser };
  }

  forgotPassword(query) {
    const user = this.findUser(query);
    if (!user) {
      return { success: false, error: 'Email atau Akun tidak ditemukan dalam sistem.' };
    }
    const resetToken = `reset-${user.id}-${Date.now()}`;
    return {
      success: true,
      message: `Tautan instruksi pemulihan berhasil disiapkan untuk ${user.email || user.name}.`,
      resetToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        identifier: user.identifier || user.nim || user.username
      }
    };
  }

  resetPassword(identifier, newPassword) {
    const user = this.findUser(identifier);
    if (!user) {
      return { success: false, error: 'User tidak ditemukan.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password baru minimal 6 karakter.' };
    }
    user.password = newPassword;
    this.persist();
    return { success: true, message: 'Password berhasil diperbarui.' };
  }

  // --- Darmasiswa RI Program Management ---
  getDarmasiswaSessions() {
    return this.data.darmasiswaSessions || [];
  }

  getDarmasiswaSessionById(id) {
    return (this.data.darmasiswaSessions || []).find(s => s.id === id);
  }

  saveDarmasiswaSession(sessionData) {
    if (!this.data.darmasiswaSessions) this.data.darmasiswaSessions = [];
    const existingIdx = this.data.darmasiswaSessions.findIndex(s => s.id === sessionData.id);

    if (existingIdx !== -1) {
      this.data.darmasiswaSessions[existingIdx] = {
        ...this.data.darmasiswaSessions[existingIdx],
        ...sessionData
      };
      this.persist();
      return this.data.darmasiswaSessions[existingIdx];
    } else {
      const nextNo = (this.data.darmasiswaSessions.length || 0) + 1;
      const newSession = {
        id: sessionData.id || `sesi-${Date.now()}`,
        no: sessionData.no || nextNo,
        dayDate: sessionData.dayDate || new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
        dateIso: sessionData.dateIso || new Date().toISOString().split('T')[0],
        material: sessionData.material || '',
        facilitatorName: sessionData.facilitatorName || 'Dianita, S.S., M.Hum.',
        facilitatorNip: sessionData.facilitatorNip || '198704122015052001',
        facilitatorSigned: sessionData.facilitatorSigned ?? true,
        facilitatorSignTime: sessionData.facilitatorSignTime || new Date().toLocaleString('id-ID') + ' WIB',
        attendances: sessionData.attendances || {}
      };
      this.data.darmasiswaSessions.push(newSession);
      this.persist();
      return newSession;
    }
  }

  signDarmasiswaSession(sessionId, facilitatorData) {
    const session = this.getDarmasiswaSessionById(sessionId);
    if (!session) return null;

    session.facilitatorSigned = true;
    session.facilitatorName = facilitatorData.facilitatorName || session.facilitatorName;
    session.facilitatorNip = facilitatorData.facilitatorNip || session.facilitatorNip;
    session.facilitatorSignTime = facilitatorData.facilitatorSignTime || new Date().toLocaleString('id-ID') + ' WIB';

    this.persist();
    return session;
  }

  checkInDarmasiswaStudent(sessionId, nim, checkInData) {
    const session = this.getDarmasiswaSessionById(sessionId);
    if (!session) return null;

    if (!session.attendances) session.attendances = {};
    session.attendances[nim] = {
      attended: true,
      status: checkInData?.status || 'PRESENT',
      note: checkInData?.note || 'Hadir via check-in mahasiswa',
      signTime: checkInData?.signTime || new Date().toLocaleString('id-ID') + ' WIB'
    };

    this.persist();
    return session;
  }

  getDarmasiswaStudents() {
    return darmasiswaStudentsList;
  }

  getItenasInfo() {
    return itenasInstitutionInfo;
  }

  // Pedagogical Logs
  getPedagogicalLogs() {
    return this.data.pedagogicalLogs || [];
  }

  addPedagogicalLog(log) {
    const newLog = {
      id: `LOG-0${(this.data.pedagogicalLogs?.length || 0) + 1}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      cls: log.cls || 'BIPA General',
      session: log.session || 'Meeting 4',
      teacher: log.teacher || 'Dra. Siti Rahmawati, M.Hum.',
      category: log.category || 'PRONUNCIATION',
      catLabel: log.catLabel || 'Pronunciation and Intonation',
      targetGroup: log.targetGroup || 'General Cohort',
      quote: log.quote || '',
      recommendation: log.recommendation || '',
      status: log.status || 'UNDER_SUPERVISION',
      statusLabel: log.statusLabel || 'Under Supervision',
      driveUrl: log.driveUrl || 'https://drive.google.com',
      ...log
    };
    if (!this.data.pedagogicalLogs) this.data.pedagogicalLogs = [];
    this.data.pedagogicalLogs.unshift(newLog);
    this.persist();
    return newLog;
  }

  updatePedagogicalLog(id, updates) {
    if (!this.data.pedagogicalLogs) return null;
    const index = this.data.pedagogicalLogs.findIndex(l => l.id === id);
    if (index === -1) return null;
    this.data.pedagogicalLogs[index] = { ...this.data.pedagogicalLogs[index], ...updates };
    this.persist();
    return this.data.pedagogicalLogs[index];
  }

  respondPedagogicalLog(id, payload = {}) {
    if (!this.data.pedagogicalLogs) return null;
    const log = this.data.pedagogicalLogs.find(l => l.id === id);
    if (!log) return null;
    log.status = 'RESOLVED';
    log.statusLabel = 'Solution Applied';
    if (payload.recommendation) log.recommendation = payload.recommendation;
    if (payload.responseText) log.supervisorResponse = payload.responseText;
    log.respondedAt = new Date().toISOString();
    this.persist();
    return log;
  }

  // Missions
  getMissions() {
    return this.data.missions || [];
  }

  updateMission(code, updates) {
    if (!this.data.missions) return null;
    const index = this.data.missions.findIndex(m => m.code === code);
    if (index === -1) return null;
    this.data.missions[index] = { ...this.data.missions[index], ...updates };
    this.persist();
    return this.data.missions[index];
  }
}

export const db = new Database();

