
import React, { useState, useEffect } from 'react';
import {
    Plus,
    Zap,
    ShieldAlert,
    BarChart3,
    Edit,
    ExternalLink,
    Timer,
    BrainCircuit,
    Settings2,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import { motion } from 'framer-motion';

import { API_BASE_URL } from '../../../apiConfig';
import { useAuth } from '../../../AuthContext';

const AssessmentManagement: React.FC = () => {
    const { user } = useAuth();
    const [assessments, setAssessments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [aiScoring, setAiScoring] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!user?.email) return;
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/quizzes`, {
                    headers: { 'X-Admin-Email': user.email }
                });
                const data = await response.json();
                const formatted = data.map((q: any) => ({
                    id: q._id,
                    name: q.title || 'Dynamic Assessment',
                    difficulty: q.difficulty || 'Medium',
                    passRate: 72, // Placeholder for calculation
                    avgTime: '45m',
                    questions: q.questions?.length || 0,
                    status: 'Active',
                    cheatingFlags: 0
                }));
                setAssessments(formatted);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [user]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Assessment Control</h1>
                    <p className="text-white/50 mt-1">Configure logic, AI evaluation, and cheating detection systems.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors">
                        <Settings2 size={18} />
                        Global Rules
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-500/20">
                        <Plus size={18} />
                        New Assessment
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Avg Pass Rate', value: '65%', icon: Zap, color: 'text-yellow-500' },
                    { label: 'Avg Completion Time', value: '42m', icon: Timer, color: 'text-blue-500' },
                    { label: 'Cheating Incidence', value: '1.2%', icon: ShieldAlert, color: 'text-red-500' },
                    { label: 'AI Evaluation Success', value: '98%', icon: BrainCircuit, color: 'text-purple-500' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                        <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <div className="text-sm text-white/40">{stat.label}</div>
                            <div className="text-xl font-bold text-white">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Assessments List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Active Assessments</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/40">Master AI Eval</span>
                            <button onClick={() => setAiScoring(!aiScoring)} className="text-[#7C3AED] transition-all">
                                {aiScoring ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-white/20" />}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] text-xs font-semibold text-white/30 uppercase tracking-widest border-b border-white/10">
                                <th className="px-6 py-4">Assessment Name</th>
                                <th className="px-6 py-4 text-center">Difficulty</th>
                                <th className="px-6 py-4 text-center">Questions</th>
                                <th className="px-6 py-4 text-center">Pass Rate</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {assessments.map(test => (
                                <tr key={test.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-semibold text-white">{test.name}</div>
                                            {test.cheatingFlags > 0 && (
                                                <div className="flex items-center gap-1 text-[10px] text-red-400 mt-1 font-bold">
                                                    <ShieldAlert size={10} /> {test.cheatingFlags} Flags Detected
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${test.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                                            test.difficulty === 'Medium' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {test.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-white/60 font-mono">{test.questions}</td>
                                    <td className="px-6 py-4 text-center font-bold text-white">{test.passRate}%</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${test.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-white/20'}`} />
                                            <span className="text-xs text-white/70">{test.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all shadow-sm" title="Edit Logic">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all shadow-sm" title="View Heatmap">
                                                <BarChart3 size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all shadow-sm" title="Preview Mode">
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Reasoning Preview Section - premium touch */}
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <BrainCircuit size={120} className="text-[#7C3AED]" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        Machine Evaluations
                        <span className="px-2 py-1 bg-[#7C3AED]/20 text-[#7C3AED] rounded text-xs font-mono uppercase tracking-widest border border-[#7C3AED]/30">v4.2-Neural</span>
                    </h3>
                    <p className="text-white/50 leading-relaxed mb-6">
                        The current scoring engine uses multi-modal analysis to verify student logic. It looks for coding patterns, time-per-node complexity, and behavioral consistency to assign "Trust Scores".
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Cheating Prediction Accuracy</div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} transition={{ duration: 2 }} className="h-full bg-green-500" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Logic Heatmap Resolution</div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 2 }} className="h-full bg-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssessmentManagement;
