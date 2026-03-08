import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import HotelDetails from './pages/HotelDetails';
import AddHotel from './pages/AddHotel';

function App() {
  return (
    <BrowserRouter>
      <div className="admin-layout">
        <Header />
        <main className="admin-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-hotel" element={<AddHotel />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
