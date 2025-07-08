import { shuffleArray } from "./utils";

export type Question = {
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;
};

export type QuestionState = Question & { answers: string[] };

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}

export const fetchQuizQuestions = async (
    amount: number, 
    difficulty: Difficulty, 
    retries = 5
): Promise<QuestionState[]> => {
  
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&category=22&difficulty=${difficulty}&type=multiple`;

    try {
        const response = await fetch(endpoint);

        if (response.status === 429 && retries > 0) {
            console.warn(`Too many requests! I'll try again... Attempts left: ${retries - 1}`);
            return fetchQuizQuestions(amount, difficulty, retries - 1);
        }

        if (!response.ok) {
            throw new Error(`Errore HTTP! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || !Array.isArray(data.results)) {
            throw new Error("Invalid data format!");
        }

        return data.results.map((question: Question) => ({
            ...question,
            answers: shuffleArray([...question.incorrect_answers, question.correct_answer]),
        }));

    } catch (error) {
        console.error("Error while fetching:", error);
        return [];
    }
};
