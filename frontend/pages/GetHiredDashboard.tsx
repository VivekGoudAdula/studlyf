
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Bell,
    Eye,
    ArrowRight,
    Zap,
    Target,
    ShieldCheck,
    Building2,
    Calendar,
    ChevronRight,
    Briefcase,
    Settings,
    LayoutDashboard
} from 'lucide-react';

const GetHiredDashboard: React.FC = () => {
    const navigate = useNavigate();

    const matches = [
        { id: 1, company: 'Google', role: 'SRE - Distributed Systems', score: 98, status: 'Top Match', location: 'Mountain View, CA', salary: '₹45L - ₹65L' },
        { id: 2, company: 'Atlassian', role: 'Fullstack Engineer', score: 94, status: 'Verified Access', location: 'Bengaluru, KA', salary: '₹32L - ₹48L' },
        { id: 3, company: 'Slack', role: 'Senior Product Engineer', score: 89, status: 'Tier 1 Match', location: 'Remote', salary: '₹28L - ₹42L' }
    ];

    const stats = [
        { label: 'Recruiter Views', value: '14', icon: <Eye size={16} /> },
        { label: 'Interview Invites', value: '3', icon: <Bell size={16} /> },
        { label: 'Verified Integrity', value: '94%', icon: <ShieldCheck size={16} /> }
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-24 px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-20 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-3 bg-[#7C3AED]/10 text-[#7C3AED] px-5 py-2 rounded-full mb-8 border border-[#7C3AED]/20">
                            <Zap className="w-4 h-4 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Live Matching Protocol v2.4</span>
                        </div>
                        <h1 className="text-7xl sm:text-8xl font-black text-gray-901 mb-8 leading-[0.85] tracking-tighter uppercase italic">
                            Partner Matching <br /><span className="text-[#7C3AED]">Dashboard.</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">Your verified dossier is now indexed by tier-1 institutions. Review and authorize matches below.</p>
                    </div>

                    <div className="flex bg-white p-2.5 rounded-3xl border border-gray-100 shadow-xl gap-3">
                        <button className="px-8 py-4 bg-[#7C3AED] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-[#7C3AED]/30">Active Matches</button>
                        <button className="px-8 py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Archived Access</button>
                    </div>
                </header>

                <div className="grid lg:grid-cols-4 gap-12">
                    {/* ── STATS CARDS ── */}
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="bg-[#111827] text-white p-10 rounded-[3rem] shadow-3xl relative overflow-hidden group border border-white/5">
                            <div className="w-16 h-16 bg-[#7C3AED] text-white rounded-2xl flex items-center justify-center mb-12 shadow-2xl relative z-10">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 relative z-10">Integrity Score</h3>
                            <p className="text-sm text-white/40 font-medium leading-relaxed mb-8 relative z-10">Institutional compliance reached clinical threshold.</p>
                            <div className="text-6xl font-black text-white italic tracking-tighter relative z-10">100%</div>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#7C3AED]/20 rounded-full blur-[80px] -z-0" />
                        </div>

                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl flex flex-col justify-between hover:border-[#7C3AED]/30 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-gray-200/50">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="w-14 h-14 bg-gray-50 text-gray-400 group-hover:bg-[#7C3AED] group-hover:text-white rounded-[1.5rem] flex items-center justify-center transition-all shadow-inner">
                                        {stat.icon}
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-[#7C3AED]/20 group-hover:bg-[#7C3AED] animate-pulse" />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">{stat.label}</h4>
                                    <div className="text-4xl font-black text-gray-901 italic tracking-tighter group-hover:text-[#7C3AED] transition-colors">{stat.value}</div>
                                </div>
                            </div>
                        ))}

                        <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 text-center">
                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Status Protocol</span>
                            <span className="text-xs font-black text-emerald-700 uppercase italic">Visible to 84 Partners</span>
                        </div>
                    </aside>

                    {/* ── MATCHES LIST ── */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                            <h2 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em]">Verified Matching Companies</h2>
                            <span className="text-[10px] font-bold text-gray-300">Updated: Dec 2026</span>
                        </div>
                        {matches.map((job, i) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border border-gray-100 rounded-[3.5rem] p-10 sm:p-14 flex flex-col xl:flex-row items-center justify-between gap-12 hover:border-[#7C3AED]/40 transition-all group shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]"
                            >
                                <div className="flex items-center gap-12 w-full xl:w-auto">
                                    <div className="w-24 h-24 bg-[#111827] rounded-[2.5rem] flex items-center justify-center font-black text-[#7C3AED] text-4xl shrink-0 shadow-2xl shadow-gray-200 group-hover:scale-105 transition-transform duration-500 uppercase overflow-hidden relative">
                                        {job.company[0]}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-[11px] font-black text-[#7C3AED] uppercase tracking-[0.4em]">{job.company}</span>
                                            <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[9px] uppercase tracking-widest px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                                                <Target size={10} /> Tier-1 Partner
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-901 uppercase tracking-tight mb-4 group-hover:text-[#7C3AED] transition-colors">{job.role}</h3>
                                        <div className="flex flex-wrap gap-5 items-center">
                                            <div className="flex items-center gap-2.5 text-[10px] font-bold text-gray-400 border border-gray-100 bg-gray-50 px-4 py-2 rounded-2xl uppercase tracking-widest">
                                                <Calendar size={14} /> Full-time
                                            </div>
                                            <div className="flex items-center gap-2.5 text-[10px] font-bold text-gray-400 border border-gray-100 bg-gray-50 px-4 py-2 rounded-2xl uppercase tracking-widest">
                                                <Building2 size={14} /> {job.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-14 w-full xl:w-auto justify-between xl:justify-end">
                                    <div className="text-center sm:text-right">
                                        <span className="block text-3xl font-black text-gray-901 tracking-tighter italic lg:text-4xl">{job.salary}</span>
                                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Verified Package</span>
                                    </div>

                                    <div className="text-center bg-[#F5F3FF] border border-[#7C3AED]/15 p-8 rounded-[2.5rem] min-w-[160px] shadow-sm group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-700">
                                        <span className="block text-4xl font-black tracking-tighter italic mb-1">{job.score}%</span>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${job.score >= 95 ? 'text-[#7C3AED] group-hover:text-white' : 'text-gray-400 group-hover:text-white/70'}`}>Dossier Acc.</span>
                                    </div>

                                    <button
                                        onClick={() => navigate('/jobs/detail')}
                                        className="w-full sm:w-auto px-12 py-7 bg-[#7C3AED] text-white rounded-full text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-[#7C3AED]/40 hover:scale-[1.05] transition-all flex items-center justify-center gap-4 group"
                                    >
                                        VIEW DOSSIER <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        <div className="pt-12 text-center">
                            <button className="px-16 py-8 border-2 border-dashed border-gray-100 text-gray-400 font-black text-[11px] uppercase tracking-[0.5em] rounded-[2rem] hover:text-gray-901 hover:border-gray-200 transition-all flex items-center gap-4 mx-auto group">
                                Refresh Access Protocols <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed inset-0 bg-grid-black/[0.01] pointer-events-none -z-10" />
        </div>
    );
};

export default GetHiredDashboard;
