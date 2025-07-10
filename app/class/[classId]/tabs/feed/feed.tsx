'useClient'
import { useState, useEffect } from "react";
import styles from "./feed.module.css";
import { mathStandardsData } from "../../../../data/mathStandardsData";
import FeedUpdateModal from "../../../components/FeedUpdate/FeedUpdate";

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

export default function Feed() {
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

  useEffect(() => {
    // Extract all standards with detailed objectives from mathStandardsData
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
- Bloom's taxonomy levels to include: ${assessmentConfig.bloomsLevels.join(
      ", "
    )}
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
      // Generate ${
        assessmentConfig.numQuestions
      } questions following this format:
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

  // Update the handleCreateDiagnostic function in feed.tsx

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

  // Update the openPreviewFile function
  const openPreviewFile = (assessmentKey: string) => {
    // Get assessment from sessionStorage and display in new window
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

  const getStandardLabel = (standardCode: string): string => {
    const standard = standards.find((s) => s.code === standardCode);
    return standard
      ? `${standard.code}: ${standard.description}`
      : standardCode;
  };

  return (
    <div className={styles.container}>
      <div className={styles.postCard} onClick={() => setShowModal(true)}>
        <p className={styles.prompt}>
          Make an announcement or create a diagnostic assessment...
        </p>
      </div>

      {posts.map((post, index) => (
        <div key={index} className={styles.post}>
          <div className={styles.postHeader}>
            <img src={post.avatarUrl} className={styles.avatar} alt="avatar" />
            <div className={styles.postContent}>
              <p className={styles.topic}>
                {post.type === "diagnostic"
                  ? `Diagnostic: ${post.topic || "Assessment"}`
                  : "Announcement"}
              </p>
              <p className={styles.content}>{post.content}</p>

              {post.standard && (
                <p className={styles.standardTag}>
                  Standard: {getStandardLabel(post.standard)}
                </p>
              )}

              {post.isGenerating && (
                <div className={styles.loadingState}>
                  <div className={styles.spinner}></div>
                  <p> generating your diagnostic assessment...</p>
                  <p className={styles.loadingSubtext}>
                    This may take 30-60 seconds
                  </p>
                </div>
              )}

              {post.previewFile && !post.isGenerating && (
                <div className={styles.assessmentComplete}>
                  <div className={styles.successMessage}>
                    <span className={styles.successIcon}>✅</span>
                    <strong>Assessment Generated Successfully!</strong>
                  </div>

                  <div className={styles.previewActions}>
                    <button
                      className={styles.previewButton}
                      onClick={() => openPreviewFile(post.previewFile!)}
                    >
                      View Preview File
                    </button>
                    <button className={styles.editButton}>
                      ✏️ Edit Assessment
                    </button>
                    <button className={styles.deployButton}>
                      🚀 Deploy to Students
                    </button>
                  </div>

                  <p className={styles.fileInfo}>
                    Preview saved to: <code>{post.previewFile}</code>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {showModal && (
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
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
}
