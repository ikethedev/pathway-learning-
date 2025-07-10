"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ClassPage.module.css";

export default function ClassPage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const fabRef = useRef(null);
  const router = useRouter()

  const tabs = [
    { id: "feed", label: "Feed", icon: "📰" },
    { id: "assignments", label: "Assignments", icon: "📝" },
    { id: "people", label: "People", icon: "👥" },
    { id: "gradebook", label: "Gradebook", icon: "📊" }
  ];

  const fabActions = [
    {
      id: "assignment",
      icon: "📝",
      label: "Create Assignment",
      description: "Add homework or classwork",
      action: () => handleFabAction("assignment")
    },
    {
      id: "student",
      icon: "👤",
      label: "Add Student",
      description: "Invite or enroll new student",
      action: () => handleFabAction("student")
    },
    {
      id: "announcement",
      icon: "📢",
      label: "Post Announcement",
      description: "Share news with class",
      action: () => handleFabAction("announcement")
    }
  ];

  // Close FAB menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setFabMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBackToClasses = () => {
    console.log("Navigating back to all classes...");
    router.push("/dashboard")
   
  };

  const handleFabAction = (actionType) => {
    setFabMenuOpen(false);
    // Handle the action - you can replace these with actual functionality
    switch (actionType) {
      case "assignment":
        console.log("Creating new assignment...");
        // Navigate to assignment creation or open modal
        break;
      case "student":
        console.log("Adding new student...");
        // Navigate to student addition or open modal
        break;
      case "announcement":
        console.log("Creating announcement...");
        // Navigate to announcement creation or open modal
        break;
      default:
        break;
    }
  };

  const getTabDescription = (tabId) => {
    const descriptions = {
      feed: 'View class announcements and recent activity',
      assignments: 'Manage assignments and homework',
      people: 'View students and class roster',
      gradebook: 'Track student grades and performance'
    };
    return descriptions[tabId];
  };

  return (
    <div className={styles.container}>
      {/* Header with back button */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.classInfo}>
            <button 
              className={styles.backButton}
              onClick={handleBackToClasses}
              aria-label="Back to all classes"
            >
              <span className={styles.backArrow}>‹</span>
              <span>All Classes</span>
            </button>
            <h1 className={styles.classTitle}>
              Mathematics 101
            </h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.content}>
          <h2 className={styles.contentTitle}>
            {activeTab}
          </h2>
          <p className={styles.contentDescription}>
            {getTabDescription(activeTab)}
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <div className={styles.bottomNavContent}>
          <div className={styles.tabContainer}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tab} ${
                  activeTab === tab.id ? styles.tabActive : ""
                }`}
              >
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Floating Action Button - positioned above bottom nav */}
      <div className={styles.fab} ref={fabRef}>
        <button
          className={styles.fabButton}
          onClick={() => setFabMenuOpen(!fabMenuOpen)}
          aria-label="Teacher actions"
        >
          {fabMenuOpen ? "×" : "+"}
        </button>
        
        <div className={`${styles.fabMenu} ${fabMenuOpen ? styles.fabMenuOpen : ""}`}>
          {fabActions.map((action) => (
            <button
              key={action.id}
              className={styles.fabMenuItem}
              onClick={action.action}
            >
              <div className={styles.fabMenuText}>
                <div>{action.label}</div>
                <div className={styles.fabMenuDescription}>{action.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}