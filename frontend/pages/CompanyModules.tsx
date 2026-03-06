import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ChevronRight,
  Search,
  LayoutGrid,
  Unlock,
  CheckCircle2,
  Clock,
  Medal,
  Cpu,
  Terminal,
  Briefcase,
  ArrowLeft,
  Play,
  Bot,
  MessageSquare,
  BarChart3,
  BookOpen,
  Zap,
  Info,
  ChevronDown,
  Globe
} from 'lucide-react';

// --- Types ---

interface DSAQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: number;
  tags: string[];
  input: string;
  output: string;
  approach: string;
  code: { [key: string]: string };
  time: string;
  space: string;
}

interface TechQuestion {
  category: 'Core CS' | 'Language' | 'System Design' | 'Cloud';
  question: string;
  answer: string;
  keyPoints: string[];
  followUps: string[];
}

interface HRQuestion {
  question: string;
  modelAnswer: string;
  aiTips: string;
}

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  hiringRoles: string[];
  interviewRounds: string[];
  salaryRange: string;
  culture: string;
  difficulty: 'Moderate' | 'High' | 'Elite';
  completion: number;
  brandColor: string; // Added for attractive animations
  dsa: DSAQuestion[];
  technical: TechQuestion[];
  hr: HRQuestion[];
  stats: {
    placed: string;
    avgpackage: string;
  };
}

// --- Mock Data ---

const MOCK_COMPANIES: Company[] = [
  {
    id: 'google',
    name: 'Google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    industry: 'Software & Technology',
    hiringRoles: ['SDE I', 'SDE II', 'Cloud Architect'],
    interviewRounds: ['OA', '3-4 Technical Rounds', 'Googliness (HR)'],
    salaryRange: '₹30L - ₹60L+',
    brandColor: '#4285F4',
    culture: 'Innovation, Ownership, Chaos Harmony',
    difficulty: 'Elite',
    completion: 0,
    stats: { placed: '120+', avgpackage: '32 LPA' },
    dsa: [
      {
        id: '1',
        title: 'Longest Palindromic Substring',
        difficulty: 'Medium',
        frequency: 85,
        tags: ['String', 'DP'],
        input: '"babad"',
        output: '"bab"',
        approach: 'Expand around center or Use DP table.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: { python: 'def longest(s): ...', java: 'public String longest(String s) { ... }' }
      }
    ],
    technical: [
      {
        category: 'System Design',
        question: 'Design a Global Rate Limiter',
        answer: 'Use Token Bucket or Leaky Bucket algorithm with Redis for distributed state.',
        keyPoints: ['Latency', 'Consistency', 'Fallbacks'],
        followUps: ['How to handle sudden traffic spikes?']
      }
    ],
    hr: [
      {
        question: 'Tell me about a time you had a conflict with a teammate.',
        modelAnswer: 'Focused on objective outcomes rather than personal friction...',
        aiTips: 'Emphasize Googliness and psychological safety.'
      }
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    industry: 'Ecommerce & AWS',
    hiringRoles: ['SDE', 'Data Engineer', 'Solutions Architect'],
    interviewRounds: ['Online Assessment', 'Technical Phone Screen', 'Bar Raiser (Onsite)'],
    salaryRange: '₹25L - ₹50L',
    brandColor: '#FF9900',
    culture: 'Customer Obsession, Leadership Principles',
    difficulty: 'Elite',
    completion: 0,
    stats: { placed: '200+', avgpackage: '28 LPA' },
    dsa: [],
    technical: [],
    hr: []
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    industry: 'Enterprise Software',
    hiringRoles: ['SDE', 'Security Engineer'],
    interviewRounds: ['Codility OA', '3 Technical Rounds', 'AA Round'],
    salaryRange: '₹22L - ₹45L',
    brandColor: '#00A4EF',
    culture: 'Growth Mindset, Diversity',
    difficulty: 'High',
    completion: 0,
    stats: { placed: '150+', avgpackage: '24 LPA' },
    dsa: [],
    technical: [],
    hr: []
  },
  {
    id: 'netflix',
    name: 'Netflix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    industry: 'Entertainment & Streaming',
    hiringRoles: ['UI Engineer', 'Content SRE'],
    interviewRounds: ['Tech Screen', 'Panel Interview', 'Culture Fit'],
    salaryRange: '₹40L - ₹80L',
    brandColor: '#E50914',
    culture: 'Freedom & Responsibility',
    difficulty: 'Elite',
    completion: 0,
    stats: { placed: '45+', avgpackage: '42 LPA' },
    dsa: [],
    technical: [],
    hr: []
  },
  {
    id: 'meta',
    name: 'Meta',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    industry: 'Social Media & VR',
    hiringRoles: ['Product Engineer', 'ML Engineer'],
    interviewRounds: ['Ninja Mix', 'Technical Rounds', 'Behavioral'],
    salaryRange: '₹35L - ₹70L',
    brandColor: '#0668E1',
    culture: 'Move Fast, Build Awesome Things',
    difficulty: 'Elite',
    completion: 0,
    stats: { placed: '90+', avgpackage: '35 LPA' },
    dsa: [],
    technical: [],
    hr: []
  },
  {
    id: 'apple',
    name: 'Apple',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    industry: 'Consumer Electronics',
    hiringRoles: ['Hardeare Engineer', 'iOS Developer'],
    interviewRounds: ['Initial Chat', 'Technical Deep Dive', 'Team Interaction'],
    salaryRange: '₹30L - ₹65L',
    brandColor: '#000000',
    culture: 'Secrecy, Perfection, Quality',
    difficulty: 'Elite',
    completion: 0,
    stats: { placed: '35+', avgpackage: '38 LPA' },
    dsa: [],
    technical: [],
    hr: []
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    logo: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg',
    industry: 'AI & GPU Computing',
    hiringRoles: ['GPU Architect', 'AI Researcher'],
    interviewRounds: ['Skill Test', 'Domain Rounds', 'HR'],
    salaryRange: '₹35L - ₹75L',
    brandColor: '#76B900',
    culture: 'Accelerating Tomorrow',
    difficulty: 'Elite',
    completion: 0,
    stats: { placed: '20+', avgpackage: '45 LPA' },
    dsa: [],
    technical: [],
    hr: []
  },
  {
    id: 'uber',
    name: 'Uber',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
    industry: 'Mobility & Logistics',
    hiringRoles: ['Backend SDE', 'Mobile Developer'],
    interviewRounds: ['Code Pair', 'System Design', 'Bar Raiser'],
    salaryRange: '₹28L - ₹55L',
    brandColor: '#000000',
    culture: 'Go Get It',
    difficulty: 'High',
    completion: 0,
    stats: { placed: '70+', avgpackage: '29 LPA' },
    dsa: [],
    technical: [],
    hr: []
  },
  {
    id: 'tcs',
    name: 'TCS',
    logo: '/images/tcs.png',
    industry: 'IT Services',
    hiringRoles: ['Ninja', 'Digital', 'Prime'],
    interviewRounds: ['NQT', 'Technical Round', 'HR Round'],
    salaryRange: '₹3.5L - ₹9L',
    brandColor: '#004C99',
    culture: 'Stability, Teamwork, Scale',
    difficulty: 'Moderate',
    completion: 0,
    stats: { placed: '1000+', avgpackage: '4.5 LPA' },
    dsa: [],
    technical: [],
    hr: []
  },
  {
    id: 'infosys',
    name: 'Infosys',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
    industry: 'Business Consulting & IT',
    hiringRoles: ['System Engineer', 'SES', 'Power Programmer'],
    interviewRounds: ['InfyTQ', 'Technical Interview', 'HR'],
    salaryRange: '₹4L - ₹12L',
    brandColor: '#007CC3',
    culture: 'Learnability, Excellence',
    difficulty: 'Moderate',
    completion: 0,
    stats: { placed: '800+', avgpackage: '5.2 LPA' },
    dsa: [],
    technical: [],
    hr: []
  },
  {
    id: 'wipro',
    name: 'Wipro',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg',
    industry: 'IT Consulting',
    hiringRoles: ['Project Engineer', 'Turbo'],
    interviewRounds: ['NTH', 'Technical', 'HR'],
    salaryRange: '₹3.5L - ₹8.5L',
    brandColor: '#000000',
    culture: 'Spirit of Wipro, Integrity',
    difficulty: 'Moderate',
    completion: 0,
    stats: { placed: '600+', avgpackage: '4.2 LPA' },
    dsa: [],
    technical: [],
    hr: []
  },
  {
    id: 'accenture',
    name: 'Accenture',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg',
    industry: 'Professional Services',
    hiringRoles: ['ASE', 'SADA'],
    interviewRounds: ['Cognitive Assessment', 'Technical Interview', 'HR'],
    salaryRange: '₹4.5L - ₹11L',
    brandColor: '#A100FF',
    culture: 'High Performance, Delivered',
    difficulty: 'Moderate',
    completion: 0,
    stats: { placed: '900+', avgpackage: '5.5 LPA' },
    dsa: [],
    technical: [],
    hr: []
  }
];

// --- Theme Constants (Light Mode Refinement) ---
const THEME = {
  bg: '#FFFFFF',
  primary: '#6C3BFF',
  secondary: '#7C3AED',
  accent: '#9D7CFF',
  text: '#111827',
  muted: '#64748B',
  card: '#F8FAFC',
  border: '#E2E8F0'
};

const CompanyModules: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'dsa' | 'tech' | 'hr' | 'ai'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCompanies = MOCK_COMPANIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 sm:px-8 font-['Poppins'] bg-white transition-colors duration-500">
      <AnimatePresence mode="wait">
        {!selectedCompany ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto"
          >


            <header className="mb-20 text-center flex flex-col items-center">
              <div className="max-w-4xl mx-auto mb-16">
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#7C3AED]/10 text-[#7C3AED] px-4 py-1.5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] mb-8 inline-block"
                >
                  Partner Gates • Institutional Access
                </motion.span>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase text-[#111827] whitespace-nowrap">
                  COMPANY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DFF] via-[#EC4899] to-[#FF5B5B] inline-block">MODULES.</span>
                </h1>
                <p className="text-lg sm:text-xl text-[#64748B] max-w-3xl mx-auto font-medium leading-relaxed">
                  Personalized preparation dashboards for global tech giants. Master the exact hiring patterns and ship like a pro.
                </p>
              </div>

              <div className="relative w-full max-w-xl mx-auto group mb-16">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" />
                <input
                  type="text"
                  placeholder="Search gates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[2rem] py-5 pl-14 pr-8 text-sm shadow-sm focus:outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 transition-all text-black placeholder:text-black font-medium"
                />
              </div>
            </header>

            {/* Quick Stats - Enhanced Visuals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {[
                { label: 'Active Gates', val: '24', icon: ShieldCheck, color: '#7C3AED' },
                { label: 'DSA Logic', val: '1.2k+', icon: Cpu, color: '#9D7CFF' },
                { label: 'Avg Feedback', val: '4.9', icon: Medal, color: '#EC4899' },
                { label: 'Placements', val: '15k+', icon: Briefcase, color: '#06B6D4' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative group bg-white border border-[#E2E8F0] p-8 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:rotate-12 transition-transform" style={{ background: `${s.color}15`, color: s.color }}>
                      <s.icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-black text-[#111827] mb-1">{s.val}</div>
                    <div className="text-[10px] uppercase tracking-widest text-[#64748B] font-bold">{s.label}</div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: s.color }} />
                </motion.div>
              ))}
            </div>

            {/* List Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCompanies.map((company, i) => (
                <motion.div
                  key={company.id}
                  layoutId={company.id}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="bg-white border border-[#E2E8F0] rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all"
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 blur-3xl rounded-full" />

                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-white p-2 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform border border-gray-50">
                      <img src={company.logo} alt={company.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${company.difficulty === 'Elite' ? 'bg-red-50 text-red-500' :
                      company.difficulty === 'High' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'
                      }`}>
                      {company.difficulty}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 text-[#111827] group-hover:text-[#7C3AED] transition-colors">{company.name}</h3>
                  <p className="text-xs text-[#64748B] mb-6 font-medium">{company.industry}</p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-[#64748B]">
                      <span>Progress</span>
                      <span>{company.completion}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${company.completion}%` }}
                        className="h-full bg-gradient-to-r from-[#7C3AED] to-[#9D7CFF]"
                      />
                    </div>
                  </div>

                  <button className="w-full py-4 bg-[#F8FAFC] text-[#7C3AED] font-black text-xs uppercase tracking-widest rounded-2xl group-hover:bg-[#7C3AED] group-hover:text-white transition-all flex items-center justify-center gap-2 border border-[#E2E8F0] group-hover:border-transparent">
                    Enter Gate <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] border-dashed rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center opacity-60">
                <Unlock className="w-8 h-8 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold mb-1 text-[#111827]">More Gates</h3>
                <p className="text-xs text-[#64748B] uppercase tracking-widest font-black">Syncing Protocols...</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            {/* Dashboard Header - With Brand Thematic Background */}
            <div className="relative mb-12 rounded-[3.5rem] overflow-hidden group">
              <div
                className="absolute inset-0 opacity-10 blur-3xl"
                style={{ backgroundColor: selectedCompany.brandColor }}
              />
              <div className="relative flex flex-col lg:flex-row gap-12 items-start lg:items-center justify-between p-8 lg:p-12">
                <div className="flex items-center gap-8">
                  <motion.button
                    whileHover={{ x: -5 }}
                    onClick={() => setSelectedCompany(null)}
                    className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#7C3AED]/50 transition-all text-[#111827] shadow-sm"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </motion.button>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white p-3 rounded-3xl flex items-center justify-center shadow-xl border border-gray-50">
                      <img src={selectedCompany.logo} alt="" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black mb-1 text-[#111827]">{selectedCompany.name}</h2>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-[#64748B] flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> {selectedCompany.industry}
                        </span>
                        <div className="h-1 w-1 bg-gray-200 rounded-full" />
                        <span className="text-xs font-bold text-[#7C3AED]">{selectedCompany.difficulty} Difficulty</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                  <div className="flex-grow bg-[#F8FAFC] border border-[#E2E8F0] px-6 py-4 rounded-2xl shadow-sm">
                    <div className="text-[10px] uppercase font-black text-[#64748B] mb-1">Success Rate</div>
                    <div className="text-xl font-bold text-[#111827]">{selectedCompany.stats.placed} Students</div>
                  </div>
                  <div className="flex-grow bg-[#F8FAFC] border border-[#E2E8F0] px-6 py-4 rounded-2xl shadow-sm">
                    <div className="text-[10px] uppercase font-black text-[#64748B] mb-1">Avg Package</div>
                    <div className="text-xl font-bold text-[#111827]">{selectedCompany.stats.avgpackage}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-72 space-y-2">
                {[
                  { id: 'overview', label: 'Company Overview', icon: LayoutGrid },
                  { id: 'dsa', label: 'DSA Practice', icon: Terminal },
                  { id: 'tech', label: 'Technical Questions', icon: Cpu },
                  { id: 'hr', label: 'HR Interviews', icon: Briefcase },
                  { id: 'ai', label: 'AI Mock Agent', icon: Bot, premium: true },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${activeTab === t.id
                      ? 'bg-[#7C3AED]/10 border-[#7C3AED] text-[#7C3AED]'
                      : 'bg-transparent border-transparent text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111827]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <t.icon className="w-5 h-5" />
                      <span className="text-sm font-bold">{t.label}</span>
                    </div>
                    {t.premium && <Bot className="w-4 h-4 text-amber-500" />}
                    {activeTab === t.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}

                <div className="mt-8 p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C3AED]/5 blur-2xl rounded-full" />
                  <BarChart3 className="w-8 h-8 text-[#7C3AED] mb-4" />
                  <h4 className="font-bold text-sm mb-2 text-[#111827]">Overall Progress</h4>
                  <div className="text-3xl font-black mb-4 text-[#111827]">{selectedCompany.completion}%</div>
                  <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#7C3AED]" style={{ width: `${selectedCompany.completion}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex-grow">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white border border-[#E2E8F0] rounded-[3rem] p-10 lg:p-16 min-h-[600px] shadow-sm"
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-12">
                        <section>
                          <h3 className="text-3xl font-black mb-8 flex items-center gap-3 text-[#111827]">
                            <Info className="w-8 h-8 text-[#7C3AED]" /> Overview
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-[#E2E8F0]">
                              <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-widest block mb-4">The Culture</span>
                              <p className="text-lg leading-relaxed text-[#64748B]">{selectedCompany.culture || "Customer-centric innovation and technical excellence."}</p>
                            </div>
                            <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-[#E2E8F0]">
                              <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-widest block mb-4">Salary Scope</span>
                              <div className="text-4xl font-black mb-2 text-[#111827]">{selectedCompany.salaryRange}</div>
                              <p className="text-xs text-[#64748B] uppercase tracking-widest font-bold">Standard package for Entry Level</p>
                            </div>
                          </div>
                        </section>

                        <section>
                          <h4 className="text-xl font-bold mb-6 text-[#111827]">Hiring Pattern & Structure</h4>
                          <div className="space-y-4">
                            {selectedCompany.interviewRounds.map((round, i) => (
                              <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-[#E2E8F0] group hover:border-[#7C3AED]/30 transition-all shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center font-black text-xl">
                                  {i + 1}
                                </div>
                                <div>
                                  <div className="font-bold text-lg text-[#111827]">{round}</div>
                                  <div className="text-xs text-[#64748B]">Elimination Round</div>
                                </div>
                                <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-[10px] uppercase font-black text-[#7C3AED]">Resource Ready</span>
                                  <Zap className="w-4 h-4 text-[#7C3AED]" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    )}

                    {activeTab === 'dsa' && (
                      <div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                          <div>
                            <h3 className="text-3xl font-black mb-2 text-[#111827]">DSA Matrix</h3>
                            <p className="text-[#64748B] text-sm">Targeted algorithmic protocols for {selectedCompany.name}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {(selectedCompany.dsa && selectedCompany.dsa.length > 0) ? selectedCompany.dsa.map((q) => (
                            <div key={q.id} className="p-8 bg-[#F8FAFC] rounded-[2.5rem] border border-[#E2E8F0] hover:border-[#7C3AED]/20 transition-all group shadow-sm">
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                <div className="flex items-center gap-4">
                                  <div className={`w-3 h-3 rounded-full ${q.difficulty === 'Hard' ? 'bg-red-500' : q.difficulty === 'Medium' ? 'bg-orange-500' : 'bg-green-500'}`} />
                                  <h4 className="text-2xl font-bold text-[#111827]">{q.title}</h4>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                  <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0]">
                                    <span className="text-[8px] font-black text-[#64748B] uppercase block mb-1">Complexity</span>
                                    <span className="font-bold text-[#111827]">{q.time} | {q.space}</span>
                                  </div>
                                  <button onClick={() => navigate('/job-prep/mock-interview')} className="w-full py-5 bg-[#7C3AED] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-lg shadow-[#7C3AED]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                                    <Play className="w-4 h-4 fill-white" /> Start Practice
                                  </button>
                                </div>
                                <div className="p-6 bg-white rounded-2xl border border-[#E2E8F0]">
                                  <span className="text-[10px] font-black text-[#7C3AED] uppercase block mb-2">Solution Insight</span>
                                  <p className="text-sm text-[#64748B] leading-relaxed">{q.approach}</p>
                                </div>
                              </div>
                            </div>
                          )) : (
                            <div className="py-20 text-center opacity-40">
                              <Terminal className="w-12 h-12 mx-auto mb-4 text-[#64748B]" />
                              <h4 className="text-xl font-bold text-[#111827]">Protocol Sync Pending</h4>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'tech' && (
                      <div className="space-y-8">
                        <div className="mb-12">
                          <h3 className="text-3xl font-black mb-2 text-[#111827]">Technical Core</h3>
                          <p className="text-[#64748B] text-sm">Deep dive into company-specific system expectations.</p>
                        </div>
                        <div className="grid gap-6">
                          {selectedCompany.technical.map((t, idx) => (
                            <div key={idx} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl overflow-hidden group shadow-sm">
                              <div className="p-8 flex items-center justify-between cursor-pointer">
                                <h4 className="text-xl font-bold text-[#111827]">{t.question}</h4>
                                <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-[#7C3AED] transition-all" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'hr' && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-3xl font-black mb-2 text-[#111827]">Behavioral Sync</h3>
                            <p className="text-[#64748B] text-sm">Cracking the {selectedCompany.name} culture fit.</p>
                          </div>
                          {selectedCompany.hr.map((h, i) => (
                            <div key={i} className="bg-[#F8FAFC] p-8 rounded-[2.5rem] border border-[#E2E8F0] shadow-sm">
                              <h4 className="text-lg font-bold mb-6 italic text-[#111827]">"{h.question}"</h4>
                              <p className="text-sm text-[#64748B] leading-relaxed mb-6">{h.modelAnswer}</p>
                              <button className="flex items-center gap-2 text-[10px] font-black uppercase text-[#7C3AED] hover:text-[#9D7CFF] transition-colors">
                                <MessageSquare className="w-4 h-4" /> Get AI Review
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="bg-[#F8FAFC] p-10 rounded-[3rem] border border-[#E2E8F0] relative overflow-hidden h-fit lg:sticky lg:top-8 shadow-sm">
                          <h4 className="text-xl font-black mb-8 flex items-center gap-3 text-[#111827]">
                            <Bot className="w-6 h-6 text-[#7C3AED]" /> Cultural Pillars
                          </h4>
                          <div className="space-y-6">
                            {['Adaptability', 'Data Mindset', 'Team Sync'].map((p, i) => (
                              <div key={i} className="flex gap-4">
                                <CheckCircle2 className="w-5 h-5 text-[#7C3AED] flex-shrink-0" />
                                <div className="font-bold text-sm text-[#111827]">{p}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'ai' && (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20">
                        <div className="w-32 h-32 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mb-12 relative shadow-inner">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full bg-[#7C3AED]/5"
                          />
                          <Bot className="w-16 h-16 text-[#7C3AED]" />
                        </div>
                        <h3 className="text-4xl font-black mb-4 text-[#111827]">Neural Mock Agent</h3>
                        <p className="text-lg text-[#64748B] max-w-xl mb-12 font-medium">
                          Deploying a specialized AI interviewer calibrated for {selectedCompany.name}'s current hiring protocols.
                        </p>

                        <button
                          onClick={() => navigate('/job-prep/mock-interview')}
                          className="px-12 py-6 bg-gradient-to-r from-[#7C3AED] to-[#9D7CFF] text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-[#7C3AED]/30 hover:scale-105 transition-all flex items-center gap-4"
                        >
                          Initialize Mock Round <Zap className="w-5 h-5" />
                        </button>

                        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-[10px] font-black uppercase text-[#64748B]">
                          <span className="flex items-center gap-2"><Medal className="w-4 h-4" /> Live Scoring</span>
                          <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Speech Analysis</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanyModules;
