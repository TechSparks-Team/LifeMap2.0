import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { 
    Users, PlusCircle, Search, FileText, Activity, 
    ArrowUpRight, Clock, CheckCircle2, AlertCircle, Loader2,
    Calendar, ChevronRight, LayoutDashboard, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HospitalDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [records, setRecords] = useState([]);
    const [activeTab, setActiveTab] = useState('overview'); // overview, add, history

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
            setMessage({ type: 'success', text: 'Health record successfully synchronized with LifeMap.' });
            setPatientEmail('');
            setDiagnosis('');
            setPrescription('');
            setNotes('');
            fetchRecords();
            setTimeout(() => setActiveTab('overview'), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Synchronization failed. Please check the patient identity.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Side Navigation */}
            <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col fixed h-full h-full">
                <div className="flex items-center gap-2 mb-10 px-2 font-bold text-gray-900 italic italic">
                    Hospital Portal <Activity className="w-4 h-4 text-blue-600" />
                </div>
                
                <nav className="flex-1 space-y-2 font-bold uppercase tracking-tight text-xs">
                    <NavButton 
                        active={activeTab === 'overview'} 
                        onClick={() => setActiveTab('overview')}
                        icon={<LayoutDashboard className="w-4 h-4" />}
                        label="Overview"
                    />
                    <NavButton 
                        active={activeTab === 'add'} 
                        onClick={() => setActiveTab('add')}
                        icon={<PlusCircle className="w-4 h-4" />}
                        label="New Record"
                    />
                    <NavButton 
                        active={activeTab === 'history'} 
                        onClick={() => setActiveTab('history')}
                        icon={<Database className="w-4 h-4" />}
                        label="Full Registry"
                    />
                </nav>

                <div className="pt-6 mt-6 border-t border-gray-100">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <ArrowUpRight className="rotate-90 w-4 h-4" /> Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            {activeTab === 'overview' && "Hospital Insight"}
                            {activeTab === 'add' && "Diagnostic Entry"}
                            {activeTab === 'history' && "Patient Registry"}
                        </h1>
                        <p className="text-gray-500 font-medium">Verified Facility: {user.name}</p>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div 
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard label="Total Records synced" value={records.length} icon={<FileText className="text-blue-600" />} color="blue" />
                                <StatCard label="Active Patients" value={new Set(records.map(r => r.patientId?._id)).size} icon={<Users className="text-emerald-600" />} color="emerald" />
                                <StatCard label="Today's entries" value={records.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length} icon={<Clock className="text-purple-600" />} color="purple" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-gray-900">Recent Diagnostic History</h3>
                                        <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
                                    </div>
                                    <div className="space-y-4">
                                        {fetching ? (
                                            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" /></div>
                                        ) : records.length === 0 ? (
                                            <p className="text-center py-12 text-gray-400">No records found.</p>
                                        ) : (
                                            records.slice(0, 5).map(rec => (
                                                <div key={rec._id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                                            {rec.patientId?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{rec.patientId?.name}</div>
                                                            <div className="text-sm text-gray-500 font-medium italic italic">{rec.diagnosis}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-bold text-gray-900">{new Date(rec.createdAt).toLocaleDateString()}</div>
                                                        <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                                                            rec.status === 'cured' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {rec.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-4 leading-tight">Sync New Record Securely</h3>
                                        <p className="text-blue-100 italic italic mb-8">All entries are instantly hashed and synchronized with the national registry.</p>
                                    </div>
                                    <button 
                                        onClick={() => setActiveTab('add')}
                                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 py-4 rounded-xl font-bold transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                                    >
                                        <PlusCircle className="w-5 h-5" /> Start Diagnosis
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'add' && (
                        <motion.div 
                            key="add"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden max-w-2xl mx-auto"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                    <PlusCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-none mb-1">Enter Diagnostic Data</h3>
                                    <p className="text-sm text-gray-500 font-medium">Ensure patient email is verified.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                {message && (
                                    <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                        <span className="font-bold text-sm tracking-tight leading-none uppercase">{message.text}</span>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Patient Identity (Email)</label>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                                                value={patientEmail}
                                                onChange={(e) => setPatientEmail(e.target.value)}
                                                placeholder="patient@verify.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Patient Status</label>
                                        <select
                                            className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none appearance-none font-bold"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="active">Active Treatment</option>
                                            <option value="cured">Patient Recovered</option>
                                            <option value="chronic">Chronic Condition</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2 font-bold italic italic">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 font-sans">Primary Diagnosis</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none transition-all"
                                        value={diagnosis}
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                        placeholder="e.g. Chronic Hypertension"
                                        required
                                    />
                                </div>

                                <div className="space-y-2 font-bold italic italic">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 font-sans">Digital Prescription</label>
                                    <textarea
                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none transition-all"
                                        value={prescription}
                                        onChange={(e) => setPrescription(e.target.value)}
                                        rows="3"
                                        placeholder="List medications and dosage..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2 font-bold italic italic">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 font-sans">Confidential Facility Notes</label>
                                    <textarea
                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-sans"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows="2"
                                        placeholder="Internal reference only..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> SYNCHRONIZING WITH LIFEMAP...
                                        </>
                                    ) : (
                                        <>
                                            AUTHORIZE & SAVE RECORD <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
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
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold tracking-tight leading-none uppercase ${
            active 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }`}
    >
        {icon} {label}
    </button>
);

const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${color === 'blue' ? 'bg-blue-50' : color === 'emerald' ? 'bg-emerald-50' : 'bg-purple-50'}`}>
            {icon}
        </div>
        <div>
            <div className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">{label}</div>
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight underline decoration-blue-600 decoration-4">{value}</div>
        </div>
    </div>
);

export default HospitalDashboard;
