import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  Target,
  Zap,
  Shield,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { ScrollVelocityContainer, ScrollVelocityRow } from '../registry/magicui/scroll-based-velocity';
import { AuroraText } from '../registry/magicui/aurora-text';
import { TypewriterEffectSmooth } from '../registry/aceternity/typewriter-effect';

import DashboardFooter from '../components/DashboardFooter';
import FAQCarousel from '../components/FAQCarousel';
import WhyUsSection from '../components/WhyUsSection';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  const typewriterWords = [
    { text: 'YOUR' },
    { text: 'CAREER' },
    { text: 'STARTS' },
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
      container.scrollBy({
        left: direction === 'left' ? -400 : 400,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* HERO SECTION WITH VIDEO */}
      <div className="relative overflow-hidden min-h-screen pt-32">
        <div className="absolute inset-0 -z-10">
          <video
            src="/videos/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-20"
          >
            <TypewriterEffectSmooth words={typewriterWords} />

            <p className="mt-6 text-gray-700 text-sm uppercase tracking-widest">
              Welcome back, {user?.displayName || 'Elite Member'}
            </p>
          </motion.div>

          {/* COURSES CAROUSEL */}
          <section className="mb-24">
            <div
              id="course-carousel"
              className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth"
            >
              {courses.map((course, idx) => (
                <div
                  key={idx}
                  className="min-w-[300px] h-[380px] rounded-3xl overflow-hidden relative shadow-lg"
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute bottom-6 left-6 bg-white rounded-2xl p-4 shadow-lg">
                    <p className="text-xs uppercase font-bold text-[#7C3AED]">
                      School of {course.school}
                    </p>
                    <h3 className="text-lg font-bold">{course.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-6 mt-6">
              <button
                onClick={() => scrollCarousel('course-carousel', 'left')}
                className="p-4 bg-white rounded-full shadow"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => scrollCarousel('course-carousel', 'right')}
                className="p-4 bg-white rounded-full shadow"
              >
                <ChevronRight />
              </button>
            </div>
          </section>

          {/* FEATURE GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-sm"
                >
                  <Link to={feature.to}>
                    <div className="w-14 h-14 bg-[#F5F3FF] rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-[#7C3AED]" />
                    </div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.desc}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* PHILOSOPHY SECTION */}
          <section className="grid lg:grid-cols-2 gap-10 mb-24">
            <div className="bg-black text-white p-12 rounded-3xl">
              <h2 className="text-3xl font-bold mb-6">
                Engineering Excellence Through Evidence
              </h2>
              <p className="text-gray-400">
                Theoretical knowledge alone is not enough. Every track builds
                verified skill authority through system-level deconstruction and
                proof-based evaluation.
              </p>
            </div>

            <div className="bg-[#F5F3FF] p-12 rounded-3xl">
              <h2 className="text-3xl font-bold mb-6">
                Streamline Your Career in AI Era
              </h2>

              <h3 className="text-4xl font-bold mb-6">
                <AuroraText>career dreamer</AuroraText>
              </h3>

              <Link
                to="/learn/courses"
                className="bg-[#7C3AED] text-white px-8 py-4 rounded-2xl font-bold"
              >
                Start Now
              </Link>
            </div>
          </section>

          {/* SCROLL VELOCITY */}
          <div className="mb-20">
            <ScrollVelocityContainer className="text-4xl font-black uppercase">
              <ScrollVelocityRow baseVelocity={-1}>
                Studlyf &nbsp;&nbsp; Studlyf &nbsp;&nbsp; Studlyf
              </ScrollVelocityRow>
            </ScrollVelocityContainer>
          </div>
        </div>
      </div>

      <WhyUsSection />
      <FAQCarousel />
      <DashboardFooter />
    </>
  );
};

export default DashboardHome;