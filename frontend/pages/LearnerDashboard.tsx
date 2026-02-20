
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';
import { useAuth } from '../AuthContext';
import { auth, githubProvider } from '../firebase';
import { signOut, signInWithPopup, GithubAuthProvider, linkWithPopup } from 'firebase/auth';
import DashboardFooter from '../components/DashboardFooter';

const CircularProgress = ({ value, size = 180, strokeWidth = 12, color = "#7C3AED", label = "Score" }: { value: number, size?: number, strokeWidth?: number, color?: string, label: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-black tracking-tighter" style={{ color }}>{value}</span>
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-1">{label}</span>
      </div>
    </div>
  );
};

const LearnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'profile' | 'knowledge' | 'leaderboard' | 'matches'>('profile');
  const [activeTab, setActiveTab] = useState<'overall' | 'dev' | 'ai'>('overall');
  const [githubData, setGithubData] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(`github_data_${user?.uid}`);
    if (savedData) {
      setGithubData(JSON.parse(savedData));
    }

    // Check if we have a token to analyze if data is missing
    const token = sessionStorage.getItem('github_token');
    if (token && !savedData) {
      handleAnalyze(token);
    }
  }, [user]);

  const handleConnectGitHub = async () => {
    try {
      setAnalyzing(true);
      setError(null);
      const result = await signInWithPopup(auth, githubProvider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (token) {
        sessionStorage.setItem('github_token', token);
        await handleAnalyze(token);
      }
    } catch (err: any) {
      setError(err.message);
      setAnalyzing(false);
    }
  };

  const handleAnalyze = async (token: string) => {
    try {
      setAnalyzing(true);
      const res = await fetch(`${API_BASE_URL}/analyze-github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email: user?.email })
      });
      const data = await res.json();
      if (data.success) {
        setGithubData(data.data);
        localStorage.setItem(`github_data_${user?.uid}`, JSON.stringify(data.data));
      } else {
        setError(data.error || "Analysis protocol failed.");
      }
    } catch (err: any) {
      setError("Analysis protocol failed. Check uplink.");
    } finally {
      setAnalyzing(false);
    }
  };

  const sidebarItems = [
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'knowledge', label: 'Tech Stack', icon: '🕸️' },
    { id: 'leaderboard', label: 'Rankings', icon: '🏆' },
    { id: 'matches', label: 'Opportunities', icon: '💼' },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'knowledge':
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-[#111827]">Knowledge Graph</h2>
            <div className="bg-white border border-gray-100 rounded-[2rem] p-12 flex flex-col items-center text-center space-y-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]" />
              <div className="w-24 h-24 bg-[#F5F3FF] rounded-full flex items-center justify-center text-4xl shadow-inner relative">
                <span className="relative z-10">🕸️</span>
                <div className="absolute inset-0 rounded-full border-4 border-[#7C3AED]/10" />
              </div>
              <div className="max-w-xl space-y-4">
                <h3 className="text-2xl font-black uppercase tracking-tight text-[#111827]">Skill Entropy Map</h3>
                <p className="text-gray-500 uppercase tracking-widest text-xs font-bold leading-relaxed">
                  Visualizing your architectural reach across the Studlyf Standard.
                  <br />
                  <span className="text-[#7C3AED]">Current Entropy: Low (Highly Organized)</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
                {[
                  { label: "System Design", score: 92, draft: "High" },
                  { label: "Algorithms", score: 85, draft: "Mid" },
                  { label: "Database Arch", score: 88, draft: "High" },
                  { label: "Cloud Native", score: 76, draft: "Mid" },
                  { label: "Security", score: 95, draft: "Elite" },
                  { label: "DevOps", score: 82, draft: "Mid" }
                ].map((skill, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-start gap-3 hover:border-[#7C3AED]/30 transition-all group cursor-default">
                    <div className="w-full flex justify-between items-start">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{skill.draft} Tier</span>
                      <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                    </div>
                    <h4 className="text-lg font-bold text-[#111827] uppercase tracking-tight group-hover:text-[#7C3AED] transition-colors">{skill.label}</h4>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-[#7C3AED]" style={{ width: `${skill.score}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-500 mt-1">{skill.score}% Coverage</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'leaderboard':
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-[#111827]">Global Rankings</h2>
            <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
              {[
                { rank: 1, name: "Sarah Q.", score: 98.2, status: "Verified", movement: "▲" },
                { rank: 2, name: "James L.", score: 96.5, status: "Verified", movement: "-" },
                { rank: 3, name: "Alex P.", score: 75.4, status: "Active", highlighted: true, movement: "▲" },
                { rank: 4, name: "Mira K.", score: 74.1, status: "Active", movement: "▼" },
                { rank: 5, name: "Chen W.", score: 72.8, status: "Active", movement: "▲" }
              ].map((u, i) => (
                <div key={i} className={`flex items-center justify-between p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${u.highlighted ? 'bg-[#F5F3FF] hover:bg-[#F5F3FF]' : ''}`}>
                  <div className="flex items-center gap-6">
                    <div className={`w-8 h-8 flex items-center justify-center font-black ${i < 3 ? 'text-[#7C3AED]' : 'text-gray-400'}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#0${u.rank}`}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-xs text-gray-500 border-2 border-white shadow-sm">
                      {u.name[0]}
                    </div>
                    <span className="font-bold text-sm uppercase tracking-tight text-[#111827]">{u.name}</span>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="hidden sm:inline-block text-[10px] font-bold text-[#7C3AED] uppercase tracking-widest bg-white px-3 py-1 rounded-md border border-[#7C3AED]/10">{u.status}</span>
                    <div className="text-right">
                      <span className="block font-black text-lg tracking-tighter text-[#111827]">{u.score}</span>
                      <span className={`text-[10px] font-bold ${u.movement === '▲' ? 'text-green-500' : u.movement === '▼' ? 'text-red-500' : 'text-gray-400'}`}>{u.movement} This Week</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-gray-50 text-center">
                <button className="text-[10px] font-black uppercase tracking-widest text-[#7C3AED] hover:underline">View Top 100</button>
              </div>
            </div>
          </div>
        );
      case 'matches':
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-[#111827]">Job Matches</h2>
            <div className="grid gap-6">
              {[
                { company: "Nirvaha", role: "Junior Architect", match: "89%", pay: "$85k - $110k", tags: ["React", "Node.js"] },
                { company: "DataFlow", role: "Systems Engineer", match: "72%", pay: "$90k - $125k", tags: ["Python", "AWS"] },
                { company: "TechCorp", role: "Frontend Dev", match: "65%", pay: "$75k - $95k", tags: ["Vue", "CSS"] }
              ].map((job, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between shadow-sm hover:border-[#7C3AED]/30 hover:shadow-lg hover:shadow-[#7C3AED]/5 transition-all group">
                  <div className="mb-4 sm:mb-0 text-center sm:text-left">
                    <span className="text-[9px] font-black text-[#7C3AED] uppercase tracking-[0.3em] mb-2 block">{job.company}</span>
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-2 group-hover:text-[#7C3AED] transition-colors">{job.role}</h3>
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                      <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-md">{job.pay}</span>
                      {job.tags.map(t => <span key={t} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border border-gray-100 px-2 py-1 rounded-md">{t}</span>)}
                    </div>
                  </div>
                  <div className="text-center sm:text-right flex flex-col items-center sm:items-end gap-3">
                    <div>
                      <span className="block text-3xl font-black tracking-tighter text-[#111827]">{job.match}</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Match Strength</span>
                    </div>
                    <button className="bg-[#111827] text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#7C3AED] transition-colors shadow-lg">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
      default:
        return (
          <>
            {/* Profile Card Section */}
            <section className="bg-[#FFFFFF] border border-gray-100 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 mb-8 sm:mb-12 relative overflow-hidden group shadow-sm">
              <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center lg:items-start relative z-10">
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 sm:w-40 sm:h-40 bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] rounded-[1.5rem] sm:rounded-[2.5rem] flex items-center justify-center text-white font-black text-3xl sm:text-5xl shadow-2xl shadow-[#7C3AED]/30 relative overflow-hidden">
                    {githubData?.avatar_url ? (
                      <img src={githubData.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                      user?.displayName?.split(' ').map(n => n[0]).join('') || 'AL'
                    )}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 border-4 border-white rounded-full flex items-center justify-center z-10">
                      <span className="text-white text-[8px] sm:text-[10px]">✓</span>
                    </div>
                  </div>
                  <button className="mt-6 text-[8px] sm:text-[9px] font-bold text-[#7C3AED] uppercase tracking-widest bg-[#F5F3FF] border border-[#7C3AED]/10 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl hover:bg-[#7C3AED] hover:text-white transition-all shadow-sm">Verify College</button>
                </div>

                <div className="flex-grow text-center lg:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-[#111827]">{user?.displayName || 'Elite Protocol'}</h2>
                    <button className="text-gray-200 hover:text-[#7C3AED] transition-colors">
                      <svg className="w-5 h-5 sm:w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-[#475569]">
                    <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Primary ID</label>
                      <p className="text-xs sm:text-sm font-bold truncate">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">GitHub Authority</label>
                      <button
                        onClick={handleConnectGitHub}
                        className="text-xs sm:text-sm font-bold text-[#7C3AED] hover:underline flex items-center justify-center lg:justify-start gap-2 group/gh"
                      >
                        {githubData?.username ? `github.com/${githubData.username}` : (analyzing ? 'Synchronizing...' : 'Not Connected')}
                        <svg className={`w-3 h-3 ${analyzing ? 'animate-spin' : 'group-hover/gh:translate-x-0.5 transition-transform'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </button>
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Graduation Horizon</label>
                      <p className="text-xs sm:text-sm font-bold italic">Class of 2026</p>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-80 space-y-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-bold text-[#111827] uppercase tracking-widest">Open to Work</p>
                      <p className="text-[7px] sm:text-[8px] text-gray-400 uppercase tracking-widest mt-0.5">Matched with partners</p>
                    </div>
                    <div className="w-10 h-5 sm:w-12 sm:h-6 bg-[#7C3AED] rounded-full relative p-1 cursor-pointer">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full absolute right-1 shadow-md" />
                    </div>
                  </div>
                  <button className="w-full py-4 sm:py-5 bg-[#FFFFFF] border border-gray-100 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] hover:border-[#7C3AED]/30 transition-all flex items-center justify-center gap-3 shadow-sm">
                    Skill Resume
                  </button>
                  <button
                    onClick={() => {
                      const token = sessionStorage.getItem('github_token');
                      if (token) handleAnalyze(token);
                    }}
                    disabled={analyzing}
                    className="w-full py-4 sm:py-5 bg-[#7C3AED] text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#6D28D9] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#7C3AED]/20 disabled:opacity-50"
                  >
                    {analyzing ? 'Analyzing...' : 'Re-analyze'}
                  </button>
                </div>
              </div>
            </section>

            {/* Performance Hub Section */}
            <section className="bg-[#FFFFFF] border border-gray-100 rounded-[2rem] sm:rounded-[4rem] p-6 sm:p-12 mb-12 relative overflow-hidden shadow-sm">
              <div className="text-center mb-8 sm:mb-16">
                <p className="text-[9px] sm:text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.3em] sm:tracking-[0.5em] mb-4">PERFORMANCE HUB</p>
                <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-[#111827]">Readiness Score.</h2>
              </div>

              <div className="flex justify-center mb-10 sm:mb-16">
                <div className="flex flex-wrap justify-center bg-gray-50 p-1 rounded-xl sm:rounded-2xl border border-gray-100">
                  {['overall', 'dev', 'ai'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-4 sm:px-8 py-2 sm:py-3.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#7C3AED] text-white shadow-xl shadow-[#7C3AED]/20' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 sm:gap-12 items-center">
                <div className="flex flex-col items-center">
                  <CircularProgress
                    value={githubData ? Math.round(githubData.readiness_score) : (analyzing ? 20 : 0)}
                    size={240}
                    strokeWidth={16}
                    color="#7C3AED"
                    label={analyzing ? "Analyzing..." : "Studlyf Score"}
                  />
                  {githubData?.languages && (
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                      {Object.entries(githubData.languages).map(([lang, pct]: any) => (
                        <span key={lang} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                          {lang}: {pct}%
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 grid md:grid-cols-2 gap-6 sm:gap-8">
                  {[
                    { label: 'Backend', val: githubData?.skills?.Backend || 0 },
                    { label: 'Frontend', val: githubData?.skills?.Frontend || 0 },
                    { label: 'GenAI', val: githubData?.skills?.GenAI || 0 },
                    { label: 'DevOps', val: githubData?.skills?.DevOps || 0 }
                  ].map((s) => (
                    <div key={s.label} className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-10 flex flex-col items-center group hover:border-[#7C3AED]/30 transition-all shadow-sm">
                      <CircularProgress value={s.val} size={140} strokeWidth={10} color="#7C3AED" label={s.label} />
                      <p className="mt-6 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{s.val} / 100</p>
                      <button className="w-full py-3 bg-[#F5F3FF] text-[#7C3AED] rounded-xl text-[9px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 group-hover:bg-[#7C3AED] group-hover:text-white transition-all">Insights</button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex font-sans text-[#111827] selection:bg-[#7C3AED] selection:text-white pt-20 sm:pt-28 lg:pt-32">
      <aside className="w-72 bg-[#FFFFFF] border-r border-gray-100 flex flex-col p-8 shrink-0 hidden lg:flex">
        <Link to="/" className="flex items-center gap-3 mb-16 px-2 group">
          <div className="w-10 h-10 bg-[#7C3AED] rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-[#7C3AED]/20 group-hover:rotate-6 transition-all">S</div>
          <div className="flex flex-col">
            <span className="font-syne font-black text-[#111827] tracking-tighter text-lg leading-none">STUDLYF</span>
            <span className="text-[7px] text-gray-400 uppercase tracking-[0.3em] font-mono mt-1 font-bold">Protocol</span>
          </div>
        </Link>
        <nav className="space-y-3 flex-grow">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full text-left px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-4 group ${activeView === item.id ? 'bg-[#7C3AED] text-white shadow-xl shadow-[#7C3AED]/20' : 'text-gray-400 hover:text-[#7C3AED] hover:bg-gray-50'}`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <Link
            to="/dashboard/learner"
            className="w-full text-left px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-4 group text-gray-400 hover:text-[#7C3AED] hover:bg-gray-50"
          >
            <span className="text-base">🏠</span>
            Hub Home
          </Link>
          <button
            key="logout"
            onClick={() => signOut(auth)}
            className="w-full text-left px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-4 group text-red-400 hover:text-red-500 hover:bg-red-50"
          >
            <span className="text-base">🚪</span>
            Logout
          </button>
        </nav>

      </aside>

      <main className="flex-grow overflow-y-auto bg-gray-50/30">
        <div className="p-4 sm:p-6 lg:p-12">



          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
        <DashboardFooter />
      </main>
    </div>
  );
};

export default LearnerDashboard;