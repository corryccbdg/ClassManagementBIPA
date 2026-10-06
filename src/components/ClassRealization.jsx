// src/components/ClassRealization.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  AlertCircle,
  FolderOpen,
  Share2,
  Send,
  Eye,
  FileSignature,
  Sparkles,
  Link2,
  Instagram,
  ArrowRight
} from 'lucide-react';

export default function ClassRealization() {
  const {
    activeClass,
    syllabuses,
    realizations,
    currentRole,
    handleSaveRealization,
    setActiveTab,
    showToast
  } = useApp();

  const classSyllabuses = syllabuses.filter(s => s.classId === activeClass.id);
  const classRealizations = realizations.filter(r => r.classId === activeClass.id);

  // Selected syllabus to log realization for
  const [selectedSyllabusId, setSelectedSyllabusId] = useState(
    classSyllabuses.find(s => s.status !== 'Completed')?.id || classSyllabuses[0]?.id || ''
  );

  const currentSyllabus = classSyllabuses.find(s => s.id === selectedSyllabusId);

  // Form State
  const [formData, setFormData] = useState({
    hariTanggalRealisasi: 'Kamis, 09 Okt 2026',
    waktuRealisasi: '08:00 - 09:45 WIB',
    unitMateriTerlaksana: currentSyllabus ? `${currentSyllabus.unit} (Sesuai Rencana)` : '',
    kesesuaianRencana: 'Sesuai Penuh',
    pelaksanaanPembelajaran: '',
    catatanImprovement: '',
    mediaDriveLink: activeClass.driveMaterialsFolder || '',
    activityDriveLink: activeClass.driveActivityFolder || '',
    socialMediaLink: 'https://instagram.com/reel/BIPA_Activity_2026',
    status: 'Submitted'
  });

  // Sync unit when syllabus selection changes
  const handleSelectSyllabus = (sylId) => {
    setSelectedSyllabusId(sylId);
    const target = classSyllabuses.find(s => s.id === sylId);
    if (target) {
      setFormData(prev => ({
        ...prev,
        unitMateriTerlaksana: `${target.unit} — ${target.materi}`,
        hariTanggalRealisasi: target.hariTanggal || prev.hariTanggalRealisasi,
        waktuRealisasi: target.waktu || prev.waktuRealisasi
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.unitMateriTerlaksana || !formData.pelaksanaanPembelajaran) {
      showToast("Unit materi terlaksana dan narasi pelaksanaan wajib diisi", "error");
      return;
    }

    try {
      await handleSaveRealization({
        ...formData,
        classId: activeClass.id,
        syllabusId: selectedSyllabusId,
        meetingNumber: currentSyllabus?.pertemuan || classRealizations.length + 1
      });
      // Optionally route to meetings tab to sign
      setActiveTab('meetings');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Pelacakan & Pencatatan Realisasi Mengajar ({activeClass.name})
            </h2>
            <p className="text-xs text-slate-500">
              Catat fakta pelaksanaan pembelajaran di kelas, evaluasi catatan pedagogis, dan tautan arsip digital
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('meetings')}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
        >
          <FileSignature className="w-4 h-4 text-emerald-600" />
          <span>Lihat Berita Acara & Tanda Tangan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): Input Form */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>Formulir Jurnal Mengajar Dosen</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                Sinkron dengan Berita Acara
              </span>
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Link to Syllabus Meeting */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pilih Acuan Rencana Silabus (Pertemuan):
              </label>
              <select
                value={selectedSyllabusId}
                onChange={(e) => handleSelectSyllabus(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {classSyllabuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    Pertemuan #{s.pertemuan} (Mg {s.minggu}): {s.unit} — Status: {s.status}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Realization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hari & Tanggal Realisasi</span>
                </label>
                <input
                  type="text"
                  value={formData.hariTanggalRealisasi}
                  onChange={(e) => setFormData({ ...formData, hariTanggalRealisasi: e.target.value })}
                  placeholder="Contoh: Kamis, 09 Okt 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Waktu Realisasi Pembelajaran</span>
                </label>
                <input
                  type="text"
                  value={formData.waktuRealisasi}
                  onChange={(e) => setFormData({ ...formData, waktuRealisasi: e.target.value })}
                  placeholder="Contoh: 08:00 - 09:45 WIB"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Unit & Materi Terlaksana */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Unit & Materi Terlaksana
              </label>
              <input
                type="text"
                value={formData.unitMateriTerlaksana}
                onChange={(e) => setFormData({ ...formData, unitMateriTerlaksana: e.target.value })}
                placeholder="Topik dan materi aktual yang diajarkan"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Kesesuaian Rencana */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Kesesuaian Terhadap Rencana
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Sesuai Penuh', label: '✓ Sesuai Penuh', color: 'peer-checked:bg-emerald-600 peer-checked:text-white' },
                  { id: 'Ada Penyesuaian', label: '⚡ Ada Penyesuaian', color: 'peer-checked:bg-amber-600 peer-checked:text-white' },
                  { id: 'Materi Pengganti', label: '🔄 Materi Pengganti', color: 'peer-checked:bg-blue-600 peer-checked:text-white' }
                ].map((opt) => (
                  <label key={opt.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="kesesuaianRencana"
                      value={opt.id}
                      checked={formData.kesesuaianRencana === opt.id}
                      onChange={(e) => setFormData({ ...formData, kesesuaianRencana: e.target.value })}
                      className="sr-only peer"
                    />
                    <div className="p-2 rounded-xl border border-slate-200 text-center font-bold text-slate-600 bg-slate-50 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600 transition-all">
                      {opt.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Pelaksanaan Pembelajaran (Detailed Narrative) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Pelaksanaan Pembelajaran (Deskripsi Naratif Kelas)</span>
                <span className="text-[11px] text-slate-400 font-normal">Aktivitas, partisipasi, & imersi</span>
              </label>
              <textarea
                rows={4}
                value={formData.pelaksanaanPembelajaran}
                onChange={(e) => setFormData({ ...formData, pelaksanaanPembelajaran: e.target.value })}
                placeholder="Tuliskan jalannya perkuliahan secara detail: respon mahasiswa asing, games yang dimainkan, keterlibatan kelompok, kunjungan lapangan, dan penguasaan target kompetensi..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Catatan / Notes for Improvement */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span className="text-amber-800 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Catatan Pedagogis / Notes for Improvement
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Hambatan pelafalan & evaluasi</span>
              </label>
              <textarea
                rows={3}
                value={formData.catatanImprovement}
                onChange={(e) => setFormData({ ...formData, catatanImprovement: e.target.value })}
                placeholder="Contoh: Mahasiswa Eropa masih kesulitan melafalkan konsonan sengau /ng/ dan /ny/. Perlu latihan drill ritmis tambahan. Pemahaman tawar menawar sangat baik."
                className="w-full px-3 py-2 bg-amber-50/40 border border-amber-200 rounded-xl leading-relaxed focus:ring-2 focus:ring-amber-500 text-slate-800"
              />
            </div>

            {/* Media & Documentation Links (Google Drive) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-amber-600" />
                <span>Tautan Arsip & Dokumentasi Google Drive</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Folder Bahan Ajar Dosen (<code className="text-emerald-700">Nama Dosen_Unit/Topik</code>)
                  </label>
                  <input
                    type="url"
                    value={formData.mediaDriveLink}
                    onChange={(e) => setFormData({ ...formData, mediaDriveLink: e.target.value })}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Folder Foto & Video Kegiatan (<code className="text-teal-700">Nama Dosen_Topik Kegiatan</code>)
                  </label>
                  <input
                    type="url"
                    value={formData.activityDriveLink}
                    onChange={(e) => setFormData({ ...formData, activityDriveLink: e.target.value })}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Social media link */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tautan Publikasi Media Sosial (Opsional - IG Reels / TikTok / YouTube)</span>
                </label>
                <input
                  type="url"
                  value={formData.socialMediaLink}
                  onChange={(e) => setFormData({ ...formData, socialMediaLink: e.target.value })}
                  placeholder="https://instagram.com/reel/..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Pencatatan realisasi akan menerbitkan draf Berita Acara untuk ditandatangani.
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan Realisasi & Buka Berita Acara</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (4 Cols): Historical Realizations Log */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Catatan Realisasi Terdaftar ({classRealizations.length})
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {classRealizations.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada realisasi untuk kelas ini.
                </div>
              ) : (
                classRealizations.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px]">
                        Pertemuan #{item.meetingNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status === 'Verified' ? '✓ Verified' : '⏳ Review'}
                      </span>
                    </div>

                    <div className="font-bold text-slate-800 line-clamp-1">{item.unitMateriTerlaksana}</div>
                    <div className="text-slate-500 text-[11px] line-clamp-2">{item.pelaksanaanPembelajaran}</div>

                    {item.catatanImprovement && (
                      <div className="p-2 rounded bg-amber-50 text-amber-900 text-[10px] border border-amber-200">
                        <strong>Catatan:</strong> {item.catatanImprovement}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{item.hariTanggalRealisasi}</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('meetings')}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5 text-[11px]"
                      >
                        <span>Berita Acara</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
