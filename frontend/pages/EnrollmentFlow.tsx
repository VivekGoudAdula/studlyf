import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    Check,
    ChevronRight,
    CreditCard,
    ShieldCheck,
    Zap,
    Star,
    ArrowRight,
    UserCheck,
    Package,
    Wallet,
    Unlock,
    Sparkles,
    ArrowLeft
} from 'lucide-react';

/* ─────────────────────────── mock data ─────────────────────────── */
const tracks = {
    ai: { title: 'Artificial Intelligence', accent: '#7C3AED', icon: '🤖' },
    swe: { title: 'Software Engineering', accent: '#1D74F2', icon: '⚙️' },
    data: { title: 'Data & Analytics', accent: '#059669', icon: '📊' },
    pm: { title: 'Product Management', accent: '#F59E0B', icon: '🚀' },
    cyber: { title: 'Cyber Security', accent: '#DC2626', icon: '🛡️' }
};

const EnrollmentFlow: React.FC = () => {
    const { trackId } = useParams<{ trackId: string }>();
    const [searchParams] = useSearchParams();
    const initialPlan = searchParams.get('plan') || 'yearly';

    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(initialPlan);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const track = tracks[trackId as keyof typeof tracks] || tracks.ai;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else handlePayment();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigate(-1);
    };

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setStep(4);
        }, 2500);
    };

    const steps = [
        { id: 1, name: 'Confirm Role', icon: UserCheck },
        { id: 2, name: 'Select Plan', icon: Package },
        { id: 3, name: 'Payment', icon: Wallet },
        { id: 4, name: 'Unlock', icon: Unlock },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-4">
            {/* ── Progress Header ── */}
            <div className="max-w-4xl mx-auto mb-16">
                <div className="flex items-center justify-between relative px-2">
                    {steps.map((s, i) => (
                        <div key={s.id} className="z-10 flex flex-col items-center">
                            <motion.div
                                animate={{
                                    backgroundColor: step >= s.id ? track.accent : '#fff',
                                    borderColor: step >= s.id ? track.accent : '#E5E7EB',
                                    color: step >= s.id ? '#fff' : '#9CA3AF'
                                }}
                                className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm mb-2 shadow-sm transition-colors duration-500"
                            >
                                {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                            </motion.div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>
                                {s.name}
                            </span>
                        </div>
                    ))}
                    {/* connector line */}
                    <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-100 -z-0">
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                            className="h-full"
                            style={{ backgroundColor: track.accent }}
                        />
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto">
                <AnimatePresence mode="wait">
                    {/* ── STEP 1: CONFIRM ROLE ── */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid lg:grid-cols-2 gap-12 items-center"
                        >
                            <div className="space-y-8">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 block" style={{ color: track.accent }}>Step 01 / Confirmation</span>
                                    <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                                        Confirm Your <br /> <span style={{ color: track.accent }}>Career Track</span>.
                                    </h2>
                                </div>
                                <p className="text-gray-500 text-lg">You have selected the <b>{track.title}</b> track. This intensive 16-week program is designed to move you from theory into verified engineering authority.</p>
                                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shadow-inner">{track.icon}</div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Selection</p>
                                        <h3 className="text-xl font-black text-gray-900 uppercase">Engineering: {track.title}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-gray-600 transition-colors">
                                        <ArrowLeft className="w-4 h-4" /> Change Track
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleNext}
                                        className="flex-1 py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3"
                                        style={{ background: `linear-gradient(135deg, ${track.accent}, ${track.accent}CC)`, boxShadow: `0 12px 32px -8px ${track.accent}55` }}
                                    >
                                        Confirm & Proceed <ChevronRight className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                            <div className="hidden lg:block relative">
                                <div className="bg-[#111827] rounded-[3rem] p-12 text-white relative overflow-hidden">
                                    <h4 className="text-2xl font-black uppercase tracking-tighter mb-6 underline decoration-[#7C3AED] underline-offset-8">Track Outcome</h4>
                                    <ul className="space-y-6">
                                        {[
                                            { icon: Sparkles, text: 'Proprietary Verified Certificate' },
                                            { icon: ShieldCheck, text: 'Clinical Evidence Portfolio' },
                                            { icon: Zap, text: 'Direct Hiring Pipeline Access' },
                                            { icon: Star, text: 'Elite Alumni Network' }
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-4">
                                                <item.icon className="w-5 h-5 text-gray-400" />
                                                <span className="text-sm font-bold uppercase tracking-widest text-white/80">{item.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full blur-[100px] opacity-20" style={{ backgroundColor: track.accent }} />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 2: SELECT PLAN ── */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="text-center max-w-2xl mx-auto">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 block" style={{ color: track.accent }}>Step 02 / Membership</span>
                                <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9] mb-6">
                                    Select Your <br /> <span style={{ color: track.accent }}>Mastery Plan</span>.
                                </h2>
                                <p className="text-gray-500 font-medium">Choose how you want to invest in your engineering journey. Yearly plans include verified certification and hiring support.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                <div
                                    onClick={() => setSelectedPlan('monthly')}
                                    className={`bg-white rounded-[2.5rem] p-10 border-2 cursor-pointer transition-all ${selectedPlan === 'monthly' ? 'border-gray-900 shadow-2xl scale-[1.02]' : 'border-gray-100 border-dashed opacity-60'}`}
                                >
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <h4 className="text-xl font-black uppercase tracking-tighter">Monthly Sprint</h4>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pay as you go</p>
                                        </div>
                                        {selectedPlan === 'monthly' && <Check className="w-6 h-6 text-gray-900" />}
                                    </div>
                                    <div className="flex items-baseline gap-1 mb-8">
                                        <span className="text-5xl font-black text-gray-900">$29</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/ Month</span>
                                    </div>
                                    <ul className="space-y-3 mb-10">
                                        {['Access to all Courses', 'Project Reviews', 'Community Access'].map(f => (
                                            <li key={f} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-200" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div
                                    onClick={() => setSelectedPlan('yearly')}
                                    className={`bg-white rounded-[2.5rem] p-10 border-2 cursor-pointer transition-all relative overflow-hidden ${selectedPlan === 'yearly' ? 'border-gray-900 shadow-2xl scale-[1.02]' : 'border-gray-100 border-dashed opacity-60'}`}
                                >
                                    <div className="absolute top-6 right-6 bg-green-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Best Value</div>
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <h4 className="text-xl font-black uppercase tracking-tighter">Yearly Mastery</h4>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full career support</p>
                                        </div>
                                        {selectedPlan === 'yearly' && <Check className="w-6 h-6 text-gray-900" />}
                                    </div>
                                    <div className="flex items-baseline gap-1 mb-8">
                                        <span className="text-5xl font-black text-gray-900">$299</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/ Year</span>
                                    </div>
                                    <ul className="space-y-3 mb-10">
                                        {['Full Authority Track', 'Verified Certification', 'Hiring Pipeline Access', 'Resume Verification'].map(f => (
                                            <li key={f} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                                <Check className="w-4 h-4 text-green-500" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-6 pt-4">
                                <button onClick={handleBack} className="px-8 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Back</button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleNext}
                                    className="px-12 py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center gap-3"
                                    style={{ background: `linear-gradient(135deg, ${track.accent}, ${track.accent}CC)`, boxShadow: `0 12px 32px -8px ${track.accent}55` }}
                                >
                                    Select Plan & Pay <ChevronRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 3: PAYMENT ── */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100">
                                <div className="p-10 sm:p-14 border-b border-gray-50">
                                    <div className="flex justify-between items-center mb-10">
                                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Order Summary</span>
                                        <div className="bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500">{selectedPlan} Plan</div>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{track.title} Track</h3>
                                        <span className="text-xl font-black text-gray-900">${selectedPlan === 'monthly' ? '29.00' : '299.00'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-400 mb-8">
                                        <p>Membership Enrollment Fee</p>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                                        <span className="text-2xl font-black text-gray-900 uppercase">Total</span>
                                        <span className="text-2xl font-black text-gray-900" style={{ color: track.accent }}>${selectedPlan === 'monthly' ? '29.00' : '299.00'}</span>
                                    </div>
                                </div>

                                <div className="p-10 sm:p-14 bg-gray-50/50">
                                    <div className="space-y-6">
                                        <div className="relative">
                                            <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                disabled
                                                type="text"
                                                className="w-full bg-white border border-gray-100 h-16 rounded-2xl pl-16 pr-6 text-sm font-bold placeholder:text-gray-300 focus:outline-none"
                                                placeholder="4242 4242 4242 4242"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input disabled type="text" className="w-full bg-white border border-gray-100 h-16 rounded-2xl px-6 text-sm font-bold placeholder:text-gray-300 focus:outline-none" placeholder="MM/YY" />
                                            <input disabled type="text" className="w-full bg-white border border-gray-100 h-16 rounded-2xl px-6 text-sm font-bold placeholder:text-gray-300 focus:outline-none" placeholder="CVC" />
                                        </div>

                                        <p className="text-[10px] text-gray-400 font-bold uppercase text-center tracking-widest">Secured by Stripe & Verified by Studlyf</p>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handlePayment}
                                            disabled={isProcessing}
                                            className="w-full py-6 rounded-3xl text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50"
                                            style={{ background: 'linear-gradient(135deg, #111827, #1F2937)', boxShadow: '0 20px 40px -10px rgba(17,24,39,0.3)' }}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                                    Processing Protocol...
                                                </>
                                            ) : (
                                                <>
                                                    Confirm Payment <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 4: SUCCESS / UNLOCK ── */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-3xl mx-auto text-center py-10"
                        >
                            <div className="relative mb-12">
                                <motion.div
                                    initial={{ rotate: 0, scale: 0.8 }}
                                    animate={{ rotate: 360, scale: 1 }}
                                    transition={{ duration: 1, ease: 'backOut' }}
                                    className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40"
                                >
                                    <Check className="w-16 h-16 text-white stroke-[4px]" />
                                </motion.div>
                                {/* floating unlock badges */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute top-0 right-[25%] bg-white p-3 rounded-2xl shadow-xl border border-gray-50"
                                >
                                    <Unlock className="w-6 h-6 text-green-500" />
                                </motion.div>
                            </div>

                            <h2 className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tighter uppercase mb-6 leading-[0.9]">
                                Clinical Access <br /> <span className="text-green-500">Unlocked</span>.
                            </h2>
                            <p className="text-gray-500 text-lg font-medium mb-12 max-w-xl mx-auto">Welcome to the elite tier. Your learning dashboard is now fully unlocked with the <b>{track.title}</b> curriculum.</p>

                            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm mb-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
                                {[
                                    { label: 'Courses', val: 'Full' },
                                    { label: 'Mentors', val: 'Active' },
                                    { label: 'Projects', val: 'Ready' },
                                    { label: 'Hiring', val: 'Open' }
                                ].map((s, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                                        <p className="font-black text-green-500 uppercase">{s.val}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        const trackToCourse: Record<string, string> = {
                                            ai: 'm1',
                                            swe: 'm2',
                                            data: 'm3',
                                            pm: 'm4',
                                            cyber: 'm5'
                                        };
                                        const courseId = trackToCourse[trackId || 'ai'] || 'm1';
                                        navigate(`/learn/course-player/${courseId}`);
                                    }}
                                    className="px-12 py-6 bg-[#111827] text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl flex items-center gap-3"
                                >
                                    Start Learning Now <ArrowRight className="w-5 h-5" />
                                </motion.button>
                                <button
                                    onClick={() => navigate(`/learn/courses?category=${track.title}`)}
                                    className="px-12 py-6 bg-white text-gray-900 font-black text-xs uppercase tracking-[0.3em] rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all"
                                >
                                    View Other Courses
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Decorative background grids */}
            <div className="fixed inset-0 bg-grid-black/[0.02] pointer-events-none -z-10" />
        </div>
    );
};

export default EnrollmentFlow;
