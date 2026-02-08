import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { 
    Users, PlusCircle, Search, FileText, Activity, 
    ArrowUpRight, Clock, CheckCircle2, AlertCircle, Loader2,
    Calendar, ChevronRight, LayoutDashboard, Database,
    ShieldCheck, Building2, MapPin, Phone, Briefcase,
    FileEdit, Settings, ExternalLink, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HospitalDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };
    const [records, setRecords] = useState([]);
    const [activeTab, setActiveTab] = useState('overview'); // overview, history, doctors, profile
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Profile State
    const [profile, setProfile] = useState(null);
    const [editProfile, setEditProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        address: '', city: '', state: '', zipCode: '', 
        phone: '', hospitalType: '', specialties: [],
        governmentLicense: '', officialContact: '',
        ownership: ''
    });

    // Doctor State
    const [doctors, setDoctors] = useState([]);
    const [doctorForm, setDoctorForm] = useState({ name: '', email: '', password: '', medicalLicense: '' });


    const fetchRecords = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/records`, config);
            setRecords(data);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/doctors`, config);
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchProfile = async () => {
        setFetching(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/hospital-profile`, config);
            setProfile(data);
            setProfileData({
                address: data.address || '',
                city: data.city || '',
                state: data.state || '',
                zipCode: data.zipCode || '',
                phone: data.phone || '',
                hospitalType: data.hospitalType || '',
                specialties: data.specialties || [],
                governmentLicense: data.governmentLicense || '',
                officialContact: data.officialContact || '',
                ownership: data.ownership || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchRecords();
        fetchDoctors();
        fetchProfile();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL}/auth/hospital-profile`, profileData, config);
            setMessage({ type: 'success', text: 'Facility profile updated successfully.' });
            setEditProfile(false);
            fetchProfile();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/add-doctor`, doctorForm, config);
            setMessage({ type: 'success', text: 'Doctor authorized and linked.' });
            setDoctorForm({ name: '', email: '', password: '', medicalLicense: '' });
            fetchDoctors();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to register doctor.' });
        } finally {
            setLoading(false);
        }
    };


    const renderHeader = () => (
        <header className="mb-8 border-b border-gray-200 pb-6">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                            {activeTab.replace('-', ' ')}
                        </h1>
                        <div className="flex items-center gap-1 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                            <ShieldCheck className="w-3 h-3" /> GOVERNMENT TERMINAL
                        </div>
                    </div>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> {profile?.user?.name || user.name} • 
                        <span className={`text-xs font-bold ${profile?.accreditationStatus === 'Verified' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {profile?.accreditationStatus || 'Pending'} Accreditation
                        </span>
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Network Status</div>
                        <div className="flex items-center gap-1.5 text-emerald-500 font-black text-xs uppercase">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Encrypted Sync Active
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <div className="w-72 bg-slate-900 text-white fixed h-full flex flex-col z-50">
                <div className="p-8 pb-12">
                    <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic">
                        LIFEMAP <div className="p-1 bg-emerald-500 rounded text-slate-900 not-italic"><Activity className="w-5 h-5" /></div>
                    </div>
                    <div className="mt-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Medical Authority Node</div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <SidebarLink active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard />} label="Node Insight" />
                    <SidebarLink active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<Building2 />} label="Facility Profile" />
                    <SidebarLink active={activeTab === 'doctors'} onClick={() => setActiveTab('doctors')} icon={<UserCheck />} label="Staff Registry" />
                    <SidebarLink active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<Database />} label="Network Registry" />
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                        Sign Out Terminal <ArrowUpRight className="w-4 h-4 rotate-90" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="ml-72 flex-1 p-10 max-w-7xl">
                {renderHeader()}

                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 border shadow-sm ${
                            message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                        }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-bold text-sm uppercase tracking-tight">{message.text}</span>
                        <button onClick={() => setMessage(null)} className="ml-auto text-xs font-black uppercase underline">Dismiss</button>
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatsBox label="Records Synced" value={records.length} icon={<Database />} color="blue" />
                                <StatsBox label="Staff Capacity" value={doctors.length} icon={<Users />} color="emerald" />
                                <StatsBox label="Daily Throughput" value={records.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length} icon={<Activity />} color="amber" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl font-black text-slate-900 uppercase">Recent Diagnostics</h3>
                                        <button onClick={() => setActiveTab('history')} className="text-xs font-black text-blue-600 flex items-center gap-1 hover:underline underline-offset-4">
                                            FULL REGISTRY <ExternalLink className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {records.slice(0, 4).map(rec => (
                                            <div key={rec._id} className="group p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-lg transition-all flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center font-black text-slate-600 uppercase tracking-tighter">
                                                        {rec.patientId?.name?.slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 uppercase text-sm tracking-tight">{rec.patientId?.name}</div>
                                                        <div className="text-xs text-slate-500 font-black italic">{rec.diagnosis}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">{new Date(rec.createdAt).toLocaleDateString()}</div>
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                                        rec.status === 'cured' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>{rec.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="flex flex-col gap-8">
                                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden flex-1 group shadow-2xl shadow-slate-900/40">
                                        <div className="relative z-10 h-full flex flex-col justify-between">
                                            <div>
                                                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                                                    <Database className="text-white" />
                                                </div>
                                                <h3 className="text-3xl font-black leading-tight mb-4 uppercase tracking-tighter">
                                                    Facility Oversight <br />Network Registry
                                                </h3>
                                                <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed italic">
                                                    Monitor all diagnostic data synchronized by authorized medical staff across the national healthcare network.
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => setActiveTab('history')}
                                                className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                            >
                                                Open Network Registry <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-slate-800 rounded-full blur-[100px] opacity-50 group-hover:bg-blue-500/20 transition-all" />
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'profile' && (
                        <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
                                <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                            Facility Registry Data <ShieldCheck className="text-emerald-500 w-6 h-6" />
                                        </h3>
                                        <p className="text-slate-400 text-sm font-medium italic mt-1">Authorized health facility credentials</p>
                                    </div>
                                    {!editProfile && (
                                        <button onClick={() => setEditProfile(true)} className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                                            Edit Registry
                                        </button>
                                    )}
                                </div>

                                <div className="p-10">
                                    {editProfile ? (
                                        <form onSubmit={handleProfileUpdate} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <FormInput label="Official Address" value={profileData.address} onChange={(v) => setProfileData({...profileData, address: v})} placeholder="123 Health Ave" />
                                                <FormInput label="Government License #" value={profileData.governmentLicense} onChange={(v) => setProfileData({...profileData, governmentLicense: v})} placeholder="GOV-HOSP-XXXX" />
                                                <FormInput label="Official Contact" value={profileData.officialContact} onChange={(v) => setProfileData({...profileData, officialContact: v})} placeholder="Director / Liaison Name" />
                                                <FormInput label="Facility Phone" value={profileData.phone} onChange={(v) => setProfileData({...profileData, phone: v})} placeholder="+1 (555) 000-0000" />
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hospital Type</label>
                                                    <select 
                                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-900"
                                                        value={profileData.hospitalType}
                                                        onChange={(e) => setProfileData({...profileData, hospitalType: e.target.value})}
                                                    >
                                                        <option value="General">General Medical</option>
                                                        <option value="Multi-Specialty">Multi-Specialty Center</option>
                                                        <option value="Clinic">Specialized Clinic</option>
                                                        <option value="Specialized Central">Regional Central Hub</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Facility Ownership</label>
                                                    <select 
                                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-900"
                                                        value={profileData.ownership}
                                                        onChange={(e) => setProfileData({...profileData, ownership: e.target.value})}
                                                    >
                                                        <option value="Private">Private Facility</option>
                                                        <option value="Government">Government Institution</option>
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <FormInput label="City" value={profileData.city} onChange={(v) => setProfileData({...profileData, city: v})} />
                                                    <FormInput label="State" value={profileData.state} onChange={(v) => setProfileData({...profileData, state: v})} />
                                                    <FormInput label="Zip" value={profileData.zipCode} onChange={(v) => setProfileData({...profileData, zipCode: v})} />
                                                </div>
                                            </div>
                                            <div className="flex gap-4 pt-4">
                                                <button type="submit" disabled={loading} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 disabled:opacity-50">
                                                    Sync Profile Update
                                                </button>
                                                <button type="button" onClick={() => setEditProfile(false)} className="px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em]">
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                            <ProfileItem icon={<MapPin className="text-blue-500" />} label="Official Address" value={`${profileData.address}, ${profileData.city}, ${profileData.state} ${profileData.zipCode}`} />
                                            <ProfileItem icon={<ShieldCheck className="text-emerald-500" />} label="Network License" value={profileData.governmentLicense || 'Not Disclosed'} />
                                            <ProfileItem icon={<Briefcase className="text-purple-500" />} label="Authorized Contact" value={profileData.officialContact || 'Not Set'} />
                                            <ProfileItem icon={<Phone className="text-amber-500" />} label="Direct Liaison" value={profileData.phone || 'No Phone Linked'} />
                                            <ProfileItem icon={<ShieldCheck className="text-emerald-500" />} label="Ownership" value={profileData.ownership || 'Private'} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'doctors' && (
                        <motion.div key="doctors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-fit">
                                    <h3 className="text-xl font-black text-slate-900 uppercase mb-8 flex items-center gap-2">
                                        Authorizing Personnel
                                    </h3>
                                    <form onSubmit={handleAddDoctor} className="space-y-5">
                                        <FormInput label="Doctor's Legal Name" value={doctorForm.name} onChange={(v) => setDoctorForm({...doctorForm, name: v})} placeholder="Dr. Jane Doe" required />
                                        <FormInput label="Auth Email" type="email" value={doctorForm.email} onChange={(v) => setDoctorForm({...doctorForm, email: v})} placeholder="doctor@node.gov" required />
                                        <FormInput label="Security Key" type="password" value={doctorForm.password} onChange={(v) => setDoctorForm({...doctorForm, password: v})} placeholder="••••••••" required />
                                        <FormInput label="Medical License #" value={doctorForm.medicalLicense} onChange={(v) => setDoctorForm({...doctorForm, medicalLicense: v})} placeholder="MED-CERT-XXXX" required />
                                        <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4">
                                            {loading ? 'Processing...' : 'Verify & Add Staff'}
                                        </button>
                                    </form>
                                </section>

                                <section className="lg:col-span-2 space-y-4">
                                    <div className="flex justify-between items-center px-4">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Medical Staff ({doctors.length})</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                        {doctors.map(doc => (
                                            <div key={doc._id} className="bg-white p-6 rounded-3xl border border-slate-200 group hover:shadow-xl hover:border-blue-500/50 transition-all flex flex-col justify-between h-48">
                                                <div className="flex items-start justify-between">
                                                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white shadow-lg overflow-hidden italic">
                                                        LM<Activity className="w-3 h-3 text-emerald-400" />
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-1">
                                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> AUTHORIZED
                                                        </div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">SN: {doc._id.slice(-8)}</div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="text-lg font-black text-slate-900 uppercase tracking-tight truncate">{doc.name}</div>
                                                    <div className="text-xs text-slate-500 font-black italic">{doc.email}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    )}


                    {activeTab === 'history' && (
                        <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
                                        Facility Oversight Registry <Database className="text-blue-500" />
                                    </h3>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="text" placeholder="Search Global ID..." className="pl-12 pr-6 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold outline-none ring-slate-900/5 focus:ring-4 transition-all" />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-100 italic">
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Identity</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnosis Status</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth Doctor</th>
                                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 italic">
                                            {records.map(rec => (
                                                <tr key={rec._id} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                                                    <td className="px-8 py-6">
                                                        <div className="font-bold text-slate-900 uppercase text-sm">{rec.patientId?.name}</div>
                                                        <div className="text-[10px] font-black text-slate-400">{rec.patientId?.email}</div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="text-xs font-black text-slate-700 uppercase mb-1">{rec.diagnosis}</div>
                                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                                            rec.status === 'cured' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                                        }`}>{rec.status}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                                            <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[8px] font-black">
                                                                {rec.doctorId?.user?.name?.slice(0, 1) || 'H'}
                                                            </div>
                                                            {rec.doctorId?.user?.name || 'Authorized Staff'}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="text-xs font-black text-slate-500 uppercase tracking-tighter">
                                                            {new Date(rec.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {records.length === 0 && <div className="text-center py-20 text-slate-400 font-black uppercase italic tracking-widest">Registry Node Empty</div>}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

// Simplified Components
const SidebarLink = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.25rem] transition-all font-black text-[10px] uppercase tracking-[0.15em] ${
            active 
            ? 'bg-emerald-500 text-slate-900 shadow-xl shadow-emerald-500/20 scale-[1.05] relative z-10' 
            : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
        }`}
    >
        <span className={`${active ? 'text-slate-900' : 'text-slate-500'}`}>{icon}</span> {label}
    </button>
);

const StatsBox = ({ label, value, icon, color }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            color === 'blue' ? 'bg-blue-50 text-blue-600' : 
            color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
        } transition-transform group-hover:scale-110`}>
            {icon}
        </div>
        <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</div>
            <div className="text-3xl font-black text-slate-900 tracking-tighter">{value}</div>
        </div>
    </div>
);

const FormInput = ({ label, value, onChange, type="text", placeholder, required=false }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <input 
            type={type}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all italic tracking-tight"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
        />
    </div>
);

const ProfileItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 italic">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-sm font-bold text-slate-800 leading-snug">{value}</div>
        </div>
    </div>
);

export default HospitalDashboard;
