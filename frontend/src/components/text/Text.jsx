import DOMPurify from "dompurify";

import './Text.css'

export default function Text({ value }) {
    return (
        <p 
            className="text-component"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
        ></p>
    );
}
