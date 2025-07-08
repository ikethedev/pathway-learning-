"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Add this import
import { v4 as uuidv4 } from "uuid";
import DashboardHeader from "./header/DashboardHeader";
import EmptyDashboard from "./EmptyDashboard/EmptyDashboard";
import ClassCard from "./ClassCard/ClassCard";
import styles from "./shared/Dashboard.module.css"

type ClassItem = {
    id: string;
    name: string;
}

export default function Dashboard() {
  const [courses, setCourses] = useState<ClassItem[]>([]);
  const [classActionModal, setClassActionModal] = useState(false);
  const [currentClassName, setCurrentClassName] = useState("");
  const router = useRouter(); // Add this line

  const goToClass = (classId: string) => {
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

  
  const addClass = (className: string) => {
    if (!className.trim()) return;
    
    const newClass: ClassItem = {
      id: uuidv4(),
      name: className.trim()
    };
    
    setCourses((prevState) => [...prevState, newClass]);
    setCurrentClassName(""); // Reset input
    setClassActionModal(false); // Close modal
    console.log("Updated courses:", [...courses, newClass]);
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
                key={course.id} // Add missing key prop
                name={course.name} 
                studentCount={0} 
                onGoToClass={() => goToClass(course.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}