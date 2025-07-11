import React from "react";
import styles from "./ClassCard.module.css";

interface ClassCardProps {
    name: string;
    studentCount: number;
    // this is being passed from the dashboard page
    onGoToClass?: () => void; // Add this line
  }
  
export default function ClassCard({ name, studentCount, onGoToClass }: ClassCardProps) {

  return (
    <div className={styles.card} onClick={onGoToClass}>
      {/* Header section with background image */}
      <div className={styles.cardHeader}>
        <div className={styles.iconRow}>
          <h3 className={styles.className}>{name}</h3>
        </div>
      </div>
      
      {/* Body section with student count */}
      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <p className={styles.studentCount}>{studentCount} Students</p>
        </div>
      </div>
    </div>
  );
}