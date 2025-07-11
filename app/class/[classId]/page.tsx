"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import styles from "./ClassPage.module.css";
import { ClassItem, Post, Assignment, Student, Grade } from "../../types/ClassTypes";

const STORAGE_KEY = 'classroom_classes';

export default function ClassPage() {
  const params = useParams();
  const classId = params.id as string;
  const router = useRouter();
  
    
  const storedClasses = localStorage.getItem(STORAGE_KEY);


  let currentClass;
  if(storedClasses) {
    currentClass = JSON.parse(storedClasses);
   console.log(currentClass)
  }

  const { name } = currentClass[0]
  console.log(name)
  
  
  // State for all class data
  const [classData, setClassData] = useState<ClassItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Individual state for different data types (optional, for better UX)
  const [posts, setPosts] = useState<Post[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  // Load comprehensive class data
  useEffect(() => {
    const loadCompleteClassData = async () => {
      try {
        setLoading(true);
        
        // Load main class data
        const classInfo = await loadClassInfo(classId);
        if (!classInfo) {
          setError('Class not found');
          return;
        }
        
        setClassData(classInfo);
        
        // Load all related data
        await Promise.all([
          loadClassPosts(classId),
          loadClassAssignments(classId),
          loadClassStudents(classId),
          loadClassGrades(classId)
        ]);

        console.log('Class Info:', classInfo);
        console.log('Class ID:', classId);
        
        
      } catch (error) {
        console.error('Error loading class data:', error);
        setError('Failed to load class data');
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      loadCompleteClassData();
    }
  }, [classId]);

  // Function to load basic class info
  const loadClassInfo = async (id: string): Promise<ClassItem | null> => {
    try {
      const storedClasses = localStorage.getItem(STORAGE_KEY);
      if (!storedClasses) return null;

      const parsedClasses: ClassItem[] = JSON.parse(storedClasses);
      return parsedClasses.find(course => course.id === id) || null;
    } catch (error) {
      console.error('Error loading class info:', error);
      return null;
    }
  };

  // Function to load class posts
  const loadClassPosts = async (classId: string) => {
    try {
      const postsKey = `class_posts_${classId}`;
      const storedPosts = localStorage.getItem(postsKey);
      if (storedPosts) {
        const parsedPosts: Post[] = JSON.parse(storedPosts);
        setPosts(parsedPosts);
        
        // Update main class data
        setClassData(prev => prev ? { ...prev, posts: parsedPosts } : null);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  // Function to load class assignments
  const loadClassAssignments = async (classId: string) => {
    try {
      const assignmentsKey = `class_assignments_${classId}`;
      const storedAssignments = localStorage.getItem(assignmentsKey);
      if (storedAssignments) {
        const parsedAssignments: Assignment[] = JSON.parse(storedAssignments);
        setAssignments(parsedAssignments);
        
        // Update main class data
        setClassData(prev => prev ? { ...prev, assignments: parsedAssignments } : null);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  // Function to load class students
  const loadClassStudents = async (classId: string) => {
    try {
      const studentsKey = `class_students_${classId}`;
      const storedStudents = localStorage.getItem(studentsKey);
      if (storedStudents) {
        const parsedStudents: Student[] = JSON.parse(storedStudents);
        setStudents(parsedStudents);
        
        // Update main class data
        setClassData(prev => prev ? { 
          ...prev, 
          students: parsedStudents,
          studentCount: parsedStudents.length 
        } : null);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  // Function to load class grades
  const loadClassGrades = async (classId: string) => {
    try {
      const gradesKey = `class_grades_${classId}`;
      const storedGrades = localStorage.getItem(gradesKey);
      if (storedGrades) {
        const parsedGrades: Grade[] = JSON.parse(storedGrades);
        setGrades(parsedGrades);
        
        // Update main class data
        setClassData(prev => prev ? { ...prev, grades: parsedGrades } : null);
      }
    } catch (error) {
      console.error('Error loading grades:', error);
    }
  };

  // Function to save data to localStorage
  const saveClassData = (dataType: string, data: any) => {
    try {
      const storageKey = `class_${dataType}_${classId}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${dataType}:`, error);
    }
  };

  // Function to add a new post
  const addPost = (postData: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...postData,
      id: `post_${Date.now()}`,
      createdAt: new Date()
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    saveClassData('posts', updatedPosts);
    
    // Update main class data
    setClassData(prev => prev ? { ...prev, posts: updatedPosts } : null);
  };

  // Function to add a new assignment
  const addAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assignment_${Date.now()}`,
      createdAt: new Date()
    };

    const updatedAssignments = [...assignments, newAssignment];
    setAssignments(updatedAssignments);
    saveClassData('assignments', updatedAssignments);
    
    // Update main class data
    setClassData(prev => prev ? { ...prev, assignments: updatedAssignments } : null);
  };

  // Function to add a grade
  const addGrade = (gradeData: Omit<Grade, 'id' | 'gradedAt'>) => {
    const newGrade: Grade = {
      ...gradeData,
      id: `grade_${Date.now()}`,
      gradedAt: new Date()
    };

    const updatedGrades = [...grades, newGrade];
    setGrades(updatedGrades);
    saveClassData('grades', updatedGrades);
    
    // Update main class data
    setClassData(prev => prev ? { ...prev, grades: updatedGrades } : null);
  };

  // Function to get student grades for a specific assignment
  const getAssignmentGrades = (assignmentId: string) => {
    return grades.filter(grade => grade.assignmentId === assignmentId);
  };

  // Function to get all grades for a specific student
  const getStudentGrades = (studentId: string) => {
    return grades.filter(grade => grade.studentId === studentId);
  };

  // Function to calculate class average for an assignment
  const getAssignmentAverage = (assignmentId: string) => {
    const assignmentGrades = getAssignmentGrades(assignmentId);
    if (assignmentGrades.length === 0) return 0;
    
    const total = assignmentGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0);
    return total / assignmentGrades.length;
  };




  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.classInfo}>
            <button 
              className={styles.backButton}
              onClick={() => router.push('/dashboard')}
              aria-label="Back to all classes"
            >
              <span className={styles.backArrow}>‹</span>
              <span>All Classes</span>
            </button>
            <h1 className={styles.classTitle}>
              {name}
            </h1>
            <div className={styles.classMeta}>
              <span>Code:</span>
              <span> Students</span>
              <span>{assignments.length} Assignments</span>
              <span>{posts.length} Posts</span>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          {/* Class Statistics */}
          <div className={styles.classStats}>
            <div className={styles.statCard}>
              <h3>Students</h3>
              <p>{students.length}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Assignments</h3>
              <p>{assignments.length}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Posts</h3>
              <p>{posts.length}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Grades</h3>
              <p>{grades.length}</p>
            </div>
          </div>

          {/* Debug Info - You can remove this in production */}
          <div className={styles.debugInfo}>
            <h3>Available Data:</h3>
            <ul>
              <li>Class Name:</li>
              <li>Class Code: </li>
              <li>Posts: {posts.length}</li>
              <li>Assignments: {assignments.length}</li>
              <li>Students: {students.length}</li>
              <li>Grades: {grades.length}</li>
            </ul>
          </div>

          {/* You can now use all this data in your tabs */}
          <div className={styles.tabContent}>
            {/* Your existing tab content, but now with access to all data */}
          </div>
        </div>
      </main>
    </div>
  );
}