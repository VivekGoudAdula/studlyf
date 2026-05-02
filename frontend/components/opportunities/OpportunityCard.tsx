import React from 'react';
import { Calendar, MapPin, Briefcase, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface OpportunityCardProps {
    opportunity: {
        _id: string;
        title: string;
        organization: string;
        type: string;
        description: string;
        location?: string;
        deadline: string;
        applicantsCount: number;
    };
    isApplied?: boolean;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, isApplied }) => {
    const navigate = useNavigate();

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'hackathon': return 'bg-purple-100 text-purple-600 border-purple-200';
            case 'internship': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'job': return 'bg-green-100 text-green-600 border-green-200';
            case 'competition': return 'bg-orange-100 text-orange-600 border-orange-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="min-w-[320px] max-w-[320px] bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-xl shadow-purple-900/5 flex flex-col justify-between group relative overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-all duration-500" />
            
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getTypeColor(opportunity.type)}`}>
                        {opportunity.type}
                    </span>
                    {isApplied && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-green-500/20">
                            Applied
                        </span>
                    )}
                </div>

                <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-800 line-clamp-1 group-hover:text-purple-600 transition-colors">
                        {opportunity.title}
                    </h3>
                    <p className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
                        <Briefcase size={14} className="text-purple-500" />
                        {opportunity.organization}
                    </p>
                </div>

                <p className="text-xs font-medium text-slate-400 line-clamp-2 leading-relaxed">
                    {opportunity.description}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                    {opportunity.location && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            <MapPin size={12} className="text-slate-400" />
                            {opportunity.location}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        <Calendar size={12} className="text-slate-400" />
                        {new Date(opportunity.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${opportunity._id + i}`} alt="user" />
                        </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-[8px] font-black text-purple-600">
                        +{opportunity.applicantsCount}
                    </div>
                </div>

                <button 
                    disabled={isApplied}
                    onClick={() => navigate(`/opportunities/${opportunity._id}`)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        isApplied 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/20 active:scale-95'
                    }`}
                >
                    {isApplied ? 'Applied' : 'Apply Now'}
                    {!isApplied && <ChevronRight size={14} />}
                </button>
            </div>
        </motion.div>
    );
};

export default OpportunityCard;
