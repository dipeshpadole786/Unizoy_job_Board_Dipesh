import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useToast } from '../components/ToastProvider';

function Admin() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  const toast = useToast();

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await api.get('/jobs');
      setJobs(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/jobs', {
        title,
        company,
        description,
        location,
      });

      toast.success('Job created');
      setJobs((prev) => [response.data, ...prev]);
      setTitle('');
      setCompany('');
      setDescription('');
      setLocation('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#111827' }}>Admin</h1>
          <p style={{ margin: '6px 0 0', color: '#6b7280' }}>Create jobs and manage applications</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Create Job</div>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Title</div>
              <input className="border rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Company</div>
              <input className="border rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Location</div>
              <input className="border rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Description</div>
            <textarea className="border rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded-md px-4 py-2 transition-colors"
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Jobs</div>
          <button
            onClick={fetchJobs}
            disabled={jobsLoading}
            className="bg-white border rounded-md px-4 py-2 focus:outline-none focus:ring-2"
            style={{ opacity: jobsLoading ? 0.7 : 1 }}
          >
            {jobsLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
          {jobsLoading ? (
            <div className="loader">Loading...</div>
          ) : jobs.length === 0 ? (
            <div style={{ color: '#6b7280' }}>No jobs yet.</div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 900, color: '#111827' }}>{job.title}</div>
                    <div style={{ marginTop: 4, color: '#6b7280', fontSize: 14 }}>
                      {(job.company || '—')} • {job.location}
                    </div>
                  </div>
                  <Link
                    to={`/admin/jobs/${job._id}/applications`}
                    className="bg-blue-600 text-white rounded-md px-4 py-2 transition-colors"
                    style={{ height: 38, display: 'inline-flex', alignItems: 'center' }}
                  >
                    View Applications →
                  </Link>
                </div>
                <div style={{ marginTop: 10, color: '#374151' }}>{job.description}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;

