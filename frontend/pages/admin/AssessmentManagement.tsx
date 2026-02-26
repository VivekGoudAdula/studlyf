
import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Settings2,
    BarChart3,
    AlertTriangle,
    Plus,
    Search,
    MoreHorizontal,
    Brain,
    Zap,
    Clock,
    ChevronRight,
    Eye,
    Activity
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AssessmentManagement: React.FC = () => {
    const assessments = [
        {
            id: 'AS-102',
            name: 'React Advanced Engineering',
            category: 'Frontend',
            passRate: 64,
            avgTime: '42m',
            fraudAlerts: 4,
            difficulty: 'Hard',
            status: 'Live',
            aiScoring: true
        },
        {
            id: 'AS-204',
            name: 'System Design Fundamentals',
            category: 'Architecture',
            passRate: 42,
            avgTime: '55m',
            fraudAlerts: 1,
            difficulty: 'Expert',
            status: 'Draft',
            aiScoring: true
        },
        {
            id: 'AS-301',
            name: 'Data Structures Sprint',
            category: 'Core CS',
            passRate: 88,
            avgTime: '28m',
            fraudAlerts: 12,
            difficulty: 'Medium',
            status: 'Live',
            aiScoring: false
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Assessment Control</h1>
                        <p className="text-gray-500 text-sm">Design adaptive tests and monitor system-wide scoring integrity.</p>
                    </div>
                    <button className="px-6 py-3 bg-purple-600 rounded-2xl text-sm font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all flex items-center gap-2">
                        <Plus size={18} /> New Assessment
                    </button>
                </div>

                {/* Top Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#120D1A] to-[#0F0F12] border border-purple-500/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><Brain size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Scoring Status</span>
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-1">94.2% Accuracy</h4>
                        <p className="text-xs text-gray-500">Auto-grading 8,240 submissions this month.</p>
                    </div>
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400"><AlertTriangle size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Integrity Alerts</span>
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-1">18 Flagged</h4>
                        <p className="text-xs text-gray-500">Suspicious browser activity detected today.</p>
                    </div>
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><Activity size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Pass Rate</span>
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-1">58.4% Average</h4>
                        <p className="text-xs text-gray-500">+4% improvement vs previous quarter.</p>
                    </div>
                </div>

                {/* Search and List */}
                <div className="space-y-4">
                    <div className="relative group max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find assessment..."
                            className="w-full bg-[#0F0F12] border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 outline-none focus:border-purple-500/30 transition-all text-sm"
                        />
                    </div>

                    <div className="bg-[#0F0F12] border border-white/5 rounded-[32px] overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assessment Name</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Difficulty</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pass Rate</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg Time</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {assessments.map((test) => (
                                    <motion.tr
                                        key={test.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/5 transition-colors cursor-pointer"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-purple-600/5 border border-purple-500/10 flex items-center justify-center text-purple-400">
                                                    <Zap size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{test.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-0.5">{test.id} · {test.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${test.difficulty === 'Expert' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                    test.difficulty === 'Hard' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                }`}>
                                                {test.difficulty}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-white">{test.passRate}%</span>
                                                <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-500" style={{ width: `${test.passRate}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Clock size={14} />
                                                <span className="text-xs font-medium">{test.avgTime}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${test.status === 'Live' ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${test.status === 'Live' ? 'text-emerald-400' : 'text-gray-500'}`}>{test.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {test.aiScoring && (
                                                    <div className="px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20" title="AI Scoring Enabled">
                                                        <Brain size={14} className="text-purple-400" />
                                                    </div>
                                                )}
                                                {test.fraudAlerts > 5 && (
                                                    <div className="px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20" title="High Fraud Alert">
                                                        <AlertTriangle size={14} className="text-rose-400" />
                                                    </div>
                                                )}
                                                <button className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                                    <Settings2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Heatmap/Logic Preview Section */}
                <div className="bg-[#0F0F12] border border-white/5 rounded-[32px] p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Logical Complexity Heatmap</h3>
                    <div className="h-[250px] w-full rounded-2xl bg-[#050505] border border-white/5 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
                        <div className="grid grid-cols-12 grid-rows-6 gap-2 w-full h-full p-4">
                            {Array.from({ length: 72 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: Math.random() * 0.8 + 0.1 }}
                                    className={`rounded-sm ${Math.random() > 0.8 ? 'bg-purple-600' :
                                            Math.random() > 0.6 ? 'bg-purple-800/40' : 'bg-white/5'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-[#0F0F12]/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
                                <p className="text-white text-xs font-bold uppercase tracking-widest">Question #14 Analysis: High Cognitive Load</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-purple-600" />
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Complex Log</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-purple-800/40" />
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Medium Risk</span>
                            </div>
                        </div>
                        <button className="text-[10px] font-bold text-purple-400 hover:underline uppercase tracking-widest">Full Topic Cluster Report</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AssessmentManagement;
