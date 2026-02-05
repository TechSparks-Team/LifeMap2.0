import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut, LayoutDashboard, User, Activity, ShieldCheck, HeartPulse } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-blue-600 rounded-lg group-hover:rotate-6 transition-transform">
                            <HeartPulse className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                            LifeMap
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
                        {user ? (
                            <>
                                {user.role === 'patient' && (
                                    <Link to="/dashboard" className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                                    </Link>
                                )}
                                {user.role === 'hospital' && (
                                    <Link to="/hospital-dashboard" className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                        <Activity className="w-4 h-4" /> Hospital Portal
                                    </Link>
                                )}
                                {user.role === 'government' && (
                                    <Link to="/government-dashboard" className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                        <ShieldCheck className="w-4 h-4" /> Gov Registry
                                    </Link>
                                )}
                                <div className="h-6 w-px bg-gray-200 mx-2" />
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                                        <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">{user.role}</span>
                                    </div>
                                    <button 
                                        onClick={logout} 
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg active:scale-95">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
