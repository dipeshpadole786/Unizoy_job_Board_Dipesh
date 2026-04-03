import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!role) {
            alert('Please select a role');
            return;
        }
        localStorage.setItem('role', role);
        if (role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f7fa',
            padding: '1rem',
        },
        card: {
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '450px',
            overflow: 'hidden',
        },
        cardHeader: {
            background: 'white',
            padding: '2rem',
            textAlign: 'center',
            borderBottom: '1px solid #e5e7eb',
        },
        logo: {
            fontSize: '3rem',
            marginBottom: '0.5rem',
        },
        title: {
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#111827',
            margin: 0,
            marginBottom: '0.5rem',
        },
        subtitle: {
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0,
        },
        cardBody: {
            padding: '2rem',
        },
        formGroup: {
            marginBottom: '1.5rem',
        },
        label: {
            fontWeight: '600',
            color: '#374151',
            fontSize: '0.875rem',
            marginBottom: '0.5rem',
            display: 'block',
        },
        select: {
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            transition: 'all 0.2s',
            outline: 'none',
            backgroundColor: 'white',
        },
        button: {
            width: '100%',
            background: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
        },
        infoBox: {
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '0.5rem',
            borderLeft: '4px solid #3b82f6',
        },
        infoText: {
            fontSize: '0.875rem',
            color: '#4b5563',
            margin: 0,
            lineHeight: '1.5',
        },
        demoCredentials: {
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            color: '#6b7280',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <div style={styles.logo}>💼</div>
                    <h1 style={styles.title}>Welcome Back</h1>
                    <p style={styles.subtitle}>Sign in to continue to Job Portal</p>
                </div>

                <div style={styles.cardBody}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Select Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={styles.select}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        >
                            <option value="">Choose your role...</option>
                            <option value="user">👨‍💼 User - Browse & Apply for Jobs</option>
                            <option value="admin">👨‍💻 Admin - Manage Jobs & Applications</option>
                        </select>
                    </div>

                    <button
                        onClick={handleLogin}
                        style={styles.button}
                        onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                    >
                        Continue →
                    </button>

                    <div style={styles.infoBox}>
                        <p style={styles.infoText}>
                            💡 <strong>Demo Access:</strong><br />
                            • <strong>Admin:</strong> Full access to manage jobs<br />
                            • <strong>User:</strong> Browse and apply for jobs
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;