// src/lib/parseQna.ts

import type { Quiz } from './quizData';

export function parseQna(text: string): Quiz[] {
  const questions = text.trim().split(/\n(?=Q\d+)/); // Q1, Q2로 나누기

  return questions.map((block, idx) => {
    const idMatch = block.match(/^Q(\d+)/);
    const id = idMatch ? `Q${idMatch[1]}` : `Q${idx + 1}`;

    const answerMatch = block.match(/Answer:\s*([A-D])/);
    const answerLetter = answerMatch?.[1] ?? 'A';

    const body = block.replace(/^Q\d+/, '').replace(/Answer:.*/s, '').trim();
    const optionMatches = [...body.matchAll(/([A-D])\.\s(.+?)(?=\n[A-D]\.|$)/gs)];

    const questionText = body.split(/\nA\./)[0].trim();
    const options = optionMatches.map((m) => m[2].trim());

    const correctAnswer = options['ABCD'.indexOf(answerLetter)];

    return {
      id,
      question: questionText,
      options: shuffle([...options]),
      correctAnswer,
    };
  });
}

function shuffle<T>(arr: T[]): T[] {
  return arr.map((v) => [Math.random(), v] as const)
            .sort((a, b) => a[0] - b[0])
            .map(([, v]) => v);
}
