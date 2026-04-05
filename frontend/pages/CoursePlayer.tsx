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
  lessons?: any[];
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
type CourseEndStep = 'modules' | 'capstone' | 'final_quiz' | 'project_submit';

interface FlatLesson {
  moduleIndex: number;
  type: LessonType;
  label: string;
}

type QuizQuestion = {
  question: string;
  options: string[];
  correct_answers: number[];
  explanation?: string;
};

type FinalAssessment = {
  questions: QuizQuestion[];
  pass_mark?: number;
  title?: string;
};

type CourseEndProgress = {
  capstone_completed: boolean;
  final_quiz_score?: number;
  final_quiz_passed?: boolean;
  final_quiz_answers?: number[][];
  project_status?: string;
  review_status?: string;
  github_link?: string;
  deployed_link?: string;
};

/* ═══════ Helpers ═══════ */
const extractCourseId = (slug?: string) => {
  if (!slug) return '';
  const parts = slug.split('--');
  return parts.length > 1 ? parts[parts.length - 1] : slug;
};

const getModuleProgress = (mod: Module): number => {
  const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
  const hasConfiguredLessons = lessons.length > 0;
  const hasVideo = hasConfiguredLessons ? lessons.some((l: any) => l?.type === 'video') : true;
  const hasTheory = hasConfiguredLessons ? lessons.some((l: any) => l?.type === 'text' || l?.type === 'code') : true;
  const hasQuiz = hasConfiguredLessons ? lessons.some((l: any) => l?.type === 'quiz') : true;
  const total = [hasVideo, hasTheory, hasQuiz].filter(Boolean).length || 1;

  const p = mod.progress;
  if (!p) return 0;
  let done = 0;
  if (hasVideo && p.video_completed) done++;
  if (hasTheory && p.theory_completed) done++;
  if (hasQuiz && (p.quiz_score >= 60 || p.status === 'completed')) done++;
  return Math.round((done / total) * 100);
};

const getLessonLabel = (type: LessonType): string => {
  if (type === 'video') return 'Video Lesson';
  if (type === 'theory') return 'Reading Material';
  return 'Assessment Quiz';
};

const normalizeYouTubeUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url;
};

const normalizeExternalUrl = (url: string): string => {
  const value = (url || '').trim();
  if (!value) return '';
  if (/^data:/i.test(value)) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  if (/^www\./i.test(value)) return `https://${value}`;
  return value;
};

const isLikelyImageSrc = (value: string): boolean => {
  if (!value) return false;
  return /^data:image\//i.test(value)
    || /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(value)
    || /images\.unsplash\.com|imgur\.com|cloudinary\.com/i.test(value);
};

const getLessonForStage = (module: Module | undefined, stage: LessonType) => {
  const lessons = Array.isArray(module?.lessons) ? module!.lessons : [];
  if (stage === 'video') {
    return lessons.find((l: any) => l?.type === 'video') || null;
  }
  if (stage === 'theory') {
    return lessons.find((l: any) => l?.type === 'text' || l?.type === 'code') || null;
  }
  return lessons.find((l: any) => l?.type === 'quiz') || null;
};

const getAvailableStagesForModule = (module: Module | undefined): LessonType[] => {
  const lessons = Array.isArray(module?.lessons) ? module!.lessons : [];
  if (lessons.length === 0) return [];

  const stages: LessonType[] = [];
  if (lessons.some((l: any) => l?.type === 'video')) stages.push('video');
  if (lessons.some((l: any) => l?.type === 'text' || l?.type === 'code')) stages.push('theory');
  if (lessons.some((l: any) => l?.type === 'quiz')) stages.push('quiz');
  return stages;
};

const getQuizQuestionsFromLesson = (lesson: any): QuizQuestion[] => {
  if (!lesson || lesson.type !== 'quiz') return [];
  const options = Array.isArray(lesson.quiz_options) ? lesson.quiz_options.slice(0, 4) : [];
  while (options.length < 4) options.push('');
  return [{
    question: lesson.quiz_question || 'Quiz question',
    options,
    correct_answers: [typeof lesson.quiz_correct_index === 'number' ? lesson.quiz_correct_index : 0],
    explanation: lesson.quiz_explanation || ''
  }];
};

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
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop sidebar collapse

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
  const [projectSubmitState, setProjectSubmitState] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  const [projectSubmitMessage, setProjectSubmitMessage] = useState('');

  // Course-end flow
  const [courseEndStep, setCourseEndStep] = useState<CourseEndStep>('modules');
  const [capstoneAccepted, setCapstoneAccepted] = useState(false);
  const [finalAssessment, setFinalAssessment] = useState<FinalAssessment>({ questions: [], pass_mark: 60 });
  const [finalQuizAnswers, setFinalQuizAnswers] = useState<number[][]>([]);
  const [finalQuizResult, setFinalQuizResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [currentFinalQuizQ, setCurrentFinalQuizQ] = useState(0);
  const [courseEndProgress, setCourseEndProgress] = useState<CourseEndProgress | null>(null);

  // Completion modal
  const [completionPrompt, setCompletionPrompt] = useState<{
    open: boolean; nextIndex: number | null; moduleName: string;
  }>({ open: false, nextIndex: null, moduleName: '' });

  const resolvedCourseId = extractCourseId(courseId);
  const contentRef = useRef<HTMLDivElement>(null);

  /* ── Build flat lesson list ── */
  const buildLessons = (mods: Module[]): FlatLesson[] => {
    const list: FlatLesson[] = [];
    mods.forEach((mod, i) => {
      const stages = getAvailableStagesForModule(mod);
      stages.forEach((type) => {
        list.push({ moduleIndex: i, type, label: getLessonLabel(type) });
      });
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

  useEffect(() => {
    if (!resolvedCourseId) return;
    fetchFinalAssessment();
  }, [resolvedCourseId]);

  useEffect(() => {
    if (!resolvedCourseId || !user?.uid) return;
    fetchCourseEndProgress();
  }, [resolvedCourseId, user?.uid]);

  const fetchModules = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses/${resolvedCourseId}/modules?user_id=${user?.uid || ''}`);
      const data = await res.json();
      const fetched = Array.isArray(data) ? data : [];
      setModules(fetched);
      setLoading(false);
      return fetched;
    } catch {
      setModules([]);
      setLoading(false);
      return [];
    }
  };

  const fetchFinalAssessment = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses/${resolvedCourseId}/final-assessment`);
      if (!res.ok) {
        setFinalAssessment({ questions: [], pass_mark: 60 });
        return;
      }
      const data = await res.json();
      const questions = Array.isArray(data?.questions) ? data.questions : [];
      const passMark = typeof data?.pass_mark === 'number' ? data.pass_mark : 60;
      setFinalAssessment({ questions, pass_mark: passMark, title: data?.title });
      setFinalQuizAnswers(questions.map(() => []));
      setFinalQuizResult(null);
      setCurrentFinalQuizQ(0);
    } catch {
      setFinalAssessment({ questions: [], pass_mark: 60 });
    }
  };

  const fetchCourseEndProgress = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/course-end/progress?course_id=${resolvedCourseId}&user_id=${user?.uid}`);
      if (!res.ok) {
        setCourseEndProgress(null);
        return;
      }
      const data = await res.json();
      setCourseEndProgress(data);
      setCapstoneAccepted(!!data?.capstone_completed);
      if (typeof data?.final_quiz_score === 'number') {
        setFinalQuizResult({ score: data.final_quiz_score, passed: !!data?.final_quiz_passed });
      }
      if (Array.isArray(data?.final_quiz_answers)) {
        setFinalQuizAnswers(data.final_quiz_answers);
      }
      if (typeof data?.github_link === 'string' && data.github_link) setGithubLink(data.github_link);
      if (typeof data?.deployed_link === 'string' && data.deployed_link) setDeployedLink(data.deployed_link);
      if (data?.project_status === 'submitted') {
        setProjectSubmitState('submitted');
        setProjectSubmitMessage('Project already submitted. Our team will review it.');
      }
    } catch {
      setCourseEndProgress(null);
    }
  };

  const saveCourseEndProgress = async (updates: Record<string, any>) => {
    if (!user?.uid || !resolvedCourseId) return;
    try {
      await fetch(`${API_BASE_URL}/api/course-end/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.uid, course_id: resolvedCourseId, updates })
      });
    } catch {
      // best-effort persistence
    }
  };

  useEffect(() => {
    if (modules.length > 0) fetchModuleDetails(modules[activeModuleIndex]._id);
  }, [activeModuleIndex, modules]);

  const allModulesCompleted = modules.length > 0 && modules.every((m) => getModuleProgress(m) >= 100);

  useEffect(() => {
    if (!allModulesCompleted) return;
    if (courseEndStep === 'modules') {
      if (courseEndProgress?.project_status === 'submitted') {
        setCourseEndStep('project_submit');
      } else if (courseEndProgress?.final_quiz_passed) {
        setCourseEndStep('project_submit');
      } else if (courseEndProgress?.capstone_completed) {
        setCourseEndStep('final_quiz');
      } else {
        setCourseEndStep('capstone');
      }
    }
  }, [allModulesCompleted, courseEndStep, courseEndProgress]);

  const fetchModuleDetails = async (moduleId: string) => {
    let data: any = {};
    try {
      const res = await fetch(`${API_BASE_URL}/api/modules/${moduleId}`);
      if (res.ok) data = await res.json();
    } catch {}
    setModuleDetails(data);

    const prog = modules[activeModuleIndex].progress;
    const availableStages = getAvailableStagesForModule(modules[activeModuleIndex]);
    if (availableStages.length === 0) {
      setActiveStage('video');
      setQuizAnswers([]);
      setQuizResult(null);
      setCurrentQuizQ(0);
      return;
    }
    if (availableStages.includes('video') && !prog?.video_completed) setActiveStage('video');
    else if (availableStages.includes('theory') && !prog?.theory_completed) setActiveStage('theory');
    else if (availableStages.includes('quiz')) setActiveStage('quiz');
    else setActiveStage(availableStages[0]);

    const stageQuizLesson = getLessonForStage(modules[activeModuleIndex], 'quiz');
    const lessonQuizQuestions = getQuizQuestionsFromLesson(stageQuizLesson);

    if (prog?.quiz_answers?.length) setQuizAnswers(prog.quiz_answers);
    else if (lessonQuizQuestions.length) setQuizAnswers(lessonQuizQuestions.map(() => []));
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

    const stageQuizLesson = getLessonForStage(modules[activeModuleIndex], 'quiz');
    const lessonQuizQuestions = getQuizQuestionsFromLesson(stageQuizLesson);

    if (lessonQuizQuestions.length > 0) {
      let correct = 0;
      const qs = lessonQuizQuestions;
      qs.forEach((q: QuizQuestion, i: number) => {
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

  const handleFinalQuizSubmit = () => {
    const questions = finalAssessment.questions || [];
    if (questions.length === 0) {
      setFinalQuizResult({ score: 100, passed: true });
      setCourseEndStep('project_submit');
      return;
    }

    let correct = 0;
    questions.forEach((q, i) => {
      const selected = finalQuizAnswers[i] || [];
      const answers = Array.isArray(q.correct_answers) ? q.correct_answers : [];
      if (selected.length === answers.length && selected.every((v) => answers.includes(v))) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    const passMark = typeof finalAssessment.pass_mark === 'number' ? finalAssessment.pass_mark : 60;
    const passed = score >= passMark;
    setFinalQuizResult({ score, passed });
    saveCourseEndProgress({
      capstone_completed: true,
      final_quiz_score: score,
      final_quiz_passed: passed,
      final_quiz_answers: finalQuizAnswers
    });
    if (passed) {
      setCourseEndStep('project_submit');
    }
  };

  const handleSubmitFinalProject = async () => {
    if (!user?.uid) {
      setProjectSubmitState('error');
      setProjectSubmitMessage('Please login and try again.');
      return;
    }
    if (!githubLink.trim() && !deployedLink.trim()) {
      setProjectSubmitState('error');
      setProjectSubmitMessage('Please paste your GitHub link or deployed project link.');
      return;
    }

    try {
      setProjectSubmitState('submitting');
      setProjectSubmitMessage('Submitting your final project...');
      const form = new FormData();
      form.append('user_id', user.uid);
      form.append('module_id', `FINAL_CAPSTONE_${resolvedCourseId}`);
      form.append('deployed_link', deployedLink.trim());
      form.append('github_link', githubLink.trim());
      if (projectFile) form.append('file', projectFile);

      const res = await fetch(`${API_BASE_URL}/api/project/submit`, {
        method: 'POST',
        body: form
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || 'Failed to submit project');
      }

      setProjectSubmitState('submitted');
      setProjectSubmitMessage('Project submitted successfully. Our team will review it.');
      fetchCourseEndProgress();
    } catch (err: any) {
      setProjectSubmitState('error');
      setProjectSubmitMessage(err?.message || 'Unable to submit project right now.');
    }
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
  const currentModuleStages = getAvailableStagesForModule(currentModule);
  const currentVideoLesson = getLessonForStage(currentModule, 'video');
  const currentTheoryLesson = getLessonForStage(currentModule, 'theory');
  const currentQuizLesson = getLessonForStage(currentModule, 'quiz');
  const currentQuizQuestions = getQuizQuestionsFromLesson(currentQuizLesson);

  const videoRawUrl = currentVideoLesson
    ? (currentVideoLesson.video_source === 'file'
      ? (currentVideoLesson.video_file_data || currentVideoLesson.video_url || '')
      : (currentVideoLesson.video_url || currentVideoLesson.video_file_data || ''))
    : (moduleDetails?.video?.video_url || '');
  const videoEmbedUrl = normalizeYouTubeUrl(videoRawUrl);
  const isYouTubeVideo = /youtube\.com|youtu\.be/.test(videoRawUrl || '');

  const normalizedTextBlocks = currentTheoryLesson?.type === 'text' && Array.isArray(currentTheoryLesson.text_blocks)
    ? currentTheoryLesson.text_blocks.map((block: any) => ({
      kind: block?.kind || block?.type || block?.block_type || 'paragraph',
      text: block?.text || block?.content || block?.paragraph || '',
      imageSrc: normalizeExternalUrl(block?.image_file_data || block?.image_url || block?.url || block?.content || ''),
      caption: block?.caption || '',
      linkUrl: normalizeExternalUrl(block?.url || block?.link_url || block?.href || ''),
      linkLabel: block?.label || block?.link_label || block?.text || block?.url || block?.link_url || 'Open resource'
    }))
    : [];

  const builderResources = [
    ...normalizedTextBlocks
      .filter((b: any) => b.kind === 'link' && b.linkUrl)
      .map((b: any) => ({ title: b.linkLabel, url: b.linkUrl, meta: 'External Link' })),
    ...normalizedTextBlocks
      .filter((b: any) => b.kind === 'image' && b.imageSrc)
      .map((b: any, i: number) => ({ title: b.caption || `Lesson Image ${i + 1}`, url: b.imageSrc, meta: 'Image Resource' })),
    ...(currentVideoLesson?.video_source === 'file' && videoRawUrl
      ? [{ title: currentVideoLesson.video_file_name || 'Lesson Video File', url: videoRawUrl, meta: 'Video Resource' }]
      : [])
  ];

  const legacyResources = Array.isArray(moduleDetails?.resources)
    ? moduleDetails.resources
      .filter((r: any) => r?.url)
      .map((r: any) => ({ title: r.title || 'Resource', url: r.url, meta: r.type || r.size || 'Resource' }))
    : [];

  const activeResources = builderResources.length > 0 ? builderResources : legacyResources;
  
  // Calculate more granular overall progress by summing all individual module progress percentages
  const overallProgress = modules.length > 0 
    ? Math.round((modules.reduce((acc, m) => acc + getModuleProgress(m), 0)) / modules.length)
    : 0;

  const currentLessonTitle = currentModule
    ? `${currentModule.title} — ${getLessonLabel(activeStage)}`
    : 'Loading...';

  const isCourseEndFlow = allModulesCompleted && courseEndStep !== 'modules';
  const workflowTitle = courseEndStep === 'capstone'
    ? 'Capstone Project'
    : courseEndStep === 'final_quiz'
      ? 'Final Course Quiz'
      : 'Project Submission';

  /* ═══════ Render ═══════ */
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
      <aside className={`cp-sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="cp-sidebar-header">
          <button className="cp-sidebar-back" onClick={() => navigate('/learn/courses')}>
            <ChevronLeft size={16} /> Back to courses
          </button>
          <div className="cp-sidebar-title-row">
            <div className="cp-sidebar-title">Course Curriculum</div>
          </div>
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
            const lessons: LessonType[] = getAvailableStagesForModule(mod);

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
                        {`${mod.estimated_time} · ${lessons.length} lesson${lessons.length === 1 ? '' : 's'}`}
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
            <button className="cp-collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
              <Menu size={18} />
            </button>
            <span className="cp-topbar-lesson-title">{isCourseEndFlow ? workflowTitle : currentLessonTitle}</span>
          </div>
          <div className="cp-topbar-right">
            {!isCourseEndFlow && activeStage !== 'quiz' && (
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
            {isCourseEndFlow ? (
              <div style={{ maxWidth: 840, margin: '0 auto', padding: '28px 24px 40px' }}>
                {courseEndStep === 'capstone' && (
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 10 }}>Final Capstone Project</h2>
                    <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.7, marginBottom: 18 }}>
                      You completed all modules. Build your capstone project now to demonstrate full-stack ownership and problem-solving depth.
                    </p>
                    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 18 }}>
                      <div style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>Capstone Checklist</div>
                      <ul style={{ margin: 0, paddingLeft: 18, color: '#374151', lineHeight: 1.8 }}>
                        <li>Build and complete the final project for this track.</li>
                        <li>Push your source code to a public/private GitHub repository.</li>
                        <li>Keep a live deployed URL if available (optional but recommended).</li>
                      </ul>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: '#374151' }}>
                      <input
                        type="checkbox"
                        checked={capstoneAccepted}
                        onChange={(e) => setCapstoneAccepted(e.target.checked)}
                      />
                      I have completed my capstone and want to continue.
                    </label>
                    <button
                      className="cp-bottom-nav-btn next"
                      onClick={async () => {
                        await saveCourseEndProgress({ capstone_completed: true });
                        setCourseEndStep('final_quiz');
                        setFinalQuizResult(null);
                        setCurrentFinalQuizQ(0);
                      }}
                      disabled={!capstoneAccepted}
                    >
                      Start Final Quiz <ChevronRight size={16} />
                    </button>
                  </div>
                )}

                {courseEndStep === 'final_quiz' && (
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                      {finalAssessment.title || 'Final Course Quiz'}
                    </h2>
                    <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
                      Pass mark: {finalAssessment.pass_mark ?? 60}%
                    </p>

                    {finalAssessment.questions.length === 0 ? (
                      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16, color: '#374151' }}>
                        Final quiz is not configured yet for this course. You can proceed to project submission.
                      </div>
                    ) : (
                      <>
                        {finalAssessment.questions.map((q, qIdx) => (
                          <div key={qIdx} style={{ display: qIdx === currentFinalQuizQ ? 'block' : 'none' }}>
                            <div className="cp-quiz-question-text" style={{ marginBottom: 12 }}>{q.question}</div>
                            <div className="cp-quiz-options">
                              {(q.options || []).map((opt, optIdx) => {
                                const selected = finalQuizAnswers[qIdx]?.includes(optIdx);
                                return (
                                  <button
                                    key={optIdx}
                                    className={`cp-quiz-option ${selected ? 'selected' : ''}`}
                                    onClick={() => {
                                      const next = [...finalQuizAnswers];
                                      next[qIdx] = [optIdx];
                                      setFinalQuizAnswers(next);
                                    }}
                                  >
                                    <div className="cp-quiz-radio">{selected && <div className="cp-quiz-radio-dot" />}</div>
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                        {!finalQuizResult && finalAssessment.questions.length > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
                            <button
                              className="cp-bottom-nav-btn"
                              onClick={() => setCurrentFinalQuizQ((q) => Math.max(0, q - 1))}
                              disabled={currentFinalQuizQ === 0}
                            >
                              <ChevronLeft size={16} /> Previous
                            </button>
                            {currentFinalQuizQ < finalAssessment.questions.length - 1 ? (
                              <button
                                className="cp-bottom-nav-btn next"
                                onClick={() => setCurrentFinalQuizQ((q) => q + 1)}
                                disabled={!finalQuizAnswers[currentFinalQuizQ]?.length}
                              >
                                Next <ChevronRight size={16} />
                              </button>
                            ) : (
                              <button
                                className="cp-bottom-nav-btn next"
                                onClick={handleFinalQuizSubmit}
                                disabled={finalQuizAnswers.some((a) => !a?.length)}
                              >
                                Submit Final Quiz
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {(finalQuizResult || finalAssessment.questions.length === 0) && (
                      <div style={{ marginTop: 18 }}>
                        {finalQuizResult ? (
                          <div className={`cp-quiz-result ${finalQuizResult.passed ? 'passed' : 'failed'}`}>
                            <div className="cp-quiz-result-score">{Math.round(finalQuizResult.score)}%</div>
                            <div style={{ fontSize: 16, fontWeight: 700 }}>
                              {finalQuizResult.passed ? 'Final Quiz Passed' : 'Final Quiz Not Passed'}
                            </div>
                          </div>
                        ) : null}

                        {finalQuizResult?.passed || finalAssessment.questions.length === 0 ? (
                          <button className="cp-bottom-nav-btn next" onClick={() => setCourseEndStep('project_submit')}>
                            Continue to GitHub Submission <ChevronRight size={16} />
                          </button>
                        ) : (
                          <button
                            className="cp-bottom-nav-btn"
                            onClick={() => {
                              setFinalQuizResult(null);
                              setCurrentFinalQuizQ(0);
                              setFinalQuizAnswers(finalAssessment.questions.map(() => []));
                            }}
                          >
                            Retry Final Quiz
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {courseEndStep === 'project_submit' && (
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 10 }}>Submit Final Project</h2>
                    <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
                      Paste your GitHub repository link after completing the capstone. You can also add a deployed URL and supporting file.
                    </p>

                    <div style={{ display: 'grid', gap: 12, marginBottom: 12 }}>
                      <input
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        placeholder="https://github.com/username/repository"
                        className="cp-notes-area"
                        style={{ minHeight: 44, height: 44 }}
                      />
                      <input
                        value={deployedLink}
                        onChange={(e) => setDeployedLink(e.target.value)}
                        placeholder="https://your-deployed-app-url (optional)"
                        className="cp-notes-area"
                        style={{ minHeight: 44, height: 44 }}
                      />
                      <input
                        type="file"
                        onChange={(e) => setProjectFile(e.target.files?.[0] || null)}
                      />
                    </div>

                    <button
                      className="cp-bottom-nav-btn next"
                      onClick={handleSubmitFinalProject}
                      disabled={projectSubmitState === 'submitting'}
                    >
                      {projectSubmitState === 'submitting' ? 'Submitting...' : 'Submit Project'}
                    </button>

                    {projectSubmitMessage && (
                      <div style={{ marginTop: 12, fontSize: 14, color: projectSubmitState === 'submitted' ? '#059669' : '#dc2626' }}>
                        {projectSubmitMessage}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : currentModuleStages.length === 0 ? (
              <div style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', padding: 48 }}>
                No lessons configured for this module yet.
              </div>
            ) : (
            <AnimatePresence mode="wait">
              {/* ── VIDEO ── */}
              {activeStage === 'video' && (
                <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="cp-video-container">
                    {videoRawUrl ? (
                      isYouTubeVideo ? (
                        <iframe
                          src={videoEmbedUrl}
                          title="Course Video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <video controls style={{ width: '100%', height: '100%', borderRadius: 0 }}>
                          <source src={videoRawUrl} />
                          Your browser does not support the video tag.
                        </video>
                      )
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
                    {currentTheoryLesson?.type === 'text' && normalizedTextBlocks.length >= 0 ? (
                      <div>
                        {normalizedTextBlocks.length > 0 ? (
                          normalizedTextBlocks.map((block: any, idx: number) => {
                            if (block.kind === 'image') {
                              const imageSrc = block.imageSrc || '';
                              return imageSrc ? (
                                <div key={idx} style={{ marginBottom: 18 }}>
                                  <img
                                    src={imageSrc}
                                    alt={block.caption || `Lesson visual ${idx + 1}`}
                                    style={{ width: '100%', borderRadius: 10, border: '1px solid #e5e7eb' }}
                                  />
                                  {block.caption && (
                                    <div style={{ marginTop: 8, fontSize: 13, color: '#6b7280' }}>{block.caption}</div>
                                  )}
                                </div>
                              ) : null;
                            }
                            if (block.kind === 'link') {
                              const href = block.linkUrl || '#';
                              const text = block.linkLabel || block.linkUrl || 'Open resource';
                              return (
                                <div key={idx} style={{ marginBottom: 14 }}>
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline' }}
                                  >
                                    {text}
                                  </a>
                                </div>
                              );
                            }
                            return (
                              <div key={idx} style={{ marginBottom: 14, lineHeight: 1.75, color: '#374151' }}>
                                {(() => {
                                  const plain = (block.text || '').trim();
                                  const imageLike = normalizeExternalUrl(plain);
                                  return isLikelyImageSrc(imageLike) ? (
                                    <img
                                      src={imageLike}
                                      alt={`Lesson visual ${idx + 1}`}
                                      style={{ width: '100%', borderRadius: 10, border: '1px solid #e5e7eb', marginBottom: 8 }}
                                    />
                                  ) : null;
                                })()}
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {block.text || ''}
                                </ReactMarkdown>
                              </div>
                            );
                          })
                        ) : (
                          <div style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', padding: 28 }}>
                            No text content available.
                          </div>
                        )}
                      </div>
                    ) : currentTheoryLesson?.type === 'code' ? (
                      <div>
                        {currentTheoryLesson.code_intro && (
                          <p style={{ marginBottom: 16, lineHeight: 1.75, color: '#374151' }}>
                            {currentTheoryLesson.code_intro}
                          </p>
                        )}
                        <pre>
                          <code className={`language-${currentTheoryLesson.code_language || 'text'}`}>
                            {currentTheoryLesson.code_snippet || '// No code snippet provided'}
                          </code>
                        </pre>
                      </div>
                    ) : (
                      <>
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
                      </>
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
                            Question {currentQuizQ + 1} of {(currentQuizQuestions.length || moduleDetails?.quiz?.questions?.length || 0)}
                          </div>
                          <div className="cp-quiz-progress-bar">
                            <div className="cp-quiz-progress-fill" style={{
                              width: `${((currentQuizQ + 1) / ((currentQuizQuestions.length || moduleDetails?.quiz?.questions?.length || 1))) * 100}%`
                            }} />
                          </div>
                        </div>

                        {(currentQuizQuestions.length ? currentQuizQuestions : (moduleDetails?.quiz?.questions || [])).map((q: any, qIdx: number) => (
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
                              {currentQuizQ < ((currentQuizQuestions.length || moduleDetails?.quiz?.questions?.length || 1) - 1) ? (
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
                          {(currentQuizQuestions.length ? currentQuizQuestions : (moduleDetails?.quiz?.questions || [])).map((q: any, qIdx: number) => {
                            const selected = quizAnswers[qIdx] || [];
                            return (
                              <div key={qIdx} style={{ marginBottom: 28 }}>
                                <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 12 }}>
                                  {qIdx + 1}. {q.question}
                                </div>
                                {q.options.map((opt: string, optIdx: number) => {
                                  const isSel = selected.includes(optIdx);
                                  const isCorrect = Array.isArray(q.correct_answers) && q.correct_answers.includes(optIdx);
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
                                setQuizAnswers((currentQuizQuestions.length ? currentQuizQuestions : (moduleDetails?.quiz?.questions || [])).map(() => []));
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
            )}
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
                    Array.isArray(moduleDetails?.video?.transcript_segments) && moduleDetails.video.transcript_segments.length > 0 ? (
                      moduleDetails.video.transcript_segments.map((seg: any, i: number) => (
                        <div key={i} style={{ marginBottom: 16 }}>
                          <span className="cp-transcript-timestamp">{seg.time || ''}</span>
                          {seg.text || ''}
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', padding: 40 }}>
                        Transcript not available for this video.
                      </div>
                    )
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
                    Lesson Resources
                  </div>
                  {activeResources.length > 0 ? (
                    activeResources.map((resource: any, idx: number) => (
                      <a
                        key={`${resource.url}-${idx}`}
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="cp-resource-item"
                        style={{ textDecoration: 'none' }}
                      >
                        <Download size={16} style={{ color: '#7C3AED' }} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{resource.title}</div>
                          <div style={{ fontSize: 12, color: '#9ca3af' }}>{resource.meta}</div>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', padding: 40 }}>
                      No resources were added for this lesson.
                    </div>
                  )}
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
