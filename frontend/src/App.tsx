import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import IncidentList from './pages/IncidentList';
import IncidentDetail from './pages/IncidentDetail';
import CreateIncident from './pages/CreateIncident';
import { AlertCircle } from 'lucide-react';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">Incident Tracker</Link>
          </div>
          <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            + New Incident
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