import styles from "./Assignment.module.css";
import React, { useState } from "react";
import {
  Search,
  Plus,
  Calendar,
  Users,
  CheckCircle,
  Edit2,
  Trash2,
} from "lucide-react";

const assignments = [
  {
    id: "a1",
    name: "Quiz 1",
    maxScore: 10,
    dueDate: "2024-09-15",
    type: "Quiz",
    description: "Chapter 1-3 Review Quiz",
    assignedStudents: 5,
    submissions: 4,
    status: "active",
  },
  {
    id: "a2",
    name: "Homework 1",
    maxScore: 15,
    dueDate: "2024-09-22",
    type: "Homework",
    description: "Problem Set A: Linear Equations",
    assignedStudents: 5,
    submissions: 3,
    status: "active",
  },
  {
    id: "a3",
    name: "Test 1",
    maxScore: 20,
    dueDate: "2024-09-30",
    type: "Test",
    description: "Midterm Examination",
    assignedStudents: 5,
    submissions: 2,
    status: "upcoming",
  },
  {
    id: "a4",
    name: "Lab Report 1",
    maxScore: 25,
    dueDate: "2024-10-05",
    type: "Lab",
    description: "Chemistry Lab Analysis",
    assignedStudents: 5,
    submissions: 0,
    status: "upcoming",
  },
];

export default function AssignmentLog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const filteredAssignments = assignments
    .filter((assignment) => {
      const matchesSearch =
        assignment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" ||
        assignment.type.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "submissions") {
        return b.submissions - a.submissions;
      }
      return 0;
    });

  const getSubmissionRate = (submissions: number, assigned: number) => {
    return assigned > 0
      ? Math.round((submissions / assigned) * 100)
      : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Assignment Log</h1>
        <p className={styles.subtitle}>
          Track assignments, submissions, and student progress
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={styles.select}
        >
          <option value="all">All Types</option>
          <option value="quiz">Quiz</option>
          <option value="homework">Homework</option>
          <option value="test">Test</option>
          <option value="lab">Lab</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.select}
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="name">Sort by Name</option>
          <option value="submissions">Sort by Submissions</option>
        </select>

        <button className={styles.addButton}>
          <Plus size={16} />
          Add Assignment
        </button>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className={styles.emptyState}>
          <Calendar className={styles.emptyIcon} />
          <p className={styles.emptyText}>No assignments found</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredAssignments.map((assignment) => {
            const submissionRate = getSubmissionRate(
              assignment.submissions,
              assignment.assignedStudents
            );

            const statusClass =
              assignment.status === "active"
                ? styles.statusActive
                : assignment.status === "upcoming"
                ? styles.statusUpcoming
                : styles.statusCompleted;

            const rateClass =
              submissionRate >= 80
                ? styles.submissionRateHigh
                : submissionRate >= 60
                ? styles.submissionRateMedium
                : styles.submissionRateLow;

            return (
              <div
                key={assignment.id}
                className={`${styles.card} ${
                  isOverdue(assignment.dueDate) ? styles.cardOverdue : ""
                }`}
              >
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.cardTitle}>{assignment.name}</h3>
                    <p className={styles.cardType}>{assignment.type}</p>
                  </div>
                  <div className={styles.cardActions}>
                    <button className={styles.actionButton}>
                      <Edit2 size={16} />
                    </button>
                    <button className={styles.actionButton}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className={styles.description}>{assignment.description}</p>

                <div className={styles.metaGrid}>
                  <div className={styles.metaItem}>
                    <Calendar className={styles.metaIcon} />
                    <span
                      className={`${styles.metaText} ${
                        isOverdue(assignment.dueDate)
                          ? styles.overdueText
                          : ""
                      }`}
                    >
                      Due: {formatDate(assignment.dueDate)}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <Users className={styles.metaIcon} />
                    <span className={styles.metaText}>
                      {assignment.assignedStudents} students
                    </span>
                  </div>
                </div>

                <div className={styles.statsRow}>
                  <div className={styles.submissionStats}>
                    <CheckCircle className={styles.metaIcon} />
                    <span className={styles.submissionCount}>
                      {assignment.submissions}/{assignment.assignedStudents}{" "}
                      submitted
                    </span>
                  </div>
                  <div className={`${styles.submissionRate} ${rateClass}`}>
                    {submissionRate}%
                  </div>
                </div>

                <div className={`${styles.statusBadge} ${statusClass}`}>
                  {assignment.status}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
