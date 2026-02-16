import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function IncidentList() {
    const [incidents, setIncidents] = useState([]);
    const [meta, setMeta] = useState({ totalPages: 1, page: 1 });
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [status, setStatus] = useState('');
    const [service, setService] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch data
    useEffect(() => {
        const fetchIncidents = async () => {
            setLoading(true);
            const query = new URLSearchParams({
                page: meta.page.toString(),
                search: debouncedSearch,
                status,
                service,
            });

            const res = await fetch(`http://localhost:3000/api/incidents?${query}`);
            const data = await res.json();
            setIncidents(data.data);
            setMeta(data.meta);
            setLoading(false);
        };
        fetchIncidents();
    }, [meta.page, debouncedSearch, status, service]);

    return (
        <div className="bg-white rounded shadow p-6">
            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search incidents..."
                    className="border rounded px-3 py-2 flex-grow"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setMeta({ ...meta, page: 1 }); }}
                />
                <select className="border rounded px-3 py-2" onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="MITIGATED">Mitigated</option>
                    <option value="RESOLVED">Resolved</option>
                </select>
                <select className="border rounded px-3 py-2" onChange={(e) => setService(e.target.value)}>
                    <option value="">All Services</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Auth">Auth</option>
                    <option value="Database">Database</option>
                    <option value="Payments">Payments</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading incidents...</div>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">Title</th>
                            <th>Service</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.map((inc: any) => (
                            <tr key={inc.id} className="border-b hover:bg-gray-50">
                                <td className="py-3">
                                    <Link to={`/incident/${inc.id}`} className="text-blue-600 hover:underline">{inc.title}</Link>
                                </td>
                                <td>{inc.service}</td>
                                <td><span className="bg-gray-200 px-2 py-1 rounded text-xs">{inc.severity}</span></td>
                                <td>{inc.status}</td>
                                <td>{new Date(inc.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <button
                    disabled={meta.page === 1}
                    onClick={() => setMeta({ ...meta, page: meta.page - 1 })}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >Previous</button>
                <span>Page {meta.page} of {meta.totalPages}</span>
                <button
                    disabled={meta.page === meta.totalPages}
                    onClick={() => setMeta({ ...meta, page: meta.page + 1 })}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >Next</button>
            </div>
        </div>
    );
}