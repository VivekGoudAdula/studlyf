
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Save, HelpCircle, Target, Clock, AlertCircle } from 'lucide-react';

interface Question {
    id: string;
    text: string;
    type: 'MCQ' | 'Multiple' | 'Technical';
    options: string[];
    correctAnswer: string;
}

interface QuizDesignerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (quizData: any) => void;
    loading?: boolean;
}

const QuizDesignerModal: React.FC<QuizDesignerModalProps> = ({ isOpen, onClose, onSave, loading }) => {
    const [title, setTitle] = useState('New Assessment Round');
    const [questions, setQuestions] = useState<Question[]>([
        { id: '1', text: '', type: 'MCQ', options: ['', '', '', ''], correctAnswer: '' }
    ]);
    const [duration, setDuration] = useState(30);

    const addQuestion = () => {
        setQuestions([...questions, { 
            id: Date.now().toString(), 
            text: '', 
            type: 'MCQ', 
            options: ['', '', '', ''], 
            correctAnswer: '' 
        }]);
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const updateQuestion = (id: string, field: string, value: any) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const updateOption = (qId: string, optIdx: number, value: string) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                const newOpts = [...q.options];
                newOpts[optIdx] = value;
                return { ...q, options: newOpts };
            }
            return q;
        }));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
                />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-5xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-[#6C3BFF] text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-purple-200">
                                <HelpCircle size={28} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Assessment Architect</h2>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Design High-Stakes Qualification Rounds</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-500 hover:shadow-xl transition-all"><X size={24} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
                        {/* Meta Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Round Title</label>
                                <input 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Technical MCQ Phase 1"
                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-50 rounded-[1.8rem] font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-[#6C3BFF]/5 transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Time Limit (Minutes)</label>
                                <div className="relative">
                                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                    <input 
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-50 rounded-[1.8rem] font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-[#6C3BFF]/5 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Questions List */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-900">Question Protocol ({questions.length})</h3>
                                <button 
                                    onClick={addQuestion}
                                    className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#6C3BFF] transition-all flex items-center gap-3 shadow-lg shadow-black/10"
                                >
                                    <Plus size={16} /> Add Question
                                </button>
                            </div>

                            <div className="space-y-10">
                                {questions.map((q, idx) => (
                                    <motion.div 
                                        layout
                                        key={q.id}
                                        className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm relative group"
                                    >
                                        <div className="absolute -left-4 top-10 w-10 h-10 bg-[#6C3BFF] text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-purple-200">
                                            {idx + 1}
                                        </div>
                                        
                                        <div className="space-y-8">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="flex-1 space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Problem Statement</label>
                                                    <textarea 
                                                        value={q.text}
                                                        onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                                                        placeholder="Enter the question here..."
                                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-50 rounded-[1.8rem] font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-[#6C3BFF]/5 transition-all resize-none"
                                                        rows={2}
                                                    />
                                                </div>
                                                <div className="w-full md:w-64 space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Type</label>
                                                    <select 
                                                        value={q.type}
                                                        onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-50 rounded-[1.8rem] font-bold text-slate-900 outline-none focus:bg-white transition-all appearance-none"
                                                    >
                                                        <option>MCQ</option>
                                                        <option>Technical</option>
                                                        <option>Scenario</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Options Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {q.options.map((opt, optIdx) => (
                                                    <div key={optIdx} className="relative group/opt">
                                                        <input 
                                                            value={opt}
                                                            onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                                                            placeholder={`Option ${optIdx + 1}`}
                                                            className={`w-full pl-14 pr-8 py-4 bg-slate-50 border ${q.correctAnswer === opt && opt !== '' ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-50'} rounded-2xl font-medium text-slate-700 outline-none focus:bg-white transition-all`}
                                                        />
                                                        <button 
                                                            onClick={() => updateQuestion(q.id, 'correctAnswer', opt)}
                                                            className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${q.correctAnswer === opt && opt !== '' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-transparent group-hover/opt:text-slate-400'}`}
                                                        >
                                                            <Target size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => removeQuestion(q.id)}
                                            className="absolute right-8 top-8 p-3 bg-white text-slate-300 hover:text-red-500 hover:shadow-xl rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Summary / Protocol */}
                        <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex items-center gap-8">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500">
                                <AlertCircle size={28} />
                            </div>
                            <div className="flex-1">
                                <h5 className="font-black text-slate-900">Final Validation</h5>
                                <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">Ensure all questions have a correct answer selected before syncing.</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-10 border-t border-slate-50 flex justify-end gap-6 bg-slate-50/20">
                        <button onClick={onClose} className="px-10 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Discard</button>
                        <button 
                            onClick={() => onSave({ title, questions, duration })}
                            disabled={loading}
                            className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#6C3BFF] transition-all shadow-2xl shadow-black/10 flex items-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={18} />}
                            {loading ? 'Vaulting...' : 'Sync to Database'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default QuizDesignerModal;
