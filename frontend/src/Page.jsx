import { redirect, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Hero from "./components/hero/Hero";
import Navbar from "./components/navbar/Navbar";

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

    return (
        <>
            <Hero />
            <Navbar />
            <div className="col-11 col-md-8 m-auto">
                {content.map(elem => {
                    switch(elem.__component){
                        case "components.section-title":
                            return <h1>{elem.value}</h1>;
                        default:
                            return elem.value;
                    }
                })}
            </div>
        </>
    );
}
