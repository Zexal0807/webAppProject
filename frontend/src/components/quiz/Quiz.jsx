import React, { useReducer, useEffect, useState } from "react";
import { quizReducer, initialState } from "./QuizReducer";
import "./Quiz.css";

const Quiz = () => {
    // Gestione dello stato globale del quiz con `useReducer`
    const [state, dispatch] = useReducer(quizReducer, initialState);

     // Stati locali per i dati dell'utente e configurazione del test
    const [age, setAge] = useState("");
    const [sex, setSex] = useState(""); // Imposta un valore iniziale per il sesso
    const [IP, setIP] = useState("192.168.1.1"); // IP statico
    const [code, setCode] = useState(""); // Codice test iniziale vuoto
    const [error, setError] = useState(""); // Stato per il messaggio di errore
    const [tests, setTests] = useState([]); // Stato per memorizzare i test
    const [selectedTest, setSelectedTest] = useState(null); // Stato per il test selezionato

    // Funzione per generare il codice del test in formato ISO+3lettere
    const generateTestCode = () => {
        const isoDate = new Date().toISOString().split('T')[0]; // Formato data ISO (YYYY-MM-DD)
        const randomLetters = Array.from({ length: 3 }, () =>
            String.fromCharCode(65 + Math.floor(Math.random() * 26)) // Genera lettere maiuscole casuali A-Z
        ).join('');
        return `${isoDate}+${randomLetters}`; // Restituisce il codice completo
    };

    // Effetto per caricare i test dal backend all'avvio
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${process.env.REACT_APP_BACKEND_HOST}/api/find-page`;

                // Effettua una richiesta POST per ottenere i dati del quiz
                const response = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify({ pageId: "quiz" }),
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_FETCH_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                });

                // Se la risposta è positiva, aggiorna lo stato con i test ricevuti
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

    // Gestione dell'avvio del quiz
    const handleStartQuiz = () => {
        if (!age || !sex) { // Controlla che i campi obbligatori siano compilati
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

    // Gestione della selezione delle risposte
    const handleAnswer = (answer) => {
        // Invia la risposta selezionata al reducer
        dispatch({
            type: "ANSWER_QUESTION",
            payload: { questionIndex: state.currentQuestionIndex, answer },
        });

        // Se è l'ultima domanda, termina il quiz
        if (state.currentQuestionIndex === state.questions.length - 1) {
            dispatch({ type: "FINISH_QUIZ" });
        }
    };

    // Funzione per inviare i risultati del quiz al backend
    const handleSendResults = async () => {
        // Prepara i dati da inviare
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

    // Ritorno per la schermata di inserimento dei dati iniziali
    if (!state.isQuizStarted && !state.isQuizFinished) {
        return (
            <div className="container mt-4 mb-5">
                <div className="border rounded p-4 shadow-sm">
                <h4 className="mb-4">Inserisci i dati per iniziare</h4>
                    <div className="row mb-3">

                        {/* Campo di input per l'età */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Età</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)} // Aggiorna lo stato quando cambia
                                    className="form-control"
                                    placeholder="Inserisci la tua età"
                                />
                            </div>
                        </div>

                        {/* Campo di selezione per il sesso */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Sesso</label>
                                <select
                                    value={sex}
                                    onChange={(e) => setSex(e.target.value)} // Aggiorna lo stato quando cambia
                                    className="form-select responsive-select"
                                >
                                    <option value="">Seleziona il sesso</option>
                                    <option value="1">Maschio</option>
                                    <option value="2">Femmina</option>
                                    <option value="3">Altro</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Messaggio di errore se i dati inseriti non sono validi */}
                    {error && <p className="text-danger">{error}</p>}
                    <button 
                    className="btn custom-btn btn-block"
                    onClick={handleStartQuiz} // Funzione chiamata al click
                    >
                        Invio</button>
                </div>
            </div>
        );
    }

    // Ritorno per la schermata di fine quiz
    if (state.isQuizFinished) {
        return (
            <div className="container mt-4 mb-5">
                <div className="border rounded p-4 shadow-sm">

                    {/* Messaggio di fine quiz */}
                    <h3 className="text-center mb-4">
                        <strong>Quiz completato!</strong>
                    </h3>

                    {/* Mostra il punteggio dell'utente */}
                    <p className="lead text-center mb-4">
                        Il tuo punteggio: <strong>{state.score} / {state.questions.length}</strong>
                    </p>

                    {/* Codice del test */}
                    <p className="text-center mb-4">
                        <strong>Il codice del tuo test:</strong> {code}
                    </p>

                    {/* Intestazione per la lista delle risposte */}
                    <h4 className="mb-3">
                        <strong>Le tue risposte:</strong>
                    </h4>

                    {/* Lista delle domande e risposte */}
                    <ul className="list-group mb-2">
                        {state.questions.map((question, index) => {
                            const givenAnswer = state.answers[index]?.answer; // Risposta fornita dall'utente
                            const correction = state.answers[index]?.correction; // Correzione in caso di errore
                            const isCorrect = correction === null; // Se la correzione è null, la risposta è corretta
                            const isIncorrect = correction !== null; // Se c'è una correzione, la risposta è errata

                            // Imposta la classe di sfondo in base alla correttezza della risposta
                            let answerClass = "list-group-item border-top mb-3 rounded";
                            if (isCorrect) {
                                answerClass += " bg-success text-white"; // Verde per risposta corretta
                            } else if (isIncorrect) {
                                answerClass += " bg-danger text-white"; // Rosso per risposta sbagliata
                            }

                            // Elemento della lista con dettagli della domanda e risposta
                            return (
                                <li key={index} className={answerClass}>
                                    {/* Testo della domanda */}
                                    <div className="mb-2">
                                        <p><strong>Domanda {index + 1}:</strong> {question.text}</p>
                                    </div>

                                    {/* Risposta fornita */}
                                    <div className="mb-2">
                                        <p><strong>Risposta data:</strong> {givenAnswer || "Nessuna risposta data"}</p>
                                    </div>

                                    {/* Correzione se la risposta è errata */}
                                    {correction && (
                                        <div className="mb-2">
                                            <p><strong>Errato:</strong> {correction}</p>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    {/* Pulsante per inviare i risultati */}
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
    
    // Ritorno per la schermata delle domande durante il quiz
    const currentQuestion = state.questions[state.currentQuestionIndex]; // Ottiene la domanda corrente in base all'indice attuale
    return (
        <div className="container mt-4 mb-5">
            <div className="border rounded p-4 shadow-sm">
                <h3 className="mb-4 text-center"><strong>Test: {selectedTest.name}</strong></h3>

                {/* Sezione della domanda corrente */}
                <div className="form-group">
                    {/* Indicazione del progresso nel quiz: domanda attuale su totale */}
                    <h5 className="mb-2"><strong>Domanda {state.currentQuestionIndex + 1} / {state.questions.length}</strong></h5>
                    {/* Testo della domanda corrente */}
                    <p>
                        {currentQuestion?.text}
                    </p>
                </div>

                {/* Sezione delle risposte */}
                <div className="form-group">
                    <h5 className="mb-2"><strong>Seleziona una risposta:</strong></h5>

                    {/* Elenco delle risposte come bottoni */}
                    <div className="d-grid gap-3">
                        {currentQuestion?.answers.map((answer, index) => ( // Mappa le risposte della domanda corrente
                            <button 
                                key={index} // Chiave unica per ogni bottone
                                className="btn custom-btn"
                                onClick={() => handleAnswer(answer.text)} // Funzione chiamata al click con il testo della risposta come parametro
                            >
                                {answer.text} {/* Testo della risposta */}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
