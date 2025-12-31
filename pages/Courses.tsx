import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import WebImage from '../components/WebImage';

const CourseCard = ({ title, desc, skills, duration, image }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all flex flex-col group"
    >
      <div className="h-56 relative overflow-hidden">
        <WebImage src={image} alt={title} aspectRatio="aspect-video" className="h-full w-full" />
        <div className="absolute top-4 left-4">
          <span className="bg-[#7C3AED] text-white text-[8px] font-bold px-3 py-1 uppercase tracking-widest rounded-full">{duration}</span>
        </div>
      </div>
      <div className="p-8 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-[#111827] mb-3 font-sans group-hover:text-[#7C3AED] transition-colors">{title}</h3>
        <p className="text-sm text-[#475569] mb-6 leading-relaxed line-clamp-2">{desc}</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {skills.map((s: string) => (
            <span key={s} className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280] bg-[#F9FAFB] px-3 py-1 rounded-md border border-gray-100">{s}</span>
          ))}
        </div>
        <button 
          onClick={() => navigate('/learn/assessment')}
          className="mt-auto w-full py-4 bg-[#F9FAFB] text-[#7C3AED] font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-[#7C3AED] hover:text-white transition-all"
        >
          View Course
        </button>
      </div>
    </motion.div>
  );
};

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const courses = [
    { 
      title: "Data Analytics", 
      desc: "Analyze data, build dashboards, and make business decisions using real datasets.", 
      skills: ["Excel", "SQL", "Python", "Power BI"], 
      duration: "12 Weeks",
      image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800"
    },
    { 
      title: "Full Stack Development", 
      desc: "Build complete web applications from frontend to backend with industry best practices.", 
      skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"], 
      duration: "16 Weeks",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800"
    },
    { 
      title: "Backend Engineering", 
      desc: "Design scalable APIs and backend systems used in real production environments.", 
      skills: ["APIs", "Databases", "System Design"], 
      duration: "14 Weeks",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800"
    },
    { 
      title: "Machine Learning", 
      desc: "Build and deploy machine learning models for high-impact real-world use cases.", 
      skills: ["Python", "ML Models", "Deployment"], 
      duration: "18 Weeks",
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800"
    },
    { 
      title: "UI/UX Design", 
      desc: "Design user-focused interfaces and seamless product experiences using modern tools.", 
      skills: ["Figma", "UX Research", "Design Systems"], 
      duration: "10 Weeks",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-bold text-[#111827] mb-6 tracking-tight uppercase"
          >
            Industry-Ready <span className="text-[#7C3AED]">Courses</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#6B7280] max-w-2xl mx-auto"
          >
            Learn skills designed around real job roles, not just theory. Our curriculum is mapped to professional engineering standards.
          </motion.p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((c, i) => (
            <CourseCard key={i} {...c} />
          ))}
        </div>

        <section className="mt-24 p-12 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-[#111827] mb-4 uppercase tracking-widest">Start Your Journey</h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto mb-10 leading-relaxed">
            Unsure where to begin? Use our assessment protocols to find the path that matches your current capabilities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/learn/assessment')}
              className="px-10 py-5 bg-[#7C3AED] text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-[#7C3AED]/20 hover:scale-[1.02] transition-transform"
            >
              Start Skill Assessment
            </button>
            <button 
              onClick={() => navigate('/learn/career-fit')}
              className="px-10 py-5 bg-white border border-gray-200 text-[#374151] font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl hover:border-[#7C3AED] transition-colors"
            >
              Find Your Career Fit
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Courses;