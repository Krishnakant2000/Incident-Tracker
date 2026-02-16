import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import IncidentList from './pages/IncidentList';
import IncidentDetail from './pages/IncidentDetail';
import CreateIncident from './pages/CreateIncident';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">Incident Tracker</Link>
          <Link to="/create" className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
            New Incident
          </Link>
        </header>
        <main className="p-6 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<IncidentList />} />
            <Route path="/incident/:id" element={<IncidentDetail />} />
            <Route path="/create" element={<CreateIncident />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}