import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import GovernmentDashboard from './pages/GovernmentDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import './index.css';

// Protected Route Component (Simple version)
const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-main font-sans selection:bg-blue-100 selection:text-blue-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <PatientDashboard />
                </ProtectedRoute>
            } />
            <Route path="/hospital-dashboard" element={
                <ProtectedRoute>
                    <HospitalDashboard />
                </ProtectedRoute>
            } />
            <Route path="/doctor-dashboard" element={
                <ProtectedRoute>
                    <DoctorDashboard />
                </ProtectedRoute>
            } />
            <Route path="/government-dashboard" element={
                <ProtectedRoute>
                    <GovernmentDashboard />
                </ProtectedRoute>
             } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
