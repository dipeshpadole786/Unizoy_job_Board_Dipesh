import { useState, useEffect } from 'react';
import api from '../api';

function Admin() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, appsRes] = await Promise.all([
                    api.get('/jobs'),
                    api.get('/apply')
                ]);
                setJobs(jobsRes.data);
                setApplications(appsRes.data);
            } catch (err) {
                console.error('Failed to fetch data', err);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await api.post('/jobs', { title, description, location });
            setMessage(`Job created: ${response.data.title}`);
            setJobs([...jobs, response.data]);
            setTitle('');
            setDescription('');
            setLocation('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create job');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('role');
        window.location.href = '/login';
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: '#f5f7fa',
        },
        navbar: {
            background: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1rem 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
        },
        navContent: {
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        logo: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#3b82f6',
        },
        logoutBtn: {
            background: '#ef4444',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
        },
        main: {
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '2rem',
        },
        header: {
            marginBottom: '2rem',
        },
        title: {
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem',
        },
        subtitle: {
            color: '#6b7280',
            fontSize: '1rem',
        },
        card: {
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
            overflow: 'hidden',
        },
        cardHeader: {
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
        },
        cardHeaderTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0,
        },
        cardBody: {
            padding: '1.5rem',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
        },
        label: {
            fontWeight: '500',
            color: '#374151',
            fontSize: '0.875rem',
        },
        input: {
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
            outline: 'none',
        },
        textarea: {
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
            resize: 'vertical',
            minHeight: '100px',
            outline: 'none',
        },
        button: {
            background: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
        },
        message: {
            marginTop: '1rem',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
        },
        successMessage: {
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
        },
        errorMessage: {
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
        },
        jobsList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        },
        jobItem: {
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '1rem',
        },
        jobTitle: {
            fontWeight: '600',
            fontSize: '1rem',
            color: '#111827',
            marginBottom: '0.5rem',
        },
        jobDescription: {
            color: '#4b5563',
            fontSize: '0.875rem',
            marginBottom: '0.5rem',
        },
        jobLocation: {
            fontSize: '0.75rem',
            color: '#6b7280',
        },
        applicationsList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        },
        applicationItem: {
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '1rem',
        },
        applicantName: {
            fontWeight: '600',
            fontSize: '1rem',
            color: '#111827',
            marginBottom: '0.5rem',
        },
        applicantEmail: {
            color: '#4b5563',
            fontSize: '0.875rem',
            marginBottom: '0.25rem',
        },
        resumeLink: {
            color: '#3b82f6',
            textDecoration: 'none',
            fontSize: '0.875rem',
        },
        appliedJob: {
            fontSize: '0.875rem',
            color: '#6b7280',
            marginTop: '0.25rem',
        },
        emptyState: {
            textAlign: 'center',
            padding: '3rem',
            color: '#9ca3af',
        },
    };

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <div style={styles.navContent}>
                    <div style={styles.logo}>Admin Dashboard</div>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </nav>

            <div style={styles.main}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Admin Dashboard</h1>
                    <p style={styles.subtitle}>Manage jobs and view applications</p>
                </div>

                {/* Add Job Form */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardHeaderTitle}>Add New Job</h3>
                    </div>
                    <div style={styles.cardBody}>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Job Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={styles.input}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    style={styles.textarea}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    style={styles.input}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    ...styles.button,
                                    ...(loading ? { opacity: 0.6, cursor: 'not-allowed' } : {})
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) e.target.style.background = '#2563eb';
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) e.target.style.background = '#3b82f6';
                                }}
                            >
                                {loading ? 'Adding...' : 'Add Job'}
                            </button>
                        </form>
                        {message && <div style={{ ...styles.message, ...styles.successMessage }}>{message}</div>}
                        {error && <div style={{ ...styles.message, ...styles.errorMessage }}>{error}</div>}
                    </div>
                </div>

                {/* Jobs List */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardHeaderTitle}>All Jobs ({jobs.length})</h3>
                    </div>
                    <div style={styles.cardBody}>
                        {jobs.length === 0 ? (
                            <div style={styles.emptyState}>No jobs yet. Create your first job above!</div>
                        ) : (
                            <div style={styles.jobsList}>
                                {jobs.map((job) => (
                                    <div key={job._id} style={styles.jobItem}>
                                        <h4 style={styles.jobTitle}>{job.title}</h4>
                                        <p style={styles.jobDescription}>{job.description}</p>
                                        <p style={styles.jobLocation}>📍 {job.location}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Applications List */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardHeaderTitle}>All Applications ({applications.length})</h3>
                    </div>
                    <div style={styles.cardBody}>
                        {applications.length === 0 ? (
                            <div style={styles.emptyState}>No applications yet. Check back later!</div>
                        ) : (
                            <div style={styles.applicationsList}>
                                {applications.map((app) => (
                                    <div key={app._id} style={styles.applicationItem}>
                                        <h4 style={styles.applicantName}>👤 {app.name}</h4>
                                        <p style={styles.applicantEmail}>📧 {app.email}</p>
                                        <a
                                            href={app.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={styles.resumeLink}
                                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                        >
                                            📄 View Resume
                                        </a>
                                        <p style={styles.appliedJob}>💼 Applied to: {app.jobId?.title || 'Unknown Job'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;