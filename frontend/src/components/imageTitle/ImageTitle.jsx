import React, { useEffect, useRef, useState } from "react";
import Image from "../image/Image";
import Service from "../service/Service";
import "./ImageTitle.css";

export default function ImageTitle({ image, service }) {
    const imageRef = useRef(null);
    const [imageHeight, setImageHeight] = useState(0);

    // Calcola l'altezza dell'immagine quando viene montata
    useEffect(() => {
        if (imageRef.current) {
            setImageHeight(imageRef.current.offsetHeight);
        }
    }, [image]);

    // Verifica se `image` è un array o un oggetto singolo
    const imageData = Array.isArray(image)
        ? image.length > 0
            ? image[0] // Usa il primo elemento dell'array se è presente
            : null
        : image; // Se è un oggetto singolo, usalo direttamente

    return (
        <div className="image-title-component d-flex justify-content-center align-items-center my-5">
            {imageData && (
                <div className="image-container me-4" ref={imageRef}>
                    <Image
                        value={imageData.value}
                        alt={imageData.alt}
                        height={imageData.height}
                        width={imageData.width}
                    />
                </div>
            )}
            <div className="text-container p-4 w-50" style={{ height: `${imageHeight}px` }}>
                <div className="d-flex align-items-center justify-content-center h-100">
                    <Service value={service.value} link={service.link} />
                </div>
            </div>
        </div>
    );
}
