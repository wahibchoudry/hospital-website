import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const s = {
  page: { padding: '2rem', maxWidth: '640px', margin: '0 auto' },
  back: { color: '#2b6cb0', cursor: 'pointer', marginBottom: '1.5rem', display: 'inline-block', fontWeight: '500' },
  card: { background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  title: { fontSize: '1.4rem', fontWeight: '700', color: '#1a365d', marginBottom: '0.25rem' },
  sub: { color: '#718096', fontSize: '0.9rem', marginBottom: '2rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', outline: 'none', marginBottom: '1.2rem' },
  select: { width: '100%', padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', outline: 'none', marginBottom: '1.2rem', background: 'white' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  btn: { width: '100%', padding: '0.85rem', background: '#276749', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600' },
  success: { background: '#f0fff4', border: '1px solid #9ae6b4', color: '#276749', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' },
  error: { background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' },
};

export default function AddPatient() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ patientId: '', name: '', age: '', gender: 'Male', phone: '', bloodGroup: '', address: '', allergies: 'None' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/patients', form);
      setSuccess(`Patient ${data.name} (${data.patientId}) registered successfully!`);
      setTimeout(() => navigate(`/patient/${data.patientId}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <span style={s.back} onClick={() => navigate('/')}>← Back to dashboard</span>
      <div style={s.card}>
        <h1 style={s.title}>Register new patient</h1>
        <p style={s.sub}>Fill in the patient details below</p>

        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.row}>
            <div>
              <label style={s.label}>Patient ID *</label>
              <input style={{ ...s.input, textTransform: 'uppercase' }} placeholder="PT001" value={form.patientId} onChange={set('patientId')} required />
            </div>
            <div>
              <label style={s.label}>Full name *</label>
              <input style={s.input} placeholder="Ali Hassan" value={form.name} onChange={set('name')} required />
            </div>
          </div>

          <div style={s.row}>
            <div>
              <label style={s.label}>Age *</label>
              <input style={s.input} type="number" placeholder="35" value={form.age} onChange={set('age')} min="0" max="150" required />
            </div>
            <div>
              <label style={s.label}>Gender *</label>
              <select style={s.select} value={form.gender} onChange={set('gender')}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div style={s.row}>
            <div>
              <label style={s.label}>Phone number</label>
              <input style={s.input} placeholder="0300-1234567" value={form.phone} onChange={set('phone')} />
            </div>
            <div>
              <label style={s.label}>Blood group</label>
              <select style={s.select} value={form.bloodGroup} onChange={set('bloodGroup')}>
                <option value="">Unknown</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg}>{bg}</option>)}
              </select>
            </div>
          </div>

          <label style={s.label}>Address</label>
          <input style={s.input} placeholder="City, Province" value={form.address} onChange={set('address')} />

          <label style={s.label}>Known allergies</label>
          <input style={s.input} placeholder="Penicillin, Sulfa drugs... or None" value={form.allergies} onChange={set('allergies')} />

          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register patient'}
          </button>
        </form>
      </div>
    </div>
  );
}