import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Lock, ShieldCheck, HeartPulse, ArrowRight, Loader2, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [hospitalType, setHospitalType] = useState('General');
    const [specialties, setSpecialties] = useState('');
    const [ownership, setOwnership] = useState('Private');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const userData = { name, email, password, role };
            if (role === 'hospital') {
                userData.address = address;
                userData.city = city;
                userData.state = state;
                userData.zipCode = zipCode;
                userData.hospitalType = hospitalType;
                userData.ownership = ownership;
                userData.specialties = specialties.split(',').map(s => s.trim());
            }
            await register(userData);
             if (role === 'hospital') navigate('/hospital-dashboard');
             else if (role === 'government') navigate('/government-dashboard');
             else navigate('/dashboard');
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-950 text-white selection:bg-emerald-500/30">
             {/* Left Side - Visual */}
             <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-900/40 backdrop-blur-3xl" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2053')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
                
                {/* Animated background elements */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] animate-pulse delay-700" />

                <div className="relative z-10 w-full p-20 flex flex-col justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="p-2 bg-emerald-500/20 rounded-xl ring-1 ring-emerald-500/50 group-hover:bg-emerald-500/30 transition-all">
                            <HeartPulse className="w-8 h-8 text-emerald-400" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent italic">LifeMap 2.0</span>
                    </Link>
                    
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
                            >
                                <ShieldCheck className="w-4 h-4" /> Trusted by 500+ Institutions
                            </motion.div>
                            <h2 className="text-7xl font-black leading-tight tracking-tight">
                                Empower <br />
                                <span className="text-emerald-500">Healthcare</span> <br />
                                Digital Flow.
                            </h2>
                        </div>
                        <p className="text-xl text-slate-400 leading-relaxed max-w-lg font-light">
                            Join the next generation of healthcare connectivity. Secure, efficient, and built for the future of patient care.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <span>+10k Professionals already joined</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-slate-950 overflow-y-auto custom-scrollbar">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full"
                >
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Initialize Profile</h2>
                        <p className="text-slate-500 font-medium">Global Health ID registration portal</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 text-sm flex items-center gap-3 backdrop-blur-md"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selector Dashboard Style */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {[
                                { id: 'patient', label: 'Patient', icon: User },
                                { id: 'hospital', label: 'Hospital', icon: Briefcase },
                                { id: 'government', label: 'Authority', icon: ShieldCheck }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setRole(item.id)}
                                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                                        role === item.id 
                                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                                        : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700'
                                    }`}
                                >
                                    <item.icon className={`w-6 h-6 ${role === item.id ? 'text-emerald-400' : 'text-slate-600'}`} />
                                    <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Universal ID / Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                                        placeholder={role === 'hospital' ? 'Hospital Medical Center' : 'Legal Full Name'}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Cloud Account Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                                        placeholder="secure@lifemap.io"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {role === 'hospital' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6 pt-4 border-t border-slate-800/50"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Infrastructure Address</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                                            placeholder="123 Health Ave"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">City / Hub</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                                            placeholder="Metropolis"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">State / Province</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                                            placeholder="California"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Facility Type</label>
                                        <select
                                            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:border-emerald-500/50 outline-none transition-all appearance-none cursor-pointer text-slate-300"
                                            value={hospitalType}
                                            onChange={(e) => setHospitalType(e.target.value)}
                                        >
                                            <option value="General">General Medical Center</option>
                                            <option value="Multi-Specialty">Multi-Specialty Institute</option>
                                            <option value="Clinic">Specialized Clinic</option>
                                            <option value="Specialized Central">Apex Specialized Central</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Facility Ownership</label>
                                        <select
                                            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:border-emerald-500/50 outline-none transition-all appearance-none cursor-pointer text-slate-300"
                                            value={ownership}
                                            onChange={(e) => setOwnership(e.target.value)}
                                        >
                                            <option value="Private">Private Facility</option>
                                            <option value="Government">Government Institution</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Medical Specialties (Comma separated)</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                                        placeholder="Cardiology, Neurology, Oncology..."
                                        value={specialties}
                                        onChange={(e) => setSpecialties(e.target.value)}
                                        required
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Access Credentials</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
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
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-5 rounded-2xl font-black text-lg transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 group"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" /> Synchronizing...
                                </>
                            ) : (
                                <>
                                    Confirm Registration <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-slate-500 font-bold">
                        Already registered? <Link to="/login" className="text-emerald-500 hover:text-emerald-400 underline-offset-4 hover:underline transition-all font-black uppercase tracking-widest text-xs">Access Terminal</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
