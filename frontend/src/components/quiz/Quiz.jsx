import React, { useReducer, useEffect, useState } from "react";
import { quizReducer, initialState } from "./QuizReducer";
import { jsPDF } from "jspdf";
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
    const [resultsSent, setResultsSent] = useState(false); // Stato per tracciare se i risultati sono stati inviati
    const [sexOptions, setSexOptions] = useState([]); // Stato per le opzioni di sesso

    // Funzione per generare il codice del test in formato ISO+3lettere
    const generateTestCode = () => {
        const isoDate = new Date().toISOString().split('T')[0].replace(/-/g, ''); // Rimuove i trattini
        const randomLetters = Array.from({ length: 3 }, () =>
            String.fromCharCode(65 + Math.floor(Math.random() * 26)) // Genera lettere maiuscole casuali A-Z
        ).join('');
        return `${isoDate}-${randomLetters}`; // Restituisce il codice completo senza trattini
    };
    

    // Effetto per caricare i test dal backend all'avvio
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${process.env.REACT_APP_BACKEND_HOST}/api/test`;

                // Effettua una richiesta GET per ottenere i dati del quiz
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_FETCH_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                });

                // Se la risposta è positiva, aggiorna lo stato con i test ricevuti
                if (response.ok) {
                    const data = await response.json();
                    setTests(data); // Salva l'intera risposta API
                } else {
                    console.error("Errore nella risposta dell'API:", response.statusText);
                }
            } catch (error) {
                console.error("Errore nella fetch:", error);
            }
        };

        fetchData();
    }, []);

    // useEffect che invia automaticamente i risultati al backend quando il quiz è finito
    useEffect(() => {
        if (state.isQuizFinished && !resultsSent) {
            handleSendResults();  // Chiamata alla funzione solo quando il quiz è finito
            setResultsSent(true);  // Imposta a true quando i risultati sono inviati
        }
    }, [state.isQuizFinished, resultsSent]);  // Dipende dallo stato `isQuizFinished` e `resultsSent`

    // useEffect per caricare i tipi di sesso
    useEffect(() => {
        const fetchSexData = async () => {
            try {
                const url = `${process.env.REACT_APP_BACKEND_HOST}/api/sex`;

                // Effettua una richiesta GET per ottenere i tipi di sesso
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_FETCH_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                });

                // Se la risposta è positiva, aggiorna lo stato con i test ricevuti
                if (response.ok) {
                    const data = await response.json();
                    console.log("Dati sesso ricevuti:", data);
                    setSexOptions(data); 
                } else {
                    console.error("Errore nella risposta dell'API:", response.statusText);
                }
            } catch (error) {
                console.error("Errore nella fetch:", error);
            }
        };

        fetchSexData();
    }, []);

    // Algoritmo per mescolare le risposte
    const shuffleArray = (array) => {
        return array
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    };    

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

        // Mescola le risposte di ogni domanda
        const questionsWithShuffledAnswers = tests.questions.map(question => ({
            ...question,
            answers: shuffleArray(question.answers), 
        }));

        // Imposta le domande del test selezionato nello stato globale
        dispatch({ type: "SET_QUESTIONS", payload: questionsWithShuffledAnswers || [] }); // Passa le domande com le risposte mescolate al reducer
        //dispatch({ type: "SET_QUESTIONS", payload: tests.questions || [] });
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
                test: { id: tests.id },  
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

        console.log("Dati inviati al backend", testExecutionData)

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
                const errorData = await response.json();
                console.error("Errore nell'invio dei risultati:", errorData);
                // alert("Errore nell'invio dei risultati.");
            } else {
                const data = await response.json();
                console.log("Risultati inviati con successo:", data);
                // alert("Risultati inviati con successo!");
            }
        } catch (error) {
            console.error("Errore durante l'invio:", error);
            // alert("Errore durante l'invio dei risultati.");
        }
    };

    // Funzione per trovare il nome associato all'id del sesso
    const getSexName = (sexid) => {
        // Usa il metodo 'find' per cercare l'oggetto nell'array 'sexOptions' 
        // dove l'ID dell'oggetto corrisponde all'ID passato alla funzione
        const selectedOption = sexOptions.find(option => option.id === parseInt(sexid));
        // Se è stato trovato un oggetto (selectedOption non è undefined), restituisce il nome
        // Altrimenti restituisce "Sconosciuto" se l'oggetto non è stato trovato
        return selectedOption ? selectedOption.name : "Sconosciuto";
    };

    // Funzione per salvare i risultati del quiz in un file PDF
    const handleSaveResults = () => {
        const doc = new jsPDF(); // Crea un nuovo documento PDF
        
        // Imposta dimensioni e margini
        const pageHeight = doc.internal.pageSize.height; // Altezza della pagina
        const pageWidth = doc.internal.pageSize.width; // Larghezza della pagina
        const margin = 10; // Margine superiore
        const maxWidth = pageWidth - margin * 2; // Larghezza massima per il testo
        let y = 10; // Posizione verticale iniziale
        
        // Imposta il titolo del PDF
        doc.setFontSize(16); // Imposta la dimensione del font
        doc.setFont("helvetica", "bold"); // Imposta il font a Helvetica e grassetto
        const title = "Risultati del Quiz";
        const titleX = (pageWidth - doc.getTextWidth(title)) / 2; // Centra il titolo orizzontalmente
        doc.text(title, titleX, y); // Aggiunge il titolo al documento
        y += 10; // Sposta la posizione verticale per il prossimo contenuto
        
        // Imposta il font per il contenuto del PDF
        doc.setFontSize(12); // Imposta la dimensione del font per il testo normale
        doc.setFont("helvetica", "normal"); // Imposta il font a Helvetica e normale
        
        // Funzione per centrare il testo
        const centerText = (text) => {
            const textX = (pageWidth - doc.getTextWidth(text)) / 2; // Calcola la posizione centrata orizzontalmente
            doc.text(text, textX, y); // Aggiunge il testo centrato al documento
            y += 10; // Sposta la posizione verticale per il prossimo testo
        };

        // Aggiungi i dati dell'utente
        centerText(`Età: ${age}`);
        const namesex = getSexName(sex);
        centerText(`Sesso: ${namesex}`);
        centerText(`Codice del Test: ${code}`);
        centerText(`Punteggio: ${state.score} / ${state.questions.length}`);
        y += 7; // Aggiunge uno spazio tra il punteggio e le domande
        
        // Loop per iterare su tutte le domande del quiz
        state.questions.forEach((question, index) => {
            const questionText = `Domanda ${index + 1}:`; // Testo per la domanda
            const questionContent = question.text; // Contenuto della domanda
            const answerLabel = `Risposta data:`; // Etichetta per la risposta
            const answerContent = state.answers[index]?.answer || "Nessuna risposta"; // Risposta data dall'utente
            const correctionLabel = `Correzione:`; // Etichetta per la correzione
            const correctionContent = state.answers[index]?.correction; // Correzione se presente
            
            doc.setFont("helvetica", "bold"); // Imposta il font grassetto per la domanda
            doc.text(questionText, margin, y); // Aggiunge la domanda
            y += 6; // Aggiunge spazio dopo la domanda
            
            doc.setFont("helvetica", "normal"); // Imposta il font normale per il contenuto della domanda
            const questionLines = doc.splitTextToSize(questionContent, maxWidth); // Suddivide la domanda in più righe se è troppo lunga
            questionLines.forEach((line) => {
                // Aggiunge una nuova pagina se il contenuto non entra nella pagina corrente
                if (y + 10 > pageHeight - margin) {
                    doc.addPage();
                    y = margin; // Ripristina la posizione verticale all'inizio della pagina
                }
                doc.text(line, margin, y); // Aggiunge la riga della domanda al documento
                y += 7; // Sposta verso il basso per la riga successiva
            });
            
            doc.setFont("helvetica", "bold"); // Imposta il font grassetto per l'etichetta della risposta
            doc.text(answerLabel, margin, y); // Aggiunge l'etichetta "Risposta data"
            y += 6; // Sposta verso il basso per la risposta
            
            doc.setFont("helvetica", "normal"); // Imposta il font normale per la risposta
            const answerLines = doc.splitTextToSize(answerContent, maxWidth); // Suddivide la risposta in più righe se necessario
            answerLines.forEach((line) => {
                if (y + 10 > pageHeight - margin) { // Aggiunge una nuova pagina se necessario
                    doc.addPage();
                    y = margin; // Ripristina la posizione verticale all'inizio della pagina
                }
                doc.text(line, margin, y); // Aggiunge la risposta al documento
                y += 7; // Sposta verso il basso per la riga successiva
            });
            
            // Se è presente la correzione, aggiungila al PDF
            if (correctionContent) {
                doc.setFont("helvetica", "bold"); // Imposta il font grassetto per l'etichetta della correzione
                doc.text(correctionLabel, margin, y); // Aggiunge l'etichetta "Correzione"
                y += 6; // Sposta verso il basso per la correzione
                
                doc.setFont("helvetica", "normal"); // Imposta il font normale per la correzione
                const correctionLines = doc.splitTextToSize(correctionContent, maxWidth); // Suddivide la correzione in più righe se necessario
                correctionLines.forEach((line) => {
                    if (y + 10 > pageHeight - margin) { // Aggiunge una nuova pagina se necessario
                        doc.addPage();
                        y = margin; // Ripristina la posizione verticale all'inizio della pagina
                    }
                    doc.text(line, margin, y); // Aggiunge la correzione al documento
                    y += 7; // Sposta verso il basso per la riga successiva
                });
            }

            // Aggiungi una linea di separazione tra le domande, se non è l'ultima domanda
            if (index < state.questions.length - 1) {
                if (y + 5 > pageHeight - margin) { // Aggiunge una nuova pagina se necessario
                    doc.addPage();
                    y = margin; // Ripristina la posizione verticale all'inizio della pagina
                }
                doc.setDrawColor(0); // Imposta il colore della linea (nero)
                doc.setLineWidth(0.5); // Imposta lo spessore della linea
                doc.line(margin, y, pageWidth - margin, y); // Disegna la linea orizzontale
                y += 10; // Spazio dopo la linea
            }
        });
        
        // Salva il documento PDF con il nome "risultati_quiz.pdf"
        doc.save("risultati_quiz.pdf");
    };

    // Funzione per ricominciare il quiz
    const handleRestart = () => {
        dispatch({ type: "RESET" });
        setAge("");
        setSex("");
        setIP("192.168.1.1");
        setCode("");
        setError("");
        setResultsSent(false);
    };

    // return per la schermata di inserimento dei dati iniziali
    if (!state.isQuizStarted && !state.isQuizFinished) {
        return (
            <div className="container mt-4 mb-5 pb-4">
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
                                    aria-label="Seleziona il sesso"
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
                                    aria-label="Seleziona il sesso"
                                >
                                    <option value="">Seleziona il sesso</option>
                                    {sexOptions.map(option => (
                                        <option key={option.id} value={option.id}>{option.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Messaggio di errore se i dati inseriti non sono validi */}
                    {error && <p className="text-danger">{error}</p>}
                    <div className="d-flex justify-item-center align-items-center">
                        <button 
                            className="btn custom-btn btn-block col-4 m-auto"
                            onClick={handleStartQuiz} // Funzione chiamata al click
                        >
                        Inizia</button>
                    </div>
                </div>
            </div>
        );
    }

    // return per la schermata di fine quiz
    if (state.isQuizFinished) {
        return (
            <div className="container mt-4 mb-5">
                <div className="border rounded p-4 shadow-sm">

                    {/* Messaggio di fine quiz */}
                    <h3 className="text-center mb-4" aria-live="polite">
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
                                answerClass += " bg-success"; // Verde per risposta corretta
                            } else if (isIncorrect) {
                                answerClass += " bg-danger"; // Rosso per risposta sbagliata
                            }

                            // Elemento della lista con dettagli della domanda e risposta
                            return (
                                <li key={index} className={answerClass}>
                                    {/* Testo della domanda */}
                                    <div className="mb-2">
                                        <p ><strong>Domanda {index + 1}:</strong> {question.text}</p>
                                    </div>

                                    {/* Risposta fornita */}
                                    <div className="mb-2">
                                        <p><strong>Risposta data:</strong> {givenAnswer || "Nessuna risposta data"}</p>
                                    </div>

                                    {/* Correzione se la risposta è errata */}
                                    {correction && (
                                        <div className="mb-2">
                                            <p><strong>Correzione:</strong> {correction}</p>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    {/* Pulsante per inviare i risultati */}
                    <div className="d-flex justify-content-center gap-2 mt-3">
                        <button 
                            className="btn custom-btn w-100" 
                            onClick={handleSaveResults}
                            aria-label="Salva i risultati del quiz"
                        >
                            Scarica i risultati
                        </button>
                        <button 
                            className="btn btn-secondary w-100" 
                            onClick={handleRestart}
                            aria-label="Inizia un nuovo quiz"
                        >
                            Inizia a un nuovo quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // return per la schermata delle domande durante il quiz
    const currentQuestion = state.questions[state.currentQuestionIndex]; // Ottiene la domanda corrente in base all'indice attuale
    return (
        <div className="container mt-4 mb-5">
            <div className="border rounded p-4 shadow-sm">
                <h3 className="mb-4 text-center"><strong>Test: {tests.name}</strong></h3>

                {/* Sezione della domanda corrente */}
                <div className="form-group">
                    {/* Indicazione del progresso nel quiz: domanda attuale su totale */}
                    <h5 className="mb-2"><strong>Domanda {state.currentQuestionIndex + 1} / {state.questions.length}</strong></h5>
                    {/* Testo della domanda corrente */}
                    <p className="textquestion">
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
                                className="btn custom-btn py-3 textanswer"
                                onClick={() => handleAnswer(answer.text)} // Funzione chiamata al click con il testo della risposta come parametro
                                aria-label={`Risposta: ${answer.text}`} // Aggiungi aria-label per le risposte
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
