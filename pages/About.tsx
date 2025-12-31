import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-40 pb-24 px-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-32 text-center lg:text-left">
          <span className="text-[#7C3AED] font-bold uppercase tracking-[0.6em] text-[10px]">Institutional Profile</span>
          <h1 className="text-6xl sm:text-9xl font-bold text-[#111827] mt-8 mb-12 uppercase tracking-tighter leading-[0.8]">About <br/><span className="text-[#7C3AED]">Us.</span></h1>
          <div className="h-[2px] w-32 bg-[#7C3AED] mb-12 mx-auto lg:mx-0"></div>
          <p className="text-2xl sm:text-3xl text-[#475569] leading-relaxed font-medium max-w-4xl mx-auto lg:mx-0">We help learners build real skills and help companies hire based on verified ability, not resumes.</p>
        </header>

        <section className="grid md:grid-cols-2 gap-24 mb-40">
          <div className="space-y-12">
            <div>
              <h2 className="text-xs font-bold text-[#7C3AED] uppercase tracking-[0.4em] mb-8 border-l-4 border-[#7C3AED] pl-6">Our Mission</h2>
              <p className="text-[#374151] text-2xl font-bold leading-relaxed mb-8">
                "We bridge the gap between abstract learning and high-stakes engineering skills through clinical verification."
              </p>
              <p className="text-[#6B7280] text-lg leading-relaxed">
                In a world where generative noise makes claims abundant, we provide the silence of proof. Our platform is a dedicated standard for the human authority required to ship systems that matter.
              </p>
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#7C3AED] uppercase tracking-[0.4em] mb-8 border-l-4 border-[#7C3AED] pl-6">Our Vision</h2>
              <p className="text-[#374151] text-lg leading-relaxed">
                To create a skill-first ecosystem where learning leads directly to opportunity. We believe that professional responsibility is earned through evidence, not listed on a certificate.
              </p>
            </div>
          </div>
          <div className="bg-[#F9FAFB] p-16 rounded-[4rem] border border-gray-100 shadow-sm flex flex-col justify-center">
            <h3 className="font-bold text-[#111827] uppercase tracking-[0.3em] text-xs mb-12">Our Core Approach</h3>
            <ul className="space-y-12">
              {[
                { title: "Clinical Rigor", desc: "Every assessment is audited for depth and resilience by senior engineering protocols." },
                { title: "Contextual Reality", desc: "No trivia. We only simulate the messy, ambiguous reality of production engineering." },
                { title: "Institutional Trust", desc: "Used by teams to define and verify their internal hiring and readiness standards." }
              ].map((item, i) => (
                <li key={i} className="flex gap-8 group">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#7C3AED] font-bold text-sm shadow-sm group-hover:bg-[#7C3AED] group-hover:text-white transition-all shrink-0">{i+1}</div>
                  <div>
                    <h4 className="font-bold text-[#111827] text-lg mb-2 leading-none">{item.title}</h4>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="p-16 sm:p-24 bg-[#F9FAFB] rounded-[4rem] text-center border border-gray-100 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#7C3AED]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mb-12 uppercase tracking-tighter">Ready to join the standard?</h2>
            <p className="text-[#6B7280] text-xl mb-16 max-w-xl mx-auto font-medium leading-relaxed">Connect your capability to real opportunities. Build skills. Create a career.</p>
            <button 
              onClick={() => navigate('/learn/assessment')}
              className="px-16 py-8 bg-[#7C3AED] text-white font-bold text-[11px] uppercase tracking-[0.4em] rounded-2xl shadow-3xl shadow-[#7C3AED]/20 hover:scale-[1.02] transition-transform"
            >
              Join Our Platform
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;