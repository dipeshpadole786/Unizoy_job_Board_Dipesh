import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useToast } from '../components/ToastProvider';

const fmtDate = (value) => {
  try {
    const d = new Date(value);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  } catch {
    return '';
  }
};

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const rows = useMemo(() => (applications || []).map((a) => ({
    id: a._id,
    jobTitle: a.jobId?.title || '—',
    company: a.jobId?.company || '—',
    status: a.status || 'applied',
    appliedAt: a.createdAt,
  })), [applications]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/applications/my');
        setApplications(res.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#111827' }}>My Applications</h1>
          <p style={{ margin: '6px 0 0', color: '#6b7280' }}>Track your application status</p>
        </div>
        <Link to="/" className="bg-white border rounded-md px-4 py-2 focus:outline-none focus:ring-2">
          ← Back to jobs
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="loader">Loading...</div>
        ) : rows.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No applications yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '10px 8px' }}>Job Title</th>
                  <th style={{ padding: '10px 8px' }}>Company</th>
                  <th style={{ padding: '10px 8px' }}>Status</th>
                  <th style={{ padding: '10px 8px' }}>Applied</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 700 }}>{r.jobTitle}</td>
                    <td style={{ padding: '10px 8px', color: '#374151' }}>{r.company}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 800,
                        background: r.status === 'shortlisted' ? '#ecfdf5' : r.status === 'rejected' ? '#fef2f2' : '#eff6ff',
                        border: `1px solid ${r.status === 'shortlisted' ? '#34d399' : r.status === 'rejected' ? '#f87171' : '#60a5fa'}`,
                        color: r.status === 'shortlisted' ? '#065f46' : r.status === 'rejected' ? '#7f1d1d' : '#1e3a8a',
                      }}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', color: '#6b7280' }}>{fmtDate(r.appliedAt)}</td>
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

export default MyApplications;

