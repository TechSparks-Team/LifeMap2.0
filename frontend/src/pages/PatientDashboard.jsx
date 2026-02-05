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

    useEffect(() => {
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

        if (user) fetchRecords();
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50/50 flex">
            {/* Sidebar / Profile Summary */}
            <div className="hidden lg:flex w-80 bg-white border-r border-gray-100 p-8 flex-col fixed h-full h-full">
                <div className="mb-10 text-center">
                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-blue-500/20">
                        {user.name.charAt(0)}
                    </div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{user.name}</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Verified Patient</p>
                </div>

                <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Primary Email</div>
                        <div className="text-sm font-bold text-gray-700 truncate">{user.email}</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <div className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest mb-2">Health Status</div>
                        <div className="flex items-center gap-2 text-blue-700 font-extrabold tracking-tight">
                            <ShieldCheck className="w-4 h-4" /> SECURE & VETTED
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-8 border-t border-gray-100 italic italic">
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                        <ArrowUpRight className="rotate-90 w-4 h-4" /> Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:ml-80 p-8">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Medical Journey</h1>
                        <p className="text-gray-500 font-medium">Chronological record of your treatments across the LifeMap network.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
                            <Heart className="w-5 h-5 fill-current" />
                        </div>
                        <div className="pr-4 border-r border-gray-100">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Records</div>
                            <div className="text-lg font-extrabold text-gray-900 leading-none">{records.length}</div>
                        </div>
                        <div className="pl-2 pr-4">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</div>
                            <div className="text-sm font-extrabold text-emerald-500 leading-none">ACTIVE</div>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Secure Records...</p>
                    </div>
                ) : records.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-16 rounded-3xl border border-gray-100 shadow-xl text-center max-w-2xl mx-auto"
                    >
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ClipboardList className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 underline decoration-blue-600">No History Found</h3>
                        <p className="text-gray-500 font-medium px-8 italic italic">Your medical journey is just beginning. When a hospital partner synchronizes a record with your email, it will appear here instantly.</p>
                    </motion.div>
                ) : (
                    <div className="max-w-4xl space-y-8 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gray-200 -z-10" />

                        {records.map((rec, index) => (
                            <motion.div 
                                key={rec._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative flex gap-8 group"
                            >
                                {/* Timeline Dot */}
                                <div className="mt-6 w-20 h-20 flex-shrink-0 bg-white rounded-3xl border-2 border-gray-100 flex flex-col items-center justify-center shadow-lg group-hover:border-blue-500 transition-colors">
                                    <div className="text-xs font-extrabold text-gray-400 uppercase tracking-tight leading-none mb-1 font-sans">
                                        {new Date(rec.createdAt).toLocaleString('default', { month: 'short' })}
                                    </div>
                                    <div className="text-2xl font-black text-gray-900 tracking-tighter leading-none">
                                        {new Date(rec.createdAt).getDate()}
                                    </div>
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all border-l-8 border-l-blue-600">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="text-[10px] font-extrabold bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">
                                                Diagnostic Entry
                                            </span>
                                            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">{rec.diagnosis}</h3>
                                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-bold">
                                                <Stethoscope className="w-4 h-4 text-gray-400" /> Issued by: <span className="text-blue-600 underline">{rec.hospitalId?.name}</span>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-2xl font-extrabold text-xs uppercase tracking-widest ${
                                            rec.status === 'cured' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                            {rec.status}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500">
                                                    <Pill className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prescription</div>
                                                    <p className="text-sm font-bold text-gray-700 leading-relaxed mt-0.5">{rec.prescription}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4 font-bold italic italic">
                                            <div className="flex items-start gap-3 font-sans">
                                                <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                                                    <Activity className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference Date</div>
                                                    <p className="text-sm font-bold text-gray-700 mt-0.5">{new Date(rec.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {rec.notes && (
                                        <div className="mt-6 flex items-center gap-2 text-xs font-bold text-gray-400 border-t border-gray-100 pt-4 italic italic">
                                            <ShieldCheck className="w-4 h-4" /> Verification Token ID: {rec._id.slice(-8).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
