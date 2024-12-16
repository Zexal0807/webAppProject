import React, { useReducer, useEffect } from "react";
import axios from "axios";

import { quizReducer, initialState } from "./QuizReducer";

const QuizApp = () => {
	const [state, dispatch] = useReducer(quizReducer, initialState);

	useEffect(() => {
		// Fetch questions from API when component mounts
		const fetchQuestions = async () => {
			try {
				const response = await axios.get("https://example.com/api/quiz"); // Replace with your API endpoint
				dispatch({ type: "SET_QUESTIONS", payload: response.data });
			} catch (error) {
				console.error("Error fetching questions:", error);
			}
		};

		fetchQuestions();
	}, []);

	const handleStartQuiz = () => {
		dispatch({ type: "START_QUIZ" });
	};

	const handleAnswer = (answer) => {
		dispatch({
			type: "ANSWER_QUESTION",
			payload: { questionIndex: state.currentQuestionIndex, answer },
		});

		// If last question, finish the quiz
		if (state.currentQuestionIndex === state.questions.length - 1) {
			dispatch({ type: "FINISH_QUIZ" });
		}
	};

	const handleSendResults = async () => {
		try {
			await axios.post("https://example.com/api/quiz/results", {
				score: state.score,
				answers: state.answers,
			});
			alert("Results sent successfully!");
		} catch (error) {
			console.error("Error sending results:", error);
		}
	};

	if (!state.isQuizStarted && !state.isQuizFinished) {
		return <button onClick={handleStartQuiz}>Start Quiz</button>;
	}

	if (state.isQuizFinished) {
		return (
			<div>
				<h2>Quiz Finished!</h2>
				<p>
					Your score: {state.score} / {state.questions.length}
				</p>
				<button onClick={handleSendResults}>Send Results</button>
			</div>
		);
	}

	const currentQuestion = state.questions[state.currentQuestionIndex];

	return (
		<div>
			<h2>
				Question {state.currentQuestionIndex + 1} /{" "}
				{state.questions.length}
			</h2>
			<p>{currentQuestion?.question}</p>
			<div>
				{currentQuestion?.options.map((option, index) => (
					<button key={index} onClick={() => handleAnswer(option)}>
						{option}
					</button>
				))}
			</div>
		</div>
	);
};

export default QuizApp;
