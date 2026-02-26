
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Target,
    Brain,
    Zap,
    ShieldCheck,
    BarChart3,
    ChevronRight,
    Sparkles,
    Search,
    Layout,
    MousePointer2
} from 'lucide-react';

const AssessmentIntro: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-32 pb-24 px-6 bg-[#FAFAFA] min-h-screen relative overflow-hidden font-sans">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1D74F2]/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-[#7C3AED]/10 text-[#7C3AED] px-6 py-2 rounded-full mb-8 border border-[#7C3AED]/10"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Proprietary Clinical Engine</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl sm:text-8xl font-black text-[#111827] mb-8 leading-[0.9] tracking-tighter uppercase italic"
                    >
                        Measure What <br /><span className="text-[#7C3AED]">Actually Matters.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-[#6B7280] font-medium leading-relaxed max-w-2xl mx-auto"
                    >
                        Standard MCQs are for memorization. Our adaptive audit isolates your architectural intuition and clinical engineering authority.
                    </motion.p>
                </header>

                <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    {/* Methodology Section */}
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">The <span className="text-[#7C3AED]">Clinical</span> Edge.</h2>
                            <div className="h-1 w-20 bg-[#7C3AED] rounded-full" />
                        </div>

                        <div className="grid gap-8">
                            {[
                                {
                                    icon: Brain,
                                    title: "Not Standard MCQs",
                                    desc: "No rote memorization. We use scenario-based branching that adapts difficulty based on your previous answers."
                                },
                                {
                                    icon: Target,
                                    title: "Clinical Scoring",
                                    desc: "Measures high-entropy logic, speed-to-solution, and pressure resilience—metrics that top-tier architects actually use."
                                },
                                {
                                    icon: Zap,
                                    title: "Real-World Logic",
                                    desc: "Debug production outages, design distributed systems, and justify infrastructure trade-offs in real-time."
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className="flex items-start gap-6 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-xl group-hover:border-[#7C3AED]/20 transition-all">
                                        <item.icon className="w-6 h-6 text-[#7C3AED]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">{item.title}</h3>
                                        <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/learn/assessment')}
                            className="w-full sm:w-auto px-12 py-6 bg-[#111827] text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-[#7C3AED] transition-all flex items-center justify-center gap-4"
                        >
                            Start Assessment <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>

                    {/* Sample Report Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="relative"
                    >
                        <div className="bg-[#111827] rounded-[3rem] p-10 sm:p-14 text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden border border-white/5">
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <p className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.5em] mb-2">Sample Audit Report</p>
                                    <h4 className="text-2xl font-black uppercase tracking-tighter">Candidate Verdict</h4>
                                </div>
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-green-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-12">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Role Readiness</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl font-black text-white">94%</span>
                                        <BarChart3 className="w-5 h-5 text-[#7C3AED]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Logic Velocity</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl font-black text-white">Top 2%</span>
                                        <Zap className="w-5 h-5 text-yellow-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Core Strengths Identified</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['distributed-systems', 'latency-design', 'clinical-logic'].map(tag => (
                                            <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[8px] font-bold text-gray-300 uppercase tracking-widest">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs font-bold text-white/50 bg-[#7C3AED]/10 p-4 rounded-xl border border-[#7C3AED]/20 italic">
                                    "Exhibits elite high-entropy decision making under simulation pressure."
                                </div>
                            </div>

                            {/* Decorative mesh */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED]/20 rounded-full blur-[80px] -z-0 opacity-50" />
                        </div>

                        {/* Floating UI elements for added premium feel */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hidden sm:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verified</p>
                                    <p className="text-xs font-black text-gray-900 uppercase">Skill Badge</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Closing stats / proof */}
                <div className="grid md:grid-cols-4 gap-8 text-center pt-12 border-t border-gray-100">
                    {[
                        { label: "Assessed Learners", val: "140K+" },
                        { label: "Partner Companies", val: "500+" },
                        { label: "Logic Nodes", val: "12,000+" },
                        { label: "Clinical Success", val: "98.2%" }
                    ].map((stat, i) => (
                        <div key={i}>
                            <p className="text-2xl font-black text-[#111827]">{stat.val}</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AssessmentIntro;
