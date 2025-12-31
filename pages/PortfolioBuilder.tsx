
import React from 'react';
import { motion } from 'framer-motion';

const PortfolioBuilder: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center lg:text-left">
          <span className="text-[#7C3AED] font-bold uppercase tracking-[0.5em] text-[10px] mb-4 block">Evidence Protocol</span>
          <h1 className="text-6xl sm:text-8xl font-black text-[#111827] mb-8 uppercase tracking-tighter leading-[0.85]">Dossier <br/><span className="text-[#7C3AED]">Builder.</span></h1>
          <p className="text-xl text-[#475569] max-w-2xl font-medium leading-relaxed">Your professional engineering resume, automatically generated from clinical data and verified project outcomes.</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Controls Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gray-50 border border-gray-100 p-10 rounded-[2.5rem] shadow-sm">
               <h3 className="text-xs font-black text-[#111827] uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">Verification Layers</h3>
               <div className="space-y-6">
                  {[
                    { label: "Logic Audit", active: true },
                    { label: "Mission Completion", active: true },
                    { label: "Deployment Logs", active: false },
                    { label: "Security Verification", active: true }
                  ].map((layer, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${layer.active ? 'text-[#111827]' : 'text-gray-300'}`}>{layer.label}</span>
                      <div className={`w-10 h-5 rounded-full relative p-1 transition-colors ${layer.active ? 'bg-[#7C3AED]' : 'bg-gray-200'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full shadow-md transition-transform ${layer.active ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <button className="w-full py-6 bg-[#7C3AED] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#7C3AED]/20">Generate Public URL</button>
            <p className="text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">Only verified partners can access audit details.</p>
          </div>

          {/* Dossier Preview */}
          <div className="lg:col-span-8">
             <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-[#0F172A] p-10 sm:p-20 rounded-[3rem] shadow-3xl text-white relative overflow-hidden"
             >
                <div className="absolute top-10 right-10 flex gap-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-black text-xs text-[#7C3AED]">S</div>
                </div>
                
                <div className="mb-20">
                  <span className="font-mono text-[9px] text-[#7C3AED] font-bold tracking-[0.4em] uppercase mb-4 block">ID: ST-88219 // Verified Candidate</span>
                  <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-4">Alex Protocol.</h2>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-widest">System Architect • Senior Readiness Tier</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-12 mb-20">
                   <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7C3AED] mb-6">Readiness Metrics</h4>
                      <div className="space-y-4">
                         {[
                           { l: "Architectural Safety", v: "92%" },
                           { l: "Logic Verification", v: "88%" },
                           { l: "System Resilience", v: "75%" }
                         ].map((m, i) => (
                           <div key={i} className="flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-xl">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">{m.l}</span>
                              <span className="font-mono font-black text-[#7C3AED]">{m.v}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7C3AED] mb-6">Verified History</h4>
                      <div className="space-y-4">
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                           <span className="block text-[10px] font-bold uppercase text-white mb-1">Nirvaha Mission #12</span>
                           <span className="text-[8px] font-bold text-green-400 uppercase tracking-widest">Status: SUCCESS_DEPLOYED</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                           <span className="block text-[10px] font-bold uppercase text-white mb-1">Audit Phase II</span>
                           <span className="text-[8px] font-bold text-yellow-400 uppercase tracking-widest">Status: VERIFIED_AUDITABLE</span>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="pt-10 border-t border-white/10 text-center">
                   <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.6em]">Powered by Studlyf Clinical Verification Protocol</p>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilder;
