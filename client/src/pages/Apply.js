import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { useToast } from '../components/ToastProvider';
import { getRole } from '../utils/auth';

function Apply() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [resumeLink, setResumeLink] = useState('');

  const toast = useToast();
  const role = getRole();

  const myApp = useMemo(() => {
    return myApplications.find((a) => String(a?.jobId?._id || a?.jobId) === String(jobId)) || null;
  }, [myApplications, jobId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [jobRes, appsRes] = await Promise.all([
          api.get(`/jobs/${jobId}`),
          role === 'user' ? api.get('/applications/my') : Promise.resolve({ data: [] }),
        ]);
        setJob(jobRes.data);
        setMyApplications(appsRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load job');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId, role]);

  const handleApply = async () => {
    const trimmed = resumeLink.trim();
    if (!trimmed) {
      toast.error('Resume link is required');
      return;
    }
    if (!/^https?:\/\/.+/i.test(trimmed)) {
      toast.error('Please enter a valid resume URL (http/https)');
      return;
    }

    setApplying(true);
    try {
      const res = await api.post('/applications/apply', { jobId, resume: trimmed });
      setMyApplications((prev) => [res.data.application, ...prev]);
      toast.success('Application submitted');
      setResumeLink('');
    } catch (err) {
      if (err?.response?.status === 409) {
        toast.info('You already applied for this job');
        return;
      }
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div style={{ color: '#b91c1c', fontWeight: 700 }}>{error}</div>
        <div style={{ marginTop: 10 }}>
          <Link to="/" className="inline-block">← Back to jobs</Link>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#111827' }}>{job.title}</h1>
            <div style={{ marginTop: 6, color: '#6b7280' }}>
              {(job.company || '—')} • {job.location}
            </div>
          </div>
          {myApp ? (
            <div style={{
              height: 30,
              padding: '0 12px',
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              fontSize: 12,
              fontWeight: 800,
              background: myApp.status === 'shortlisted' ? '#ecfdf5' : myApp.status === 'rejected' ? '#fef2f2' : '#eff6ff',
              border: `1px solid ${myApp.status === 'shortlisted' ? '#34d399' : myApp.status === 'rejected' ? '#f87171' : '#60a5fa'}`,
              color: myApp.status === 'shortlisted' ? '#065f46' : myApp.status === 'rejected' ? '#7f1d1d' : '#1e3a8a',
              whiteSpace: 'nowrap',
            }}>
              {myApp.status.toUpperCase()}
            </div>
          ) : null}
        </div>

        <p style={{ marginTop: 14, color: '#374151', lineHeight: 1.6 }}>{job.description}</p>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <Link
            to="/"
            className="bg-white border rounded-md px-4 py-2 focus:outline-none focus:ring-2"
            style={{ textAlign: 'center' }}
          >
            ← Back
          </Link>

          {role === 'user' ? (
            <div style={{ marginLeft: 'auto', minWidth: 320 }}>
              {!myApp ? (
                <>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#374151', marginBottom: 6 }}>
                    Resume link
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      value={resumeLink}
                      onChange={(e) => setResumeLink(e.target.value)}
                      placeholder="https://drive.google.com/your-resume"
                      className="border rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2"
                    />
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="bg-blue-600 text-white rounded-md px-4 py-2 transition-colors"
                      style={{
                        opacity: applying ? 0.65 : 1,
                        cursor: applying ? 'not-allowed' : 'pointer',
                        minWidth: 120,
                      }}
                    >
                      {applying ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </>
              ) : (
                <button
                  disabled
                  className="bg-blue-600 text-white rounded-md px-4 py-2 transition-colors"
                  style={{
                    width: '100%',
                    opacity: 0.65,
                    cursor: 'not-allowed',
                  }}
                >
                  Already Applied
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {role === 'user' ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div style={{ fontWeight: 800, marginBottom: 6 }}>After applying</div>
          <div style={{ color: '#6b7280' }}>
            Track status in <Link to="/my-applications">My Applications</Link>.
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Apply;
