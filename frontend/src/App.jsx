import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import GovernmentDashboard from './pages/GovernmentDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import './index.css';

// Protected Route Component - Uses AuthContext
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading...</p>
                </div>
            </div>
        );
    }
    
    // Redirect to login if not authenticated
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
