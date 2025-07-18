// data/mathStandardsData.ts
export interface Standard {
    code: string;
    description: string;
  }
  
  export interface DetailedObjective {
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
    detailedObjectives?: DetailedObjective[];
  }
  
  export interface GradeOverview {
    title: string;
    implementation: string;
    totalUnits: number;
    semesters: number;
    grade: number;
  }
  
  export interface GradeData {
    overview: GradeOverview;
    units: Unit[];
  }
  
  export const mathStandardsData: Record<string, GradeData> = {
    grade6: {
      overview: {
        title: "Grade 6 Mathematics Curriculum Map",
        implementation: "Fall 2023",
        totalUnits: 9,
        semesters: 2,
        grade: 6
      },
      units: [
        {
          unitNumber: 1,
          title: "Exploring Real-life Phenomena through Statistics",
          semester: 1,
          duration: "4-5 weeks",
          bigIdea: "Numerical Reasoning",
          standards: ["6.NR.2", "6.MP.1-8"],
          learningObjectives: ["6.NR.2.1", "6.NR.2.2", "6.NR.2.3", "6.NR.2.4", "6.NR.2.5", "6.NR.2.6"],
          description: "Students will be introduced to the study of statistics by experiencing how to design simple experiments and collect data. Students begin with learning what constitutes a statistical question.",
          detailedObjectives: [
            {
              code: "6.NR.2.1",
              description: "Describe and interpret the center of the distribution by the equal share value (mean)."
            },
            {
              code: "6.NR.2.2",
              description: "Summarize categorical and quantitative (numerical) data sets in relation to the context: display the distributions of quantitative (numerical) data in plots on a number line, including dot plots, histograms, and box plots and display the distribution of categorical data using bar graphs."
            },
            {
              code: "6.NR.2.3",
              description: "Interpret numerical data to answer a statistical investigative question created. Describe the distribution of a quantitative (numerical) variable collected, including its center, variability, and overall shape."
            },
            {
              code: "6.NR.2.4",
              description: "Design simple experiments and collect data. Use data gathered from realistic scenarios and simulations to determine quantitative measures of center (median and/or mean) and variability (interquartile range and range)."
            },
            {
              code: "6.NR.2.5",
              description: "Relate the choice of measures of center and variability to the shape of the data distribution and the context in which the data were gathered."
            },
            {
              code: "6.NR.2.6",
              description: "Describe the impact that inserting or deleting a data point has on the mean and the median of a data set. Create data displays using a dot plot or box plot to examine this impact."
            }
          ]
        },
        {
          unitNumber: 2,
          title: "Making Relevant Connections through Number System Fluency",
          semester: 1,
          duration: "3-4 weeks",
          bigIdea: "Numerical Reasoning",
          standards: ["6.NR.1", "6.NR.2", "6.MP.1-8"],
          learningObjectives: ["6.NR.1.1", "6.NR.1.2", "6.NR.1.3", "6.NR.2.1", "6.NR.2.3", "6.NR.2.4"],
          description: "Building on student knowledge and understanding of whole numbers and fractions from elementary school, students will begin working with number relationships to deepen their connection to fractions."
        },
        {
          unitNumber: 3,
          title: "Investigating Rate, Ratio and Proportional Reasoning",
          semester: 1,
          duration: "3-4 weeks",
          bigIdea: "Numerical Reasoning",
          standards: ["6.NR.4", "6.MP.1-8"],
          learningObjectives: ["6.NR.4.1", "6.NR.4.2", "6.NR.4.3", "6.NR.4.4", "6.NR.4.5", "6.NR.4.6", "6.NR.4.7"],
          description: "Students use computational skills (focusing on fractions) to solve problems in context. Students make connections to the classroom beyond the school day when they explore unit rate, ratios, and calculate percentages using proportional reasoning."
        },
        {
          unitNumber: 4,
          title: "Building Conceptual Understanding of Expressions",
          semester: 1,
          duration: "2-3 weeks",
          bigIdea: "Patterning & Algebraic Reasoning",
          standards: ["6.PAR.6", "6.MP.1-8"],
          learningObjectives: ["6.PAR.6.1", "6.PAR.6.2", "6.PAR.6.3", "6.PAR.6.4", "6.PAR.6.5"],
          description: "Students begin a more formal study of Algebra as they move from arithmetic experiences to algebraic representations. Students learn to translate verbal phrases and numeric situations into algebraic expressions."
        },
        {
          unitNumber: 5,
          title: "Exploring Real-life Phenomena through One-Step Equations and Inequalities",
          semester: 2,
          duration: "4-5 weeks",
          bigIdea: "Patterning & Algebraic Reasoning",
          standards: ["6.PAR.7", "6.MP.1-8"],
          learningObjectives: ["6.PAR.7.1", "6.PAR.7.2", "6.PAR.7.3", "6.PAR.7.4"],
          description: "Students will explore one-step equations and inequalities. Students will build their problem-solving stamina."
        },
        {
          unitNumber: 6,
          title: "Exploring Area and Volume",
          semester: 2,
          duration: "2-3 weeks",
          bigIdea: "Geometric & Spatial Reasoning",
          standards: ["6.GSR.5", "6.MP.1-8"],
          learningObjectives: ["6.GSR.5.1", "6.GSR.5.2", "6.GSR.5.3"],
          description: "Students extend their work with area and volume from simple figures in elementary school to composite figures, including those with sides of fractional lengths."
        },
        {
          unitNumber: 7,
          title: "Rational Explorations: Numbers and their Opposites",
          semester: 2,
          duration: "3-4 weeks",
          bigIdea: "Numerical Reasoning",
          standards: ["6.NR.3", "6.NR.2", "6.MP.1-8"],
          learningObjectives: ["6.NR.3.1", "6.NR.3.2", "6.NR.3.3", "6.NR.3.4", "6.NR.3.5", "6.NR.3.6", "6.NR.2.3", "6.NR.2.4"],
          description: "The importance of zero is emphasized in this exploration of numbers. Students will be introduced to numbers less than zero and use zero to identify a number and its opposite."
        },
        {
          unitNumber: 8,
          title: "Graphing Rational Numbers",
          semester: 2,
          duration: "2-3 weeks",
          bigIdea: "Patterning & Algebraic Reasoning",
          standards: ["6.PAR.8", "6.MP.1-8"],
          learningObjectives: ["6.PAR.8.1", "6.PAR.8.2", "6.PAR.8.3", "6.PAR.8.4"],
          description: "This unit extends student understanding of number lines into the four quadrants of the coordinate plane."
        },
        {
          unitNumber: 9,
          title: "Culminating Capstone Unit",
          semester: 2,
          duration: "1-2 weeks",
          bigIdea: "All Areas",
          standards: ["ALL COURSE STANDARDS", "6.MP.1-8"],
          learningObjectives: ["ALL ASSOCIATED LEARNING OBJECTIVES"],
          description: "The capstone unit applies content that has already been learned in previous interdisciplinary PBLs and units throughout the school year."
        }
      ]
    }, 
    grade7: {
      overview: {
        title: "Grade 7 Mathematics Curriculum Map",
        implementation: "Fall 2023",
        totalUnits: 6,
        semesters: 2,
        grade: 7
      },
      units: [
        {
          unitNumber: 1,
          title: "Making Relevant Connections within The Number System",
          semester: 1,
          duration: "5-6 weeks",
          bigIdea: "Numerical Reasoning",
          standards: ["7.NR.1", "7.MP.1-8"],
          learningObjectives: [
            "7.NR.1.1", "7.NR.1.2", "7.NR.1.3", "7.NR.1.4", "7.NR.1.5",
            "7.NR.1.6", "7.NR.1.7", "7.NR.1.8", "7.NR.1.9", "7.NR.1.10", "7.NR.1.11"
          ],
          description: "This unit builds upon the understanding of rational numbers developed in 6th grade, transitioning from exploring to ultimately formalizing rules for basic arithmetic operations with rational numbers.",
          detailedObjectives: [
            { code: "7.NR.1.1", description: "Show that a number and its opposite have a sum of 0 (are additive inverses). Describe situations in which opposite quantities combine to make 0." },
            { code: "7.NR.1.2", description: "Show and explain p + q as the number located a distance |q| from p, in the positive or negative direction, depending on whether q is positive or negative." },
            { code: "7.NR.1.3", description: "Represent addition and subtraction with rational numbers on a horizontal or a vertical number line diagram to solve real-life problems." },
            { code: "7.NR.1.4", description: "Show and explain subtraction of rational numbers as adding the additive inverse, p – q = p + (– q)." },
            { code: "7.NR.1.5", description: "Apply properties of operations, including part-whole reasoning, as strategies to add and subtract rational numbers." },
            { code: "7.NR.1.6", description: "Make sense of multiplication of rational numbers using realistic applications." },
            { code: "7.NR.1.7", description: "Show and explain that integers can be divided, assuming the divisor is not zero, and every quotient of integers is a rational number." },
            { code: "7.NR.1.8", description: "Represent the multiplication and division of integers using a variety of strategies and interpret products and quotients of rational numbers." },
            { code: "7.NR.1.9", description: "Apply properties of operations as strategies to solve multiplication and division problems involving rational numbers." },
            { code: "7.NR.1.10", description: "Convert rational numbers between forms to include fractions, decimal numbers and percents, using understanding of the part divided by the whole." },
            { code: "7.NR.1.11", description: "Solve multi-step contextual problems involving rational numbers, converting between forms as appropriate." }
          ]
        },
        {
          unitNumber: 2,
          title: "Reasoning with Expressions, Equations, and Inequalities",
          semester: 1,
          duration: "5-6 weeks",
          bigIdea: "Patterning & Algebraic Reasoning",
          standards: ["7.PAR.2", "7.PAR.3", "7.MP.1-8"],
          learningObjectives: ["7.PAR.2.1", "7.PAR.2.2", "7.PAR.3.1", "7.PAR.3.2"],
          description: "Students build on what was learned in previous grades regarding mathematical properties and use these conventions and properties of operations to rewrite equivalent expressions."
        },
        {
          unitNumber: 3,
          title: "Exploring Ratios and Proportional Relationships",
          semester: 1,
          duration: "8-9 weeks (split across semesters)",
          bigIdea: "Patterning & Algebraic Reasoning",
          standards: ["7.PAR.4", "7.MP.1-8"],
          learningObjectives: [
            "7.PAR.4.1", "7.PAR.4.2", "7.PAR.4.3", "7.PAR.4.4", "7.PAR.4.5",
            "7.PAR.4.6", "7.PAR.4.7", "7.PAR.4.8", "7.PAR.4.9", "7.PAR.4.10",
            "7.PAR.4.11", "7.PAR.4.12"
          ],
          description: "Building on knowledge and understanding of rate and unit concepts, students use graphs, tables, equations, and diagrams to recognize, represent, explain, and solve proportional relationships."
        },
        {
          unitNumber: 4,
          title: "Making Relevant Connections with Geometry",
          semester: 2,
          duration: "4-5 weeks",
          bigIdea: "Geometric & Spatial Reasoning",
          standards: ["7.GSR.5", "7.MP.1-8"],
          learningObjectives: [
            "7.GSR.5.1", "7.GSR.5.2", "7.GSR.5.3", "7.GSR.5.4",
            "7.GSR.5.5", "7.GSR.5.6", "7.GSR.5.7", "7.GSR.5.8"
          ],
          description: "Students will write and solve equations using facts involving measures of angles. Students will study circles and use proportional reasoning to understand the relationship between the diameter and circumference."
        },
        {
          unitNumber: 5,
          title: "Investigating Probability",
          semester: 2,
          duration: "4-5 weeks",
          bigIdea: "Probability Reasoning",
          standards: ["7.PR.6", "7.MP.1-8"],
          learningObjectives: [
            "7.PR.6.1", "7.PR.6.2", "7.PR.6.3", "7.PR.6.4", "7.PR.6.5", "7.PR.6.6"
          ],
          description: "Students will begin an exploration of probability and chance processes. Students will develop probability models to find the likelihood of simple events."
        },
        {
          unitNumber: 6,
          title: "Culminating Capstone Unit",
          semester: 2,
          duration: "1-2 weeks",
          bigIdea: "All Areas",
          standards: ["ALL STANDARDS", "7.MP.1-8"],
          learningObjectives: ["All associated learning objectives"],
          description: "The capstone unit applies content that has already been learned in previous interdisciplinary PBLs and units throughout the school year."
        }
      ]
    }
  };