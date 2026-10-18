import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, Check, PenTool, UserCheck, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

export default function StudentRepSignPadModal({
  isOpen,
  onClose,
  onSignComplete,
  sessionInfo,
  students,
}) {
  const canvasRef = useRef(null);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'std-1');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

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
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

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
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

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

  const handleSave = async () => {
    if (!hasSignature) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const signatureBase64 = canvas.toDataURL('image/png');

    const timestamp = new Date().toISOString();
    const meetingId = sessionInfo?.id || 'meet-bipa-2026-04';

    const verificationPayload = {
      meeting_id: meetingId,
      signer_type: 'STUDENT_REPRESENTATIVE',
      signer_id: selectedStudent.id,
      signer_name: selectedStudent.name,
      student_id_number: selectedStudent.nim,
      timestamp,
      verification_url: `https://bipa.kemdikbud.go.id/verify/signoff/rep-${meetingId.slice(0, 8)}`,
    };

    // Generate QR code data URL
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(verificationPayload), {
      width: 200,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#f59e0b', '#3b82f6', '#10b981'],
    });

    setIsProcessing(false);
    onSignComplete({
      representativeName: selectedStudent.name,
      studentIdNumber: selectedStudent.nim,
      signatureBase64,
      qrCodeDataUrl,
      verificationPayload,
      signedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-[36px] p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
              Student Representative Dual Sign off
            </h3>
            <div className="text-xs text-slate-500">
              Student representative confirms the conduct of today session
            </div>
          </div>
        </div>

        {/* Student Representative Dropdown */}
        <div className="mt-5 space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Select Class Representative
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold outline-none focus:bg-white focus:border-pink-500 transition-colors cursor-pointer"
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} {student.country} NIM {student.nim}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Student Details Card */}
        <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-slate-800">{selectedStudent.name}</div>
            <div className="text-[11px] text-slate-500">
              Official NIM <span className="font-mono text-slate-700">{selectedStudent.nim}</span> {selectedStudent.country}
            </div>
          </div>
          <span className="text-[11px] font-bold text-pink-700 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            Class Representative
          </span>
        </div>

        {/* Signature Area */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-pink-600" />
              Draw Student Representative Signature
            </label>
            <button
              type="button"
              onClick={clearCanvas}
              className="text-xs font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Canvas
            </button>
          </div>

          <div className="relative border-2 border-dashed border-slate-300 hover:border-pink-400 rounded-3xl bg-slate-50/50 overflow-hidden touch-none transition-colors">
            <canvas
              ref={canvasRef}
              width={520}
              height={170}
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
                Sign here with mouse or touch screen
              </div>
            )}
          </div>
        </div>

        {/* Dual Sign-off Declaration */}
        <div className="mt-4 p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100 text-[11px] text-pink-900 leading-relaxed">
          <strong>Student Representative Attestation</strong> I hereby confirm that today class session was fully conducted according to the syllabus and all peer attendance records have been verified accurately
        </div>

        {/* Modal Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!hasSignature || isProcessing}
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                Complete Dual Sign off and Issue QR
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
