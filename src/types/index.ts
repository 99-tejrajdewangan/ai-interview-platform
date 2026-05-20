export interface Candidate {
  fullName: string;
  email: string;
  role: string;
  experienceLevel: string;
  skills: string[];
  resumeUrl?: string;
}

export interface Question {
  id: number;
  text: string;
  type: 'technical' | 'behavioral' | 'coding';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
}

export interface InterviewState {
  currentQuestion: number;
  totalQuestions: number;
  answers: Map<number, string>;
  isRecording: boolean;
  status: 'not-started' | 'in-progress' | 'completed';
  timeSpent: number;
}

export interface CodingQuestion {
  id: number;
  title: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  starterCode: string;
  language: string;
}