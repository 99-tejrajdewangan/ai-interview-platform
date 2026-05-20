import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import type { Candidate, InterviewState, Question } from "../types";

interface InterviewContextType {
  candidate: Candidate | null;
  setCandidate: (candidate: Candidate) => void;
  interviewState: InterviewState;
  setInterviewState: (state: InterviewState) => void;
  questions: Question[];
  currentQuestion: Question | null;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitAnswer: (answer: string) => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined,
);

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Tell me about your experience with React and modern frontend frameworks.",
    type: "technical",
    difficulty: "Medium",
    timeLimit: 120,
  },
  {
    id: 2,
    text: "How do you handle state management in large-scale applications?",
    type: "technical",
    difficulty: "Hard",
    timeLimit: 120,
  },
  {
    id: 3,
    text: "Describe a challenging bug you encountered and how you solved it.",
    type: "behavioral",
    difficulty: "Medium",
    timeLimit: 90,
  },
  {
    id: 4,
    text: "What's your approach to writing clean and maintainable code?",
    type: "technical",
    difficulty: "Easy",
    timeLimit: 90,
  },
  {
    id: 5,
    text: "How do you stay updated with the latest web technologies?",
    type: "behavioral",
    difficulty: "Easy",
    timeLimit: 60,
  },
];

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [interviewState, setInterviewState] = useState<InterviewState>({
    currentQuestion: 0,
    totalQuestions: mockQuestions.length,
    answers: new Map(),
    isRecording: false,
    status: "not-started",
    timeSpent: 0,
  });

  const currentQuestion =
    interviewState.currentQuestion < mockQuestions.length
      ? mockQuestions[interviewState.currentQuestion]
      : null;

  const nextQuestion = () => {
    if (interviewState.currentQuestion < mockQuestions.length - 1) {
      setInterviewState({
        ...interviewState,
        currentQuestion: interviewState.currentQuestion + 1,
      });
    } else {
      setInterviewState({
        ...interviewState,
        status: "completed",
      });
    }
  };

  const previousQuestion = () => {
    if (interviewState.currentQuestion > 0) {
      setInterviewState({
        ...interviewState,
        currentQuestion: interviewState.currentQuestion - 1,
      });
    }
  };

  const submitAnswer = (answer: string) => {
    const newAnswers = new Map(interviewState.answers);
    newAnswers.set(interviewState.currentQuestion, answer);
    setInterviewState({
      ...interviewState,
      answers: newAnswers,
    });
  };

  return (
    <InterviewContext.Provider
      value={{
        candidate,
        setCandidate,
        interviewState,
        setInterviewState,
        questions: mockQuestions,
        currentQuestion,
        nextQuestion,
        previousQuestion,
        submitAnswer,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
}
