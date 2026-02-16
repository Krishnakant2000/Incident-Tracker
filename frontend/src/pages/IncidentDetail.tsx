import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function IncidentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [incident, setIncident] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Editable Form State
    const [editData, setEditData] = useState({
        severity: '',
        status: '',
        owner: '',
        summary: '',
    });

    // Fetch Incident on mount
    useEffect(() => {
        const fetchIncident = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/incidents/${id}`);
                if (!res.ok) throw new Error('Incident not found');
                const data = await res.json();

                setIncident(data);
                // Initialize editable fields with fetched data
                setEditData({
                    severity: data.severity,
                    status: data.status,
                    owner: data.owner || '',
                    summary: data.summary || '',
                });
            } catch (err) {
                setError('Could not load incident details.');
            } finally {
                setLoading(false);
            }
        };
        fetchIncident();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');

        try {
            const res = await fetch(`http://localhost:3000/api/incidents/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });

            if (!res.ok) throw new Error('Failed to update');
            navigate('/'); // Return to list after saving
        } catch (err) {
            setError('Failed to save changes.');
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading incident details...</div>;
    if (!incident) return <div className="text-center py-10 text-red-600">{error}</div>;

    return (
        <div className="bg-white rounded shadow max-w-3xl mx-auto">
            <div className="border-b px-6 py-4">
                <h2 className="text-2xl font-bold text-gray-800">{incident.title}</h2>
            </div>

            <div className="p-6 space-y-6">
                {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

                <div className="grid grid-cols-2 gap-6">
                    {/* Static Fields */}
                    <div>
                        <span className="block text-sm font-medium text-gray-500 mb-1">Service</span>
                        <span className="text-gray-900">{incident.service}</span>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-gray-500 mb-1">Occurred At</span>
                        <span className="text-gray-900">
                            {new Date(incident.createdAt).toLocaleString()}
                        </span>
                    </div>

                    {/* Editable Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                        <select
                            name="severity"
                            className="w-full border rounded px-3 py-2 bg-white"
                            value={editData.severity}
                            onChange={handleChange}
                        >
                            <option value="SEV1">SEV1</option>
                            <option value="SEV2">SEV2</option>
                            <option value="SEV3">SEV3</option>
                            <option value="SEV4">SEV4</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            className="w-full border rounded px-3 py-2 bg-white"
                            value={editData.status}
                            onChange={handleChange}
                        >
                            <option value="OPEN">Open</option>
                            <option value="MITIGATED">Mitigated</option>
                            <option value="RESOLVED">Resolved</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <input
                        type="text"
                        name="owner"
                        className="w-1/2 border rounded px-3 py-2"
                        value={editData.owner}
                        onChange={handleChange}
                        placeholder="e.g. dev@team.com"
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                    <textarea
                        name="summary"
                        rows={5}
                        className="w-full border rounded px-3 py-2"
                        value={editData.summary}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t mt-8">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <Link
                        to="/"
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200"
                    >
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    );
}