import { Routes, Route } from "react-router-dom";
import Page from "./Page";

const BACKEND_HOST = "http://localhost:3001/";

export default function App() {
	return (
		<Routes>
			<Route path="/app" element={<>TEST APP</>} />
			<Route path="/:pageslug?" element={<Page host={BACKEND_HOST} />} />
		</Routes>
	);
}
