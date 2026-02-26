import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Building2,
    MapPin,
    Briefcase,
    DollarSign,
    CheckCircle2,
    Globe,
    Users,
    Zap,
    ShieldCheck,
    Target,
    Send
} from 'lucide-react';

const JobDetail: React.FC = () => {
    const navigate = useNavigate();

    const jobInfo = {
        company: 'Google',
        role: 'SRE - Distributed Systems',
        location: 'Mountain View, CA (Remote Friendly)',
        salary: '₹45L - ₹65L',
        type: 'Full-time',
        matchScore: 98,
        description: `
            We are looking for a Site Reliability Engineer (SRE) to join our Distributed Systems team. 
            You will be responsible for the reliability, scalability, and performance of our core infrastructure.
            
            Key Responsibilities:
            - Design and implement automated scaling solutions for multi-region clusters.
            - Optimize latency for globally distributed data stores.
            - Participate in on-call rotations and drive incident post-mortems.
            - Collaborate with product teams to define SLIs and SLOs.
        `,
        requirements: [
            'Expertise in Go, Rust, or C++ for systems programming.',
            'Deep understanding of Kubernetes and Container Orchestration.',
            'Experience with distributed consensus protocols (Paxos, Raft).',
            'Strong background in Linux networking and kernel tuning.'
        ],
        companyDetails: 'Google is a global leader in technology, focusing on search, advertising, cloud computing, and hardware. Our SRE culture is world-renowned for defining the standard of modern infrastructure engineering.'
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 px-6 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* ── HEADER ── */}
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <button
                        onClick={() => navigate('/jobs/matches')}
                        className="text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 group w-fit"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Return to Matches</span>
                    </button>

                    <div className="flex items-center gap-2 bg-[#7C3AED]/10 text-[#7C3AED] px-4 py-1.5 rounded-full border border-[#7C3AED]/10">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Verified Dossier Active</span>
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* ── LEFT COLUMN: MAIN CONTENT ── */}
                    <div className="lg:col-span-2 space-y-10">
                        <section className="bg-white rounded-[3rem] p-10 md:p-14 border border-gray-100 shadow-xl shadow-gray-200/50">
                            <div className="flex items-center gap-8 mb-10">
                                <div className="w-24 h-24 bg-[#111827] rounded-[2.5rem] flex items-center justify-center font-black text-[#7C3AED] text-4xl shadow-2xl uppercase">
                                    {jobInfo.company[0]}
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black text-gray-901 uppercase tracking-tight italic mb-2">
                                        {jobInfo.role}
                                    </h1>
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#7C3AED] uppercase tracking-widest bg-[#7C3AED]/5 px-3 py-1 rounded-full border border-[#7C3AED]/10">
                                            <Target size={12} /> Institutional Partner
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <MapPin size={12} /> {jobInfo.location}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em] mb-4 border-b border-gray-50 pb-2">Institutional Intentions</h3>
                                    <div className="text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                                        {jobInfo.description}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em] mb-4 border-b border-gray-50 pb-2">Verification Thresholds</h3>
                                    <ul className="space-y-4">
                                        {jobInfo.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-4 h-4 text-[#7C3AED] mt-1 shrink-0" />
                                                <span className="text-sm font-bold text-gray-700 italic uppercase tracking-tight">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-[3rem] p-10 md:p-14 border border-gray-100 shadow-xl shadow-gray-200/50">
                            <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em] mb-6 border-b border-gray-50 pb-2">About {jobInfo.company}</h3>
                            <p className="text-gray-600 font-medium leading-relaxed mb-8">
                                {jobInfo.companyDetails}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global HQ</span>
                                    <span className="block text-xs font-bold text-gray-901">Mountain View, CA</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Scale</span>
                                    <span className="block text-xs font-bold text-gray-901">150k+ Engineers</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verification Status</span>
                                    <span className="block text-xs font-bold text-emerald-500 italic">Clinical Partnered</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* ── RIGHT COLUMN: SIDEBAR PARAMS & CTA ── */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#111827] text-white p-10 rounded-[3rem] shadow-3xl relative overflow-hidden">
                            <h3 className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.5em] mb-10 italic">Intelligence Report</h3>

                            <div className="space-y-8 relative z-10">
                                <div>
                                    <div className="text-[3rem] font-black italic tracking-tighter text-[#7C3AED] leading-none mb-1">{jobInfo.matchScore}%</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Dossier Accuracy Score</div>
                                </div>

                                <div className="space-y-6 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Verification Status</span>
                                        <span className="text-[10px] font-black text-emerald-400 uppercase italic">Passed Audit</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Compensation Bracket</span>
                                        <span className="text-[10px] font-black text-white uppercase italic">{jobInfo.salary}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Role Type</span>
                                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">{jobInfo.type}</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full py-6 bg-[#7C3AED] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-[#7C3AED]/40 hover:scale-[1.05] transition-all flex items-center justify-center gap-3 group"
                                >
                                    Apply to Company <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>

                                <p className="text-[9px] text-center text-white/30 font-medium italic mt-4 uppercase tracking-[0.2em]">Application bypass active via Studlyf Protocol</p>
                            </div>

                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED]/20 rounded-full blur-[100px] -z-0" />
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl text-center">
                            <Zap className="w-8 h-8 text-[#7C3AED] mx-auto mb-4" />
                            <h4 className="text-sm font-black text-gray-901 uppercase tracking-tight mb-2">Priority Intake</h4>
                            <p className="text-[10px] text-gray-400 font-medium italic mb-6">Your verified assessment results put you in the top 2% of candidates.</p>
                            <div className="text-[10px] font-black text-[#7C3AED] uppercase tracking-widest bg-[#7C3AED]/5 py-2 rounded-xl">Fast-Track Active</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed inset-0 bg-grid-black/[0.01] pointer-events-none -z-10" />
        </div>
    );
};

export default JobDetail;
