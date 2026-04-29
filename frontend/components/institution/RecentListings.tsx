
import React, { useState, useEffect, useRef } from 'react';
import { 
    Calendar, 
    Users, 
    ChevronRight, 
    MoreVertical, 
    Filter, 
    Search, 
    TrendingUp, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    X,
    LayoutGrid,
    ListFilter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecentListingsProps {
    institutionId: string;
    onViewEvent?: (eventId: string) => void;
    onViewAll?: () => void;
}

const RecentListings: React.FC<RecentListingsProps> = ({ institutionId, onViewEvent, onViewAll }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const fetchRecent = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/v1/institution/events/${institutionId}`);
            if (res.ok) {
                const data = await res.json();
                setEvents(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Failed to fetch recent listings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecent();
    }, [institutionId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredEvents = events.filter(e => {
        if (filter === 'All') return true;
        return e.status === filter;
    }).slice(0, 5);

    const getStatusStyle = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'LIVE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'ENDED': return 'bg-slate-50 text-slate-500 border-slate-100';
            case 'DRAFT': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-blue-50 text-blue-600 border-blue-100';
        }
    };

    return (
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/20 border border-slate-100 mt-8 overflow-hidden font-['Outfit']">
            {/* Header */}
            <div className="p-8 flex items-center justify-between border-b border-slate-50">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Opportunities</h3>
                    <p className="text-sm text-slate-400 font-medium">Manage your ongoing and upcoming institutional events.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Real Filter Toggle */}
                    <div className="relative" ref={filterRef}>
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`p-3 border rounded-2xl transition-all ${isFilterOpen ? 'bg-purple-50 border-[#6C3BFF] text-[#6C3BFF]' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                            <ListFilter size={20} />
                        </button>

                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-48 bg-white rounded-3xl border border-slate-100 shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="p-4 border-b border-slate-50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter Status</p>
                                    </div>
                                    <div className="p-2">
                                        {['All', 'Live', 'Draft', 'Ended'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilter(status);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${filter === status ? 'bg-purple-50 text-[#6C3BFF]' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button 
                        onClick={onViewAll}
                        className="px-6 py-3 bg-[#6C3BFF] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-purple-200 hover:scale-105 transition-all flex items-center gap-2"
                    >
                        View All <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="p-4">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="text-left px-6 py-5">Opportunity Details</th>
                                <th className="text-left px-6 py-5">Registrations</th>
                                <th className="text-left px-6 py-5">Status</th>
                                <th className="text-right px-6 py-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-6"><div className="h-12 bg-slate-50 rounded-2xl w-2/3" /></td>
                                        <td className="px-6 py-6"><div className="h-6 bg-slate-50 rounded-xl w-1/3" /></td>
                                        <td className="px-6 py-6"><div className="h-8 bg-slate-50 rounded-full w-20" /></td>
                                        <td className="px-6 py-6 text-right"><div className="h-10 w-10 bg-slate-50 rounded-xl ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filteredEvents.length > 0 ? (
                                filteredEvents.map((item) => (
                                    <tr key={item._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
                                                    <Calendar size={20} className="text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 leading-tight group-hover:text-[#6C3BFF] transition-colors">{item.title}</p>
                                                    <p className="text-xs text-slate-400 mt-1 font-medium">{item.event_type || 'Opportunity'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Users size={16} className="text-slate-300" />
                                                <span className="text-sm font-bold">{item.participant_count || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(item.status)}`}>
                                                {item.status || 'Live'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button 
                                                onClick={() => onViewEvent?.(item._id)}
                                                className="p-3 text-slate-300 hover:text-[#6C3BFF] hover:bg-white hover:shadow-lg rounded-xl transition-all"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <LayoutGrid size={24} className="text-slate-200" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No matching opportunities found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RecentListings;
