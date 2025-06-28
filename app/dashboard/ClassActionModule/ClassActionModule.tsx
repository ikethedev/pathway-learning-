import React from "react";
import styles from "./ClassActionModule.module.css"
import formStyles from "../shared/FormStyles.module.css"
import shareUi from "../../global/sharedUi.module.css";

interface ClassActionModuleProps {
  toggleClassAction: () => void;
  addClass: (className: string) => void;
  updateCourseName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentClassName?: string;
  addCourseModal?: (e: React.FormEvent) => void;
}

export default function ClassActionModule({ 
  toggleClassAction, 
  addClass, 
  updateCourseName, 
  currentClassName = "",
  addCourseModal 
}: ClassActionModuleProps) {
    
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    e.stopPropagation(); // Prevent event bubbling
    
    const formData = new FormData(e.target as HTMLFormElement);
    const className = formData.get('name') as string;
    
    if (className?.trim()) {
      addClass(className.trim());
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    
    const input = e.currentTarget.form?.querySelector('input[name="name"]') as HTMLInputElement;
    const className = input?.value?.trim();
    
    if (className) {
      addClass(className);
    }
  };

  // Handle overlay click (click outside modal)
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking on the overlay itself, not the form
    if (e.target === e.currentTarget) {
      toggleClassAction();
    }
  };

  // Prevent form clicks from bubbling to overlay
  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (      
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <form 
        className={styles.form} 
        onSubmit={handleSubmit}
        onClick={handleFormClick}
      >
        <div className={styles["form__input-container"]}>
          <label htmlFor="name" className={formStyles["step-header"]}>Class Name</label>
          <input 
            type="text" 
            name="name" 
            id="name"
            placeholder="Enter class name" 
            className={formStyles["form-input"]} 
            onChange={updateCourseName}
            defaultValue=""
            autoFocus
          />
        </div>
        
        <button 
          type="button" 
          onClick={handleAddClick} 
          className={styles["add-button"]}
        >
          Add Class
        </button>
      </form>
    </div>
  );
}