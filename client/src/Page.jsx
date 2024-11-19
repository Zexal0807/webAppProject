import { redirect, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Hero from "./components/hero/Hero";
import Navbar from "./components/navbar/Navbar";

export default function Page() {
	const { pageId } = useParams();

	const [content, setContent] = useState({
		title: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			try{
				const response = await fetch(`${process.env.BACKEND_HOST}/api/pages/${pageId}`, {
					headers: {
						Authorization: `Bearer 2c9ff8461fe9ba60bd4ffe56e2493db713a7cac418f918d7f568c93ee48b9314365cee0fe07dec1402b8955b8cb05f0d88c60ff52462b1694e1884ceeaf6b5e40f56f54808afcfe7ff07ad71370cf9b1e3a068ff22c79257b2bf548e87acf5899a0f495b30bf62db8b70ef1b1ab1afbab93c581105596cd9af59233ee7583f16`,
					}
				});
				if (response.ok) {
					const data = await response.json();
					setContent(data);
				}
			} catch(e) {
				// redirect("/");
				setContent({
					title: "Home",
					content: "CIAO",
				});
			};
			console.log(content);
			document.title = content.title;
		};

		fetchData();
	}, []);

	return (
		<>
			<Hero />
			<Navbar />
			<div>{content.title}</div>

			{/* Per ogni elemento dell'array del content, creo il component corrispondente */}
		</>
	);
}
