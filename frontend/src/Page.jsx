import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Hero from "./components/hero/Hero";
import Navbar from "./components/navbar/Navbar";

export default function Page() {
    const { pageId } = useParams();
    const [content, setContent] = useState({
        title: "", 
        text: "",  // Aggiungi lo stato per il testo
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Costruisci l'URL con il filtro per lo slug
                const url = `${process.env.REACT_APP_BACKEND_HOST}/api/pages?filters[slug][$eq]=${pageId}&populate[content]=*`;
                console.log("Fetching URL:", url);
        
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer c39994527baf082628471c88491a46160acf68bf3cfd9aa3e1ccec4ae52affac58abd0d35f78a85dd1b2a24076db87fad0b7644f24db1b8ed8af31c147693d0541ec2f09d7077f568f95d292f3bd21a6b02c6e71f0255dc6886fb7db8c2dd3e217288c43693ebc4c1dbbfaf9b81ef1701320ae0c0de63e50dabaaa2451bde0d2`, // Sostituisci con il token corretto
                    },
                });
        
                if (response.ok) {
                    const data = await response.json();
                    console.log("Dati ricevuti dall'API:", data);
        
                    // Estrai la prima pagina trovata
                    if (data.data.length > 0) {
                        const pageData = data.data[0].attributes;
        
                        // Estrai il titolo e il testo dal contenuto
                        const titleSection = pageData.content[0]; // Primo elemento è il titolo
                        const textSection = pageData.content[1];  // Secondo elemento è il testo
        
                        const sectionTitleValue = titleSection?.value || "Home";  // Titolo di fallback
                        const textContent = textSection?.value || "";  // Testo di fallback
        
                        setContent({
                            title: sectionTitleValue,
                            text: textContent,  // Imposta il testo nello stato
                        });
        
                        document.title = sectionTitleValue;
                    } else {
                        console.error("Nessuna pagina trovata con questo slug:", pageId);
                        setContent({
                            title: "Home",
                            text: "",  // Testo di fallback
                        });
                        document.title = "Home"; // Titolo di fallback
                    }
                } else {
                    console.error("Errore nella risposta dell'API:", response.status);
                }
            } catch (error) {
                console.error("Errore durante il fetch:", error);
                setContent({
                    title: "Home",
                    text: "",  // Testo di fallback
                });
                document.title = "Home"; // Titolo di fallback
            }
        };        

        fetchData();
    }, [pageId]);

    return (
        <>
            <Hero />
            <Navbar />
            <div>
                {/* Visualizza il titolo della pagina */}
                <h1>{content.title}</h1>
                {/* Visualizza il testo */}
                <p>{content.text}</p>
            </div>
        </>
    );
}
