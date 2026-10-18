// src/data/darmasiswaRecapData.js
// Attendance recap data for Darmasiswa RI – Itenas Bandung

export const itenasInstitutionInfo = {
  foundation: 'YAYASAN PENDIDIKAN DAYANG SUMBI',
  institution: 'INSTITUT TEKNOLOGI NASIONAL',
  bureau: 'BIRO KERJA SAMA, HUBUNGAN MASYARAKAT DAN PEMASARAN',
  address: 'Jalan PH.H. Mustofa No. 23 Bandung 40124 Indonesia, Telepon: +62-22-7272215 ext 273, Fax: +62-22-7202892',
  webEmail: 'Website: http://www.itenas.ac.id , e-mail: humas@itenas.ac.id',
  programTitle: 'Presensi Mahasiswa Darmasiswa RI – Itenas Bandung',
  defaultPeriod: 'Maret 2025',
};

export const darmasiswaStudentsList = [
  {
    nim: '312024043',
    name: 'Phouphakham Bounlom',
    country: 'Laos',
    flag: '🇱🇦',
    gender: 'Male',
  },
  {
    nim: '312024144',
    name: 'Tam Chanthasone',
    country: 'Laos',
    flag: '🇱🇦',
    gender: 'Female',
  },
];

export const initialDarmasiswaSessions = [
  {
    id: 'sesi-1',
    no: 1,
    dayDate: 'Monday / 03 March 2025',
    dateIso: '2025-03-03',
    material: 'Listening & speaking practice on terminology used when visiting medical clinics',
    facilitatorName: 'Dianita, S.S., M.Hum.',
    facilitatorNip: '198704122015052001',
    facilitatorSigned: true,
    facilitatorSignTime: '2025-03-03 11:45:00',
    attendances: {
      '312024043': {
        attended: false,
        status: 'ABSENT',
        note: 'Excused for immigration visa extension',
        signTime: null,
      },
      '312024144': {
        attended: true,
        status: 'PRESENT',
        note: 'Present on time for language class',
        signTime: '2025-03-03 08:05:22',
      },
    },
  },
  {
    id: 'sesi-2',
    no: 2,
    dayDate: 'Tuesday / 04 March 2025',
    dateIso: '2025-03-04',
    material: 'Traditional Sundanese Dance: Manuk Dadali',
    facilitatorName: 'Iis Tjuhartika Pandi, S.Psi.',
    facilitatorNip: '198908232018012002',
    facilitatorSigned: true,
    facilitatorSignTime: '2025-03-04 11:50:00',
    attendances: {
      '312024043': {
        attended: false,
        status: 'ABSENT',
        note: 'Feeling unwell / mild flu',
        signTime: null,
      },
      '312024144': {
        attended: true,
        status: 'PRESENT',
        note: 'Present for dance movement practice',
        signTime: '2025-03-04 08:12:10',
      },
    },
  },
  {
    id: 'sesi-3',
    no: 3,
    dayDate: 'Tuesday / 04 March 2025',
    dateIso: '2025-03-04',
    material: 'Field Interviews with Local Itenas Students regarding Regional Cultural Traditions',
    facilitatorName: 'Iis Tjuhartika Pandi, S.Psi.',
    facilitatorNip: '198908232018012002',
    facilitatorSigned: true,
    facilitatorSignTime: '2025-03-04 14:30:00',
    attendances: {
      '312024043': {
        attended: true,
        status: 'PRESENT',
        note: 'Present for campus field interview',
        signTime: '2025-03-04 13:04:18',
      },
      '312024144': {
        attended: true,
        status: 'PRESENT',
        note: 'Present for campus field interview',
        signTime: '2025-03-04 13:02:44',
      },
    },
  },
  {
    id: 'sesi-4',
    no: 4,
    dayDate: 'Wednesday / 05 March 2025',
    dateIso: '2025-03-05',
    material: 'Reading and writing practice on medical terms and health expressions',
    facilitatorName: 'Dianita, S.S., M.Hum.',
    facilitatorNip: '198704122015052001',
    facilitatorSigned: true,
    facilitatorSignTime: '2025-03-05 11:35:00',
    attendances: {
      '312024043': {
        attended: true,
        status: 'PRESENT',
        note: 'Present for vocabulary drill session',
        signTime: '2025-03-05 08:10:05',
      },
      '312024144': {
        attended: true,
        status: 'PRESENT',
        note: 'Present for vocabulary drill session',
        signTime: '2025-03-05 08:08:33',
      },
    },
  },
  {
    id: 'sesi-5',
    no: 5,
    dayDate: 'Friday / 07 March 2025',
    dateIso: '2025-03-07',
    material: 'Unit 4. Procedural Descriptions. Listening and Speaking Skills',
    facilitatorName: 'Siti Sopiah, S.S., M.Pd.',
    facilitatorNip: '198502142012042003',
    facilitatorSigned: true,
    facilitatorSignTime: '2025-03-07 11:15:00',
    attendances: {
      '312024043': {
        attended: false,
        status: 'ABSENT',
        note: 'Excused for student fellowship activities',
        signTime: null,
      },
      '312024144': {
        attended: true,
        status: 'PRESENT',
        note: 'Present for listening & speaking session',
        signTime: '2025-03-07 08:15:40',
      },
    },
  },
  {
    id: 'sesi-6',
    no: 6,
    dayDate: 'Friday / 07 March 2025',
    dateIso: '2025-03-07',
    material: 'Unit 4. Narrative Text Reading and Composition Skills',
    facilitatorName: 'Siti Sopiah, S.S., M.Pd.',
    facilitatorNip: '198502142012042003',
    facilitatorSigned: true,
    facilitatorSignTime: '2025-03-07 14:00:00',
    attendances: {
      '312024043': {
        attended: false,
        status: 'ABSENT',
        note: 'Excused for student fellowship activities',
        signTime: null,
      },
      '312024144': {
        attended: true,
        status: 'PRESENT',
        note: 'Present for narrative text reading',
        signTime: '2025-03-07 13:05:11',
      },
    },
  },
];
