import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { 
    Heart, ShieldCheck, Activity, Calendar, MapPin, 
    ChevronRight, ArrowUpRight, Loader2, ClipboardList,
    Stethoscope, Pill
} from 'lucide-react';
import { motion } from 'framer-motion';

const PatientDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('journey'); // journey, hospitals
    
    // Hospital Finder states
    const [hospitals, setHospitals] = useState([]);
    const [hState, setHState] = useState('');
    const [hCity, setHCity] = useState('');
    const [hType, setHType] = useState('');
    const [hSpecialty, setHSpecialty] = useState('');
    const [hOwnership, setHOwnership] = useState('');
    const [searching, setSearching] = useState(false);

    const fetchRecords = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/records`, config);
            setRecords(data);
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHospitals = async () => {
        setSearching(true);
        try {
            const params = new URLSearchParams();
            if (hState) params.append('state', hState);
            if (hCity) params.append('city', hCity);
            if (hType) params.append('hospitalType', hType);
            if (hSpecialty) params.append('specialty', hSpecialty);
            if (hOwnership) params.append('ownership', hOwnership);

            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/hospitals?${params.toString()}`);
            setHospitals(data);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
        } finally {
            setSearching(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRecords();
            fetchHospitals();
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-500/20">
            {/* Sidebar / Profile Summary */}
            <div className="hidden lg:flex w-80 bg-white border-r border-slate-200 p-8 flex-col fixed h-full shadow-[20px_0_40px_rgba(0,0,0,0.01)]">
                <div className="mb-12 text-center group">
                    <div className="relative w-28 h-28 mx-auto mb-6">
                        <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform" />
                        <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black italic shadow-2xl relative z-10">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">{user.name}</h2>
                    <div className="mt-2 text-[10px] font-black text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-[0.2em] inline-block">Verified Patient Node</div>
                </div>

                <div className="space-y-4">
                    <NavButton active={activeTab === 'journey'} onClick={() => setActiveTab('journey')} icon={<Activity className="w-5 h-5" />} label="Medical Journey" />
                    <NavButton active={activeTab === 'hospitals'} onClick={() => setActiveTab('hospitals')} icon={<MapPin className="w-5 h-5" />} label="Hospital Finder" />
                </div>

                <div className="mt-auto pt-8 border-t border-slate-100">
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 mb-6">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cloud Synced Email</div>
                        <div className="text-xs font-bold text-slate-700 truncate">{user.email}</div>
                    </div>
                    <button onClick={logout} className="w-full flex items-center justify-center gap-3 py-5 bg-rose-50 text-rose-600 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-100 transition-all active:scale-95">
                        Logout Terminal <ArrowUpRight className="rotate-90 w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:ml-80 p-12 overflow-y-auto">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-3 leading-none">Global Health Record Hub</div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none italic">
                            {activeTab === 'journey' ? "Patient Registry" : "Infrastructure Link"}
                        </h1>
                    </div>
                    <div className="flex items-center gap-6 bg-white p-4 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100">
                        <div className="pr-6 border-r border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Entries</div>
                            <div className="text-3xl font-black text-slate-900 tracking-tighter">{records.length}</div>
                        </div>
                        <div className="pl-2">
                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 leading-none">System Status</div>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-black text-slate-900 uppercase">Synchronized</span>
                            </div>
                        </div>
                    </div>
                </header>

                {activeTab === 'journey' ? (
                    loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6">
                            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Universal Ledger</div>
                        </div>
                    ) : records.length === 0 ? (
                        <div className="bg-white p-24 rounded-[3.5rem] border border-slate-100 shadow-[0_40px_80px_rgba(0,0,0,0.02)] text-center max-w-2xl mx-auto">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group hover:rotate-6 transition-transform">
                                <ClipboardList className="w-12 h-12 text-slate-200" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic underline decoration-indigo-600 decoration-8 underline-offset-8">Null Registry</h3>
                            <p className="text-slate-400 font-bold px-8 leading-relaxed mb-10 uppercase text-[10px] tracking-widest">Your medical trail is currently empty. Synchronize with a facility to begin your journey.</p>
                            <button onClick={() => setActiveTab('hospitals')} className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all">Find Nearby Facility</button>
                        </div>
                    ) : (
                        <div className="max-w-5xl space-y-10 relative">
                            <div className="absolute left-14 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/20 via-slate-200 to-transparent -z-10" />

                            {records.map((rec, index) => (
                                <motion.div 
                                    key={rec._id}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative flex gap-12 group"
                                >
                                    <div className="mt-8 w-28 h-28 flex-shrink-0 bg-white rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center shadow-xl group-hover:border-indigo-600 transition-all group-hover:-translate-y-1">
                                        <div className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter leading-none mb-1">
                                            {new Date(rec.createdAt).toLocaleString('default', { month: 'short' })}
                                        </div>
                                        <div className="text-4xl font-black text-slate-900 tracking-tighter leading-none italic">
                                            {new Date(rec.createdAt).getDate()}
                                        </div>
                                    </div>

                                    <div className="flex-1 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.01)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.03)] transition-all relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                        
                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                            <div>
                                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Diagnostic Entry System Link</div>
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none group-hover:text-indigo-600 transition-colors underline decoration-slate-100 group-hover:decoration-indigo-100 decoration-4 underline-offset-4">{rec.diagnosis}</h3>
                                            </div>
                                            <div className={`px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest border ${
                                                rec.status === 'cured' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                            }`}>
                                                {rec.status}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                                 <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm">
                                                        <Pill className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Prescription Protocol</div>
                                                        <p className="text-sm font-bold text-slate-700 leading-relaxed font-sans">{rec.prescription}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-white rounded-xl text-amber-600 shadow-sm">
                                                        <Stethoscope className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Authenticated Facility</div>
                                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{rec.hospitalId?.name}</p>
                                                        <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase italic">{rec.hospitalId?.city}, {rec.hospitalId?.state}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="space-y-12">
                        {/* Hospital Search Filters */}
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-900/30">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-indigo-600 rounded-2xl">
                                    <Search className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Facility Discovery Terminal</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Accessing infrastructure database across all states</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <FilterInput label="Target State" value={hState} onChange={setHState} placeholder="e.g. California" />
                                <FilterInput label="Urban Hub (City)" value={hCity} onChange={setHCity} placeholder="e.g. Los Angeles" />
                                <FilterSelect label="Facility Class" value={hType} onChange={setHType}>
                                    <option value="">All Classification</option>
                                    <option value="General">General Medical</option>
                                    <option value="Multi-Specialty">Multi-Specialty</option>
                                    <option value="Clinic">Specialized Clinic</option>
                                </FilterSelect>
                                <FilterSelect label="Ownership" value={hOwnership} onChange={setHOwnership}>
                                    <option value="">All Ownership</option>
                                    <option value="Government">Government</option>
                                    <option value="Private">Private</option>
                                </FilterSelect>
                                <FilterInput label="Specialty Node" value={hSpecialty} onChange={setHSpecialty} placeholder="e.g. Cardiology" />
                            </div>

                            <button 
                                onClick={fetchHospitals}
                                disabled={searching}
                                className="mt-10 w-full bg-white text-slate-950 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-400 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Query Database <ChevronRight className="w-5 h-5" /></>}
                            </button>
                        </div>

                        {/* Hospitals Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {hospitals.length === 0 ? (
                                <div className="col-span-full text-center py-20">
                                    <MapPin className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Input Query to localized infrastructure</div>
                                </div>
                            ) : (
                                hospitals.map(hosp => (
                                    <motion.div 
                                        key={hosp._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.03)] hover:-translate-y-2 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-16 h-16 rounded-3xl bg-slate-950 flex items-center justify-center text-white italic font-black text-2xl group-hover:bg-indigo-600 transition-colors">
                                                {hosp.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">{hosp.hospitalType}</span>
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${hosp.ownership === 'Government' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'}`}>
                                                    {hosp.ownership || 'Private'}
                                                </span>
                                                {hosp.accreditationStatus === 'Verified' && (
                                                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                                                        <ShieldCheck className="w-3 h-3" /> Gov Verified
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2 italic">{hosp.name}</h4>
                                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                                            <MapPin className="w-3 h-3 text-indigo-500" /> {hosp.city}, {hosp.state}
                                        </div>

                                        <div className="pt-6 border-t border-slate-50">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 leading-none">Active Specialty Nodes</div>
                                            <div className="flex flex-wrap gap-2">
                                                {hosp.specialties?.length > 0 ? hosp.specialties.map((s, i) => (
                                                    <span key={i} className="text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-tight">{s}</span>
                                                )) : <span className="text-[10px] font-bold text-slate-300 italic italic">General Services</span>}
                                            </div>
                                        </div>
                                        
                                        <button className="mt-8 w-full py-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all">Direct Contact Link</button>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const NavButton = ({ active, icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-widest ${
            active 
            ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' 
            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
        <div className={`${active ? 'text-indigo-400' : 'text-slate-300'}`}>{icon}</div> {label}
    </button>
);

const FilterInput = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <input
            type="text"
            className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl focus:border-indigo-400 focus:bg-slate-950 outline-none transition-all font-bold text-xs"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const FilterSelect = ({ label, value, onChange, children }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <select
            className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl focus:border-indigo-400 focus:bg-slate-950 outline-none transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {children}
        </select>
    </div>
);

export default PatientDashboard;
