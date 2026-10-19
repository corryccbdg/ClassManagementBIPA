import express from 'express';
import cors from 'cors';
import { db } from './database.js';
import {
  insertIntoGoogleSheet,
  updateInGoogleSheet,
  getAllFromGoogleSheets
} from './googleSheets.js';

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'production';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Graceful JSON Parsing Error Handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Format JSON request tidak valid. Periksa format body.' });
  }
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Lentera BIPA Class Management API', timestamp: new Date().toISOString() });
});

// Authentication & Dummy Accounts
app.post('/api/auth/login', (req, res) => {
  const { identifier, nim, username, password } = req.body || {};
  const queryId = identifier || nim || username;

  if (!queryId || !queryId.toString().trim()) {
    return res.status(400).json({ error: 'NIM atau Akun wajib diisi' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password wajib diisi' });
  }

  const result = db.authenticate(queryId, password);
  if (!result.success) {
    return res.status(401).json({ error: result.error });
  }

  res.json({
    message: 'Login berhasil',
    token: result.token,
    user: result.user
  });
});

app.post('/api/auth/google-login', (req, res) => {
  const result = db.authenticateGoogle(req.body || {});
  if (!result.success) {
    return res.status(401).json({ error: result.error });
  }
  res.json({
    message: 'Login Google berhasil',
    token: result.token,
    user: result.user
  });
});

app.get('/api/auth/dummy-accounts', (req, res) => {
  const users = db.getUsers();
  const sanitized = users.map(u => ({
    id: u.id,
    identifier: u.identifier || u.nim || u.username,
    name: u.name,
    email: u.email || (u.role === 'student' ? `${u.identifier || u.nim || u.username}@mhs.itenas.ac.id` : `${u.identifier || u.username}@itenas.ac.id`),
    nim: u.nim || u.identifier,
    nip: u.nip || u.identifier,
    role: u.role,
    title: u.title,
    country: u.country,
    avatar: u.avatar,
    badge: u.role === 'student' ? 'BIPA Student' : u.role === 'teacher' ? 'Course Lecturer' : u.role === 'coordinator' ? 'Program Coordinator' : u.role === 'supervisor' ? 'Academic Supervisor' : 'Super Admin',
    samplePassword: u.password || 'password123'
  }));
  res.json(sanitized);
});

app.post('/api/auth/register', (req, res) => {
  const result = db.registerUser(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  res.status(201).json({
    message: 'Registrasi berhasil',
    user: result.user
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email, identifier, nim } = req.body || {};
  const query = email || identifier || nim;
  if (!query) {
    return res.status(400).json({ error: 'Email atau NIM wajib diisi' });
  }
  const result = db.forgotPassword(query);
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json(result);
});

app.post('/api/auth/reset-password', (req, res) => {
  const { identifier, email, token, newPassword } = req.body || {};
  const query = identifier || email || token;
  if (!query || !newPassword) {
    return res.status(400).json({ error: 'Akun dan password baru wajib diisi' });
  }
  const result = db.resetPassword(query, newPassword);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.json(result);
});

app.get('/api/auth/me', (req, res) => {
  const { identifier } = req.query;
  if (!identifier) {
    return res.status(400).json({ error: 'Query identifier diperlukan' });
  }
  const user = db.findUser(identifier);
  if (!user) {
    return res.status(404).json({ error: 'User tidak ditemukan' });
  }
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

// Super Admin Role Management & Invitations
app.get('/api/admin/assignments', (req, res) => {
  res.json(db.getAssignments());
});

app.post('/api/admin/assign-role', (req, res) => {
  const result = db.assignRole(req.body || {});
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  // Realtime async sync to Google Sheets
  if (result.assignment) {
    insertIntoGoogleSheet('assignments', {
      id: result.assignment.id,
      role: result.assignment.role,
      roleLabel: result.assignment.roleLabel,
      name: result.assignment.name,
      nip: result.assignment.nip,
      email: result.assignment.email,
      skNumber: result.assignment.skNumber,
      department: result.assignment.department,
      status: result.assignment.status,
      assignedAt: result.assignment.assignedAt,
      invitedAt: result.assignment.invitedAt || result.assignment.assignedAt
    }).catch(err => console.warn('[GoogleSheets Sync Error]:', err));
  }

  res.status(201).json(result);
});

app.post('/api/admin/resend-invite', (req, res) => {
  const { assignmentId } = req.body || {};
  if (!assignmentId) {
    return res.status(400).json({ error: 'ID penugasan diperlukan' });
  }
  const result = db.resendInvitation(assignmentId);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  res.json(result);
});

app.post('/api/admin/revoke-assignment', (req, res) => {
  const { assignmentId } = req.body || {};
  if (!assignmentId) {
    return res.status(400).json({ error: 'ID penugasan diperlukan' });
  }
  const result = db.revokeAssignment(assignmentId);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  res.json(result);
});

// Classes
app.get('/api/classes', (req, res) => {
  res.json(db.getClasses());
});

app.post('/api/classes', (req, res) => {
  const newClass = db.addClass(req.body);
  res.status(201).json(newClass);
});

app.put('/api/classes/:id', (req, res) => {
  const updated = db.updateClass(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Class not found' });
  res.json(updated);
});

app.delete('/api/classes/:id', (req, res) => {
  const success = db.deleteClass(req.params.id);
  if (!success) return res.status(404).json({ error: 'Class not found' });
  res.json({ success: true });
});

// Courses / Learning Materials
app.get('/api/courses', (req, res) => {
  res.json(db.getCourses());
});

app.get('/api/courses/:id', (req, res) => {
  const course = db.getCourseById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

app.post('/api/courses', (req, res) => {
  const saved = db.saveCourse(req.body);
  res.status(201).json(saved);
});

app.delete('/api/courses/:id', (req, res) => {
  const success = db.deleteCourse(req.params.id);
  if (!success) return res.status(404).json({ error: 'Course not found' });
  res.json({ success: true });
});

// Students
app.get('/api/students', (req, res) => {
  const { classId } = req.query;
  res.json(db.getStudents(classId));
});

app.post('/api/students', (req, res) => {
  const student = db.addStudent(req.body);
  res.status(201).json(student);
});

// Schedules
app.get('/api/schedule', (req, res) => {
  const { classId } = req.query;
  res.json(db.getSchedule(classId));
});

app.post('/api/schedule', (req, res) => {
  const slot = db.addSchedule(req.body);
  res.status(201).json(slot);
});

app.put('/api/schedule/:id', (req, res) => {
  const updated = db.updateSchedule(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Schedule slot not found' });
  res.json(updated);
});

app.delete('/api/schedule/:id', (req, res) => {
  db.deleteSchedule(req.params.id);
  res.json({ success: true });
});

// Syllabus
app.get('/api/syllabus', (req, res) => {
  const { classId } = req.query;
  res.json(db.getSyllabus(classId));
});

app.post('/api/syllabus', (req, res) => {
  const entry = db.addSyllabus(req.body);
  res.status(201).json(entry);
});

app.put('/api/syllabus/:id', (req, res) => {
  const updated = db.updateSyllabus(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Syllabus item not found' });
  res.json(updated);
});

app.delete('/api/syllabus/:id', (req, res) => {
  db.deleteSyllabus(req.params.id);
  res.json({ success: true });
});

// Realizations
app.get('/api/realizations', (req, res) => {
  const { classId } = req.query;
  res.json(db.getRealizations(classId));
});

app.post('/api/realizations', (req, res) => {
  const result = db.saveRealization(req.body);
  res.status(201).json(result);
});

// Meeting Records & Digital Signatures
app.get('/api/meetings', (req, res) => {
  const { classId } = req.query;
  res.json(db.getMeetingRecords(classId));
});

app.get('/api/meetings/:id', (req, res) => {
  const record = db.getMeetingRecordById(req.params.id);
  if (!record) return res.status(404).json({ error: 'Meeting record not found' });
  res.json(record);
});

// Sign a meeting record
app.post('/api/meetings/:id/sign', (req, res) => {
  const { role, payload } = req.body;
  const updated = db.signMeetingRecord(req.params.id, role, payload);
  if (!updated) return res.status(404).json({ error: 'Meeting record not found' });
  res.json(updated);
});

// Update attendance for a meeting record
app.put('/api/meetings/:id/attendance', (req, res) => {
  const { attendance } = req.body;
  const updated = db.updateMeetingAttendance(req.params.id, attendance);
  if (!updated) return res.status(404).json({ error: 'Meeting record not found' });
  res.json(updated);
});

// --- Darmasiswa RI Endpoints ---
app.get('/api/darmasiswa/sessions', (req, res) => {
  res.json(db.getDarmasiswaSessions());
});

app.get('/api/darmasiswa/sessions/:id', (req, res) => {
  const session = db.getDarmasiswaSessionById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Sesi Darmasiswa tidak ditemukan' });
  res.json(session);
});

app.post('/api/darmasiswa/sessions', (req, res) => {
  const saved = db.saveDarmasiswaSession(req.body);
  res.status(201).json(saved);
});

app.put('/api/darmasiswa/sessions/:id', (req, res) => {
  const saved = db.saveDarmasiswaSession({ id: req.params.id, ...req.body });
  res.json(saved);
});

app.post('/api/darmasiswa/sessions/:id/facilitator-sign', (req, res) => {
  const updated = db.signDarmasiswaSession(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Sesi Darmasiswa tidak ditemukan' });
  res.json(updated);
});

app.post('/api/darmasiswa/sessions/:id/student-checkin', (req, res) => {
  const { nim, ...checkInData } = req.body || {};
  if (!nim) return res.status(400).json({ error: 'NIM mahasiswa wajib diisi' });
  const updated = db.checkInDarmasiswaStudent(req.params.id, nim, checkInData);
  if (!updated) return res.status(404).json({ error: 'Sesi Darmasiswa tidak ditemukan' });

  // Sync to Google Sheets attendances tab
  insertIntoGoogleSheet('attendances', {
    id: `att-${req.params.id}-${nim}`,
    session_id: req.params.id,
    student_id: nim,
    student_name: checkInData.name || nim,
    status: checkInData.status || 'PRESENT',
    notes: checkInData.note || '',
    signTime: checkInData.signTime || new Date().toLocaleString('id-ID'),
    verified: 'true'
  }).catch(err => console.warn('[GoogleSheets Sync Error]:', err));

  res.json(updated);
});

app.get('/api/darmasiswa/students', (req, res) => {
  res.json(db.getDarmasiswaStudents());
});

app.get('/api/darmasiswa/institution-info', (req, res) => {
  res.json(db.getItenasInfo());
});

// Pedagogical Logs for Supervisor & Quality Assurance
app.get('/api/pedagogical-logs', (req, res) => {
  res.json(db.getPedagogicalLogs());
});

app.post('/api/pedagogical-logs', (req, res) => {
  const newLog = db.addPedagogicalLog(req.body);
  res.status(201).json(newLog);
});

app.put('/api/pedagogical-logs/:id', (req, res) => {
  const updated = db.updatePedagogicalLog(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Log tidak ditemukan' });
  res.json(updated);
});

app.post('/api/pedagogical-logs/:id/respond', (req, res) => {
  const updated = db.respondPedagogicalLog(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Log tidak ditemukan' });
  res.json(updated);
});

// Student Missions & Practical Tasks
app.get('/api/student/missions', (req, res) => {
  res.json(db.getMissions());
});

app.put('/api/student/missions/:code', (req, res) => {
  const updated = db.updateMission(req.params.code, req.body);
  if (!updated) return res.status(404).json({ error: 'Misi tidak ditemukan' });
  res.json(updated);
});

// Realtime Google Sheets status & sync check
app.get('/api/google-sheets/status', async (req, res) => {
  try {
    const data = await getAllFromGoogleSheets();
    res.json({
      connected: !!data,
      sheetUrl: 'https://docs.google.com/spreadsheets',
      counts: {
        assignments: data?.assignments?.length || 0,
        users: data?.users?.length || 0,
        classes: data?.classes?.length || 0,
        sessions: data?.sessions?.length || 0,
        attendances: data?.attendances?.length || 0
      }
    });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// Reset database to seed
app.post('/api/reset', (req, res) => {
  db.resetToSeed();
  res.json({ message: 'Database reset to initial seed successfully' });
});

// Cumulative logbook export endpoint
app.get('/api/export/logbook', (req, res) => {
  const { classId } = req.query;
  const classes = db.getClasses();
  const cls = classes.find(c => c.id === classId) || classes[0];
  const syllabuses = db.getSyllabus(cls.id);
  const realizations = db.getRealizations(cls.id);
  const meetings = db.getMeetingRecords(cls.id);
  const students = db.getStudents(cls.id);

  res.json({
    classInfo: cls,
    students,
    totalPlannedMeetings: syllabuses.length,
    totalRealizedMeetings: realizations.length,
    syllabuses,
    realizations,
    meetings,
    generatedAt: new Date().toISOString()
  });
});

// Serve frontend static build if dist directory exists
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`Lentera BIPA Class Management Server running in ${NODE_ENV.toUpperCase()} mode on port ${PORT}`);
  console.log(`Application URL: http://localhost:${PORT}`);
});

