import React, { useState, useMemo } from "react";
import { Search, Download, Plus, Edit2, Save, X } from "lucide-react";
import styles from "./Gradebook.module.css";
import FeedUpdateModal from "../../../components/FeedUpdate/FeedUpdate";
import { useModal } from "../../../../context/updatefeed";
import { mathStandardsData } from "../../../../data/mathStandardsData";

const STORAGE_KEY = "classroom_classes";

const students = [
  {
    id: "student-001",
    name: "Emma Johnson",
    email: "emma.johnson@student.edu",
    grade: "10th Grade",
  },
  {
    id: "student-002",
    name: "Michael Chen",
    email: "michael.chen@student.edu",
    grade: "10th Grade",
  },
  {
    id: "student-003",
    name: "Sophia Rodriguez",
    email: "sophia.rodriguez@student.edu",
    grade: "10th Grade",
  },
  {
    id: "student-004",
    name: "James Wilson",
    email: "james.wilson@student.edu",
    grade: "10th Grade",
  },
  {
    id: "student-005",
    name: "Olivia Brown",
    email: "olivia.brown@student.edu",
    grade: "10th Grade",
  },
];

const mockGradebook = [
  {
    studentId: "student-001",
    grades: [
      { assignmentId: "a1", score: 9 },
      { assignmentId: "a2", score: 14 },
      { assignmentId: "a3", score: 19 },
    ],
  },
  {
    studentId: "student-002",
    grades: [
      { assignmentId: "a1", score: 8 },
      { assignmentId: "a2", score: 13 },
      { assignmentId: "a3", score: 16 },
    ],
  },
  {
    studentId: "student-003",
    grades: [
      { assignmentId: "a1", score: 6 },
      { assignmentId: "a2", score: 11 },
      { assignmentId: "a3", score: 15 },
    ],
  },
  {
    studentId: "student-004",
    grades: [
      { assignmentId: "a1", score: 10 },
      { assignmentId: "a2", score: 15 },
      { assignmentId: "a3", score: 20 },
    ],
  },
  {
    studentId: "student-005",
    grades: [
      { assignmentId: "a1", score: 7 },
      { assignmentId: "a2", score: 10 },
      { assignmentId: "a3", score: 14 },
    ],
  },
];

const assignments = [
  {
    id: "a1",
    name: "Quiz 1",
    maxScore: 10,
    dueDate: "2024-09-15",
    type: "Quiz",
  },
  {
    id: "a2",
    name: "Homework 1",
    maxScore: 15,
    dueDate: "2024-09-22",
    type: "Homework",
  },
  {
    id: "a3",
    name: "Test 1",
    maxScore: 20,
    dueDate: "2024-09-30",
    type: "Test",
  },
];

export default function GradeBook() {
  const [newAssignment, setNewAssignment] = useState({
    name: "",
    maxScore: "",
    type: "",
    dueDate: "",
  });

  console.log(mathStandardsData)
  const [assignmentsState, setAssignmentsState] = useState(assignments);
  const isMobile = window.innerWidth <= 768;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [editingCell, setEditingCell] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [gradebook, setGradebook] = useState(mockGradebook);

  const { 
    showFeedModal, 
    setShowFeedModal, 
    showAssignmentModal, 
    setShowAssignmentModal,
    postType,
    setPostType,
    selectedStandard,
    setSelectedStandard,
    standards,
    assessmentConfig,
    setAssessmentConfig,
    isGenerating,
    handleFeedPost
  } = useModal();


  
  const storedClasses = localStorage.getItem(STORAGE_KEY);

  let currentClass;
  if (storedClasses) {
    currentClass = JSON.parse(storedClasses);
    console.log(currentClass);
  }
  const { name, classCode } = currentClass[0];

  const studentsWithGrades = useMemo(() => {
    return students.map((student) => {
      const studentGrades = gradebook.find((g) => g.studentId === student.id);
      const gradeMap = {};

      if (studentGrades) {
        studentGrades.grades.forEach((grade) => {
          gradeMap[grade.assignmentId] = grade.score;
        });
      }

      const totalScore = assignments.reduce(
        (sum, assignment) => sum + (gradeMap[assignment.id] || 0),
        0
      );
      const maxTotal = assignments.reduce(
        (sum, assignment) => sum + assignment.maxScore,
        0
      );
      const percentage = maxTotal > 0 ? (totalScore / maxTotal) * 100 : 0;

      return {
        ...student,
        grades: gradeMap,
        totalScore,
        percentage: Math.round(percentage * 10) / 10,
      };
    });
  }, [gradebook]);

  const filteredStudents = useMemo(() => {
    let filtered = studentsWithGrades.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "grade") {
      filtered.sort((a, b) => b.percentage - a.percentage);
    }

    return filtered;
  }, [studentsWithGrades, searchTerm, sortBy]);

  const handleEditStart = (studentId, assignmentId, currentValue) => {
    setEditingCell(`${studentId}-${assignmentId}`);
    setEditValue(currentValue || "");
  };

  const handleEditSave = (studentId, assignmentId) => {
    const newScore = parseFloat(editValue);
    if (isNaN(newScore) || newScore < 0) return;

    setGradebook((prev) =>
      prev.map((entry) => {
        if (entry.studentId === studentId) {
          const updatedGrades = entry.grades.map((grade) =>
            grade.assignmentId === assignmentId
              ? { ...grade, score: newScore }
              : grade
          );

          if (!updatedGrades.find((g) => g.assignmentId === assignmentId)) {
            updatedGrades.push({ assignmentId, score: newScore });
          }

          return { ...entry, grades: updatedGrades };
        }
        return entry;
      })
    );

    setEditingCell(null);
    setEditValue("");
  };

  const handleEditCancel = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const getGradeColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return styles.gradeA;
    if (percentage >= 80) return styles.gradeB;
    if (percentage >= 70) return styles.gradeC;
    if (percentage >= 60) return styles.gradeD;
    return styles.gradeF;
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const handleAddAssignment = () => {
    const newId = `a${assignmentsState.length + 1}`;
    const newAssign = {
      id: newId,
      name: newAssignment.name,
      maxScore: parseFloat(newAssignment.maxScore),
      type: newAssignment.type,
      dueDate: newAssignment.dueDate,
    };

    setAssignmentsState((prev) => [...prev, newAssign]);

    setGradebook((prev) =>
      prev.map((entry) => ({
        ...entry,
        grades: [...entry.grades, { assignmentId: newId, score: 0 }],
      }))
    );

    setNewAssignment({ name: "", maxScore: "", type: "", dueDate: "" });
    setShowFeedModal(false);
  };

  const handleAddAssignmentClick = () => {
    setPostType("diagnostic");
    setShowFeedModal(true);
  };




const everyStandard = Object.values(mathStandardsData).flatMap(gradeData => 
  gradeData.units.flatMap(unit => {
    // Create standard objects from the unit's learning objectives
    const standards = unit.learningObjectives.map(objective => ({
      code: objective,
      description: unit.detailedObjectives?.find(detail => detail.code === objective)?.description || `${unit.title} - ${objective}`,
      grade: gradeData.overview.grade,
      unitTitle: unit.title
    }));
    
    return standards;
  })
);

  return (
    <div className={styles.gradebookWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>{name} Gradebook</h1>
        <p className={styles.subtitle}>10th Grade - Fall 2024</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchInputWrapper}>
          <Search className={styles.iconLeft} />
          <input
            type="text"
            placeholder="Search students..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className={styles.sortDropdown}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="grade">Sort by Grade</option>
        </select>

        <button
          className={`${styles.actionButton} ${styles.addButton}`}
          onClick={handleAddAssignmentClick}
        >
          <Plus className={styles.iconButton} />
          Add Assignment
        </button>

        <button className={`${styles.actionButton} ${styles.exportButton}`}>
          <Download className={styles.iconButton} />
          Export
        </button>
      </div>
  
      <div className={styles.tableWrapper}>
        <div className={styles.tableScroll}>
          {!selectedStudent && !isMobile && (
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.studentHeader}>Student</th>
                  {assignments.map((assignment) => (
                    <th key={assignment.id} className={styles.assignmentHeader}>
                      <div className={styles.assignmentHeaderContent}>
                        <span className={styles.assignmentName}>
                          {assignment.name}
                        </span>
                        <span className={styles.assignmentMeta}>
                          /{assignment.maxScore}
                        </span>
                        <span className={styles.assignmentMeta}>
                          {assignment.type}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className={styles.totalHeader}>Total</th>
                  <th className={styles.gradeHeader}>Grade</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className={styles.row}>
                    <td className={styles.studentCell}>
                      <div className={styles.studentInfo}>
                        <div className={styles.avatar}>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className={styles.studentText}>
                          <div
                            className={styles.studentName}
                            onClick={() => setSelectedStudent(student)}
                            style={{ cursor: "pointer" }}
                          >
                            {student.name}
                          </div>

                          <div className={styles.studentEmail}>
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    {assignments.map((assignment) => {
                      const score = student.grades[assignment.id] || 0;
                      const cellId = `${student.id}-${assignment.id}`;
                      const isEditing = editingCell === cellId;

                      return (
                        <td key={assignment.id} className={styles.scoreCell}>
                          {isEditing ? (
                            <div className={styles.editInputWrapper}>
                              <input
                                type="number"
                                min="0"
                                max={assignment.maxScore}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className={styles.editInput}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleEditSave(student.id, assignment.id);
                                  }
                                }}
                                autoFocus
                              />
                              <button
                                onClick={() =>
                                  handleEditSave(student.id, assignment.id)
                                }
                                className={styles.iconSuccess}
                              >
                                <Save className={styles.iconSmall} />
                              </button>
                              <button
                                onClick={handleEditCancel}
                                className={styles.iconCancel}
                              >
                                <X className={styles.iconSmall} />
                              </button>
                            </div>
                          ) : (
                            <div
                              className={`${styles.scoreBadge} ${getGradeColor(
                                score,
                                assignment.maxScore
                              )}`}
                              onClick={() =>
                                handleEditStart(
                                  student.id,
                                  assignment.id,
                                  score
                                )
                              }
                            >
                              {score}/{assignment.maxScore}
                              <Edit2 className={styles.iconTiny} />
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className={styles.totalCell}>
                      <div>
                        {student.totalScore}/
                        {assignments.reduce((sum, a) => sum + a.maxScore, 0)}
                      </div>
                      <div className={styles.totalPercent}>
                        {student.percentage}%
                      </div>
                    </td>
                    <td className={styles.finalGradeCell}>
                      <span
                        className={`${styles.gradeBadge} ${getGradeColor(
                          student.percentage,
                          100
                        )}`}
                      >
                        {getLetterGrade(student.percentage)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!selectedStudent && isMobile && (
            <div className={styles.cardList}>
              {filteredStudents.map((student) => (
                <div key={student.id} className={styles.card}>
                  <div className={styles.studentCardHeader}>
                    <div className={styles.avatar}>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className={styles.studentName}>{student.name}</div>
                      <div className={styles.studentEmail}>{student.email}</div>
                    </div>
                  </div>
                  {assignmentsState.map((assignment) => {
                    const score = student.grades[assignment.id] || 0;
                    return (
                      <div key={assignment.id} className={styles.cardRow}>
                        <strong>{assignment.name}</strong>
                        <span>
                          {score}/{assignment.maxScore}
                        </span>
                      </div>
                    );
                  })}
                  <div className={styles.cardRow}>
                    <strong>Total</strong>
                    <span>{student.totalScore}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <strong>Grade</strong>
                    <span>{getLetterGrade(student.percentage)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {selectedStudent && (
            <div className={styles.studentDetailView}>
              <button
                onClick={() => setSelectedStudent(null)}
                className={styles.backButton}
              >
                ← Back to All Students
              </button>
              <h2 className={styles.studentDetailHeader}>
                {selectedStudent.name}
              </h2>
              <div className={styles.assignmentList}>
                {assignments.map((assignment) => {
                  const score = selectedStudent.grades[assignment.id] || 0;
                  return (
                    <div key={assignment.id} className={styles.assignmentItem}>
                      <div>
                        <div className={styles.assignmentName}>
                          {assignment.name}
                        </div>
                        <div className={styles.assignmentMeta}>
                          {assignment.type} / {assignment.maxScore}
                        </div>
                      </div>
                      <div
                        className={`${styles.assignmentScore} ${getGradeColor(
                          score,
                          assignment.maxScore
                        )}`}
                      >
                        {score}/{assignment.maxScore}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {showFeedModal && (
          <FeedUpdateModal     
            setShowModal={setShowFeedModal}
            postType={postType}
            setPostType={setPostType}
            selectedStandard={selectedStandard}
            setSelectedStandard={setSelectedStandard}
            standards={everyStandard}
            assessmentConfig={assessmentConfig}
            setAssessmentConfig={setAssessmentConfig}
            handlePost={handleFeedPost}
            isGenerating={isGenerating}
          />
        )}
      </div>
    </div>
  );
}