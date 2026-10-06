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
  initialMeetingRecords
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
      meetingRecords: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
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
      meetingRecords: [...initialMeetingRecords]
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

  // --- Students ---
  getStudents(classId) {
    if (!classId) return this.data.students;
    return this.data.students.filter(s => s.classId === classId);
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
}

export const db = new Database();
