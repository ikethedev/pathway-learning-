
export interface LearningObjective {
    code: string;
    description: string;
  }
  
  export interface Unit {
    unitNumber: number;
    title: string;
    semester: number;
    duration: string;
    bigIdea: string;
    standards: string[];
    learningObjectives: string[];
    description: string;
    detailedObjectives?: LearningObjective[];
  }
  
  export interface GradeOverview {
    title: string;
    implementation: string;
    totalUnits: number;
    semesters: number;
    grade: number;
  }
  
  export interface GradeCurriculum {
    overview: GradeOverview;
    units: Unit[];
  }
  
  export interface MathStandards {
    [key: string]: GradeCurriculum;
  }