
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    MoreHorizontal,
    UserPlus,
    ShieldAlert,
    Key,
    Edit3,
    MessageSquare,
    ChevronRight,
    ExternalLink,
    Github,
    Award,
    BookOpen
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const StudentManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');

    const students = [
        {
            id: 1,
            name: 'Adithya S.',
            email: 'adithya@example.com',
            course: 'Full-Stack Foundation',
            score: 88,
            status: 'Active',
            college: 'IIT Madras',
            tier: 'Gold',
            githubScore: 92
        },
        {
            id: 2,
            name: 'Neha Kapoor',
            email: 'neha@example.com',
            course: 'Advanced UI/UX',
            score: 94,
            status: 'Active',
            college: 'BITS Pilani',
            tier: 'Platinum',
            githubScore: 85
        },
        {
            id: 3,
            name: 'Rahul Varma',
            email: 'rahul@example.com',
            course: 'System Design Pro',
            score: 72,
            status: 'At Risk',
            college: 'SRM University',
            tier: 'Silver',
            githubScore: 64
        },
        {
            id: 4,
            name: 'Ishaan Gupta',
            email: 'ishaan@example.com',
            course: 'Full-Stack Foundation',
            score: 45,
            status: 'Blocked',
            college: 'VIT Vellore',
            tier: 'Bronze',
            githubScore: 32
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Student Database</h1>
                        <p className="text-gray-500 text-sm">Manage, monitor, and support {students.length} active learners.</p>
                    </div>
                    <button className="px-6 py-3 bg-purple-600 rounded-2xl text-sm font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all flex items-center gap-2">
                        <UserPlus size={18} /> Invite New Student
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or college..."
                            className="w-full bg-[#0F0F12] border border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-purple-500/30 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {['All', 'Gold Tier', 'Platinum', 'At Risk', 'Blocked'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap border transition-all ${selectedFilter === filter
                                    ? 'bg-purple-600/10 border-purple-500/30 text-purple-400'
                                    : 'bg-[#0F0F12] border-white/5 text-gray-500 hover:border-white/10 hover:text-white'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                        <button className="px-4 py-2.5 rounded-xl bg-[#0F0F12] border border-white/5 text-gray-400 hover:text-white flex items-center gap-2">
                            <Filter size={16} /> Filters
                        </button>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-[#0F0F12] border border-white/5 rounded-[32px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Student</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Course & College</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Performance</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Tier</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {students.map((student) => (
                                    <motion.tr
                                        key={student.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/5 transition-colors cursor-pointer"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-800/20 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400 uppercase">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{student.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <BookOpen size={14} className="text-gray-500" />
                                                <p className="text-xs font-medium text-gray-300">{student.course}</p>
                                            </div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{student.college}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 min-w-[100px]">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Score: {student.score}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full bg-purple-500`}
                                                            style={{ width: `${student.score}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                                                    <Github size={12} className="text-gray-400" />
                                                    <span className="text-[10px] font-bold text-white">{student.githubScore}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20`}>
                                                {student.tier}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                    student.status === 'At Risk' ? 'bg-amber-500' : 'bg-rose-500'
                                                    }`} />
                                                <span className="text-xs font-medium text-gray-300">{student.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all" title="Reset Password">
                                                    <Key size={16} />
                                                </button>
                                                <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all" title="Send Message">
                                                    <MessageSquare size={16} />
                                                </button>
                                                <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all" title="View Details">
                                                    <ExternalLink size={16} />
                                                </button>
                                                <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-rose-400 hover:bg-rose-400/5 transition-all" title="Block Student">
                                                    <ShieldAlert size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 py-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-xs font-medium">Showing 4 of 12,482 students</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 text-xs font-bold hover:text-white transition-all">Previous</button>
                            <button className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default StudentManagement;
