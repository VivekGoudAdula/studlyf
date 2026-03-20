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
import GetHiredSection from '../components/GetHiredSection';
import { DevHeroSection } from '../components/DevHeroSection';
import FeaturedColleges from '../components/FeaturedColleges';
// import { NeonBackground } from '../components/NeonBackground';

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
  },
  {
    _id: 'blockchain-01',
    title: 'Web3 & Blockchain Architect',
    role_tag: 'Web3',
    school: 'Distributed Systems',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop',
  },
  {
    _id: 'game-01',
    title: 'Unity Engine & XR Reality',
    role_tag: 'Game Dev',
    school: 'Creative Media',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
  },
  {
    _id: 'uiux-01',
    title: 'Product Design & HCI',
    role_tag: 'Design',
    school: 'Creative Arts',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
  },
  {
    _id: 'fintech-01',
    title: 'Fintech Systems Engineer',
    role_tag: 'Finance',
    school: 'Economics & Systems',
    image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&auto=format&fit=crop',
  }
];

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeBrief, setActiveBrief] = useState<string>('Cognition');
  const [isMuted, setIsMuted] = useState(true);

  const [courses, setCourses] = useState<any[]>(DUMMY_COURSES);
  const carouselRef = React.useRef<HTMLDivElement>(null);
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
      gradient: '#301040',
      accent: '#E03070',
      icon: '🧠',
    },
    'Protocol': {
      title: 'Protocol',
      desc: 'Every interaction follows a structured AI workflow — from resume analysis to hiring decisions. Automated protocols ensure fairness, transparency, and consistency across recruitment, skill evaluation, and personalized learning recommendations.',
      image: '/images/protocol.png',
      gradient: '#301050',
      accent: '#E03040',
      icon: '⚙️',
    },
    'Verification': {
      title: 'Verification',
      desc: 'Trust is built through verification. Studlyf validates skills, certifications, and professional experience using intelligent document parsing and contextual analysis. Recruiters receive confidence-based insights to make accurate hiring decisions.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      video: '/videos/verification.mp4',
      gradient: '#201040',
      accent: '#E02040',
      icon: '✅',
    },
    'Blueprint': {
      title: 'Blueprint',
      desc: 'Studlyf transforms insights into action. Candidates receive personalized learning paths and growth plans, while recruiters gain structured hiring blueprints aligned with real job requirements and organizational goals.',
      image: '/images/blueprint.png',
      gradient: '#201050',
      accent: '#e2e8f0',
      icon: '📐',
    },
    'Clinical': {
      title: 'Clinical',
      desc: 'Precision matters. Advanced analytics evaluate performance trends, interview outcomes, and behavioral signals to provide measurable improvement strategies for both candidates and hiring teams.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      gradient: '#E03040',
      accent: '#f8fafc',
      icon: '📊',
    },
    'Evidence': {
      title: 'Evidence',
      desc: 'Every recommendation is explainable and data-backed. Matching scores, learning suggestions, and hiring insights are supported by transparent reasoning and industry benchmarks, ensuring trust at every step.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      gradient: '#E03070',
      accent: '#f8fafc',
      icon: '🔬',
    }
  };

  const typewriterWords = [
    { text: 'YOUR', className: 'text-black' },
    { text: 'CAREER', className: 'text-black' },
    { text: 'STARTS', className: 'text-black' },
    { text: 'HERE', className: 'text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DFF] via-[#EC4899] to-[#FF5B5B]' },
  ];





  const scrollCarousel = (direction: 'left' | 'right') => {
    const container = carouselRef.current || document.getElementById('course-carousel');
    if (container) {
      const scrollAmount = container.clientWidth;
      const target = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: target,
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

          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 pt-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-16 rounded-[4rem] overflow-hidden pt-12 pb-20 flex flex-col items-center justify-center gap-12 relative bg-transparent border border-white/10 shadow-2xl"
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
                  className="text-lg sm:text-2xl font-black uppercase tracking-[0.2em] mb-4"
                >
                  <span className="text-black">Welcome ! </span>
                  <span className="text-[#7C3AED]">{user?.displayName || 'User'}</span>
                </motion.div>
                <div className="scale-75 sm:scale-100 origin-center">
                  <TypewriterEffectSmooth words={typewriterWords} />
                </div>
                <p className="text-[9px] sm:text-[14px] font-bold text-black uppercase tracking-[0.3em] max-w-2xl text-center leading-relaxed px-4">
                  Studlyf -- Building the student internet <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DFF] via-[#EC4899] to-[#FF5B5B]">FOR NEXT GENERATION</span>
                </p>
              </div>

              <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 relative z-20 mt-2 px-6 sm:px-16">
                <div className="flex flex-col items-center gap-6 md:gap-10">
                  <span className="text-[10px] sm:text-[12px] font-black text-black uppercase tracking-[0.4em] leading-none text-center">Built by alumni of</span>
                  <div className="flex items-center gap-8 sm:gap-16">
                    <div className="flex items-center gap-3 sm:gap-4 group">
                      <img src="/images/google.png" className="h-6 sm:h-8 transition-transform group-hover:scale-110" alt="Google" />
                      <span className="font-bold text-black tracking-tight text-lg sm:text-xl">Google</span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 group">
                      <img src="/images/amazon.png" className="h-6 sm:h-8 transition-transform group-hover:scale-110" alt="Amazon" />
                      <span className="font-bold text-black tracking-tight text-lg sm:text-xl">Amazon</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-6 md:gap-10">
                  <span className="text-[10px] sm:text-[12px] font-black text-black uppercase tracking-[0.4em] leading-none text-center">Backed by</span>
                  <div className="flex items-center gap-8 sm:gap-16 justify-center">
                    <div className="flex items-center gap-3 sm:gap-4 group">
                      <img src="https://cdn.simpleicons.org/ycombinator" className="h-6 sm:h-8 transition-transform group-hover:scale-110" alt="Y Combinator" />
                      <span className="font-bold text-black tracking-tight text-base sm:text-lg">Combinator</span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 group">
                      <Zap className="w-5 h-5 sm:w-7 sm:h-7 text-[#7C3AED] fill-current group-hover:animate-pulse" />
                      <span className="font-bold text-black tracking-tight text-base sm:text-lg">Rebright</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            </motion.div>
          </div>

          {/* SECOND SECTION: COURSES FOR EVERY ambition */}
          <section className="px-6 sm:px-16 py-12 sm:py-20 bg-white relative z-10 w-full overflow-hidden">
            <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-center">
              {/* LEFT SIDE TYPOGRAPHY */}
              <div className="flex flex-col text-center lg:text-left">
                <h1 className="text-4xl sm:text-6xl font-extrabold leading-[0.9] mb-8 sm:mb-12 text-black uppercase tracking-tighter">
                  COURSES <br />
                  FOR <br />
                  EVERY <br />
                  <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DFF] via-[#EC4899] to-[#FF5B5B] lowercase leading-tight block mt-2">ambition</span>
                </h1>
                <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-blue-900 mb-6 font-bold leading-loose">
                  GLOBAL TRAINING <br /> FOR ROLE-READY EXCELLENCE.
                </p>
              </div>

              {/* RIGHT SIDE COURSE CARDS */}
              <div
                ref={carouselRef}
                id="course-carousel"
                className="flex gap-8 overflow-x-scroll pb-6 pt-4 no-scrollbar"
              >
                {courses.map((course, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(`/learn/courses/${createSlug(course.title, course._id)}`)}
                    className="min-w-[220px] sm:min-w-[260px] lg:min-w-[290px] h-[400px] lg:h-[440px] relative rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-all duration-700 cursor-pointer shadow-lg border border-black/[0.03]"
                  >
                    {/* Background Image */}
                    <img
                      src={course.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop'}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    {/* Bottom Information Block */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white rounded-[1.2rem] p-4 flex justify-between items-center shadow-xl shadow-black/5">
                      <div className="flex flex-col">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">
                          SCHOOL OF {course.school || course.role_tag || 'ENGINEERING'}
                        </p>
                        <h3 className="text-sm font-bold text-[#111827] leading-tight">
                          {course.title}
                        </h3>
                      </div>
                      <ChevronRight size={18} className="flex-shrink-0 text-gray-400 group-hover:text-[#7C3AED] transition-colors ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FULL WIDTH NAVIGATION ROW - Placed outside the grid for absolute visibility */}
            <div className="flex flex-col items-center justify-center gap-8 mt-4 w-full relative z-30">
              <div className="flex items-center gap-10">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="w-16 h-16 rounded-full border border-gray-100 bg-white flex items-center justify-center cursor-pointer shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:bg-gray-50 transition-all hover:scale-110 active:scale-95 group/nav"
                >
                  <ChevronLeft size={30} className="text-gray-400 group-hover/nav:text-[#7C3AED] transition-colors" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  <div className="w-10 h-2.5 rounded-full bg-[#7C3AED] shadow-sm shadow-[#7C3AED]/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                </div>

                <button
                  onClick={() => scrollCarousel('right')}
                  className="w-16 h-16 rounded-full border border-gray-100 bg-white flex items-center justify-center cursor-pointer shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:bg-gray-50 transition-all hover:scale-110 active:scale-95 group/nav"
                >
                  <ChevronRight size={30} className="text-gray-400 group-hover/nav:text-[#7C3AED] transition-colors" />
                </button>
              </div>
            </div>

            {/* Trust & Certification Footer */}
            <div className="mt-12 sm:mt-20 max-w-[1700px] mx-auto pt-12 border-t border-black/5 grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 items-start px-6 sm:px-16">
              <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
                <span className="text-lg sm:text-xl font-black text-black uppercase tracking-[0.3em]">Curriculum built by people from</span>
                <div className="flex items-center justify-center gap-6 sm:gap-12 transition-all flex-wrap">
                  <img src="/images/meta.png" className="h-6 sm:h-8" alt="Meta" />
                  <img src="/images/netflix.png" className="h-6 sm:h-8" alt="Netflix" />
                  <img src="/images/apple.png" className="h-6 sm:h-8" alt="Apple" />
                  <img src="/images/nvidia.png" className="h-6 sm:h-8" alt="Nvidia" />
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
                <span className="text-lg sm:text-xl font-black text-black uppercase tracking-[0.3em]">Certified by</span>
                <div className="flex items-center justify-center gap-6 sm:gap-12 transition-all flex-wrap">
                  <img src="/images/amazon.png" className="h-7 sm:h-9" alt="AWS" />
                  <img src="/images/microsoft.png" className="h-6 sm:h-8" alt="Microsoft" />
                  <img src="/images/ibm.png" className="h-6 sm:h-8" alt="IBM" />
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
            style={{ clipPath: window.innerWidth > 640 ? 'polygon(0% 0%, 55% 0%, 62% 10%, 100% 10%, 100% 100%, 0% 100%)' : 'none' }}
            className="bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#F3E8FF] rounded-[2rem] sm:rounded-[3rem] py-12 sm:py-24 px-6 sm:px-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative overflow-hidden border border-[#7C3AED]/10 shadow-sm"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#7C3AED]/[0.02] rotate-12 translate-x-1/4 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-6 h-6 bg-[#7C3AED]/10 rotate-45 rounded-sm border border-[#7C3AED]/20 blur-[1px]" />

            <div className="flex flex-col lg:flex-row items-center justify-between w-full relative z-10 gap-10 lg:gap-16">
              <div className="flex flex-col gap-4 sm:gap-6 lg:w-1/2 text-center lg:text-left">
                <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em]">Career Synergy</span>
                <h2 className="text-3xl sm:text-6xl font-black text-black tracking-tighter leading-tight">
                  Streamline Your Career <br /> in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DFF] via-[#EC4899] to-[#FF5B5B]">AI Era</span>.
                </h2>
              </div>
              <div className="lg:w-1/2 flex flex-col items-center lg:items-end justify-center gap-0 pt-4 lg:pt-8">
                <h2 className="text-2xl sm:text-5xl font-bold tracking-tighter text-center lg:text-right lowercase flex flex-col items-center lg:items-end">
                  <span className="text-black lg:mr-12 sm:lg:mr-20">i am</span>
                  <AuroraText className="bg-gradient-to-r from-[#84CC16] via-[#06B6D4] to-[#10B981] lg:translate-x-2 sm:lg:translate-x-4 mt-2">career dreamer</AuroraText>
                </h2>
                <Link
                  to="/learn/career-onboarding"
                  className="bg-[#1D74F2] text-white px-10 sm:px-14 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl hover:scale-105 transition-all shadow-xl shadow-blue-500/20 lg:mr-12 sm:lg:mr-20 mt-8"
                >
                  Start
                </Link>
              </div>
            </div>
          </motion.div>
        </section >



        {/* Product Brief Section */}
        < section className="mb-16 mt-12 px-4 sm:px-0" >
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
              className="max-w-[1400px] w-full mx-auto min-h-[600px] relative rounded-[3rem] overflow-hidden flex items-center justify-center transition-all duration-700 py-8 px-4 sm:px-10 -mt-2"
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
                      className="relative w-full min-h-[500px] rounded-[2.5rem] overflow-hidden flex items-center justify-center p-6 sm:p-10"
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
                            className="mt-8"
                          >
                            <Button
                              className="bg-black text-white font-bold px-8 py-3.5 rounded-full text-xs shadow-xl hover:bg-black/80 hover:scale-105 transition-all"
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



      </div>

      <div className="mb-20">
        <GetHiredSection />
      </div>

      <div className="relative z-20">
        <AdsCarousel />
      </div>
      <FeaturedColleges />
      <WhyUsSection />
      <FAQCarousel />
      <DashboardFooter />
    </>
  );
};

export default DashboardHome;
