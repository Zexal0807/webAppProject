import React from "react";
import Title from "../title/Title";
import Text from "../text/Text";
import Team from "../team/Team";
import Image from "../image/Image";
import Video from "../video/Video";
import Infection from "../infection/Infection";
import Times from "../times/Times";
import Map from "../map/Map";
import ImageTitle from "../imageTitle/ImageTitle";


// Mappatura dei componenti
const componentMap = {
	"components.title": Title,
	"components.text": Text,
	"components.team": Team,
	"components.image": Image,
	"components.video": Video,
	"components.times": Times,
	"components.map": Map,
	"components.image-title": ImageTitle,
};

export default function Layout({ layout }) {
    const { size, content1, content2, content3 } = layout;

    const renderContent = (content) => {
		const infections = content.filter(elem => elem.__component === "components.infection");

        if (infections.length > 0) {
            // Passa i dati al componente Infection
            return <Infection infections={infections} />;
        }

		return content.map((elem, index) => {
			const Component = componentMap[elem.__component];
			if (Component) {
				// Gestione del componente `team`
				if (elem.__component === "components.team" && elem.value && elem.members) {
					return <Component key={index} value={elem.value} members={elem.members} />;
				}
				// Gestione del componente `times`
				if (elem.__component === "components.times" && elem.tableTimes) {
					return <Component key={index} value={elem.value} tableTimes={elem.tableTimes} />;
				}
				// Gestione del componente `title`
				if (elem.__component === "components.title") {
					return <Component key={index} value={elem.value} align={elem.align} />;
				}
				// Gestione del componente `image-title`
				if (elem.__component === "components.image-title" && elem.image && elem.service) {
                    return <Component key={index} image={elem.image} service={elem.service} />;
                }
				// Renderizza altri componenti generici
				return <Component key={index} {...elem} />;
			}
			// Fallback per componenti non trovati
			return <div key={index}>{elem.value}</div>;
		});
	};

	switch (size) {
		case "size1":
			return <div className="col-12">{renderContent(content1)}</div>;
		case "size6-6":
			return (
				<div className="d-flex flex-row">
					<div className="col-6">{renderContent(content1)}</div>
					<div className="col-6">{renderContent(content2)}</div>
				</div>
			);
		case "size2-10":
			return (
				<div className="d-flex flex-row">
					<div className="col-2">{renderContent(content1)}</div>
					<div className="col-10">{renderContent(content2)}</div>
				</div>
			);
		case "size10-2":
			return (
				<div className="d-flex flex-row">
					<div className="col-10">{renderContent(content1)}</div>
					<div className="col-2">{renderContent(content2)}</div>
				</div>
			);
		case "size4-4-4":
			return (
				<div className="d-flex flex-row">
					<div className="col-4">{renderContent(content1)}</div>
					<div className="col-4">{renderContent(content2)}</div>
					<div className="col-4">{renderContent(content3)}</div>
				</div>
			);
		default:
			return <></>;
	}
}
