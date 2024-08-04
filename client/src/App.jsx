import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<>CIAO1</>} />
      <Route path="/products/:slug" element={<>CIAO2</>} />
    </Routes>
  );
}
