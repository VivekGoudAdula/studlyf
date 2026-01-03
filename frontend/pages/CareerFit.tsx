
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CareerFit: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = [
    { title: "Problem Space", q: "Which engineering context excites you most?", options: ["Distributed Systems", "Data Orchestration", "User Interaction", "ML Lifecycle"] },
    { title: "Mental Model", q: "How do you prefer to tackle system failure?", options: ["Root Cause Audit", "Load Redistribution", "Visual Debugging", "Heuristic Analysis"] },
    { title: "Tool Preference", q: "What defines your ideal development loop?", options: ["Strict Typing", "Data Visualization", "Functional Logic", "Prototyping Speed"] }
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      setCompleted(true);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-[#7C3AED] font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block">Role Discovery</span>
            <h1 className="text-5xl sm:text-7xl font-black text-[#111827] mb-8 leading-[0.9] tracking-tighter uppercase">
              Identify Your <br/><span className="text-[#7C3AED]">Engineering Fit.</span>
            </h1>
            <p className="text-xl text-[#475569] mb-12 leading-relaxed max-w-lg">
              We match your cognitive style to the roles where you can achieve immediate high authority.
            </p>

            <div className="flex items-center gap-2 mb-12">
               {steps.map((_, i) => (
                 <div key={i} className={`h-1 flex-grow rounded-full transition-all duration-500 ${i <= activeStep ? 'bg-[#7C3AED]' : 'bg-gray-100'}`} />
               ))}
            </div>

            <AnimatePresence mode="wait">
              {!completed ? (
                <motion.div 
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                   <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{steps[activeStep].title}</span>
                      <h3 className="text-2xl font-bold text-[#111827]">{steps[activeStep].q}</h3>
                   </div>
                   <div className="grid sm:grid-cols-2 gap-4">
                      {steps[activeStep].options.map((opt, i) => (
                        <button 
                          key={i} 
                          onClick={handleNext}
                          className="p-6 border border-gray-100 rounded-2xl text-left hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition-all font-bold text-sm text-[#374151]"
                        >
                          {opt}
                        </button>
                      ))}
                   </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#F5F3FF] p-10 rounded-[2.5rem] border border-[#7C3AED]/10"
                >
                  <h3 className="text-2xl font-black text-[#111827] uppercase tracking-tight mb-6">Discovery Result</h3>
                  <div className="space-y-6">
                    {[
                      { role: "Backend Architect", match: 94 },
                      { role: "ML Engineer", match: 72 },
                      { role: "Data Scientist", match: 65 }
                    ].map((res, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-[#111827]">{res.role}</span>
                          <span className="text-xs font-mono text-[#7C3AED] font-bold">{res.match}%</span>
                        </div>
                        <div className="h-2 bg-white rounded-full overflow-hidden border border-gray-100">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${res.match}%` }} transition={{ delay: 0.5 + i*0.2 }} className="h-full bg-[#7C3AED]" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setCompleted(false)} className="mt-10 text-[9px] font-black uppercase tracking-widest text-[#7C3AED] underline underline-offset-4">Retake Discovery</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="hidden lg:block relative h-[600px] w-full">
             <div className="absolute inset-0 bg-[#7C3AED]/5 rounded-[4rem] border-8 border-gray-50 overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale opacity-40 mix-blend-multiply" alt="Suitability Visualization" />
                <div className="absolute inset-0 bg-grid-tech opacity-20" />
                <div className="absolute bottom-12 left-12 right-12 bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-white/20">
                    <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-widest mb-2 block">Cognitive Profile</span>
                    <p className="text-sm font-bold text-[#111827] leading-relaxed">Your profile suggests high suitability for system-level governance and resilience engineering.</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CareerFit;
