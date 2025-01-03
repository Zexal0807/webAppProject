import React, { useReducer, useEffect, useState } from "react";
import { quizReducer, initialState } from "./QuizReducer";

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
        // Ottieni la data in formato ISO (anno-mese-giorno)
        const isoDate = new Date().toISOString().split('T')[0]; // Formato: YYYY-MM-DD

        // Genera 3 lettere casuali
        const randomLetters = Array.from({ length: 3 }, () =>
            String.fromCharCode(65 + Math.floor(Math.random() * 26)) // Lettere maiuscole A-Z
        ).join('');

        // Combina le due parti (ISO + 3 lettere)
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
                    console.log("Dati ricevuti dall'API:", data);

                    // Estrai le domande e le risposte
                    const quizComponent = data.layouts[0]?.content1?.find(
                        (c) => c.__component === "components.quiz"
                    );

                    if (quizComponent?.tests) {
                        setTests(quizComponent.tests); // Salva tutti i test nello stato
                    } else {
                        console.error("Componente quiz non trovato o nessun test associato.");
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
            setError("Inserisci l'età e il sesso per continuare"); // Imposta errore
            return;
        }
        setError(""); // Resetta errore se i campi sono validi

        // Genera un codice casuale del test
        const testCode = generateTestCode();
        setCode(testCode);  // Imposta il codice del test nello stato

        // Seleziona un test casuale
        const randomTest = tests[Math.floor(Math.random() * tests.length)];
        setSelectedTest(randomTest);

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
        // Prepara i dati per il backend
        const testExecutionData = {
            data: {  
                age,
                sex: { id: sex },  
                test: { id: selectedTest.id },  
                score: state.score,
                IP: IP,
                code,  // Usa il codice generato
                execution_time: new Date().toISOString(),
                answers: state.answers.map((answer) => ({
                    id: state.questions[answer.questionIndex].id,
                    givenAnswer: answer.answer,
                })),
            },
        };

        console.log("Dati da inviare:", testExecutionData.data);

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

            if (!response.ok) {
                const errorData = await response.json();  // Ottieni il corpo dell'errore
                console.error("Errore nell'invio dei risultati:", errorData);  // Visualizza i dettagli dell'errore
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
            <div>
                <div>
                    <label>
                        Età:
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Inserisci la tua età"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Sesso:
                        <select
                            value={sex}
                            onChange={(e) => setSex(e.target.value)}
                        >
                            <option value="">Seleziona il sesso</option>
                            <option value="1">Maschio</option>
                            <option value="2">Femmina</option>
                            <option value="3">Altro</option>
                        </select>
                    </label>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>} {/* Mostra errore */}
                <button onClick={handleStartQuiz}>Start Quiz</button>
            </div>
        );
    }

    if (state.isQuizFinished) {
        return (
            <div>
                <h2>Quiz Finished!</h2>
                <p>
                    Your score: {state.score} / {state.questions.length}
                </p>
                <p>Il codice del tuo test è: {code}</p>
                <button onClick={handleSendResults}>Send Results</button>
            </div>
        );
    }

    const currentQuestion = state.questions[state.currentQuestionIndex];

    return (
        <div>
            <h2>Test: {selectedTest.name}</h2>
            <h2>
                Question {state.currentQuestionIndex + 1} / {state.questions.length}
            </h2>
            <p>{currentQuestion?.text}</p>
            <div>
                {currentQuestion?.answers.map((answer, index) => (
                    <button key={index} onClick={() => handleAnswer(answer.text)}>
                        {answer.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Quiz;
