
import React from 'react';
import { motion } from 'framer-motion';

const missions = [
  { id: "S-01", title: "Resilience Audit", company: "Nirvaha", diff: "Elite", desc: "A production database is deadlocking under peak traffic. Identify the bottleneck and propose a zero-downtime migration." },
  { id: "S-02", title: "Scale Deployment", company: "DataFlow", diff: "High", desc: "Deploy a global real-time event hub. Ensure p99 latency stays under 100ms across 4 geographic regions." },
  { id: "S-03", title: "Security Breach", company: "Logic", diff: "Critical", desc: "A compromised dependency has leaked API keys. Initiate lockdown, audit permissions, and restore authority." }
];

const JobSimulation: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <span className="text-[#7C3AED] font-bold uppercase tracking-[0.5em] text-[10px] mb-4 block">Scenario Sandbox</span>
          <h1 className="text-5xl sm:text-7xl font-black text-[#111827] mb-8 uppercase tracking-tighter leading-[0.9]">Job <br/><span className="text-[#7C3AED]">Simulation.</span></h1>
          <p className="text-xl text-[#475569] max-w-2xl leading-relaxed font-medium">
            Test your authority in high-stakes engineering environments. No risk to production, total risk to your clinical score.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {missions.map((mission, i) => (
            <motion.div 
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-100 rounded-[2.5rem] p-10 flex flex-col group hover:border-[#7C3AED]/30 hover:shadow-2xl transition-all h-[550px]"
            >
              <div className="flex justify-between items-start mb-12">
                <span className="font-mono text-2xl font-black text-gray-200 group-hover:text-[#7C3AED] transition-colors">{mission.id}</span>
                <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                  mission.diff === 'Critical' ? 'bg-red-50 text-red-500' : 'bg-[#F5F3FF] text-[#7C3AED]'
                }`}>
                  {mission.diff} Complexity
                </span>
              </div>

              <div className="flex-grow">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">{mission.company} Mission</span>
                <h3 className="text-3xl font-bold text-[#111827] mb-6 uppercase tracking-tight leading-tight">{mission.title}</h3>
                <p className="text-[#6B7280] leading-relaxed text-sm font-medium">{mission.desc}</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  {[1,2,3].map(dot => <div key={dot} className="w-2 h-2 rounded-full bg-gray-100 group-hover:bg-[#7C3AED]/20" />)}
                </div>
                <button className="w-full py-5 bg-[#7C3AED] text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl shadow-[#7C3AED]/20 group-hover:bg-[#111827] transition-all">
                  Initialize Mission
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-12 sm:p-20 bg-[#111827] rounded-[4rem] relative overflow-hidden group shadow-3xl"
        >
          <div className="absolute inset-0 bg-grid-tech opacity-10" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 uppercase tracking-tight">Mission Control.</h2>
              <p className="text-gray-400 font-medium leading-relaxed">Accepted missions are tracked against the global Studlyf Authority Index. Failures are recorded as learning entropy; successes as clinical proof.</p>
            </div>
            <div className="flex gap-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center min-w-[160px]">
                <span className="block text-4xl font-black text-white mb-2 tracking-tighter">04</span>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Active Sim</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center min-w-[160px]">
                <span className="block text-4xl font-black text-white mb-2 tracking-tighter">88%</span>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Success Rate</span>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default JobSimulation;
