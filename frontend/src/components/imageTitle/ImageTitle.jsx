import React, { useEffect, useRef, useState } from "react";
import Image from "../image/Image";
import "./ImageTitle.css"

export default function ImageTitle({ image, service }) {
    const imageRef = useRef(null);
    const [imageHeight, setImageHeight] = useState(0);

    // Calcola l'altezza dell'immagine quando viene montata
    useEffect(() => {
        if (imageRef.current) {
            setImageHeight(imageRef.current.offsetHeight);
        }
    }, [image]);

    const imageData = Array.isArray(image) && image.length > 0 ? image[0] : null;

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
                    <h5 className="service-title text-center font-weight-bold">{service}</h5>
                </div>
            </div>
        </div>
    );
}
