"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import DashboardHeader from "./header/DashboardHeader";
import EmptyDashboard from "./EmptyDashboard/EmptyDashboard";
import ClassCard from "./ClassCard/ClassCard";
import styles from "./shared/Dashboard.module.css";
import { getSupabaseClient } from "../lib/auth/supabaseClient";
import Sidebar from "../components /sidebar/Sidebar";

type ClassItem = {
  id: string;
  name: string;
  studentCount?: number;
  createdAt?: Date;
};

export default function Dashboard() {
  const [showMenu, setShowMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [courses, setCourses] = useState<ClassItem[]>([]);
  const [classActionModal, setClassActionModal] = useState(false);
  const [currentClassName, setCurrentClassName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();

    const fetchUserProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Save classes to localStorage whenever courses change
  useEffect(() => {
    try {
      localStorage.setItem("classroom_classes", JSON.stringify(courses));
    } catch (error) {
      console.error("Error saving classes to localStorage:", error);
    }
  }, [courses]);

  const goToClass = (classId: string) => {
    router.push(`/class/${classId}`);
  };

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
      name: className.trim(),
      studentCount: 0,
      createdAt: new Date(),
    };

    setCourses((prevState) => [...prevState, newClass]);
    setCurrentClassName("");
    setClassActionModal(false);
  };

  const toggleClassAction = () => {
    setClassActionModal(!classActionModal);
  };

  const toggleSideMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div>
      <div>
        <DashboardHeader
          classActionModal={classActionModal}
          addClass={addClass}
          toggleClassAction={toggleClassAction}
          updateCourseName={updateCourseName}
          currentClassName={currentClassName}
          addCourseModal={addCourseModal}
          toggleSideMenu={toggleSideMenu}
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
    </div>
  );
}
