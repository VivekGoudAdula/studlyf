import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, Clock, BarChart2, BadgeCheck, Briefcase, Users, ArrowRight, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

 /* ─────────────────────────── track data ─────────────────────────── */
 // Removed hardcoded tracks to only show database content.

/* ─────────────────────────── component ─────────────────────────── */
const CoursesOverview: React.FC = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/courses`);
                const data = await res.json();
                if (data && Array.isArray(data)) {
                    setCourses(data);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setCourses([]);
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

    return (
        <div className="min-h-screen bg-[#FAFAFA] overflow-x-hidden">
            {/* ── hero ── */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* ambient blobs */}
                <div
                    className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none blur-[120px]"
                    style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
                />
                <div
                    className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none blur-[100px]"
                    style={{ background: 'radial-gradient(circle, #1D74F2 0%, transparent 70%)' }}
                />

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    {/* breadcrumb pill */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white border border-[#7C3AED]/15 shadow-sm px-5 py-2 rounded-full mb-8"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.4em]">Learn → Courses</span>
                    </motion.div>

                     <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#111827] tracking-tighter leading-[0.88] mb-6 uppercase"
                    >
                        Master Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DFF] via-[#EC4899] to-[#FF5B5B]">
                            ADVANCED MODULES
                        </span>
                    </motion.h1>


                </div>
            </section>

             {/* ── Dynamic courses from Database ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-32">
                <div className="mb-12">
                    <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.5em] mb-4 block">Proprietary Elite Modules</span>
                    <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter uppercase">Available <br /><span className="text-[#7C3AED]">Learning Modules</span>.</h2>
                </div>
                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, i) => (
                            <motion.div
                                key={course._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                onClick={() => navigate(`/learn/courses/${createSlug(course.title, course._id)}`)}
                                className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group"
                            >
                                <div className="h-56 relative overflow-hidden">
                                    <img
                                        src={course.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop'}
                                        alt={course.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            const target = e.currentTarget;
                                            target.onerror = null;
                                            target.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop";
                                        }}
                                        style={{ background: '#F3F4F6' }}
                                    />
                                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/20">
                                        {course.role_tag || 'Premium Module'}
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-[#7C3AED] uppercase tracking-widest border border-[#7C3AED]/20 shadow-sm">
                                        {course.difficulty || 'Advanced Strategy'}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{course.duration || 'Flexible Runtime'}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight uppercase leading-tight line-clamp-2">{course.title}</h3>
                                    <p className="text-gray-500 text-xs mb-6 line-clamp-3 leading-relaxed font-medium" title={course.description}>
                                        {course.description || 'Comprehensive professional training module architected for elite mastery and real-world deployment.'}
                                    </p>
                                    
                                    {course.skills && course.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {course.skills.slice(0, 3).map((skill: string) => (
                                                <span key={skill} className="text-[7px] font-black px-2 py-1 bg-gray-50 text-gray-400 rounded-md uppercase tracking-wider border border-gray-100">{skill}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                        <span className="text-[9px] font-black text-[#7C3AED] uppercase tracking-widest">School of {course.school || 'Engineering'}</span>
                                        <div className="flex items-center gap-1 text-[#7C3AED] font-black text-[10px] uppercase tracking-widest">
                                            Enter Module <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-gray-200">
                        <p className="text-gray-400 font-black uppercase tracking-[0.2em]">Synchronizing database content...</p>
                    </div>
                )}
            </section>

            {/* ── bottom trust bar ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-24">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-[#111827] rounded-[2.5rem] p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-10"
                >
                    <div>
                        <p className="text-[10px] font-black text-[#A78BFA] uppercase tracking-[0.5em] mb-3">Not sure which track?</p>
                        <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-tight">
                            Take our Career Fit <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DFF] via-[#EC4899] to-[#FF5B5B] inline-block">Assessment.</span>
                        </h3>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/learn/career-fit')}
                            className="px-10 py-4 bg-[#7C3AED] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-violet-900/30 hover:bg-[#6D28D9] transition-all flex items-center gap-3"
                        >
                            Start Assessment <ArrowRight className="w-4 h-4" />
                        </motion.button>
                        <button
                            onClick={() => document.getElementById('elite-catalog')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-10 py-4 bg-white/10 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl border border-white/10 hover:bg-white/20 transition-all font-sans"
                        >
                            Browse All Courses
                        </button>
                    </div>
                </motion.div>
            </section>

             {/* Removed duplicate Dynamic courses section as it was moved up */}

        </div>
    );
};

export default CoursesOverview;
