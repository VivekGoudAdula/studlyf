
import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Plus, 
    Trash2, 
    Star, 
    Mail, 
    Shield,
    CheckCircle2,
    Search
} from 'lucide-react';

interface Judge {
    id: string;
    name: string;
    email: string;
    expertise: string[];
    assigned: boolean;
}

interface JudgeAssignmentProps {
    assignedJudgeIds: string[];
    onUpdate: (judgeIds: string[]) => void;
}

const JudgeAssignment: React.FC<JudgeAssignmentProps> = ({ assignedJudgeIds, onUpdate }) => {
    const [availableJudges, setAvailableJudges] = useState<Judge[]>([
        { id: 'j1', name: 'Dr. Sarah Wilson', email: 'sarah@ai-corp.com', expertise: ['AI', 'ML'], assigned: false },
        { id: 'j2', name: 'Mark Chen', email: 'mark@dev.tech', expertise: ['Web3', 'System Design'], assigned: false },
        { id: 'j3', name: 'Elena Rodriguez', email: 'elena@design.io', expertise: ['UI/UX', 'Product'], assigned: false },
        { id: 'j4', name: 'Alex Thompson', email: 'alex@security.net', expertise: ['Cybersecurity'], assigned: false },
    ]);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredJudges = availableJudges.filter(judge => 
        judge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        judge.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleJudge = (id: string) => {
        if (assignedJudgeIds.includes(id)) {
            onUpdate(assignedJudgeIds.filter(jid => jid !== id));
        } else {
            onUpdate([...assignedJudgeIds, id]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-50 focus:border-purple-600 outline-none transition-all placeholder:text-slate-400 text-sm font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJudges.map((judge) => {
                    const isAssigned = assignedJudgeIds.includes(judge.id);
                    return (
                        <div 
                            key={judge.id}
                            onClick={() => toggleJudge(judge.id)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                                isAssigned 
                                    ? 'bg-purple-50 border-purple-200 shadow-sm' 
                                    : 'bg-white border-slate-100 hover:border-purple-100'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                                isAssigned ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                                {judge.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h5 className="font-bold text-slate-900 text-sm">{judge.name}</h5>
                                    {isAssigned && <CheckCircle2 size={14} className="text-purple-600" />}
                                </div>
                                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <Mail size={10} /> {judge.email}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {judge.expertise.map(exp => (
                                        <span key={exp} className="px-2 py-0.5 bg-white border border-slate-100 rounded-md text-[8px] font-bold text-slate-500 uppercase">
                                            {exp}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                isAssigned ? 'bg-purple-600 border-purple-600' : 'border-slate-200'
                            }`}>
                                {isAssigned && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Shield size={16} className="text-purple-600" />
                        <h5 className="text-xs font-black text-slate-900 uppercase">Assignment Summary</h5>
                    </div>
                    <span className="text-xs font-bold text-purple-600 bg-white px-3 py-1 rounded-full shadow-sm border border-purple-100">
                        {assignedJudgeIds.length} Judges Assigned
                    </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                    Assigned judges will receive an automated invitation to evaluate submissions in this stage. 
                    They will have access to the scoring rubric once the review period starts.
                </p>
            </div>
        </div>
    );
};

export default JudgeAssignment;
