import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, HeartPulse, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const userData = await login(email, password);
             if (userData.role === 'hospital') navigate('/hospital-dashboard');
             else if (userData.role === 'government') navigate('/government-dashboard');
             else if (userData.role === 'doctor') navigate('/doctor-dashboard');
             else navigate('/dashboard');
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50/50">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center mix-blend-overlay" />
                <div className="relative z-10 w-full p-16 flex flex-col justify-between text-white">
                    <Link to="/" className="flex items-center gap-2">
                        <HeartPulse className="w-8 h-8" />
                        <span className="text-2xl font-bold">LifeMap</span>
                    </Link>
                    <div>
                        <h2 className="text-5xl font-bold leading-tight mb-6">Secure Access to <br />Healthcare Systems</h2>
                        <p className="text-xl text-blue-100 italic italic leading-relaxed max-w-lg">
                            "Connecting patients, providers, and policy makers through a unified, secure health data infrastructure."
                        </p>
                    </div>
                    <div className="text-sm text-blue-200">
                        © 2026 LifeMap Healthcare. Trusted by 500+ Institutions.
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-md w-full"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-500 font-medium">Please sign in to your LifeMap account</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4 rotate-45" /> {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="name@institution.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Password</label>
                                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600 font-medium">
                        New to LifeMap? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create an account</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
