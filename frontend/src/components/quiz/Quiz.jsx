import React, { useReducer, useEffect } from "react";

import { quizReducer, initialState } from "./QuizReducer";

const Quiz = () => {
	const [state, dispatch] = useReducer(quizReducer, initialState);

	useEffect(() => {
		// Fetch questions from API when component mounts
		const fetchData = async () => {
			const url = `${process.env.REACT_APP_BACKEND_HOST}/api/quiz`;

			const response = await fetch(url, {
				method: "POST",
				// body: JSON.stringify({ pageId }),
				headers: {
					Authorization: `Bearer ${process.env.REACT_APP_FETCH_TOKEN}`,
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				console.log("Dati ricevuti dall'API:", data);

				// setTitle(data.title);
				// setLayouts(data.layouts);
			}
		};

		fetchData();
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
		const url = `${process.env.REACT_APP_BACKEND_HOST}/api/test-execution`;

		const response = await fetch(url, {
			method: "POST",
			// body: JSON.stringify({ pageId }),
			headers: {
				Authorization: `Bearer ${process.env.REACT_APP_FETCH_TOKEN}`,
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			const data = await response.json();
			console.log("Dati ricevuti dall'API:", data);
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

export default Quiz;
