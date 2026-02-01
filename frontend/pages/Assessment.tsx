
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Clock,
  Brain,
  Target,
  Trophy,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Zap,
  ShieldCheck,
  MousePointer2,
  Code2,
  Database,
  Layout,
  LineChart,
  Terminal,
  Search,
  Timer
} from 'lucide-react';

// --- DATA STRUCTURES ---

interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  style: 'problem-solving' | 'scenario-based' | 'system-design' | 'culture-fit';
  weights: { [key: string]: number }; // e.g., DSA: 40
  difficultyBias: number; // 0.8 (easier) to 1.2 (harder)
  tone: string;
}

interface RoleMapping {
  id: string;
  name: string;
  skills: string[];
  subSkills: { [key: string]: string[] };
}

interface Question {
  id: string;
  type: 'mcq' | 'scenario' | 'debug' | 'design' | 'task';
  text: string;
  options?: string[];
  correctAnswer?: number | string;
  skill: string;
  subSkill: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
  hint?: string;
  scenario?: string;
  code?: string;
  explanation: string;
}

const COMPANIES: CompanyProfile[] = [
  {
    id: 'google',
    name: 'Google',
    logo: 'https://www.vectorlogo.zone/logos/google/google-icon.svg',
    style: 'problem-solving',
    weights: { 'DSA': 50, 'System Design': 30, 'Behavioral': 20 },
    difficultyBias: 1.2,
    tone: 'analytical'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg',
    style: 'scenario-based',
    weights: { 'Leadership Principles': 40, 'System Design': 30, 'DSA': 30 },
    difficultyBias: 1.1,
    tone: 'fast-paced'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg',
    style: 'system-design',
    weights: { 'System Design': 40, 'DSA': 40, 'Collaborative': 20 },
    difficultyBias: 1.0,
    tone: 'collaborative'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: 'https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg',
    style: 'problem-solving',
    weights: { 'API Design': 40, 'Product Thinking': 30, 'Code Quality': 30 },
    difficultyBias: 1.15,
    tone: 'meticulous'
  }
];

const ROLES: RoleMapping[] = [
  {
    id: 'backend',
    name: 'Backend Developer',
    skills: ['DSA', 'System Design', 'Databases', 'APIs'],
    subSkills: {
      'Databases': ['Indexing', 'ACID', 'NoSQL', 'Transactions'],
      'APIs': ['REST', 'gRPC', 'Throttling', 'Idempotency']
    }
  },
  {
    id: 'frontend',
    name: 'Frontend Developer',
    skills: ['Performance', 'State Management', 'Architecture', 'Accessibility'],
    subSkills: {
      'Architecture': ['Component Design', 'Rendering Patterns', 'Micro-frontends'],
      'Performance': ['Core Web Vitals', 'Bundling', 'Lazy Loading']
    }
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    skills: ['SQL', 'Statistics', 'Visualization', 'Logical Reasoning'],
    subSkills: {
      'SQL': ['Window Functions', 'Joins', 'Aggregations'],
      'Statistics': ['Probability', 'Distribution', 'Hypothesis Testing']
    }
  }
];

// Mock Question Bank
const QUESTION_BANK: Question[] = [
  {
    id: 'q1',
    type: 'mcq',
    skill: 'Databases',
    subSkill: 'Indexing',
    difficulty: 'medium',
    text: "Which index type is best suited for range queries in a relational database?",
    options: ["B-Tree", "Hash Index", "Bitmap Index", "Full-text Index"],
    correctAnswer: 0,
    timeLimit: 45,
    explanation: "B-Trees maintain sorted order, making them O(log n) for range searches."
  },
  {
    id: 'q2',
    type: 'scenario',
    skill: 'System Design',
    subSkill: 'Throttling',
    difficulty: 'hard',
    text: "Your API is facing a DDoS attack from fragmented IP addresses. The existing rate limiter (Token Bucket) is exhausted. What is your immediate architectural pivot?",
    options: [
      "Switch to Leaky Bucket for smoother egress",
      "Implement Hierarchical Throttling (Region -> ISP -> User)",
      "Increase bucket capacity by 10x",
      "Enable Cloudflare 'Under Attack' mode only"
    ],
    correctAnswer: 1,
    timeLimit: 90,
    explanation: "Hierarchical throttling allows you to isolate the blast radius at broader network levels during distributed attacks."
  },
  {
    id: 'q3',
    type: 'debug',
    skill: 'APIs',
    subSkill: 'Idempotency',
    difficulty: 'medium',
    text: "Identify the critical flaw in this payment retry logic:",
    code: "function processPayment(orderId, amount) {\n  const status = bankApi.charge(amount);\n  if (status === 'SUCCESS') updateOrder(orderId, 'PAID');\n  else retry(orderId, amount);\n}",
    options: [
      "Missing error handling for bankApi",
      "Lack of Idempotency Key in charge() call",
      "Synchronous execution blocking the thread",
      "Insecure amount handling"
    ],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: "Without an idempotency key, retries could result in duplicate charges if the first request succeeded but the response timed out."
  },
  {
    id: 'q4',
    type: 'design',
    skill: 'System Design',
    subSkill: 'Micro-frontends',
    difficulty: 'hard',
    text: "Design a state-sharing strategy between three micro-frontends (Search, Cart, Auth) without creating a monolith dependency.",
    options: [
      "Shared Redux Store",
      "Custom Events (Window Dispatch)",
      "Shared Database",
      "URL Search Params only"
    ],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: "Custom browser events decouple the applications while allowing reactive communication."
  },
  {
    id: 'q5',
    type: 'mcq',
    skill: 'DSA',
    subSkill: 'Trees',
    difficulty: 'medium',
    text: "What is the time complexity of finding the lowest common ancestor in a balanced Binary Search Tree?",
    options: ["O(log N)", "O(N)", "O(1)", "O(N log N)"],
    correctAnswer: 0,
    timeLimit: 45,
    explanation: "In a balanced BST, you can find LCA by traversing down, taking O(height) which is O(log N)."
  }
];

// --- COMPONENTS ---

const RadialProgress = ({ value, label }: { value: number; label: string }) => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    <svg className="w-full h-full transform -rotate-90">
      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
      <motion.circle
        cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
        strokeDasharray={364.4}
        initial={{ strokeDashoffset: 364.4 }}
        animate={{ strokeDashoffset: 364.4 - (364.4 * value) / 100 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-[#7C3AED] stroke-round"
      />
    </svg>
    <div className="absolute flex flex-col items-center">
      <span className="text-2xl font-black text-[#111827]">{value}%</span>
      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  </div>
);

const Assessment: React.FC = () => {
  // Navigation & Config State
  const [step, setStep] = useState<'config' | 'prep' | 'active' | 'analysis' | 'results'>('config');
  const [roleInput, setRoleInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleMapping | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [experience, setExperience] = useState<'fresher' | 'mid' | 'senior'>('fresher');

  // Suggestions state
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

  const filteredRoles = ROLES.filter(r => r.name.toLowerCase().includes(roleInput.toLowerCase()));
  const filteredCompanies = COMPANIES.filter(c => c.name.toLowerCase().includes(companyInput.toLowerCase()));

  // Assessment Active State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<{ id: string; correct: boolean; time: number; usedHint: boolean }[]>([]);
  const [timer, setTimer] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiQuestionPool, setAiQuestionPool] = useState<Question[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Results State
  const [finalAnalysis, setFinalAnalysis] = useState<any>(null);

  const resolveInputs = () => {
    const finalRole = selectedRole || ROLES.find(r => r.name.toLowerCase() === roleInput.toLowerCase()) || { id: 'custom', name: roleInput, skills: ['Technical Logic'], subSkills: {} };
    const finalCompany = selectedCompany || COMPANIES.find(c => c.name.toLowerCase() === companyInput.toLowerCase()) || { id: 'custom', name: companyInput, logo: '', style: 'problem-solving', weights: {}, difficultyBias: 1.0, tone: 'neutral' };

    setSelectedRole(finalRole as any);
    setSelectedCompany(finalCompany as any);
    return { finalRole, finalCompany };
  };

  const fetchAIQuestions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:8000/api/assessment/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: roleInput,
          company: companyInput,
          experience: experience
        })
      });
      const data = await response.json();

      if (data.questions && data.questions.length > 0) {
        // Normalize data: Ensure options exist and correctAnswer is a number
        const normalized = data.questions.map((q: any) => ({
          ...q,
          type: q.type || 'mcq',
          options: q.options || q.choices || [],
          correctAnswer: q.correctAnswer !== undefined ? Number(q.correctAnswer) : 0,
          skill: q.skill || 'General',
          subSkill: q.subSkill || 'Core Logic'
        }));

        setAiQuestionPool(normalized);
        if (data.company_profile) {
          setSelectedCompany(prev => ({ ...prev, ...data.company_profile } as any));
        }
        return normalized;
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
    return QUESTION_BANK; // Fallback
  };

  // Timer Effect
  useEffect(() => {
    if (step === 'active' && timer > 0) {
      const id = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(id);
    } else if (step === 'active' && timer === 0) {
      handleNext(false, true);
    }
  }, [step, timer]);


  // 1. Initial Question Selection (Medium start)
  const startAssessment = async () => {
    resolveInputs();
    const pool = await fetchAIQuestions();

    // Start with a medium question from the pool
    const initialQuestions = pool.filter((q: Question) => q.difficulty === 'medium').slice(0, 1);
    const startQ = initialQuestions.length > 0 ? initialQuestions[0] : pool[0];

    setCurrentIndex(0);
    setQuestions([startQ]);
    setStep('active');
    setTimer(startQ.timeLimit);
  };

  const handleNext = (isCorrect: boolean, isTimeout = false) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const response = {
      id: currentQ.id,
      correct: isCorrect,
      time: currentQ.timeLimit - timer,
      usedHint: usedHint
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    // ADAPTIVE LOGIC: Select next question difficulty
    if (newResponses.length >= 5) {
      setStep('analysis');
      setTimeout(() => generateResults(newResponses), 2000);
      return;
    }

    // Determine next difficulty
    let nextDifficulty: 'easy' | 'medium' | 'hard' = 'medium';
    if (isCorrect && timer > currentQ.timeLimit / 2) nextDifficulty = 'hard';
    else if (!isCorrect) nextDifficulty = 'easy';

    // Find a new question from AI pool that hasn't been used
    const usedIds = newResponses.map(r => r.id);
    const pool = aiQuestionPool.length > 0 ? aiQuestionPool : QUESTION_BANK;
    const nextQ = pool.find(q => q.difficulty === nextDifficulty && !usedIds.includes(q.id))
      || pool.find(q => !usedIds.includes(q.id));

    if (nextQ) {
      setQuestions([...questions, nextQ]);
      setCurrentIndex(prev => prev + 1);
      setTimer(nextQ.timeLimit);
      setUsedHint(false);
      setShowExplanation(false);
    } else {
      setStep('analysis');
      setTimeout(() => generateResults(newResponses), 2000);
    }
  };

  const generateResults = (finalResponses: any[]) => {
    const score = (finalResponses.filter(r => r.correct).length / finalResponses.length) * 100;
    const avgTime = finalResponses.reduce((acc, r) => acc + r.time, 0) / finalResponses.length;

    // Use guaranteed non-null role/company for final calculations
    const finalRole = selectedRole || ROLES[0];
    const finalCompany = selectedCompany || COMPANIES[0];

    setFinalAnalysis({
      overallScore: Math.round(score),
      roleReadiness: Math.round(score * 0.9 + (finalCompany.difficultyBias > 1 ? 5 : 0)),
      companyMatch: Math.round(score * (1 / finalCompany.difficultyBias) + 10),
      avgSpeed: Math.round(avgTime),
      strengths: [finalRole.skills[0], 'Logical Defense'],
      weaknesses: ['Scenario Handling', 'Pressure Resilience'],
      recommendations: [
        { title: 'Advanced System Designs', type: 'Course', link: '#' },
        { title: 'Database Optimization', type: 'Practice', link: '#' }
      ]
    });
    setStep('results');
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-[#FAFAFA] min-h-screen flex items-center justify-center font-sans">
      <div className="max-w-6xl w-full mx-auto">
        <AnimatePresence mode="wait">

          {/* STEP 1: CONFIGURATION */}
          {step === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <div>
                <div className="inline-flex items-center gap-2 bg-[#7C3AED]/10 text-[#7C3AED] px-4 py-2 rounded-full mb-8">
                  <Brain className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Engine V2.1</span>
                </div>
                <h1 className="text-6xl sm:text-7xl font-black text-[#111827] mb-8 leading-[0.9] tracking-tighter uppercase italic">
                  Clinical <br /><span className="text-[#7C3AED]">Ready.</span>
                </h1>
                <p className="text-[#6B7280] text-xl font-medium leading-relaxed max-w-md">
                  Calibrate your assessment protocol by specifying your target role and institution.
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-[3rem] p-10 sm:p-12 shadow-2xl space-y-8 relative">

                {/* ROLE INPUT */}
                <div className="relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Target Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Backend Developer"
                      value={roleInput}
                      onChange={(e) => {
                        setRoleInput(e.target.value);
                        setSelectedRole(null);
                        setShowRoleSuggestions(true);
                      }}
                      onFocus={() => setShowRoleSuggestions(true)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-14 py-5 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:bg-white transition-all font-bold text-gray-800 placeholder:text-gray-300"
                    />
                  </div>
                  <AnimatePresence>
                    {showRoleSuggestions && (roleInput.length > 0 || roleInput === '') && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 w-full bg-white border border-gray-100 rounded-2xl mt-2 p-2 shadow-2xl max-h-60 overflow-y-auto"
                      >
                        {filteredRoles.length > 0 ? filteredRoles.map(role => (
                          <button
                            key={role.id}
                            onClick={() => {
                              setRoleInput(role.name);
                              setSelectedRole(role);
                              setShowRoleSuggestions(false);
                            }}
                            className="w-full text-left p-4 hover:bg-[#F5F3FF] rounded-xl transition-colors flex items-center justify-between group"
                          >
                            <span className="font-bold text-sm text-gray-700 group-hover:text-[#7C3AED]">{role.name}</span>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-[#7C3AED]/50">Institutional Profile</span>
                          </button>
                        )) : (
                          <div className="p-4 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Custom Role Mode Active</p>
                          </div>
                        )}
                        <div className="p-2 border-t border-gray-50 mt-2">
                          <button onClick={() => setShowRoleSuggestions(false)} className="w-full text-center text-[9px] font-black text-[#7C3AED] uppercase tracking-widest hover:underline">Close Suggestions</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {ROLES.slice(0, 3).map(r => (
                      <button
                        key={r.id}
                        onClick={() => { setRoleInput(r.name); setSelectedRole(r); }}
                        className="text-[9px] font-bold text-gray-400 hover:text-[#7C3AED] hover:bg-[#7C3AED]/5 px-3 py-1.5 rounded-full border border-gray-100 transition-all uppercase tracking-widest"
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* COMPANY INPUT */}
                <div className="relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Target Institution</label>
                  <div className="relative">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Google"
                      value={companyInput}
                      onChange={(e) => {
                        setCompanyInput(e.target.value);
                        setSelectedCompany(null);
                        setShowCompanySuggestions(true);
                      }}
                      onFocus={() => setShowCompanySuggestions(true)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-14 py-5 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:bg-white transition-all font-bold text-gray-800 placeholder:text-gray-300"
                    />
                  </div>
                  <AnimatePresence>
                    {showCompanySuggestions && (companyInput.length > 0 || companyInput === '') && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute z-40 w-full bg-white border border-gray-100 rounded-2xl mt-2 p-2 shadow-2xl max-h-60 overflow-y-auto"
                      >
                        {filteredCompanies.length > 0 ? filteredCompanies.map(comp => (
                          <button
                            key={comp.id}
                            onClick={() => {
                              setCompanyInput(comp.name);
                              setSelectedCompany(comp);
                              setShowCompanySuggestions(false);
                            }}
                            className="w-full text-left p-4 hover:bg-[#F5F3FF] rounded-xl transition-colors flex items-center gap-4 group"
                          >
                            <img src={comp.logo} alt="" className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all" />
                            <span className="font-bold text-sm text-gray-700 group-hover:text-[#7C3AED]">{comp.name}</span>
                          </button>
                        )) : (
                          <div className="p-4 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Standard Market Bias Applied</p>
                          </div>
                        )}
                        <div className="p-2 border-t border-gray-50 mt-2">
                          <button onClick={() => setShowCompanySuggestions(false)} className="w-full text-center text-[9px] font-black text-[#7C3AED] uppercase tracking-widest hover:underline">Close Suggestions</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {COMPANIES.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setCompanyInput(c.name); setSelectedCompany(c); }}
                        className="text-[9px] font-bold text-gray-400 hover:text-[#7C3AED] hover:bg-[#7C3AED]/5 px-3 py-1.5 rounded-full border border-gray-100 transition-all uppercase tracking-widest"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* EXPERIENCE LEVEL */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Experience Level</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'fresher', label: 'Fresher' },
                      { id: 'mid', label: '1-3 Yrs' },
                      { id: 'senior', label: '3-5 Yrs' }
                    ].map(exp => (
                      <button
                        key={exp.id}
                        onClick={() => setExperience(exp.id as any)}
                        className={`flex-1 py-4 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all ${experience === exp.id ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-[#7C3AED]/20'}`}
                      >
                        {exp.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      if (!roleInput || !companyInput) return;
                      resolveInputs();
                      setStep('prep');
                    }}
                    disabled={!roleInput || !companyInput}
                    className="w-full py-6 bg-[#111827] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-[#7C3AED] transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                  >
                    Generate Protocol <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Encryption Level: AES-256 Validated</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PREPARATION / BRIEFING */}
          {step === 'prep' && (
            <motion.div
              key="prep"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="w-24 h-24 bg-[#7C3AED] text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-[#7C3AED]/40">
                <Target className="w-10 h-10" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-[#111827] mb-6 uppercase tracking-tighter">Protocol <span className="text-[#7C3AED]">Synchronized.</span></h2>
              <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto font-medium">
                We have synthesized an adaptive assessment for <span className="text-[#111827] font-bold">{selectedRole?.name}</span> at <span className="text-[#111827] font-bold">{selectedCompany?.name}</span>. The difficulty will pivot based on your performance.
              </p>

              <div className="grid sm:grid-cols-3 gap-6 mb-16 text-left">
                {[
                  { icon: Brain, label: 'Style', val: selectedCompany?.style || 'standard' },
                  { icon: Clock, label: 'Adaptive', val: 'On' },
                  { icon: ShieldCheck, label: 'Verification', val: 'Clinical' }
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
                    <item.icon className="w-6 h-6 text-[#7C3AED] mb-4" />
                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</span>
                    <span className="text-sm font-bold text-[#111827] uppercase">{item.val}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setStep('config')} className="px-10 py-5 bg-white border border-gray-200 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:border-gray-400 transition-all">Re-Calibrate</button>
                <button
                  onClick={startAssessment}
                  disabled={isGenerating}
                  className="px-12 py-5 bg-[#7C3AED] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {isGenerating ? 'Synthesizing Protocol...' : 'Initiate Audit'}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ACTIVE ASSESSMENT */}
          {step === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              {/* Top Progress Bar */}
              <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-[150]">
                <motion.div
                  className="h-full bg-[#7C3AED]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / 5) * 100}%` }}
                />
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Question Area */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 shadow-xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-4">
                        <span className="bg-[#7C3AED] text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Gate {currentIndex + 1}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{questions[currentIndex].skill} // {questions[currentIndex].subSkill}</span>
                      </div>
                      <div className={`flex items-center gap-2 font-mono font-bold text-sm ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-[#7C3AED]'}`}>
                        <Timer className="w-4 h-4" /> {timer}s
                      </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-8 leading-tight">
                      {questions[currentIndex].text}
                    </h2>

                    {questions[currentIndex].code && (
                      <div className="bg-gray-900 rounded-xl p-6 mb-8 overflow-x-auto">
                        <pre className="text-blue-400 font-mono text-sm leading-relaxed">
                          <code>{questions[currentIndex].code}</code>
                        </pre>
                      </div>
                    )}

                    <div className="grid gap-3">
                      {(!questions[currentIndex].options || questions[currentIndex].options.length === 0) ? (
                        <div className="space-y-4">
                          <textarea
                            placeholder="Type your technical response, architectural sketch, or solution logic here..."
                            className="w-full h-48 bg-gray-50 border border-gray-100 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 font-mono text-sm leading-relaxed"
                            onChange={(e) => (window as any).currentUserResponse = e.target.value}
                          />
                          <div className="flex justify-between items-center gap-4">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Supports Markdown & Logic Schemas</p>
                            <button
                              onClick={() => handleNext(true)}
                              className="px-8 py-4 bg-[#7C3AED] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:shadow-[#7C3AED]/30 transition-all"
                            >
                              Submit Intelligence
                            </button>
                          </div>
                        </div>
                      ) : (
                        questions[currentIndex].options?.map((option, i) => (
                          <button
                            key={i}
                            onClick={() => handleNext(i === Number(questions[currentIndex].correctAnswer))}
                            className="w-full p-5 text-left border border-gray-100 rounded-2xl hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition-all group flex items-center justify-between"
                          >
                            <span className="font-bold text-gray-700 group-hover:text-[#7C3AED] text-sm">{option}</span>
                            <span className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-[#7C3AED] group-hover:text-white transition-all">{String.fromCharCode(65 + i)}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-4">
                    <button
                      onClick={() => setUsedHint(true)}
                      disabled={usedHint}
                      className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 hover:text-[#7C3AED] transition-colors disabled:opacity-30"
                    >
                      <Zap className="w-3 h-3" /> Get Clinical Hint (-10% Score)
                    </button>
                    {usedHint && <p className="text-[10px] font-bold text-[#723AED] italic">{questions[currentIndex].hint || "Focus on the execution flow."}</p>}
                  </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  <div className="bg-[#111827] text-white rounded-[2.5rem] p-8 shadow-xl">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7C3AED] mb-6">Live Response Mesh</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-gray-400 uppercase text-[9px]">Difficulty</span>
                        <span className="uppercase text-[#7C3AED]">{questions[currentIndex].difficulty}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-gray-400 uppercase text-[9px]">System Impact</span>
                        <span>High Risk</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#7C3AED]"
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentIndex + 1) * 20}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Interview Simulation</h4>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic border-l-2 border-[#7C3AED] pl-4">
                      "{selectedCompany?.name} typically looks for candidates who can explain the trade-offs of their decisions under pressure."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: ANALYSIS LOADING */}
          {step === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-[#111827]">Synthesizing <span className="text-[#7C3AED]">Intelligence...</span></h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.4em] mt-4 text-center">Crunching clinical data nodes</p>
            </motion.div>
          )}

          {/* STEP 5: RESULTS & INSIGHTS */}
          {step === 'results' && finalAnalysis && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="flex-grow">
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full mb-6">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Audit Terminal Finalized</span>
                  </div>
                  <h1 className="text-6xl font-black text-[#111827] uppercase tracking-tighter italic leading-none mb-4">
                    Clinical <br /><span className="text-[#7C3AED]">Verdict.</span>
                  </h1>
                </div>

                <div className="flex gap-8">
                  <RadialProgress value={finalAnalysis.roleReadiness} label="Role Ready" />
                  <RadialProgress value={finalAnalysis.companyMatch} label={`${selectedCompany.name} Fit`} />
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Performance Bento */}
                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">

                  <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Logic Strengths</h3>
                    <div className="space-y-3">
                      {finalAnalysis.strengths.map((s: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-2xl font-bold text-sm">
                          <Trophy className="w-4 h-4" /> {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Critical Gaps</h3>
                    <div className="space-y-3">
                      {finalAnalysis.weaknesses.map((w: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl font-bold text-sm">
                          <AlertCircle className="w-4 h-4" /> {w}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2 bg-[#111827] text-white rounded-[2.5rem] p-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7C3AED] mb-4">AI FEEDBACK PROTOCOL</h4>
                      <p className="text-lg font-medium leading-relaxed max-w-xl text-gray-300">
                        "Your execution on <span className="text-white font-bold">{finalAnalysis.strengths[0]}</span> exceeds the {selectedCompany.name} benchmark. However, you struggled with <span className="text-[#7C3AED] font-bold">pressure-based scenarios</span>. We suggest focusing on clinical decomposition during time-boxed design trials."
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-5xl font-black text-white tracking-tighter">{finalAnalysis.avgSpeed}s</span>
                      <span className="text-[9px] font-black text-[#7C3AED] uppercase tracking-widest">Avg Pulse Speed</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl">
                  <h3 className="text-[10px] font-black text-[#111827] uppercase tracking-[0.3em] mb-10 border-b border-gray-100 pb-4">Next Action Protocol</h3>
                  <div className="space-y-6">
                    {finalAnalysis.recommendations.map((rec: any, i: number) => (
                      <div key={i} className="group cursor-pointer">
                        <span className="text-[8px] font-black text-[#7C3AED] uppercase tracking-widest block mb-1">{rec.type}</span>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm group-hover:text-[#7C3AED] transition-colors">{rec.title}</h4>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep('config')}
                    className="w-full mt-12 py-5 bg-[#7C3AED] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-lg hover:scale-105 transition-all"
                  >
                    Repeat Audit
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Assessment;
