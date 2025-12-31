
import React from 'react';
import { motion } from 'framer-motion';

const jobPostings = [
  { id: 1, title: "Systems Engineer", company: "Nirvaha", pay: "$120k - $160k", match: 94, tags: ["Distributed", "Go", "Kubernetes"] },
  { id: 2, title: "Data Architect", company: "DataFlow", pay: "$110k - $145k", match: 88, tags: ["SQL", "Kafka", "Postgres"] },
  { id: 3, title: "Resilience Lead", company: "Logic", pay: "$140k - $190k", match: 72, tags: ["Auditing", "CI/CD", "Security"] }
];

const GetHired: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 flex flex-col lg:flex-row justify-between items-end gap-12">
          <div className="max-w-3xl">
            <span className="text-[#7C3AED] font-bold uppercase tracking-[0.5em] text-[10px] mb-4 block">Marketplace</span>
            <h1 className="text-6xl sm:text-8xl font-black text-[#111827] mb-8 uppercase tracking-tighter leading-[0.85]">Direct <br/><span className="text-[#7C3AED]">Authority Hires.</span></h1>
            <p className="text-xl text-[#475569] font-medium leading-relaxed">Skip the screening. Apply with your Studlyf dossier directly to partners who value clinical verification over claims.</p>
          </div>
          
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
             <button className="px-6 py-3 bg-white shadow-sm border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#7C3AED]">Best Matches</button>
             <button className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-gray-400">All Jobs</button>
          </div>
        </header>

        <div className="grid gap-6">
          {jobPostings.map((job, i) => (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-100 rounded-[2rem] p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 hover:border-[#7C3AED]/30 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-10 w-full lg:w-auto">
                <div className="w-16 h-16 bg-[#111827] rounded-2xl flex items-center justify-center font-black text-[#7C3AED] text-xl shrink-0">
                  {job.company[0]}
                </div>
                <div>
                   <span className="text-[9px] font-black text-[#7C3AED] uppercase tracking-[0.3em] mb-2 block">{job.company}</span>
                   <h3 className="text-2xl font-black text-[#111827] uppercase tracking-tight mb-2 group-hover:text-[#7C3AED] transition-colors">{job.title}</h3>
                   <div className="flex flex-wrap gap-2">
                     {job.tags.map(tag => (
                       <span key={tag} className="text-[8px] font-bold text-gray-400 border border-gray-100 bg-gray-50 px-3 py-1 rounded-md uppercase tracking-widest">{tag}</span>
                     ))}
                   </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-12 w-full lg:w-auto justify-between lg:justify-end">
                <div className="text-center sm:text-right">
                   <span className="block text-xl font-black text-[#111827] tracking-tighter">{job.pay}</span>
                   <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Authority Package</span>
                </div>
                
                <div className="text-center bg-[#F5F3FF] border border-[#7C3AED]/10 p-4 rounded-2xl min-w-[120px]">
                   <span className="block text-2xl font-black text-[#7C3AED] tracking-tighter">{job.match}%</span>
                   <span className="text-[7px] font-bold text-[#7C3AED] uppercase tracking-widest">Dossier Match</span>
                </div>

                <button className="w-full sm:w-auto px-10 py-5 bg-[#7C3AED] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#7C3AED]/20 hover:scale-[1.05] transition-transform">
                  Apply with Dossier
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="mt-24 p-16 sm:p-24 bg-[#0F172A] rounded-[4rem] text-center relative overflow-hidden group shadow-3xl">
           <div className="absolute inset-0 bg-grid-tech opacity-10" />
           <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 uppercase tracking-tighter leading-tight">Elite Authority Network.</h2>
              <p className="text-gray-400 mb-12 font-medium leading-relaxed">Our partners hire exclusively from the verified pool for senior readiness roles. Your dossier is your primary authorization key.</p>
              <button className="px-16 py-8 bg-white text-[#7C3AED] font-bold text-[11px] uppercase tracking-[0.4em] rounded-2xl shadow-2xl hover:scale-105 transition-all">Request Hiring Audit</button>
           </div>
        </section>
      </div>
    </div>
  );
};

export default GetHired;
