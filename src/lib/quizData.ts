import qnaText from '$lib/raw/qna.txt?raw';
import { parseQna } from './parseQna';

export type Quiz = {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  };

export const quizzes = parseQna(qnaText);