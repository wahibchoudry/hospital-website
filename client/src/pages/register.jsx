import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
    padding: '2rem',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  title: { textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' },
  subtitle: { textAlign: 'center', color: '#718096', fontSize: '0.9rem', marginBottom: '2rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', marginBottom: '0.4rem' },
  input: {
    width: '100%', padding: '0.75rem 1rem', border: '2px solid #e2e8f0',
    borderRadius: '8px', fontSize: '1rem', outline: 'none', marginBottom: '1.2rem',
  },
  btn: {
    width: '100%', padding: '0.85rem', background: '#276749',
    color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
  },
  success: {
    background: '#f0fff4', border: '1px solid #9ae6b4', color: '#276749',
    padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem',
  },
  error: {
    background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030',
    padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem',
  },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#718096', fontSize: '0.9rem' },
  footerLink: { color: '#2b6cb0', fontWeight: '600' },
};

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏥 Doctor Registration</h1>
        <p style={styles.subtitle}>Create your account to access patient records</p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full name</label>
          <input style={styles.input} placeholder="Dr. Ahmed Khan" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />

          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" placeholder="doctor@hospital.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />

          <label style={styles.label}>Specialization</label>
          <input style={styles.input} placeholder="Cardiology, General, Pediatrics..." value={form.specialization}
            onChange={e => setForm({ ...form, specialization: e.target.value })} />

          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" placeholder="Minimum 6 characters" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} minLength={6} required />

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Create account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already registered? <Link to="/login" style={styles.footerLink}>Login here</Link>
        </p>
      </div>
    </div>
  );
}