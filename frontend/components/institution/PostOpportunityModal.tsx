import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Info, ChevronRight, Save, Plus, Trash2, Calendar, Trophy, Gavel, Users, FileText } from 'lucide-react';

interface PostOpportunityModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PostOpportunityModal: React.FC<PostOpportunityModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        type: 'Hackathon',
        category: 'Technology',
        description: '',
        startDate: '',
        endDate: '',
        deadline: '',
        prizePool: '',
        maxParticipants: '',
        minTeamSize: '1',
        maxTeamSize: '4',
        rules: '',
        judges: [] as string[]
    });

    const steps = [
        { id: 1, label: 'Basic Info', icon: Info },
        { id: 2, label: 'Timeline', icon: Calendar },
        { id: 3, label: 'Prizes & Rules', icon: Trophy },
        { id: 4, label: 'Participants', icon: Users },
    ];

    if (!isOpen) return null;

    const nextStep = () => setStep(s => Math.min(s + 1, steps.length));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="relative w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex h-[90vh]"
            >
                {/* Left Sidebar */}
                <div className="w-80 bg-slate-50 border-r border-slate-100 p-10 flex flex-col shrink-0">
                    <div className="flex items-center gap-3 mb-12">
                        <img src="/images/studlyf.png" alt="Studlyf" className="h-10" />
                        <span className="font-['Outfit'] font-black text-xl tracking-tight text-slate-900">STUDLYF</span>
                    </div>

                    <h2 className="text-3xl font-['Outfit'] font-black text-slate-900 mb-10 leading-tight">
                        Create New <span className="text-[#6C3BFF]">Event</span>
                    </h2>

                    <div className="space-y-6 relative flex-1">
                        {steps.map((s, idx) => (
                            <div key={s.id} className="flex items-center gap-4 relative">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all z-10 ${
                                    step === s.id ? 'bg-[#6C3BFF] text-white shadow-xl shadow-purple-200' : 
                                    step > s.id ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200'
                                }`}>
                                    {step > s.id ? '✓' : s.id}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-xs font-bold uppercase tracking-widest ${step >= s.id ? 'text-[#6C3BFF]' : 'text-slate-400'}`}>{s.label}</span>
                                    <span className={`text-[10px] font-medium ${step >= s.id ? 'text-slate-500' : 'text-slate-300'}`}>Step {s.id} of {steps.length}</span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`absolute left-5 top-10 w-0.5 h-6 ${step > s.id ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Need Help?</p>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed">Check our guide on how to host successful hackathons.</p>
                        <button className="text-xs font-bold text-[#6C3BFF] flex items-center gap-1 hover:underline">
                            Read Guide <ChevronRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col bg-white">
                    <div className="p-8 flex justify-between items-center">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
                            <div className="w-2 h-2 bg-[#6C3BFF] rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Draft Auto-saved</span>
                        </div>
                        <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="px-16 pb-12 flex-1 overflow-y-auto no-scrollbar">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-3xl mx-auto"
                            >
                                {step === 1 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Basic Event Details</h3>
                                            <p className="text-slate-500">Let's start with the core information about your event.</p>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Title</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-50 focus:border-[#6C3BFF] outline-none transition-all font-medium"
                                                        placeholder="e.g. AI Innovation Hackathon 2024"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Type</label>
                                                        <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-50 outline-none transition-all font-medium">
                                                            <option>Hackathon</option>
                                                            <option>Coding Competition</option>
                                                            <option>Design Challenge</option>
                                                            <option>Quiz</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                                        <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-50 outline-none transition-all font-medium">
                                                            <option>Technology</option>
                                                            <option>Business</option>
                                                            <option>Design</option>
                                                            <option>Science</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                                    <textarea 
                                                        rows={5}
                                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-50 outline-none transition-all font-medium resize-none"
                                                        placeholder="Describe your event, its purpose, and what participants can expect..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Event Timeline</h3>
                                            <p className="text-slate-500">Define the schedule for registration and the event itself.</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-8">
                                            <div className="p-8 bg-purple-50/50 rounded-[2rem] border border-purple-100/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest ml-1">Registration Deadline</label>
                                                    <input type="datetime-local" className="w-full px-4 py-3 bg-white border border-purple-100 rounded-xl outline-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest ml-1">Team Finalization Date</label>
                                                    <input type="datetime-local" className="w-full px-4 py-3 bg-white border border-purple-100 rounded-xl outline-none" />
                                                </div>
                                            </div>
                                            <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Event Start Date</label>
                                                    <input type="datetime-local" className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl outline-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Event End Date</label>
                                                    <input type="datetime-local" className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Prizes & Guidelines</h3>
                                            <p className="text-slate-500">Motivate participants with prizes and set clear rules.</p>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Prize Pool (e.g. $10,000)</label>
                                                <div className="relative">
                                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                                                    <input type="text" className="w-full pl-10 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-50 outline-none" placeholder="Enter amount" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Rules & Guidelines</label>
                                                <textarea rows={8} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-50 outline-none resize-none" placeholder="List all rules, submission requirements, and judging criteria..." />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Participant Configuration</h3>
                                            <p className="text-slate-500">Set limits on team sizes and total participants.</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Users size={14} /> Team Size (Min-Max)
                                                </label>
                                                <div className="flex items-center gap-4">
                                                    <input type="number" defaultValue="1" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-center font-bold" />
                                                    <span className="text-slate-300">to</span>
                                                    <input type="number" defaultValue="4" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-center font-bold" />
                                                </div>
                                            </div>
                                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Star size={14} /> Max Registrations
                                                </label>
                                                <input type="number" placeholder="No limit" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-center font-bold" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-10 border-t border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md">
                        <button 
                            onClick={prevStep}
                            disabled={step === 1}
                            className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                                step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            Back
                        </button>
                        
                        <div className="flex gap-4">
                            <button className="px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                                Save Draft
                            </button>
                            <button 
                                onClick={step === steps.length ? onClose : nextStep}
                                className="px-12 py-4 bg-[#6C3BFF] text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-purple-200 hover:scale-105 active:scale-95 transition-all"
                            >
                                {step === steps.length ? 'Publish Event' : 'Save & Continue'}
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PostOpportunityModal;
