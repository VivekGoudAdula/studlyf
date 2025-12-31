
import React from 'react';
import { motion } from 'framer-motion';

const modules = [
  {
    company: "Nirvaha",
    role: "Senior Backend Engineer",
    track: "Systemic DSA Protocol",
    desc: "Role-specific algorithms for high-throughput distributed architectures at Nirvaha.",
    duration: "4 Weeks",
    complexity: "Elite",
    stack: ["Go", "Kafka", "Postgres"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
  },
  {
    company: "DataFlow",
    role: "Full Stack Architect",
    track: "Real-time UI Logic",
    desc: "Optimizing state synchronization and edge delivery for DataFlow's visualization suite.",
    duration: "6 Weeks",
    complexity: "High",
    stack: ["React", "Rust", "WebAssembly"],
    image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800"
  },
  {
    company: "Logic",
    role: "DevOps Auditor",
    track: "Zero-Trust Infrastructure",
    desc: "Hardening Kubernetes deployments and CI/CD pipelines for critical Logic systems.",
    duration: "5 Weeks",
    complexity: "Critical",
    stack: ["K8s", "Terraform", "Istio"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800"
  }
];

const CompanyModules: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 flex flex-col lg:flex-row justify-between items-end gap-12">
          <div className="max-w-3xl">
            <span className="text-[#7C3AED] font-bold uppercase tracking-[0.5em] text-[10px] mb-4 block">Partner Gates</span>
            <h1 className="text-6xl sm:text-8xl font-black text-[#111827] mb-8 uppercase tracking-tighter leading-[0.85]">Company <br/><span className="text-[#7C3AED]">Modules.</span></h1>
            <p className="text-xl text-[#475569] font-medium leading-relaxed">Custom training protocols designed for specific roles at our institutional partners. Learn the exact logic required to ship at scale.</p>
          </div>
          
          <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hidden lg:block">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Authenticated Partners</span>
            <div className="flex gap-4 opacity-50 grayscale">
              {['NIRVAHA', 'DATAFLOW', 'LOGIC'].map(l => <span key={l} className="font-bold text-xs">{l}</span>)}
            </div>
          </div>
        </header>

        <div className="grid gap-12">
          {modules.map((mod, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#F9FAFB] rounded-[3rem] border border-gray-100 overflow-hidden flex flex-col lg:flex-row group hover:border-[#7C3AED]/30 transition-all shadow-sm"
            >
              <div className="lg:w-2/5 h-80 lg:h-auto relative overflow-hidden">
                <img src={mod.image} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={mod.company} />
                <div className="absolute inset-0 bg-[#7C3AED]/5" />
                <div className="absolute top-10 left-10 bg-[#111827] text-[#7C3AED] px-6 py-2 rounded-xl text-xl font-black shadow-2xl">{mod.company[0]}</div>
              </div>

              <div className="p-12 lg:p-20 flex-grow">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.3em] bg-white border border-[#7C3AED]/10 px-4 py-2 rounded-xl">{mod.company} Protocol</span>
                  <div className="h-px w-8 bg-gray-200" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{mod.duration} Track</span>
                </div>

                <h3 className="text-4xl font-black text-[#111827] uppercase tracking-tighter mb-4 leading-none">{mod.role}</h3>
                <h4 className="text-xl font-bold text-[#7C3AED] mb-8 font-sans italic">{mod.track}</h4>
                <p className="text-lg text-[#6B7280] leading-relaxed mb-12 max-w-xl font-medium">{mod.desc}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 border-t border-gray-200 pt-10">
                  {mod.stack.map(s => (
                    <div key={s} className="bg-white border border-gray-100 p-4 rounded-2xl text-center group-hover:border-[#7C3AED]/20 transition-all">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Stack</span>
                      <span className="text-sm font-bold text-[#111827]">{s}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <button className="w-full sm:w-auto px-12 py-6 bg-[#111827] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#7C3AED] transition-all shadow-xl">Start Module</button>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg ${
                    mod.complexity === 'Critical' ? 'text-red-500 bg-red-50' : 'text-[#7C3AED] bg-white'
                  }`}>
                    Complexity: {mod.complexity}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyModules;
