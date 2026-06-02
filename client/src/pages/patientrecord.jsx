import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const s = {
  page: { padding: '2rem', maxWidth: '960px', margin: '0 auto' },
  back: { color: '#2b6cb0', cursor: 'pointer', marginBottom: '1.5rem', display: 'inline-block', fontWeight: '500' },
  header: {
    background: '#1a365d', color: 'white', borderRadius: '16px',
    padding: '2rem', marginBottom: '2rem',
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
  },
  headerTitle: { fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.5rem' },
  headerSub: { color: '#bee3f8', fontSize: '0.9rem' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '1rem' },
  infoItem: { color: '#90cdf4', fontSize: '0.9rem' },
  infoVal: { color: 'white', fontWeight: '600' },
  addBtn: {
    background: '#38a169', color: 'white', border: 'none',
    padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: '600',
    fontSize: '0.95rem', alignSelf: 'start',
  },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#1a365d', marginBottom: '1rem' },
  rxCard: {
    background: 'white', borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 4px 16px rgba(0,0,0,0.07)', marginBottom: '1rem',
    borderLeft: '4px solid #2b6cb0',
  },
  rxHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' },
  diagnosis: { fontSize: '1.05rem', fontWeight: '700', color: '#1a365d' },
  rxMeta: { color: '#718096', fontSize: '0.85rem' },
  medTable: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
  th: { background: '#ebf8ff', color: '#2b6cb0', padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.85rem' },
  td: { padding: '0.5rem 0.75rem', fontSize: '0.9rem', borderBottom: '1px solid #e2e8f0' },
  notes: { background: '#fffbeb', border: '1px solid #fbd38d', borderRadius: '8px', padding: '0.75rem', marginTop: '1rem', fontSize: '0.9rem', color: '#744210' },
  noRx: { textAlign: 'center', padding: '3rem', color: '#718096' },
  modal: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  modalCard: {
    background: 'white', borderRadius: '16px', padding: '2rem',
    width: '90%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
  },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', marginBottom: '0.4rem' },
  input: {
    width: '100%', padding: '0.65rem 0.9rem', border: '2px solid #e2e8f0',
    borderRadius: '8px', fontSize: '0.95rem', outline: 'none', marginBottom: '1rem',
  },
  medRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' },
  submitBtn: { background: '#2b6cb0', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600' },
  cancelBtn: { background: '#e2e8f0', color: '#4a5568', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', marginRight: '0.75rem' },
};

const emptyMed = { name: '', dosage: '', frequency: '', duration: '' };

export default function PatientRecord() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ diagnosis: '', medicines: [{ ...emptyMed }], notes: '', followUpDate: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const { data: res } = await api.get(`/prescriptions/patient/${patientId}`);
      setData(res);
    } catch {
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [patientId]);

  const addMedRow = () => setForm(f => ({ ...f, medicines: [...f.medicines, { ...emptyMed }] }));
  const removeMedRow = (i) => setForm(f => ({ ...f, medicines: f.medicines.filter((_, idx) => idx !== i) }));
  const updateMed = (i, field, val) => setForm(f => ({
    ...f, medicines: f.medicines.map((m, idx) => idx === i ? { ...m, [field]: val } : m)
  }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/prescriptions', { patientId, ...form });
      setShowModal(false);
      setForm({ diagnosis: '', medicines: [{ ...emptyMed }], notes: '', followUpDate: '' });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save prescription');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading patient records...</div>;
  if (!data) return null;

  const { patient, prescriptions } = data;

  return (
    <div style={s.page}>
      <span style={s.back} onClick={() => navigate('/')}>← Back to dashboard</span>

      <div style={s.header}>
        <div>
          <div style={s.headerTitle}>{patient.name}</div>
          <div style={s.headerSub}>Patient ID: {patient.patientId}</div>
          <div style={s.infoGrid}>
            <div style={s.infoItem}>Age: <span style={s.infoVal}>{patient.age}</span></div>
            <div style={s.infoItem}>Gender: <span style={s.infoVal}>{patient.gender}</span></div>
            <div style={s.infoItem}>Blood: <span style={s.infoVal}>{patient.bloodGroup || 'N/A'}</span></div>
            <div style={s.infoItem}>Phone: <span style={s.infoVal}>{patient.phone || 'N/A'}</span></div>
            <div style={s.infoItem}>Allergies: <span style={s.infoVal}>{patient.allergies || 'None'}</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <button style={s.addBtn} onClick={() => setShowModal(true)}>+ Add prescription</button>
          <div style={{ color: '#90cdf4', fontSize: '0.85rem' }}>{prescriptions.length} prescription(s) on file</div>
        </div>
      </div>

      <p style={s.sectionTitle}>📋 Prescription history</p>

      {prescriptions.length === 0 ? (
        <div style={s.noRx}>
          <div style={{ fontSize: '3rem' }}>📄</div>
          <p>No prescriptions yet. Add the first one above.</p>
        </div>
      ) : prescriptions.map(rx => (
        <div key={rx._id} style={s.rxCard}>
          <div style={s.rxHeader}>
            <div>
              <div style={s.diagnosis}>🩺 {rx.diagnosis}</div>
              <div style={s.rxMeta}>
                Dr. {rx.doctor?.name} ({rx.doctor?.specialization}) · {new Date(rx.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            {rx.followUpDate && (
              <div style={{ background: '#ebf8ff', color: '#2b6cb0', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                Follow-up: {new Date(rx.followUpDate).toLocaleDateString()}
              </div>
            )}
          </div>

          {rx.medicines.length > 0 && (
            <table style={s.medTable}>
              <thead>
                <tr>
                  <th style={s.th}>Medicine</th>
                  <th style={s.th}>Dosage</th>
                  <th style={s.th}>Frequency</th>
                  <th style={s.th}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {rx.medicines.map((m, i) => (
                  <tr key={i}>
                    <td style={s.td}>{m.name}</td>
                    <td style={s.td}>{m.dosage}</td>
                    <td style={s.td}>{m.frequency}</td>
                    <td style={s.td}>{m.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {rx.notes && <div style={s.notes}>📝 Notes: {rx.notes}</div>}
        </div>
      ))}

      {showModal && (
        <div style={s.modal} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={s.modalCard}>
            <h2 style={{ marginBottom: '1.5rem', color: '#1a365d' }}>New prescription for {patient.name}</h2>
            <form onSubmit={handleSave}>
              <label style={s.label}>Diagnosis *</label>
              <input style={s.input} placeholder="e.g. Acute pharyngitis" value={form.diagnosis}
                onChange={e => setForm({ ...form, diagnosis: e.target.value })} required />

              <label style={s.label}>Medicines</label>
              {form.medicines.map((m, i) => (
                <div key={i} style={s.medRow}>
                  <input style={{ ...s.input, marginBottom: 0 }} placeholder="Medicine name" value={m.name} onChange={e => updateMed(i, 'name', e.target.value)} />
                  <input style={{ ...s.input, marginBottom: 0 }} placeholder="Dosage" value={m.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)} />
                  <input style={{ ...s.input, marginBottom: 0 }} placeholder="Frequency" value={m.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)} />
                  <input style={{ ...s.input, marginBottom: 0 }} placeholder="Duration" value={m.duration} onChange={e => updateMed(i, 'duration', e.target.value)} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={addMedRow} style={{ ...s.cancelBtn, fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>+ Add medicine</button>
                {form.medicines.length > 1 && (
                  <button type="button" onClick={() => removeMedRow(form.medicines.length - 1)} style={{ ...s.cancelBtn, fontSize: '0.85rem', padding: '0.4rem 0.9rem', color: '#c53030' }}>- Remove last</button>
                )}
              </div>

              <label style={s.label}>Notes (optional)</label>
              <textarea style={{ ...s.input, height: '80px', resize: 'vertical' }} placeholder="Any additional notes..." value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })} />

              <label style={s.label}>Follow-up date (optional)</label>
              <input style={s.input} type="date" value={form.followUpDate}
                onChange={e => setForm({ ...form, followUpDate: e.target.value })} />

              <div style={{ marginTop: '0.5rem' }}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={s.submitBtn} disabled={saving}>{saving ? 'Saving...' : 'Save prescription'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}