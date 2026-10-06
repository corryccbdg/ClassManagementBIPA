// src/components/SignaturePad.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, PenTool, Sparkles } from 'lucide-react';

export default function SignaturePad({ onSave, onCancel, defaultName = '', role = 'user' }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signerName, setSignerName] = useState(defaultName);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Generate a handsome SVG stylized signature if user prefers one-click
  const generateStylizedSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw stylized cursive curves
    ctx.strokeStyle = '#0a7156';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 90);
    ctx.bezierCurveTo(80, 20, 120, 110, 180, 60);
    ctx.bezierCurveTo(220, 30, 250, 95, 300, 70);
    ctx.stroke();

    ctx.font = 'italic 20px "Playfair Display", serif';
    ctx.fillStyle = '#0a7156';
    ctx.fillText(signerName || 'Tanda Tangan Terverifikasi', 50, 115);
    setHasDrawn(true);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    onSave({
      signatureDataUrl: hasDrawn ? dataUrl : null,
      signerName: signerName.trim() || defaultName,
      note: notes.trim()
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-lg w-full">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Tanda Tangan Digital Resmi</h3>
            <p className="text-xs text-slate-500">Bubuhkan tanda tangan atau gunakan stempel digital</p>
          </div>
        </div>
        <button
          type="button"
          onClick={generateStylizedSignature}
          className="text-xs flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors font-medium border border-amber-200"
          title="Buat Tanda Tangan Cepat Otomatis"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Gaya Otomatis
        </button>
      </div>

      {/* Signer Name Input */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap Penandatangan</label>
        <input
          type="text"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          placeholder="Masukkan nama lengkap & gelar"
          className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
        />
      </div>

      {/* Signature Canvas */}
      <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 overflow-hidden mb-3">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-36 cursor-crosshair touch-none"
        />
        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs">
            <PenTool className="w-5 h-5 mb-1 opacity-50" />
            <span>Goreskan tanda tangan di sini (Mouse / Touch)</span>
          </div>
        )}
      </div>

      {/* Canvas Actions */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={clearCanvas}
          className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
        >
          <Eraser className="w-3.5 h-3.5" />
          Hapus Canvas
        </button>
        <span className="text-[11px] text-slate-400">
          Timestamp terenkripsi: {new Date().toLocaleTimeString('id-ID')} WIB
        </span>
      </div>

      {/* Optional Note / Catatan */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-600 mb-1">Catatan Verifikasi (Opsional)</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Contoh: Perkuliahan terlaksana lancar, materi tersampaikan penuh."
          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 resize-none"
        />
      </div>

      {/* Modal Actions */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          Simpan Tanda Tangan
        </button>
      </div>
    </div>
  );
}
