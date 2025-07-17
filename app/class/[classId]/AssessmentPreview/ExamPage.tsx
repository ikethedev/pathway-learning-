'use client';

import { useState } from 'react';
import styles from './ExamPage.module.css';

interface Question {
  id: string;
  type: 'multiple_choice';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  hints?: string[];
}

interface ExamData {
  id: string;
  title: string;
  subtitle: string;
  totalQuestions: number;
  estimatedTime: number;
  questions: Question[];
}

const ExamPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds

  // Sample exam data
  const examData: ExamData = {
    id: 'sample-exam',
    title: 'Mathematics Assessment',
    subtitle: 'Grade 6 - Statistics and Data Analysis',
    totalQuestions: 5,
    estimatedTime: 30,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What is the best measure of center for a symmetrical distribution?',
        options: ['Mean', 'Median', 'Mode', 'Range'],
        correctAnswer: 0,
        explanation: 'For symmetrical distributions, the mean provides the most accurate representation of the center.',
        hints: ['Think about how data is distributed around the center']
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        question: 'Which measure of variability is most affected by outliers?',
        options: ['Range', 'Interquartile Range', 'Standard Deviation', 'Variance'],
        correctAnswer: 0,
        explanation: 'Range is calculated using the minimum and maximum values, making it highly sensitive to outliers.',
        hints: ['Consider which measure uses the extreme values']
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        question: 'In a right-skewed distribution, which relationship is typically true?',
        options: ['Mean < Median < Mode', 'Mode < Median < Mean', 'Median < Mean < Mode', 'Mean = Median = Mode'],
        correctAnswer: 1,
        explanation: 'In right-skewed distributions, the tail extends to the right, pulling the mean higher than the median.',
        hints: ['Think about how the tail affects the mean']
      },
      {
        id: 'q4',
        type: 'multiple_choice',
        question: 'What does a standard deviation of 0 indicate?',
        options: ['High variability', 'All values are the same', 'Normal distribution', 'Outliers are present'],
        correctAnswer: 1,
        explanation: 'A standard deviation of 0 means there is no variability - all data points are identical.',
        hints: ['Consider what happens when there is no spread in the data']
      },
      {
        id: 'q5',
        type: 'multiple_choice',
        question: 'Which measure is least affected by extreme values?',
        options: ['Mean', 'Median', 'Range', 'Standard Deviation'],
        correctAnswer: 1,
        explanation: 'The median is the middle value and is not influenced by extreme values at either end.',
        hints: ['Think about positional measures versus calculated measures']
      }
    ]
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    examData.questions.forEach((question, index) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return (correct / examData.questions.length) * 100;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = examData.questions[currentQuestion];

  if (showResults) {
    return (
      <div className={styles.examContainer}>
        <div className={styles.resultsHeader}>
          <h1 className={styles.resultsTitle}>Exam Results</h1>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreValue}>{calculateScore().toFixed(1)}%</span>
            <span className={styles.scoreLabel}>Final Score</span>
          </div>
        </div>
        
        <div className={styles.resultsSummary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Questions Answered:</span>
            <span className={styles.summaryValue}>{Object.keys(answers).length}/{examData.totalQuestions}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Correct Answers:</span>
            <span className={styles.summaryValue}>{examData.questions.filter(q => answers[q.id] === q.correctAnswer).length}</span>
          </div>
        </div>

        <div className={styles.questionReview}>
          {examData.questions.map((question, index) => (
            <div key={question.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewNumber}>Question {index + 1}</span>
                <span className={`${styles.reviewStatus} ${answers[question.id] === question.correctAnswer ? styles.correct : styles.incorrect}`}>
                  {answers[question.id] === question.correctAnswer ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <p className={styles.reviewQuestion}>{question.question}</p>
              <div className={styles.reviewAnswers}>
                <p className={styles.reviewAnswer}>
                  <strong>Your Answer:</strong> {question.options[answers[question.id]] || 'Not answered'}
                </p>
                <p className={styles.reviewAnswer}>
                  <strong>Correct Answer:</strong> {question.options[question.correctAnswer]}
                </p>
              </div>
              {question.explanation && (
                <p className={styles.reviewExplanation}>{question.explanation}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.examContainer}>
      <div className={styles.examHeader}>
        <h1 className={styles.examTitle}>{examData.title}</h1>
        <p className={styles.examSubtitle}>{examData.subtitle}</p>
        <div className={styles.examInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Questions:</span>
            <span className={styles.infoValue}>{examData.totalQuestions}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Time:</span>
            <span className={styles.infoValue}>{examData.estimatedTime} minutes</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Time Remaining:</span>
            <span className={styles.infoValue}>{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>

      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${((currentQuestion + 1) / examData.totalQuestions) * 100}%` }}
        />
      </div>

      <div className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <span className={styles.questionNumber}>Question {currentQuestion + 1} of {examData.totalQuestions}</span>
        </div>
        
        <h2 className={styles.questionText}>{currentQ.question}</h2>
        
        <div className={styles.optionsContainer}>
          {currentQ.options.map((option, index) => (
            <label key={index} className={styles.optionLabel}>
              <input
                type="radio"
                name={`question-${currentQ.id}`}
                value={index}
                checked={answers[currentQ.id] === index}
                onChange={() => handleAnswerSelect(currentQ.id, index)}
                className={styles.optionInput}
              />
              <span className={styles.optionText}>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.navigationButtons}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`${styles.navButton} ${styles.prevButton}`}
        >
          Previous
        </button>
        
        {currentQuestion < examData.questions.length - 1 ? (
          <button
            onClick={handleNext}
            className={`${styles.navButton} ${styles.nextButton}`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className={`${styles.navButton} ${styles.submitButton}`}
          >
            Submit Exam
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamPage;