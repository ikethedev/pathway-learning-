import { NextApiRequest, NextApiResponse } from 'next';
import { mathStandardsData } from '../data/mathStandardsData';

interface StandardSet {
  id: string;
  title: string;
  subject?: string;
  educationLevels?: string[];
}

interface StandardsResponse {
  standardSets: StandardSet[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<StandardsResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const standardSets: StandardSet[] = [];

    // Convert your math standards data to the format expected by your component
    Object.entries(mathStandardsData).forEach(([gradeKey, gradeCurriculum]) => {
      gradeCurriculum.units.forEach(unit => {
        // Add each unit as a standard set
        standardSets.push({
          id: `${gradeKey}-unit-${unit.unitNumber}`,
          title: `Grade ${gradeCurriculum.overview.grade} - Unit ${unit.unitNumber}: ${unit.title}`,
          subject: 'Mathematics',
          educationLevels: [`Grade ${gradeCurriculum.overview.grade}`]
        });

        // Add individual learning objectives as standards if available
        if (unit.detailedObjectives) {
          unit.detailedObjectives.forEach(objective => {
            standardSets.push({
              id: objective.code,
              title: `${objective.code}: ${objective.description}`,
              subject: 'Mathematics',
              educationLevels: [`Grade ${gradeCurriculum.overview.grade}`]
            });
          });
        } else if (unit.learningObjectives) {
          // Fallback to learning objectives array if detailed objectives not available
          unit.learningObjectives.forEach(objectiveCode => {
            standardSets.push({
              id: objectiveCode,
              title: `${objectiveCode}: Learning Objective`,
              subject: 'Mathematics',
              educationLevels: [`Grade ${gradeCurriculum.overview.grade}`]
            });
          });
        }
      });
    });

    // Sort standards by grade level and unit number for better organization
    standardSets.sort((a, b) => {
      const gradeA = parseInt(a.educationLevels?.[0]?.replace('Grade ', '') || '0');
      const gradeB = parseInt(b.educationLevels?.[0]?.replace('Grade ', '') || '0');
      
      if (gradeA !== gradeB) {
        return gradeA - gradeB;
      }
      
      return a.title.localeCompare(b.title);
    });

    console.log(`Successfully loaded ${standardSets.length} standards`);
    res.status(200).json({ standardSets });
  } catch (error) {
    console.error('Error processing standards:', error);
    res.status(500).json({ error: 'Failed to load standards' });
  }
}