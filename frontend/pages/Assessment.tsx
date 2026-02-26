
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  Timer,
  BarChart3,
  Award,
  RefreshCw
} from 'lucide-react';

// --- DATA STRUCTURES ---

interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  style: 'problem-solving' | 'scenario-based' | 'system-design' | 'culture-fit';
  weights: { [key: string]: number };
  difficultyBias: number;
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
  section: 'Logic' | 'Code' | 'System Thinking';
  type: 'mcq' | 'scenario' | 'debug' | 'design' | 'task';
  text: string;
  options?: string[];
  correctAnswer?: number | string;
  skill: string;
  subSkill: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
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
    weights: { 'Logic': 40, 'Code': 30, 'System Thinking': 30 },
    difficultyBias: 1.2,
    tone: 'analytical'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg',
    style: 'scenario-based',
    weights: { 'Logic': 30, 'Code': 30, 'System Thinking': 40 },
    difficultyBias: 1.1,
    tone: 'fast-paced'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg',
    style: 'system-design',
    weights: { 'System Design': 40, 'Logic': 40, 'Collaborative': 20 },
    difficultyBias: 1.0,
    tone: 'collaborative'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: 'https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg',
    style: 'problem-solving',
    weights: { 'Logic': 30, 'Code': 50, 'System Thinking': 20 },
    difficultyBias: 1.15,
    tone: 'meticulous'
  }
];

const ROLES: RoleMapping[] = [
  {
    id: 'backend',
    name: 'Backend Developer',
    skills: ['Logic', 'System Design', 'Databases', 'APIs'],
    subSkills: {
      'Databases': ['Indexing', 'ACID', 'NoSQL', 'Transactions'],
      'APIs': ['REST', 'gRPC', 'Throttling', 'Idempotency']
    }
  },
  {
    id: 'frontend',
    name: 'Frontend Developer',
    skills: ['Logic', 'Performance', 'Architecture', 'Accessibility'],
    subSkills: {
      'Architecture': ['Component Design', 'Rendering Patterns', 'Micro-frontends'],
      'Performance': ['Core Web Vitals', 'Bundling', 'Lazy Loading']
    }
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    skills: ['Logic', 'SQL', 'Statistics', 'Visualization'],
    subSkills: {
      'SQL': ['Window Functions', 'Joins', 'Aggregations'],
      'Statistics': ['Probability', 'Distribution', 'Hypothesis Testing']
    }
  }
];

const QUESTION_POOL: Question[] = [
  {
    id: 'l1',
    section: 'Logic',
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
    id: 's1',
    section: 'System Thinking',
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
    id: 'c1',
    section: 'Code',
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
    id: 's2',
    section: 'System Thinking',
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
    id: 'l2',
    section: 'Logic',
    type: 'mcq',
    skill: 'DSA',
    subSkill: 'Trees',
    difficulty: 'medium',
    text: "What is the time complexity of finding the lowest common ancestor in a balanced Binary Search Tree?",
    options: ["O(log N)", "O(N)", "O(1)", "O(N log N)"],
    correctAnswer: 0,
    timeLimit: 45,
    explanation: "In a balanced BST, you can find LCA by traversing down, taking O(height) which is O(log N)."
  },
  {
    id: 'c2',
    section: 'Code',
    type: 'mcq',
    skill: 'General',
    subSkill: 'Architectural Logic',
    difficulty: 'hard',
    text: "When scaling a read-heavy application, which strategy provides the most immediate latency improvement?",
    options: ["Database Sharding", "Read Replicas with Load Balancing", "Horizontal Pod Autoscaling", "Message Queue Implementation"],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: "Read replicas allow you to distribute the read load, reducing latency for query-heavy workloads."
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

const HeatmapItem = ({ label, score, color }: { label: string; score: number; color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-bold text-gray-900">{score}%</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="h-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'config' | 'prep' | 'active' | 'analysis' | 'results'>('config');

  // Old UI Config State
  const [roleInput, setRoleInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleMapping | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [experience, setExperience] = useState<'fresher' | 'mid' | 'senior'>('fresher');

  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

  const filteredRoles = ROLES.filter(r => r.name.toLowerCase().includes(roleInput.toLowerCase()));
  const filteredCompanies = COMPANIES.filter(c => c.name.toLowerCase().includes(companyInput.toLowerCase()));

  // Active state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState<'Logic' | 'Code' | 'System Thinking'>('Logic');
  const [responses, setResponses] = useState<{ id: string; correct: boolean; time: number; section: string }[]>([]);
  const [timer, setTimer] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'active' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (step === 'active' && timer === 0) {
      handleNext(false);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const resolveInputs = () => {
    const finalRole = selectedRole || ROLES.find(r => r.name.toLowerCase() === roleInput.toLowerCase()) || { id: 'custom', name: roleInput, skills: ['Technical Logic'], subSkills: {} };
    const finalCompany = selectedCompany || COMPANIES.find(c => c.name.toLowerCase() === companyInput.toLowerCase()) || { id: 'custom', name: companyInput, logo: '', style: 'problem-solving', weights: {}, difficultyBias: 1.0, tone: 'neutral' };
    setSelectedRole(finalRole as any);
    setSelectedCompany(finalCompany as any);
    return { finalRole, finalCompany };
  };

  const startAssessment = () => {
    resolveInputs();
    const selected = [
      ...QUESTION_POOL.filter(q => q.section === 'Logic').slice(0, 2),
      ...QUESTION_POOL.filter(q => q.section === 'Code').slice(0, 2),
      ...QUESTION_POOL.filter(q => q.section === 'System Thinking').slice(0, 2)
    ];
    setQuestions(selected);
    setCurrentIndex(0);
    setCurrentSection(selected[0].section);
    setTimer(selected[0].timeLimit);
    setStep('active');
  };

  const handleNext = (isCorrect: boolean) => {
    const currentQ = questions[currentIndex];
    const newResponses = [...responses, { id: currentQ.id, correct: isCorrect, time: currentQ.timeLimit - timer, section: currentQ.section }];
    setResponses(newResponses);

    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setCurrentSection(questions[nextIdx].section);
      setTimer(questions[nextIdx].timeLimit);
    } else {
      setStep('analysis');
      setTimeout(() => processResults(newResponses), 2000);
    }
  };

  const processResults = (finalResponses: any[]) => {
    const logicScore = Math.round((finalResponses.filter(r => r.section === 'Logic' && r.correct).length / 2) * 100);
    const codeScore = Math.round((finalResponses.filter(r => r.section === 'Code' && r.correct).length / 2) * 100);
    const systemScore = Math.round((finalResponses.filter(r => r.section === 'System Thinking' && r.correct).length / 2) * 100);

    const overall = Math.round((logicScore + codeScore + systemScore) / 3);
    const alignment = Math.round(overall * (selectedCompany?.difficultyBias || 1) * 0.8 + 10);

    setResults({
      overall,
      alignment,
      heatmap: [
        { label: 'Analytical Logic', score: logicScore, color: '#7C3AED' },
        { label: 'Clinical Coding', score: codeScore, color: '#1D74F2' },
        { label: 'System Design', score: systemScore, color: '#059669' }
      ],
      weaknesses: codeScore < 70 ? ['Memory Management', 'Closure Scope'] : ['High Scale Latency'],
      strengths: logicScore > 70 ? ['Distributed Inference', 'Probabilistic Thinking'] : ['Core Reliability'],
    });
    setStep('results');
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-[#FAFAFA] min-h-screen flex items-center justify-center font-sans">
      <div className="max-w-6xl w-full mx-auto">
        <AnimatePresence mode="wait">

          {/* STEP 1: CONFIGURATION (RESTORED OLD UI) */}
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
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PREPARATION */}
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
                We have synthesized an adaptive assessment for <span className="text-[#111827] font-bold">{selectedRole?.name}</span> at <span className="text-[#111827] font-bold">{selectedCompany?.name}</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setStep('config')} className="px-10 py-5 bg-white border border-gray-200 rounded-2xl font-bold text-[10px] uppercase tracking-widest">Re-Calibrate</button>
                <button
                  onClick={startAssessment}
                  className="px-12 py-5 bg-[#7C3AED] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all"
                >
                  Initiate Audit
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ACTIVE ASSESSMENT */}
          {step === 'active' && questions.length > 0 && (
            <motion.div
              key="active"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl w-full mx-auto"
            >
              <div className="flex justify-between items-center mb-12">
                {['Logic', 'Code', 'System Thinking'].map((section, idx) => (
                  <div key={section} className="flex flex-col items-center gap-2">
                    <div className={`h-1 w-24 rounded-full transition-all duration-500 ${currentSection === section ? 'bg-[#7C3AED] shadow-lg shadow-[#7C3AED]/40' : idx < ['Logic', 'Code', 'System Thinking'].indexOf(currentSection) ? 'bg-[#111827]' : 'bg-gray-200'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${currentSection === section ? 'text-[#7C3AED]' : 'text-gray-400'}`}>{section}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-2xl relative">
                <div className="flex justify-between items-center mb-12">
                  <span className="bg-gray-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Question {currentIndex + 1} / {questions.length}</span>
                  <div className={`flex items-center gap-2 font-mono font-bold text-sm ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-[#7C3AED]'}`}>
                    <Timer className="w-4 h-4" /> {timer}s
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-3xl font-bold text-gray-900 leading-tight">{questions[currentIndex].text}</h3>

                  {questions[currentIndex].code && (
                    <div className="bg-[#111827] rounded-3xl p-8 font-mono text-sm text-blue-400 overflow-x-auto shadow-inner">
                      <pre><code>{questions[currentIndex].code}</code></pre>
                    </div>
                  )}

                  <div className="grid gap-4">
                    {questions[currentIndex].options?.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleNext(i === questions[currentIndex].correctAnswer)}
                        className="w-full text-left p-6 rounded-2xl border-2 border-transparent bg-gray-50 hover:bg-white hover:border-[#7C3AED] hover:shadow-xl transition-all group flex items-center justify-between"
                      >
                        <span className="font-bold text-gray-700 group-hover:text-[#7C3AED]">{opt}</span>
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-[#7C3AED] group-hover:text-white group-hover:border-[#7C3AED]">{String.fromCharCode(65 + i)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ANALYSIS STATE */}
          {step === 'analysis' && (
            <motion.div key="analysis" className="text-center py-40">
              <div className="w-20 h-20 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-10" />
              <h2 className="text-3xl font-black uppercase tracking-widest text-gray-900">Synthesizing Protocol...</h2>
            </motion.div>
          )}

          {/* STEP 4: RESULTS */}
          {step === 'results' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-7xl mx-auto space-y-12"
            >
              <div className="flex flex-col lg:flex-row gap-12 items-end">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 text-green-500 mb-6">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Verified Clinical Verdict</span>
                  </div>
                  <h1 className="text-6xl sm:text-8xl font-black text-gray-900 leading-[0.8] tracking-tighter uppercase italic">
                    Logic <br /> <span className="text-[#7C3AED]">Certified.</span>
                  </h1>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full lg:w-auto">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-lg text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Proficiency</p>
                    <p className="text-6xl font-black text-gray-900">{results.overall}%</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-lg text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Alignment</p>
                    <p className="text-6xl font-black text-[#7C3AED]">{results.alignment}%</p>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm space-y-10">
                  <h4 className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.5em] mb-4">Authority Heatmap</h4>
                  <div className="grid sm:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      {results.heatmap.map((h: any, i: number) => (
                        <HeatmapItem key={i} {...h} />
                      ))}
                    </div>
                    <div className="bg-gray-50 rounded-[2.5rem] p-8 space-y-6">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Strengths</h5>
                      <div className="flex flex-wrap gap-2">
                        {results.strengths.map((s: string) => (
                          <span key={s} className="px-4 py-2 bg-green-50 text-green-600 border border-green-100 rounded-xl text-[10px] font-black uppercase tracking-widest">{s}</span>
                        ))}
                      </div>
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pt-4">Improvements</h5>
                      <div className="flex flex-wrap gap-2">
                        {results.weaknesses.map((w: string) => (
                          <span key={w} className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest">{w}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-[#111827] text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-white/5"
                  >
                    <div className="relative z-10">
                      <Award className="w-10 h-10 text-yellow-400 mb-6" />
                      <h4 className="text-xl font-black uppercase tracking-tighter mb-4">Unlock Proof Badge</h4>
                      <p className="text-white/60 text-xs font-medium mb-8">Verified evidence of your logic scores to display on LinkedIn.</p>
                      <button className="w-full py-4 bg-white text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-[#7C3AED] group-hover:text-white transition-all">Claim Authority</button>
                    </div>
                  </motion.div>

                  <button
                    onClick={() => setStep('config')}
                    className="w-full flex items-center justify-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-gray-900 transition-all pt-4"
                  >
                    <RefreshCw className="w-4 h-4" /> Retake Audit
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      <div className="fixed inset-0 bg-grid-black/[0.02] pointer-events-none -z-10" />
    </div>
  );
};

export default Assessment;
