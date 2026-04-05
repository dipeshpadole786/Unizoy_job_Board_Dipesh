import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { useToast } from '../components/ToastProvider';

const fmtDateTime = (value) => {
  try {
    const d = new Date(value);
    return d.toLocaleString();
  } catch {
    return '';
  }
};

function AdminApplications() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState('');

  const toast = useToast();

  const rows = useMemo(() => (applications || []).map((a) => {
    const user = a.userId || {};
    return {
      id: a._id,
      name: user.name || '—',
      email: user.email || '—',
      resume: a.resume || user.resume || '',
      status: a.status || 'applied',
      createdAt: a.createdAt,
    };
  }), [applications]);

  const load = async () => {
    setLoading(true);
    try {
      const [jobRes, appsRes] = await Promise.all([
        api.get(`/jobs/${jobId}`),
        api.get(`/applications/job/${jobId}`),
      ]);
      setJob(jobRes.data);
      setApplications(appsRes.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const updateStatus = async (applicationId, status) => {
    setSavingId(applicationId);
    try {
      await api.put(`/applications/${applicationId}/status`, { status });
      setApplications((prev) => prev.map((a) => (a._id === applicationId ? { ...a, status } : a)));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSavingId('');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#111827' }}>Applications</h1>
          <p style={{ margin: '6px 0 0', color: '#6b7280' }}>
            {job ? `${job.title} • ${job.company || '—'} • ${job.location}` : 'Job'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin" className="bg-white border rounded-md px-4 py-2 focus:outline-none focus:ring-2">
            ← Back
          </Link>
          <button
            onClick={load}
            disabled={loading}
            className="bg-white border rounded-md px-4 py-2 focus:outline-none focus:ring-2"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="loader">Loading...</div>
        ) : rows.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No applications for this job yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '10px 8px' }}>Applicant</th>
                  <th style={{ padding: '10px 8px' }}>Email</th>
                  <th style={{ padding: '10px 8px' }}>Resume</th>
                  <th style={{ padding: '10px 8px' }}>Applied</th>
                  <th style={{ padding: '10px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 800 }}>{r.name}</td>
                    <td style={{ padding: '10px 8px', color: '#374151' }}>{r.email}</td>
                    <td style={{ padding: '10px 8px' }}>
                      {r.resume ? (
                        <a href={r.resume} target="_blank" rel="noreferrer">View</a>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 8px', color: '#6b7280' }}>{fmtDateTime(r.createdAt)}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <select
                        value={r.status}
                        disabled={savingId === r.id}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2"
                        style={{ opacity: savingId === r.id ? 0.7 : 1 }}
                      >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlist</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminApplications;

