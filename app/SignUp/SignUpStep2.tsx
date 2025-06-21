import React, { useState } from "react";

export default function StepUp2Setup() {
  const [dropGradeMenu, setGradeDropMenu] = useState<boolean>(false);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [dropSubjectMenu, setSubjectDropMenu] = useState<boolean>(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

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

  // create functions that select multiple subjects and grades
  const toggleGradeDropMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if(target.id === "grade-levels"){
        setGradeDropMenu(!dropGradeMenu)   
    } else {
        return
    }
  }

  const toggleSubjectDropMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement 
    
    if(target.id === "subjects-taught") {
        setSubjectDropMenu(!dropSubjectMenu)
    } else {
        return 
    }
  }

  const toggleSelectedGrades = (newGrade: string) => {
    setSelectedGrades(prevState => [...prevState, newGrade])
    // remove the grade if its already selected 
  }

  const toggleSelectedSubjects = (newSubject: string) => {
    setSelectedSubjects(prevState => [...prevState, newSubject])
    console.log(selectedSubjects)
    // remove the subject if its already selected 

  }

  return (
    <>
      <p>Step 2 of 4</p>
      <h1>School & Role Information</h1>
      <form action="submit">
        <input
          id="school-name"
          type="text"
          className="form-input"
          placeholder="School Name"
        />
        <div
        onClick={toggleGradeDropMenu}
          id="grade-levels"
          className="form-input"
        >
          <p>Grade Level(s) Taught</p>
          {dropGradeMenu && (
            <ul>
              {grades.map((grade) => {
                return <li onClick={() => toggleSelectedGrades(grade)}>{grade}</li>;
              })}
            </ul>
          )}
          <img src="" alt="" className="down-arrow" />
        </div>
        <div
          onClick={toggleSubjectDropMenu}
          id="subjects-taught"
          className="form-input"
        >
          <p>Subjects(s) Taught</p>
          {dropSubjectMenu &&  <ul>
              {subjects.map((subject) => {
                return <li onClick={() => toggleSelectedSubjects(subject)}>{subject}</li>;
              })}
            </ul>}
          <img src="" alt="" className="down-arrow" />
        </div>
      </form>
    </>
  );
}
