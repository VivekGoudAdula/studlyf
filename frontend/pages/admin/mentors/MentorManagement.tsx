import React, { useEffect, useState, useCallback } from 'react';
import { UserCheck, Search, Filter, Mail, Shield, MoreVertical, Star, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../../apiConfig';

interface Mentor {
    id: string;
    name: string;
    expertise: string;
    students: number;
    status: string;
}

const MentorManagement: React.FC = () => {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchMentors = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/admin/mentors`);
            const data = await response.json();
            if (Array.isArray(data)) setMentors(data);
        } catch (error) {
            console.error('Failed to fetch mentors:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMentors();
    }, [fetchMentors]);

    const filteredMentors = mentors.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.expertise.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Mentor Network</h1>
                    <p className="text-zinc-400 text-sm mt-1">Manage institutional mentors and their student assignment protocols.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-white">{mentors.length}</div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Active Mentors</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search mentors by name or expertise..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                </div>
                <button className="bg-zinc-900 border border-white/5 text-zinc-400 px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 hover:text-white transition-all">
                    <Filter size={18} /> Filters
                </button>
            </div>

            {/* Content Table */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Mentor Profile</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Expertise Area</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Assigned Load</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode='popLayout'>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                                            <span className="text-zinc-500 text-sm font-medium">Synchronizing mentor database...</span>
                                        </td>
                                    </tr>
                                ) : filteredMentors.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-zinc-500">
                                            No mentors found matching your search parameters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMentors.map((mentor, idx) => (
                                        <motion.tr 
                                            key={mentor.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/5 flex items-center justify-center text-purple-400 font-bold overflow-hidden shadow-inner">
                                                        {mentor.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors flex items-center gap-1.5">
                                                            {mentor.name}
                                                            {mentor.status === 'Available' && <CheckCircle2 className="text-green-500 w-3.5 h-3.5" />}
                                                        </div>
                                                        <div className="text-[10px] text-zinc-500 font-medium">Internal ID: #{mentor.id.padStart(4, '0')}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-zinc-800/50 border border-white/5 rounded-lg text-xs font-bold text-zinc-300">
                                                    {mentor.expertise}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="text-sm font-black text-white">{mentor.students}</span>
                                                    <span className="text-[9px] text-zinc-500 uppercase font-black">Active Learners</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                    mentor.status === 'Available' 
                                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${mentor.status === 'Available' ? 'bg-green-400' : 'bg-amber-400'} animate-pulse`} />
                                                    {mentor.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                                        <Mail size={16} />
                                                    </button>
                                                    <button className="p-2 text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MentorManagement;
