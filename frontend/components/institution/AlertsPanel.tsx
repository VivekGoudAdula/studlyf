import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, Star, Info, ChevronRight, Zap } from 'lucide-react';

const AlertsPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState('alerts');
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await fetch('/api/v1/institution/notifications');
                const data = await res.json();
                setAlerts(data.map((a: any) => ({
                    id: a._id,
                    title: a.title,
                    desc: a.message,
                    time: a.time_ago || 'Just now',
                    type: a.type || 'info',
                    icon: a.type === 'success' ? Zap : a.type === 'warning' ? Calendar : Info
                })));
            } catch (err) {
                console.error("Failed to load alerts");
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-[3rem] shadow-2xl shadow-slate-200/40 p-2 h-full flex flex-col">
            <div className="bg-white rounded-[2.5rem] p-8 h-full flex flex-col">
                <div className="flex items-center gap-6 mb-8 border-b border-slate-50">
                    <button 
                        onClick={() => setActiveTab('alerts')}
                        className={`text-sm font-bold relative pb-4 transition-colors ${activeTab === 'alerts' ? 'text-[#6C3BFF]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Activity
                        {activeTab === 'alerts' && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#6C3BFF] rounded-full" />
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('upcoming')}
                        className={`text-sm font-bold relative pb-4 transition-colors ${activeTab === 'upcoming' ? 'text-[#6C3BFF]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Schedule
                        {activeTab === 'upcoming' && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#6C3BFF] rounded-full" />
                        )}
                    </button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
                    {alerts.map((alert, idx) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group flex items-start gap-4 p-4 rounded-[1.5rem] bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all border border-transparent hover:border-slate-100 cursor-pointer"
                        >
                            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                                alert.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 
                                alert.type === 'info' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'
                            }`}>
                                <alert.icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h4 className="font-bold text-slate-900 text-sm truncate">{alert.title}</h4>
                                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{alert.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{alert.desc}</p>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 mt-1 group-hover:translate-x-0.5 transition-transform" />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 bg-gradient-to-br from-[#6C3BFF] to-[#8B5CF6] p-6 rounded-[2rem] relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                                <Star size={14} className="text-white" fill="white" />
                            </div>
                            <h4 className="text-white font-bold text-sm">Premium Support</h4>
                        </div>
                        <p className="text-purple-100 text-[10px] leading-relaxed mb-4">
                            Need help setting up your next large-scale hackathon? Our experts are here.
                        </p>
                        <button className="w-full bg-white text-[#6C3BFF] text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-purple-50 transition-all shadow-lg shadow-purple-900/20">
                            Upgrade Plan
                        </button>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
};

export default AlertsPanel;
