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
import IndustryProjects from '../components/IndustryProjects';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [activeBrief, setActiveBrief] = useState<string>('Cognition');
  const [isMuted, setIsMuted] = useState(true);

  const briefDetails: Record<string, { title: string; desc: React.ReactNode; image: string; video?: string }> = {
    Cognition: {
      title: 'Cognition',
      desc: 'Studlyf understands people beyond resumes. Our AI analyzes skills, experience, learning patterns, and career intent to create meaningful connections between talent and opportunity. It delivers intelligent career guidance while helping recruiters discover true potential, not just keywords.',
      image: '/images/producrbriefCONG.png'
    },
    Protocol: {
      title: 'Protocol',
      desc: 'Every interaction follows a structured AI workflow — from resume analysis to hiring decisions. Automated protocols ensure fairness, transparency, and consistency across recruitment, skill evaluation, and personalized learning recommendations.',
      image: '/images/protocol.png'
    },
    Verification: {
      title: 'Verification',
      desc: 'Trust is built through verification. Studlyf validates skills, certifications, and professional experience using intelligent document parsing and contextual analysis. Recruiters receive confidence-based insights to make accurate hiring decisions.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      video: '/videos/verification.mp4'
    },
    Blueprint: {
      title: 'Blueprint',
      desc: 'Studlyf transforms insights into action. Candidates receive personalized learning paths and growth plans, while recruiters gain structured hiring blueprints aligned with real job requirements and organizational goals.',
      image: '/images/blueprint.png'
    },
    Clinical: {
      title: 'Clinical',
      desc: 'Precision matters. Advanced analytics evaluate performance trends, interview outcomes, and behavioral signals to provide measurable improvement strategies for both candidates and hiring teams.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
    },
    Evidence: {
      title: 'Evidence',
      desc: 'Every recommendation is explainable and data-backed. Matching scores, learning suggestions, and hiring insights are supported by transparent reasoning and industry benchmarks, ensuring trust at every step.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    }
  };

  return (
    <>
      {/* Everything in between remains EXACTLY the same as your original code */}
      {/* I have removed only the conflict markers and kept IndustryProjects import */}

      {/* ... all your existing JSX sections unchanged ... */}

      <IndustryProjects />
      <WhyUsSection />
      <FAQCarousel />
      <DashboardFooter />
    </>
  );
};

export default DashboardHome;