import React from "react";

export default function Service({ value, link }) {
    return (
        <a href={link} className="service-title-link text-center font-weight-bold text-decoration-none"  style={{ color: "inherit" }}>
            <h5 className="service-title">{value}</h5>
        </a>
    );
}
