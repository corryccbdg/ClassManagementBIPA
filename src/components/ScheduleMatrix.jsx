// src/components/ScheduleMatrix.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FolderOpen,
  Plus,
  ExternalLink,
  Filter,
  CheckCircle,
  FileText
} from 'lucide-react';

const DAYS = [
  { id: 'Senin', label: 'Senin (Monday)' },
  { id: 'Selasa', label: 'Selasa (Tuesday)' },
  { id: 'Rabu', label: 'Rabu (Wednesday)' },
  { id: 'Kamis', label: 'Kamis (Thursday)' },
  { id: 'Jumat', label: 'Jumat (Friday)' }
];

const TIME_SLOTS = [
  '08:00 - 09:40',
  '10:00 - 11:40',
  '13:00 - 14:40',
  '15:00 - 16:40'
];

export default function ScheduleMatrix() {
  const {
    schedules,
    classes,
    currentRole,
    selectedClassId,
    setSelectedClassId,
    setActiveTab,
    showToast
  } = useApp();

  const [filterClass, setFilterClass] = useState('all');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for new slot
  const [formData, setFormData] = useState({
    classId: selectedClassId,
    day: 'Senin',
    timeSlot: '08:00 - 09:40',
    room: 'R. Nusantara 101',
    instructorName: '',
    sessionType: 'Tata Bahasa & Percakapan',
    driveMaterialsFolder: '',
    driveActivityFolder: ''
  });

  const filteredSchedules = schedules.filter((item) => {
    if (filterClass !== 'all' && item.classId !== filterClass) return false;
    return true;
  });

  const getSlotItem = (day, timeSlot) => {
    return filteredSchedules.find(s => s.day === day && s.timeSlot.startsWith(timeSlot.slice(0, 5)));
  };

  const handleOpenAdd = () => {
    const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];
    setFormData({
      classId: currentClass.id,
      day: 'Senin',
      timeSlot: '08:00 - 09:40',
      room: currentClass.room,
      instructorName: currentClass.instructorName,
      sessionType: 'Praktik Bahasa & Imersi',
      driveMaterialsFolder: currentClass.driveMaterialsFolder,
      driveActivityFolder: currentClass.driveActivityFolder
    });
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Master Schedule Matrix (Jadwal Terpadu)</h2>
              <p className="text-xs text-slate-500">Matriks mingguan pemetaan hari, jam belajar, pengajar, ruang, & folder Google Drive</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Filter Kelas:</span>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Kelas & Modul</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.levelName})</option>
              ))}
            </select>
          </div>

          {/* Add Slot Button (Coordinator only) */}
          {(currentRole === 'coordinator' || currentRole === 'teacher') && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Timetable Matrix Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-4 w-36 border-r border-slate-200 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Jam Kuliah</span>
                  </div>
                </th>
                {DAYS.map(day => (
                  <th key={day.id} className="py-4 px-4 text-center border-r border-slate-200 last:border-r-0">
                    <div>{day.label.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-400 font-normal lowercase">{day.label.split(' ')[1]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {TIME_SLOTS.map((timeSlot) => (
                <tr key={timeSlot} className="hover:bg-slate-50/50 transition-colors">
                  {/* Time slot header cell */}
                  <td className="py-4 px-3 font-mono font-bold text-slate-600 bg-slate-50/70 border-r border-slate-200 text-center align-top">
                    <span className="inline-block px-2 py-1 rounded bg-white border border-slate-200 shadow-2xs">
                      {timeSlot}
                    </span>
                  </td>

                  {/* Days cells */}
                  {DAYS.map(day => {
                    const slot = getSlotItem(day.id, timeSlot);
                    const classInfo = slot ? classes.find(c => c.id === slot.classId) : null;

                    return (
                      <td
                        key={day.id}
                        className="p-2 border-r border-slate-200 last:border-r-0 align-top min-h-[110px]"
                      >
                        {slot ? (
                          <div
                            onClick={() => setSelectedSlot({ ...slot, classInfo })}
                            className="group p-3 rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer relative"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-extrabold text-xs px-2 py-0.5 rounded bg-emerald-600 text-white shadow-2xs">
                                {classInfo?.name || slot.classId}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {slot.timeSlot}
                              </span>
                            </div>

                            <div className="font-bold text-slate-800 text-xs mb-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                              {slot.sessionType}
                            </div>

                            <div className="space-y-0.5 text-[11px] text-slate-500">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{slot.instructorName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                                <span className="truncate">{slot.room}</span>
                              </div>
                            </div>

                            {/* Google Drive links indicator */}
                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-amber-700 flex items-center gap-1">
                                <FolderOpen className="w-3 h-3 text-amber-500" />
                                <span>Drive Tersedia</span>
                              </span>
                              <span className="text-[10px] text-slate-400 group-hover:text-emerald-600 font-semibold flex items-center gap-0.5">
                                Detail →
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full min-h-[90px] rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-[11px] hover:bg-slate-50/80 transition-colors">
                            <span>Kosong</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Slot Detail Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {selectedSlot.classInfo?.name} — {selectedSlot.classInfo?.levelName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedSlot.day}, {selectedSlot.timeSlot}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Topik / Tipe Sesi:</span>
                  <span className="font-bold text-slate-900">{selectedSlot.sessionType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Dosen Pengampu:</span>
                  <span className="font-bold text-slate-900">{selectedSlot.instructorName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Ruang Perkuliahan:</span>
                  <span className="font-bold text-slate-900">{selectedSlot.room}</span>
                </div>
              </div>

              {/* Drive Folders */}
              <div className="space-y-2">
                <div className="text-slate-600 font-bold">Tautan Google Drive Terintegrasi:</div>
                {selectedSlot.driveMaterialsFolder && (
                  <a
                    href={selectedSlot.driveMaterialsFolder}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="font-bold">Folder Bahan Tayang & Modul</div>
                        <div className="text-[10px] text-amber-700">{selectedSlot.driveMaterialsFolder}</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-amber-700" />
                  </a>
                )}

                {selectedSlot.driveActivityFolder && (
                  <a
                    href={selectedSlot.driveActivityFolder}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-teal-600" />
                      <div>
                        <div className="font-bold">Folder Foto & Video Dokumentasi</div>
                        <div className="text-[10px] text-teal-700">{selectedSlot.driveActivityFolder}</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-teal-700" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedClassId(selectedSlot.classId);
                  setSelectedSlot(null);
                  setActiveTab('realization');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Catat Realisasi Sesi Ini</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
