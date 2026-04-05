import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useToast } from '../components/ToastProvider';
import { getRole } from '../utils/auth';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applyJobId, setApplyJobId] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();
  const role = getRole();

  const myAppByJobId = useMemo(() => {
    const map = new Map();
    myApplications.forEach((a) => {
      const key = a?.jobId?._id || a?.jobId;
      if (key) map.set(String(key), a);
    });
    return map;
  }, [myApplications]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const requests = [api.get('/jobs')];
        if (role === 'user') requests.push(api.get('/applications/my'));

        const [jobsRes, myAppsRes] = await Promise.all(requests);
        setJobs(jobsRes.data || []);
        setMyApplications(myAppsRes?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  const handleApply = async (jobId, resume) => {
    const trimmed = (resume || '').trim();
    if (!trimmed) {
      toast.error('Resume link is required');
      return;
    }
    if (!/^https?:\/\/.+/i.test(trimmed)) {
      toast.error('Please enter a valid resume URL (http/https)');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/applications/apply', { jobId, resume: trimmed });
      setMyApplications((prev) => [res.data.application, ...prev]);
      toast.success('Application submitted');
      setApplyJobId('');
      setResumeLink('');
    } catch (err) {
      if (err?.response?.status === 409) {
        toast.info('You already applied for this job');
        try {
          const appsRes = await api.get('/applications/my');
          setMyApplications(appsRes.data || []);
        } catch {
          // ignore
        }
        setApplyJobId('');
        setResumeLink('');
        return;
      }
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#111827' }}>Jobs</h1>
          <p style={{ margin: '6px 0 0', color: '#6b7280' }}>Browse listings and apply in one click</p>
        </div>
        {role === 'user' ? (
          <Link to="/my-applications" className="bg-white rounded-lg shadow-md p-4 inline-block transition-colors">
            View My Applications →
          </Link>
        ) : null}
      </div>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : error ? (
        <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 12, padding: 12, color: '#b91c1c' }}>
          {error}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div style={{ fontSize: 44, marginBottom: 10 }}>📭</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>No jobs available</div>
          <div style={{ marginTop: 6, color: '#6b7280' }}>Please check back later.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {jobs.map((job) => {
            const app = myAppByJobId.get(String(job._id));
            const applied = Boolean(app);
            const status = app?.status || '';

            return (
              <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{job.title}</div>
                    <div style={{ marginTop: 4, color: '#6b7280', fontSize: 14 }}>
                      {(job.company || '—')} • {job.location}
                    </div>
                  </div>
                  {applied ? (
                    <div style={{
                      height: 28,
                      padding: '0 10px',
                      borderRadius: 999,
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      background: status === 'shortlisted' ? '#ecfdf5' : status === 'rejected' ? '#fef2f2' : '#eff6ff',
                      border: `1px solid ${status === 'shortlisted' ? '#34d399' : status === 'rejected' ? '#f87171' : '#60a5fa'}`,
                      color: status === 'shortlisted' ? '#065f46' : status === 'rejected' ? '#7f1d1d' : '#1e3a8a',
                      whiteSpace: 'nowrap',
                    }}>
                      {status.toUpperCase()}
                    </div>
                  ) : null}
                </div>

                <p style={{ marginTop: 10, marginBottom: 14, color: '#374151', lineHeight: 1.5 }}>
                  {job.description}
                </p>

                <div style={{ display: 'flex', gap: 10 }}>
                  <Link
                    to={`/apply/${job._id}`}
                    className="bg-white border rounded-md px-4 py-2 focus:outline-none focus:ring-2"
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Details
                  </Link>

                  {role === 'user' ? (
                    <button
                      onClick={() => {
                        setApplyJobId(job._id);
                        setResumeLink('');
                      }}
                      disabled={applied}
                      className="bg-blue-600 text-white rounded-md px-4 py-2 transition-colors"
                      style={{
                        flex: 1,
                        opacity: applied ? 0.6 : 1,
                        cursor: applied ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {applied ? 'Applied' : 'Apply'}
                    </button>
                  ) : null}
                </div>

                {role === 'user' && !applied && applyJobId === job._id ? (
                  <div style={{ marginTop: 12, borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#374151', marginBottom: 8 }}>
                      Add resume link
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <input
                        value={resumeLink}
                        onChange={(e) => setResumeLink(e.target.value)}
                        placeholder="https://drive.google.com/your-resume"
                        className="border rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2"
                        style={{ flex: 1, minWidth: 240 }}
                      />
                      <button
                        onClick={() => handleApply(job._id, resumeLink)}
                        disabled={submitting}
                        className="bg-blue-600 text-white rounded-md px-4 py-2 transition-colors"
                        style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                      >
                        {submitting ? 'Submitting...' : 'Submit'}
                      </button>
                      <button
                        onClick={() => {
                          setApplyJobId('');
                          setResumeLink('');
                        }}
                        className="bg-white border rounded-md px-4 py-2 focus:outline-none focus:ring-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Home;
