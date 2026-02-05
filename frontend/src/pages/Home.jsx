import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Database, Users, ArrowRight, CheckCircle2, HeartPulse } from 'lucide-react';

const Home = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Hero Section */}
            <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-8"
                        >
                            <Shield className="w-4 h-4" /> SECURE HEALTHCARE ECOSYSTEM
                        </motion.div>
                        <motion.h1 
                            {...fadeIn}
                            className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6"
                        >
                            Bridging the gap between <br />
                            <span className="text-blue-600">Care and Information</span>
                        </motion.h1>
                        <motion.p 
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
                        >
                            LifeMap is a unified healthcare management platform that securely syncs patient records 
                            across hospitals and government registries, ensuring every decision is backed by data.
                        </motion.p>
                        <motion.div 
                            {...fadeIn}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link to="/register" className="group flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700 transition-all font-bold text-lg hover:scale-105 active:scale-95">
                                Start Your Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all font-bold text-lg">
                                Access Dashboard
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mt-20 relative"
                    >
                        <div className="absolute inset-0 bg-blue-400 blur-[100px] opacity-20 -z-10 rounded-full" />
                        <div className="bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 transform -rotate-1">
                            <img 
                                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070" 
                                alt="Healthcare Dashboard" 
                                className="rounded-2xl border border-gray-100 shadow-inner"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Empowering Every Stakeholder</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg italic italic">Designed to meet the rigorous demands of modern healthcare infrastructure.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <FeatureCard 
                        icon={<HeartPulse className="w-8 h-8 text-rose-500" />}
                        title="For Patients"
                        description="One identity, one medical history. Access your complete health story across all providers with total privacy control."
                        benefits={["Full history access", "Treatment tracking", "Zero data loss"]}
                        color="rose"
                    />
                    <FeatureCard 
                        icon={<Database className="w-8 h-8 text-blue-500" />}
                        title="For Hospitals"
                        description="Eradicate information silos. Streamline diagnoses and prescriptions with instant access to verified patient data."
                        benefits={["Digital prescriptions", "Integrated analytics", "Workflow optimization"]}
                        color="blue"
                    />
                    <FeatureCard 
                        icon={<Shield className="w-8 h-8 text-emerald-500" />}
                        title="For Government"
                        description="Monitor public health trends in real-time. Use anonymized aggregate data to manage resources and respond to crises."
                        benefits={["Real-time health stats", "Resource allocation", "Policy oversight"]}
                        color="emerald"
                    />
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-900 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-white">
                    <div>
                        <div className="text-4xl font-extrabold mb-2 underline decoration-blue-500 decoration-4">99.9%</div>
                        <div className="text-gray-400 font-medium">Data Integrity</div>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold mb-2 underline decoration-emerald-500 decoration-4">Instant</div>
                        <div className="text-gray-400 font-medium">Record Access</div>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold mb-2 underline decoration-purple-500 decoration-4">Secure</div>
                        <div className="text-gray-400 font-medium">Cloud Storage</div>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold mb-2 underline decoration-rose-500 decoration-4">24/7</div>
                        <div className="text-gray-400 font-medium">Availability</div>
                    </div>
                </div>
            </div>
            
            <footer className="py-12 border-t border-gray-100 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <HeartPulse className="text-blue-600 w-6 h-6" />
                    <span className="text-xl font-bold text-gray-900">LifeMap</span>
                </div>
                <p className="text-gray-400 text-sm">© 2026 LifeMap Healthcare. All rights reserved.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, benefits, color }) => {
    const colorMap = {
        rose: 'bg-rose-50 text-rose-500',
        blue: 'bg-blue-50 text-blue-500',
        emerald: 'bg-emerald-50 text-emerald-500'
    };

    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="group p-8 bg-white rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all"
        >
            <div className={`p-4 rounded-2xl w-fit mb-6 group-hover:rotate-3 transition-transform ${colorMap[color].split(' ')[0]}`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 mb-8 leading-relaxed italic">{description}</p>
            <ul className="space-y-3 font-semibold">
                {benefits.map(b => (
                    <li key={b} className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle2 className={`w-4 h-4 ${colorMap[color].split(' ')[1]}`} /> {b}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};

export default Home;
