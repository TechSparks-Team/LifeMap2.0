import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { 
    Users, PlusCircle, Search, FileText, Activity, 
    ArrowUpRight, Clock, CheckCircle2, AlertCircle, Loader2,
    Calendar, ChevronRight, LayoutDashboard, Database, Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [records, setRecords] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    // Form states
    const [patientEmail, setPatientEmail] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');
    const [status, setStatus] = useState('active');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

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
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post(
                `${import.meta.env.VITE_API_URL}/records`,
                { patientEmail, diagnosis, prescription, status, notes },
                config
            );
            setMessage({ type: 'success', text: 'Diagnostic record successfully synchronized.' });
            setPatientEmail('');
            setDiagnosis('');
            setPrescription('');
            setNotes('');
            fetchRecords();
            setTimeout(() => setActiveTab('overview'), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Sync failed.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Doctor Sidebar */}
            <div className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col fixed h-full shadow-[20px_0_40px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-12">
                    <div className="p-2 bg-indigo-600 rounded-xl">
                        <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="text-sm font-black text-slate-900 uppercase tracking-tighter italic leading-none">Medical Staff</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">LifeMap Hub</div>
                    </div>
                </div>
                
                <nav className="flex-1 space-y-3 font-black text-xs uppercase tracking-widest">
                    <NavButton 
                        active={activeTab === 'overview'} 
                        onClick={() => setActiveTab('overview')}
                        icon={<LayoutDashboard className="w-4 h-4" />}
                        label="Insight"
                    />
                    <NavButton 
                        active={activeTab === 'add'} 
                        onClick={() => setActiveTab('add')}
                        icon={<PlusCircle className="w-4 h-4" />}
                        label="Diagnosis"
                    />
                    <NavButton 
                        active={activeTab === 'history'} 
                        onClick={() => setActiveTab('history')}
                        icon={<Database className="w-4 h-4" />}
                        label="Registry"
                    />
                </nav>

                <div className="pt-8 mt-8 border-t border-slate-100">
                    <div className="bg-slate-900 rounded-2xl p-5 text-white mb-6">
                        <div className="text-[10px] font-black uppercase text-indigo-400 mb-2">Authenticated User</div>
                        <div className="text-sm font-bold truncate">{user.name}</div>
                        <div className="text-[10px] font-medium text-slate-500 truncate mt-1">{user.email}</div>
                    </div>
                    <button onClick={logout} className="w-full flex items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100">
                        Terminate Session <ArrowUpRight className="rotate-90 w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main View */}
            <div className="flex-1 ml-72 p-12">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <div className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 border-l-4 border-indigo-600 pl-3">Active Terminal</div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                            {activeTab === 'overview' && "Surgical Insight"}
                            {activeTab === 'add' && "Cloud Diagnosis"}
                            {activeTab === 'history' && "National Registry"}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Real-time Node Status: Optimal
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div 
                            key="overview"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-12"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <StatCard label="Records Synced" value={records.length} icon={<FileText className="text-indigo-600" />} color="indigo" />
                                <StatCard label="Cases Managed" value={new Set(records.map(r => r.patientId?._id)).size} icon={<Users className="text-rose-600" />} color="rose" />
                                <StatCard label="Cloud Uptime" value="99.9%" icon={<Activity className="text-emerald-600" />} color="emerald" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Recent Submissions</h3>
                                        <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">Full Audit</button>
                                    </div>
                                    <div className="space-y-4">
                                        {fetching ? (
                                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" /></div>
                                        ) : records.length === 0 ? (
                                            <div className="text-center py-20 text-slate-300 font-bold uppercase tracking-widest italic italic">Null Result Set</div>
                                        ) : (
                                            records.slice(0, 4).map(rec => (
                                                <div key={rec._id} className="group flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 border border-transparent hover:border-indigo-100 transition-all cursor-pointer">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-900 text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                            {rec.patientId?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 text-lg uppercase tracking-tight">{rec.patientId?.name}</div>
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                                                <span className="text-indigo-600 font-black">DX:</span> {rec.diagnosis.substring(0, 30)}...
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">{new Date(rec.createdAt).toLocaleDateString()}</div>
                                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border ${
                                                            rec.status === 'cured' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                        }`}>
                                                            {rec.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-500/40 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                                        <h3 className="text-3xl font-black mb-4 leading-none tracking-tighter italic">Create Global <br />Health Link</h3>
                                        <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest leading-relaxed mb-10">Authorize and append new patient diagnostic data to the universal ledger.</p>
                                        <button 
                                            onClick={() => setActiveTab('add')}
                                            className="w-full bg-white text-indigo-600 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            Initiate Sync
                                        </button>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Facility Identity</h4>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center">
                                                <Activity className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div className="font-black text-slate-900 uppercase tracking-tighter">Verified Clinical Node</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'add' && (
                        <motion.div 
                            key="add"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-2xl shadow-indigo-500/10">
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="p-5 bg-indigo-50 rounded-[2rem] text-indigo-600">
                                        <PlusCircle className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Diagnostic Data Entry</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">LifeMap V2.0 Compliance Mode Active</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {message && (
                                        <div className={`p-6 rounded-[2rem] flex items-center gap-4 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                            <div className={`p-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                            </div>
                                            <span className="font-black text-xs uppercase tracking-widest">{message.text}</span>
                                        </div>
                                    )}
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Patient Global ID (Email)</label>
                                            <div className="relative group">
                                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                                <input
                                                    type="email"
                                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-8 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold placeholder:text-slate-300"
                                                    value={patientEmail}
                                                    onChange={(e) => setPatientEmail(e.target.value)}
                                                    placeholder="patient@lifemap.network"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Clinical Evaluation Status</label>
                                            <select
                                                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-8 focus:ring-indigo-500/5 focus:bg-white outline-none appearance-none font-black text-xs uppercase tracking-widest text-slate-900 cursor-pointer"
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                            >
                                                <option value="active">Active Monitoring</option>
                                                <option value="cured">Successful Remission</option>
                                                <option value="chronic">Long-Term Care Required</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-3 font-bold italic italic">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 font-sans">Primary Diagnostic Statement</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:border-indigo-500 outline-none transition-all font-bold"
                                            value={diagnosis}
                                            onChange={(e) => setDiagnosis(e.target.value)}
                                            placeholder="Specify medical condition..."
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3 font-bold italic italic">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 font-sans">Digital Prescription Matrix</label>
                                        <textarea
                                            className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:border-indigo-500 outline-none transition-all font-bold"
                                            value={prescription}
                                            onChange={(e) => setPrescription(e.target.value)}
                                            rows="4"
                                            placeholder="Medication regimen and dosage protocols..."
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-slate-950 hover:bg-indigo-600 text-white font-black py-6 rounded-[2rem] transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.3em] active:scale-95 disabled:opacity-70 group"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" /> Finalizing Sync...
                                            </>
                                        ) : (
                                            <>
                                                Authorize Submission <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const NavButton = ({ active, icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all ${
            active 
            ? 'bg-slate-900 text-white shadow-xl shadow-black/10' 
            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
        <div className={`${active ? 'text-indigo-400' : 'text-slate-300'}`}>{icon}</div> {label}
    </button>
);

const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex items-center gap-6 group hover:border-indigo-100 transition-all">
        <div className={`p-4 rounded-[1.5rem] ${color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'} group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</div>
            <div className="text-4xl font-black text-slate-900 tracking-tighter italic">{value}</div>
        </div>
    </div>
);

export default DoctorDashboard;
