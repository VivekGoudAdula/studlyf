import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../apiConfig';
import {
  Zap,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { ScrollVelocityContainer, ScrollVelocityRow } from '../registry/magicui/scroll-based-velocity';
import { AuroraText } from '../registry/magicui/aurora-text';
import { TypewriterEffectSmooth } from '../registry/aceternity/typewriter-effect';
import { Button } from "@heroui/react";

import DashboardFooter from '../components/DashboardFooter';
import FAQCarousel from '../components/FAQCarousel';
import WhyUsSection from '../components/WhyUsSection';
import AdsCarousel from '../components/AdsCarousel';
import { DevHeroSection } from '../components/DevHeroSection';
import { NeonBackground } from '../components/NeonBackground';

const DUMMY_COURSES = [
  {
    _id: 'se-01',
    title: 'Fullstack Systems Architect',
    role_tag: 'Engineering',
    school: 'Software Systems',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
  },
  {
    _id: 'ai-01',
    title: 'Generative AI Specialist',
    role_tag: 'Intelligence',
    school: 'AI & Data',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
  },
  {
    _id: 'pm-01',
    title: 'Product Strategy Elite',
    role_tag: 'Management',
    school: 'Business & Design',
    image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&auto=format&fit=crop',
  },
  {
    _id: 'ds-01',
    title: 'Data Science & MLOps',
    role_tag: 'Data Science',
    school: 'Data Engineering',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
  },
  {
    _id: 'cs-01',
    title: 'Cyber Security Operations',
    role_tag: 'Security',
    school: 'Cyber Defense',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
  },
  {
    _id: 'cloud-01',
    title: 'Cloud Native Developer',
    role_tag: 'DevOps',
    school: 'Infrastructure',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
  }
];

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeBrief, setActiveBrief] = useState<string>('Cognition');
  const [isMuted, setIsMuted] = useState(true);

  const [courses, setCourses] = useState<any[]>(DUMMY_COURSES);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`);
        const data = await res.json();
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          setCourses(DUMMY_COURSES);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses(DUMMY_COURSES);
      }
    };
    fetchCourses();
  }, []);

  const createSlug = (title: string, id: string) => {
    if (!title || !id) return '';
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${slug}--${id}`;
  };

  const briefDetails: Record<string, { title: string; desc: React.ReactNode; image: string; video?: string; gradient: string; accent: string; icon: string }> = {
    'Cognition': {
      title: 'Cognition',
      desc: 'Studlyf understands people beyond resumes. Our AI analyzes skills, experience, learning patterns, and career intent to create meaningful connections between talent and opportunity. It delivers intelligent career guidance while helping recruiters discover true potential, not just keywords.',
      image: '/images/producrbriefCONG.png',
      gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      accent: '#818cf8',
      icon: '🧠',
    },
    'Protocol': {
      title: 'Protocol',
      desc: 'Every interaction follows a structured AI workflow — from resume analysis to hiring decisions. Automated protocols ensure fairness, transparency, and consistency across recruitment, skill evaluation, and personalized learning recommendations.',
      image: '/images/protocol.png',
      gradient: 'linear-gradient(135deg, #0a3d2e 0%, #1a6b4a 50%, #0d4a35 100%)',
      accent: '#34d399',
      icon: '⚙️',
    },
    'Verification': {
      title: 'Verification',
      desc: 'Trust is built through verification. Studlyf validates skills, certifications, and professional experience using intelligent document parsing and contextual analysis. Recruiters receive confidence-based insights to make accurate hiring decisions.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      video: '/videos/verification.mp4',
      gradient: 'linear-gradient(135deg, #1a0533 0%, #5b21b6 50%, #2e1065 100%)',
      accent: '#a78bfa',
      icon: '✅',
    },
    'Blueprint': {
      title: 'Blueprint',
      desc: 'Studlyf transforms insights into action. Candidates receive personalized learning paths and growth plans, while recruiters gain structured hiring blueprints aligned with real job requirements and organizational goals.',
      image: '/images/blueprint.png',
      gradient: 'linear-gradient(135deg, #0c1a3d 0%, #1e3a8a 50%, #1e40af 100%)',
      accent: '#60a5fa',
      icon: '📐',
    },
    'Clinical': {
      title: 'Clinical',
      desc: 'Precision matters. Advanced analytics evaluate performance trends, interview outcomes, and behavioral signals to provide measurable improvement strategies for both candidates and hiring teams.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      gradient: 'linear-gradient(135deg, #3d1a00 0%, #b45309 40%, #92400e 100%)',
      accent: '#fb923c',
      icon: '📊',
    },
    'Evidence': {
      title: 'Evidence',
      desc: 'Every recommendation is explainable and data-backed. Matching scores, learning suggestions, and hiring insights are supported by transparent reasoning and industry benchmarks, ensuring trust at every step.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      gradient: 'linear-gradient(135deg, #1a0a0a 0%, #9f1239 40%, #e11d48 100%)',
      accent: '#f87171',
      icon: '🔬',
    }
  };

  const typewriterWords = [
    { text: 'YOUR', className: 'text-black' },
    { text: 'CAREER', className: 'text-black' },
    { text: 'STARTS', className: 'text-black' },
    { text: 'HERE', className: 'text-[#7C3AED]' },
  ];





  const scrollCarousel = (id: string, direction: 'left' | 'right') => {
    const container = document.getElementById(id);
    if (container) {
      const scrollAmount = container.clientWidth + 24;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* SVG Filter for Liquid Glass Distortion */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <filter id="glass-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
        </filter>
      </svg>

      <style>
        {`
          .liquid-glass-container {
            --bg-color: rgba(255, 255, 255, 0.1);
            --highlight: rgba(255, 255, 255, 0.5);
            position: relative;
            isolation: isolate;
          }

          .glass-filter {
            position: absolute;
            inset: 0;
            z-index: 1;
            backdrop-filter: blur(6px);
            filter: url(#glass-distortion) saturate(120%) brightness(1.1);
            border-radius: inherit;
          }

          .glass-distortion-overlay {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%);
            background-size: 300% 300%;
            animation: floatDistort 15s infinite ease-in-out;
            mix-blend-mode: overlay;
            z-index: 2;
            pointer-events: none;
            border-radius: inherit;
          }

          @keyframes floatDistort {
            0% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
            100% { background-position: 0% 0%; }
          }

          .glass-overlay {
            position: absolute;
            inset: 0;
            z-index: 2;
            background: var(--bg-color);
            border-radius: inherit;
          }

          .glass-specular {
            position: absolute;
            inset: 0;
            z-index: 3;
            box-shadow: inset 1px 1px 1px var(--highlight);
            border-radius: inherit;
            border: 1px solid rgba(255,255,255,0.15);
          }

          .glass-content-inner {
            position: relative;
            z-index: 4;
            display: flex;
            width: 100%;
            height: 100%;
          }
        `}
      </style>

      <div className="min-h-screen overflow-x-hidden">
        {/* FIRST SECTION: HERO + TRUST CARD */}
        <div className="relative overflow-hidden min-h-screen">
          {/* Confined Video Background */}
          <div className="absolute inset-0 -z-20">
            <video
              src="/videos/grok-video-5d92d925-3329-4a1d-9278-b909d93b37ef (1).mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-[0.65]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20" />
          </div>

          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 pt-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-16 rounded-[4rem] overflow-hidden py-24 flex flex-col items-center justify-center gap-16 relative bg-transparent border border-white/10 shadow-2xl"
            >
              <motion.div
                animate={{ x: ['100%', '-100%'], opacity: [0, 1, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
              />

              <div className="flex flex-col items-center gap-6 relative z-20">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-black uppercase tracking-[0.2em] mb-2"
                >
                  <span className="text-black">Welcome ! </span>
                  <span className="text-[#7C3AED]">{user?.displayName || 'User'}</span>
                </motion.div>
                <TypewriterEffectSmooth words={typewriterWords} />
                <p className="text-[11px] sm:text-[14px] font-bold text-black uppercase tracking-[0.3em] max-w-2xl text-center leading-relaxed">
                  Studlyf -- Building the student internet <br />
                  <span className="text-[#7C3AED]">for Next generation</span>
                </p>
              </div>

              <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-16 relative z-20 mt-4 px-8 sm:px-16">
                <div className="flex flex-col items-center gap-10">
                  <span className="text-[12px] font-black text-black uppercase tracking-[0.4em] leading-none">Built by alumni of</span>
                  <div className="flex items-center gap-16">
                    <div className="flex items-center gap-4 group">
                      <img src="/images/google.png" className="h-8 transition-transform group-hover:scale-110" alt="Google" />
                      <span className="font-bold text-black tracking-tight text-xl">Google</span>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <img src="/images/amazon.png" className="h-8 transition-transform group-hover:scale-110" alt="Amazon" />
                      <span className="font-bold text-black tracking-tight text-xl">Amazon</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-10">
                  <span className="text-[12px] font-black text-black uppercase tracking-[0.4em] leading-none">Backed by</span>
                  <div className="flex items-center gap-16 justify-center">
                    <div className="flex items-center gap-4 group">
                      <img src="https://cdn.simpleicons.org/ycombinator" className="h-8 transition-transform group-hover:scale-110" alt="Y Combinator" />
                      <span className="font-bold text-black tracking-tight text-lg">Combinator</span>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <Zap className="w-7 h-7 text-[#7C3AED] fill-current group-hover:animate-pulse" />
                      <span className="font-bold text-black tracking-tight text-lg">Rebright</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            </motion.div>
          </div>

          {/* SECOND SECTION: COURSES FOR EVERY ambition */}
          <section className="px-16 py-20 bg-white relative z-10 w-full overflow-hidden">
            <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-center">
              {/* LEFT SIDE TYPOGRAPHY */}
              <div className="flex flex-col">
                <h1 className="text-6xl font-extrabold leading-[0.9] mb-12 text-black uppercase tracking-tighter">
                  COURSES <br />
                  FOR <br />
                  EVERY <br />
                  <span className="italic font-light text-blue-900 lowercase leading-tight block mt-2">ambition</span>
                </h1>
                <p className="text-xs tracking-[0.3em] uppercase text-blue-900 mb-6 font-bold max-w-[200px] leading-loose">
                  GLOBAL TRAINING FOR <br /> ROLE-READY EXCELLENCE.
                </p>
              </div>

              {/* RIGHT SIDE COURSE CARDS */}
              <div className="flex flex-col items-center">
                <div className="relative group w-full">
                  <div
                    id="course-carousel"
                    className="flex gap-8 overflow-x-auto pb-8 pt-4 no-scrollbar scroll-smooth snap-x"
                  >
                    {courses.map((course, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigate(`/learn/courses/${createSlug(course.title, course._id)}`)}
                        className="min-w-[280px] sm:min-w-[300px] lg:min-w-[320px] h-[400px] lg:h-[450px] relative rounded-[2.5rem] overflow-hidden shadow-2xl group hover:scale-[1.03] transition-all duration-700 snap-start cursor-pointer border border-black/5"
                      >
                        {/* Background Image */}
                        <img
                          src={course.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop'}
                          alt={course.title}
                          className="h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Dark overlay for better text contrast if needed */}
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />

                        {/* Bottom Floating Content */}
                        <div className="absolute bottom-5 left-4 right-4 bg-white rounded-3xl p-5 shadow-2xl flex justify-between items-center transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-blue-600 font-black mb-1">
                              SCHOOL OF {course.school || course.role_tag || 'ENGINEERING'}
                            </p>
                            <h3 className="text-base lg:text-lg font-black text-gray-900 leading-tight">
                              {course.title}
                            </h3>
                            <div className="mt-2 flex flex-col">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Elite Track</span>
                              <span className="text-[8px] font-medium text-gray-300">Verified Skills</span>
                            </div>
                          </div>

                          <button className="bg-[#111827] text-white rounded-2xl w-10 h-10 flex items-center justify-center group-hover:bg-[#7C3AED] transition-colors shadow-lg shadow-black/10">
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nav Buttons - Below Cards, shifted left */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '24px', marginTop: '40px', width: '100%', marginLeft: '750px' }}>
                  <button
                    onClick={() => scrollCarousel('course-carousel', 'left')}
                    style={{ width: 64, height: 64, borderRadius: '50%', border: '1px solid #e5e7eb', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 30px -8px rgba(0,0,0,0.12)', fontSize: 0 }}
                  >
                    <ChevronLeft size={30} color="#374151" />
                  </button>
                  <button
                    onClick={() => scrollCarousel('course-carousel', 'right')}
                    style={{ width: 64, height: 64, borderRadius: '50%', border: '1px solid #e5e7eb', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 30px -8px rgba(0,0,0,0.12)', fontSize: 0 }}
                  >
                    <ChevronRight size={30} color="#374151" />
                  </button>
                </div>
              </div>


            </div>

            {/* Trust & Certification Footer (Below the section as per common design patterns) */}
            <div className="mt-20 max-w-[1700px] mx-auto pt-12 border-t border-black/5 grid grid-cols-1 sm:grid-cols-2 gap-16 items-center px-16">
              <div className="flex flex-col gap-8">
                <span className="text-xl font-black text-black uppercase tracking-[0.3em]">Curriculum built by people from</span>
                <div className="flex items-center gap-12 transition-all">
                  <img src="/images/meta.png" className="h-8" alt="Meta" />
                  <img src="/images/netflix.png" className="h-8" alt="Netflix" />
                  <img src="/images/apple.png" className="h-8" alt="Apple" />
                  <img src="/images/nvidia.png" className="h-8" alt="Nvidia" />
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <span className="text-xl font-black text-black uppercase tracking-[0.3em]">Certified by</span>
                <div className="flex items-center gap-12 transition-all">
                  <img src="/images/amazon.png" className="h-9" alt="AWS" />
                  <img src="/images/microsoft.png" className="h-8" alt="Microsoft" />
                  <img src="/images/ibm.png" className="h-8" alt="IBM" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>



      {/* SECTION 4: REST OF CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10 pb-20">
        {/* Scroll Velocity (Studlyf text) above AI Era Integration */}
        <div className="mb-24 relative flex w-full flex-col items-center justify-center overflow-hidden py-10 border-b border-black/5">
          <ScrollVelocityContainer className="text-3xl font-black tracking-[-0.05em] md:text-6xl md:leading-[4rem] text-black uppercase italic">
            <ScrollVelocityRow baseVelocity={-2}>
              Studlyf &nbsp;&nbsp;&nbsp; Studlyf &nbsp;&nbsp;&nbsp; Studlyf &nbsp;&nbsp;&nbsp; Studlyf
            </ScrollVelocityRow>
          </ScrollVelocityContainer>
        </div>

        {/* AI Era Integration (Career Synergy) */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ clipPath: 'polygon(0% 0%, 55% 0%, 62% 10%, 100% 10%, 100% 100%, 0% 100%)' }}
            className="bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#F3E8FF] rounded-[3rem] p-10 sm:px-20 sm:pb-16 pt-8 sm:pt-10 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden border border-[#7C3AED]/10 shadow-sm"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#7C3AED]/[0.02] rotate-12 translate-x-1/4 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-6 h-6 bg-[#7C3AED]/10 rotate-45 rounded-sm border border-[#7C3AED]/20 blur-[1px]" />

            <div className="flex flex-col lg:flex-row items-center justify-between w-full relative z-10 gap-16">
              <div className="flex flex-col gap-6 lg:w-1/2">
                <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em]">Career Synergy</span>
                <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tighter leading-tight">
                  Streamline Your Career <br /> in <span className="text-[#7C3AED]">AI Era</span>.
                </h2>
              </div>
              <div className="lg:w-1/2 flex flex-col items-end justify-center gap-0 pt-8">
                <h2 className="text-4xl sm:text-7xl font-bold tracking-tighter text-right lowercase flex flex-col items-end">
                  <span className="text-black mr-20 sm:mr-32">i am</span>
                  <AuroraText className="bg-gradient-to-r from-[#84CC16] via-[#06B6D4] to-[#10B981] px-2 py-2 -translate-x-8 sm:-translate-x-16">career dreamer</AuroraText>
                </h2>
                <Link
                  to="/learn/career-onboarding"
                  className="bg-[#1D74F2] text-white px-14 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-xl shadow-blue-500/20 mr-12 sm:mr-20 -mt-4"
                >
                  Start
                </Link>
              </div>
            </div>
          </motion.div>
        </section>



        {/* Product Brief Section */}
        <section className="mb-16 mt-12 px-4 sm:px-0">
          <div className="flex flex-col items-center text-center">
            {/* Product Brief Header */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tighter inline-block relative w-fit">
                Product Brief
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 bg-[#A78BFA] rounded-full"
                />
              </h2>
            </div>

            {/* Tab Buttons — each with its own accent colour when active */}
            <div className="mb-4 flex flex-wrap justify-center gap-4">
              {['Cognition', 'Protocol', 'Verification', 'Blueprint', 'Clinical', 'Evidence'].map((label) => {
                const detail = briefDetails[label];
                const isActive = activeBrief === label;
                return (
                  <Button
                    key={label}
                    onClick={() => setActiveBrief(label)}
                    className={`px-6 h-10 rounded-full border transition-all duration-300 font-bold text-xs shadow-sm flex items-center gap-2 ${isActive
                      ? 'text-white scale-110 shadow-lg border-transparent'
                      : 'bg-white text-black border-black/10 hover:bg-neutral-50 shadow-sm'
                      }`}
                    style={isActive ? { background: detail.gradient, boxShadow: `0 8px 30px -8px ${detail.accent}80` } : {}}
                  >
                    <span>{detail.icon}</span> {label}
                  </Button>
                );
              })}
            </div>

            {/* Dynamic Content Display with Background */}
            <div
              className="max-w-[1400px] w-full mx-auto min-h-[480px] relative rounded-[3rem] overflow-hidden flex items-center justify-center transition-all duration-700 py-8 px-4 sm:px-10 -mt-2"
            >
              <div className="relative z-10 w-full h-full max-w-7xl flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {activeBrief && briefDetails[activeBrief] && (
                    <motion.div
                      key={activeBrief}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="relative w-full rounded-[2.5rem] overflow-hidden flex items-center justify-center p-6 sm:p-10"
                      style={{
                        background: briefDetails[activeBrief].gradient,
                      }}
                    >

                      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full">
                        <div className="flex-1 text-left order-2 lg:order-1">
                          {/* Accent label */}
                          <span className="text-xs font-black uppercase tracking-[0.4em] mb-4 block" style={{ color: briefDetails[activeBrief].accent }}>
                            {briefDetails[activeBrief].icon} {activeBrief} Module
                          </span>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="text-white/90 text-base sm:text-lg leading-relaxed tracking-tight"
                            style={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 400 }}
                          >
                            {briefDetails[activeBrief].desc}
                          </motion.p>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className="mt-5"
                          >
                            <Button
                              className="bg-[#1D74F2] text-white font-bold px-8 py-3.5 rounded-full text-xs shadow-xl hover:bg-[#1D74F2]/90 hover:scale-105 transition-all"
                            >
                              Start Journey
                            </Button>
                          </motion.div>
                        </div>

                        {(briefDetails[activeBrief].image || briefDetails[activeBrief].video) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="lg:w-[280px] w-full flex-shrink-0 relative group order-1 lg:order-2 flex items-center justify-center"
                          >
                            {briefDetails[activeBrief].video ? (
                              <div className="relative w-full aspect-square flex items-center justify-center">
                                <video
                                  src={briefDetails[activeBrief].video}
                                  autoPlay
                                  loop
                                  muted={isMuted}
                                  playsInline
                                  className="w-full h-full object-contain relative z-10"
                                />
                                <button
                                  onClick={() => setIsMuted(!isMuted)}
                                  className="absolute bottom-4 right-4 p-3 bg-black/30 backdrop-blur-xl rounded-full text-white hover:bg-black/50 border border-white/20 transition-all z-20 shadow-xl"
                                >
                                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                              </div>
                            ) : (
                              <div className="relative w-full aspect-square flex items-center justify-center">
                                <img
                                  src={briefDetails[activeBrief].image}
                                  alt={briefDetails[activeBrief].title}
                                  className="w-full h-full object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-1000"
                                />
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>


        {/* Philosophy Section */}
        <section className="grid lg:grid-cols-2 gap-8 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#111827] rounded-[2.5rem] p-10 sm:p-12 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10">
              <span className="text-[10px] font-black text-[#A78BFA] uppercase tracking-[0.5em] mb-6 block">Our Philosophy</span>
              <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tighter mb-6 leading-tight">
                Engineering Excellence <br /> Through Clinical Evidence.
              </h2>
              <p className="text-white/60 leading-relaxed mb-8 text-base">
                Theoretical knowledge is entropy. We value verified skill sets deconstructed from real-world systems. Every track on Studlyf is designed to build clinical evidence for your engineering authority.
              </p>
              <ul className="space-y-6">
                {['System Deconstruction', 'Clinical Readiness scoring', 'GitHub Verification Protocol'].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-[#A78BFA]">
                    <div className="w-2 h-2 bg-[#A78BFA] rounded-full shadow-[0_0_15px_#A78BFA]" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute -bottom-40 -right-40 w-full max-w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[150px]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#F5F3FF] rounded-[2.5rem] p-10 sm:p-12 flex flex-col justify-center relative overflow-hidden"
          >
            <h2 className="text-3xl font-bold text-[#111827] uppercase tracking-tighter mb-6 leading-tight">
              Unlock Your <br /> Career Growth.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-10 text-base">
              Connect your professional identity, verify your code through our AI analysis protocol, and get directly matched with our ecosystem of hiring partners like Nirvaha, DataFlow, and more.
            </p>
            <Link
              to="/dashboard"
              className="w-fit bg-white text-[#7C3AED] px-10 py-5 rounded-3xl font-bold uppercase tracking-widest text-[11px] border border-[#7C3AED]/20 hover:shadow-2xl hover:scale-105 transition-all"
            >
              Start Verification
            </Link>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/50 rounded-full blur-3xl opacity-50" />
          </motion.div>
        </section>
      </div >

      <div style={{ marginTop: '-32px' }}>
        <AdsCarousel />
      </div>
      <WhyUsSection />
      <FAQCarousel />
      <DashboardFooter />
    </>
  );
};

export default DashboardHome;
