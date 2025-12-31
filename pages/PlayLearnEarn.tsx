import React from 'react';
import { motion } from 'framer-motion';

const PlayLearnEarn: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 bg-[#0F172A] min-h-screen relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-grid-tech opacity-10"></div>
      
      <div className="max-w-7xl w-full mx-auto relative z-10">
        <header className="text-center mb-24">
          <div className="inline-block border border-white/20 px-6 py-2 rounded-full mb-10 text-[#7C3AED] font-mono text-[9px] uppercase tracking-[0.5em] font-bold">Engagement Protocol // ACTIVE</div>
          <h1 className="text-6xl sm:text-9xl font-bold text-white mb-8 tracking-tighter uppercase leading-[0.8] font-syne">Play. Learn. <br/><span className="text-[#7C3AED]">Earn.</span></h1>
          <p className="text-xl text-white/60 max-w-xl mx-auto font-medium">Daily technical challenges to maintain elite readiness and unlock institutional reward tiers.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Daily Quizzes", value: "500 XP", desc: "Byte-sized technical puzzles to keep your architectural mind sharp every day.", icon: "⚡" },
            { title: "Skill Challenges", value: "2000 XP", desc: "High-stakes coding arenas with real-world constraints and leaderboards.", icon: "◈" },
            { title: "Reward Points", value: "LEVEL UP", desc: "Unlock referral credits, hiring bounties, and direct interview access.", icon: "₿" }
          ].map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] flex flex-col group hover:border-[#7C3AED]/50 transition-all shadow-2xl"
            >
              <div className="text-6xl mb-12 group-hover:scale-110 transition-transform origin-left">{card.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide group-hover:text-[#7C3AED] transition-colors">{card.title}</h3>
              <div className="text-[#7C3AED] font-mono font-bold text-lg mb-8 tracking-widest">{card.value}</div>
              <p className="text-white/40 text-sm leading-relaxed mb-12 flex-grow">{card.desc}</p>
              <button className="w-full py-5 bg-white text-[#0F172A] font-bold text-[10px] uppercase tracking-[0.3em] rounded-xl hover:bg-[#7C3AED] hover:text-white transition-all shadow-xl">
                Enter Arena
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-white/5 border border-white/10 rounded-[3rem] flex flex-col sm:flex-row items-center justify-between gap-10"
        >
          <div className="flex items-center gap-10">
            <div className="w-20 h-20 rounded-[2rem] bg-[#7C3AED] flex items-center justify-center font-bold text-white text-3xl shadow-2xl shadow-[#7C3AED]/30">?</div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-[0.3em] text-sm">Next Protocol Cycle</h4>
              <p className="text-white/30 text-xs font-mono mt-2">TIME_REMAINING: 04:22:18</p>
            </div>
          </div>
          <button className="px-12 py-6 bg-[#7C3AED] text-white font-bold text-[11px] uppercase tracking-[0.4em] rounded-2xl shadow-2xl hover:scale-105 transition-transform">
            Start Playing
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PlayLearnEarn;