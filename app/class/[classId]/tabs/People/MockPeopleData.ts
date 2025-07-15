 // peopleData.ts

export type PersonStatus = 'online' | 'away' | 'offline';

export interface Person {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: PersonStatus;
  lastSeen?: string;
  initials: string;
}

export interface Teacher extends Person {
  role: 'teacher' | 'co-teacher';
  subject?: string;
  experience?: number;
}

export interface Student extends Person {
  grade?: string;
  enrollmentDate: string;
  hasUnreadMessages: boolean;
}

// Teachers data
export const teachers: Teacher[] = [
  {
    id: 'teacher-001',
    name: 'John Doe',
    email: 'john.doe@school.edu',
    role: 'teacher',
    subject: 'Mathematics',
    experience: 8,
    status: 'online',
    initials: 'JD'
  },
  {
    id: 'teacher-002',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@school.edu',
    role: 'co-teacher',
    subject: 'Mathematics',
    experience: 5,
    status: 'away',
    lastSeen: '2 hours ago',
    initials: 'SM'
  }
];

// Students data
export const students: Student[] = [
  {
    id: 'student-001',
    name: 'Emma Johnson',
    email: 'emma.johnson@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'online',
    hasUnreadMessages: true,
    initials: 'EJ'
  },
  {
    id: 'student-002',
    name: 'Michael Chen',
    email: 'michael.chen@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'online',
    hasUnreadMessages: false,
    initials: 'MC'
  },
  {
    id: 'student-003',
    name: 'Sophia Rodriguez',
    email: 'sophia.rodriguez@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'away',
    lastSeen: '15 minutes ago',
    hasUnreadMessages: true,
    initials: 'SR'
  },
  {
    id: 'student-004',
    name: 'James Wilson',
    email: 'james.wilson@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'online',
    hasUnreadMessages: false,
    initials: 'JW'
  },
  {
    id: 'student-005',
    name: 'Olivia Brown',
    email: 'olivia.brown@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'offline',
    lastSeen: '1 hour ago',
    hasUnreadMessages: true,
    initials: 'OB'
  },
  {
    id: 'student-006',
    name: 'Alexander Kim',
    email: 'alexander.kim@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'online',
    hasUnreadMessages: false,
    initials: 'AK'
  },
  {
    id: 'student-007',
    name: 'Isabella Davis',
    email: 'isabella.davis@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'away',
    lastSeen: '30 minutes ago',
    hasUnreadMessages: true,
    initials: 'ID'
  },
  {
    id: 'student-008',
    name: 'Ethan Thompson',
    email: 'ethan.thompson@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'online',
    hasUnreadMessages: false,
    initials: 'ET'
  },
  {
    id: 'student-009',
    name: 'Ava Garcia',
    email: 'ava.garcia@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'offline',
    lastSeen: '3 hours ago',
    hasUnreadMessages: false,
    initials: 'AG'
  },
  {
    id: 'student-010',
    name: 'Noah Martinez',
    email: 'noah.martinez@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'online',
    hasUnreadMessages: true,
    initials: 'NM'
  },
  {
    id: 'student-011',
    name: 'Mia Anderson',
    email: 'mia.anderson@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'away',
    lastSeen: '45 minutes ago',
    hasUnreadMessages: false,
    initials: 'MA'
  },
  {
    id: 'student-012',
    name: 'Lucas Taylor',
    email: 'lucas.taylor@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'online',
    hasUnreadMessages: true,
    initials: 'LT'
  },
  {
    id: 'student-013',
    name: 'Charlotte White',
    email: 'charlotte.white@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'offline',
    lastSeen: '2 hours ago',
    hasUnreadMessages: false,
    initials: 'CW'
  },
  {
    id: 'student-014',
    name: 'Benjamin Harris',
    email: 'benjamin.harris@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'online',
    hasUnreadMessages: true,
    initials: 'BH'
  },
  {
    id: 'student-015',
    name: 'Amelia Clark',
    email: 'amelia.clark@student.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-08-15',
    status: 'away',
    lastSeen: '20 minutes ago',
    hasUnreadMessages: false,
    initials: 'AC'
  }
];

// Utility functions
export const getOnlineCount = (people: Person[]) => {
  return people.filter(person => person.status === 'online').length;
};

export const getAwayCount = (people: Person[]) => {
  return people.filter(person => person.status === 'away').length;
};

export const getOfflineCount = (people: Person[]) => {
  return people.filter(person => person.status === 'offline').length;
};

export const getStudentsWithUnreadMessages = (students: Student[]) => {
  return students.filter(student => student.hasUnreadMessages);
};

export const sortStudentsByName = (students: Student[]) => {
  return [...students].sort((a, b) => a.name.localeCompare(b.name));
};

export const sortStudentsByStatus = (students: Student[]) => {
  const statusOrder = { online: 1, away: 2, offline: 3 };
  return [...students].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
};