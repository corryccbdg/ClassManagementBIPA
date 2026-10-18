// src/data/coursesData.js
export const initialCourses = [
  {
    id: 'unit-4',
    unitNumber: 4,
    unitTitle: 'Unit 4 Pages 42 to 55',
    bookTitle: 'BIPA B1 Conversation Textbook',
    title: 'Bargaining at the Traditional Market and Shopping Etiquette',
    category: 'Conversation and Culture',
    image: '/task_market.jpg',
    description: 'Master polite bargaining etiquette, traditional counting units bunch, kilo, pieces, and polite inquiry expressions.',
    audioTitle: 'Audio Track 04 Market Dialog Listening',
    audioDuration: '15 Minutes',
    progress: 85,
    level: 'B1 Intermediate',
    isCompleted: false,
    topics: [
      'Polite bargaining expressions: Bolehkah kurang sedikit',
      'Traditional counting units: bunch ikat, comb sisir, kilo',
      'Market etiquette: avoiding low bargaining on early morning sales penglaris',
      'Simulated cash transactions and QRIS digital payment at traditional stalls'
    ],
    vocabularies: [
      { term: 'Menawar', meaning: 'To bargain and negotiate price' },
      { term: 'Pas', meaning: 'Exact fixed price' },
      { term: 'Kembalian', meaning: 'Change money returned' },
      { term: 'Penglaris', meaning: 'First morning sale for good luck' },
      { term: 'Ikat and Sisir', meaning: 'Counting unit for greens or bananas' }
    ],
    grammarFocus: 'Polite Request Formulations Bolehkah, Bisakah, Tolong',
    downloadableDocs: ['Unit4_Market_Slides.pdf', 'Bargaining_Practice_Worksheet.docx'],
    driveUrl: 'https://drive.google.com'
  },
  {
    id: 'unit-misi-1',
    unitNumber: 4.5,
    unitTitle: 'Active Field Mission',
    bookTitle: 'BIPA B1 Fieldwork Practicum',
    title: 'Campus Canteen Ordering and Local Student Interview Practicum',
    category: 'Immersive Mission',
    image: '/task_canteen.jpg',
    description: 'Order food independently without English at the Campus Canteen, inquire about traditional Sundanese ingredients, and take 1 selfie photo as proof',
    audioTitle: 'Canteen Interview Audio Guide',
    audioDuration: '8 Minutes',
    progress: 75,
    level: 'B1 Immersive Task',
    isCompleted: false,
    topics: [
      'Order Indonesian cuisine directly with canteen food vendors',
      'Inquire about flavor profiles: savory gurih, spicy sweet, tangy',
      'Interview 1 local university student about their favorite Indonesian dish',
      'Upload selfie verification and reflective vocabulary notes'
    ],
    vocabularies: [
      { term: 'Pedas sedang', meaning: 'Medium spicy' },
      { term: 'Bungkus or Makan di sini', meaning: 'Takeaway or Dine in' },
      { term: 'Rekomendasi', meaning: 'Recommendation' }
    ],
    grammarFocus: 'Open Inquiry Questions Apa isi menu ini, Bagaimana rasanya',
    downloadableDocs: ['B1_Canteen_Mission_Guide.pdf'],
    driveUrl: 'https://drive.google.com',
    isMission: true
  },
  {
    id: 'unit-3',
    unitNumber: 3,
    unitTitle: 'Unit 3 Pages 28 to 41',
    bookTitle: 'BIPA B1 Conversation Textbook',
    title: 'Public Transportation and Asking for Directions in Bandung',
    category: 'Daily Conversation',
    image: '/task_market.jpg',
    description: 'Understand angkot transit routes, book ride hailing motorbike taxis, and navigate using local landmarks',
    audioTitle: 'Audio Track 03 Public Transit Angkot Dialogue',
    audioDuration: '12 Minutes',
    progress: 100,
    level: 'B1 Intermediate',
    isCompleted: true,
    topics: [
      'Direction vocabulary: turn left, right, go straight, three way junction, crossroads',
      'Taking angkot: Kiri Bang, Ongkos berapa',
      'Online ride hailing mobile apps in Indonesia'
    ],
    vocabularies: [
      { term: 'Pertigaan', meaning: 'Three way junction' },
      { term: 'Perempatan', meaning: 'Crossroads intersection' },
      { term: 'Ongkos', meaning: 'Fare or transport fee' }
    ],
    grammarFocus: 'Locative Prepositions di depan, di seberang, dekat, samping',
    downloadableDocs: ['Unit3_Transportation_Slides.pdf'],
    driveUrl: 'https://drive.google.com'
  },
  {
    id: 'unit-2',
    unitNumber: 2,
    unitTitle: 'Unit 2 Pages 15 to 27',
    bookTitle: 'BIPA B1 Conversation Textbook',
    title: 'Describing Daily Activities and Routine Schedules',
    category: 'Grammar and Dialogue',
    image: '/hero_study.jpg',
    description: 'Apply temporal adverbials, chronological conjunctions, and active voice sentence structures',
    audioTitle: 'Audio Track 02 Daily Routine Interview',
    audioDuration: '14 Minutes',
    progress: 100,
    level: 'B1 Intermediate',
    isCompleted: true,
    topics: [
      'Drafting weekly activity agendas',
      'Chronological conjunctions: setelah, lalu, kemudian',
      'Frequency adverbs: sering, jarang, selalu, kadang kadang'
    ],
    vocabularies: [
      { term: 'Bangun pagi', meaning: 'Wake up early' },
      { term: 'Menjelang sore', meaning: 'Late afternoon' },
      { term: 'Kadang kadang', meaning: 'Sometimes' }
    ],
    grammarFocus: 'Verbal Affix Me: Memasak, membaca, mencatat, mengulang',
    downloadableDocs: ['Unit2_Routines_Slides.pdf'],
    driveUrl: 'https://drive.google.com'
  },
  {
    id: 'unit-1',
    unitNumber: 1,
    unitTitle: 'Unit 1 Pages 1 to 14',
    bookTitle: 'BIPA B1 Conversation Textbook',
    title: 'Formal Introductions, Academic Background and Study Goals',
    category: 'Formal Communication',
    image: '/hero_study.jpg',
    description: 'Deliver formal self introductions, articulate professional background, and explain goals for studying Indonesian',
    audioTitle: 'Audio Track 01 Brief Introduction Speech',
    audioDuration: '10 Minutes',
    progress: 100,
    level: 'B1 Intermediate',
    isCompleted: true,
    topics: [
      'Formal greetings: Selamat pagi bapak ibu, hadirin yang terhormat',
      'Explaining country of origin and local culture',
      'Academic expectations and motivation for learning BIPA'
    ],
    vocabularies: [
      { term: 'Berasal dari', meaning: 'Originate from' },
      { term: 'Bercita cita', meaning: 'Aspire or dream to be' },
      { term: 'Menempuh studi', meaning: 'Pursuing study' }
    ],
    grammarFocus: 'Coordinate Compound Sentences with karena, sehingga, tetapi',
    downloadableDocs: ['Unit1_Introductions_Slides.pdf'],
    driveUrl: 'https://drive.google.com'
  },
  {
    id: 'unit-5',
    unitNumber: 5,
    unitTitle: 'Unit 5 Pages 56 to 70',
    bookTitle: 'BIPA B1 Conversation Textbook',
    title: 'Healthcare, Consulting a Doctor and Communicating Symptoms',
    category: 'Situational Conversation',
    image: '/task_market.jpg',
    description: 'Learn clinic consultations, express medical symptoms, fever, headaches, and prescription guidelines',
    audioTitle: 'Audio Track 05 Doctor and Pharmacy Consultation',
    audioDuration: '18 Minutes',
    progress: 10,
    level: 'B1 Intermediate Upcoming',
    isCompleted: false,
    topics: [
      'Stating health symptoms: headache, nausea, cough, flu',
      'Medication instructions: 3 times daily after meals',
      'Pharmacy dialogue with pharmacists'
    ],
    vocabularies: [
      { term: 'Gejala', meaning: 'Symptoms' },
      { term: 'Resep dokter', meaning: 'Doctor prescription' },
      { term: 'Puskesmas', meaning: 'Community health clinic' }
    ],
    grammarFocus: 'Expressing Pain Saya merasa, Badan saya terasa panas',
    downloadableDocs: ['Unit5_Healthcare_Preview_Slides.pdf'],
    driveUrl: 'https://drive.google.com'
  }
];
