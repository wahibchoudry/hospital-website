import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import PatientRecord from "./pages/patientrecord";
import AddPatient from "./pages/addpatient";
import PatientDashboard from "./pages/PatientDashboard";
import ClinicDashboard from "./pages/ClinicDashboard";
import Navbar from "./components/Navbar";

function PrivateRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : children;
}

function HomeRedirect() {
  const { role } = useAuth();
  if (role === "patient") return <Navigate to="/patient-dashboard" />;
  if (role === "clinic") return <Navigate to="/clinic-dashboard" />;
  return <Navigate to="/doctor-dashboard" />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/" element={<PrivateRoute allowedRoles={["doctor","patient","clinic"]}><HomeRedirect /></PrivateRoute>} />
        <Route path="/doctor-dashboard" element={<PrivateRoute allowedRoles={["doctor"]}><Dashboard /></PrivateRoute>} />
        <Route path="/patient/:patientId" element={<PrivateRoute allowedRoles={["doctor","clinic"]}><PatientRecord /></PrivateRoute>} />
        <Route path="/add-patient" element={<PrivateRoute allowedRoles={["doctor"]}><AddPatient /></PrivateRoute>} />
        <Route path="/patient-dashboard" element={<PrivateRoute allowedRoles={["patient"]}><PatientDashboard /></PrivateRoute>} />
        <Route path="/clinic-dashboard" element={<PrivateRoute allowedRoles={["clinic"]}><ClinicDashboard /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}