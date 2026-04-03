import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function Apply() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [resume, setResume] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const loadJob = async () => {
            try {
                const response = await api.get(`/jobs/${jobId}`);
                setJob(response.data);
            } catch (err) {
                setError('Job not found. Go back to home.');
            }
        };

        loadJob();
    }, [jobId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (!email) {
            setError('Email is required');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/apply', { jobId, name, email, resume });
            setMessage(response.data.message);
            setName('');
            setEmail('');
            setResume('');

            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application');
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
            cursor: 'pointer',
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
            maxWidth: '800px',
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
        jobCard: {
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '1.5rem',
            overflow: 'hidden',
        },
        jobCardHeader: {
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
        },
        jobTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0,
        },
        jobCardBody: {
            padding: '1.5rem',
        },
        jobDescription: {
            color: '#4b5563',
            lineHeight: '1.5',
            marginBottom: '1rem',
        },
        jobLocation: {
            fontSize: '0.875rem',
            color: '#6b7280',
        },
        formCard: {
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
        },
        formCardHeader: {
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
        },
        formTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0,
        },
        formCardBody: {
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
        button: {
            background: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginTop: '0.5rem',
        },
        message: {
            marginTop: '1rem',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            textAlign: 'center',
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
    };

    if (!job && !error) {
        return (
            <div style={styles.container}>
                <div style={styles.main}>
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ border: '3px solid #e5e7eb', borderTop: '3px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading job details...</p>
                    </div>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <div style={styles.navContent}>
                    <div style={styles.logo} onClick={() => navigate('/')}>JobPortal</div>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </nav>

            <div style={styles.main}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Apply for Position</h1>
                    <p style={styles.subtitle}>Submit your application to join our team</p>
                </div>

                {error && !job && (
                    <div style={{ ...styles.message, ...styles.errorMessage, marginBottom: '1rem' }}>
                        ⚠️ {error}
                    </div>
                )}

                {job && (
                    <div style={styles.jobCard}>
                        <div style={styles.jobCardHeader}>
                            <h3 style={styles.jobTitle}>Position Details</h3>
                        </div>
                        <div style={styles.jobCardBody}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
                                {job.title}
                            </h4>
                            <p style={styles.jobDescription}>{job.description}</p>
                            <p style={styles.jobLocation}>📍 {job.location}</p>
                        </div>
                    </div>
                )}

                <div style={styles.formCard}>
                    <div style={styles.formCardHeader}>
                        <h3 style={styles.formTitle}>Application Form</h3>
                    </div>
                    <div style={styles.formCardBody}>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Full Name *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={styles.input}
                                    placeholder="John Doe"
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email Address *</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={styles.input}
                                    placeholder="john.doe@example.com"
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Resume Link (URL) *</label>
                                <input
                                    type="url"
                                    value={resume}
                                    onChange={(e) => setResume(e.target.value)}
                                    style={styles.input}
                                    placeholder="https://drive.google.com/your-resume"
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
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>

                            {message && (
                                <div style={{ ...styles.message, ...styles.successMessage }}>
                                    ✅ {message}
                                </div>
                            )}

                            {error && job && (
                                <div style={{ ...styles.message, ...styles.errorMessage }}>
                                    ❌ {error}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Apply;