// types/ClassTypes.ts - Define all your data structures
export interface Student {
    id: string;
    name: string;
    email: string;
    enrolledAt: Date;
  }
  
  export interface Grade {
    id: string;
    studentId: string;
    assignmentId: string;
    score: number;
    maxScore: number;
    submittedAt?: Date;
    gradedAt?: Date;
    feedback?: string;
  }
  
  export interface Assignment {
    id: string;
    title: string;
    description: string;
    type: "homework" | "classwork" | "test" | "quiz" | "project";
    dueDate: Date;
    maxScore: number;
    createdAt: Date;
    isPublished: boolean;
    instructions?: string;
    attachments?: string[];
  }
  
  export interface Post {
    id: string;
    content: string;
    type: "announcement" | "diagnostic" | "material";
    createdAt: Date;
    topic?: string;
    avatarUrl: string;
    standard?: string;
    isGenerating?: boolean;
    previewFile?: string;
    assessmentId?: string;
    attachments?: string[];
  }
  
  export interface ClassItem {
    id: string;
    name: string;
    classCode: string;
    description?: string;
    subject?: string;
    grade?: string;
    room?: string;
    studentCount: number;
    createdAt: Date;
    // Related data
    students: Student[];
    assignments: Assignment[];
    posts: Post[];
    grades: Grade[];
  }