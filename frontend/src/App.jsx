import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PortfolioPage from './pages/PortfolioPage';
import StockListPage from './pages/StockListPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/stocks" element={<StockListPage />} />
      </Routes>
    </BrowserRouter>
  );
}