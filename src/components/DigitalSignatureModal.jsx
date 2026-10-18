import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, Check, PenTool, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DigitalSignatureModal({ isOpen, onClose, onSignSuccess, studentName = 'Sarah Jenkins' }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasSignature(false);
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#0f172a';
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = () => {
    if (!hasSignature) return;
    
    // Trigger celebratory confetti
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'],
    });

    if (onSignSuccess) {
      onSignSuccess({
        signedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        studentName,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
              Attendance Confirmation and Digital Signature
            </h3>
            <div className="text-xs text-slate-500">
              Session 4 BIPA B1 Conversation Class
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Student Name</span>
            <span className="font-semibold text-slate-800">{studentName} ID BIPA 2026 081</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Course Lecturer</span>
            <span className="font-medium text-slate-800">Dra. Siti Rahmawati, M.Hum.</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Covered Topic</span>
            <span className="font-medium text-slate-800">Unit 4 Culinary and Traditional Market Bargaining</span>
          </div>
        </div>

        {/* Signature Area */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Draw Your Signature in the Box Below
            </label>
            <button
              type="button"
              onClick={clearCanvas}
              className="text-xs font-medium text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Canvas
            </button>
          </div>

          <div className="relative border-2 border-dashed border-slate-200 hover:border-violet-300 rounded-2xl bg-slate-50/50 overflow-hidden touch-none transition-colors">
            <canvas
              ref={canvasRef}
              width={440}
              height={160}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-40 cursor-crosshair bg-white"
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-xs italic">
                Click and drag to write your digital signature
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!hasSignature}
            onClick={handleSubmit}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            Confirm and Sign
          </button>
        </div>
      </div>
    </div>
  );
}
