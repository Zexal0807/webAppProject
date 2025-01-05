import React, { useReducer, useEffect, useState } from "react";
import { quizReducer, initialState } from "./QuizReducer";
import "./Quiz.css";

const Quiz = () => {
    const [state, dispatch] = useReducer(quizReducer, initialState);
    const [age, setAge] = useState("");
    const [sex, setSex] = useState(""); // Imposta un valore iniziale per il sesso
    const [IP, setIP] = useState("192.168.1.1"); // IP statico
    const [code, setCode] = useState(""); // Codice test iniziale vuoto
    const [error, setError] = useState(""); // Stato per il messaggio di errore
    const [tests, setTests] = useState([]); // Stato per memorizzare i test
    const [selectedTest, setSelectedTest] = useState(null); // Stato per il test selezionato

    // Funzione per generare il codice del test in formato ISO+3lettere
    const generateTestCode = () => {
        const isoDate = new Date().toISOString().split('T')[0]; // Formato: YYYY-MM-DD
        const randomLetters = Array.from({ length: 3 }, () =>
            String.fromCharCode(65 + Math.floor(Math.random() * 26)) // Lettere maiuscole A-Z
        ).join('');
        return `${isoDate}+${randomLetters}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${process.env.REACT_APP_BACKEND_HOST}/api/find-page`;

                const response = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify({ pageId: "quiz" }),
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_FETCH_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const quizComponent = data.layouts[0]?.content1?.find(
                        (c) => c.__component === "components.quiz"
                    );

                    if (quizComponent?.tests) {
                        setTests(quizComponent.tests); // Salva tutti i test nello stato
                    }
                } else {
                    console.error("Errore nella risposta dell'API:", response.statusText);
                }
            } catch (error) {
                console.error("Errore nella fetch:", error);
            }
        };

        fetchData();
    }, []);

    const handleStartQuiz = () => {
        if (!age || !sex) {
            setError("Inserisci l'età e il sesso per continuare");
            return;
        }
        setError(""); // Resetta errore se i campi sono validi

        // Genera un codice casuale del test
        const testCode = generateTestCode();
        setCode(testCode);  // Imposta il codice del test nello stato

        // Seleziona un test casuale
        const randomTest = tests[Math.floor(Math.random() * tests.length)];
        setSelectedTest(randomTest);
        console.log("Test selezionato:", randomTest);  // Debug

        // Imposta le domande del test selezionato nello stato globale
        dispatch({ type: "SET_QUESTIONS", payload: randomTest.questions || [] });
        dispatch({ type: "START_QUIZ" });
    };

    const handleAnswer = (answer) => {
        dispatch({
            type: "ANSWER_QUESTION",
            payload: { questionIndex: state.currentQuestionIndex, answer },
        });

        if (state.currentQuestionIndex === state.questions.length - 1) {
            dispatch({ type: "FINISH_QUIZ" });
        }
    };

    const handleSendResults = async () => {
        const testExecutionData = {
            data: {  
                age,
                sex: { id: sex },  
                test: { id: selectedTest.id },  
                score: state.score,
                IP: IP,
                code,  
                execution_time: new Date().toISOString(),
                answers: state.answers.map((answer, index) => {
                    const question = state.questions[index]; // Prendi la domanda corrente
                    const selectedAnswer = question.answers.find(a => a.text === answer.answer); // Trova la risposta selezionata
                
                    return {
                        id: selectedAnswer?.id, // ID della risposta selezionata
                        givenAnswer: answer.answer, // Risposta data
                    };
                }),
            },
        };

        console.log("Dati inviati al backend:", testExecutionData); // Log dei dati inviati per debug

        try {
            const url = `${process.env.REACT_APP_BACKEND_HOST}/api/test-executions`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_FETCH_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(testExecutionData),
            });

            if (!selectedTest) {
                console.error("Nessun test selezionato!");
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Errore nell'invio dei risultati:", errorData);
                alert("Errore nell'invio dei risultati.");
            } else {
                const data = await response.json();
                console.log("Risultati inviati con successo:", data);
                alert("Risultati inviati con successo!");
            }
        } catch (error) {
            console.error("Errore durante l'invio:", error);
            alert("Errore durante l'invio dei risultati.");
        }
    };

    if (!state.isQuizStarted && !state.isQuizFinished) {
        return (
            <div className="container mt-4 mb-5">
                <div className="border rounded p-4 shadow-sm">
                <h4 className="mb-4">Inserisci i dati per iniziare</h4>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Età</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="form-control"
                                    placeholder="Inserisci la tua età"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Sesso</label>
                                <select
                                    value={sex}
                                    onChange={(e) => setSex(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="">Seleziona il sesso</option>
                                    <option value="1">Maschio</option>
                                    <option value="2">Femmina</option>
                                    <option value="3">Altro</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button 
                    className="btn custom-btn btn-block" onClick={handleStartQuiz}>Invio</button>
                </div>
            </div>
        );
    }

    if (state.isQuizFinished) {
        return (
            <div className="container mt-4 mb-5">
                <div className="border rounded p-4 shadow-sm">
                    <h3 className="text-center mb-4"><strong>Quiz completato!</strong></h3>
                    <p className="lead text-center mb-4">
                        Il tuo punteggio: <strong>{state.score} / {state.questions.length}</strong>
                    </p>
                    <p className="text-center mb-4">
                        <strong>Il codice del tuo test:</strong> {code}
                    </p>
                    <h4 className="mb-3"><strong>Le tue risposte:</strong></h4>
                    <ul className="list-group mb-2">
                        {state.questions.map((question, index) => {
                            const givenAnswer = state.answers[index]?.answer;
                            const correction = state.answers[index]?.correction;
                            const isCorrect = correction === null; // Se la correzione è null, la risposta è corretta
                            const isIncorrect = correction !== null; // Se c'è una correzione, la risposta è errata

                            // Imposta la classe di sfondo in base alla correttezza della risposta
                            let answerClass = "list-group-item border-top mb-3 rounded";
                            if (isCorrect) {
                                answerClass += " bg-success text-white"; // Verde per risposta corretta
                            } else if (isIncorrect) {
                                answerClass += " bg-danger text-white"; // Rosso per risposta sbagliata
                            }

                            return (
                                <li key={index} className={answerClass}>
                                    <div className="mb-2">
                                        <p><strong>Domanda {index + 1}:</strong> {question.text}</p>
                                    </div>
                                    <div className="mb-2">
                                        <p><strong>Risposta data:</strong> {givenAnswer || "Nessuna risposta data"}</p>
                                    </div>
                                    {correction && (
                                        <div className="mb-2">
                                            <p><strong>Errato:</strong> {correction}</p>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                    <div className="d-grid">
                        <button 
                            className="btn custom-btn" 
                            onClick={handleSendResults}>
                            Invia risultati
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    const currentQuestion = state.questions[state.currentQuestionIndex];

    return (
        <div className="container mt-4 mb-5">
            <div className="border rounded p-4 shadow-sm">
                <h3 className="mb-4 text-center"><strong>Test: {selectedTest.name}</strong></h3>
                <div className="form-group">
                    <h5 className="mb-2"><strong>Domanda {state.currentQuestionIndex + 1} / {state.questions.length}</strong></h5>
                    <p>
                        {currentQuestion?.text}
                    </p>
                </div>
                <div className="form-group">
                    <h5 className="mb-2"><strong>Seleziona una risposta:</strong></h5>
                    <div className="d-grid gap-3">
                        {currentQuestion?.answers.map((answer, index) => (
                            <button 
                                key={index} 
                                className="btn custom-btn"
                                onClick={() => handleAnswer(answer.text)}
                            >
                                {answer.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
