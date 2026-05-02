import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Calendar, 
    MapPin, 
    Briefcase, 
    ChevronLeft, 
    CheckCircle2, 
    Upload, 
    Send,
    Users,
    Clock,
    Building2,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../apiConfig';
import { useAuth } from '../../AuthContext';

const OpportunityDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [opportunity, setOpportunity] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        resume: null as File | null,
        interest: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [oppRes, appRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/opportunities/${id}`),
                    user ? fetch(`${API_BASE_URL}/api/opportunities/user/${user.user_id}/applications`) : Promise.resolve({ json: () => [] })
                ]);
                
                const opp = await oppRes.json();
                const apps = await (appRes as any).json();
                
                setOpportunity(opp);
                setIsApplied(apps.some((a: any) => a.opportunity_id === id));
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/opportunities/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    opportunity_id: id,
                    user_id: user.user_id,
                    name: formData.name,
                    email: formData.email,
                    interest_reason: formData.interest,
                    // Note: In a real app, we'd upload the resume to a bucket first
                    resume_url: "https://studlyf.com/resumes/dummy.pdf"
                })
            });

            if (response.ok) {
                setSubmitted(true);
                setIsApplied(true);
            }
        } catch (err) {
            console.error("Apply error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC] space-y-4">
                <h1 className="text-2xl font-black text-slate-800">Opportunity Not Found</h1>
                <button onClick={() => navigate('/opportunities')} className="text-purple-600 font-bold flex items-center gap-2">
                    <ChevronLeft size={20} /> Back to Listings
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
            {/* Header / Banner */}
            <div className="relative h-[300px] bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-slate-900 to-slate-900 z-10" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 z-0" />
                
                <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-20">
                    <button 
                        onClick={() => navigate('/opportunities')}
                        className="absolute top-24 left-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold text-sm"
                    >
                        <ChevronLeft size={20} /> Back
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <span className="px-4 py-1.5 bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-purple-200 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                                {opportunity.type}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                                {opportunity.title}
                            </h1>
                            <div className="flex flex-wrap gap-6 text-white/60 font-bold text-sm">
                                <span className="flex items-center gap-2">
                                    <Building2 size={18} className="text-purple-400" />
                                    {opportunity.organization}
                                </span>
                                {opportunity.location && (
                                    <span className="flex items-center gap-2">
                                        <MapPin size={18} className="text-purple-400" />
                                        {opportunity.location}
                                    </span>
                                )}
                                <span className="flex items-center gap-2">
                                    <Calendar size={18} className="text-purple-400" />
                                    Deadline: {new Date(opportunity.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>

                        {isApplied && !submitted && (
                            <div className="bg-green-500/10 backdrop-blur-md border border-green-500/20 p-4 rounded-3xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <p className="text-white font-black text-sm uppercase tracking-wider">Already Applied</p>
                                    <p className="text-green-200/60 text-xs font-bold">Your application is being reviewed</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900">About the Opportunity</h2>
                            <div className="h-1.5 w-16 bg-purple-600 rounded-full" />
                        </div>
                        <p className="text-slate-600 font-medium leading-loose whitespace-pre-wrap">
                            {opportunity.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Applicants</p>
                                    <p className="text-lg font-black text-slate-800">{opportunity.applicantsCount}+</p>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                    <p className="text-lg font-black text-slate-800 uppercase tracking-widest text-green-600">Active</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900">Perks & Benefits</h2>
                            <div className="h-1.5 w-16 bg-purple-600 rounded-full" />
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['Certificate of Completion', 'Letter of Recommendation', 'Performance Bonuses', 'Networking Events', 'Mentorship Sessions', 'High-Growth Startup Culture'].map((perk, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-600 font-bold">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    {perk}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Right Column: Application Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32">
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-[40px] p-10 border border-green-100 shadow-2xl shadow-green-900/5 text-center space-y-6"
                                >
                                    <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-green-500/20 rotate-12">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black text-slate-900">Application Sent!</h2>
                                        <p className="text-slate-400 font-bold">Great job! The team at {opportunity.organization} will review your profile soon.</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/dashboard/learner')}
                                        className="w-full bg-slate-900 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                                    >
                                        Go to Dashboard
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-2xl shadow-purple-900/5 space-y-8"
                                >
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black text-slate-900">Apply Now</h2>
                                        <p className="text-slate-400 font-bold text-sm">Join {opportunity.organization} to start your journey</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    disabled 
                                                    value={formData.name}
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    disabled 
                                                    value={formData.email}
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Why are you interested?</label>
                                                <textarea 
                                                    required
                                                    placeholder="Share your motivation and relevant skills..."
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 focus:ring-4 focus:ring-purple-50 focus:border-purple-200 outline-none transition-all resize-none h-32"
                                                    value={formData.interest}
                                                    onChange={(e) => setFormData({...formData, interest: e.target.value})}
                                                    disabled={isApplied}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Resume / CV</label>
                                                <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                                                    isApplied ? 'bg-slate-50 border-slate-100' : 'bg-purple-50/30 border-purple-100 hover:border-purple-300'
                                                }`}>
                                                    <Upload size={24} className="mx-auto mb-2 text-purple-400" />
                                                    <p className="text-xs font-black text-purple-600 uppercase tracking-widest">
                                                        {isApplied ? 'Resume Uploaded' : 'Upload Resume'}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-1">PDF, DOC (Max 5MB)</p>
                                                    {!isApplied && <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.doc,.docx" />}
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={isApplied || submitting}
                                            className={`w-full py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${
                                                isApplied 
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                                                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-600/30 active:scale-95'
                                            }`}
                                        >
                                            {submitting ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : isApplied ? (
                                                'Application Submitted'
                                            ) : (
                                                <>Submit Application <Send size={18} /></>
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpportunityDetails;
