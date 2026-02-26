
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, BarChart3, TrendingUp, Users, ArrowRight, Zap, Target, Star } from 'lucide-react';

const GetHiredLanding: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* ── HERO SECTION ── */}
            <section className="pt-40 pb-32 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-[#7C3AED]/10 text-[#7C3AED] px-6 py-2 rounded-full mb-10 border border-[#7C3AED]/10"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Elite Verification Conduit</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-7xl sm:text-9xl font-black text-gray-901 leading-[0.8] tracking-tighter uppercase italic mb-10"
                    >
                        Your Verified <br /> <span className="text-[#7C3AED]">Skills.</span> <br /> Direct Access.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-500 font-medium max-w-2xl mb-16 leading-relaxed"
                    >
                        Stop applying to job boards. Our clinical verification engine connects your atomic skills directly to institutional hiring managers.
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => navigate('/jobs/profile')}
                        className="px-12 py-8 bg-[#111827] text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-[#7C3AED] transition-all flex items-center gap-4 shadow-2xl shadow-gray-200 group"
                    >
                        Activate Hiring Profile <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </motion.button>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#7C3AED]/5 rounded-full blur-[140px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
            </section>

            {/* ── TRUST SIGNALS & PARTNERS ── */}
            <section className="py-24 bg-gray-50/50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-20">
                        <div className="text-center md:text-left">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Verification Pool</h4>
                            <div className="flex -space-x-3 mb-4 justify-center md:justify-start">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-gray-50 shadow-sm flex items-center justify-center font-black text-[10px] text-[#7C3AED]">P{i}</div>
                                ))}
                            </div>
                            <p className="text-xs font-medium text-gray-400 tracking-tight leading-relaxed">Join 12,000+ elite engineers already verified.</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Placement Rate</h4>
                            <div className="flex items-end gap-2 mb-4 justify-center md:justify-start font-black italic">
                                <span className="text-4xl text-gray-900 leading-none">94.2%</span>
                                <span className="text-emerald-500 text-xs mb-1 flex items-center gap-1"><TrendingUp size={12} /> +2.1%</span>
                            </div>
                            <p className="text-xs font-medium text-gray-400 tracking-tight leading-relaxed">Direct institutional intake through the protocol.</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Exp. Salary</h4>
                            <div className="flex items-end gap-2 mb-4 justify-center md:justify-start font-black italic">
                                <span className="text-4xl text-gray-900 leading-none">₹12.4</span>
                                <span className="text-gray-900 text-xs mb-1">LPA Avg.</span>
                            </div>
                            <p className="text-xs font-medium text-gray-400 tracking-tight leading-relaxed">Starting verified bracket for entry-level roles.</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Elite Partners</h4>
                            <div className="flex items-center gap-6 justify-center md:justify-start">
                                <div className="text-xl font-black text-gray-300 uppercase tracking-tighter opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">Google</div>
                                <div className="text-xl font-black text-gray-300 uppercase tracking-tighter opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">Atlassian</div>
                                <div className="text-xl font-black text-gray-300 uppercase tracking-tighter opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">Slack</div>
                            </div>
                            <p className="text-xs font-medium text-gray-400 tracking-tight leading-relaxed mt-4">Direct hiring pipelines activated.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Verified Capability",
                                desc: "No more long interviews. Our partner managers trust our verification data for 1-click hiring decisions.",
                                icon: <Zap className="w-5 h-5" />
                            },
                            {
                                title: "Authority Access",
                                desc: "Bypass the HR black hole. Your profile is automatically indexed in the 'Confirmed Expert' pool.",
                                icon: <Target className="w-5 h-5" />
                            },
                            {
                                title: "Clinical Support",
                                desc: "Receive personalized coaching and mock analysis to maintain your Tier-1 status.",
                                icon: <Star className="w-5 h-5" />
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="w-12 h-12 bg-[#FAFAFA] text-[#7C3AED] rounded-2xl flex items-center justify-center mb-8 border border-gray-50 group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-4">{item.title}</h3>
                                <p className="text-sm font-medium text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="fixed inset-0 bg-grid-black/[0.01] pointer-events-none" />
        </div>
    );
};

export default GetHiredLanding;
