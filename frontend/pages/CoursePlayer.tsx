import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../apiConfig';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ChevronDown, ChevronLeft, ChevronRight, Play, FileText, HelpCircle,
  CheckCircle2, Menu, X, BookOpen, MessageCircle, Download, StickyNote,
  AlignLeft
} from 'lucide-react';
import './CoursePlayerStyles.css';

/* ═══════ Types ═══════ */
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
    review_status?: string;
  };
}

type LessonType = 'video' | 'theory' | 'quiz';

interface FlatLesson {
  moduleIndex: number;
  type: LessonType;
  label: string;
}

/* ═══════ Helpers ═══════ */
const extractCourseId = (slug?: string) => {
  if (!slug) return '';
  const parts = slug.split('--');
  return parts.length > 1 ? parts[parts.length - 1] : slug;
};

const getModuleProgress = (mod: Module): number => {
  const p = mod.progress;
  if (!p) return 0;
  let done = 0;
  if (p.video_completed) done++;
  if (p.theory_completed) done++;
  if (p.quiz_score >= 60 || p.status === 'completed') done++;
  return Math.round((done / 3) * 100);
};

const getLessonLabel = (type: LessonType): string => {
  if (type === 'video') return 'Video Lesson';
  if (type === 'theory') return 'Reading Material';
  return 'Assessment Quiz';
};

const DUMMY_TRANSCRIPT = [
  { time: '0:00', text: "Welcome back to this module. Today we'll explore the core concepts behind system architecture and design patterns." },
  { time: '0:45', text: "Let's start by understanding the fundamental building blocks. Every scalable system relies on a few essential principles." },
  { time: '1:30', text: "The first principle is separation of concerns. This ensures each component has a single, well-defined responsibility." },
  { time: '2:15', text: "Next, we'll look at fault tolerance — how systems recover gracefully when individual components fail." },
  { time: '3:00', text: "Finally, we'll discuss scalability vectors: horizontal vs vertical scaling and when to choose each approach." },
];

/* ═══════ Component ═══════ */
const CoursePlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [modules, setModules] = useState<Module[]>([]);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [moduleDetails, setModuleDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState<LessonType>('video');

  // Sidebar
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Right tools
  const [activeToolTab, setActiveToolTab] = useState<'notes' | 'transcript' | 'resources'>('notes');
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  // Quiz
  const [quizAnswers, setQuizAnswers] = useState<number[][]>([]);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [currentQuizQ, setCurrentQuizQ] = useState(0);

  // Project
  const [deployedLink, setDeployedLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [projectFile, setProjectFile] = useState<File | null>(null);

  // Completion modal
  const [completionPrompt, setCompletionPrompt] = useState<{
    open: boolean; nextIndex: number | null; moduleName: string;
  }>({ open: false, nextIndex: null, moduleName: '' });

  const resolvedCourseId = extractCourseId(courseId);
  const contentRef = useRef<HTMLDivElement>(null);

  /* ── Build flat lesson list ── */
  const buildLessons = (mods: Module[]): FlatLesson[] => {
    const list: FlatLesson[] = [];
    mods.forEach((_, i) => {
      list.push({ moduleIndex: i, type: 'video', label: 'Video Lesson' });
      list.push({ moduleIndex: i, type: 'theory', label: 'Reading Material' });
      list.push({ moduleIndex: i, type: 'quiz', label: 'Assessment Quiz' });
    });
    return list;
  };

  const flatLessons = buildLessons(modules);
  const currentFlatIndex = flatLessons.findIndex(
    l => l.moduleIndex === activeModuleIndex && l.type === activeStage
  );

  /* ── Data Fetching ── */
  useEffect(() => {
    if (resolvedCourseId) fetchModules();
  }, [resolvedCourseId, user]);

  const fetchModules = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses/${resolvedCourseId}/modules?user_id=${user?.uid || ''}`);
      const data = await res.json();
      let fetched = Array.isArray(data) ? data : [];
      if (fetched.length === 0) {
        fetched = [
          { _id: 'dummy-mod-1', title: 'Foundations & Architectures', order_index: 1, estimated_time: '2h 30m', progress: { status: 'unlocked', theory_completed: false, video_completed: false, quiz_score: 0, quiz_answers: [], project_status: 'pending', review_status: 'pending' } },
          { _id: 'dummy-mod-2', title: 'Advanced Implementations', order_index: 2, estimated_time: '3h 15m', progress: { status: 'locked', theory_completed: false, video_completed: false, quiz_score: 0, quiz_answers: [], project_status: 'pending' } },
          { _id: 'dummy-mod-3', title: 'Production Deployment', order_index: 3, estimated_time: '2h 45m', progress: { status: 'locked', theory_completed: false, video_completed: false, quiz_score: 0, quiz_answers: [], project_status: 'pending' } },
          { _id: 'dummy-mod-4', title: 'Testing & CI/CD Pipelines', order_index: 4, estimated_time: '1h 50m', progress: { status: 'locked', theory_completed: false, video_completed: false, quiz_score: 0, quiz_answers: [], project_status: 'pending' } },
        ];
      }
      setModules(fetched);
      setLoading(false);
      return fetched;
    } catch {
      setModules([]);
      setLoading(false);
      return [];
    }
  };

  useEffect(() => {
    if (modules.length > 0) fetchModuleDetails(modules[activeModuleIndex]._id);
  }, [activeModuleIndex, modules]);

  const fetchModuleDetails = async (moduleId: string) => {
    let data: any = {};
    if (moduleId.startsWith('dummy-mod')) {
      data = {
        theory: {
          markdown_content: "# System Architectures & Frameworks\n\nWelcome to the simulated track.\n\n## Subsystem Overview\n\n1. Component isolation\n2. Fault tolerance parameters\n3. Scalability vectors\n\n> **Note:** Understanding these metrics is critical for successful system initialization.\n\n## Design Patterns\n\n### Microservices\nBreak monoliths into independently deployable services.\n\n### Event-Driven Architecture\nUse message queues and event buses for loose coupling.\n\n| Pattern | Use Case | Complexity |\n|---------|----------|------------|\n| MVC | Web apps | Low |\n| CQRS | High-read systems | Medium |\n| Event Sourcing | Audit trails | High |\n\n```python\ndef initialize_system(config):\n    services = load_services(config)\n    for svc in services:\n        svc.start()\n    return SystemStatus.READY\n```\n\nUnderstand the metrics and variables for successful initialization.",
          key_takeaways: ["Understand system boundaries", "Deploy fault-tolerant systems", "End-to-end telemetry mapping"]
        },
        video: { video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        quiz: {
          questions: [
            { question: "What primarily drives system latency here?", options: ["Bandwidth", "Distance", "Processing Overhead", "All of the above"], correct_answers: [3], explanation: "All elements heavily impact latency." },
            { question: "Which protocol is connection-oriented?", options: ["UDP", "TCP", "ICMP", "IP"], correct_answers: [1], explanation: "TCP guarantees reliable delivery." },
            { question: "What does CAP theorem state about distributed systems?", options: ["You can have all three guarantees", "You can only pick two of Consistency, Availability, Partition tolerance", "It only applies to databases", "It was disproven"], correct_answers: [1], explanation: "CAP theorem states you must choose two out of three." },
          ]
        },
        project: { problem_statement: "Deploy a foundational analytics service proxy.", requirements: ["Implement basic rate limiting", "Route dynamic health-checks", "Ensure secure CORS headers"] }
      };
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/api/modules/${moduleId}`);
        if (res.ok) data = await res.json();
      } catch {}
    }
    setModuleDetails(data);

    const prog = modules[activeModuleIndex].progress;
    if (!prog?.video_completed) setActiveStage('video');
    else if (!prog?.theory_completed) setActiveStage('theory');
    else setActiveStage('quiz');

    if (prog?.quiz_answers?.length) setQuizAnswers(prog.quiz_answers);
    else setQuizAnswers(data.quiz?.questions.map(() => []) || []);

    if (prog?.quiz_score && prog.quiz_score > 0) {
      setQuizResult({ score: prog.quiz_score, passed: prog.quiz_score >= 60 });
    } else {
      setQuizResult(null);
    }
    setCurrentQuizQ(0);
  };

  /* ── Progress Updates ── */
  const updateProgress = async (updates: any) => {
    if (modules[activeModuleIndex]._id.startsWith('dummy-mod')) {
      const updated = [...modules];
      const cur = updated[activeModuleIndex];
      if (!cur.progress) cur.progress = { status: 'unlocked', theory_completed: false, video_completed: false, quiz_score: 0, quiz_answers: [], project_status: 'pending', review_status: 'pending' };
      Object.assign(cur.progress, updates);
      if (updates.status === 'completed' || updates.project_status === 'submitted' || updates.quiz_score >= 60) {
        cur.progress.status = 'completed';
        if (activeModuleIndex + 1 < updated.length) {
          if (!updated[activeModuleIndex + 1].progress) updated[activeModuleIndex + 1].progress = {} as any;
          updated[activeModuleIndex + 1].progress!.status = 'unlocked';
        }
      }
      setModules(updated);
      return;
    }
    await fetch(`${API_BASE_URL}/api/progress/update`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user?.uid, course_id: resolvedCourseId, module_id: modules[activeModuleIndex]._id, updates })
    });
    fetchModules();
  };

  /* ── Quiz ── */
  const handleQuizSubmit = async () => {
    let score = 0;
    let data: any = {};
    if (modules[activeModuleIndex]._id.startsWith('dummy-mod')) {
      let correct = 0;
      const qs = moduleDetails?.quiz?.questions || [];
      qs.forEach((q: any, i: number) => {
        const sel = quizAnswers[i] || [];
        const ans = q.correct_answers || [];
        if (sel.length === ans.length && sel.every((v: number) => ans.includes(v))) correct++;
      });
      score = Math.round((correct / Math.max(qs.length, 1)) * 100);
      data = { score, passed: score >= 60 };
    } else {
      const res = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.uid, module_id: modules[activeModuleIndex]._id, answers: quizAnswers })
      });
      data = await res.json();
      score = data.score;
    }
    setQuizResult(data);
    setTimeout(() => updateProgress({ quiz_score: score, quiz_answers: quizAnswers }), 500);
  };

  /* ── Navigation ── */
  const goToPrevLesson = () => {
    if (currentFlatIndex <= 0) return;
    const prev = flatLessons[currentFlatIndex - 1];
    if (prev.moduleIndex !== activeModuleIndex) setActiveModuleIndex(prev.moduleIndex);
    setActiveStage(prev.type);
    scrollContentTop();
  };

  const goToNextLesson = () => {
    if (currentFlatIndex >= flatLessons.length - 1) return;
    const next = flatLessons[currentFlatIndex + 1];
    if (next.moduleIndex !== activeModuleIndex) setActiveModuleIndex(next.moduleIndex);
    setActiveStage(next.type);
    scrollContentTop();
  };

  const scrollContentTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleModule = (idx: number) => {
    const s = new Set(expandedModules);
    s.has(idx) ? s.delete(idx) : s.add(idx);
    setExpandedModules(s);
  };

  const selectLesson = (modIdx: number, type: LessonType) => {
    const mod = modules[modIdx];
    setActiveModuleIndex(modIdx);
    setActiveStage(type);
    setSidebarOpen(false);
    scrollContentTop();
    const s = new Set(expandedModules);
    s.add(modIdx);
    setExpandedModules(s);
  };

  const handleMarkComplete = async () => {
    if (activeStage === 'video') {
      await updateProgress({ video_completed: true });
      goToNextLesson();
    } else if (activeStage === 'theory') {
      await updateProgress({ theory_completed: true });
      goToNextLesson();
    }
  };

  const isLessonComplete = (modIdx: number, type: LessonType): boolean => {
    const p = modules[modIdx]?.progress;
    if (!p) return false;
    if (type === 'video') return !!p.video_completed;
    if (type === 'theory') return !!p.theory_completed;
    return (p.quiz_score || 0) > 0;
  };

  const isCurrentLessonComplete = isLessonComplete(activeModuleIndex, activeStage);
  const currentModule = modules[activeModuleIndex];
  
  // Calculate more granular overall progress by summing all individual module progress percentages
  const overallProgress = modules.length > 0 
    ? Math.round((modules.reduce((acc, m) => acc + getModuleProgress(m), 0)) / modules.length)
    : 0;

  const currentLessonTitle = currentModule
    ? `${currentModule.title} — ${getLessonLabel(activeStage)}`
    : 'Loading...';

  /* ═══════ Render ═══════ */
  if (courseId && !courseId.toLowerCase().includes('generative-ai')) {
    return (
      <div className="cp-shell" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🚀</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#111827', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Course to be launched soon!</h1>
          <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>We are currently crafting high-quality visual and practical content for this track. It will be live very soon.</p>
          <button 
            onClick={() => navigate('/learn/courses')}
            style={{ marginTop: 32, padding: '14px 32px', background: '#111827', color: '#fff', borderRadius: 99, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 13, border: 'none', cursor: 'pointer' }}
          >
            Return to Courses
          </button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="cp-loading">
      <div className="cp-spinner" />
      <span className="cp-loading-text">Loading course...</span>
    </div>
  );

  if (!modules.length) return (
    <div className="cp-empty">
      <h2>No Modules Found</h2>
      <p>This course doesn't have any content yet. Please check back later.</p>
      <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
    </div>
  );

  return (
    <div className="cp-shell">
      {/* Mobile Toggle */}
      <button className="cp-mobile-toggle" onClick={() => setSidebarOpen(true)}>
        <Menu size={20} />
      </button>
      <div className={`cp-mobile-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* ══════ LEFT SIDEBAR ══════ */}
      <aside className={`cp-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="cp-sidebar-header">
          <button className="cp-sidebar-back" onClick={() => navigate('/learn/courses')}>
            <ChevronLeft size={16} /> Back to courses
          </button>
          <div className="cp-sidebar-title">Course Curriculum</div>
          <div className="cp-sidebar-progress-wrap">
            <div className="cp-sidebar-progress-bar">
              <div className="cp-sidebar-progress-fill" style={{ width: `${overallProgress}%` }} />
            </div>
            <span className="cp-sidebar-progress-text">{overallProgress}%</span>
          </div>
        </div>

        <div className="cp-sidebar-modules">
          {modules.map((mod, modIdx) => {
            const isExpanded = expandedModules.has(modIdx);
            const isLocked = false;
            const isCompleted = mod.progress?.status === 'completed';
            const modProgress = getModuleProgress(mod);
            const lessons: LessonType[] = ['video', 'theory', 'quiz'];

            return (
              <div key={mod._id} className="cp-module-group" style={{ opacity: isLocked ? 0.45 : 1 }}>
                <button className="cp-module-header" onClick={() => !isLocked && toggleModule(modIdx)}>
                  <div className="cp-module-header-left">
                    <div className={`cp-module-number ${isCompleted ? 'completed' : modIdx === activeModuleIndex ? 'active' : ''}`}>
                      {isCompleted ? <CheckCircle2 size={14} /> : mod.order_index}
                    </div>
                    <div className="cp-module-info">
                      <div className="cp-module-name">{mod.title}</div>
                      <div className="cp-module-meta">
                        {`${mod.estimated_time} · 3 lessons`}
                      </div>
                    </div>
                  </div>
                  {!isLocked && <ChevronDown size={16} className={`cp-module-chevron ${isExpanded ? 'open' : ''}`} />}
                </button>

                {!isLocked && modProgress > 0 && modProgress < 100 && (
                  <div className="cp-module-progress-mini">
                    <div className="cp-module-progress-mini-fill" style={{ width: `${modProgress}%` }} />
                  </div>
                )}

                {isExpanded && !isLocked && (
                  <div className="cp-lesson-list">
                    {lessons.map(type => {
                      const isActive = modIdx === activeModuleIndex && activeStage === type;
                      const done = isLessonComplete(modIdx, type);
                      const Icon = type === 'video' ? Play : type === 'theory' ? FileText : HelpCircle;
                      return (
                        <button
                          key={type}
                          className={`cp-lesson-item ${isActive ? 'active' : ''} ${done ? 'completed' : ''}`}
                          onClick={() => selectLesson(modIdx, type)}
                        >
                          <Icon size={16} className="cp-lesson-icon" />
                          <span className="cp-lesson-name">{getLessonLabel(type)}</span>
                          {done ? (
                            <div className="cp-lesson-check done"><CheckCircle2 size={10} /></div>
                          ) : (
                            <div className="cp-lesson-check" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ══════ MAIN + RIGHT ══════ */}
      <div className="cp-main">
        {/* Top Bar */}
        <div className="cp-topbar">
          <div className="cp-topbar-left">
            <span className="cp-topbar-lesson-title">{currentLessonTitle}</span>
          </div>
          <div className="cp-topbar-right">
            {activeStage !== 'quiz' && (
              <button
                className={`cp-topbar-btn ${isCurrentLessonComplete ? 'completed-btn' : 'primary'}`}
                onClick={handleMarkComplete}
                disabled={isCurrentLessonComplete}
              >
                <CheckCircle2 size={15} />
                {isCurrentLessonComplete ? 'Completed' : 'Mark Complete'}
              </button>
            )}
          </div>
        </div>

        {/* Content + Right Sidebar Wrapper */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Main Content Area */}
          <div className="cp-content-area" ref={contentRef} style={{ flex: 1 }}>
            <AnimatePresence mode="wait">
              {/* ── VIDEO ── */}
              {activeStage === 'video' && (
                <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="cp-video-container">
                    {moduleDetails?.video?.video_url ? (
                      <iframe
                        src={moduleDetails.video.video_url}
                        title="Course Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <div className="cp-video-unavailable">
                        <span>Video content unavailable</span>
                      </div>
                    )}
                  </div>
                  <div className="cp-lesson-info">
                    <h1>{currentModule.title} — Video Lesson</h1>
                    <p>Watch this video lecture to understand the core concepts covered in this module. Take notes using the panel on the right for better retention.</p>
                  </div>
                </motion.div>
              )}

              {/* ── THEORY ── */}
              {activeStage === 'theory' && (
                <motion.div key="theory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="cp-text-lesson">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
                        h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
                        h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
                        p: ({ children, ...props }) => <p {...props}>{children}</p>,
                        blockquote: ({ children, ...props }) => <blockquote {...props}>{children}</blockquote>,
                        pre: ({ children, ...props }) => <pre {...props}>{children}</pre>,
                        code: ({ className, children, ...props }) => {
                          const isInline = !className;
                          if (isInline) return <code {...props}>{children}</code>;
                          return <code className={className} {...props}>{children}</code>;
                        },
                        table: ({ children, ...props }) => <table {...props}>{children}</table>,
                        thead: ({ children, ...props }) => <thead {...props}>{children}</thead>,
                        tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
                        th: ({ children, ...props }) => <th {...props}>{children}</th>,
                        td: ({ children, ...props }) => <td {...props}>{children}</td>,
                      }}
                    >
                      {moduleDetails?.theory?.markdown_content || ''}
                    </ReactMarkdown>

                    {moduleDetails?.theory?.key_takeaways?.length > 0 && (
                      <div style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid #e8e8ed' }}>
                        <h3 style={{ color: '#111827', fontWeight: 700, marginBottom: 16 }}>Key Takeaways</h3>
                        {moduleDetails.theory.key_takeaways.map((t: string, i: number) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                            <CheckCircle2 size={16} style={{ color: '#10b981', marginTop: 2, flexShrink: 0 }} />
                            <span style={{ fontSize: 15, color: '#374151' }}>{t}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── QUIZ ── */}
              {activeStage === 'quiz' && (
                <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="cp-quiz-container">
                    {!quizResult ? (
                      <>
                        <div className="cp-quiz-header">
                          <h2>Module Assessment</h2>
                          <div className="cp-quiz-progress-text">
                            Question {currentQuizQ + 1} of {moduleDetails?.quiz?.questions?.length || 0}
                          </div>
                          <div className="cp-quiz-progress-bar">
                            <div className="cp-quiz-progress-fill" style={{
                              width: `${((currentQuizQ + 1) / (moduleDetails?.quiz?.questions?.length || 1)) * 100}%`
                            }} />
                          </div>
                        </div>

                        {moduleDetails?.quiz?.questions?.map((q: any, qIdx: number) => (
                          <div key={qIdx} style={{ display: qIdx === currentQuizQ ? 'block' : 'none' }}>
                            <div className="cp-quiz-question">
                              <div className="cp-quiz-question-text">{q.question}</div>
                              <div className="cp-quiz-options">
                                {q.options.map((opt: string, optIdx: number) => {
                                  const isSelected = quizAnswers[qIdx]?.includes(optIdx);
                                  return (
                                    <button
                                      key={optIdx}
                                      className={`cp-quiz-option ${isSelected ? 'selected' : ''}`}
                                      onClick={() => {
                                        const newAns = [...quizAnswers];
                                        newAns[qIdx] = [optIdx];
                                        setQuizAnswers(newAns);
                                      }}
                                    >
                                      <div className="cp-quiz-radio">
                                        {isSelected && <div className="cp-quiz-radio-dot" />}
                                      </div>
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                              <button
                                className="cp-bottom-nav-btn"
                                disabled={currentQuizQ === 0}
                                onClick={() => setCurrentQuizQ(Math.max(0, currentQuizQ - 1))}
                              >
                                <ChevronLeft size={16} /> Previous
                              </button>
                              {currentQuizQ < (moduleDetails?.quiz?.questions?.length || 1) - 1 ? (
                                <button
                                  className="cp-bottom-nav-btn next"
                                  onClick={() => setCurrentQuizQ(currentQuizQ + 1)}
                                  disabled={!quizAnswers[qIdx]?.length}
                                >
                                  Next <ChevronRight size={16} />
                                </button>
                              ) : (
                                <div className="cp-quiz-submit">
                                  <button
                                    onClick={handleQuizSubmit}
                                    disabled={quizAnswers.some(a => !a?.length)}
                                  >
                                    Submit Answers
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div>
                        <div className={`cp-quiz-result ${quizResult.passed ? 'passed' : 'failed'}`}>
                          <div className="cp-quiz-result-score">{Math.round(quizResult.score)}%</div>
                          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                            {quizResult.passed ? 'Assessment Passed!' : 'Did not pass'}
                          </div>
                          <p style={{ fontSize: 14, color: '#6b7280' }}>
                            {quizResult.passed
                              ? 'Congratulations! Great work! You can proceed to the next module.'
                              : 'You need 60% to pass. Review the material and try again.'}
                          </p>
                        </div>

                        {/* Show answers with feedback */}
                        <div style={{ marginTop: 32 }}>
                          {moduleDetails?.quiz?.questions?.map((q: any, qIdx: number) => {
                            const selected = quizAnswers[qIdx] || [];
                            return (
                              <div key={qIdx} style={{ marginBottom: 28 }}>
                                <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 12 }}>
                                  {qIdx + 1}. {q.question}
                                </div>
                                {q.options.map((opt: string, optIdx: number) => {
                                  const isSel = selected.includes(optIdx);
                                  const isCorrect = q.correct_answers.includes(optIdx);
                                  let cls = 'cp-quiz-option';
                                  if (isSel && isCorrect) cls += ' correct';
                                  else if (isSel && !isCorrect) cls += ' incorrect';
                                  else if (isCorrect) cls += ' show-correct';
                                  return (
                                    <div key={optIdx} className={cls} style={{ cursor: 'default', marginBottom: 6 }}>
                                      <div className="cp-quiz-radio">
                                        {(isSel || isCorrect) && <div className="cp-quiz-radio-dot" />}
                                      </div>
                                      {opt}
                                    </div>
                                  );
                                })}
                                <div className="cp-quiz-explanation">{q.explanation}</div>
                              </div>
                            );
                          })}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
                          {quizResult.passed ? (
                            <button
                              className="cp-bottom-nav-btn next"
                              onClick={() => {
                                const nextIdx = activeModuleIndex + 1;
                                if (nextIdx < modules.length) {
                                  setCompletionPrompt({ open: true, nextIndex: nextIdx, moduleName: currentModule.title });
                                } else {
                                  setCompletionPrompt({ open: true, nextIndex: null, moduleName: currentModule.title });
                                }
                              }}
                            >
                              {activeModuleIndex + 1 < modules.length ? 'Next Module' : 'Complete Course'}
                              <ChevronRight size={16} />
                            </button>
                          ) : (
                            <button
                              className="cp-bottom-nav-btn"
                              onClick={() => {
                                setQuizResult(null);
                                setQuizAnswers(moduleDetails?.quiz?.questions.map(() => []) || []);
                                setCurrentQuizQ(0);
                                setActiveStage('video');
                                updateProgress({ theory_completed: false, video_completed: false, quiz_score: 0, quiz_answers: [] });
                              }}
                            >
                              Retry Module
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ══════ RIGHT SIDEBAR ══════ */}
          <div className="cp-tools-sidebar">
            <div className="cp-tools-tabs">
              <button
                className={`cp-tools-tab ${activeToolTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveToolTab('notes')}
              >
                <StickyNote size={13} style={{ display: 'inline', marginRight: 4 }} /> Notes
              </button>
              <button
                className={`cp-tools-tab ${activeToolTab === 'transcript' ? 'active' : ''}`}
                onClick={() => setActiveToolTab('transcript')}
              >
                <AlignLeft size={13} style={{ display: 'inline', marginRight: 4 }} /> Transcript
              </button>
              <button
                className={`cp-tools-tab ${activeToolTab === 'resources' ? 'active' : ''}`}
                onClick={() => setActiveToolTab('resources')}
              >
                <BookOpen size={13} style={{ display: 'inline', marginRight: 4 }} /> Resources
              </button>
            </div>

            <div className="cp-tools-content">
              {activeToolTab === 'notes' && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 10 }}>
                    Your notes for this lesson
                  </div>
                  <textarea
                    className="cp-notes-area"
                    placeholder="Type your notes here..."
                    value={notes}
                    onChange={e => { setNotes(e.target.value); setNotesSaved(false); }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button className="cp-notes-save-btn" onClick={() => setNotesSaved(true)}>
                      Save Notes
                    </button>
                    {notesSaved && (
                      <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>✓ Saved</span>
                    )}
                  </div>
                </div>
              )}

              {activeToolTab === 'transcript' && (
                <div className="cp-transcript-block">
                  {activeStage === 'video' ? (
                    DUMMY_TRANSCRIPT.map((seg, i) => (
                      <div key={i} style={{ marginBottom: 16 }}>
                        <span className="cp-transcript-timestamp">{seg.time}</span>
                        {seg.text}
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', padding: 40 }}>
                      Transcript is only available for video lessons.
                    </div>
                  )}
                </div>
              )}

              {activeToolTab === 'resources' && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 12 }}>
                    Downloadable Materials
                  </div>
                  <a href="#" className="cp-resource-item" style={{ textDecoration: 'none' }}>
                    <Download size={16} style={{ color: '#7C3AED' }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Lecture Slides</div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>PDF · 2.4 MB</div>
                    </div>
                  </a>
                  <a href="#" className="cp-resource-item" style={{ textDecoration: 'none' }}>
                    <Download size={16} style={{ color: '#7C3AED' }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Code Starter Kit</div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>ZIP · 890 KB</div>
                    </div>
                  </a>
                  <a href="#" className="cp-resource-item" style={{ textDecoration: 'none' }}>
                    <Download size={16} style={{ color: '#7C3AED' }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Cheat Sheet</div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>PDF · 420 KB</div>
                    </div>
                  </a>
                  <button className="cp-ask-btn">
                    <MessageCircle size={18} />
                    Ask a question about this lesson
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="cp-bottom-nav">
          <button className="cp-bottom-nav-btn" onClick={goToPrevLesson} disabled={currentFlatIndex <= 0}>
            <ChevronLeft size={16} /> Previous Lesson
          </button>

          <div className="cp-bottom-progress">
            <div className="cp-bottom-progress-bar">
              <div className="cp-bottom-progress-fill" style={{ width: `${overallProgress}%` }} />
            </div>
            <span className="cp-bottom-progress-text">{overallProgress}% complete</span>
          </div>

          <button
            className="cp-bottom-nav-btn next"
            onClick={goToNextLesson}
            disabled={currentFlatIndex >= flatLessons.length - 1}
          >
            Next Lesson <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ══════ COMPLETION MODAL ══════ */}
      <AnimatePresence>
        {completionPrompt.open && (
          <motion.div
            className="cp-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="cp-modal"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            >
              <div className="cp-modal-emoji">🎉</div>
              <h3>Congratulations!</h3>
              <p>You have successfully completed <strong>{completionPrompt.moduleName}</strong>.</p>
              {completionPrompt.nextIndex !== null ? (
                <button
                  className="cp-modal-primary"
                  onClick={() => {
                    setCompletionPrompt({ open: false, nextIndex: null, moduleName: '' });
                    setActiveModuleIndex(completionPrompt.nextIndex as number);
                    setActiveStage('video');
                    setQuizResult(null);
                    const s = new Set(expandedModules);
                    s.add(completionPrompt.nextIndex as number);
                    setExpandedModules(s);
                    scrollContentTop();
                  }}
                >
                  Go to Next Module →
                </button>
              ) : (
                <button
                  className="cp-modal-secondary"
                  onClick={() => setCompletionPrompt({ open: false, nextIndex: null, moduleName: '' })}
                >
                  All Modules Completed ✓
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursePlayer;
