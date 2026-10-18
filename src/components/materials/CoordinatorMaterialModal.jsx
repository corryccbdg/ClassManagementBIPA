import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  BookOpen,
  Headphones,
  CheckCircle2,
  FileText,
  Sparkles,
  ExternalLink,
  Layers,
  HelpCircle,
  Award
} from 'lucide-react';

export default function CoordinatorMaterialModal({
  isOpen,
  onClose,
  onSave,
  initialData = null
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    unitNumber: 6,
    unitTitle: 'Unit 6 Pages 71 to 85',
    bookTitle: 'BIPA B1 Conversation Textbook',
    title: '',
    category: 'Conversation & Culture',
    level: 'B1 Intermediate',
    description: '',
    image: '/task_market.jpg',
    audioTitle: '',
    audioDuration: '15 Minutes',
    grammarFocus: '',
    driveUrl: 'https://drive.google.com',
    isMission: false,
    topics: [''],
    vocabularies: [{ term: '', meaning: '' }],
    downloadableDocs: ['']
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        unitNumber: initialData.unitNumber || 1,
        unitTitle: initialData.unitTitle || '',
        bookTitle: initialData.bookTitle || 'BIPA B1 Conversation Textbook',
        title: initialData.title || '',
        category: initialData.category || 'Conversation & Culture',
        level: initialData.level || 'B1 Intermediate',
        description: initialData.description || '',
        image: initialData.image || '/task_market.jpg',
        audioTitle: initialData.audioTitle || '',
        audioDuration: initialData.audioDuration || '15 Minutes',
        grammarFocus: initialData.grammarFocus || '',
        driveUrl: initialData.driveUrl || 'https://drive.google.com',
        isMission: Boolean(initialData.isMission),
        topics: initialData.topics && initialData.topics.length > 0 ? [...initialData.topics] : [''],
        vocabularies: initialData.vocabularies && initialData.vocabularies.length > 0 ? initialData.vocabularies.map(v => ({ ...v })) : [{ term: '', meaning: '' }],
        downloadableDocs: initialData.downloadableDocs && initialData.downloadableDocs.length > 0 ? [...initialData.downloadableDocs] : ['']
      });
    } else {
      setFormData({
        unitNumber: 6,
        unitTitle: 'Unit 6 Pages 71 to 85',
        bookTitle: 'BIPA B1 Conversation Textbook',
        title: '',
        category: 'Conversation & Culture',
        level: 'B1 Intermediate',
        description: '',
        image: '/task_market.jpg',
        audioTitle: 'Audio Track 06 (Dialogue Practice)',
        audioDuration: '15 Minutes',
        grammarFocus: '',
        driveUrl: 'https://drive.google.com',
        isMission: false,
        topics: [''],
        vocabularies: [{ term: '', meaning: '' }],
        downloadableDocs: ['Unit6_Material_Slide.pdf']
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Handlers for Topics List
  const handleTopicChange = (index, value) => {
    const updated = [...formData.topics];
    updated[index] = value;
    setFormData({ ...formData, topics: updated });
  };

  const handleAddTopic = () => {
    setFormData({ ...formData, topics: [...formData.topics, ''] });
  };

  const handleRemoveTopic = (index) => {
    const updated = formData.topics.filter((_, i) => i !== index);
    setFormData({ ...formData, topics: updated.length ? updated : [''] });
  };

  // Handlers for Vocabularies List
  const handleVocabChange = (index, field, value) => {
    const updated = [...formData.vocabularies];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, vocabularies: updated });
  };

  const handleAddVocab = () => {
    setFormData({
      ...formData,
      vocabularies: [...formData.vocabularies, { term: '', meaning: '' }]
    });
  };

  const handleRemoveVocab = (index) => {
    const updated = formData.vocabularies.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      vocabularies: updated.length ? updated : [{ term: '', meaning: '' }]
    });
  };

  // Handlers for Downloadable Docs List
  const handleDocChange = (index, value) => {
    const updated = [...formData.downloadableDocs];
    updated[index] = value;
    setFormData({ ...formData, downloadableDocs: updated });
  };

  const handleAddDoc = () => {
    setFormData({
      ...formData,
      downloadableDocs: [...formData.downloadableDocs, '']
    });
  };

  const handleRemoveDoc = (index) => {
    const updated = formData.downloadableDocs.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      downloadableDocs: updated.length ? updated : ['']
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a lesson title for this unit.');
      return;
    }

    const cleanedTopics = formData.topics.map(t => t.trim()).filter(Boolean);
    const cleanedVocab = formData.vocabularies
      .filter(v => v.term.trim() || v.meaning.trim())
      .map(v => ({ term: v.term.trim(), meaning: v.meaning.trim() }));
    const cleanedDocs = formData.downloadableDocs.map(d => d.trim()).filter(Boolean);

    const payload = {
      ...formData,
      id: initialData?.id || `unit-${formData.unitNumber || Date.now()}`,
      topics: cleanedTopics.length ? cleanedTopics : ['Module overview and learning objectives'],
      vocabularies: cleanedVocab.length ? cleanedVocab : [{ term: 'Bahasa', meaning: 'Language' }],
      downloadableDocs: cleanedDocs.length ? cleanedDocs : ['BIPA_Learning_Module.pdf'],
      progress: initialData?.progress !== undefined ? initialData.progress : 0,
      isCompleted: initialData?.isCompleted || false
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {isEditing ? 'Edit Material Mode' : 'Add New Material'}
                </span>
                <span className="text-xs text-slate-400">Student Syllabus Management</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                {isEditing ? `Edit: ${initialData.title}` : 'Create New Unit Material and Syllabus'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 bg-slate-50/50">
          {/* Section 1: Core Unit Identity */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              1 Unit Identity and Reference Textbook
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Unit Number
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.unitNumber}
                  onChange={(e) => setFormData({ ...formData, unitNumber: parseFloat(e.target.value) || e.target.value })}
                  placeholder="e.g. 6"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Unit and Page Label
                </label>
                <input
                  type="text"
                  value={formData.unitTitle}
                  onChange={(e) => setFormData({ ...formData, unitTitle: e.target.value })}
                  placeholder="Unit 6 Pages 71 to 85"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Textbook Title
                </label>
                <input
                  type="text"
                  value={formData.bookTitle}
                  onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                  placeholder="BIPA B1 Conversation Textbook"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Lesson Title Displayed on Student Dashboard
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Indonesian Culinary Arts and Sundanese Traditional Recipes"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Material Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="Conversation and Culture">Conversation and Culture</option>
                  <option value="Grammar and Dialogue">Grammar and Dialogue</option>
                  <option value="Daily Conversation">Daily Conversation</option>
                  <option value="Formal Communication">Formal Communication</option>
                  <option value="Situational Conversation">Situational Conversation</option>
                  <option value="Immersive Mission">Immersive Mission Field Practicum</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Proficiency Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="A1 Beginner">A1 Beginner</option>
                  <option value="A2 Elementary">A2 Elementary</option>
                  <option value="B1 Intermediate">B1 Intermediate</option>
                  <option value="B2 Upper-Intermediate">B2 Upper Intermediate</option>
                  <option value="B1 Immersive Task">B1 Immersive Task</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Cover Image
                </label>
                <select
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="/task_market.jpg">Traditional Market</option>
                  <option value="/task_canteen.jpg">Cultural Canteen</option>
                  <option value="/hero_study.jpg">Independent Study</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Learning Overview and Objectives
              </label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Summary of learning goals and cultural contexts for international students"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isMission"
                checked={formData.isMission}
                onChange={(e) => setFormData({ ...formData, isMission: e.target.checked })}
                className="w-4 h-4 text-amber-600 rounded cursor-pointer"
              />
              <label htmlFor="isMission" className="text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                Mark as Immersive Field Mission and Experiential Task
              </label>
            </div>
          </div>

          {/* Section 2: Audio Module and Grammar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Headphones className="w-4 h-4 text-emerald-600" />
              2 Audio Listening and Grammar Focus
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Listening Audio Track Title
                </label>
                <input
                  type="text"
                  value={formData.audioTitle}
                  onChange={(e) => setFormData({ ...formData, audioTitle: e.target.value })}
                  placeholder="Audio Track 06 Recipe Listening Dialogue"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Audio Duration
                </label>
                <input
                  type="text"
                  value={formData.audioDuration}
                  onChange={(e) => setFormData({ ...formData, audioDuration: e.target.value })}
                  placeholder="15 Minutes"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Grammar Focus and Cultural Usage
              </label>
              <input
                type="text"
                value={formData.grammarFocus}
                onChange={(e) => setFormData({ ...formData, grammarFocus: e.target.value })}
                placeholder="Affixation Mekan and Polite Inquiry Request Structures"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Section 3: Syllabus Topics */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                3 Syllabus Topics and Target Competencies
              </h3>
              <button
                type="button"
                onClick={handleAddTopic}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Topic
              </button>
            </div>

            <div className="space-y-2">
              {formData.topics.map((topic, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => handleTopicChange(idx, e.target.value)}
                    placeholder="Utilizing polite bargaining phrases in traditional markets"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500"
                  />
                  {formData.topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Remove topic"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Key Vocabulary */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                4 Key Vocabulary List
              </h3>
              <button
                type="button"
                onClick={handleAddVocab}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Vocabulary
              </button>
            </div>

            <div className="space-y-2">
              {formData.vocabularies.map((v, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={v.term}
                      onChange={(e) => handleVocabChange(idx, 'term', e.target.value)}
                      placeholder="Term e.g. Kembalian"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500 font-semibold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={v.meaning}
                      onChange={(e) => handleVocabChange(idx, 'meaning', e.target.value)}
                      placeholder="English Definition e.g. Change returned"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    {formData.vocabularies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVocab(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Remove vocabulary"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Google Drive Link and Downloadable Materials */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-purple-600" />
              5 Google Drive Link and Downloadable Materials
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Google Drive Resource Folder URL
              </label>
              <input
                type="url"
                value={formData.driveUrl}
                onChange={(e) => setFormData({ ...formData, driveUrl: e.target.value })}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-700">
                  Student Handout PDF Filename or Attachment
                </label>
                <button
                  type="button"
                  onClick={handleAddDoc}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Attachment
                </button>
              </div>

              {formData.downloadableDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={doc}
                    onChange={(e) => handleDocChange(idx, e.target.value)}
                    placeholder="e.g. Unit6_Recipe_Slides.pdf"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500"
                  />
                  {formData.downloadableDocs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Material Changes' : 'Publish Unit Material'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
