import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  Target,
  Zap,
  Shield,
  BookOpen,
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
import { NeonBackground } from '../components/NeonBackground';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [activeBrief, setActiveBrief] = useState<string>('Cognition');
  const [isMuted, setIsMuted] = useState(true);

  const briefDetails: Record<string, { title: string; desc: React.ReactNode; image: string; video?: string; images?: string[] }> = {
    'Cognition': {
      title: 'Cognition',
      desc: 'Studlyf understands people beyond resumes. Our AI analyzes skills, experience, learning patterns, and career intent to create meaningful connections between talent and opportunity. It delivers intelligent career guidance while helping recruiters discover true potential, not just keywords.',
      image: '/images/producrbriefCONG.png'
    },
    'Protocol': {
      title: 'Protocol',
      desc: 'Every interaction follows a structured AI workflow — from resume analysis to hiring decisions. Automated protocols ensure fairness, transparency, and consistency across recruitment, skill evaluation, and personalized learning recommendations.',
      image: '/images/protocol.png'
    },
    'Verification': {
      title: 'Verification',
      desc: 'Trust is built through verification. Studlyf validates skills, certifications, and professional experience using intelligent document parsing and contextual analysis. Recruiters receive confidence-based insights to make accurate hiring decisions.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      video: '/videos/verification.mp4'
    },
    'Blueprint': {
      title: 'Blueprint',
      desc: 'Studlyf transforms insights into action. Candidates receive personalized learning paths and growth plans, while recruiters gain structured hiring blueprints aligned with real job requirements and organizational goals.',
      image: '/images/blueprint.png'
    },
    'Clinical': {
      title: 'Clinical',
      desc: 'Precision matters. Advanced analytics evaluate performance trends, interview outcomes, and behavioral signals to provide measurable improvement strategies for both candidates and hiring teams.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
    },
    'Evidence': {
      title: 'Evidence',
      desc: 'Every recommendation is explainable and data-backed. Matching scores, learning suggestions, and hiring insights are supported by transparent reasoning and industry benchmarks, ensuring trust at every step.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    }
  };

  const typewriterWords = [
    { text: 'YOUR', className: 'text-black' },
    { text: 'CAREER', className: 'text-black' },
    { text: 'STARTS', className: 'text-black' },
    { text: 'HERE', className: 'text-[#7C3AED]' },
  ];

  const features = [
    {
      title: 'Hero Tracks',
      desc: 'Role-focused engineering specialization for elite readiness.',
      icon: Zap,
      to: '/learn/courses',
    },
    {
      title: 'Skill Assessment',
      desc: 'Identify your strengths with clinical scoring maps.',
      icon: Target,
      to: '/learn/assessment',
    },
    {
      title: 'Proof of Skill',
      desc: 'Build evidence-based developer portfolios.',
      icon: Shield,
      to: '/job-prep/portfolio',
    },
    {
      title: 'Clinical Resumes',
      desc: 'Instant verification-ready resumes for partners.',
      icon: BookOpen,
      to: '/job-prep/resume-builder',
    },
  ];

  const courses = [
    {
      title: 'Software Engineering',
      school: 'Engineering',
      image:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
    },
    {
      title: 'Artificial Intelligence',
      school: 'Intelligence',
      image:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
    },
    {
      title: 'Product Management',
      school: 'Management',
      image:
        'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&auto=format&fit=crop',
    },
    {
      title: 'Data & Analytics',
      school: 'Data Science',
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    },
    {
      title: 'Cyber Security',
      school: 'Security',
      image:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
    },
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

          {/* SECOND SECTION: COURSES CAROUSEL */}
          <section className="mb-24 relative z-10 w-full overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-start gap-16">
              <div className="lg:w-1/4 pt-24 lg:pl-8">
                <h2 className="text-4xl sm:text-5xl font-black text-[#111827] leading-[0.85] mb-8 tracking-tighter uppercase">
                  Courses <br /> For Every <br />
                  <span className="text-gray-400 italic font-medium lowercase">Ambition</span>
                </h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.25em] leading-relaxed">
                  Global training for <br /> role-ready excellence.
                </p>
              </div>

              <div className="lg:w-3/4 w-full relative group">
                <div
                  id="course-carousel"
                  className="flex gap-6 overflow-x-auto pb-8 pt-4 no-scrollbar scroll-smooth snap-x"
                >
                  {[...courses, ...courses, ...courses, ...courses, ...courses].map((course, idx) => (
                    <div
                      key={idx}
                      className="w-full sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)] h-[350px] flex-shrink-0 snap-start rounded-[2.2rem] overflow-hidden relative group/card shadow-lg cursor-pointer"
                    >
                      <div className="absolute inset-0">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110" />
                        <div className="absolute inset-0 bg-black/5 group-hover/card:bg-black/20 transition-colors" />
                      </div>

                      <div className="absolute inset-x-5 bottom-5">
                        <div className="bg-white rounded-[1.5rem] p-4 shadow-xl transform translate-y-2 group-hover/card:translate-y-0 transition-transform">
                          <div className="flex flex-col gap-0.5 mb-3">
                            <span className="text-[8px] font-black text-[#7C3AED] uppercase tracking-[0.2em] block">
                              School of {course.school}
                            </span>
                            <h3 className="text-base font-black text-[#111827] tracking-tighter leading-tight">
                              {course.title}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Elite Track</span>
                              <span className="text-[7px] font-medium text-gray-300">Verified Skills</span>
                            </div>
                            <div className="w-9 h-9 rounded-lg bg-[#111827] text-white flex items-center justify-center group-hover/card:bg-[#7C3AED] transition-colors">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-10 mt-2 mb-16">
                  <button
                    onClick={() => scrollCarousel('course-carousel', 'left')}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-gray-800 transition-all bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-purple-500/20 active:scale-95"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                  <button
                    onClick={() => scrollCarousel('course-carousel', 'right')}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-gray-800 transition-all bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-purple-500/20 active:scale-95"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                </div>

                {/* Trust & Certification Footer */}
                <div className="mb-8 pt-12 border-t border-black/5 grid grid-cols-1 sm:grid-cols-2 gap-16 items-center -ml-12 sm:-ml-24">
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
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* SECTION 3: FEATURES */}
      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 hover:border-[#7C3AED]/30 transition-all cursor-pointer relative overflow-hidden"
              >
                <Link to={feature.to} className="relative z-10">
                  <div className="w-16 h-16 bg-[#F5F3FF] rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-500">
                    <Icon className="w-8 h-8 text-[#7C3AED] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111827] uppercase mb-4 tracking-tight group-hover:text-[#7C3AED] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </Link>
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#7C3AED]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
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
        <section className="mb-24 mt-20 px-4 sm:px-0">
          <div className="flex flex-col items-center text-center">
            {/* Product Brief Header */}
            <div className="flex flex-col items-center gap-4 mb-12">
              <h2 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tighter inline-block relative w-fit">
                Product Brief
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1.5 bg-[#A78BFA] rounded-full"
                />
              </h2>
            </div>

            {/* HeroUI Ghost Buttons Section */}
            <div className="mb-4 flex flex-wrap justify-center gap-4">
              {['Cognition', 'Protocol', 'Verification', 'Blueprint', 'Clinical', 'Evidence'].map((label) => (
                <Button
                  key={label}
                  onClick={() => setActiveBrief(label)}
                  className={`px-8 h-12 rounded-full border transition-all duration-300 font-bold text-sm shadow-sm ${activeBrief === label
                    ? 'bg-[#1D74F2] text-white border-[#1D74F2] scale-110 shadow-blue-500/20'
                    : 'bg-white text-black border-black/10 hover:border-[#1D74F2] hover:bg-neutral-50 shadow-sm'
                    }`}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Dynamic Content Display with Background */}
            <div
              className="max-w-[1600px] w-full mx-auto min-h-[620px] relative rounded-[4rem] overflow-hidden flex items-center justify-center transition-all duration-700 py-12 px-4 sm:px-12"
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
                      className="relative w-full rounded-[3.5rem] overflow-hidden flex items-center justify-center p-8 sm:p-16 border border-white/20 bg-white/10 backdrop-blur-2xl"
                      style={{
                        backgroundImage: 'url("/images/PD2M.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="glass-overlay opacity-30" />

                      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 w-full">
                        <div className="flex-1 text-left order-2 lg:order-1">
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="text-black text-lg sm:text-xl leading-relaxed tracking-tight"
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
                              className="bg-[#1D74F2] text-white font-bold px-10 py-5 rounded-full text-sm shadow-xl hover:bg-[#1D74F2]/90 hover:scale-105 transition-all"
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
                            className="lg:w-[380px] w-full flex-shrink-0 relative group order-1 lg:order-2 flex items-center justify-center"
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

        {/* GET Hired Section with Background Image */}
        <section
          className="mb-32 relative min-h-[650px] flex items-center justify-center overflow-hidden"
        >
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/aftproduct.png"
              alt="Hiring Background"
              className="w-full h-full object-cover blur-[2px]"
            />
            {/* Subtle overlay to help text legibility if needed */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-16 pt-8 pb-32">
            {/* Left Side: Text and Button */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-left"
            >
              <h2
                className="text-white text-5xl sm:text-7xl leading-tight tracking-tight uppercase mb-8"
                style={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 400 }}
              >
                GET Hired! <br />
                In Startup&apos;s
              </h2>
              <Link
                to="/dashboard"
                className="inline-block bg-[#1D74F2] text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#1D74F2]/90 hover:scale-105 transition-all"
              >
                Get Started
              </Link>

            </motion.div>

            {/* Right Side: Comparison Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full max-w-xl"
            >
              <div className="liquid-glass-container p-10 rounded-[3rem] overflow-hidden">
                <div className="glass-filter" />
                <div className="glass-distortion-overlay" />
                <div className="glass-overlay opacity-20" />
                <div className="glass-specular" />

                <div className="glass-content-inner relative z-10 grid grid-cols-2 gap-16 items-center">
                  {/* Liquid Glass Violet Divider - Adjusted Positioning */}
                  <div className="absolute left-1/2 top-[-2.5rem] bottom-[-2.5rem] w-[2px] bg-gradient-to-b from-transparent via-violet-400/80 to-transparent shadow-[0_0_15px_rgba(167,139,250,0.6)] z-20 -translate-x-1/2" />

                  <div className="space-y-6 relative h-full flex flex-col justify-center pr-8 sm:pr-12">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">MNC</h3>
                    <ul className="space-y-4 text-sm text-white font-bold">
                      <li className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                        Structured Growth
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                        Global Exposure
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                        Tiered Authority
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-6 relative h-full flex flex-col justify-center pl-8 sm:pl-12">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Startups</h3>
                    <ul className="space-y-4 text-sm text-white font-bold">
                      <li className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                        Rapid Execution
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                        Dynamic Roles
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                        High Ownership
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stat Tags Spanning Entire Row - Elevated & Enlarged */}
          <div className="absolute bottom-24 left-0 w-full z-20 px-8 sm:px-16 lg:px-24">
            <div className="max-w-[1600px] mx-auto flex flex-row items-center justify-between gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="w-3 h-3 bg-[#1D74F2] rounded-full shadow-[0_0_15px_#1D74F2]" />
                <span
                  className="text-white text-[14px] sm:text-[18px] font-bold uppercase tracking-[0.4em] whitespace-nowrap"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  starts at 10k+
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="w-3 h-3 bg-violet-400 rounded-full shadow-[0_0_15px_rgba(167,139,250,0.8)]" />
                <span
                  className="text-white text-[14px] sm:text-[18px] font-bold uppercase tracking-[0.4em] whitespace-nowrap"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  10+ Startup&apos;s
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_#34d399]" />
                <span
                  className="text-white text-[14px] sm:text-[18px] font-bold uppercase tracking-[0.4em] whitespace-nowrap"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  80% Success rate
                </span>
              </motion.div>
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

      <WhyUsSection />
      <FAQCarousel />
      <DashboardFooter />
    </>
  );
};

export default DashboardHome;
