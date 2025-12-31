
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Assessment: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'active' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    {
      q: "A distributed system experiences 50ms latency spikes every hour. What is the first diagnostic step?",
      options: ["Horizontal Scaling", "Garbage Collection Audit", "Database Re-indexing", "Frontend Optimization"],
      correct: 1
    },
    {
      q: "Which consistency model prioritizes system availability over absolute data freshness?",
      options: ["Strict Consistency", "Sequential Consistency", "Eventual Consistency", "Strong Consistency"],
      correct: 2
    },
    {
      q: "In a production CI/CD pipeline, a build fails due to a security vulnerability. What is the protocol?",
      options: ["Ignore if minor", "Manual override", "Auto-rollback & Audit", "Patch in production"],
      correct: 2
    }
  ];

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('results');
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="inline-block bg-[#7C3AED] text-white text-[9px] font-bold px-4 py-2 uppercase tracking-[0.4em] rounded-full mb-8">Clinical Phase // 01</div>
              <h1 className="text-5xl sm:text-7xl font-black text-[#111827] mb-6 uppercase tracking-tighter">Clinical <span className="text-[#7C3AED]">Audit.</span></h1>
              <p className="text-[#6B7280] text-lg max-w-xl mx-auto mb-12 font-medium">This protocol evaluates your technical logic, system decomposition, and resilience judgment.</p>
              
              <div className="grid sm:grid-cols-3 gap-6 mb-16">
                {["30 Min", "15 Logic Gates", "Clinical Scoring"].map((tag, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Stat {i+1}</span>
                    <span className="text-sm font-bold text-[#111827]">{tag}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setStep('active')}
                className="px-12 py-6 bg-[#7C3AED] text-white font-bold text-[11px] uppercase tracking-[0.4em] rounded-2xl shadow-3xl shadow-[#7C3AED]/20 hover:scale-[1.02] transition-transform"
              >
                Initiate Assessment
              </button>
            </motion.div>
          )}

          {step === 'active' && (
            <motion.div 
              key="active"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white border border-gray-100 rounded-[3rem] p-8 sm:p-16 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-1.5 bg-[#7C3AED]" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
              
              <div className="mb-12 flex justify-between items-center">
                <span className="font-mono text-[10px] text-[#7C3AED] font-bold tracking-widest uppercase">Protocol Gate {currentQuestion + 1} / {questions.length}</span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Logic Defense</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-12 leading-tight">{questions[currentQuestion].q}</h2>

              <div className="grid gap-4 mb-12">
                {questions[currentQuestion].options.map((option, i) => (
                  <button 
                    key={i}
                    onClick={handleNext}
                    className="w-full p-6 text-left border border-gray-100 rounded-2xl hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition-all group flex items-center justify-between"
                  >
                    <span className="font-bold text-[#374151] group-hover:text-[#7C3AED]">{option}</span>
                    <div className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-[10px] group-hover:bg-[#7C3AED] group-hover:text-white group-hover:border-[#7C3AED]">{i + 1}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl">✓</div>
              <h2 className="text-4xl font-black text-[#111827] uppercase tracking-tighter mb-4">Audit Synchronized.</h2>
              <p className="text-gray-500 max-w-sm mx-auto mb-12 uppercase tracking-widest text-[10px] font-bold">Your logic scores are being integrated into the Studlyf global readiness index.</p>
              
              <div className="bg-[#F5F3FF] border border-[#7C3AED]/10 p-10 rounded-[2.5rem] mb-12">
                 <div className="text-6xl font-black text-[#7C3AED] tracking-tighter mb-2">84.5</div>
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#7C3AED]">Current Readiness Multiplier</p>
              </div>

              <button 
                onClick={() => setStep('intro')}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#7C3AED] transition-colors"
              >
                Reset Assessment Loop
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Assessment;
