import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useToast } from '../components/ToastProvider';
import { setAuth } from '../utils/auth';

function Login() {
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        role,
        name: name.trim(),
        email: email.trim(),
      });

      setAuth(response.data);
      toast.success('Welcome!');
      navigate(role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f5f7fa',
      paddingBottom: '2rem',
      paddingTop: '1.5rem',
    },
    card: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '520px',
      overflow: 'hidden',
      margin: '2rem auto 0',
    },
    cardHeader: {
      background: 'white',
      padding: '2rem',
      textAlign: 'center',
      borderBottom: '1px solid #e5e7eb',
    },
    logo: { fontSize: '3rem', marginBottom: '0.5rem' },
    title: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#111827',
      margin: 0,
      marginBottom: '0.5rem',
    },
    subtitle: { fontSize: '0.875rem', color: '#6b7280', margin: 0 },
    cardBody: { padding: '2rem' },
    formGroup: { marginBottom: '1.1rem' },
    label: {
      fontWeight: '600',
      color: '#374151',
      fontSize: '0.875rem',
      marginBottom: '0.5rem',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      transition: 'all 0.2s',
      outline: 'none',
      backgroundColor: 'white',
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
      background: '#ef4444',
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
    infoText: { fontSize: '0.875rem', color: '#4b5563', margin: 0, lineHeight: '1.5' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.logo}>💼</div>
          <h1 style={styles.title}>Sign in</h1>
          <p style={styles.subtitle}>Enter name, email and role</p>
        </div>

        <div style={styles.cardBody}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Your name"
              onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
              onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
              onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            >
              <option value="user">User - Browse & Apply</option>
              <option value="admin">Admin - Manage</option>
            </select>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}),
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#dc2626';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = '#ef4444';
            }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <div style={styles.infoBox}>
            <p style={styles.infoText}>
              💡 <strong>Admin default:</strong> Dipesh / dipeshpadole3@gmail.com is created automatically on server start.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
