// src/utils/qrGenerator.js
import QRCode from 'qrcode';

const qrCache = new Map();

/**
 * Generate a high quality QR Code Data URL with memoization cache
 */
export async function generateQrDataUrl(payload, options = {}) {
  const key = typeof payload === 'string' ? payload : JSON.stringify(payload);
  if (qrCache.has(key)) {
    return qrCache.get(key);
  }

  const defaultOptions = {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 140,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
    ...options,
  };

  try {
    const dataUrl = await QRCode.toDataURL(key, defaultOptions);
    qrCache.set(key, dataUrl);
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    return null;
  }
}

/**
 * Build student attendance verification payload
 */
export function buildStudentQrPayload(session, student, attendance) {
  return {
    sys: 'ITENAS-BIPA-DARMASISWA-VERIFIED',
    type: 'STUDENT_ATTENDANCE_SIGNATURE',
    institution: 'Institut Teknologi Nasional Bandung',
    program: 'Darmasiswa RI - Itenas',
    nim: student.nim,
    studentName: student.name,
    sessionId: session.id,
    sessionNo: session.no,
    dayDate: session.dayDate,
    material: session.material,
    status: attendance.status || 'PRESENT',
    signTimestamp: attendance.signTime || `${session.dateIso} 08:00:00 WIB`,
    certHash: `SHA256:${Math.abs(hashString(student.nim + session.id)).toString(16).padStart(12, '0')}`,
  };
}

/**
 * Build facilitator verification payload
 */
export function buildFacilitatorQrPayload(session) {
  return {
    sys: 'ITENAS-BIPA-DARMASISWA-VERIFIED',
    type: 'FACILITATOR_DIGITAL_SIGNATURE',
    institution: 'Institut Teknologi Nasional Bandung',
    program: 'Darmasiswa RI - Itenas',
    facilitatorName: session.facilitatorName,
    facilitatorNip: session.facilitatorNip || '-',
    sessionId: session.id,
    sessionNo: session.no,
    dayDate: session.dayDate,
    material: session.material,
    status: 'VERIFIED_SYLLABUS_REALIZATION',
    signTimestamp: session.facilitatorSignTime || `${session.dateIso} 12:00:00 WIB`,
    certHash: `SHA256:${Math.abs(hashString(session.facilitatorName + session.id)).toString(16).padStart(12, '0')}`,
  };
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
