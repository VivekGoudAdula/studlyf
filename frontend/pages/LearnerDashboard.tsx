
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth, githubProvider } from '../firebase';
import { signOut, signInWithPopup, GithubAuthProvider } from 'firebase/auth';



const CircularProgress = ({ value, size = 180, strokeWidth = 12, color = "#7C3AED", label = "Score" }: { value: number, size?: number, strokeWidth?: number, color?: string, label: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-100"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          fill="transparent"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl sm:text-3xl font-black text-[#111827] tracking-tighter">{value}</span>
        <span className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</span>
      </div>
    </div>
  );
};

const LearnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overall' | 'dev' | 'ai'>('overall');
  const [activeView, setActiveView] = useState<'profile' | 'graph' | 'leaderboard' | 'matches'>('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [githubData, setGithubData] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('github_token');
    if (token && !githubData && !analyzing) {
      handleAnalyze(token);
    }
  }, []);

  const handleAnalyze = async (token: string) => {
    setAnalyzing(true);
    try {
      const response = await fetch('http://localhost:8000/api/analyze-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await response.json();
      setGithubData(data);
      sessionStorage.setItem('github_analysis', JSON.stringify(data));
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setAnalyzing(false);
    }
  };


  const sidebarItems = [
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'graph', label: 'Knowledge Graph', icon: '🕸️' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'matches', label: 'My Matches', icon: '💼' }
  ];

  const renderView = () => {
    switch (activeView) {
      case 'graph':
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-[#111827]">Knowledge Graph</h2>
            <div className="bg-white border border-gray-100 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
              <div className="w-24 h-24 bg-[#F5F3FF] rounded-full flex items-center justify-center text-4xl">🕸️</div>
              <p className="text-gray-500 max-w-sm uppercase tracking-widest text-xs font-bold">Visualizing your skill entropy. This interactive map displays your architectural reach across the Studlyf Standard.</p>
              <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-20 bg-gray-50 rounded-xl border border-gray-100 animate-pulse"></div>)}
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
                { rank: 1, name: "Sarah Q.", score: 98.2, status: "Verified" },
                { rank: 2, name: "James L.", score: 96.5, status: "Verified" },
                { rank: 3, name: "Alex P.", score: 75.4, status: "Active", highlighted: true },
                { rank: 4, name: "Mira K.", score: 74.1, status: "Active" }
              ].map((user, i) => (
                <div key={i} className={`flex items-center justify-between p-6 border-b border-gray-50 last:border-0 ${user.highlighted ? 'bg-[#F5F3FF]' : ''}`}>
                  <div className="flex items-center gap-6">
                    <span className="font-mono font-bold text-gray-400">#0{user.rank}</span>
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">{user.name[0]}</div>
                    <span className="font-bold text-sm uppercase tracking-tight">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-widest bg-white px-3 py-1 rounded-md border border-[#7C3AED]/10">{user.status}</span>
                    <span className="font-black text-lg tracking-tighter">{user.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'matches':
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-[#111827]">Job Matches</h2>
            <div className="grid gap-6">
              {[
                { company: "Nirvaha", role: "Junior Architect", match: "89%", pay: "$85k - $110k" },
                { company: "DataFlow", role: "Systems Engineer", match: "72%", pay: "$90k - $125k" }
              ].map((job, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-3xl p-8 flex items-center justify-between shadow-sm hover:border-[#7C3AED]/30 transition-all group">
                  <div>
                    <span className="text-[9px] font-black text-[#7C3AED] uppercase tracking-[0.3em] mb-2 block">{job.company}</span>
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-2 group-hover:text-[#7C3AED] transition-colors">{job.role}</h3>
                    <p className="text-xs text-gray-400 font-mono">{job.pay}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-black tracking-tighter text-[#111827]">{job.match}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Match Strength</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
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
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-[#475569]">
                    <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Primary ID</label>
                      <p className="text-xs sm:text-sm font-bold truncate">{user?.email}</p>
                    </div>

                    <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">GitHub Authority</label>
                      <Link to="#" className="text-xs sm:text-sm font-bold text-[#7C3AED] hover:underline flex items-center justify-center lg:justify-start gap-2">
                        {githubData?.username ? `github.com/${githubData.username}` : 'Not Connected'}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </Link>
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
                    <svg className="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
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
                    <svg className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
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
                  {[
                    { id: 'overall', label: 'Overall' },
                    { id: 'dev', label: 'Architecture' },
                    { id: 'ai', label: 'Verification' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 sm:px-8 py-2 sm:py-3.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#7C3AED] text-white shadow-xl shadow-[#7C3AED]/20' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 sm:gap-12 items-center">
                {/* Main Score */}
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
                  {githubData?.signals && (
                    <div className="mt-6 text-center">
                      <p className="text-[7px] font-black text-gray-300 uppercase tracking-[0.3em] mb-3">Verification Signals</p>
                      <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                        {githubData.signals.map((sig: string, i: number) => (
                          <span key={i} className="text-[9px] font-mono text-[#7C3AED] bg-[#F5F3FF] px-2 py-1 rounded">
                            {sig}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {!githubData && !analyzing && (
                    <div className="mt-8">
                      <button
                        onClick={async () => {
                          const result = await signInWithPopup(auth, githubProvider);
                          const credential = GithubAuthProvider.credentialFromResult(result);
                          if (credential?.accessToken) {
                            sessionStorage.setItem('github_token', credential.accessToken);
                            handleAnalyze(credential.accessToken);
                          }
                        }}
                        className="px-8 py-4 bg-[#111827] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                      >
                        Connect GitHub to Verify
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub Scores Bento */}
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-10 flex flex-col items-center group hover:border-[#7C3AED]/30 transition-all shadow-sm">
                    <CircularProgress
                      value={githubData?.skills?.Backend || 0}
                      size={140}
                      strokeWidth={10}
                      color="#7C3AED"
                      label="Backend"
                    />
                    <p className="mt-6 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{githubData?.skills?.Backend || 0} / 100</p>
                    <button className="w-full py-3 bg-[#F5F3FF] text-[#7C3AED] rounded-xl text-[9px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                      Insights
                    </button>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-10 flex flex-col items-center group hover:border-[#7C3AED]/30 transition-all shadow-sm">
                    <CircularProgress
                      value={githubData?.skills?.Frontend || 0}
                      size={140}
                      strokeWidth={10}
                      color="#7C3AED"
                      label="Frontend"
                    />
                    <p className="mt-6 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{githubData?.skills?.Frontend || 0} / 100</p>
                    <button className="w-full py-3 bg-[#F5F3FF] text-[#7C3AED] rounded-xl text-[9px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                      Verification
                    </button>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-10 flex flex-col items-center group hover:border-[#7C3AED]/30 transition-all shadow-sm">
                    <CircularProgress
                      value={githubData?.skills?.GenAI || 0}
                      size={140}
                      strokeWidth={10}
                      color="#7C3AED"
                      label="GenAI"
                    />
                    <p className="mt-6 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{githubData?.skills?.GenAI || 0} / 100</p>
                    <button className="w-full py-3 bg-[#F5F3FF] text-[#7C3AED] rounded-xl text-[9px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                      Analysis
                    </button>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-10 flex flex-col items-center group hover:border-[#7C3AED]/30 transition-all shadow-sm">
                    <CircularProgress
                      value={githubData?.skills?.DevOps || 0}
                      size={140}
                      strokeWidth={10}
                      color="#7C3AED"
                      label="DevOps"
                    />
                    <p className="mt-6 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{githubData?.skills?.DevOps || 0} / 100</p>
                    <button className="w-full py-3 bg-[#F5F3FF] text-[#7C3AED] rounded-xl text-[9px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                      Infrastructure
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex font-sans text-[#111827] selection:bg-[#7C3AED] selection:text-white">
      {/* Sidebar - Desktop Only */}
      <aside className="w-72 bg-[#FFFFFF] border-r border-gray-100 flex flex-col p-8 shrink-0 hidden lg:flex">
        <Link to="/" className="flex items-center gap-3 mb-16 px-2 group">
          <div className="w-10 h-10 bg-[#7C3AED] rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-[#7C3AED]/20 group-hover:rotate-6 transition-all">S</div>
          <div className="flex flex-col">
            <span className="font-syne font-black text-[#111827] tracking-tighter text-lg leading-none">STUDLYF</span>
            <span className="text-[7px] text-gray-400 uppercase tracking-[0.3em] font-mono mt-1 font-bold">Institution</span>
          </div>
        </Link>

        <nav className="space-y-3 flex-grow">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full text-left px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-4 group ${activeView === item.id ? 'bg-[#7C3AED] text-white shadow-xl shadow-[#7C3AED]/20' : 'text-gray-400 hover:text-[#7C3AED] hover:bg-[#F5F3FF]'
                }`}
            >
              <span className="text-base transition-all">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Logged In As</p>
            <p className="text-[10px] font-mono text-[#111827] truncate">{user?.email}</p>
          </div>

          <button
            onClick={() => signOut(auth)}
            className="w-full py-4 bg-red-50 border border-red-100 text-red-500 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto bg-gray-50/30">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-[120] bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center text-white font-syne font-black text-[10px]">S</div>
            <span className="font-bold text-[10px] uppercase tracking-widest">Studlyf Hub</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[130] bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                className="w-4/5 max-w-sm h-full bg-white p-8 flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#7C3AED] rounded-lg" />
                    <span className="font-black text-xs uppercase tracking-tighter">Studlyf</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <nav className="space-y-4">
                  {sidebarItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveView(item.id as any); setMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest ${activeView === item.id ? 'text-[#7C3AED] bg-[#F5F3FF]' : 'text-gray-500'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
                <button
                  onClick={() => signOut(auth)}
                  className="mt-auto w-full py-4 bg-red-50 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                >
                  Logout
                </button>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 sm:p-6 lg:p-12">
          {/* Top Announcement Bar */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full bg-[#7C3AED] rounded-2xl p-4 sm:p-5 mb-8 sm:mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-[#7C3AED]/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white text-center sm:text-left">Complete readiness profile</h4>
                <p className="text-[8px] sm:text-[10px] text-white/70 uppercase tracking-widest mt-0.5 text-center sm:text-left">Add clinical evidence to unlock matches</p>
              </div>
            </div>
            <button className="w-full sm:w-auto bg-white text-[#7C3AED] px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg">Add Info</button>
          </motion.div>

          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default LearnerDashboard;
