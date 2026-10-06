// src/services/api.js
import {
  initialClasses,
  initialStudents,
  initialSchedule,
  initialSyllabus,
  initialRealizations,
  initialMeetingRecords
} from '../../server/seedData.js';

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}, using client fallback if available:`, error.message);
    throw error;
  }
}

export const api = {
  // Classes
  async getClasses() {
    try {
      return await request('/classes');
    } catch {
      return initialClasses;
    }
  },

  async createClass(data) {
    return await request('/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Students
  async getStudents(classId) {
    try {
      return await request(`/students?classId=${classId || ''}`);
    } catch {
      return classId ? initialStudents.filter(s => s.classId === classId) : initialStudents;
    }
  },

  // Schedules
  async getSchedule(classId) {
    try {
      return await request(`/schedule?classId=${classId || ''}`);
    } catch {
      return classId ? initialSchedule.filter(s => s.classId === classId) : initialSchedule;
    }
  },

  async createSchedule(data) {
    return await request('/schedule', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSchedule(id, data) {
    return await request(`/schedule/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteSchedule(id) {
    return await request(`/schedule/${id}`, {
      method: 'DELETE',
    });
  },

  // Syllabus
  async getSyllabus(classId) {
    try {
      return await request(`/syllabus?classId=${classId || ''}`);
    } catch {
      return classId ? initialSyllabus.filter(s => s.classId === classId) : initialSyllabus;
    }
  },

  async createSyllabus(data) {
    return await request('/syllabus', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSyllabus(id, data) {
    return await request(`/syllabus/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteSyllabus(id) {
    return await request(`/syllabus/${id}`, {
      method: 'DELETE',
    });
  },

  // Realizations
  async getRealizations(classId) {
    try {
      return await request(`/realizations?classId=${classId || ''}`);
    } catch {
      return classId ? initialRealizations.filter(r => r.classId === classId) : initialRealizations;
    }
  },

  async saveRealization(data) {
    return await request('/realizations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Meeting Records & Signatures
  async getMeetings(classId) {
    try {
      return await request(`/meetings?classId=${classId || ''}`);
    } catch {
      return classId ? initialMeetingRecords.filter(m => m.classId === classId) : initialMeetingRecords;
    }
  },

  async signMeeting(meetingId, role, payload) {
    return await request(`/meetings/${meetingId}/sign`, {
      method: 'POST',
      body: JSON.stringify({ role, payload }),
    });
  },

  async updateAttendance(meetingId, attendance) {
    return await request(`/meetings/${meetingId}/attendance`, {
      method: 'PUT',
      body: JSON.stringify({ attendance }),
    });
  },

  async resetData() {
    return await request('/reset', { method: 'POST' });
  }
};
