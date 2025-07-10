import React from "react";
import ClassActionModule from "../ClassActionModule/ClassActionModule";
import styles from "./EmptyDashboard.module.css";
import sharedStyles from "../../global/sharedUi.module.css"

export default function EmptyDashboard({
  classActionModal,
  toggleClassAction,
  addCourseModal,
  updateCourseName,
  addClass,
  currentClassName,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Image placeholder */}
        <div className={styles.imageContainer}>
          <div className={styles.imagePlaceholder}>
            <div className={styles.placeholderIcon}>📚</div>
          </div>
        </div>

        <div className={styles.textContent}>
          <h1 className={styles.title}>Welcome to Your Classroom</h1>
          <p className={styles.subtitle}>
            Create your first class to start generating AI-powered diagnostics
            and insights for your students
          </p>

          <button className={sharedStyles["primary-button"]} onClick={toggleClassAction}>
            <span className={styles.buttonIcon}>+</span>
            Add Your First Class
          </button>
        </div>
      </div>

      {classActionModal && (
        <ClassActionModule
          addClass={addClass}
          updateCourseName={updateCourseName}
          toggleClassAction={toggleClassAction}
        />
      )}
    </div>
  );
}
