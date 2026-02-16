import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

// UI Helpers for dynamic badge colors
const getSeverityBadge = (sev: string) => {
    const styles: Record<string, string> = {
        SEV1: 'bg-red-50 text-red-700 border-red-200',
        SEV2: 'bg-orange-50 text-orange-700 border-orange-200',
        SEV3: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        SEV4: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return styles[sev] || 'bg-gray-50 text-gray-700 border-gray-200';
};

const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
        OPEN: 'bg-red-50 text-red-700 ring-red-600/20',
        MITIGATED: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
        RESOLVED: 'bg-green-50 text-green-700 ring-green-600/20',
    };
    return styles[status] || 'bg-gray-50 text-gray-700 ring-gray-600/20';
};

export default function IncidentList() {
    const [incidents, setIncidents] = useState([]);
    const [meta, setMeta] = useState({ totalPages: 1, page: 1 });
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [status, setStatus] = useState('');
    const [service, setService] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const fetchIncidents = async () => {
            setLoading(true);
            const query = new URLSearchParams({
                page: meta.page.toString(),
                search: debouncedSearch,
                status,
                service,
            });

            try {
                const res = await fetch(`http://localhost:3000/api/incidents?${query}`);
                const data = await res.json();
                setIncidents(data.data);
                setMeta(data.meta);
            } catch (err) {
                console.error("Failed to fetch", err);
            } finally {
                setLoading(false);
            }
        };
        fetchIncidents();
    }, [meta.page, debouncedSearch, status, service]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Filters */}
            <div className="p-5 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search incidents by title..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setMeta({ ...meta, page: 1 }); }}
                    />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => { setStatus(e.target.value); setMeta({ ...meta, page: 1 }); }}
                    >
                        <option value="">All Statuses</option>
                        <option value="OPEN">Open</option>
                        <option value="MITIGATED">Mitigated</option>
                        <option value="RESOLVED">Resolved</option>
                    </select>
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => { setService(e.target.value); setMeta({ ...meta, page: 1 }); }}
                    >
                        <option value="">All Services</option>
                        <option value="Backend">Backend</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Auth">Auth</option>
                        <option value="Database">Database</option>
                        <option value="Payments">Payments</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Severity</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Created At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                        <span>Loading incidents...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : incidents.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p>No incidents found matching your criteria.</p>
                                </td>
                            </tr>
                        ) : (
                            incidents.map((inc: any) => (
                                <tr key={inc.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <Link to={`/incident/${inc.id}`} className="text-blue-600 font-medium hover:text-blue-800 group-hover:underline">
                                            {inc.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{inc.service}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getSeverityBadge(inc.severity)}`}>
                                            {inc.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadge(inc.status)}`}>
                                            {inc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(inc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
                <span className="text-sm text-gray-700">
                    Page <span className="font-medium">{meta.page}</span> of <span className="font-medium">{meta.totalPages}</span>
                </span>
                <div className="flex gap-2">
                    <button
                        disabled={meta.page === 1}
                        onClick={() => setMeta({ ...meta, page: meta.page - 1 })}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </button>
                    <button
                        disabled={meta.page === meta.totalPages}
                        onClick={() => setMeta({ ...meta, page: meta.page + 1 })}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}