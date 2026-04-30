import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Info, ChevronRight, Save, Plus, Trash2, Calendar, Trophy, Users, FileText, ArrowLeft, HeadphonesIcon } from 'lucide-react';

interface PostOpportunityModalProps {
    isOpen: boolean;
    onClose: () => void;
    institutionId?: string;
}

const PostOpportunityModal: React.FC<PostOpportunityModalProps> = ({ isOpen, onClose, institutionId }) => {
    const [step, setStep] = useState(1);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'Hackathon',
        organisation: 'Loading...', 
        category: 'Technology',
        description: '',
        startDate: '',
        endDate: '',
        deadline: '',
    });

    // FETCH REAL DATA ON MOUNT
    useEffect(() => {
        const fetchProfile = async () => {
            if (!isOpen || !institutionId || institutionId === 'default_inst') return;
            try {
                const { API_BASE_URL } = await import('../../apiConfig');
                const res = await fetch(`${API_BASE_URL}/api/v1/institution/profile/${institutionId}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData(prev => ({
                        ...prev,
                        organisation: data.name || 'Your Institution'
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch institution profile", err);
            }
        };
        fetchProfile();
    }, [isOpen, institutionId]);

    const steps = [
        { id: 1, label: 'Opportunity details' },
        { id: 2, label: 'Registration Form' },
    ];

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNext = async () => {
        if (step < steps.length) {
            setStep(step + 1);
        } else {
            setLoading(true);
            try {
                const { API_BASE_URL } = await import('../../apiConfig');
                const response = await fetch(`${API_BASE_URL}/api/v1/institution/events/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, institution_id: institutionId })
                });
                if (response.ok) {
                    alert("Opportunity Created Successfully!");
                    onClose();
                }
            } catch (err) {
                console.error("Submission failed", err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
                initial={{ scale: 0.98, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.98, opacity: 0, y: 10 }}
                className="relative w-full max-w-6xl bg-[#F8FAFC] rounded-[1rem] shadow-2xl overflow-hidden flex h-[90vh] font-['Outfit']"
            >
                {/* 1. Left Sidebar */}
                <div className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col shrink-0">
                    <div className="mb-10">
                        <h3 className="text-xl font-bold text-slate-800">Post an Opportunity</h3>
                    </div>

                    <div className="space-y-0 relative flex-1">
                        {steps.map((s, idx) => (
                            <div key={s.id} className="flex items-start gap-4 mb-8 relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                                    step === s.id ? 'bg-[#6C3BFF] text-white shadow-lg shadow-purple-100' : 
                                    step > s.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    {step > s.id ? '✓' : s.id}
                                </div>
                                <div className="flex flex-col pt-1">
                                    <span className={`text-[13px] font-bold ${step === s.id ? 'text-[#6C3BFF]' : 'text-slate-500'}`}>Step {s.id}</span>
                                    <span className={`text-[13px] font-medium mt-0.5 ${step === s.id ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`absolute left-4 top-8 w-[1px] h-8 ${step > s.id ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Support Box */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400">
                                <HeadphonesIcon size={16} />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-3 font-medium">
                            Facing any issues or need any help?
                        </p>
                        <p className="text-[11px] font-bold text-slate-900">Reach us at support@studlyf.com</p>
                    </div>
                </div>

                {/* 2. Main Form Content */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                    <button onClick={onClose} className="absolute right-6 top-6 z-20 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={20} /></button>
                    <div className="h-16 bg-gradient-to-r from-[#6C3BFF] to-[#8E66FF] w-full shrink-0" />

                    <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                        <div className="max-w-3xl mx-auto">
                            {/* Logo Upload */}
                            <div className="flex items-center gap-8 mb-12">
                                <label className="group relative w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-[#6C3BFF] transition-all overflow-hidden">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 bg-[#6C3BFF]/10 text-[#6C3BFF] rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                <Upload size={18} />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Add Logo</span>
                                        </>
                                    )}
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-400 leading-relaxed">Supported logo image JPG, JPEG, or PNG. Max 1 MB.</p>
                                    <p className="text-xs text-red-500 font-bold mt-1">Logo required</p>
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Opportunity Title *</label>
                                    <input 
                                        type="text" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="Enter Opportunity Title"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#6C3BFF]/20 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                    />
                                    <p className="text-[10px] text-slate-300 mt-2 font-bold uppercase tracking-widest">{formData.title.length}/100 characters</p>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Organisation Name *</label>
                                    <input 
                                        type="text" 
                                        value={formData.organisation}
                                        onChange={(e) => setFormData({...formData, organisation: e.target.value})}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#6C3BFF]/20 outline-none transition-all text-slate-900 font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Opportunity Type *</label>
                                        <select 
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none transition-all text-slate-900 font-medium appearance-none"
                                        >
                                            <option>Hackathon</option>
                                            <option>Coding Challenge</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Category *</label>
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none transition-all text-slate-900 font-medium appearance-none"
                                        >
                                            <option>Technology</option>
                                            <option>Design</option>
                                            <option>Business</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-slate-100 bg-white flex items-center justify-end gap-4 shrink-0">
                        <button onClick={onClose} className="px-8 py-3 bg-slate-50 text-slate-500 rounded-full font-bold text-sm hover:bg-slate-100 transition-all">Cancel</button>
                        <button 
                            disabled={loading}
                            onClick={handleNext} 
                            className={`px-8 py-3 bg-[#6C3BFF] text-white rounded-full font-bold text-sm transition-all flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-purple-200'}`}
                        >
                            {loading ? 'Processing...' : 'Save and next'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PostOpportunityModal;
