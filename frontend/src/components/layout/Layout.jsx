import Title from "../title/Title";
import Text from "../text/Text";

// Mappatura dei componenti
const componentMap = {
	"components.title": Title,
	"components.text": Text,
};

export default function Layout({ layout }) {
	const { size, content1, content2, content3 } = layout;

	const renderContent = (content) => {
		return content.map((elem, index) => {
			const Component = componentMap[elem.__component];
			if (Component) {
				// Se il componente esiste nella mappatura, renderizzalo dinamicamente
				return <Component key={index} value={elem.value} />;
			}
			// Se il componente non esiste, renderizza un fallback (un semplice div)
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
		default:
			return <></>;
	}
}
