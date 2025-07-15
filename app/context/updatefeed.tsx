// contexts/ModalContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mathStandardsData } from '../data/mathStandardsData';

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

interface ModalContextType {
  // Feed Modal State
  showFeedModal: boolean;
  setShowFeedModal: (show: boolean) => void;
  postType: "announcement" | "diagnostic";
  setPostType: (type: "announcement" | "diagnostic") => void;
  selectedStandard: string;
  setSelectedStandard: (standard: string) => void;
  standards: Standard[];
  setStandards: (standards: Standard[]) => void;
  assessmentConfig: AssessmentConfig;
  setAssessmentConfig: React.Dispatch<React.SetStateAction<AssessmentConfig>>;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  
  // Feed Posts State
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  
  // Assignment Modal State
  showAssignmentModal: boolean;
  setShowAssignmentModal: (show: boolean) => void;
  
  // Handlers
  handleFeedPost: () => void;
  handleCreateDiagnostic: () => Promise<void>;
  handleAssignmentAdd: (assignment: any) => void;
  openPreviewFile: (assessmentKey: string) => void;
  getStandardLabel: (standardCode: string) => string;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // Feed Modal State
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [postType, setPostType] = useState<"announcement" | "diagnostic">("announcement");
  const [selectedStandard, setSelectedStandard] = useState<string>("");
  const [standards, setStandards] = useState<Standard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Feed Posts State
  const [posts, setPosts] = useState<Post[]>([]);
  
  // Assignment Modal State
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  
  // AI Configuration state
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>({
    bloomsLevels: ["remember", "understand", "apply"],
    questionTypes: ["multiple_choice", "fill_blank"],
    difficulty: "medium",
    numQuestions: 5,
  });

  // Initialize standards on mount
  useEffect(() => {
    const extractedStandards: Standard[] = [];

    Object.entries(mathStandardsData).forEach(([gradeKey, gradeCurriculum]) => {
      gradeCurriculum.units.forEach((unit) => {
        if (unit.detailedObjectives) {
          unit.detailedObjectives.forEach((objective) => {
            extractedStandards.push({
              code: objective.code,
              description: objective.description,
              grade: gradeCurriculum.overview.grade,
              unitTitle: unit.title,
            });
          });
        }
      });
    });

    // Sort by grade then by code
    extractedStandards.sort((a, b) => {
      if (a.grade !== b.grade) {
        return a.grade - b.grade;
      }
      return a.code.localeCompare(b.code);
    });

    setStandards(extractedStandards);
  }, []);

  // Generate assessment prompt
  const generateAssessmentPrompt = (
    standard: Standard,
    topic: string,
    content: string
  ): string => {
    return `
Create a comprehensive diagnostic assessment for the following math standard:

Standard: ${standard.code} - ${standard.description}
Grade Level: ${standard.grade}
Unit: ${standard.unitTitle}
Topic Focus: ${topic || "General standard coverage"}
Teacher Instructions: ${content}

Assessment Requirements:
- Number of questions: ${assessmentConfig.numQuestions}
- Difficulty level: ${assessmentConfig.difficulty}
- Bloom's taxonomy levels to include: ${assessmentConfig.bloomsLevels.join(", ")}
- Question types to include: ${assessmentConfig.questionTypes.join(", ")}

Please generate a complete diagnostic assessment in JSON format with the following structure:
{
  "assessment": {
    "id": "unique-assessment-id",
    "title": "Descriptive title for the assessment",
    "standard": {
      "code": "${standard.code}",
      "description": "${standard.description}",
      "grade": ${standard.grade},
      "unitTitle": "${standard.unitTitle}"
    },
    "metadata": {
      "createdAt": "current timestamp",
      "difficulty": "${assessmentConfig.difficulty}",
      "estimatedTime": "estimated minutes",
      "totalQuestions": ${assessmentConfig.numQuestions},
      "bloomsLevels": ${JSON.stringify(assessmentConfig.bloomsLevels)},
      "questionTypes": ${JSON.stringify(assessmentConfig.questionTypes)}
    },
    "learningObjectives": ["array of 3-5 specific learning objectives"],
    "scaffoldingInstructions": {
      "beforeAssessment": ["array of 3-4 preparation instructions for teachers"],
      "duringAssessment": ["array of 3-4 support strategies during assessment"],
      "afterAssessment": ["array of 3-4 follow-up actions based on results"]
    },
    "questions": [
      // Generate ${assessmentConfig.numQuestions} questions following this format:
      {
        "id": "q1",
        "type": "question_type_from_config",
        "bloomsLevel": "level_from_config",
        "difficulty": "easy|medium|hard",
        "question": "The actual question text",
        "options": [/* for multiple choice */],
        "correctAnswer": "for fill_blank or short_answer",
        "acceptableAnswers": ["array of acceptable variations"],
        "explanation": "Why this is the correct answer",
        "hints": ["array of progressive hints"],
        "scaffolding": {
          "visual": "description of visual aid needed",
          "manipulation": "description of manipulatives to use",
          "verbal": "suggested verbal prompts or questions"
        }
      }
    ],
    "reportingData": {
      "skillsAssessed": ["array of specific skills being measured"],
      "masteryThresholds": {
        "Deep Understanding": 90,
        "proficient": 75,
        "approaching": 50,
        "need support": 25
      },
      "nextSteps": {
        "proficient": "what to do for students who master the content",
        "approaching": "what to do for students approaching mastery",
        "below": "what to do for students below expectations"
      }
    }
  }
}

Make sure all questions are grade-appropriate, align with the standard, and include comprehensive scaffolding support for teachers.
`;
  };

  // Generate diagnostic assessment
  const generateDiagnosticAssessment = async (
    standard: Standard,
    topic: string,
    content: string
  ): Promise<any> => {
    try {
      const response = await fetch("/api/generate/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bloomsLevels: assessmentConfig.bloomsLevels,
          questionTypes: assessmentConfig.questionTypes,
          difficulty: assessmentConfig.difficulty,
          numQuestions: assessmentConfig.numQuestions,
          standard: {
            code: standard.code,
            description: standard.description,
            grade: standard.grade,
            unitTitle: standard.unitTitle,
          },
          topic: topic,
          instructions: content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate assessment");
      }

      const data = await response.json();
      return JSON.parse(data.assessment);
    } catch (error) {
      console.error("Error generating assessment:", error);
      throw error;
    }
  };

  // Handle creating diagnostic assessment
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
    setShowFeedModal(false);

    try {
      console.log("Generating assessment for standard:", selectedStandardObj);
      const assessment = await generateDiagnosticAssessment(
        selectedStandardObj,
        topic,
        content
      );

      console.log("🎯 FULL ASSESSMENT DATA:", assessment);

      // Store assessment in sessionStorage for preview
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
                previewFile: assessmentKey,
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

  // Handle regular feed post
  const handleFeedPost = () => {
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
    setShowFeedModal(false);

    // Clear form inputs
    const contentInput = document.getElementById(
      "new-post"
    ) as HTMLTextAreaElement;
    if (contentInput) contentInput.value = "";
  };

  // Open preview file
  const openPreviewFile = (assessmentKey: string) => {
    const assessmentData = sessionStorage.getItem(assessmentKey);
    if (assessmentData) {
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
        <html>
          <head>
            <title>Assessment Preview</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
              .download-btn { 
                background: #007bff; 
                color: white; 
                padding: 10px 20px; 
                border: none; 
                border-radius: 5px; 
                cursor: pointer; 
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <h1>Diagnostic Assessment Preview</h1>
            <button class="download-btn" onclick="downloadAssessment()">Download JSON</button>
            <pre>${assessmentData}</pre>
            <script>
              function downloadAssessment() {
                const data = ${assessmentData};
                const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'diagnostic-assessment.json';
                a.click();
                URL.revokeObjectURL(url);
              }
            </script>
          </body>
        </html>
      `);
      }
    } else {
      alert("Assessment data not found");
    }
  };

  // Get standard label
  const getStandardLabel = (standardCode: string): string => {
    const standard = standards.find((s) => s.code === standardCode);
    return standard
      ? `${standard.code}: ${standard.description}`
      : standardCode;
  };

  // Assignment handler placeholder
  const handleAssignmentAdd = (assignment: any) => {
    console.log("Assignment add handler - to be implemented by consuming component");
  };

  const value: ModalContextType = {
    // Feed Modal State
    showFeedModal,
    setShowFeedModal,
    postType,
    setPostType,
    selectedStandard,
    setSelectedStandard,
    standards,
    setStandards,
    assessmentConfig,
    setAssessmentConfig,
    isGenerating,
    setIsGenerating,
    
    // Feed Posts State
    posts,
    setPosts,
    
    // Assignment Modal State
    showAssignmentModal,
    setShowAssignmentModal,
    
    // Handlers
    handleFeedPost,
    handleCreateDiagnostic,
    handleAssignmentAdd,
    openPreviewFile,
    getStandardLabel,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};