import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, Check, PenTool, ShieldCheck, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

async function generateSha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function TeacherSignPadModal({
  isOpen,
  onClose,
  onSignComplete,
  sessionInfo,
  attendances,
  students,
  teacherName = 'Dra. Siti Rahmawati, M.Hum.',
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [pedagogicalNotes, setPedagogicalNotes] = useState(
    'Students actively engaged in traditional market bargaining simulations. All learners accurately pronounced prices and Indonesian rupiah currency units with appropriate intonation.'
  );
  const [isProcessing, setIsProcessing] = useState(false);

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

    // Generate cryptographic hash of finalized attendance
    const attendanceSummaryString = JSON.stringify(attendances);
    const attendanceHash = await generateSha256(attendanceSummaryString);
    const timestamp = new Date().toISOString();
    const meetingId = sessionInfo?.id || 'meet-bipa-2026-04';
    const signerId = 'usr-teacher-01';

    const verificationPayload = {
      meeting_id: meetingId,
      signer_type: 'TEACHER',
      signer_id: signerId,
      signer_name: teacherName,
      timestamp,
      attendance_hash: attendanceHash,
      verification_url: `https://bipa.kemdikbud.go.id/verify/signoff/tch-${meetingId.slice(0, 8)}`,
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
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#7c3aed', '#10b981'],
    });

    setIsProcessing(false);
    onSignComplete({
      signatureBase64,
      qrCodeDataUrl,
      verificationPayload,
      pedagogicalNotes,
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
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
              Course Lecturer Digital Signature
            </h3>
            <div className="text-xs text-slate-500">
              Student Attendance Validation and Official Course Report BAP
            </div>
          </div>
        </div>

        {/* Pedagogical Notes Textarea */}
        <div className="mt-5 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Pedagogical Notes and Teaching Evaluation
          </label>
          <textarea
            rows={3}
            value={pedagogicalNotes}
            onChange={(e) => setPedagogicalNotes(e.target.value)}
            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition-colors"
            placeholder="Document student comprehension evaluation language hurdles or cultural observations"
          />
        </div>

        {/* Signature Area */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-indigo-600" />
              Draw Lecturer Digital Signature
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

          <div className="relative border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-3xl bg-slate-50/50 overflow-hidden touch-none transition-colors">
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

        {/* Security and Cryptographic Notice */}
        <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
          <strong>Automated Cryptographic Verification</strong> The system computes an automated SHA256 hash of the final attendance roster and generates a Verified QR Code embedded into the official academic report
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
            className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save and Issue Lecturer QR Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
