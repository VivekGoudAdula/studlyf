import React, { useState } from 'react';
import { Gavel, Star, MessageSquare, Save, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const JudgeDashboard = () => {
    const [assignedProjects, setAssignedProjects] = useState([]);
    const [activeProject, setActiveProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState({
        innovation: 0,
        technicality: 0,
        impact: 0,
        presentation: 0
    });
    const [comments, setComments] = useState('');

    useEffect(() => {
        const fetchAssigned = async () => {
            try {
                const response = await fetch('/api/v1/institution/judge/assigned/default_judge');
                if (!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();
                setAssignedProjects(data);
            } catch (error) {
                console.error("Dynamic data fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssigned();
    }, []);

    const handleScoreChange = (criteria, value) => {
        setScores({ ...scores, [criteria]: value });
    };

    const handleSaveScore = async () => {
        try {
            const response = await fetch('/api/v1/institution/judge/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submission_id: activeProject._id,
                    scores,
                    comments
                })
            });
            if (response.ok) {
                alert('Score saved successfully!');
                setActiveProject(null);
            }
        } catch (error) {
            console.error("Failed to save score:", error);
        }
    };

    return (
        <div className="flex gap-8 h-[calc(100vh-180px)]">
            {/* Project List Sidebar */}
            <div className="w-80 bg-white rounded-3xl border border-gray-100 flex flex-col overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Gavel size={20} className="text-purple-600" />
                        Assigned Projects
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {assignedProjects.map((project) => (
                            <button 
                                key={project._id}
                                onClick={() => setActiveProject(project)}
                                className={`w-full p-4 rounded-2xl text-left transition-all ${
                                    activeProject?._id === project._id 
                                        ? 'bg-purple-50 border-2 border-purple-200' 
                                        : 'hover:bg-gray-50 border-2 border-transparent'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-gray-900 line-clamp-1">{project.project_title}</span>
                                    {project.status === 'Scored' && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{project.team_name}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        project.status === 'Scored' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </button>
                        ))}
                </div>
            </div>

            {/* Evaluation Area */}
            <div className="flex-1 overflow-y-auto">
                {activeProject ? (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 text-purple-600 font-bold text-sm mb-1 uppercase tracking-widest">
                                    <Users size={14} />
                                    {activeProject.team_name}
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900">{activeProject.project_title}</h1>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-purple-50 text-purple-600 rounded-xl font-bold text-lg">
                                <Star size={24} className="fill-purple-600" />
                                {Object.values(scores).reduce((a, b) => (a as any) + (b as any), 0) / 4 || 0}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                                {Object.entries({
                                    innovation: 'Innovation & Originality',
                                    technicality: 'Technical Execution',
                                    impact: 'Real-world Impact',
                                    presentation: 'Presentation & UI/UX'
                                }).map(([key, label]) => (
                                    <div key={key} className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-gray-700">{label}</label>
                                            <span className="text-sm font-black text-purple-600">{scores[key]}/10</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="10" 
                                            value={scores[key]}
                                            onChange={(e) => handleScoreChange(key, parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <MessageSquare size={16} className="text-purple-500" />
                                    Evaluation Comments
                                </label>
                                <textarea 
                                    rows={8}
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Provide constructive feedback for the team..."
                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50 flex justify-end gap-4">
                            <button 
                                onClick={() => setActiveProject(null)}
                                className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveScore}
                                className="px-8 py-3 bg-[#0f172a] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                            >
                                <Save size={20} />
                                Submit Evaluation
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-full bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Gavel size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Select a project to evaluate</h3>
                        <p className="max-w-xs text-sm">Choose one of your assigned submissions from the left panel to begin the scoring process.</p>
                        <ChevronRight className="mt-6 animate-pulse" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default JudgeDashboard;
