import React, { useState, useEffect } from 'react';
import { 
    Gavel, 
    CheckCircle2, 
    FileText, 
    ExternalLink, 
    Save, 
    ShieldCheck, 
    Star,
    AlertCircle,
    ChevronRight,
    Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JudgeDashboard: React.FC = () => {
    const [assignedTeams, setAssignedTeams] = useState<any[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    const [scores, setScores] = useState<any>({});
    const [criteria, setCriteria] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Mock Judge Info (In real system, this comes from the secure token/URL)
    const judgeEmail = "judge@university.edu"; 
    const eventId = "current_event_id";

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch assignments for the current judge
                const res = await fetch(`/api/v1/institution/judges/me/assignments`);
                if (res.ok) {
                    const data = await res.json();
                    setAssignedTeams(Array.isArray(data) ? data : []);
                }
                
                setCriteria([
                    { id: '1', name: 'Innovation', max_points: 25 },
                    { id: '2', name: 'UI/UX Design', max_points: 25 },
                    { id: '3', name: 'Technical Depth', max_points: 25 },
                    { id: '4', name: 'Completeness', max_points: 25 },
                ]);
            } catch (err) {
                console.error("Failed to load judge data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleScoreChange = (criteria: string, val: number) => {
        setScores({ ...scores, [criteria]: val });
    };

    // Reset scores when a new team is selected
    useEffect(() => {
        if (selectedTeam && criteria.length > 0) {
            const initialScores: any = {};
            criteria.forEach((c: any) => initialScores[c.name] = 0);
            setScores(initialScores);
        }
    }, [selectedTeam, criteria]);

    const submitEvaluation = async () => {
        if (!selectedTeam) return;
        setSubmitting(true);
        try {
            const { user } = await import('../../AuthContext').then(m => ({ user: { user_id: 'current_judge' } })); // Simple mock for now
            
            const response = await fetch('/api/v1/judge/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submission_id: selectedTeam._id,
                    judge_id: 'current_judge', // In prod, this comes from useAuth()
                    scores: scores,
                    feedback: "Project evaluation completed." // Can add feedback box value here
                })
            });
            
            if (response.ok) {
                alert(`Evaluation synced for ${selectedTeam.title || selectedTeam.name}!`);
                setAssignedTeams(assignedTeams.filter(t => t._id !== selectedTeam._id));
                setSelectedTeam(null);
            } else {
                throw new Error("Sync failed");
            }
        } catch (err) {
            alert("Failed to submit score to network");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white">Loading Evaluation Portal...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500 rounded-2xl shadow-lg shadow-purple-500/20">
                            <Gavel className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-white uppercase">Evaluation Portal</h1>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Institution Official Evaluator</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{judgeEmail}</p>
                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Authenticated Session</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Assigned List */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Pending Reviews</h2>
                            <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-white">{assignedTeams.length}</span>
                        </div>
                        
                        <div className="space-y-4">
                            {assignedTeams.length > 0 ? assignedTeams.map((team) => (
                                <button 
                                    key={team.id}
                                    onClick={() => setSelectedTeam(team)}
                                    className={`w-full p-6 rounded-[2rem] border transition-all text-left group relative overflow-hidden ${selectedTeam?.id === team.id ? 'bg-purple-600 border-purple-500 shadow-2xl shadow-purple-500/20 scale-[1.02]' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                                >
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${selectedTeam?.id === team.id ? 'bg-white/20 text-white' : 'bg-purple-500/10 text-purple-400'}`}>
                                                {team.stage}
                                            </span>
                                            <ChevronRight className={`transition-transform ${selectedTeam?.id === team.id ? 'translate-x-1 text-white' : 'text-slate-600'}`} size={16} />
                                        </div>
                                        <h3 className={`text-lg font-black tracking-tight ${selectedTeam?.id === team.id ? 'text-white' : 'text-slate-200'}`}>{team.name}</h3>
                                        <p className={`text-xs mt-1 font-medium ${selectedTeam?.id === team.id ? 'text-purple-100' : 'text-slate-500'}`}>{team.project}</p>
                                    </div>
                                    {selectedTeam?.id === team.id && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                                    )}
                                </button>
                            )) : (
                                <div className="p-12 text-center bg-slate-900/50 rounded-[3rem] border border-slate-800/50 border-dashed">
                                    <CheckCircle2 size={48} className="mx-auto text-emerald-500/20 mb-4" />
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-600 italic">All evaluations completed!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Evaluation Card */}
                    <div className="lg:col-span-8">
                        {selectedTeam ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900 rounded-[3.5rem] border border-slate-800 shadow-2xl overflow-hidden"
                            >
                                {/* Team Context */}
                                <div className="p-10 border-b border-slate-800 bg-gradient-to-br from-slate-800/30 to-transparent">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-3xl font-black text-white tracking-tight">{selectedTeam.name}</h2>
                                            <p className="text-purple-400 font-bold mt-1 text-lg">{selectedTeam.project}</p>
                                        </div>
                                        <a href={selectedTeam.submission_url} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.05] transition-all">
                                            <FileText size={16} />
                                            View Submission
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>

                                {/* Scoring Area */}
                                <div className="p-10 space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {criteria.map((c) => (
                                             <div key={c.id || c.name} className="space-y-4">
                                                 <div className="flex justify-between">
                                                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">{c.name}</label>
                                                     <span className="text-lg font-black text-purple-400">{scores[c.name] || 0}<span className="text-slate-600 text-xs font-bold"> / {c.max_points}</span></span>
                                                 </div>
                                                 <input 
                                                     type="range" 
                                                     min="0" 
                                                     max={c.max_points} 
                                                     value={scores[c.name] || 0}
                                                     onChange={(e) => handleScoreChange(c.name, parseInt(e.target.value))}
                                                     className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-purple-500"
                                                 />
                                             </div>
                                         ))}
                                     </div>

                                    {/* Feedback */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Judge Feedback (Private to Admin)</label>
                                        <textarea 
                                            rows={4}
                                            placeholder="What did you think of this project?"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-[2rem] p-6 text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                                        />
                                    </div>

                                    {/* Total Footer */}
                                    <div className="pt-10 border-t border-slate-800 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aggregate Score</p>
                                            <p className="text-4xl font-black text-white mt-1">
                                                {Object.values(scores).reduce((a: any, b: any) => a + b, 0)}
                                                <span className="text-slate-600 text-xl font-bold"> / 100</span>
                                            </p>
                                        </div>
                                        <button 
                                            onClick={submitEvaluation}
                                            disabled={submitting}
                                            className="px-10 py-5 bg-purple-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:scale-[1.05] active:scale-[0.95] transition-all shadow-2xl shadow-purple-500/40 flex items-center gap-3"
                                        >
                                            {submitting ? 'Syncing...' : 'Finalize Evaluation'}
                                            <ShieldCheck size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-slate-900/30 rounded-[3.5rem] border border-slate-800 border-dashed text-center p-10">
                                <div className="w-24 h-24 bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-600 mb-8">
                                    <Layout size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight">Ready for Evaluation?</h3>
                                <p className="text-slate-500 max-w-sm mt-2 font-medium">Select a team from the left panel to begin reviewing their submission and scoring their performance.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JudgeDashboard;
