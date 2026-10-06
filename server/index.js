// server/index.js
import express from 'express';
import cors from 'cors';
import { db } from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Lentera BIPA Class Management API', timestamp: new Date().toISOString() });
});

// Classes
app.get('/api/classes', (req, res) => {
  res.json(db.getClasses());
});

app.post('/api/classes', (req, res) => {
  const newClass = db.addClass(req.body);
  res.status(201).json(newClass);
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
  console.log(`Lentera BIPA Class Management Server running on port ${PORT}`);
});

