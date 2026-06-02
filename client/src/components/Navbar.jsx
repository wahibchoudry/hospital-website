import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const s = {
  nav: {
    background: '#1a365d', color: 'white', padding: '0 2rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '64px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  brand: { fontSize: '1.2rem', fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' },
  right: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  link: { color: '#bee3f8', fontSize: '0.9rem', fontWeight: '500' },
  userName: { color: '#90cdf4', fontSize: '0.9rem' },
  badge: { fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' },
  logoutBtn: { background: '#e53e3e', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500' },
};

const roleBadgeColor = { doctor: '#2b6cb0', patient: '#276749', clinic: '#6b46c1' };
const roleLabel = { doctor: 'Doctor', patient: 'Patient', clinic: 'Clinic' };

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const homeLink = role === 'patient' ? '/patient-dashboard' : role === 'clinic' ? '/clinic-dashboard' : '/doctor-dashboard';

  return (
    <nav style={s.nav}>
      <Link to={homeLink} style={s.brand}>🏥 Hospital Hub</Link>
      <div style={s.right}>
        {role === 'doctor' && <Link to="/doctor-dashboard" style={s.link}>Dashboard</Link>}
        {role === 'doctor' && <Link to="/add-patient" style={s.link}>+ New Patient</Link>}
        {role === 'clinic' && <Link to="/clinic-dashboard" style={s.link}>Search Patient</Link>}
        <span style={{ ...s.badge, background: roleBadgeColor[role] || '#555', color: 'white' }}>
          {roleLabel[role] || role}
        </span>
        <span style={s.userName}>{user?.name || user?.patientId || 'User'}</span>
        <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}