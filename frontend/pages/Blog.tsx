
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, User, Calendar, ArrowRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

// --- Types ---
interface BlogArticle {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  publishDate: string;
  author: string;
  content: React.ReactNode;
  image: string;
}

// --- Mock Content ---
const BLOG_POSTS: BlogArticle[] = [
  {
    id: 'resumes-are-dead',
    category: 'Engineering Philosophy',
    title: 'The Engineering Readiness Standard: Why Resumes Are Dead',
    excerpt: 'Why traditional education produces memorization, not ownership — and why the future belongs to verified engineers.',
    readTime: '6 min read',
    publishDate: 'March 1, 2024',
    author: 'Studlyf Editorial',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    content: (
      <>
        <h2>The Illusion of Competence</h2>
        <p>For decades, the resume was the golden ticket to an interview. A list of keywords, a degree from a recognizable institution, and a few bullet points about "teamwork" were enough to get your foot in the door. But in today's high-stakes engineering environment, the resume has become a noise generator rather than a signal carrier.</p>
        <p>Traditional education focuses on memorization—learning how to pass tests. Engineering, however, is about <strong>ownership</strong>. It's about understanding why a system fails, how it scales, and identifying architectural bottlenecks before they manifest as downtime.</p>
        <h2>The New Paradigm: Verification</h2>
        <p>We are entering the era of the <em>Clinical Engineer</em>. Companies no longer want to see where you went to school; they want to see the <strong>evidence</strong> of your skill. This means moving beyond generic projects and tutorial-copy-pasted code.</p>
        <p>The Engineering Readiness Standard (ERS) is our answer to this gap. It's a protocol designed to deconstruct a developer's true potential through clinical decomposition of systems—proving you can build, break, and fix at scale.</p>
      </>
    )
  },
  {
    id: 'ai-replacement',
    category: 'AI & Careers',
    title: 'AI Won’t Replace Engineers — But Weak Engineers Will Be Replaced',
    excerpt: 'In the AI era, execution and verification matter more than syntax knowledge.',
    readTime: '5 min read',
    publishDate: 'February 28, 2024',
    author: 'Studlyf Editorial',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    content: (
      <>
        <h2>The Syntax Trap</h2>
        <p>If your primary value as an engineer is knowing the specific syntax of a language, you are already replaceable. LLMs can write boilerplate, generate unit tests, and refactor code faster than any human. But AI lacks <strong>intent</strong> and <strong>architectural intuition</strong>.</p>
        <p>The "Weak Engineer" relies on the tool to do the thinking. The "Verified Engineer" uses the tool as an accelerator, but maintains clinical control over the output. They verify every line of generated code against security, performance, and scalability standards.</p>
        <h2>Focusing on the High-Value Signal</h2>
        <p>In the next five years, the most valuable skill won't be "Full Stack Development." It will be "System Ownership." Can you orchestrate multiple AI agents to build a resilient microservice? Can you debug a distributed system when the AI-generated code introduces a subtle race condition?</p>
        <p>This is where Studlyf focuses: moving you from a coder to a clinical architect who verifies reality.</p>
      </>
    )
  },
  {
    id: 'startup-vs-mnc',
    category: 'Career Strategy',
    title: 'Startup or MNC? The Truth No One Tells You',
    excerpt: 'Ownership vs structure. Speed vs scale. Choose your growth path wisely.',
    readTime: '7 min read',
    publishDate: 'February 25, 2024',
    author: 'Studlyf Editorial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    content: (
      <>
        <h2>The Speed of Iteration</h2>
        <p>At a startup, you are the iterate-or-die engine. You wear five hats, touch the entire stack, and deal with the immediate consequences of your bugs. It’s the ultimate crucible for engineering readiness. You learn **ownership** because there is no one else to hand the pager to.</p>
        <h2>The Weight of Scale</h2>
        <p>At an MNC, the challenge is different: **resilience at scale**. You might work on a single feature, but that feature handles 100k requests per second. The learning here is about precision, documentation, and operational protocols. It’s about building systems that survive the test of time and massive user traffic.</p>
        <p>At Studlyf, we believe the best engineers are those who can blend both: the speed of a startup with the clinical discipline of an elite MNC.</p>
      </>
    )
  },
  {
    id: 'github-is-not-enough',
    category: 'Skill Proof',
    title: 'Your GitHub Is Not Enough: Building a Clinical Developer Portfolio',
    excerpt: 'Projects don’t prove authority. Systems do.',
    readTime: '6 min read',
    publishDate: 'February 20, 2024',
    author: 'Studlyf Editorial',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
    content: (
      <>
        <h2>The Project Fallacy</h2>
        <p>Most GitHub profiles are graveyards of half-finished todo apps and weather dashboards. These tell a recruiter nothing about your ability to solve real problems. They prove you can follow a tutorial, but they don't prove you can maintain a system.</p>
        <h2>The Evidence Standard</h2>
        <p>A <strong>Clinical Developer Portfolio</strong> focuses on three things:</p>
        <ul>
          <li><strong>Deconstruction:</strong> Showing how you broke down a complex problem into atomic, manageable parts.</li>
          <li><strong>Trade-offs:</strong> Explaining why you chose SQL over NoSQL, or a monolith over microservices.</li>
          <li><strong>Audit-ability:</strong> Providing clean, documented code that another engineer can verify in minutes.</li>
        </ul>
        <p>Stop building "projects." Start building "evidence."</p>
      </>
    )
  }
];

// --- Sub-Components ---

const BlogCard = ({ post, onClick, index }: { post: BlogArticle, onClick: () => void, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15, duration: 0.5 }}
    onClick={onClick}
    className="group bg-white/50 backdrop-blur-sm rounded-[2rem] p-6 sm:p-8 border border-gray-100 hover:border-[#6C3BFF]/30 hover:shadow-[0_20px_50px_rgba(108,59,255,0.1)] transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between"
  >
    {/* Accent Border on Hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#6C3BFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

    <div>
      <span className="inline-block px-3 py-1 rounded-full bg-[#6C3BFF]/10 text-[#6C3BFF] text-[9px] font-black uppercase tracking-widest mb-4 border border-[#6C3BFF]/20">
        {post.category}
      </span>
      <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] leading-tight mb-3 group-hover:text-[#6C3BFF] transition-colors">
        {post.title}
      </h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">
        {post.excerpt}
      </p>
    </div>

    <div className="flex items-center justify-between border-t border-gray-100 pt-6">
      <div className="flex items-center gap-2 text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest">
        <Clock size={14} className="text-[#6C3BFF]" />
        {post.readTime}
      </div>
      <div className="flex items-center gap-2 text-[#6C3BFF] font-bold text-sm tracking-tight group-hover:gap-4 transition-all">
        Read More <ArrowRight size={16} />
      </div>
    </div>

    {/* Hover Lift */}
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    />
  </motion.div>
);

const BlogDetail = ({ post, onBack }: { post: BlogArticle, onBack: () => void }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      {/* Header Content */}
      <div className="max-w-4xl mx-auto px-6 pt-40 pb-20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#94A3B8] hover:text-[#6C3BFF] font-bold uppercase tracking-widest text-[10px] mb-12 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Standard
        </button>

        <span className="inline-block px-4 py-1.5 rounded-full bg-[#6C3BFF]/10 text-[#6C3BFF] text-[10px] font-black uppercase tracking-widest mb-8">
          {post.category}
        </span>

        <h1 className="text-4xl sm:text-6xl font-black text-[#0F172A] leading-[1.1] tracking-tight mb-8">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-8 py-8 border-y border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#6C3BFF]/10 flex items-center justify-center text-[#6C3BFF]">
              <User size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Author</span>
              <span className="text-sm font-bold text-[#0F172A]">{post.author}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <Calendar size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Published</span>
              <span className="text-sm font-bold text-[#0F172A]">{post.publishDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <Clock size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</span>
              <span className="text-sm font-bold text-[#0F172A]">{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="w-full max-w-7xl mx-auto px-6 mb-20">
        <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/20 to-transparent" />
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-6 pb-40 prose prose-slate prose-lg lg:prose-xl prose-headings:text-[#0F172A] prose-headings:font-black prose-headings:tracking-tight prose-strong:text-[#6C3BFF]">
        <div className="text-slate-600 font-medium leading-[1.8] space-y-8">
          {post.content}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---

const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogArticle | null>(null);

  // Update Meta Tags
  useEffect(() => {
    const baseTitle = "Studlyf | Engineering Standard Explained";
    const baseDesc = "Insights on engineering authority, AI-era careers, and skill verification.";

    if (selectedPost) {
      document.title = `${selectedPost.title} | Studlyf Blog`;
      // Description update logic would usually be in a meta component
    } else {
      document.title = baseTitle;
    }
  }, [selectedPost]);

  return (
    <div className="relative bg-slate-50/50 min-h-screen font-sans selection:bg-[#6C3BFF]/20 selection:text-[#6C3BFF]">
      <Navigation />

      <AnimatePresence mode="wait">
        {!selectedPost ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-40 pb-20 px-6"
          >
            <div className="max-w-7xl mx-auto">
              {/* Compact Header */}
              <div className="max-w-4xl mb-12">
                <div className="flex flex-col items-start gap-4 mb-4">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-block px-3 py-1 rounded-full bg-[#6C3BFF]/10 text-[#6C3BFF] text-[10px] font-bold uppercase tracking-widest border border-[#6C3BFF]/20"
                  >
                    Studlyf Library
                  </motion.span>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0F172A] leading-tight tracking-tight uppercase"
                  >
                    <span className="text-[#6C3BFF]">Blogs</span>
                  </motion.h1>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl"
                >
                  Insights on engineering authority, AI-era careers, and skill verification.
                </motion.p>
              </div>

              {/* Grid Layout - Reduced Gap */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {BLOG_POSTS.map((post, index) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    index={index}
                    onClick={() => setSelectedPost(post)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <BlogDetail
            key="detail"
            post={selectedPost}
            onBack={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Blog;
