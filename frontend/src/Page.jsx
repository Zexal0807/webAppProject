import { redirect, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Hero from "./components/hero/Hero";
import Navbar from "./components/navbar/Navbar";
import Layouts from "./components/layout/Layout";

export default function Page() {
    const { pageId } = useParams();

    const [title, setTitle] = useState();
    const [layouts, setLayouts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${process.env.REACT_APP_BACKEND_HOST}/api/pages/${pageId}`;
        
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_FETCH_TOKEN}`,
                    },
                });
        
                if (response.ok) {
                    const data = await response.json();
                    console.log("Dati ricevuti dall'API:", data);

                    setTitle(data.title);
                    setLayouts(data.layouts);
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
                {layouts.map((layout, index) => <Layouts 
                    key={index}
                    layout={layout}
                />)}
            </div>
        </>
    );

}
