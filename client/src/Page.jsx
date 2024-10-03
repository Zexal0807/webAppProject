import Hero from "./components/hero/Hero";
import Navbar from "./components/navbar/Navbar";
import { useEffect, useState } from "react";

export default function Page({ host }) {
	const [page, setPage] = useState({
		title: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			let pageslug = window.location.pathname;

			// const res = await fetch(`${host}/page/${pageslug}`)
			//     .then(data => data.json())
			//     .catch(e => {
			//         window.location.href = "/"
			//     })

			setPage({
				title: "Home",
				content: "CIAO",
			});
			console.log(page);
			document.title = page.title;
		};

		fetchData();
	}, []);

	return (
		<>
			<Hero />
			<Navbar />
			<div></div>
		</>
	);
}
