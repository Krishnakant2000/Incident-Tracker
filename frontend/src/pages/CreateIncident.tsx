import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function CreateIncident() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        service: '',
        severity: 'SEV1', // Default selection
        status: 'OPEN',   // Default selection
        owner: '',
        summary: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic Validation
        if (!formData.title || !formData.service || !formData.status) {
            setError('Title, Service, and Status are required.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/incidents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to create incident');

            // Navigate back to the list on success
            navigate('/');
        } catch (err) {
            setError('An error occurred while creating the incident.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded shadow max-w-2xl mx-auto">
            <div className="border-b px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800">Create New Incident</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Issue Title..."
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gray-800 outline-none"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Service */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                    <select
                        name="service"
                        className="w-full border rounded px-3 py-2 bg-white outline-none"
                        value={formData.service}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select Service</option>
                        <option value="Backend">Backend</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Auth">Auth</option>
                        <option value="Database">Database</option>
                        <option value="Payments">Payments</option>
                    </select>
                </div>

                {/* Severity (Radio Buttons per wireframe) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                    <div className="flex gap-4">
                        {['SEV1', 'SEV2', 'SEV3', 'SEV4'].map((sev) => (
                            <label key={sev} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="severity"
                                    value={sev}
                                    checked={formData.severity === sev}
                                    onChange={handleChange}
                                    className="accent-gray-800"
                                />
                                {sev}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        name="status"
                        className="w-full border rounded px-3 py-2 bg-white outline-none"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="OPEN">Open</option>
                        <option value="MITIGATED">Mitigated</option>
                        <option value="RESOLVED">Resolved</option>
                    </select>
                </div>

                {/* Assigned To (Owner) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <input
                        type="text"
                        name="owner"
                        placeholder="Optional"
                        className="w-full border rounded px-3 py-2 outline-none"
                        value={formData.owner}
                        onChange={handleChange}
                    />
                </div>

                {/* Summary */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                    <textarea
                        name="summary"
                        placeholder="Describe the incident..."
                        rows={4}
                        className="w-full border rounded px-3 py-2 outline-none"
                        value={formData.summary}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Incident'}
                    </button>
                    <Link
                        to="/"
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}