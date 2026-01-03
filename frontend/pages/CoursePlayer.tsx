import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import ReactMarkdown from 'react-markdown';

interface Module {
    _id: string;
    title: string;
    order_index: number;
    estimated_time: string;
    progress?: {
        status: string;
        theory_completed: boolean;
        video_completed: boolean;
        quiz_score: number;
        quiz_answers: number[][];
        project_status: string;
    };
}

const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-100">
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] shadow-[0_0_10px_rgba(124,58,237,0.2)]"
        />
    </div>
);

const SectionIndicator = ({ label, active, completed, locked, onClick }: { label: string, active: boolean, completed: boolean, locked: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        disabled={locked}
        className={`flex flex-col items-center gap-1.5 transition-all duration-500 ${locked ? 'opacity-20 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:scale-105'
            }`}
    >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${active ? 'border-[#7C3AED] bg-white shadow-xl shadow-[#7C3AED]/20 scale-110 z-10' :
            completed ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white'
            }`}>
            {completed ? (
                <span className="text-green-500 text-sm font-bold">✓</span>
            ) : (
                <span className={`text-[9px] font-black ${active ? 'text-[#7C3AED]' : 'text-gray-300'}`}>{label[0]}</span>
            )}
        </div>
        <span className={`text-[8px] font-black uppercase tracking-tight transition-colors ${active ? 'text-[#111]' : 'text-gray-400'}`}>{label}</span>
    </button>
);

const CoursePlayer: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [modules, setModules] = useState<Module[]>([]);
    const [activeModuleIndex, setActiveModuleIndex] = useState(0);
    const [moduleDetails, setModuleDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeStage, setActiveStage] = useState<'theory' | 'video' | 'quiz' | 'project'>('theory');
    const [initialLoad, setInitialLoad] = useState(true);
    const [lastLoadedModuleId, setLastLoadedModuleId] = useState<string | null>(null);

    // Quiz state
    const [quizAnswers, setQuizAnswers] = useState<number[][]>([]);
    const [quizResult, setQuizResult] = useState<any>(null);

    // Project state
    const [deployedLink, setDeployedLink] = useState('');
    const [githubLink, setGithubLink] = useState('');

    useEffect(() => {
        if (courseId) {
            fetchModules();
        }
    }, [courseId, user]);

    const fetchModules = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/courses/${courseId}/modules?user_id=${user?.uid}`);
            const data = await res.json();
            setModules(data);

            if (data.length > 0 && initialLoad) {
                const activeIndex = data.findIndex((m: any) => m.progress?.status !== 'locked');
                setActiveModuleIndex(activeIndex !== -1 ? activeIndex : 0);
                setInitialLoad(false);
                setLoading(false);
            } else if (data.length > 0) {
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (modules.length > 0) {
            fetchModuleDetails(modules[activeModuleIndex]._id);
        }
    }, [activeModuleIndex, modules]);

    const fetchModuleDetails = async (moduleId: string) => {
        const res = await fetch(`http://localhost:8000/api/modules/${moduleId}`);
        const data = await res.json();
        setModuleDetails(data);

        const prog = modules[activeModuleIndex].progress;

        if (moduleId !== lastLoadedModuleId) {
            if (!prog?.theory_completed) setActiveStage('theory');
            else if (!prog?.video_completed) setActiveStage('video');
            else if (prog?.quiz_score === undefined || prog?.quiz_score === null || prog?.quiz_score === 0) setActiveStage('quiz');
            else setActiveStage('project');
            setLastLoadedModuleId(moduleId);
        }

        // Restore answers if they exist
        if (prog?.quiz_answers && prog.quiz_answers.length > 0) {
            setQuizAnswers(prog.quiz_answers);
        } else {
            setQuizAnswers(data.quiz?.questions.map(() => []) || []);
        }

        if (prog?.quiz_score !== undefined && prog?.quiz_score !== null && prog?.quiz_score > 0) {
            setQuizResult({ score: prog.quiz_score, passed: prog.quiz_score >= 70 });
        } else {
            setQuizResult(null);
        }
    };

    const updateProgress = async (updates: any) => {
        await fetch('http://localhost:8000/api/progress/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user?.uid,
                course_id: courseId,
                module_id: modules[activeModuleIndex]._id,
                updates
            })
        });
        fetchModules();
    };

    const handleQuizSubmit = async () => {
        const res = await fetch('http://localhost:8000/api/quiz/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user?.uid,
                module_id: modules[activeModuleIndex]._id,
                answers: quizAnswers
            })
        });
        const data = await res.json();
        setQuizResult(data);
        // Always update progress to lock the attempt
        setTimeout(() => updateProgress({ quiz_score: data.score }), 1500);
    };

    const handleProjectSubmit = async () => {
        if (!deployedLink || !deployedLink.trim()) {
            alert('Deployed link is required!');
            return;
        }
        
        const res = await fetch('http://localhost:8000/api/project/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user?.uid,
                module_id: modules[activeModuleIndex]._id,
                deployed_link: deployedLink,
                github_link: githubLink || null
            })
        });
        if (res.ok) {
            updateProgress({ project_status: 'submitted' });
        }
    };

    if (loading) return (
        <div className="h-screen bg-white flex flex-col items-center justify-center font-sans overflow-hidden relative">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-[#7C3AED]/10 border-t-[#7C3AED] rounded-full"
            />
            <span className="mt-8 text-[11px] text-gray-400 uppercase tracking-[0.5em] font-black animate-pulse">Initializing Protocol</span>
        </div>
    );

    const currentModule = modules[activeModuleIndex];
    const progress = currentModule.progress;
    const overallProgress = Math.round(((modules.filter(m => m.progress?.status === 'completed').length) / modules.length) * 100);

    return (
        <div className="flex bg-[#F9FAFB] min-h-screen text-[#111827] font-sans selection:bg-[#7C3AED]/20 overflow-x-hidden">
            <aside className="w-72 fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-gray-100 flex flex-col p-6 shadow-sm">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/learn/courses')}
                        className="group flex items-center gap-3 mb-10 text-gray-400 hover:text-[#7C3AED] transition-all"
                    >
                        <span className="text-xl">←</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Course Hub</span>
                    </button>

                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-11 h-11 rounded-2xl bg-[#7C3AED] flex items-center justify-center shadow-xl shadow-[#7C3AED]/30">
                            <span className="text-white font-black text-sm">SL</span>
                        </div>
                        <div>
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Learning Path</h2>
                            <h3 className="text-lg font-black uppercase tracking-tighter leading-none">Curriculum</h3>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Mastery Level</span>
                            <span className="text-xs font-black text-[#7C3AED]">{overallProgress}%</span>
                        </div>
                        <ProgressBar progress={overallProgress} />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {modules.map((m, i) => (
                        <button
                            key={m._id}
                            onClick={() => m.progress?.status !== 'locked' && setActiveModuleIndex(i)}
                            className={`w-full group relative transition-all duration-500 rounded-3xl p-6 text-left border ${activeModuleIndex === i
                                ? 'bg-[#7C3AED] border-[#7C3AED] shadow-2xl shadow-[#7C3AED]/30'
                                : m.progress?.status === 'locked'
                                    ? 'opacity-40 grayscale pointer-events-none border-transparent'
                                    : 'bg-white border-gray-100 hover:border-[#7C3AED]/30 hover:bg-gray-50'
                                }`}
                        >
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-[8px] font-black tracking-[0.3em] ${activeModuleIndex === i ? 'text-white/60' : 'text-gray-400'}`}>PHASE {m.order_index < 10 ? `0${m.order_index}` : m.order_index}</span>
                                    {m.progress?.status === 'completed' && (
                                        <div className={`w-1.5 h-1.5 rounded-full ${activeModuleIndex === i ? 'bg-white' : 'bg-green-500'} shadow-lg`} />
                                    )}
                                </div>
                                <p className={`text-sm font-black uppercase tracking-tighter leading-tight mb-2 ${activeModuleIndex === i ? 'text-white' : 'text-gray-900'}`}>
                                    {m.title}
                                </p>
                                <span className={`text-[7px] font-bold uppercase tracking-widest ${activeModuleIndex === i ? 'text-white/50' : 'text-gray-400'}`}>{m.estimated_time} EST</span>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            <main className="flex-grow ml-72 p-8 lg:p-12 flex flex-col items-center overflow-x-hidden">
                <div className="w-full max-w-5xl">
                    <div className="sticky top-4 z-50 w-full flex justify-center mb-12">
                        <div className="bg-white/95 backdrop-blur-2xl border border-gray-100 rounded-[2.5rem] p-4 px-8 shadow-2xl shadow-gray-200/50 flex items-center justify-center">
                            <div className="flex items-center gap-6 lg:gap-10">
                                <SectionIndicator
                                    label="Theory"
                                    active={activeStage === 'theory'}
                                    completed={!!progress?.theory_completed}
                                    locked={false}
                                    onClick={() => setActiveStage('theory')}
                                />
                                <div className="w-8 lg:w-12 h-px bg-gray-100" />
                                <SectionIndicator
                                    label="Video"
                                    active={activeStage === 'video'}
                                    completed={!!progress?.video_completed}
                                    locked={!progress?.theory_completed}
                                    onClick={() => setActiveStage('video')}
                                />
                                <div className="w-8 lg:w-12 h-px bg-gray-100" />
                                <SectionIndicator
                                    label="Quiz"
                                    active={activeStage === 'quiz'}
                                    completed={progress?.quiz_score !== undefined && progress?.quiz_score !== null && progress.quiz_score > 0}
                                    locked={!progress?.video_completed}
                                    onClick={() => setActiveStage('quiz')}
                                />
                                <div className="w-8 lg:w-12 h-px bg-gray-100" />
                                <SectionIndicator
                                    label="Project"
                                    active={activeStage === 'project'}
                                    completed={progress?.project_status === 'submitted'}
                                    locked={progress?.quiz_score === undefined || progress?.quiz_score === null || progress.quiz_score === 0}
                                    onClick={() => setActiveStage('project')}
                                />
                            </div>
                        </div>
                    </div>

                    <header className="mb-16 text-center">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-8 h-px bg-[#7C3AED]" />
                            <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.4em]">Current Phase</span>
                            <div className="w-8 h-px bg-[#7C3AED]" />
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-tight max-w-4xl mx-auto">
                            {currentModule.title.split(' ').slice(0, -1).join(' ')} <span className="text-[#7C3AED]">{currentModule.title.split(' ').slice(-1)}</span>
                        </h1>
                    </header>

                    <AnimatePresence mode="wait">
                        {activeStage === 'theory' && (
                            <motion.div
                                key="theory"
                                initial={{ opacity: 0, scale: 0.98, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.02, y: -30 }}
                                className="space-y-12 pb-24"
                            >
                                <div className="bg-white border border-gray-100 rounded-[4rem] p-16 lg:p-24 shadow-2xl shadow-gray-200/50 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-12 font-black text-[9px] text-gray-100 uppercase tracking-[0.5em] rotate-90 origin-top-right">PROTOCOL_THEORY</div>
                                     <article className="prose prose-purple max-w-none text-gray-600 leading-relaxed text-xl">
                                         <ReactMarkdown
                                             components={{
                                                 h1: ({ node, ...props }) => <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 mb-8 mt-6" {...props} />,
                                                 h2: ({ node, ...props }) => <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-6 mt-12" {...props} />,
                                                 h3: ({ node, ...props }) => <h4 className="text-base font-black uppercase tracking-widest text-[#7C3AED] mb-4 mt-10" {...props} />,
                                                 p: ({ node, ...props }) => <p className="mb-6" {...props} />,
                                                 strong: ({ node, ...props }) => <strong className="text-gray-900 font-bold" {...props} />,
                                                 li: ({ node, ...props }) => <li className="mb-4 marker:text-[#7C3AED]" {...props} />,
                                                 code: ({ node, ...props }) => <code className="bg-gray-50 text-[#7C3AED] px-3 py-1 rounded-xl font-mono text-[16px] border border-gray-100" {...props} />
                                             }}
                                         >
                                             {moduleDetails?.theory?.markdown_content}
                                         </ReactMarkdown>
                                     </article>

                                     <div className="mt-24 pt-16 border-t border-gray-50 grid lg:grid-cols-2 gap-20">
                                         <div className="space-y-10">
                                             <header>
                                                 <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.4em] mb-3 block">Actionable Data</span>
                                                 <h4 className="text-xl font-black uppercase tracking-tight text-gray-900">Key Considerations</h4>
                                             </header>
                                             <div className="grid gap-4">
                                                 {moduleDetails?.theory?.key_takeaways.map((t: string, i: number) => (
                                                     <div key={i} className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-[#7C3AED]/20 hover:bg-white transition-all group">
                                                         <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]/30 group-hover:bg-[#7C3AED] transition-colors" />
                                                         <span className="text-sm text-gray-500 font-bold leading-tight">{t}</span>
                                                     </div>
                                                 ))}
                                             </div>
                                         </div>

                                         <div className="flex flex-col justify-end">
                                             <button
                                                 onClick={() => updateProgress({ theory_completed: true })}
                                                 className="w-full relative overflow-hidden py-9 bg-[#111827] text-white font-black text-[12px] uppercase tracking-[0.5em] rounded-[2.5rem] transition-all hover:scale-[1.03] shadow-2xl hover:bg-[#7C3AED]"
                                             >
                                                 <span className="relative z-10 transition-colors duration-500">
                                                     {progress?.theory_completed ? 'Content Mastered ✓' : 'Mark as Complete'}
                                                 </span>
                                             </button>
                                         </div>
                                     </div>
                                </div>
                            </motion.div>
                        )}

                        {activeStage === 'video' && (
                            <motion.div
                                key="video"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="w-full space-y-16"
                            >
                                <div className="aspect-video bg-gray-900 rounded-[4rem] overflow-hidden shadow-2xl shadow-gray-400/20 border-8 border-white relative group">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={moduleDetails?.video?.video_url}
                                        allowFullScreen
                                    ></iframe>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        onClick={() => updateProgress({ video_completed: true })}
                                        className="px-24 py-9 bg-[#7C3AED] text-white font-black text-[12px] uppercase tracking-[0.6em] rounded-[2.5rem] hover:bg-[#111827] transition-all duration-500 shadow-xl shadow-[#7C3AED]/20"
                                    >
                                        Seal Visual Session
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {activeStage === 'quiz' && (
                            <motion.div 
                                key="quiz" 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="w-full space-y-10 pb-24"
                            >
                                {moduleDetails?.quiz?.questions.map((q: any, i: number) => (
                                    <div key={i} className="bg-white border border-gray-100 p-16 rounded-[4rem] shadow-sm relative group overflow-hidden">
                                        <div className="flex items-center gap-6 mb-12">
                                            <span className="font-mono text-[9px] font-black text-[#7C3AED] tracking-[0.5em]">OBJECTIVE::0{i + 1}</span>
                                            <div className="h-px flex-grow bg-gray-50" />
                                        </div>

                                        <h4 className="text-3xl font-black text-gray-900 mb-12 uppercase tracking-tight leading-tight">{q.question}</h4>

                                        <div className="grid sm:grid-cols-2 gap-6">
                                            {q.options.map((opt: string, optIdx: number) => {
                                                const isSelected = quizAnswers[i]?.includes(optIdx);
                                                const isCorrect = q.correct_answers.includes(optIdx);
                                                const showFeedback = quizResult !== null;
                                                
                                                let borderColor = 'border-gray-50';
                                                let bgColor = 'bg-gray-50/30';
                                                let textColor = 'text-gray-400';
                                                
                                                if (showFeedback) {
                                                    if (isSelected && isCorrect) { borderColor = 'border-green-500'; bgColor = 'bg-green-50'; textColor = 'text-green-600'; }
                                                    else if (isSelected && !isCorrect) { borderColor = 'border-red-500'; bgColor = 'bg-red-50'; textColor = 'text-red-600'; }
                                                    else if (isCorrect) { borderColor = 'border-green-300'; bgColor = 'bg-green-50/30'; textColor = 'text-green-500'; }
                                                    else { borderColor = 'border-gray-50'; bgColor = 'bg-gray-50/10'; textColor = 'text-gray-300'; }
                                                } else if (isSelected) {
                                                    borderColor = 'border-[#7C3AED]';
                                                    bgColor = 'bg-[#7C3AED]/5';
                                                    textColor = 'text-[#7C3AED]';
                                                }

                                                return (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => {
                                                            if (quizResult) return; 
                                                            const newAns = [...quizAnswers];
                                                            const current = newAns[i] || [];
                                                            if (current.includes(optIdx)) {
                                                                newAns[i] = current.filter(idx => idx !== optIdx);
                                                            } else {
                                                                newAns[i] = [...current, optIdx];
                                                            }
                                                            setQuizAnswers(newAns);
                                                        }}
                                                        disabled={!!quizResult}
                                                        className={`p-10 text-left border-2 rounded-[2.5rem] transition-all duration-500 relative group overflow-hidden ${borderColor} ${bgColor}`}
                                                    >
                                                        <div className="relative z-10 flex items-center justify-between">
                                                            <span className={`text-[15px] font-bold tracking-tight uppercase ${textColor}`}>{opt}</span>
                                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-current border-current' : 'border-gray-200'}`}>
                                                                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        
                                        {quizResult && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-8 bg-gray-50 rounded-3xl border border-gray-100">
                                                <span className="text-[9px] font-black text-[#7C3AED] uppercase tracking-widest block mb-4">Verification Intelligence</span>
                                                <p className="text-gray-600 font-medium leading-relaxed">{q.explanation}</p>
                                            </motion.div>
                                        )}
                                    </div>
                                ))}

                                {!quizResult ? (
                                    <div className="flex justify-center pt-10">
                                        <button
                                            onClick={handleQuizSubmit}
                                            className="px-24 py-9 bg-[#111827] text-white font-black text-[12px] uppercase tracking-[0.6em] rounded-[2.5rem] hover:bg-[#7C3AED] transition-all duration-500 shadow-2xl hover:scale-105"
                                        >
                                            Evaluate Intelligence
                                        </button>
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }} 
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`p-16 rounded-[4rem] text-center border-4 ${quizResult.passed ? 'border-green-500 bg-green-50/30' : 'border-red-500 bg-red-50/30'}`}
                                    >
                                        <span className="text-[12px] font-black uppercase tracking-[0.4em] mb-6 block">Final Assessment Result</span>
                                        <div className="text-8xl font-black mb-6 tracking-tighter">
                                            {Math.round(quizResult.score)}<span className="text-4xl">%</span>
                                        </div>
                                        <p className={`text-xl font-bold uppercase tracking-widest ${quizResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                                            {quizResult.passed ? 'Phase Certification: Success' : 'Phase Certification: Insufficient Data'}
                                         </p>
                                         {quizResult.passed && (
                                             <button 
                                                 onClick={() => setActiveStage('project')}
                                                 className="mt-12 px-12 py-6 bg-[#111827] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#7C3AED] transition-all"
                                             >
                                                 Continue to Project Objective
                                             </button>
                                         )}
                                     </motion.div>
                                 )}
                            </motion.div>
                        )}

                        {activeStage === 'project' && (
                            <motion.div
                                key="project"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                className="w-full pb-24"
                            >
                                <div className="bg-white border border-gray-100 rounded-[5rem] p-24 relative overflow-hidden shadow-2xl shadow-gray-200/50">
                                    <div className="relative z-10 flex flex-col items-center">
                                        <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.8em] mb-12">Submission Phase</span>

                                        <h5 className="text-3xl sm:text-4xl font-black text-center text-gray-900 mb-12 uppercase tracking-tighter leading-none max-w-4xl">
                                            {moduleDetails?.project?.problem_statement}
                                        </h5>

                                        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mb-24">
                                            {moduleDetails?.project?.requirements.map((r: string, i: number) => (
                                                <div key={i} className="bg-gray-50 border border-transparent p-10 rounded-[3rem] flex items-start gap-6 group hover:border-[#7C3AED]/20 transition-all">
                                                    <div className="mt-1.5 w-2 h-2 rounded-full bg-[#7C3AED]" />
                                                    <span className="text-sm text-gray-500 font-black uppercase tracking-widest leading-relaxed text-left">{r}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="w-full max-w-2xl space-y-8 text-center">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-center gap-3">
                                                    <label className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.3em]">
                                                        Deployed Link
                                                    </label>
                                                    <span className="text-[8px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">Required</span>
                                                </div>
                                                <input
                                                    type="url"
                                                    placeholder="https://your-app.vercel.app or https://your-app.netlify.app"
                                                    value={deployedLink}
                                                    onChange={(e) => setDeployedLink(e.target.value)}
                                                    required
                                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] px-8 py-6 text-gray-900 font-bold text-center focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all shadow-inner placeholder:text-gray-300 placeholder:text-sm"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-center gap-3">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                                        GitHub Repository
                                                    </label>
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Optional</span>
                                                </div>
                                                <input
                                                    type="url"
                                                    placeholder="https://github.com/username/repo (optional)"
                                                    value={githubLink}
                                                    onChange={(e) => setGithubLink(e.target.value)}
                                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] px-8 py-6 text-gray-900 font-bold text-center focus:outline-none focus:border-gray-300 focus:bg-white transition-all shadow-inner placeholder:text-gray-300 placeholder:text-sm"
                                                />
                                            </div>

                                            <button
                                                onClick={handleProjectSubmit}
                                                className="w-full py-10 bg-[#7C3AED] text-white font-black text-[12px] uppercase tracking-[0.6em] rounded-[2.5rem] hover:bg-[#111827] shadow-xl shadow-[#7C3AED]/20 transition-all duration-700 hover:scale-[1.03]"
                                            >
                                                {progress?.project_status === 'submitted' ? 'Resubmit Links' : 'Finalize Project Deployment'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #7C3AED;
                }
            `}</style>
        </div>
    );
};

export default CoursePlayer;
