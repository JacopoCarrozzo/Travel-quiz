import React, {useState} from 'react';
import QuestionCard from './components/questioncard';
import { fetchQuizQuestions } from './API';
import { QuestionState, Difficulty } from './API';
import './index.css'; 

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}
const TOTAL_QUESTIONS = 10;

function App() {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true)
  

  const startQuiz = async() => {
    setLoading(true);
    setGameOver(false);

    console.log("I'm making a request to the API...");
    
    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    console.log("Questions received:", newQuestions.length);
    
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
}


  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) =>{
    if (!gameOver){
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) setScore (prev => prev + 1);
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject])
    }
  }

  const nextQuestion = () =>{
    const nextQuestion = number + 1;
    
    if (nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true)
    }else{
      setNumber(nextQuestion)
    }
  }

  const getSkillLevel = (score: number) => {
    if (score === 10) return "Master";
    if (score >= 8) return "Expert";
    if (score >= 4) return "Intermediate";
    return "Base";
  };
  
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-black font-extrabold text-4xl text-center mt-10">TRAVEL QUIZ</h1>

      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
      <button className="cursor-pointer border-2 border-[#000000] bg-gray-200 shadow-md shadow-black/25 rounded-lg h-10 my-5 px-10 max-w-[200px]" onClick={startQuiz}>
        Start
      </button>) : null}
      {gameOver && userAnswers.length === 0 ? (
        <div className="text-center p-5 bg-gray-200 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Welcome to the Travel Quiz!</h2>
        <p className="text-md">Test your travel knowledge and find out how much you know!</p>
        </div>
      ) : null}

      {userAnswers.length === TOTAL_QUESTIONS ? (
        <div className="text-center">
        <p className="text-black text-2xl m-0">Score: {score}</p>
        <p className="text-black text-xl m-0 mt-2">Skill Level: {getSkillLevel(score)}</p>
        </div>
      ) : null}

      {!loading && !gameOver &&(
      <QuestionCard
        questionNr={number + 1}
        totalQuestions={TOTAL_QUESTIONS}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        callback={checkAnswer}
        />
      )}
      {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
        <button className="cursor-pointer border-2 border-[#000000] bg-[#ebfeff] shadow-md shadow-black/25 rounded-lg h-10 my-5 px-10" onClick={nextQuestion}>
        Next Question
      </button>
      ) : null}
      
    </div>
  );
}
export default App;
