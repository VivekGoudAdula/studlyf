
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, Star, Info, ChevronRight, Zap, Clock } from 'lucide-react';

interface AlertsPanelProps {
    institutionId?: string;
    onUpgrade?: () => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ institutionId = 'default_inst', onUpgrade }) => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [alerts, setAlerts] = useState<any[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch Notifications (What's New)
                const notifRes = await fetch(`/api/v1/institution/notifications/${institutionId}`);
                if (notifRes.ok) {
                    const notifData = await notifRes.json();
                    setAlerts(Array.isArray(notifData) ? notifData : []);
                }

                // Fetch Events (Upcoming Activity)
                const eventRes = await fetch(`/api/v1/institution/events/${institutionId}`);
                if (eventRes.ok) {
                    const eventData = await eventRes.json();
                    if (Array.isArray(eventData)) {
                        const now = new Date();
                        const upcoming = eventData
                            .filter(e => new Date(e.start_date || e.created_at) >= now)
                            .sort((a, b) => new Date(a.start_date || a.created_at).getTime() - new Date(b.start_date || b.created_at).getTime())
                            .slice(0, 5);
                        setUpcomingEvents(upcoming);
                    }
                }
            } catch (err) {
                console.error("Failed to load alerts/events:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [institutionId]);

    const formatTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return "10:00 AM";
        }
    };

    const formatDateLabel = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);

            if (date.toDateString() === now.toDateString()) return "Today";
            if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        } catch (e) {
            return "Upcoming";
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/20 border border-slate-100 overflow-hidden h-full flex flex-col font-['Outfit']">
            {/* Tab Header */}
            <div className="p-8 pb-0">
                <div className="flex items-center gap-8 border-b border-slate-50">
                    <button 
                        onClick={() => setActiveTab('upcoming')}
                        className={`text-xs font-black uppercase tracking-[0.2em] relative pb-5 transition-all ${activeTab === 'upcoming' ? 'text-[#6C3BFF]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Upcoming Activity
                        {activeTab === 'upcoming' && (
                            <motion.div layoutId="panelTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#6C3BFF] rounded-full" />
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('new')}
                        className={`text-xs font-black uppercase tracking-[0.2em] relative pb-5 transition-all ${activeTab === 'new' ? 'text-[#6C3BFF]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        What's New
                        {activeTab === 'new' && (
                            <motion.div layoutId="panelTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#6C3BFF] rounded-full" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === 'upcoming' ? (
                        <motion.div 
                            key="upcoming"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            {upcomingEvents.length > 0 ? upcomingEvents.map((item) => {
                                const timeStr = formatTime(item.start_date || item.created_at);
                                return (
                                    <div key={item._id} className="group flex items-start gap-4 cursor-pointer">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:border-[#6C3BFF] transition-colors">
                                            <span className="text-[10px] font-black text-[#6C3BFF] uppercase tracking-tighter">{timeStr.split(' ')[1]}</span>
                                            <span className="text-sm font-black text-slate-900 leading-tight">{timeStr.split(' ')[0]}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 group-hover:text-[#6C3BFF] transition-colors">{item.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock size={12} className="text-slate-300" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatDateLabel(item.start_date || item.created_at)}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-200 mt-2 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                );
                            }) : (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calendar size={24} className="text-slate-200" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No upcoming activities</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="new"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            {alerts.length > 0 ? alerts.map((alert, idx) => (
                                <div key={alert._id || idx} className="group flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                        alert.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                                    }`}>
                                        {alert.type === 'success' ? <Zap size={18} /> : <Info size={18} />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 text-sm">{alert.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{alert.message}</p>
                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2 block">{alert.time_ago || 'Just now'}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Bell size={24} className="text-slate-200" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No new updates</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Upgrade Section */}
            <div className="p-8 pt-0">
                <div className="bg-[#6C3BFF] p-6 rounded-[2rem] relative overflow-hidden group shadow-xl shadow-purple-200/50">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Star size={16} className="text-white fill-white" />
                            <h4 className="text-white font-black text-xs uppercase tracking-widest">Premium Plan</h4>
                        </div>
                        <p className="text-purple-100/70 text-[10px] font-medium leading-relaxed mb-5">
                            Access advanced reporting and automated judge distribution.
                        </p>
                        <button 
                            onClick={onUpgrade}
                            className="w-full bg-white text-[#6C3BFF] py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-purple-50 transition-all shadow-lg"
                        >
                            Upgrade Now
                        </button>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
};

export default AlertsPanel;
