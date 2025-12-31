
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const articles = [
  {
    id: 1,
    category: "Engineering Standards",
    title: "The End of the Syntax Era",
    desc: "Why system ownership matters more than code production in the age of generative AI.",
    readTime: "8 min",
    auditLevel: "Foundational",
    author: "Protocol Lead",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    category: "System Design",
    title: "Auditing for Resilience",
    desc: "How to identify architectural bottlenecks before they reach production traffic.",
    readTime: "12 min",
    auditLevel: "Elite",
    author: "Systems Audit Team",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    category: "Career Growth",
    title: "The Signal vs Noise Gap",
    desc: "A guide for early-career engineers on building a verifiable technical narrative.",
    readTime: "6 min",
    auditLevel: "Active",
    author: "Career Protocol",
    image: "https://images.unsplash.com/photo-1573164773974-2977827e6931?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    category: "Education",
    title: "Clinical Learning Loops",
    desc: "Moving from passive tutorial watching to active system decomposition.",
    readTime: "10 min",
    auditLevel: "Foundational",
    author: "Ed-Tech Labs",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
  }
];

const Blog: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Engineering Standards', 'System Design', 'Career Growth', 'Education'];

  const filteredArticles = filter === 'All' 
    ? articles 
    : articles.filter(a => a.category === filter);

  return (
    <div className="pt-32 pb-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center lg:text-left">
          <span className="text-[#7C3AED] font-bold uppercase tracking-[0.6em] text-[10px] mb-4 block">Institutional Library</span>
          <h1 className="text-6xl sm:text-8xl font-black text-[#111827] mb-8 uppercase tracking-tighter leading-[0.85]">Knowledge <br/><span className="text-[#7C3AED]">Hub.</span></h1>
          <p className="text-xl text-[#475569] max-w-2xl font-medium leading-relaxed">Technical insights, engineering philosophy, and readiness protocols for the modern builder.</p>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-16 border-b border-gray-100 pb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === cat ? 'bg-[#7C3AED] text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredArticles.map((article, i) => (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-8 border border-gray-100 shadow-sm relative">
                <img src={article.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={article.title} />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-[#111827]">{article.category}</div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-[9px] font-bold text-[#7C3AED] tracking-[0.3em] uppercase">{article.auditLevel} Level</span>
                <div className="h-px flex-grow bg-gray-100"></div>
                <span className="font-mono text-[9px] text-gray-400 font-bold uppercase">{article.readTime} Read</span>
              </div>

              <h3 className="text-2xl font-black text-[#111827] uppercase tracking-tight mb-4 group-hover:text-[#7C3AED] transition-colors">{article.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-8 font-medium line-clamp-2">{article.desc}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-[#111827] uppercase tracking-widest">By {article.author}</span>
                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
