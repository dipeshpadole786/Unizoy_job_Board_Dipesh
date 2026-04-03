import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Home() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await api.get('/jobs');
                setJobs(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load jobs');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

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
        stats: {
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem',
        },
        statCard: {
            background: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
        },
        statNumber: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#3b82f6',
        },
        statLabel: {
            fontSize: '0.875rem',
            color: '#6b7280',
        },
        loadingContainer: {
            textAlign: 'center',
            padding: '4rem',
        },
        loader: {
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
        },
        errorContainer: {
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '0.5rem',
            padding: '1rem',
            color: '#c33',
            textAlign: 'center',
        },
        emptyContainer: {
            textAlign: 'center',
            padding: '4rem',
            background: 'white',
            borderRadius: '0.5rem',
        },
        jobsGrid: {
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        },
        jobCard: {
            background: 'white',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
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
            marginBottom: '1rem',
        },
        applyButton: {
            display: 'inline-block',
            background: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '500',
            textAlign: 'center',
            width: '100%',
        },
    };

    const handleLogout = () => {
        localStorage.removeItem('role');
        window.location.href = '/login';
    };

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <div style={styles.navContent}>
                    <div style={styles.logo}>JobPortal</div>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </nav>

            <div style={styles.main}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Available Job Listings</h1>
                    <p style={styles.subtitle}>Find your dream job and take the next step in your career</p>
                    {!loading && jobs.length > 0 && (
                        <div style={styles.stats}>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{jobs.length}</div>
                                <div style={styles.statLabel}>Open Positions</div>
                            </div>
                        </div>
                    )}
                </div>

                {loading && (
                    <div style={styles.loadingContainer}>
                        <div style={styles.loader}></div>
                        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading jobs...</p>
                    </div>
                )}

                {error && (
                    <div style={styles.errorContainer}>
                        ⚠️ {error}
                    </div>
                )}

                {!loading && jobs.length === 0 && !error && (
                    <div style={styles.emptyContainer}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Jobs Available</h3>
                        <p style={{ color: '#6b7280' }}>No jobs posted yet. Please check back later!</p>
                    </div>
                )}

                {!loading && jobs.length > 0 && (
                    <div style={styles.jobsGrid}>
                        {jobs.map((job) => (
                            <div
                                key={job._id}
                                style={styles.jobCard}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={styles.jobCardHeader}>
                                    <h3 style={styles.jobTitle}>{job.title}</h3>
                                </div>
                                <div style={styles.jobCardBody}>
                                    <p style={styles.jobDescription}>{job.description}</p>
                                    <p style={styles.jobLocation}>📍 {job.location}</p>
                                    <Link
                                        to={`/apply/${job._id}`}
                                        style={styles.applyButton}
                                        onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                                        onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                                    >
                                        Apply Now →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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

export default Home;