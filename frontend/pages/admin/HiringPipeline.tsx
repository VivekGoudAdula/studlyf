
import React from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Building2,
    Target,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    UserCheck,
    Zap,
    Filter,
    Search,
    ChevronRight,
    MoreHorizontal,
    Mail,
    FileText
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const HiringPipeline: React.FC = () => {
    const candidates = [
        {
            id: 'C-001',
            name: 'Vikram Singh',
            match: 94,
            tier: 'Platinum',
            phase: 'Interviewing',
            company: 'Google',
            score: 91,
            daysActive: 8
        },
        {
            id: 'C-002',
            name: 'Priya Sharma',
            match: 88,
            tier: 'Gold',
            phase: 'Offer Letter',
            company: 'Zomato',
            score: 84,
            daysActive: 14
        },
        {
            id: 'C-003',
            name: 'Arjun Reddy',
            match: 92,
            tier: 'Platinum',
            phase: 'Technical Review',
            company: 'Razorpay',
            score: 89,
            daysActive: 3
        },
        {
            id: 'C-004',
            name: 'Ananya Iyer',
            match: 76,
            tier: 'Gold',
            phase: 'Applied',
            company: 'Swiggy',
            score: 72,
            daysActive: 1
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Hiring Control Center</h1>
                        <p className="text-gray-500 text-sm">Managing transitions from student to professional engineering roles.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all uppercase tracking-widest">
                            Partner Portal
                        </button>
                        <button className="px-6 py-3 bg-purple-600 rounded-2xl text-sm font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all flex items-center gap-2">
                            <Building2 size={18} /> Add Hiring Partner
                        </button>
                    </div>
                </div>

                {/* Pipeline Stages (Kanban-ish Header) */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Ready for Hiring', count: 42, color: 'blue' },
                        { label: 'Shortlisted', count: 18, color: 'indigo' },
                        { label: 'Technical Rounds', count: 12, color: 'purple' },
                        { label: 'HR / Final', count: 5, color: 'amber' },
                        { label: 'Offers Issued', count: 3, color: 'emerald' },
                    ].map((stage, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-[#0F0F12] border border-white/5 relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-1 h-full bg-${stage.color}-500 opacity-20`} />
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stage.label}</p>
                            <h4 className="text-xl font-bold text-white mt-1">{stage.count} <span className="text-[10px] text-gray-600 font-medium">CANDIDATES</span></h4>
                        </div>
                    ))}
                </div>

                {/* Pipeline List */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative group flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search candidates or companies..."
                                className="w-full bg-[#0F0F12] border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 outline-none focus:border-purple-500/30 transition-all text-sm"
                            />
                        </div>
                        <button className="px-4 py-2.5 rounded-xl bg-[#0F0F12] border border-white/5 text-gray-400 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                            <Filter size={16} /> Filters
                        </button>
                    </div>

                    <div className="bg-[#0F0F12] border border-white/5 rounded-[32px] overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Candidate</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company & Phase</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Match Score</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tier</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pipeline Health</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {candidates.map((c) => (
                                    <motion.tr
                                        key={c.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/5 transition-colors cursor-pointer"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-800/20 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 uppercase">
                                                    {c.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{c.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-0.5">{c.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Building2 size={14} className="text-gray-500" />
                                                <p className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">{c.company}</p>
                                            </div>
                                            <p className="text-[10px] text-purple-500/80 uppercase font-bold tracking-widest">{c.phase}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white">{c.match}%</span>
                                                    <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                                        <div className="h-full bg-emerald-500" style={{ width: `${c.match}%` }} />
                                                    </div>
                                                </div>
                                                <div className="p-1 px-1.5 rounded bg-emerald-500/10 text-[8px] font-bold text-emerald-400 uppercase tracking-tighter">AI Match</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${c.tier === 'Platinum' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                }`}>
                                                {c.tier}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-gray-500" />
                                                <span className="text-xs font-medium text-gray-400">{c.daysActive}d in pipeline</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all" title="View CV">
                                                    <FileText size={16} />
                                                </button>
                                                <button className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all" title="Email Candidate">
                                                    <Mail size={16} />
                                                </button>
                                                <button className="p-2 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 hover:bg-purple-600 hover:text-white transition-all ml-2">
                                                    <Zap size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Hiring Intelligence / Funnel Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-8">Placement Conversion Funnel</h3>
                        <div className="flex flex-col gap-2">
                            {[
                                { stage: 'Qualified Students', value: 420, percentage: 100, color: 'white/10' },
                                { stage: 'Ready for Hiring', value: 124, percentage: 30, color: 'purple-900/40' },
                                { stage: 'Interview Invites', value: 84, percentage: 20, color: 'purple-700/60' },
                                { stage: 'Offers Accepted', value: 12, percentage: 3, color: 'purple-500' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-6">
                                    <div className="w-32 text-right">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.stage}</p>
                                    </div>
                                    <div className="flex-1">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                            className={`h-12 rounded-xl flex items-center justify-end px-4 border border-white/5 bg-${item.color}`}
                                        >
                                            <span className="text-sm font-bold text-white">{item.value}</span>
                                        </motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#120D1A] to-[#0F0F12] border border-purple-500/10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400"><Target size={20} /></div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Market Intelligence</h3>
                                <p className="text-[10px] font-bold text-purple-500/60 uppercase tracking-widest">Active Demand Shifts</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Top Tech Requested</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {['Go', 'Rust', 'Kubernetes', 'AWS', 'Next.js'].map(tag => (
                                        <span key={tag} className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-medium text-gray-400 border border-white/5">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Partner Activity</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs font-bold text-white">4 New Partners</span>
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">+12% WoW</span>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-purple-600 rounded-2xl text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-purple-600/20 hover:scale-[1.02] transition-all">
                                Generate Pipeline Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default HiringPipeline;
