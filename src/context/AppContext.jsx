// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const ROLES = {
  COORDINATOR: {
    id: 'coordinator',
    label: 'Admin / Koordinator BIPA',
    shortLabel: 'Koordinator',
    name: 'Prof. Dr. Irwan Susanto',
    nip: '197508122002121001',
    description: 'Akses penuh jadwal, penugasan dosen, supervisi seluruh kelas, & audit berita acara.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  TEACHER: {
    id: 'teacher',
    label: 'Dosen / Pengajar',
    shortLabel: 'Dosen',
    name: 'Dr. Siti Rahmawati, M.Pd.',
    nip: '198403152008122003',
    description: 'Akses silabus, mencatat realisasi pembelajaran, upload tautan Google Drive, & tanda tangan.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  STUDENT: {
    id: 'student',
    label: 'Peserta Didik (Mahasiswa Asing)',
    shortLabel: 'Mahasiswa',
    name: 'John Alexander Doe (USA)',
    nip: 'BIPA-2601',
    description: 'Melihat rencana silabus, materi pengayaan, catatan evaluasi, & tanda tangan kehadiran sesi.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  SUPERVISOR: {
    id: 'supervisor',
    label: 'Supervisor / Penjaminan Mutu',
    shortLabel: 'Supervisor',
    name: 'Dra. Ratna Handayani, M.Hum.',
    nip: '196904201994032002',
    description: 'Meninjau log realisasi pengajaran, verifikasi catatan dosen, & pengesahan resmi berita acara.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  }
};

export function AppProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('coordinator');
  const [selectedClassId, setSelectedClassId] = useState('bipa-a1');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [syllabuses, setSyllabuses] = useState([]);
  const [realizations, setRealizations] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [cls, sch, syl, real, meet, std] = await Promise.all([
        api.getClasses(),
        api.getSchedule(),
        api.getSyllabus(),
        api.getRealizations(),
        api.getMeetings(),
        api.getStudents()
      ]);
      setClasses(cls || []);
      setSchedules(sch || []);
      setSyllabuses(syl || []);
      setRealizations(real || []);
      setMeetings(meet || []);
      setStudents(std || []);
    } catch (err) {
      console.error("Error loading initial data:", err);
      showToast("Gagal memuat beberapa data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeClass = classes.find(c => c.id === selectedClassId) || classes[0] || {};

  // Handlers
  const handleAddSyllabus = async (entry) => {
    try {
      const created = await api.createSyllabus(entry);
      setSyllabuses(prev => [...prev, created]);
      showToast("Rencana pembelajaran berhasil ditambahkan!");
      return created;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const handleUpdateSyllabus = async (id, data) => {
    try {
      const updated = await api.updateSyllabus(id, data);
      setSyllabuses(prev => prev.map(s => s.id === id ? updated : s));
      showToast("Silabus berhasil diperbarui!");
      return updated;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const handleSaveRealization = async (data) => {
    try {
      const res = await api.saveRealization(data);
      if (res.realization) {
        setRealizations(prev => {
          const idx = prev.findIndex(r => r.id === res.realization.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = res.realization;
            return next;
          }
          return [...prev, res.realization];
        });
      }
      if (res.meetingRecord) {
        setMeetings(prev => {
          const idx = prev.findIndex(m => m.id === res.meetingRecord.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = res.meetingRecord;
            return next;
          }
          return [...prev, res.meetingRecord];
        });
      }
      // Refresh syllabuses to update status
      const updatedSyl = await api.getSyllabus();
      setSyllabuses(updatedSyl);

      showToast("Realisasi pembelajaran berhasil dicatat dan Berita Acara diperbarui!");
      return res;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const handleSignMeeting = async (meetingId, role, payload) => {
    try {
      const updated = await api.signMeeting(meetingId, role, payload);
      setMeetings(prev => prev.map(m => m.id === meetingId ? updated : m));
      // Also sync realizations
      const updatedReal = await api.getRealizations();
      setRealizations(updatedReal);
      showToast(`Tanda tangan ${role === 'supervisor' ? 'Supervisor' : role === 'student' ? 'Mahasiswa' : 'Dosen'} berhasil disimpan!`);
      return updated;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const handleUpdateAttendance = async (meetingId, attendance) => {
    try {
      const updated = await api.updateAttendance(meetingId, attendance);
      setMeetings(prev => prev.map(m => m.id === meetingId ? updated : m));
      showToast("Data presensi peserta didik berhasil disimpan!");
      return updated;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const handleResetData = async () => {
    try {
      await api.resetData();
      await loadData();
      showToast("Data berhasil direset ke standar kurikulum BIPA!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        roleInfo: ROLES[currentRole.toUpperCase()] || ROLES.COORDINATOR,
        selectedClassId,
        setSelectedClassId,
        activeClass,
        activeTab,
        setActiveTab,
        classes,
        students,
        schedules,
        syllabuses,
        realizations,
        meetings,
        loading,
        toast,
        showToast,
        loadData,
        handleAddSyllabus,
        handleUpdateSyllabus,
        handleSaveRealization,
        handleSignMeeting,
        handleUpdateAttendance,
        handleResetData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
