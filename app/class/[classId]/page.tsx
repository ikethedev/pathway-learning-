"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./ClassPage.module.css";
import { Content } from "next/font/google";
import Feed from "./tabs/feed/feed"


export default function ClassPage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const fabRef = useRef(null);

  const tabs = [
    { id: "feed", label: "Feed" },
    { id: "assignments", label: "Assignments" },
    { id: "people", label: "People" },
    { id: "gradebook", label: "Gradebook" }
  ];

  const fabActions = [
    {
      id: "assignment",
      label: "Create Assignment",
      description: "Add homework or classwork",
      action: () => handleFabAction("assignment")
    },
    {
      id: "student",
      label: "Add Student",
      description: "Invite or enroll new student",
      action: () => handleFabAction("student")
    },
    {
      id: "announcement",
      label: "Post Announcement",
      description: "Share news with class",
      action: () => handleFabAction("announcement")
    }
  ];



useEffect(() => {
  const fetchStandards = async () => {
    try {
      const response = await fetch(
        "https://www.commonstandardsproject.com/api/v1/jurisdictions/AB6E6F50DDF047E8BC3EE2CCFD33DCCC"
      );
      const data = await response.json();

      const middleSchoolMath = data.standardSets.filter((set: any) =>
        set.subject?.toLowerCase().includes("math") &&
        set.educationLevels?.some((level: string) =>
          ["06", "07", "08"].includes(level)
        )
      );

      console.log("Middle School Math Standards:", middleSchoolMath);
    } catch (error) {
      console.error("Failed to fetch standards:", error);
    }
  };

  fetchStandards();
}, []);


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
    // Navigate back to classes list - replace with actual navigation logic
    // For example: router.push('/classes') or window.history.back()
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

  const renderTabContent = (tabId) => {
    switch(tabId){
      case "feed":
        return <Feed />;
        break;
      default:
      return "hello world"

    }

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
        </div>
        <div>
        <p className={styles.contentDescription}>
            {renderTabContent(activeTab)}
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