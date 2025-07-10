"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation'
import styles from "./ClassPage.module.css";
import { Content } from "next/font/google";
import Feed from "./tabs/feed/feed"
import FeedUpdateModal from "../components/FeedUpdate/FeedUpdate";

interface Standard {
  code: string;
  description: string;
  grade: number;
  unitTitle: string;
}

interface Post {
  content: string;
  topic?: string;
  type: "announcement" | "diagnostic";
  avatarUrl: string;
  standard?: string;
  isGenerating?: boolean;
  previewFile?: string;
  assessmentId?: string;
}

interface AssessmentConfig {
  bloomsLevels: string[];
  questionTypes: string[];
  difficulty: "easy" | "medium" | "hard";
  numQuestions: number;
}


export default function ClassPage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postType, setPostType] = useState<"announcement" | "diagnostic">(
    "announcement"
  );
  const [selectedStandard, setSelectedStandard] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Configuration state
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>({
    bloomsLevels: ["remember", "understand", "apply"],
    questionTypes: ["multiple_choice", "fill_blank"],
    difficulty: "medium",
    numQuestions: 5,
  });
  const fabRef = useRef(null);
  const router = useRouter()


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
    router.push('/dashboard')

  };

  const generateDiagnosticAssessment = async (
    standard: Standard,
    topic: string,
    content: string
  ): Promise<any> => {
    try {
      // Send the assessment configuration instead of a prompt
      const response = await fetch("/api/generate/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Send the config data that your route expects
          bloomsLevels: assessmentConfig.bloomsLevels,
          questionTypes: assessmentConfig.questionTypes,
          difficulty: assessmentConfig.difficulty,
          numQuestions: assessmentConfig.numQuestions,
          // Add the context data
          standard: {
            code: standard.code,
            description: standard.description,
            grade: standard.grade,
            unitTitle: standard.unitTitle
          },
          topic: topic,
          instructions: content
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate assessment");
      }
  
      const data = await response.json();
      return JSON.parse(data.assessment); // Parse the JSON string returned by OpenAI
    } catch (error) {
      console.error("Error generating assessment:", error);
      throw error;
    }
  };

  const savePreviewFile = async (
    assessment: any,
    postId: string
  ): Promise<string> => {
    const fileName = `diagnostic_${assessment.assessment.standard.code.replace(
      /\./g,
      "_"
    )}_${postId}.json`;

    try {
      // Save to public/previews directory
      const response = await fetch("/api/save-preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName,
          data: assessment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preview file");
      }

      const result = await response.json();
      return result.filePath;
    } catch (error) {
      console.error("Error saving preview file:", error);
      throw error;
    }
  };

  const handleCreateDiagnostic = async () => {
    const content = (
      document.getElementById("new-post") as HTMLTextAreaElement
    )?.value.trim();
    const topic = (
      document.getElementById("post-topic") as HTMLInputElement
    )?.value.trim();

    if (!content || !selectedStandard) {
      alert("Please fill in all required fields");
      return;
    }

    const selectedStandardObj = standards.find(
      (s) => s.code === selectedStandard
    );
    if (!selectedStandardObj) {
      alert("Selected standard not found");
      return;
    }

    const postId = `post_${Date.now()}`;

    // Create post immediately with loading state
    const newPost: Post = {
      content,
      type: "diagnostic",
      topic,
      avatarUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=${Math.floor(
        Math.random() * 1000
      )}`,
      standard: selectedStandard,
      isGenerating: true,
      assessmentId: postId,
    };

    setPosts([newPost, ...posts]);
    setIsGenerating(true);
    setShowModal(false);

    try {
      // Generate assessment using AI
      console.log("Generating assessment for standard:", selectedStandardObj);
      const assessment = await generateDiagnosticAssessment(
        selectedStandardObj,
        topic,
        content
      );

      // Log the assessment data to console
      console.log("🎯 FULL ASSESSMENT DATA:", assessment);

      // Store assessment in sessionStorage for preview (since we can't save files)
      const assessmentKey = `assessment_${postId}`;
      sessionStorage.setItem(
        assessmentKey,
        JSON.stringify(assessment, null, 2)
      );

      // Update the post to show completion with preview data
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.assessmentId === postId
            ? {
                ...post,
                isGenerating: false,
                previewFile: assessmentKey, // Use the sessionStorage key as the "file"
              }
            : post
        )
      );

      console.log("✅ Assessment generated successfully!");
    } catch (error) {
      console.error("Failed to generate assessment:", error);
      // Update post to show error state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.assessmentId === postId ? { ...post, isGenerating: false } : post
        )
      );
      alert("Failed to generate assessment. Please try again.");
    } finally {
      setIsGenerating(false);
      // Clear form inputs
      const contentInput = document.getElementById(
        "new-post"
      ) as HTMLTextAreaElement;
      const topicInput = document.getElementById(
        "post-topic"
      ) as HTMLInputElement;
      if (contentInput) contentInput.value = "";
      if (topicInput) topicInput.value = "";
      setSelectedStandard("");
      setPostType("announcement");
    }
  };

  const handlePost = () => {
    if (postType === "diagnostic") {
      handleCreateDiagnostic();
      return;
    }

    const content = (
      document.getElementById("new-post") as HTMLTextAreaElement
    )?.value.trim();
    if (!content) return;

    const newPost: Post = {
      content,
      type: postType,
      avatarUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=${Math.floor(
        Math.random() * 1000
      )}`,
    };

    setPosts([newPost, ...posts]);
    setShowModal(false);

    // Clear form inputs
    const contentInput = document.getElementById(
      "new-post"
    ) as HTMLTextAreaElement;
    if (contentInput) contentInput.value = "";
  };


  const openAssignmentModal = () => {
    console.log("running")
    
    setShowModal(true)
  }

  const handleFabAction = (actionType) => {
    setFabMenuOpen(false);
    // Handle the action - you can replace these with actual functionality
    switch (actionType) {
      case "assignment":
        setPostType("diagnostic"); 
        setShowModal(true);
        break;
      case "student":
        console.log("Adding new student...");
        // Navigate to student addition or open modal
        break;
      case "announcement":
        console.log("Creating announcement...");
        setPostType("announcement"); 
        setShowModal(true);
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

      {showModal &&  
        <FeedUpdateModal  
        setShowModal={setShowModal}
        postType={postType}
        setPostType={setPostType}
        selectedStandard={selectedStandard}
        setSelectedStandard={setSelectedStandard}
        standards={standards}
        assessmentConfig={assessmentConfig}
        setAssessmentConfig={setAssessmentConfig}
        handlePost={handlePost}
        isGenerating={isGenerating}/>
        }
    </div>
  );
}