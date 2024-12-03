import React from "react";
import { Link } from "react-router-dom";
import './Infection.css';

export default function Infection({ infections }) {
    // Funzione per trasformare il valore in minuscolo con trattini al posto degli spazi
    const formatLink = (text) => {
        return text.toLowerCase().replace(/\s+/g, '-');
    };

    return (
        <div className="container mt-4">
            <div className="row">
                {infections.slice(0, 12).map((infection, index) => (
                    <div className="col-md-4 col-sm-6 col-12 mb-4" key={infection.id}>
                        <Link to={`/${formatLink(infection.value)}`} className="infection-link">
                            <div className="infection-component">
                                <h5>{infection.value}</h5>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="row justify-content-center">
                <div className="col-md-4 col-sm-6 col-12 mb-4">
                    <Link to={`/${formatLink(infections[12]?.value)}`} className="infection-link">
                        <div className="infection-component">
                            <h5>{infections[12]?.value}</h5>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
