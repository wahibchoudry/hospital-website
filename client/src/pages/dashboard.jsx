import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const s = {
  page: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  welcome: { fontSize: '1.5rem', fontWeight: '700', color: '#1a365d', marginBottom: '0.25rem' },
  sub: { color: '#718096', marginBottom: '2rem' },
  searchCard: {
    background: 'white', borderRadius: '16px', padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '2rem',
  },
  searchTitle: { fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#2d3748' },
  searchRow: { display: 'flex', gap: '1rem' },
  input: {
    flex: 1, padding: '0.75rem 1rem', border: '2px solid #e2e8f0',
    borderRadius: '8px', fontSize: '1rem', outline: 'none',
  },
  btn: {
    padding: '0.75rem 1.5rem', background: '#2b6cb0', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
  },
  error: {
    background: '#fff5f5', color: '#c53030', padding: '0.75rem 1rem',
    borderRadius: '8px', marginTop: '1rem', fontSize: '0.9rem',
  },
  resultCard: {
    background: '#ebf8ff', border: '2px solid #90cdf4', borderRadius: '12px',
    padding: '1.5rem', marginTop: '1rem', cursor: 'pointer',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  patientName: { fontSize: '1.1rem', fontWeight: '700', color: '#1a365d' },
  patientMeta: { color: '#4a5568', fontSize: '0.9rem', marginTop: '0.25rem' },
  viewBtn: {
    background: '#2b6cb0', color: 'white', border: 'none',
    padding: '0.5rem 1.2rem', borderRadius: '8px', fontWeight: '600',
  },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' },
  statCard: {
    background: 'white', borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center',
  },
  statNum: { fontSize: '2.5rem', fontWeight: '700', color: '#2b6cb0' },
  statLabel: { color: '#718096', fontSize: '0.9rem', marginTop: '0.25rem' },
};

export default function Dashboard() {
  const { doctor } = useAuth();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const { data } = await api.get(`/patients/search/${query.trim()}`);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <h1 style={s.welcome}>Good day, Dr. {doctor?.name} 👋</h1>
      <p style={s.sub}>{doctor?.specialization} · Search any patient by their CNIC to view full medical history</p>

      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={s.statNum}>🔍</div>
          <div style={s.statLabel}>Search by CNIC</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statNum}>📋</div>
          <div style={s.statLabel}>View prescriptions</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statNum}>➕</div>
          <div style={s.statLabel}>Add new records</div>
        </div>
      </div>

      <div style={{ ...s.searchCard, marginTop: '2rem' }}>
        <p style={s.searchTitle}>🔍 Search patient by CNIC</p>
        <form onSubmit={handleSearch}>
          <div style={s.searchRow}>
            <input
              style={s.input}
              placeholder="Enter CNIC number (e.g. 3520212345678)"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button style={s.btn} type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && <div style={s.error}>⚠️ {error}</div>}

        {result && (
          <div style={s.resultCard} onClick={() => navigate(`/patient/${result.cnicId}`)}>
            <div>
              <div style={s.patientName}>{result.name}</div>
              <div style={s.patientMeta}>
                CNIC: {result.cnicId} · Age: {result.age} · {result.gender} · Blood: {result.bloodGroup || 'N/A'}
              </div>
            </div>
            <button style={s.viewBtn}>View records →</button>
          </div>
        )}
      </div>
    </div>
  );
}