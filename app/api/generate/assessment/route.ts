import { NextRequest, NextResponse } from 'next/server';

interface AssessmentConfig {
  bloomsLevels: string[];
  questionTypes: string[];
  difficulty: string;
  numQuestions: number;
  standard: {
    code: string;
    description: string;
    grade: number;
    unitTitle: string;
  };
  topic: string;
  instructions: string;
}

export async function POST(request: NextRequest) {
  console.log('API route called');
  
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('OpenAI API key not found in environment variables');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  console.log('API key found:', apiKey.substring(0, 7) + '...');

  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const config: AssessmentConfig = body;
    
    // Validate the config
    if (!config.bloomsLevels || !config.questionTypes || !config.difficulty || !config.numQuestions || !config.standard) {
      return NextResponse.json({ error: 'Invalid configuration provided' }, { status: 400 });
    }
    
    // Create a comprehensive prompt based on your config
    const prompt = `Create a comprehensive diagnostic assessment for the following math standard:

Standard: ${config.standard.code} - ${config.standard.description}
Grade Level: ${config.standard.grade}
Unit: ${config.standard.unitTitle}
Topic Focus: ${config.topic || "General standard coverage"}
Teacher Instructions: ${config.instructions}

Assessment Requirements:
- Number of questions: ${config.numQuestions}
- Difficulty level: ${config.difficulty}
- Bloom's taxonomy levels to include: ${config.bloomsLevels.join(", ")}
- Question types to include: ${config.questionTypes.join(", ")}

Please generate a complete diagnostic assessment in JSON format with the following structure:
{
  "assessment": {
    "id": "unique-assessment-id",
    "title": "Descriptive title for the assessment",
    "standard": {
      "code": "${config.standard.code}",
      "description": "${config.standard.description}",
      "grade": ${config.standard.grade},
      "unitTitle": "${config.standard.unitTitle}"
    },
    "metadata": {
      "createdAt": "current timestamp",
      "difficulty": "${config.difficulty}",
      "estimatedTime": "estimated minutes",
      "totalQuestions": ${config.numQuestions},
      "bloomsLevels": ${JSON.stringify(config.bloomsLevels)},
      "questionTypes": ${JSON.stringify(config.questionTypes)}
    },
    "learningObjectives": ["array of 3-5 specific learning objectives"],
    "scaffoldingInstructions": {
      "beforeAssessment": ["array of 3-4 preparation instructions for teachers"],
      "duringAssessment": ["array of 3-4 support strategies during assessment"],
      "afterAssessment": ["array of 3-4 follow-up actions based on results"]
    },
    "questions": [
      // Generate ${config.numQuestions} questions following this format:
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

Make sure all questions are grade-appropriate, align with the standard, and include comprehensive scaffolding support for teachers.`;

    console.log('Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert educational assessment generator. Generate comprehensive, grade-appropriate diagnostic assessments in the exact JSON format requested." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      if (response.status === 401) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 500 });
      } else if (response.status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 500 });
      } else if (response.status === 402) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 500 });
      }
      
      return NextResponse.json({ error: `OpenAI API error: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');
    
    const generatedContent = data.choices[0].message.content;
    
    return NextResponse.json({ 
      success: true, 
      assessment: generatedContent,
      config: config 
    });
    
  } catch (error) {
    console.error('Assessment generation error:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: `Failed to generate assessment: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
      { status: 500 }
    );
  }
}