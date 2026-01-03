import React from 'react';
import { motion } from 'framer-motion';

const Hire: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 bg-[#0F172A] min-h-screen relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-grid-tech opacity-10"></div>
      
      <div className="max-w-7xl w-full mx-auto relative z-10">
        <header className="text-center mb-32">
          <div className="inline-block border border-white/20 px-8 py-3 rounded-full mb-12 text-[#7C3AED] font-mono text-[10px] uppercase tracking-[0.5em] font-bold backdrop-blur-md">Institutional Hiring Hub</div>
          <h1 className="text-6xl sm:text-9xl font-bold text-white mb-10 tracking-tighter uppercase leading-[0.8] font-syne">Hire For Your <br/><span className="text-[#7C3AED]">Company.</span></h1>
          <p className="text-2xl text-white/60 max-w-3xl mx-auto font-medium leading-relaxed">India's first skill-based hiring platform. We verify technical authority so you can reduce risk and cut hiring time.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            { title: "Verified Profiles", desc: "Access candidate profiles with auditable technical scores in systems design and logic.", icon: "✓" },
            { title: "Project Evaluation", desc: "Review real production-like decisions made by candidates in our standard simulations.", icon: "◈" },
            { title: "Reduced Time", desc: "Cut your engineering interview hours by 60% by skipping initial logic screenings.", icon: "⚡" }
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-16 rounded-[3rem] hover:border-[#7C3AED]/50 transition-all group shadow-2xl">
              <div className="w-12 h-12 bg-[#7C3AED] rounded-xl flex items-center justify-center text-white font-bold mb-10 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-white font-bold text-xl mb-6 uppercase tracking-widest leading-tight">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <section className="bg-[#7C3AED] p-16 sm:p-24 rounded-[4rem] shadow-3xl text-center text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid-tech opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-bold mb-10 uppercase tracking-tight">The Skill-First Advantage</h2>
            <p className="text-white/80 text-xl sm:text-2xl mb-16 max-w-3xl mx-auto leading-relaxed">No resume filtering. No bias. Just proven technical capability. We bridge the trust gap between education and high-stakes production.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="px-16 py-8 bg-white text-[#7C3AED] font-bold text-[11px] uppercase tracking-[0.4em] rounded-2xl shadow-2xl hover:scale-105 transition-all">
                Start Hiring Talent
              </button>
              <button className="px-16 py-8 bg-transparent text-white border border-white/20 font-bold text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all">
                Request Demo
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hire;