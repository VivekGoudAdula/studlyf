import React from 'react';
import { motion } from 'framer-motion';

const MockInterview: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-24">
          <h1 className="text-6xl sm:text-8xl font-bold text-[#111827] mb-8 uppercase tracking-tighter leading-[0.85]">Mock <span className="text-[#7C3AED]">Interviews.</span></h1>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto font-medium">Practice technical precision and professional logic before the real clinical audit.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Technical Interviews", icon: "⎔", desc: "Deep dives into system design, data flow, and infrastructure governance with senior mentors." },
            { title: "HR & Culture", icon: "◈", desc: "Evaluating how you handle teamwork, professional ambiguity, and organizational logic." },
            { title: "Behavioral Logic", icon: "⌥", desc: "Scenario-based testing for high-stakes problem solving and decision ownership." },
            { title: "Real Questions", icon: "⟁", desc: "Practice with questions curated from the engineering teams of elite tech companies." },
            { title: "Feedback Report", icon: "∑", desc: "Every session includes a detailed analysis of your performance, gaps, and confidence." },
            { title: "Confidence Boost", icon: "⚡", desc: "Build the mental resilience required to defend your technical decisions under scrutiny." }
          ].map((type, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col group hover:border-[#7C3AED]/20 transition-all"
            >
              <div className="text-5xl text-[#7C3AED] mb-10 opacity-40 group-hover:opacity-100 transition-opacity">{type.icon}</div>
              <h3 className="text-2xl font-bold text-[#111827] mb-4 uppercase tracking-tight">{type.title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-10 flex-grow">{type.desc}</p>
              <button className="w-full py-4 bg-[#F5F3FF] text-[#7C3AED] font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-[#7C3AED] hover:text-white transition-all">
                Schedule Session
              </button>
            </motion.div>
          ))}
        </div>

        <section className="mt-24 p-12 sm:p-20 bg-white rounded-[4rem] border border-gray-100 shadow-xl flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-grow">
            <h2 className="text-3xl font-bold text-[#111827] mb-6 uppercase tracking-tight">Ready for the real thing?</h2>
            <p className="text-[#6B7280] text-lg leading-relaxed max-w-2xl">Use our mock sessions to identify gaps in your technical narrative. Practice explaining your trade-offs with institutional clarity.</p>
          </div>
          <button className="px-16 py-8 bg-[#7C3AED] text-white font-bold text-[11px] uppercase tracking-[0.4em] rounded-2xl shadow-2xl hover:scale-105 transition-transform">
            Start Mock Interview
          </button>
        </section>
      </div>
    </div>
  );
};

export default MockInterview;