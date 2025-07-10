import React from "react";
import styles from "./FeedUpdate.module.css";

interface Standard {
  code: string;
  description: string;
  grade: number;
  unitTitle: string;
}

interface AssessmentConfig {
  bloomsLevels: string[];
  questionTypes: string[];
  difficulty: "easy" | "medium" | "hard";
  numQuestions: number;
}

interface FeedUpdateModalProps {
  setShowModal: (show: boolean) => void;
  postType: "announcement" | "diagnostic";
  setPostType: (type: "announcement" | "diagnostic") => void;
  selectedStandard: string;
  setSelectedStandard: (standard: string) => void;
  standards: Standard[];
  assessmentConfig: AssessmentConfig;
  setAssessmentConfig: React.Dispatch<React.SetStateAction<AssessmentConfig>>;
  handlePost: () => void;
  isGenerating: boolean;
}

export default function FeedUpdateModal({
  setShowModal,
  postType,
  setPostType,
  selectedStandard,
  setSelectedStandard,
  standards,
  assessmentConfig,
  setAssessmentConfig,
  handlePost,
  isGenerating,
}: FeedUpdateModalProps) {
  return (
    <div
      className={styles.modalOverlay}
      onClick={() => setShowModal(false)}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Create New Post</h3>
          <button
            className={styles.closeButton}
            onClick={() => setShowModal(false)}
          >
            ×
          </button>
        </div>

        <div className={styles.toggleButtons}>
          <button
            className={`${styles.toggleButton} ${
              postType === "announcement" ? styles.active : ""
            }`}
            onClick={() => setPostType("announcement")}
          >
            Announcement
          </button>
          <button
            className={`${styles.toggleButton} ${
              postType === "diagnostic" ? styles.active : ""
            }`}
            onClick={() => setPostType("diagnostic")}
          >
            Diagnostic
          </button>
        </div>

        {postType === "diagnostic" && (
          <div className={styles.diagnosticConfig}>
            {/* Standard Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Math Standard *</label>
              <select
                className={styles.select}
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                required
              >
                <option value="">Select a standard...</option>
                {standards.map((standard) => (
                  <option key={standard.code} value={standard.code}>
                    Grade {standard.grade} - {standard.code}:{" "}
                    {standard.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Input */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Topic/Focus Area</label>
              <input
                type="text"
                placeholder="e.g., Word problems, Visual representations"
                className={styles.input}
                id="post-topic"
              />
            </div>

            {/* AI Configuration */}
            <div className={styles.aiConfigPanel}>
              <h4 className={styles.configTitle}>AI Configuration</h4>

              {/* Bloom's Taxonomy */}
              <div className={styles.configSection}>
                <label className={styles.configLabel}>
                  Bloom's Taxonomy Levels:
                </label>
                <div className={styles.checkboxGrid}>
                  {[
                    "remember",
                    "understand",
                    "apply",
                    "analyze",
                    "evaluate",
                    "create",
                  ].map((level) => (
                    <label key={level} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={assessmentConfig.bloomsLevels.includes(level)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAssessmentConfig((prev) => ({
                              ...prev,
                              bloomsLevels: [...prev.bloomsLevels, level],
                            }));
                          } else {
                            setAssessmentConfig((prev) => ({
                              ...prev,
                              bloomsLevels: prev.bloomsLevels.filter(
                                (l) => l !== level
                              ),
                            }));
                          }
                        }}
                      />
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Question Types */}
              <div className={styles.configSection}>
                <label className={styles.configLabel}>Question Types:</label>
                <div className={styles.checkboxGrid}>
                  {[
                    { value: "multiple_choice", label: "Multiple Choice" },
                    { value: "open_ended", label: "Open Ended" },
                    { value: "fill_blank", label: "Fill in the Blank" },
                    { value: "matching", label: "Matching" },
                    { value: "true_false", label: "True/False" },
                  ].map((type) => (
                    <label key={type.value} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={assessmentConfig.questionTypes.includes(
                          type.value
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAssessmentConfig((prev) => ({
                              ...prev,
                              questionTypes: [
                                ...prev.questionTypes,
                                type.value,
                              ],
                            }));
                          } else {
                            setAssessmentConfig((prev) => ({
                              ...prev,
                              questionTypes: prev.questionTypes.filter(
                                (t) => t !== type.value
                              ),
                            }));
                          }
                        }}
                      />
                      {type.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty and Number of Questions */}
              <div className={styles.configRow}>
                <div className={styles.configItem}>
                  <label className={styles.configLabel}>Difficulty:</label>
                  <select
                    className={styles.select}
                    value={assessmentConfig.difficulty}
                    onChange={(e) =>
                      setAssessmentConfig((prev) => ({
                        ...prev,
                        difficulty: e.target.value as "easy" | "medium" | "hard",
                      }))
                    }
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className={styles.configItem}>
                  <label className={styles.configLabel}>Questions:</label>
                  <input
                    type="number"
                    min="3"
                    max="15"
                    className={styles.numberInput}
                    value={assessmentConfig.numQuestions}
                    onChange={(e) =>
                      setAssessmentConfig((prev) => ({
                        ...prev,
                        numQuestions: parseInt(e.target.value) || 5,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

       {postType === "announcement" && <div className={styles.formGroup}>
          <label className={styles.label}>
              Announcement
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Write your announcement..."
            rows={4}
            id="new-post"
            required
          />
        </div>
}
        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className={styles.postButton}
            onClick={handlePost}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className={styles.buttonSpinner}></div>
                Generating...
              </>
            ) : postType === "diagnostic" ? (
              "Generate Assessment"
            ) : (
              "Post Announcement"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}