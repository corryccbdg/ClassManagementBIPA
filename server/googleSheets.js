// server/googleSheets.js
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyC-U2K9U1ND8xBg7vTOSl4rwuU0Oqbpz6QhhxPdlzZUMlmtmlWaCLueJbu0gTf_ccv/exec';

/**
 * Fetch all tables from Google Sheets database
 */
export async function getAllFromGoogleSheets() {
  try {
    const res = await fetch(`${GOOGLE_SHEETS_URL}?action=getAll`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.warn('[GoogleSheets] Failed to fetch data:', err.message);
    return null;
  }
}

/**
 * Insert a single record into a specific sheet
 * @param {'assignments'|'users'|'classes'|'sessions'|'attendances'} sheet
 * @param {object} data
 */
export async function insertIntoGoogleSheet(sheet, data) {
  try {
    const res = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'insert',
        sheet,
        data
      })
    });
    return await res.json();
  } catch (err) {
    console.warn(`[GoogleSheets] Failed to insert into ${sheet}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Update an existing record by ID in a specific sheet
 * @param {'assignments'|'users'|'classes'|'sessions'|'attendances'} sheet
 * @param {string|number} id
 * @param {object} data
 */
export async function updateInGoogleSheet(sheet, id, data) {
  try {
    const res = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        sheet,
        id,
        data
      })
    });
    return await res.json();
  } catch (err) {
    console.warn(`[GoogleSheets] Failed to update in ${sheet}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Sync initial seed records to Google Sheets if a sheet is empty
 */
export async function seedInitialGoogleSheets(db) {
  try {
    console.log('[GoogleSheets] Checking and synchronizing with Google Sheets...');
    const remoteData = await getAllFromGoogleSheets();
    if (!remoteData) {
      console.warn('[GoogleSheets] Unable to reach Google Sheets API, skipping sync.');
      return;
    }

    // 1. Seed users if empty
    if (!remoteData.users || remoteData.users.length === 0) {
      console.log('[GoogleSheets] Populating initial users to Google Sheet...');
      for (const u of db.data.users) {
        await insertIntoGoogleSheet('users', {
          id: u.id,
          username: u.username,
          name: u.name,
          email: u.email || `${u.username}@itenas.ac.id`,
          role: u.role,
          country: u.country || 'Indonesia',
          nim: u.nim || u.nip || u.identifier || '',
          avatar: u.avatar || '👤',
          title: u.title || ''
        });
      }
    }

    // 2. Seed assignments if empty
    if (!remoteData.assignments || remoteData.assignments.length === 0) {
      console.log('[GoogleSheets] Populating initial assignments to Google Sheet...');
      for (const asg of db.data.assignments) {
        await insertIntoGoogleSheet('assignments', {
          id: asg.id,
          role: asg.role,
          roleLabel: asg.roleLabel,
          name: asg.name,
          nip: asg.nip,
          email: asg.email,
          skNumber: asg.skNumber,
          department: asg.department,
          status: asg.status,
          assignedAt: asg.assignedAt,
          invitedAt: asg.invitedAt || asg.assignedAt
        });
      }
    }

    // 3. Seed classes if empty
    if (!remoteData.classes || remoteData.classes.length === 0) {
      console.log('[GoogleSheets] Populating initial classes to Google Sheet...');
      for (const cls of db.data.classes) {
        await insertIntoGoogleSheet('classes', {
          id: cls.id,
          name: cls.name,
          level: cls.level || 'B1',
          room: cls.room || 'Ruang 402, Gedung Bahasa',
          teacher: cls.teacherName || 'Dra. Siti Rahmawati, M.Hum.',
          driveLink: 'https://drive.google.com'
        });
      }
    }

    // 4. Seed sessions if empty
    if (!remoteData.sessions || remoteData.sessions.length === 0) {
      console.log('[GoogleSheets] Populating initial sessions to Google Sheet...');
      for (const sess of db.data.darmasiswaSessions || []) {
        await insertIntoGoogleSheet('sessions', {
          id: sess.id,
          class_id: sess.class_id || 'cls-bipa-b1',
          className: sess.className || 'BIPA B1 — Kelas Percakapan & Budaya',
          meeting_number: sess.meeting_number || 1,
          meeting_date: sess.meeting_date || '2026-03-26',
          start_time: sess.start_time || '10:00',
          end_time: sess.end_time || '11:40',
          actual_topic: sess.actual_topic || 'Pertemuan Perkuliahan BIPA',
          room: sess.room || 'Ruang 402, Gedung Bahasa',
          teacherName: sess.teacherName || 'Dra. Siti Rahmawati, M.Hum.',
          meetingStatus: sess.status || 'DRAFT'
        });
      }
    }

    console.log('[GoogleSheets] Synchronization with Google Sheets complete! ✨');
  } catch (err) {
    console.warn('[GoogleSheets] Seed synchronization error:', err.message);
  }
}
