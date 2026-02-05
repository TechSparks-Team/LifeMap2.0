import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { 
    ShieldCheck, Database, Users, Activity, 
    ArrowUpRight, Loader2, Search, Filter,
    Download, LayoutDashboard, Globe, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const GovernmentDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAllRecords = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/records`, config);
                setRecords(data);
            } catch (error) {
                console.error('Error fetching system records:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchAllRecords();
    }, [user]);

    const filteredRecords = records.filter(r => 
        r.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.hospitalId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            {/* Top Stat Bar */}
            <div className="bg-white border-b border-gray-100 p-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-1 font-sans">
                            <Globe className="w-3 h-3" /> Live Health Registry
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">Administrative Oversight</h1>
                        <p className="text-gray-500 font-bold mt-2 italic italic uppercase text-[10px] tracking-widest">{user.name} • Internal Affairs Dept.</p>
                    </div>

                    <div className="flex gap-4">
                        <StatCard label="Total Records" value={records.length} icon={<Database className="text-blue-600" />} />
                        <StatCard label="Hospitals Active" value={new Set(records.map(r => r.hospitalId?._id)).size} icon={<Activity className="text-purple-600" />} />
                        <StatCard label="Patients Tracked" value={new Set(records.map(r => r.patientId?._id)).size} icon={<Users className="text-emerald-600" />} />
                    </div>
                </div>
            </div>

            <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 font-bold italic italic" />
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-medium"
                                    placeholder="Search registry by patient, hospital, or diagnosis..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="p-3 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-all">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95">
                            <Download className="w-4 h-4" /> Export Report
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">Patient Detail</th>
                                    <th className="px-8 py-5">Verified Hospital</th>
                                    <th className="px-8 py-5">Diagnostic Tag</th>
                                    <th className="px-8 py-5 text-right font-bold italic italic font-sans uppercase underline decoration-gray-900 decoration-dotted decoration-2">Status Flag</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : filteredRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center font-bold text-gray-400">
                                            <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                            No database entries found matching your query.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRecords.map((rec) => (
                                        <tr key={rec._id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-extrabold text-gray-900 tracking-tight">{rec.patientId?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-400 font-bold font-sans italic italic lowercase underline decoration-blue-100 decoration-dotted decoration-2">{rec.patientId?.email}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 font-bold text-gray-700">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    {rec.hospitalId?.name || 'Undefined Facility'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-gray-900">{rec.diagnosis}</div>
                                                <div className="text-[10px] text-gray-400 uppercase font-black tracking-tighter leading-none mt-1">Recorded {new Date(rec.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`px-4 py-1.5 rounded-2xl font-extrabold text-[10px] uppercase tracking-widest ${
                                                    rec.status === 'cured' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {rec.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center italic italic">
                        <span className="text-xs font-bold text-gray-400 italic italic">Showing {filteredRecords.length} of {records.length} global entries</span>
                        <div className="flex items-center gap-4 text-xs font-bold text-blue-600 uppercase tracking-widest font-sans">
                            <ShieldCheck className="w-4 h-4" /> Endpoint SECURE: ID-GX-99
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button onClick={logout} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-red-500 rounded-2xl font-bold hover:bg-red-50 transition-all font-sans uppercase">
                        <ArrowUpRight className="rotate-90 w-4 h-4" /> End Oversight Session
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon }) => (
    <div className="flex items-center gap-4 bg-gray-50/50 px-6 py-4 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white transition-all">
        <div className="p-3 bg-white rounded-xl shadow-sm">
            {icon}
        </div>
        <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</div>
            <div className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{value}</div>
        </div>
    </div>
);

export default GovernmentDashboard;
