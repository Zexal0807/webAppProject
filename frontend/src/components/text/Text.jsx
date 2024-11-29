import DOMPurify from "dompurify";

import './Text.css'

export default function Text({ value }) {
    return (
        <p 
            className="text-component p-2 px-sm-4 py-sm-2"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
        ></p>
    );
}
