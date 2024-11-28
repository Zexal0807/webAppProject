import DOMPurify from "dompurify";

import './Text.css'

export default function Text({ value }) {
    return (
        <p 
            className="text-component p-2 p-sm-4" 
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
        ></p>
    );
}
