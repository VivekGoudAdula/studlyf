
import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Mail,
    ShieldAlert,
    History,
    UserPlus,
    CheckCircle2,
    XCircle,
    Download
} from 'lucide-react';
import { motion } from 'framer-motion';

import { API_BASE_URL } from '../../../apiConfig';
import { useAuth } from '../../../AuthContext';

const StudentManagement: React.FC = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        const fetchStudents = async () => {
            if (!user?.email) return;
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/students`, {
                    headers: { 'X-Admin-Email': user.email }
                });
                const data = await response.json();
                // Map Firestore structure to UI structure
                const formatted = data.map((s: any) => ({
                    id: s.uid || Math.random().toString(),
                    name: s.displayName || 'Anonymous Student',
                    email: s.email || 'N/A',
                    course: s.role === 'super_admin' ? 'Admin' : 'Active Learner',
                    score: s.skill_score || 0,
                    status: s.status === 'active' ? 'Hiring Ready' : 'In Assessment',
                    college: s.college || 'StudLyf Partner',
                    joined: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'
                }));
                setStudents(formatted);
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [user]);

    const tabs = ['All', 'Placed', 'Hiring Ready', 'In Assessment', 'Needs Improvement'];

    const filteredStudents = students.filter(s =>
        (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (activeTab === 'All' || s.status === activeTab)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Student Management</h1>
                    <p className="text-white/50 mt-1">Manage, track, and support the entire student community.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors">
                        <Download size={18} />
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-500/20">
                        <UserPlus size={18} />
                        Register Student
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab
                                ? 'bg-white/10 text-white border border-white/20'
                                : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                        type="search"
                        placeholder="Search students by name, email or college..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/70 hover:text-white transition-all">
                    <Filter size={18} />
                    Advanced Filters
                </button>
            </div>

            {/* Students Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/10">
                                <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Course & College</th>
                                <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-center">Skill Score</th>
                                <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredStudents.map((student) => (
                                <motion.tr
                                    key={student.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-white/[0.02] transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center font-bold text-white/80">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-white">{student.name}</div>
                                                <div className="text-xs text-white/40">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-white/80">{student.course}</div>
                                        <div className="text-xs text-white/40">{student.college}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`text-sm font-bold ${student.score >= 90 ? 'text-green-400' : student.score >= 75 ? 'text-blue-400' : 'text-orange-400'}`}>
                                            {student.score}%
                                        </div>
                                        <div className="w-20 bg-white/5 h-1 rounded-full mx-auto mt-1 overflow-hidden">
                                            <div className={`h-full rounded-full ${student.score >= 90 ? 'bg-green-500' : student.score >= 75 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{ width: `${student.score}%` }} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${student.status === 'Placed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                            student.status === 'Hiring Ready' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                student.status === 'Interviewing' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                    student.status === 'Needs Improvement' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        'bg-white/10 text-white/60 border-white/10'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white/40 font-mono">
                                        {student.joined}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all shadow-sm" title="Send Message">
                                                <Mail size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all shadow-sm" title="View History">
                                                <History size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-red-500 transition-all shadow-sm" title="Restrict Access">
                                                <ShieldAlert size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all shadow-sm">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredStudents.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="text-white/20 mb-2 flex justify-center"><Search size={48} /></div>
                            <h3 className="text-white/60 font-medium">No students found</h3>
                            <p className="text-white/30 text-sm">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4">
                <div className="text-sm text-white/40">
                    Showing <span className="text-white font-medium">1-6</span> of <span className="text-white font-medium">1,200</span> students
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/60 disabled:opacity-30" disabled>Previous</button>
                    <button className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-xs font-bold text-white">1</button>
                    <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/60">2</button>
                    <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/60">3</button>
                    <span className="text-white/20 px-1">...</span>
                    <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/60">Next</button>
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;
