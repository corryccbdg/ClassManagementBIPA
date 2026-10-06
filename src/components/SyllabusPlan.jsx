// src/components/SyllabusPlan.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Gamepad2,
  Compass,
  Layers,
  Plus,
  Edit3,
  CheckCircle,
  Eye,
  Search,
  Filter,
  FileCheck
} from 'lucide-react';

export default function SyllabusPlan() {
  const {
    activeClass,
    syllabuses,
    currentRole,
    handleAddSyllabus,
    handleUpdateSyllabus,
    setActiveTab,
    setSelectedClassId,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    minggu: 1,
    pertemuan: 1,
    hariTanggal: '',
    waktu: '08:00 - 09:40 WIB',
    unit: '',
    materi: '',
    halaman: '',
    fokusPembelajaran: '',
    ideGames: '',
    pengayaan: '',
    ideImersifKampus: '',
    status: 'Planned'
  });

  const classSyllabuses = syllabuses.filter(s => s.classId === activeClass.id);

  const filtered = classSyllabuses.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.unit?.toLowerCase().includes(term) ||
      item.materi?.toLowerCase().includes(term) ||
      item.fokusPembelajaran?.toLowerCase().includes(term) ||
      item.ideImersifKampus?.toLowerCase().includes(term)
    );
  });

  const handleOpenAdd = () => {
    setIsEditing(false);
    const nextMeeting = classSyllabuses.length + 1;
    const nextWeek = Math.ceil(nextMeeting / 2);
    setFormData({
      minggu: nextWeek,
      pertemuan: nextMeeting,
      hariTanggal: 'Senin, 19 Okt 2026',
      waktu: '08:00 - 09:40 WIB',
      unit: `Unit ${nextMeeting}: `,
      materi: '',
      halaman: 'Sahabatku Indonesia Hlm. ',
      fokusPembelajaran: '',
      ideGames: '',
      pengayaan: '',
      ideImersifKampus: '',
      status: 'Planned'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.unit || !formData.materi) {
      showToast("Unit dan Materi wajib diisi", "error");
      return;
    }

    try {
      if (isEditing) {
        await handleUpdateSyllabus(formData.id, formData);
      } else {
        await handleAddSyllabus({
          ...formData,
          classId: activeClass.id
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Rencana Pembelajaran / Silabus Terstruktur ({activeClass.name})
              </h2>
              <p className="text-xs text-slate-500">
                Perencanaan pertemuan mingguan, target tata bahasa, aktivitas games, & tugas imersi lapangan
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari unit, materi, fokus..."
              className="text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-56"
            />
          </div>

          {/* Add Syllabus button */}
          {(currentRole === 'coordinator' || currentRole === 'teacher') && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Rencana Pertemuan</span>
            </button>
          )}
        </div>
      </div>

      {/* Structured Syllabus Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-3 w-16 text-center">Minggu</th>
                <th className="py-3.5 px-3 w-20 text-center">Pertemuan</th>
                <th className="py-3.5 px-3 w-36">Jadwal & Waktu</th>
                <th className="py-3.5 px-4 w-52">Unit & Materi Pokok</th>
                <th className="py-3.5 px-3 w-28">Ref. Halaman</th>
                <th className="py-3.5 px-4">Fokus Pembelajaran</th>
                <th className="py-3.5 px-4 w-44">Ide Games & Interaktif</th>
                <th className="py-3.5 px-4 w-44">Pengayaan & Imersi Kampus</th>
                <th className="py-3.5 px-3 w-24 text-center">Status</th>
                <th className="py-3.5 px-3 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400">
                    Tidak ditemukan data rencana pembelajaran.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isCompleted = item.status === 'Completed';
                  const isInProgress = item.status === 'In Progress';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Minggu */}
                      <td className="py-4 px-3 text-center font-bold text-slate-800 bg-slate-50/50">
                        Mg {item.minggu}
                      </td>

                      {/* Pertemuan */}
                      <td className="py-4 px-3 text-center">
                        <span className="inline-block px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200">
                          #{item.pertemuan}
                        </span>
                      </td>

                      {/* Jadwal & Waktu */}
                      <td className="py-4 px-3 space-y-1">
                        <div className="font-semibold text-slate-800">{item.hariTanggal}</div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{item.waktu}</span>
                        </div>
                      </td>

                      {/* Unit & Materi */}
                      <td className="py-4 px-4 space-y-1">
                        <div className="font-bold text-emerald-800">{item.unit}</div>
                        <div className="text-slate-600 text-xs">{item.materi}</div>
                      </td>

                      {/* Halaman */}
                      <td className="py-4 px-3 text-slate-500 font-medium">
                        {item.halaman}
                      </td>

                      {/* Fokus Pembelajaran */}
                      <td className="py-4 px-4 text-slate-700 leading-relaxed text-xs">
                        {item.fokusPembelajaran}
                      </td>

                      {/* Ide Games */}
                      <td className="py-4 px-4 text-xs">
                        {item.ideGames ? (
                          <div className="bg-amber-50/80 border border-amber-200 p-2 rounded-lg text-amber-900 flex items-start gap-1.5">
                            <Gamepad2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{item.ideGames}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Pengayaan & Imersi Kampus */}
                      <td className="py-4 px-4 text-xs space-y-1">
                        {item.pengayaan && (
                          <div className="text-[11px] text-slate-600 line-clamp-1">
                            <strong className="text-slate-800">Pengayaan:</strong> {item.pengayaan}
                          </div>
                        )}
                        {item.ideImersifKampus && (
                          <div className="bg-teal-50 border border-teal-200 p-1.5 rounded-lg text-[11px] text-teal-900 flex items-start gap-1">
                            <Compass className="w-3 h-3 text-teal-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{item.ideImersifKampus}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isInProgress
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedEntry(item)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Lihat Detail Lengkap"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {(currentRole === 'coordinator' || currentRole === 'teacher') && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Edit Silabus"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('realization');
                                }}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[10px] border border-emerald-200 transition-colors"
                                title="Catat Realisasi Mengajar Sesi Ini"
                              >
                                Realisasi
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal View */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Pertemuan #{selectedEntry.pertemuan} — Minggu {selectedEntry.minggu}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedEntry.hariTanggal} • {selectedEntry.waktu}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div>
                  <span className="text-slate-500 font-semibold">Unit & Topik:</span>
                  <div className="text-sm font-bold text-slate-900">{selectedEntry.unit}</div>
                  <div className="text-slate-600 font-medium">{selectedEntry.materi}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Referensi Buku / Modul:</span>
                  <div className="font-semibold text-slate-800">{selectedEntry.halaman}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Fokus Pembelajaran & Sasaran Linguistik:</h4>
                <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  {selectedEntry.fokusPembelajaran}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <Gamepad2 className="w-4 h-4 text-amber-700" />
                    <span>Ide Games & Interaktif</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    {selectedEntry.ideGames || "Belum ada rencana permainan."}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
                  <div className="flex items-center gap-1.5 font-bold text-teal-900 mb-1">
                    <Compass className="w-4 h-4 text-teal-700" />
                    <span>Tugas Imersif Kampus / Sekitar</span>
                  </div>
                  <p className="text-teal-800 text-[11px] leading-relaxed">
                    {selectedEntry.ideImersifKampus || "Belum ada tugas imersi."}
                  </p>
                </div>
              </div>

              {selectedEntry.pengayaan && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800">Latihan Pengayaan & Mandiri:</span>
                  <p className="text-slate-600 mt-1">{selectedEntry.pengayaan}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedEntry(null);
                  setActiveTab('realization');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Lanjut Catat Realisasi</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Syllabus Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                {isEditing ? 'Edit Rencana Pembelajaran' : 'Tambah Rencana Pertemuan Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Minggu Ke</label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={formData.minggu}
                    onChange={(e) => setFormData({ ...formData, minggu: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pertemuan Ke</label>
                  <input
                    type="number"
                    min="1"
                    max="32"
                    value={formData.pertemuan}
                    onChange={(e) => setFormData({ ...formData, pertemuan: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hari & Tanggal</label>
                  <input
                    type="text"
                    value={formData.hariTanggal}
                    onChange={(e) => setFormData({ ...formData, hariTanggal: e.target.value })}
                    placeholder="Senin, 19 Okt 2026"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Waktu Sesi</label>
                  <input
                    type="text"
                    value={formData.waktu}
                    onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit Kurikulum</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="Contoh: Unit 4: Memesan Makanan di Restoran"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Topik / Materi Spesifik</label>
                <input
                  type="text"
                  value={formData.materi}
                  onChange={(e) => setFormData({ ...formData, materi: e.target.value })}
                  placeholder="Contoh: Kosakata rasa, meminta menu, pelafalan 'tidak terlalu pedas'"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Halaman Buku Referensi</label>
                <input
                  type="text"
                  value={formData.halaman}
                  onChange={(e) => setFormData({ ...formData, halaman: e.target.value })}
                  placeholder="Contoh: Hlm. 45 - 58 (Sahabatku Indonesia A1)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fokus Pembelajaran & Sasaran Linguistik</label>
                <textarea
                  rows={2}
                  value={formData.fokusPembelajaran}
                  onChange={(e) => setFormData({ ...formData, fokusPembelajaran: e.target.value })}
                  placeholder="Tata bahasa, fonetik pelafalan, kosa kata kunci, dll."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ide Games / Aktivitas Kelas</label>
                  <textarea
                    rows={2}
                    value={formData.ideGames}
                    onChange={(e) => setFormData({ ...formData, ideGames: e.target.value })}
                    placeholder="Contoh: Roleplay Pelayan dan Tamu Restoran"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ide Imersif di Kampus/Sekitar</label>
                  <textarea
                    rows={2}
                    value={formData.ideImersifKampus}
                    onChange={(e) => setFormData({ ...formData, ideImersifKampus: e.target.value })}
                    placeholder="Contoh: Praktik memesan es teh di kantin kampus"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Latihan Pengayaan</label>
                <input
                  type="text"
                  value={formData.pengayaan}
                  onChange={(e) => setFormData({ ...formData, pengayaan: e.target.value })}
                  placeholder="Contoh: Rekaman audio listening pesan antar makanan"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
              >
                {isEditing ? 'Simpan Perubahan' : 'Tambahkan ke Silabus'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
