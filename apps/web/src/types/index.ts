export type AnswerAttempt = {
  questionId: string;
  userAnswer: string | null;
  isCorrect?: boolean;
  flaggedForReview?: boolean;
};

export type ModuleAttempt = {
  moduleId: string;
  startedAt: string;
  completedAt: string;
  answers: AnswerAttempt[];
  score?: number;
};
