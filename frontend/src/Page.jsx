import { redirect, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Hero from "./components/hero/Hero";
import Navbar from "./components/navbar/Navbar";
import SectionTitle from "./components/sectionTitle/SectionTitle";
import Text from "./components/text/Text";

export default function Page() {
    const { pageId } = useParams();

    const [title, setTitle] = useState();
    const [content, setContent] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${process.env.REACT_APP_BACKEND_HOST}/api/pages?filters[slug][$eq]=${pageId}&pagination[limit]=1&populate[content]=*`;
        
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_FETCH_TOKEN}`,
                    },
                });
        
                if (response.ok) {
                    const data = await response.json();
                    console.log("Dati ricevuti dall'API:", data);
        
                    const pageData = data.data[0].attributes;

                    setTitle(pageData.title);
                    setContent(pageData.content);
                }
            } catch (error) {
                redirect("/home")
            }
        };        

        fetchData();
    }, [pageId]);

    // Imposta il titolo della pagina
    document.title = title;

    // Mappatura dei componenti
    const componentMap = {
        "components.section-title": SectionTitle,  // Mappiamo 'components.section-title' al componente SectionTitle
        "components.text": Text,                    // Mappiamo 'components.text' al componente Text
    };


    return (
        <>
            <Hero />
            <Navbar />
            <div className="col-11 col-md-8 m-auto">
                {content.map((elem, index) => {
                    const Component = componentMap[elem.__component]; // Cerca il componente corrispondente
                    if (Component) {
                        // Se il componente esiste nella mappatura, renderizzalo dinamicamente
                        return <Component key={index} value={elem.value} />;
                    }
                    // Se il componente non esiste, renderizza un fallback (un semplice div)
                    return <div key={index}>{elem.value}</div>;
                })}
            </div>
        </>
    );

}
