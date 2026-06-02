import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const s = {
  page: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  welcome: { fontSize: '1.5rem', fontWeight: '700', color: '#276749', marginBottom: '0.25rem' },
  sub: { color: '#718096', marginBottom: '2rem' },
  infoCard: { background: 'linear-gradient(135deg, #276749, #38a169)', color: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  infoTitle: { fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' },
  infoItem: { fontSize: '0.9rem', opacity: 0.85 },
  infoVal: { fontWeight: '600' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: (active) => ({ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', background: active ? '#276749' : '#e2e8f0', color: active ? 'white' : '#4a5568' }),
  sectionTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#1a365d', marginBottom: '1rem' },
  rxCard: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', marginBottom: '1rem', borderLeft: '4px solid #38a169' },
  reportCard: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', marginBottom: '1rem', borderLeft: '4px solid #6b46c1' },
  rxHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' },
  diagnosis: { fontSize: '1.05rem', fontWeight: '700', color: '#1a365d' },
  rxMeta: { color: '#718096', fontSize: '0.85rem', marginTop: '0.2rem' },
  medTable: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
  th: { background: '#f0fff4', color: '#276749', padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.85rem' },
  td: { padding: '0.5rem 0.75rem', fontSize: '0.9rem', borderBottom: '1px solid #e2e8f0' },
  notes: { background: '#fffbeb', border: '1px solid #fbd38d', borderRadius: '8px', padding: '0.75rem', marginTop: '1rem', fontSize: '0.9rem', color: '#744210' },
  noRx: { textAlign: 'center', padding: '3rem', color: '#718096', background: 'white', borderRadius: '12px' },
  followUp: { background: '#ebf8ff', color: '#2b6cb0', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' },
  statusBadge: (status) => ({ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', background: status === 'Normal' ? '#f0fff4' : status === 'Abnormal' ? '#fffbeb' : '#fff5f5', color: status === 'Normal' ? '#276749' : status === 'Abnormal' ? '#744210' : '#c53030' }),
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('prescriptions');

  useEffect(() => {
    Promise.all([
      api.get(`/prescriptions/patient/${user.patientId}`),
      api.get(`/reports/patient/${user.patientId}`),
    ]).then(([rxRes, repRes]) => {
      setData(rxRes.data);
      setReports(repRes.data.reports || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user.patientId]);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading your records...</div>;

  const patient = data?.patient;
  const prescriptions = data?.prescriptions || [];

  return (
    <div style={s.page}>
      <h1 style={s.welcome}>Welcome, {user.name} 👋</h1>
      <p style={s.sub}>Your personal health records — read only</p>

      {patient && (
        <div style={s.infoCard}>
          <div>
            <div style={s.infoTitle}>{patient.name}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.85 }}>Patient ID: {patient.patientId}</div>
            <div style={s.infoGrid}>
              <div style={s.infoItem}>Age: <span style={s.infoVal}>{patient.age}</span></div>
              <div style={s.infoItem}>Gender: <span style={s.infoVal}>{patient.gender}</span></div>
              <div style={s.infoItem}>Blood: <span style={s.infoVal}>{patient.bloodGroup || 'N/A'}</span></div>
              <div style={s.infoItem}>Phone: <span style={s.infoVal}>{patient.phone || 'N/A'}</span></div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', opacity: 0.85, marginBottom: '0.5rem' }}>Allergies</div>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem' }}>{patient.allergies || 'None'}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.85, marginBottom: '0.5rem' }}>Address</div>
            <div style={{ fontWeight: '600' }}>{patient.address || 'Not provided'}</div>
          </div>
        </div>
      )}

      <div style={s.tabs}>
        <button style={s.tab(activeTab === 'prescriptions')} onClick={() => setActiveTab('prescriptions')}>
          📋 Prescriptions ({prescriptions.length})
        </button>
        <button style={s.tab(activeTab === 'reports')} onClick={() => setActiveTab('reports')}>
          🧪 Test Reports ({reports.length})
        </button>
      </div>

      {activeTab === 'prescriptions' && (
        prescriptions.length === 0 ? (
          <div style={s.noRx}><div style={{ fontSize: '3rem' }}>📄</div><p>No prescriptions on file yet.</p></div>
        ) : prescriptions.map(rx => (
          <div key={rx._id} style={s.rxCard}>
            <div style={s.rxHeader}>
              <div>
                <div style={s.diagnosis}>🩺 {rx.diagnosis}</div>
                <div style={s.rxMeta}>Dr. {rx.doctor?.name} ({rx.doctor?.specialization}) · {new Date(rx.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
              {rx.followUpDate && <div style={s.followUp}>Follow-up: {new Date(rx.followUpDate).toLocaleDateString()}</div>}
            </div>
            {rx.medicines.length > 0 && (
              <table style={s.medTable}>
                <thead><tr><th style={s.th}>Medicine</th><th style={s.th}>Dosage</th><th style={s.th}>Frequency</th><th style={s.th}>Duration</th></tr></thead>
                <tbody>{rx.medicines.map((m, i) => (<tr key={i}><td style={s.td}>{m.name}</td><td style={s.td}>{m.dosage}</td><td style={s.td}>{m.frequency}</td><td style={s.td}>{m.duration}</td></tr>))}</tbody>
              </table>
            )}
            {rx.notes && <div style={s.notes}>📝 Doctor's notes: {rx.notes}</div>}
          </div>
        ))
      )}

      {activeTab === 'reports' && (
        reports.length === 0 ? (
          <div style={s.noRx}><div style={{ fontSize: '3rem' }}>🧪</div><p>No test reports yet.</p></div>
        ) : reports.map(r => (
          <div key={r._id} style={s.reportCard}>
            <div style={s.rxHeader}>
              <div>
                <div style={s.diagnosis}>🧪 {r.testName}</div>
                <div style={s.rxMeta}>{r.clinicName} · {new Date(r.reportDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
              <span style={s.statusBadge(r.status)}>{r.status}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><span style={{ color: '#718096', fontSize: '0.85rem' }}>Result: </span><strong>{r.result}</strong></div>
              {r.normalRange && <div><span style={{ color: '#718096', fontSize: '0.85rem' }}>Normal range: </span><strong>{r.normalRange}</strong></div>}
            </div>
            {r.notes && <div style={s.notes}>📝 Notes: {r.notes}</div>}
          </div>
        ))
      )}
    </div>
  );
}