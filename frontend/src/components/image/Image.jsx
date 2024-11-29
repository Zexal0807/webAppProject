export default function Image({ value, alt }) {
	return <div className="p-2 px-sm-4 py-sm-2">
        <img 
            className="col-12"
            src={value} 
            alt={alt}
        />
    </div>;
}
