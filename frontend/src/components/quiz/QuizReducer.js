export const initialState = {
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    isQuizStarted: false,
    isQuizFinished: false,
    score: 0,
};

export const quizReducer = (state, action) => {
    switch (action.type) {
        case "SET_QUESTIONS":
            return { ...state, questions: action.payload };
        case "START_QUIZ":
            return { ...state, isQuizStarted: true, currentQuestionIndex: 0, answers: [], score: 0 };
        case "ANSWER_QUESTION":
            const { questionIndex, answer } = action.payload;
            const selectedAnswer = state.questions[questionIndex].answers.find(ans => ans.text === answer);
            const isCorrect = selectedAnswer?.score === 1;
            const correction = isCorrect ? null : selectedAnswer?.correction; // Se non corretta, prendi la correzione
            return {
                ...state,
                answers: [...state.answers, { questionIndex, answer, correction }],
                score: isCorrect ? state.score + 1 : state.score,
                currentQuestionIndex: state.currentQuestionIndex + 1,
            };
        case "FINISH_QUIZ":
            return { ...state, isQuizFinished: true, isQuizStarted: false };
        default:
            return state;
    }
};
