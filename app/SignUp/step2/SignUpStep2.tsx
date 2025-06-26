import React, { useState, useEffect, ChangeEvent } from "react";
import statesData from "../../data/states.json";
import formCommonStyles from "../shared/FormStyles.module.css";
import step2Styles from '../step2/step2Styles.module.css'
import shareUi from "../../global/sharedUi.module.css";

export default function StepUp2Setup({
  onNext,
  onBack,
  formData,
  updateFormData,
}) {
  const [dropGradeMenu, setGradeDropMenu] = useState<boolean>(false);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [dropSubjectMenu, setSubjectDropMenu] = useState<boolean>(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [showStates, setShowStates] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<string>("Choose your state");
  const [district, setDistrict] = useState<string>("");

  const [stateOptions, setStateOptions] = useState<Array<{ code: string; name: string }>>([]);
  const [schoolName, setSchoolName] = useState<string>("");

  // Validation states
  const [errors, setErrors] = useState<{
    state?: string;
    schoolName?: string;
    district?: string;
    grades?: string;
    subjects?: string;
  }>({});
  const [showErrors, setShowErrors] = useState<boolean>(false);

  const grades = [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ];

  const subjects = [
    "Elementary Mathematics",
    "Pre-Algebra",
    "Algebra I",
    "Geometry",
    "Algebra II",
    "Pre-Calculus",
    "Calculus AB",
    "Calculus BC",
    "Statistics",
    "AP Statistics",
    "Trigonometry",
    "Mathematical Modeling",
    "Discrete Mathematics",
    "Consumer Mathematics",
    "Business Mathematics",
  ];

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validate state selection
    if (selectedState === "Choose your state" || !selectedState) {
      newErrors.state = "Please select your state";
    }

    // Validate school name
    if (!schoolName.trim()) {
      newErrors.schoolName = "School name is required";
    }

    // Validate district
    if (!district.trim()) {
      newErrors.district = "District is required";
    }

    // Validate grade selection
    if (selectedGrades.length === 0) {
      newErrors.grades = "Please select at least one grade level";
    }

    // Validate subject selection
    if (selectedSubjects.length === 0) {
      newErrors.subjects = "Please select at least one subject";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowErrors(true);
    
    if (validateForm()) {
      // Update form data before proceeding
      updateFormData({
        state: selectedState,
        schoolName: schoolName.trim(),
        district: district.trim(),
        grades: selectedGrades,
        subjects: selectedSubjects
      });
      onNext();
    }
  };

  const updateDistrict = (e: ChangeEvent<HTMLInputElement>) => {
    setDistrict(e.target.value);
    // Clear error when user starts typing
    if (showErrors && errors.district) {
      setErrors(prev => ({ ...prev, district: undefined }));
    }
  };

  const updateSchoolName = (e: ChangeEvent<HTMLInputElement>) => {
    setSchoolName(e.target.value);
    // Clear error when user starts typing
    if (showErrors && errors.schoolName) {
      setErrors(prev => ({ ...prev, schoolName: undefined }));
    }
  };

  const toggleGradeDropMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    // Don't open dropdown if clicking on remove button
    if (target.classList.contains('remove-btn') || target.closest('.remove-btn')) {
      return;
    }
    
    // Close other dropdowns before toggling this one
    setSubjectDropMenu(false);
    setShowStates(false);
    setGradeDropMenu(!dropGradeMenu);
  };

  const toggleSubjectDropMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    // Don't open dropdown if clicking on remove button
    if (target.classList.contains('remove-btn') || target.closest('.remove-btn')) {
      return;
    }

    // Close other dropdowns before toggling this one
    setGradeDropMenu(false);
    setShowStates(false);
    setSubjectDropMenu(!dropSubjectMenu);
  };

  const toggleStatesDropMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close other dropdowns before toggling this one
    setGradeDropMenu(false);
    setSubjectDropMenu(false);
    setShowStates(!showStates);
  };

  const toggleSelectedGrades = (newGrade: string) => {
    setSelectedGrades((prevState) => {
      let newGrades;
      // Check if grade is already selected
      if (prevState.includes(newGrade)) {
        // Remove it if already selected
        newGrades = prevState.filter(grade => grade !== newGrade);
      } else {
        // Add it if not selected
        newGrades = [...prevState, newGrade];
      }
      
      // Clear error if grades are selected
      if (showErrors && errors.grades && newGrades.length > 0) {
        setErrors(prev => ({ ...prev, grades: undefined }));
      }
      
      return newGrades;
    });
    // Don't close dropdown after selection to allow multiple selections
    // setGradeDropMenu(false);
  };

  const toggleSelectedSubjects = (newSubject: string) => {
    setSelectedSubjects((prevState) => {
      let newSubjects;
      // Check if subject is already selected
      if (prevState.includes(newSubject)) {
        // Remove it if already selected
        newSubjects = prevState.filter(subject => subject !== newSubject);
      } else {
        // Add it if not selected
        newSubjects = [...prevState, newSubject];
      }
      
      // Clear error if subjects are selected
      if (showErrors && errors.subjects && newSubjects.length > 0) {
        setErrors(prev => ({ ...prev, subjects: undefined }));
      }
      
      return newSubjects;
    });
    // Don't close dropdown after selection to allow multiple selections
    // setSubjectDropMenu(false);
  };

  const removeGrade = (event: React.MouseEvent, gradeToRemove: string) => {
    event.stopPropagation(); // Prevents opening the dropdown
    setSelectedGrades(prev => prev.filter(grade => grade !== gradeToRemove));
  };

  const removeSubject = (event: React.MouseEvent, subjectToRemove: string) => {
    event.stopPropagation(); // Prevents opening the dropdown
    setSelectedSubjects(prev => prev.filter(subject => subject !== subjectToRemove));
  };

  const handleStateSelection = (stateName: string) => {
    setSelectedState(stateName);
    setShowStates(false);
    // Clear error when state is selected
    if (showErrors && errors.state) {
      setErrors(prev => ({ ...prev, state: undefined }));
    }
  };

  return (
    <div className={`${formCommonStyles["container"]}`}>
      <p className={`${formCommonStyles["step"]}`}>Step 2 of 3</p>
      <h1 className={`${formCommonStyles["step-header"]}`}>
        School & Role Information
      </h1>
      <form
        action="submit"
        className={`${shareUi["column"]} ${formCommonStyles["form"]}`}
      >
        {/* State Selection */}
        <div className={`${shareUi["column"]}`}>
          <div
            className={`${formCommonStyles["form-input"]} ${step2Styles['selection-item-container']} ${step2Styles['state-container']} ${showErrors && errors.state ? formCommonStyles['error'] : ''}`}
            onClick={toggleStatesDropMenu}
          >
            <p>{selectedState || "Choose your state"}</p>

            {/* Hidden input to submit value with the form */}
            <input type="hidden" name="state" value={selectedState} />

            <input
              type="hidden"
              name="state"
              value={selectedState === "Choose your state" ? "" : selectedState}
            />

            {showStates && (
              <ul className={`${formCommonStyles["dropdown-list"]} ${step2Styles[".state__list-container"]} ${step2Styles["state__list-container"]}`}>
                {statesData.map((state) => (
                  <li
                    key={state.code}
                    onClick={() => handleStateSelection(state.name)}
                    className={`${formCommonStyles["dropdown-item"]} ${step2Styles["selection-item"]}`}
                  >
                    {state.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {showErrors && errors.state && (
            <span className={formCommonStyles["error-message"]}>{errors.state}</span>
          )}
        </div>

        {/* School Name */}
        <div className={`${shareUi["column"]}`}>
          <input
            id="school-name"
            type="text"
            className={`${formCommonStyles["form-input"]} ${showErrors && errors.schoolName ? formCommonStyles['error'] : ''}`}
            placeholder="School Name"
            value={schoolName}
            onChange={updateSchoolName}
          />
          {showErrors && errors.schoolName && (
            <span className={formCommonStyles["error-message"]}>{errors.schoolName}</span>
          )}
        </div>

        {/* District */}
        <div className={`${shareUi["column"]}`}>
          <input
            id="district-name"
            type="text"
            className={`${formCommonStyles["form-input"]} ${showErrors && errors.district ? formCommonStyles['error'] : ''}`}
            placeholder="District"
            value={district}
            onChange={updateDistrict}
          />
          {showErrors && errors.district && (
            <span className={formCommonStyles["error-message"]}>{errors.district}</span>
          )}
        </div>

        {/* Grade Selection with Bubbles */}
        <div className={`${shareUi["column"]}`}>
          <div
            onClick={toggleGradeDropMenu}
            id="grade-levels"
            className={`${formCommonStyles["form-input"]} ${step2Styles['grade-container']} ${step2Styles['selection-bubbles']} ${selectedGrades.length > 0 ? step2Styles['has-selections'] : ''} ${showErrors && errors.grades ? formCommonStyles['error'] : ''}`}
          >
            {selectedGrades.length === 0 ? (
              <div className={step2Styles['selection-placeholder']}>Grade Level(s) Taught</div>
            ) : (
              <div className={step2Styles['bubbles-container']}>
                {selectedGrades.map((grade, index) => (
                  <div key={index} className={`${step2Styles['selection-bubble']} ${step2Styles['grades']}`}>
                    <span>{grade}</span>
                    <button 
                      className={`${step2Styles['remove-btn']} remove-btn`}
                      onClick={(e) => removeGrade(e, grade)}
                      title={`Remove ${grade}`}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {dropGradeMenu && (
              <ul className={`${formCommonStyles["dropdown-list"]} ${step2Styles[".state__list-container"]} ${step2Styles["state__list-container"]}`}>
                {grades.map((grade, index) => {
                  const isSelected = selectedGrades.includes(grade);
                  return (
                    <li 
                      key={index}
                      className={`${formCommonStyles["dropdown-item"]} ${step2Styles["selection-item"]} ${isSelected ? step2Styles['selected'] : ''}`} 
                      onClick={() => toggleSelectedGrades(grade)}
                    >
                      {grade}
                      {isSelected && <span className={step2Styles['checkmark']}>✓</span>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {showErrors && errors.grades && (
            <span className={formCommonStyles["error-message"]}>{errors.grades}</span>
          )}
        </div>

        {/* Subject Selection with Bubbles */}
        <div className={`${shareUi["column"]}`}>
          <div
            onClick={toggleSubjectDropMenu}
            id="subjects-taught"
            className={`${formCommonStyles["form-input"]} ${step2Styles['subject-container']} ${step2Styles['selection-bubbles']} ${selectedSubjects.length > 0 ? step2Styles['has-selections'] : ''} ${showErrors && errors.subjects ? formCommonStyles['error'] : ''}`}
          >
            {selectedSubjects.length === 0 ? (
              <div className={step2Styles['selection-placeholder']}>Subject(s) Taught</div>
            ) : (
              <div className={step2Styles['bubbles-container']}>
                {selectedSubjects.map((subject, index) => (
                  <div key={index} className={`${step2Styles['selection-bubble']} ${step2Styles['subjects']}`}>
                    <span>{subject}</span>
                    <button 
                      className={`${step2Styles['remove-btn']} remove-btn`}
                      onClick={(e) => removeSubject(e, subject)}
                      title={`Remove ${subject}`}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {dropSubjectMenu && (
              <ul className={`${formCommonStyles["dropdown-list"]} ${step2Styles[".state__list-container"]} ${step2Styles["state__list-container"]}`}>
                {subjects.map((subject, index) => {
                  const isSelected = selectedSubjects.includes(subject);
                  return (
                    <li 
                      key={index}
                      className={`${formCommonStyles["dropdown-item"]} ${step2Styles["selection-item"]} ${isSelected ? step2Styles['selected'] : ''}`}
                      onClick={() => toggleSelectedSubjects(subject)}
                    >
                      {subject}
                      {isSelected && <span className={step2Styles['checkmark']}>✓</span>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {showErrors && errors.subjects && (
            <span className={formCommonStyles["error-message"]}>{errors.subjects}</span>
          )}
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
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}