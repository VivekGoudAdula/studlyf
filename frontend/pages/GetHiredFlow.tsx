
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Github,
    FileText,
    Brain,
    Layers,
    CheckCircle2,
    ChevronRight,
    ArrowLeft,
    Lock,
    ShieldCheck,
    Zap,
    Star,
    Trophy,
    ArrowRight,
    Plus
} from 'lucide-react';

const GetHiredFlow: React.FC = () => {
    const navigate = useNavigate();
    const [subStep, setSubStep] = useState(1); // 1: Profile, 2: Tiers

    const progress = subStep === 1 ? 80 : 100;

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 px-6">
            <div className="max-w-4xl mx-auto">

                {/* ── HEADER ── */}
                <header className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => subStep > 1 ? setSubStep(subStep - 1) : navigate('/jobs/get-hired')}
                            className="text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Withdraw Protocol</span>
                        </button>
                        <div className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.4em] bg-[#7C3AED]/5 px-4 py-1.5 rounded-full border border-[#7C3AED]/10 italic">
                            {subStep === 1 ? 'Phase 01: Profile Optimization' : 'Phase 02: Verification Tier Selection'}
                        </div>
                    </div>

                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-[#7C3AED]"
                        />
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Protocol Integrity: {progress}%</span>
                        <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-widest italic flex items-center gap-1"><Zap size={10} /> Clinical Ready</span>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {subStep === 1 && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="mb-16">
                                <h1 className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tighter uppercase italic mb-6">Profile <br /><span className="text-[#7C3AED]">Optimization.</span></h1>
                                <p className="text-lg text-gray-500 font-medium">Connect your architectural evidence points to complete the verification dossier.</p>
                            </div>

                            <div className="grid gap-4 mb-20">
                                {[
                                    { id: 'github', label: 'Connect GitHub', icon: <Github />, status: 'COMPLETE', why: 'Source verification of logic density.' },
                                    { id: 'resume', label: 'Upload Professional PDF', icon: <FileText />, status: 'COMPLETE', why: 'Institutional history audit.' },
                                    { id: 'assessment', label: 'Clinical Assessment', icon: <Brain />, status: 'COMPLETE', why: 'Real-time capability index.' },
                                    { id: 'portfolio', label: 'Project Portfolio', icon: <Layers />, status: 'PENDING', why: 'Product ownership evidence.' }
                                ].map((item, i) => (
                                    <div key={item.id} className={`p-8 rounded-[2.5rem] border transition-all flex items-center justify-between group ${item.status === 'COMPLETE' ? 'bg-white border-gray-100' : 'bg-[#FAFAFA] border-dashed border-gray-200 opacity-60'}`}>
                                        <div className="flex items-center gap-8 text-gray-900">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${item.status === 'COMPLETE' ? 'bg-[#7C3AED] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-tight mb-1">{item.label}</h3>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic">{item.why}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {item.status === 'COMPLETE' ? (
                                                <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                                                    <CheckCircle2 size={12} /> Verified
                                                </div>
                                            ) : (
                                                <button className="flex items-center gap-2 text-[#7C3AED] font-black text-[10px] uppercase tracking-widest px-6 py-2 bg-[#7C3AED]/10 rounded-full border border-[#7C3AED]/10 hover:bg-[#7C3AED] hover:text-white transition-all">
                                                    Integrate <Plus size={12} className="hidden" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white border border-gray-100 p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200/50 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-[#7C3AED]/10 text-[#7C3AED] rounded-3xl flex items-center justify-center mb-10 border border-[#7C3AED]/10 relative">
                                    <Zap className="w-8 h-8" />
                                    <div className="absolute -top-4 -right-4 bg-[#7C3AED] text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg">80% POWER</div>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">Integrity Check Complete</h3>
                                <p className="text-sm text-gray-500 max-w-lg mb-12">Your profile integrity has reached the clinical threshold. You are now eligible to select a visibility tier to enter the partner matches pool.</p>
                                <button
                                    onClick={() => setSubStep(2)}
                                    className="px-16 py-6 bg-[#111827] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-[#7C3AED] transition-all flex items-center gap-4 group"
                                >
                                    View Tiers < ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {subStep === 2 && (
                        <motion.div
                            key="tiers"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="mb-16">
                                <h1 className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tighter uppercase italic mb-6">Visibility <br /><span className="text-[#7C3AED]">Tiers.</span></h1>
                                <p className="text-lg text-gray-500 font-medium">Unlock deeper integration with partner hiring engines by escalating your tier level.</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 mb-20">
                                {[
                                    { id: 1, label: 'Tier 1', title: 'Verified', desc: 'Standard visibility to all hiring partners.', icon: <CheckCircle2 />, access: 'Unlimited', active: true },
                                    { id: 2, label: 'Tier 2', title: 'Clinical Certified', desc: 'Prioritized in high-stakes engineering matches.', icon: <Star />, access: 'Tier-A Companies', active: false },
                                    { id: 3, label: 'Tier 3', title: 'Authority Level', desc: 'Direct white-glove placement in leadership pipelines.', icon: <Trophy />, access: 'FAANG / MNC Direct', active: false }
                                ].map((tier, i) => (
                                    <div key={tier.id} className={`bg-white rounded-[3rem] border transition-all relative overflow-hidden flex flex-col h-full group ${tier.active ? 'border-[#7C3AED]/30 shadow-2xl shadow-[#7C3AED]/5' : 'border-gray-100 opacity-60 hover:opacity-100 grayscale hover:grayscale-0'}`}>
                                        <div className="p-10 text-center flex-grow">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 block">{tier.label}</span>
                                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 transition-all ${tier.active ? 'bg-[#7C3AED] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-[#7C3AED] group-hover:text-white'}`}>
                                                {tier.icon}
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-3">{tier.title}</h3>
                                            <p className="text-[11px] font-medium text-gray-400 leading-relaxed mb-8">{tier.desc}</p>

                                            <div className="py-4 border-y border-gray-50 flex flex-col gap-2 mb-8">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Access Protocol</span>
                                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{tier.access}</span>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0">
                                            {tier.active ? (
                                                <div className="w-full py-4 text-[#7C3AED] font-black text-[9px] uppercase tracking-widest text-center italic border border-[#7C3AED]/20 rounded-2xl bg-[#7C3AED]/5">
                                                    Currently Active
                                                </div>
                                            ) : (
                                                <button className="w-full py-4 bg-gray-900 text-white font-black text-[9px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 group-hover:bg-[#7C3AED] transition-all">
                                                    <Lock size={12} /> Unlock Tier
                                                </button>
                                            )}
                                        </div>
                                        {!tier.active && (
                                            <div className="absolute top-4 right-6 text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">Locked</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-12 border-t border-gray-200">
                                <div className="text-left">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">Next Milestone</h4>
                                    <p className="text-sm font-bold text-gray-900 italic">"Complete Project Portfolio to unlock Tier 2 Certified status."</p>
                                </div>
                                <button
                                    onClick={() => navigate('/jobs/matches')}
                                    className="px-16 py-6 bg-[#7C3AED] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-xl shadow-[#7C3AED]/20 hover:scale-[1.05] hover:shadow-2xl transition-all flex items-center gap-4 group"
                                >
                                    Proceed to Matches <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            <div className="fixed inset-0 bg-grid-black/[0.01] pointer-events-none -z-10" />
        </div>
    );
};

export default GetHiredFlow;
