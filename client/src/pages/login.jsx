import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)' },
  card: { background: 'white', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', margin: '1rem' },
  logo: { textAlign: 'center', marginBottom: '1rem', fontSize: '3rem' },
  title: { textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', marginBottom: '0.25rem' },
  subtitle: { textAlign: 'center', color: '#718096', fontSize: '0.9rem', marginBottom: '1.5rem' },
  roleRow: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  roleBtn: (active, color) => ({
    flex: 1, padding: '0.6rem', border: `2px solid ${active ? color : '#e2e8f0'}`,
    borderRadius: '8px', background: active ? color : 'white',
    color: active ? 'white' : '#4a5568', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
  }),
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', outline: 'none', marginBottom: '1.2rem' },
  btn: (color) => ({ width: '100%', padding: '0.85rem', background: color, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', marginTop: '0.5rem' }),
  error: { background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#718096', fontSize: '0.9rem' },
  footerLink: { color: '#2b6cb0', fontWeight: '600' },
};

const roles = [
  { key: 'doctor', label: '🩺 Doctor', color: '#2b6cb0' },
  { key: 'patient', label: '🧑 Patient', color: '#276749' },
  { key: 'clinic', label: '🏪 Clinic', color: '#6b46c1' },
];

export default function Login() {
  const [role, setRole] = useState('doctor');
  const [form, setForm] = useState({ email: '', password: '', cnicId: '', phone: '', clinicCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (role === 'doctor') {
        res = await api.post('/auth/login', { email: form.email, password: form.password });
        login(res.data.token, res.data.doctor, 'doctor');
        navigate('/doctor-dashboard');
      } else if (role === 'patient') {
        res = await api.post('/auth/patient-login', { cnicId: form.cnicId, phone: form.phone });
        login(res.data.token, res.data.patient, 'patient');
        navigate('/patient-dashboard');
      } else {
        res = await api.post('/auth/clinic-login', { clinicCode: form.clinicCode });
        login(res.data.token, res.data.clinic, 'clinic');
        navigate('/clinic-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const activeColor = roles.find(r => r.key === role)?.color || '#2b6cb0';

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🏥</div>
        <h1 style={s.title}>Hospital Hub</h1>
        <p style={s.subtitle}>Select your role to login</p>

        <div style={s.roleRow}>
          {roles.map(r => (
            <button key={r.key} style={s.roleBtn(role === r.key, r.color)} onClick={() => { setRole(r.key); setError(''); }}>
              {r.label}
            </button>
          ))}
        </div>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {role === 'doctor' && <>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="doctor@hospital.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="Your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </>}

          {role === 'patient' && <>
            <label style={s.label}>CNIC Number</label>
            <input style={s.input} placeholder="e.g. 3520212345678" value={form.cnicId} onChange={e => setForm({...form, cnicId: e.target.value})} required />
            <label style={s.label}>Phone number (registered with hospital)</label>
            <input style={s.input} placeholder="03001234567" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
          </>}

          {role === 'clinic' && <>
            <label style={s.label}>Clinic access code</label>
            <input style={s.input} type="password" placeholder="Enter clinic code" value={form.clinicCode} onChange={e => setForm({...form, clinicCode: e.target.value})} required />
          </>}

          <button style={s.btn(activeColor)} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : `Login as ${roles.find(r=>r.key===role)?.label}`}
          </button>
        </form>

        {role === 'doctor' && (
          <p style={s.footer}>New doctor? <Link to="/register" style={s.footerLink}>Register here</Link></p>
        )}
        {role === 'patient' && (
          <p style={s.footer}>Use your CNIC number and the phone number the doctor registered for you.</p>
        )}
        {role === 'clinic' && (
          <p style={s.footer}>Contact the hospital admin for your clinic access code.</p>
        )}
      </div>
    </div>
  );
}