
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'learner' | 'partner'>('learner');

  const roleConfigs = {
    learner: {
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000",
      accent: "#7C3AED",
      tag: "CANDIDATE PORTAL",
      headline: "Own Your \nCapability.",
      desc: "Access your skill ledger and active certification tracks.",
      target: "/dashboard/learner"
    },
    partner: {
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000",
      accent: "#7C3AED",
      tag: "HIRING PARTNER GATEWAY",
      headline: "Verified \nTalent.",
      desc: "Connect with the top 1% of engineering readiness.",
      target: "/dashboard/partner"
    }
  };

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(roleConfigs[role].target);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-[#0F172A]">
      {/* Dynamic Background Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={roleConfigs[role].image} 
            className="w-full h-full object-cover grayscale contrast-125 brightness-[0.4]"
            alt="Background"
          />
          <div 
            className="absolute inset-0 transition-colors duration-1000"
            style={{ 
              background: `radial-gradient(circle at center, transparent 0%, #0F172A 90%), linear-gradient(to bottom right, ${roleConfigs[role].accent}20, transparent)` 
            }} 
          />
        </motion.div>
      </AnimatePresence>

      {/* Floating Logo Top Left */}
      <Link to="/" className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-3 z-50 group">
        <motion.div 
          animate={{ backgroundColor: roleConfigs[role].accent }}
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-all duration-500"
        >
          <span className="text-white font-syne font-black text-xs">S</span>
        </motion.div>
        <span className="text-white font-syne font-black tracking-tight hidden sm:inline text-lg">STUDLYF.</span>
      </Link>

      {/* Close Button Top Right */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 right-8 sm:top-12 sm:right-12 group flex items-center gap-3 text-white/40 hover:text-white transition-all font-bold text-[10px] uppercase tracking-[0.4em] z-50"
      >
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 backdrop-blur-md transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
      </button>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Side: Dynamic Messaging */}
        <div className="hidden lg:block flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-mono text-[10px] font-bold tracking-[0.5em] uppercase mb-8 block" style={{ color: roleConfigs[role].accent }}>
                {roleConfigs[role].tag}
              </span>
              <h1 className="text-white text-8xl font-display italic leading-[0.85] mb-8 whitespace-pre-line">
                {roleConfigs[role].headline}
              </h1>
              <p className="text-white/50 text-xl font-medium max-w-sm leading-relaxed">
                {roleConfigs[role].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Compact Authority Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          <div className="h-1.5 w-full transition-colors duration-1000" style={{ backgroundColor: roleConfigs[role].accent }} />
          
          <div className="p-10 sm:p-12">
            <div className="mb-10 lg:hidden">
                <span className="font-mono text-[9px] font-bold tracking-[0.4em] uppercase mb-2 block" style={{ color: roleConfigs[role].accent }}>
                    {roleConfigs[role].tag}
                </span>
                <h2 className="text-[#111827] text-4xl font-black tracking-tighter uppercase">Initialize.</h2>
            </div>
            
            <div className="mb-10 hidden lg:block">
                <h2 className="text-[#111827] text-5xl font-black tracking-tighter uppercase mb-2">Initialize.</h2>
                <p className="text-gray-400 font-medium text-sm">Authorized credentials required.</p>
            </div>

            {/* Premium Role Selector */}
            <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl mb-10 border border-gray-100 shadow-inner">
              {[
                { id: 'learner', label: 'Learner', icon: '◈' },
                { id: 'partner', label: 'Hiring Partner', icon: '⎔' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id as any)}
                  className={`flex-1 py-4 rounded-xl transition-all relative group/role ${
                    role === r.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <span className={`text-xl transition-transform duration-300 ${role === r.id ? 'scale-110' : 'opacity-40 group-hover/role:opacity-100'}`} style={{ color: role === r.id ? roleConfigs[role].accent : 'inherit' }}>
                        {r.icon}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest">{r.label}</span>
                  </div>
                  {role === r.id && (
                    <motion.div 
                      layoutId="activeRoleTab"
                      className="absolute inset-0 bg-white shadow-xl shadow-black/5 border border-gray-100 rounded-xl"
                    />
                  )}
                </button>
              ))}
            </div>

            <form className="space-y-6" onSubmit={handleAuthorize}>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block ml-1">Identity ID</label>
                <input 
                  type="email" 
                  placeholder="name@studlyf.io"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-gray-200 transition-all font-medium text-gray-900 placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block">Security Key</label>
                  <button type="button" className="text-[8px] font-bold uppercase tracking-widest hover:underline" style={{ color: roleConfigs[role].accent }}>Forgot Key?</button>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-gray-200 transition-all font-medium text-gray-900 placeholder:text-gray-300"
                />
              </div>

              <motion.button 
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="w-full py-6 text-white font-bold rounded-2xl text-[10px] uppercase tracking-[0.4em] shadow-2xl transition-all mt-6"
                style={{ backgroundColor: roleConfigs[role].accent }}
              >
                Authorize Session
              </motion.button>
            </form>

            <div className="mt-10 text-center">
               <div className="relative py-4 mb-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                  <div className="relative flex justify-center text-[8px] uppercase tracking-[0.4em] font-black text-gray-300"><span className="bg-white px-4">Trusted Networks</span></div>
               </div>
               
               <div className="flex justify-center gap-4">
                  <button type="button" className="flex-1 py-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-gray-500 group">
                    <img src="https://www.vectorlogo.zone/logos/github/github-icon.svg" className="w-4 h-4 opacity-40 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all" alt="GH"/> GH
                  </button>
                  <button type="button" className="flex-1 py-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-gray-500 group">
                    <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" className="w-4 h-4 opacity-40 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all" alt="G"/> Google
                  </button>
               </div>
               
               <p className="mt-10 text-gray-400 text-xs font-medium">
                 Awaiting induction? <Link to="/learn/courses" className="font-bold hover:underline" style={{ color: roleConfigs[role].accent }}>Access Tracks</Link>
               </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none opacity-20 hidden lg:block">
        <span className="text-white font-mono text-[9px] uppercase tracking-[1em]">Boutique STUDLYF Authority © 2025</span>
      </div>
    </div>
  );
};

export default Login;
