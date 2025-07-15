import React, { useState, useMemo } from "react";
import Image from "next/image";
import messages from "../../../../global/assets/general/message.svg"
import styles from "./People.module.css";

import {
  teachers,
  students,
  Student,
  Teacher,
  sortStudentsByStatus,
  sortStudentsByName,
} from "./MockPeopleData";

type SortOption = "name" | "status";

export default function People() {
  const [sortBy, setSortBy] = useState<SortOption>("status");

  // Get main teacher and co-teacher
  const mainTeacher = teachers.find((teacher) => teacher.role === "teacher");
  const coTeacher = teachers.find((teacher) => teacher.role === "co-teacher");

  // Sort students
  const sortedStudents = useMemo(() => {
    return sortBy === "name"
      ? sortStudentsByName(students)
      : sortStudentsByStatus(students);
  }, [sortBy]);

  const renderTeacher = (teacher: Teacher) => (
    <div className={styles.teacherHeader} key={teacher.id}>
      <div className={styles.teacherAvatar}>{teacher.initials}</div>
      <div>
        <p className={styles.teacherLabel}>
          {teacher.role === "co-teacher" ? "Co-Teacher" : "Teacher"}
        </p>
        <h2 className={styles.teacherName}>{teacher.name}</h2>
      </div>
      <div className={`${styles.teacherStatus} ${styles[teacher.status]}`}>
        {teacher.status === "online"
          ? "Online"
          : teacher.status === "away"
          ? `Away • ${teacher.lastSeen}`
          : `Offline • ${teacher.lastSeen}`}
      </div>
    </div>
  );

  const renderStudent = (student: Student) => (
    <div key={student.id} className={styles.studentItem}>
      <div className={styles.studentInfo}>
        <div className={styles.studentAvatar}>{student.initials}</div>
        <div>
          <p className={styles.studentName}>{student.name}</p>
        </div>
      </div>
      <div className={styles.studentActions}>
        <div className={`${styles.studentStatus} ${styles[student.status]}`} />
        <Image 
            src={messages} 
            alt="Send message" 
            className={styles.messageIcon}
            width={24}  // Required for static imports
            height={24} // Required for static imports
            />
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>People</h1>

      <div className={styles.content}>
        {/* Teacher Section */}
        <div className={styles.teacherSection}>
          {mainTeacher && renderTeacher(mainTeacher)}
          {coTeacher && (
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "2rem",
                borderTop: "1px solid var(--gray-300)",
              }}
            >
              {renderTeacher(coTeacher)}
            </div>
          )}
        </div>

        {/* Students Section */}
        <div className={styles.studentsSection}>
          <div className={styles.studentsHeader}>
            <h3 className={styles.studentsTitle}>Students</h3>
            <span className={styles.studentsCount}>
              {students.length} total
            </span>
          </div>

          {/* Sort Controls */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "var(--button-radius)",
                  border: "1px solid var(--gray-400)",
                  backgroundColor: "var(--gray-100)",
                  fontSize: "0.875rem",
                }}
              >
                <option value="status">Status</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Students List */}
          <div className={styles.studentsList}>
            {sortedStudents.map(renderStudent)}
          </div>
        </div>
      </div>
    </div>
  );
}
