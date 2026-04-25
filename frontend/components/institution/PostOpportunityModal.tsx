import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Info, ChevronRight, Save, Plus, Trash2 } from 'lucide-react';

interface PostOpportunityModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PostOpportunityModal: React.FC<PostOpportunityModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        orgName: '',
        type: 'General & Case Competitions',
        subType: 'General Competition',
        description: '',
        logo: null
    });

    const [registrationFields, setRegistrationFields] = useState([
        { id: '1', label: 'Full Name', type: 'text', required: true, canDelete: false },
        { id: '2', label: 'Email Address', type: 'email', required: true, canDelete: false },
        { id: '3', label: 'College / University', type: 'text', required: true, canDelete: true },
    ]);

    const addField = () => {
        const id = Math.random().toString(36).substring(7);
        setRegistrationFields([...registrationFields, { id, label: 'New Field', type: 'text', required: false, canDelete: true }]);
    };

    const removeField = (id: string) => {
        setRegistrationFields(registrationFields.filter(f => f.id !== id));
    };

    const updateField = (id: string, updates: any) => {
        setRegistrationFields(registrationFields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex h-[85vh]"
            >
                {/* Left Sidebar - Step Indicator */}
                <div className="w-1/3 bg-gray-50 border-r border-gray-100 p-10 flex flex-col">
                    <div className="flex items-center gap-3 mb-12">
                        <img src="/images/studlyf.png" alt="Studlyf" className="h-10" />
                    </div>

                    <h2 className="text-3xl font-['Outfit'] font-black text-gray-900 mb-10 leading-tight">
                        Post an <span className="text-[#6C3BFF]">Opportunity</span>
                    </h2>

                    <div className="space-y-10 relative">
                        {/* Step line */}
                        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-200" />
                        
                        <div className="flex items-center gap-4 relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all z-10 ${
                                step === 1 ? 'bg-[#6C3BFF] text-white shadow-lg shadow-purple-200' : 'bg-[#6C3BFF] text-white'
                            }`}>
                                {step > 1 ? '✓' : '1'}
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-sm font-bold ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Step 1</span>
                                <span className={`text-xs font-medium ${step >= 1 ? 'text-gray-500' : 'text-gray-300'}`}>Opportunity Details</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all z-10 ${
                                step === 2 ? 'bg-[#6C3BFF] text-white shadow-lg shadow-purple-200' : 'bg-white text-gray-400 border-2 border-gray-100'
                            }`}>
                                2
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-sm font-bold ${step === 2 ? 'text-gray-900' : 'text-gray-400'}`}>Step 2</span>
                                <span className={`text-xs font-medium ${step === 2 ? 'text-gray-500' : 'text-gray-300'}`}>Registration Form</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto bg-white p-6 rounded-[2rem] border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-[#6C3BFF]">
                                <Info size={20} />
                            </div>
                            <span className="bg-green-50 text-green-600 text-[10px] font-black uppercase px-2 py-0.5 rounded">Support</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">Facing any issues? Our team is here to help.</p>
                        <button className="text-xs font-bold text-[#6C3BFF] hover:underline">Get in touch →</button>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex-1 flex flex-col">
                    <div className="p-10 flex justify-end items-center gap-4">
                        {step === 2 && (
                            <button 
                                onClick={() => setStep(1)}
                                className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                ← Back to Step 1
                            </button>
                        )}
                        <button onClick={onClose} className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="px-12 pb-12 flex-1 overflow-y-auto premium-scrollbar">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 flex items-center gap-6">
                                        <div className="w-24 h-24 bg-white rounded-2xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#6C3BFF] transition-all">
                                            <Upload size={20} className="text-blue-400" />
                                            <span className="text-[10px] font-bold text-gray-400">Upload Logo</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 mb-1">Organization Logo</p>
                                            <p className="text-xs text-gray-400">Supported logo image JPG, JPEG, or PNG. Max 1 MB</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Opportunity Title *</label>
                                            <input 
                                                type="text" 
                                                value={formData.title}
                                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                                placeholder="Enter Opportunity Title" 
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:bg-white focus:border-[#6C3BFF] transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Organisation Name *</label>
                                            <input 
                                                type="text" 
                                                value={formData.orgName}
                                                onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                                                placeholder="Aurora Deemed University" 
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:bg-white focus:border-[#6C3BFF] transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Opportunity Type *</label>
                                                <select 
                                                    value={formData.type}
                                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:border-[#6C3BFF] transition-all"
                                                >
                                                    <option>General & Case Competitions</option>
                                                    <option>Quizzes</option>
                                                    <option>Hackathons</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Opportunity Sub-type *</label>
                                                <select 
                                                    value={formData.subType}
                                                    onChange={(e) => setFormData({...formData, subType: e.target.value})}
                                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:border-[#6C3BFF] transition-all"
                                                >
                                                    <option>General Competition</option>
                                                    <option>Coding Challenge</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Registration Form Builder</h3>
                                            <p className="text-xs text-gray-400 mt-1">Add or remove fields participants need to fill.</p>
                                        </div>
                                        <button 
                                            onClick={addField}
                                            className="px-4 py-2 bg-purple-50 text-[#6C3BFF] rounded-xl text-sm font-bold hover:bg-purple-100 transition-all flex items-center gap-2"
                                        >
                                            <Plus size={16} /> Add Field
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {registrationFields.map((field, index) => (
                                            <div key={field.id} className="group p-5 bg-gray-50 border border-gray-100 rounded-3xl flex items-center gap-4 hover:border-purple-200 transition-all">
                                                <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 grid grid-cols-2 gap-4">
                                                    <input 
                                                        type="text" 
                                                        value={field.label}
                                                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                        placeholder="Field Label"
                                                        className="bg-transparent border-none outline-none font-bold text-gray-800 text-sm"
                                                    />
                                                    <select 
                                                        value={field.type}
                                                        onChange={(e) => updateField(field.id, { type: e.target.value })}
                                                        className="bg-transparent border-none outline-none text-xs font-medium text-gray-500"
                                                    >
                                                        <option value="text">Text Input</option>
                                                        <option value="email">Email</option>
                                                        <option value="number">Number</option>
                                                        <option value="dropdown">Dropdown</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button 
                                                        onClick={() => updateField(field.id, { required: !field.required })}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                                            field.required ? 'bg-purple-100 text-[#6C3BFF]' : 'bg-gray-200 text-gray-500'
                                                        }`}
                                                    >
                                                        {field.required ? 'Required' : 'Optional'}
                                                    </button>
                                                    {field.canDelete && (
                                                        <button 
                                                            onClick={() => removeField(field.id)}
                                                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {registrationFields.length === 0 && (
                                        <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                                            <p className="text-gray-400 font-medium">No custom fields added yet.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-10 border-t border-gray-50 flex justify-end gap-4 bg-white sticky bottom-0">
                        <button className="px-8 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
                            Save as Draft
                        </button>
                        <button 
                            onClick={() => step === 1 ? setStep(2) : onClose()}
                            className="px-10 py-4 bg-[#6C3BFF] text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 transition-all"
                        >
                            {step === 1 ? (
                                <>
                                    Save and Next
                                    <ChevronRight size={20} />
                                </>
                            ) : 'Complete Posting'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PostOpportunityModal;
