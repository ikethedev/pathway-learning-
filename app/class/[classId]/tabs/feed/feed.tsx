"use client";
import { useState, useEffect } from "react";
import styles from "./feed.module.css";
import { useModal } from "../../../../context/updatefeed";
import FeedUpdateModal from "../../../components/FeedUpdate/FeedUpdate";
import { mathStandardsData } from "../../../../data/mathStandardsData";


export default function Feed() {
  const {
    // Modal state
    showFeedModal,
    setShowFeedModal,
    postType,
    setPostType,
    selectedStandard,
    setSelectedStandard,
    standards,
    assessmentConfig,
    setAssessmentConfig,
    isGenerating,
    
    // Posts state
    posts,
    
    // Handlers
    handleFeedPost,
    openPreviewFile,
    getStandardLabel,
  } = useModal();

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
    <div className={styles.container}>
      <div className={styles.postCard} onClick={() => setShowFeedModal(true)}>
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
                  <p>Generating your diagnostic assessment...</p>
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
  );
}