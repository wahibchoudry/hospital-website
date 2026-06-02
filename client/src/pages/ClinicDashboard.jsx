import { useState } from 'react';
import api from '../api';

const s = {
  page: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: { fontSize: '1.5rem', fontWeight: '700', color: '#6b46c1', marginBottom: '0.25rem' },
  sub: { color: '#718096', marginBottom: '2rem' },
  searchCard: { background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '2rem' },
  searchRow: { display: 'flex', gap: '1rem' },
  input: { flex: 1, padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', outline: 'none', textTransform: 'uppercase' },
  btn: { padding: '0.75rem 1.5rem', background: '#6b46c1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600' },
  greenBtn: { padding: '0.75rem 1.5rem', background: '#276749', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
  error: { background: '#fff5f5', color: '#c53030', padding: '0.75rem 1rem', borderRadius: '8px', marginTop: '1rem', fontSize: '0.9rem' },
  success: { background: '#f0fff4', color: '#276749', padding: '0.75rem 1rem', borderRadius: '8px', marginTop: '1rem', fontSize: '0.9rem' },
  patientCard: { background: 'linear-gradient(135deg, #6b46c1, #805ad5)', color: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  patientName: { fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.5rem' },
  infoItem: { fontSize: '0.9rem', opacity: 0.85 },
  infoVal: { fontWeight: '600' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: (active) => ({ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', background: active ? '#6b46c1' : '#e2e8f0', color: active ? 'white' : '#4a5568' }),
  sectionTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#1a365d', marginBottom: '1rem' },
  rxCard: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', marginBottom: '1rem', borderLeft: '4px solid #6b46c1' },
  reportCard: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', marginBottom: '1rem', borderLeft: '4px solid #38a169' },
  rxHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' },
  diagnosis: { fontSize: '1.05rem', fontWeight: '700', color: '#1a365d' },
  rxMeta: { color: '#718096', fontSize: '0.85rem', marginTop: '0.2rem' },
  medTable: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
  th: { background: '#faf5ff', color: '#6b46c1', padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.85rem' },
  td: { padding: '0.5rem 0.75rem', fontSize: '0.9rem', borderBottom: '1px solid #e2e8f0' },
  notes: { background: '#fffbeb', border: '1px solid #fbd38d', borderRadius: '8px', padding: '0.75rem', marginTop: '1rem', fontSize: '0.9rem', color: '#744210' },
  noData: { textAlign: 'center', padding: '3rem', color: '#718096', background: 'white', borderRadius: '12px' },
  followUp: { background: '#ebf8ff', color: '#2b6cb0', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' },
  statusBadge: (status) => ({
    padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
    background: status === 'Normal' ? '#f0fff4' : status === 'Abnormal' ? '#fffbeb' : '#fff5f5',
    color: status === 'Normal' ? '#276749' : status === 'Abnormal' ? '#744210' : '#c53030',
  }),
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modalCard: { background: 'white', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', marginBottom: '0.4rem' },
  formInput: { width: '100%', padding: '0.65rem 0.9rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', marginBottom: '1rem' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  submitBtn: { background: '#276749', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  cancelBtn: { background: '#e2e8f0', color: '#4a5568', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', marginRight: '0.75rem', cursor: 'pointer' },
};

export default function ClinicDashboard() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [form, setForm] = useState({ testName: '', result: '', normalRange: '', status: 'Normal', notes: '', reportDate: '' });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setError(''); setData(null); setReports([]); setLoading(true);
    try {
      const [rxRes, repRes] = await Promise.all([
        api.get(`/prescriptions/patient/${query.trim()}`),
        api.get(`/reports/patient/${query.trim()}`),
      ]);
      setData(rxRes.data);
      setReports(repRes.data.reports || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Patient not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/reports', { patientId: query.trim(), clinicName: 'City Lab', ...form });
      setSaveSuccess('Report added successfully!');
      setShowModal(false);
      setForm({ testName: '', result: '', normalRange: '', status: 'Normal', notes: '', reportDate: '' });
      const repRes = await api.get(`/reports/patient/${query.trim()}`);
      setReports(repRes.data.reports || []);
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save report');
    } finally {
      setSaving(false);
    }
  };

  const { patient, prescriptions } = data || {};

  return (
    <div style={s.page}>
      <h1 style={s.header}>🏪 Hospital Hub — Clinic</h1>
      <p style={s.sub}>Search patient to view prescriptions and add test reports</p>

      <div style={s.searchCard}>
        <p style={{ fontWeight: '600', marginBottom: '1rem', color: '#2d3748' }}>🔍 Search patient by ID</p>
        <form onSubmit={handleSearch}>
          <div style={s.searchRow}>
            <input style={s.input} placeholder="Enter patient ID (e.g. PT001)" value={query} onChange={e => setQuery(e.target.value.toUpperCase())} />
            <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
          </div>
        </form>
        {error && <div style={s.error}>⚠️ {error}</div>}
        {saveSuccess && <div style={s.success}>✅ {saveSuccess}</div>}
      </div>

      {patient && (
        <>
          <div style={s.patientCard}>
            <div>
              <div style={s.patientName}>{patient.name}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.85 }}>ID: {patient.patientId}</div>
              <div style={s.infoGrid}>
                <div style={s.infoItem}>Age: <span style={s.infoVal}>{patient.age}</span></div>
                <div style={s.infoItem}>Gender: <span style={s.infoVal}>{patient.gender}</span></div>
                <div style={s.infoItem}>Blood: <span style={s.infoVal}>{patient.bloodGroup || 'N/A'}</span></div>
                <div style={s.infoItem}>Phone: <span style={s.infoVal}>{patient.phone || 'N/A'}</span></div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', opacity: 0.85 }}>Allergies</div>
              <div style={{ fontWeight: '600', marginBottom: '1rem' }}>{patient.allergies || 'None'}</div>
              <button style={s.greenBtn} onClick={() => setShowModal(true)}>+ Add Test Report</button>
            </div>
          </div>

          <div style={s.tabs}>
            <button style={s.tab(activeTab === 'prescriptions')} onClick={() => setActiveTab('prescriptions')}>
              📋 Prescriptions ({prescriptions?.length || 0})
            </button>
            <button style={s.tab(activeTab === 'reports')} onClick={() => setActiveTab('reports')}>
              🧪 Test Reports ({reports.length})
            </button>
          </div>

          {activeTab === 'prescriptions' && (
            <>
              {prescriptions?.length === 0 ? (
                <div style={s.noData}><div style={{ fontSize: '3rem' }}>📄</div><p>No prescriptions found.</p></div>
              ) : prescriptions?.map(rx => (
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
                      <tbody>
                        {rx.medicines.map((m, i) => (
                          <tr key={i}><td style={s.td}>{m.name}</td><td style={s.td}>{m.dosage}</td><td style={s.td}>{m.frequency}</td><td style={s.td}>{m.duration}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {rx.notes && <div style={s.notes}>📝 Notes: {rx.notes}</div>}
                </div>
              ))}
            </>
          )}

          {activeTab === 'reports' && (
            <>
              {reports.length === 0 ? (
                <div style={s.noData}>
                  <div style={{ fontSize: '3rem' }}>🧪</div>
                  <p>No test reports yet.</p>
                  <button style={{ ...s.greenBtn, marginTop: '1rem' }} onClick={() => setShowModal(true)}>+ Add First Report</button>
                </div>
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
              ))}
            </>
          )}
        </>
      )}

      {showModal && (
        <div style={s.modal} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={s.modalCard}>
            <h2 style={{ marginBottom: '1.5rem', color: '#1a365d' }}>🧪 Add Test Report for {patient?.name}</h2>
            <form onSubmit={handleSaveReport}>
              <label style={s.label}>Test name *</label>
              <input style={s.formInput} placeholder="e.g. Blood CBC, Urine test, X-Ray" value={form.testName} onChange={e => setForm({...form, testName: e.target.value})} required />

              <div style={s.formRow}>
                <div>
                  <label style={s.label}>Result *</label>
                  <input style={s.formInput} placeholder="e.g. 12.5 g/dL" value={form.result} onChange={e => setForm({...form, result: e.target.value})} required />
                </div>
                <div>
                  <label style={s.label}>Normal range</label>
                  <input style={s.formInput} placeholder="e.g. 12-16 g/dL" value={form.normalRange} onChange={e => setForm({...form, normalRange: e.target.value})} />
                </div>
              </div>

              <div style={s.formRow}>
                <div>
                  <label style={s.label}>Status *</label>
                  <select style={s.formInput} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option>Normal</option>
                    <option>Abnormal</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label style={s.label}>Report date</label>
                  <input style={s.formInput} type="date" value={form.reportDate} onChange={e => setForm({...form, reportDate: e.target.value})} />
                </div>
              </div>

              <label style={s.label}>Notes (optional)</label>
              <textarea style={{ ...s.formInput, height: '80px', resize: 'vertical' }} placeholder="Any additional notes..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />

              <div style={{ marginTop: '0.5rem' }}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={s.submitBtn} disabled={saving}>{saving ? 'Saving...' : 'Save Report'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}