
import React from 'react';
import { motion } from 'framer-motion';
import {
    UserSquare2,
    Plus,
    Search,
    Star,
    Clock,
    MessageSquare,
    MoreVertical,
    CheckCircle2,
    Users
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const MentorManagement: React.FC = () => {
    const mentors = [
        { id: 1, name: 'Siddharth V.', expertise: 'System Design', rating: 4.9, activeStudents: 12, totalSessions: 142 },
        { id: 2, name: 'Anjali M.', expertise: 'React & Frontend', rating: 4.8, activeStudents: 8, totalSessions: 94 },
        { id: 3, name: 'Rohan K.', expertise: 'Data Structures', rating: 4.7, activeStudents: 15, totalSessions: 210 },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Mentor Network</h1>
                        <p className="text-gray-500 text-sm">Manage your pool of engineering experts and track their session performance.</p>
                    </div>
                    <button className="px-6 py-3 bg-purple-600 rounded-2xl text-sm font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all flex items-center gap-2">
                        <Plus size={18} /> Onboard Mentor
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mentors.map((mentor) => (
                        <div key={mentor.id} className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5 group hover:border-purple-500/30 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center text-white text-xl font-bold">
                                    {mentor.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <button className="p-2 text-gray-600 hover:text-white transition-colors"><MoreVertical size={20} /></button>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{mentor.name}</h3>
                            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-6">{mentor.expertise}</p>

                            <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-6 mb-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Students</p>
                                    <p className="text-lg font-bold text-white">{mentor.activeStudents}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Rating</p>
                                    <p className="text-lg font-bold text-amber-400 flex items-center gap-1">
                                        <Star size={14} className="fill-amber-400" /> {mentor.rating}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Clock size={14} />
                                    <span className="text-xs font-medium">{mentor.totalSessions} Sessions</span>
                                </div>
                                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all">View Logs</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default MentorManagement;
