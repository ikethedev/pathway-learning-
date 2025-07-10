import React, { useState, useEffect } from "react";
import formCommonStyles from "../shared/FormStyles.module.css";
import shareUi from "../../global/sharedUi.module.css";
import styles from "./step3Styles.module.css";

export default function SignUpStep3({
  onNext,
  onBack,
  formData,
  updateFormData,
}) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    formData?.goals || []
  );

  const goalOptions = [
    "Identify student learning gaps",
    "Track student progress",
    "Provide differentiated assignments",
    "Reduce grading time",
    "Other",
  ];

  const handleGoalChange = (goal: string) => {
    const updatedGoals = selectedGoals.includes(goal)
      ? selectedGoals.filter((g) => g !== goal)
      : [...selectedGoals, goal];

    setSelectedGoals(updatedGoals);
    updateFormData({ goals: updatedGoals });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedGoals.length > 0) {
      onNext();
    }
  };

  return (
    <div className={`${formCommonStyles["container"]}`}>
      <p className={formCommonStyles["form-step"]}>Step 3 of 3</p>
      <h1 className={formCommonStyles['step-header']}>What are your biggest goals while using Pathway Learning AI</h1>

      <form>
        <div className={styles["goals-container"]}>
          {goalOptions.map((goal, index) => (
            <div key={index} className={styles["goal-option"]}>
              <label className={styles["checkbox-label"]}>
                <input
                  type="checkbox"
                  checked={selectedGoals.includes(goal)}
                  onChange={() => handleGoalChange(goal)}
                  className={styles["hidden-checkbox"]}
                />
                <span className={styles["custom-checkbox"]}>
                  {selectedGoals.includes(goal) && (
                    <span className={styles["checkmark"]}>✓</span>
                  )}
                </span>
                <span className={styles["goal-text"]}>{goal}</span>
              </label>
            </div>
          ))}
        </div>

        <div className={`${formCommonStyles["button-container"]}`}>
          <button
            type="button"
            className={`${shareUi["nav-buttons"]}`}
            onClick={onBack}
          >
            Prev
          </button>
          <button
            type="button"
            className={`${shareUi["nav-buttons"]}`}
            onClick={onNext}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
