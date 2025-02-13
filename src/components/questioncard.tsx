import React from "react";
import { AnswerObject } from "../App";

type Props = {
  question: string;
  answers: string[];
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: AnswerObject | undefined;
  questionNr: number;
  totalQuestions: number;
};

const QuestionCard: React.FC<Props> = ({
  question,
  answers,
  callback,
  userAnswer,
  questionNr,
  totalQuestions,
}) => {
  return (
    <div className="max-w-[1100px] bg-[#ebfeff] rounded-lg border-2 border-[#0085a3] p-5 shadow-md shadow-black/25 text-center mt-10">
      <p className="text-base">
        Question: {questionNr} / {totalQuestions}
      </p>
      <p className="text-base" dangerouslySetInnerHTML={{ __html: question }} />
      <div className="mt-4">
        {answers.map((answer) => {
          const isCorrect = userAnswer?.correctAnswer === answer;
          const isUserClicked = userAnswer?.answer === answer;

          return (
            <button
              key={answer}
              className={`transition-all duration-300 ease-in-out hover:opacity-80 cursor-pointer select-none text-sm w-full h-10 my-1 rounded-md text-white font-bold
                ${
                  isCorrect
                    ? "bg-green-500"
                    : isUserClicked
                    ? "bg-red-500"
                    : "bg-blue-500"
                }
              `}
              disabled={!!userAnswer}
              value={answer}
              onClick={callback}
            >
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
