
import React from 'react';
import { motion } from 'framer-motion';
import {
    MessageSquare,
    Search,
    Filter,
    Play,
    User,
    CheckCircle2,
    AlertTriangle,
    Target,
    Clock,
    Mic,
    FileText
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const MockInterviewManagement: React.FC = () => {
    const interviews = [
        { id: 'INT-4422', student: 'Rohan Sharma', mentor: 'Mentor AI', score: 84, time: '30m', flags: 0, status: 'Completed', timestamp: '14m ago' },
        { id: 'INT-4421', student: 'Ishaan Gupta', mentor: 'Siddharth V.', score: 42, time: '45m', flags: 2, status: 'Flagged', timestamp: '1h ago' },
        { id: 'INT-4420', student: 'Neha Kapoor', mentor: 'Mentor AI', score: 91, time: '28m', flags: 0, status: 'Completed', timestamp: '3h ago' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Mock Interview Monitoring</h1>
                        <p className="text-gray-500 text-sm">Review session transcripts, AI feedback logs, and behavioral risk flags.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><Target size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Avg. Interview Score</span>
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-1">72.4% Across All</h4>
                        <p className="text-xs text-gray-500">Based on 4,200 automated sessions.</p>
                    </div>
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400"><AlertTriangle size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Behavioral Risks</span>
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-1">12 Candidates</h4>
                        <p className="text-xs text-gray-500">High anxiety or lack of confidence detected.</p>
                    </div>
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><Mic size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Monitoring</span>
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-1">4 Active</h4>
                        <p className="text-xs text-gray-500">Sessions currently in progress.</p>
                    </div>
                </div>

                <div className="bg-[#0F0F12] border border-white/5 rounded-[32px] overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interview ID</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student & Mentor</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Review</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {interviews.map((int) => (
                                <motion.tr
                                    key={int.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="group hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-purple-400 transition-colors">
                                                <Play size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{int.id}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-medium tracking-widest mt-0.5">{int.timestamp}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User size={14} className="text-gray-500" />
                                            <p className="text-sm font-bold text-white">{int.student}</p>
                                        </div>
                                        <p className="text-[10px] text-purple-400 uppercase font-bold tracking-widest">vs {int.mentor}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${int.score > 70 ? 'text-emerald-400' : 'text-rose-400'}`}>{int.score}%</span>
                                            <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full bg-purple-500`} style={{ width: `${int.score}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Clock size={14} />
                                            <span className="text-xs font-medium">{int.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${int.status === 'Completed' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${int.status === 'Completed' ? 'text-emerald-400' : 'text-rose-400'}`}>{int.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all" title="Transcript">
                                                <FileText size={18} />
                                            </button>
                                            <button className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all" title="Feedback Log">
                                                <MessageSquare size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default MockInterviewManagement;
