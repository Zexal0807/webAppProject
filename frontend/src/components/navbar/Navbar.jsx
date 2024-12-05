import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
	const [pages, setPages] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.REACT_APP_BACKEND_HOST}/api/pages`;

			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${process.env.REACT_APP_FETCH_TOKEN}`,
				},
			});

			if (response.ok) {
				const data = await response.json();

				console.log("Dati ricevuti dall'API:", data);
				setPages(data);
			}
		};

		fetchData();
	}, []);

	const renderSubItemSection = (sub) => {
		return (
			<div className="sub">
				{sub.map((page, i) => renderItem(page, i))}
			</div>
		);
	};
    
	const renderItem = (page, index) => {
		return (
			<div className="navbar-item px-2 py-1" key={index}>
				<a href={`/${page.url}`}>{page.name}</a>
				{page.sub && page.sub.length > 0
					? renderSubItemSection(page.sub)
					: ""}
			</div>
		);
	};

	return (
		<div className="navbar pt-3 pb-0 d-flex justify-content-center">
			<div className="col-11 col-sm-8 d-flex flex-column justify-content-center">
				<div className="col-12 d-flex justify-content-between flex-wrap flex-sm-nowrap">
					{pages.map((page, i) => renderItem(page, i))}
				</div>
			</div>
		</div>
	);
}
