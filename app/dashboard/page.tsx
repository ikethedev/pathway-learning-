"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import DashboardHeader from "./header/DashboardHeader";
import EmptyDashboard from "./EmptyDashboard/EmptyDashboard";
import ClassCard from "./ClassCard/ClassCard";
import styles from "./shared/Dashboard.module.css"
import { ClassItem } from "../types/ClassTypes";



const STORAGE_KEY = 'classroom_classes';

export default function Dashboard() {
  const [courses, setCourses] = useState<ClassItem[]>([]);
  const [classActionModal, setClassActionModal] = useState(false);
  const [currentClassName, setCurrentClassName] = useState("");
  const router = useRouter();

  // Load classes from localStorage on component mount
  useEffect(() => {
    const loadClassesFromStorage = () => {
      try {
        const storedClasses = localStorage.getItem(STORAGE_KEY);
        if (storedClasses) {
          const parsedClasses = JSON.parse(storedClasses);
          setCourses(parsedClasses);
        }
      } catch (error) {
        console.error('Error loading classes from localStorage:', error);
      }
    };

    loadClassesFromStorage();
  }, []);

  // Save classes to localStorage whenever courses change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch (error) {
      console.error('Error saving classes to localStorage:', error);
    }
  }, [courses]); // Dependency array ensures this runs whenever courses state changes

  const goToClass = (classId: string) => {
    // Navigate to the class page
    router.push(`/class/${classId}`);
  };

  // Add course via form submission
  const addCourseModal = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentClassName.trim()) {
      addClass(currentClassName.trim());
    }
  };

  const updateCourseName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentClassName(e.target.value);
  };

  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const addClass = (className: string) => {
    if (!className.trim()) return;
    
    const newClass: ClassItem = {
      id: uuidv4(),
      name: className.trim(),
      studentCount: 0,
      classCode: generateClassCode(),
      createdAt: new Date(),
      // Initialize the missing arrays
      students: [],
      assignments: [],
      posts: [],
      grades: []
    };
    
    
    setCourses((prevState) => [...prevState, newClass]);
    setCurrentClassName(""); // Reset input
    setClassActionModal(false); // Close modal
    console.log("Updated courses:", [...courses, newClass]);
  };

  // Function to delete a class (called from ClassCard or elsewhere)
  const deleteClass = (classId: string) => {
    setCourses((prevState) => prevState.filter(course => course.id !== classId));
  };

  // Function to update a class (for editing class name)
  const updateClass = (classId: string, updates: Partial<ClassItem>) => {
    setCourses((prevState) => 
      prevState.map(course => 
        course.id === classId ? { ...course, ...updates } : course
      )
    );
  };

  const toggleClassAction = () => {
    setClassActionModal(!classActionModal);
  };

  return (
    <div>
      <DashboardHeader
        classActionModal={classActionModal}
        addClass={addClass}
        toggleClassAction={toggleClassAction}
        updateCourseName={updateCourseName}
        currentClassName={currentClassName}
        addCourseModal={addCourseModal}
      />
      {courses.length === 0 ? (
        <EmptyDashboard
          addClass={addClass}  
          toggleClassAction={toggleClassAction}
          classActionModal={classActionModal}
          addCourseModal={addCourseModal}
          updateCourseName={updateCourseName}
          currentClassName={currentClassName}
        />
      ) : (
        <div className={styles.container}>
          <h2>Welcome to courses!</h2>
          <div className={styles["courses__grid"]}>
            {courses.map((course) => (
              <ClassCard 
                key={course.id}
                name={course.name} 
                studentCount={course.studentCount || 0} 
                onGoToClass={() => goToClass(course.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}