import { Routes, Route } from 'react-router-dom';
import Hero from './components/hero/Hero';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<><Hero/></>} />
      <Route path="/products/:slug" element={<>CIAO2</>} />
    </Routes>
  );
}
