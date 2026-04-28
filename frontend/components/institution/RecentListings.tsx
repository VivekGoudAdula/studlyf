import React, { useState, useEffect } from 'react';
import { MoreHorizontal, ExternalLink, Users, ArrowRight, Eye, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecentListingsProps {
    onViewEvent?: (id: string) => void;
}

const RecentListings: React.FC<RecentListingsProps> = ({ onViewEvent }) => {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await fetch('/api/v1/institution/events');
                const data = await res.json();
                // Take the 5 most recent events
                setListings(data.slice(0, 5).map((e: any) => ({
                    id: e._id,
                    title: e.title,
                    type: e.category || 'Hackathon',
                    applied: e.participant_count || 0,
                    status: e.status || 'Live',
                    date: new Date(e.start_date).toLocaleDateString()
                })));
            } catch (err) {
                console.error("Failed to load recent listings");
            } finally {
                setLoading(false);
            }
        };
        fetchRecent();
    }, []);

    if (loading) return <div className="h-64 bg-white/50 animate-pulse rounded-[3rem] border border-slate-100" />;
    return (
        <div className="bg-white/40 backdrop-blur-md p-2 rounded-[3rem] border border-white/20 shadow-2xl shadow-slate-200/40">
            <div className="bg-white rounded-[2.5rem] overflow-hidden">
                <div className="p-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 font-['Outfit']">Recent Events</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Activity Overview</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-bold text-[#6C3BFF] hover:underline px-4 py-2 bg-purple-50 rounded-xl transition-all">
                        View All <ArrowRight size={16} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Name</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Registrations</th>
                                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {listings.map((item) => (
                                <motion.tr 
                                    key={item.id} 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 mb-1 group-hover:text-[#6C3BFF] transition-colors">{item.title}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{item.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Users size={14} className="text-[#6C3BFF]" />
                                            <span className="font-black text-slate-700">{item.applied.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                            item.status === 'Live' 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : item.status === 'Draft'
                                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                                : 'bg-slate-50 text-slate-400 border-slate-100'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => onViewEvent?.(item.id)}
                                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#6C3BFF] hover:bg-purple-50 rounded-xl transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RecentListings;
