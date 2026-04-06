import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, Clock, BarChart2, BadgeCheck, Briefcase, Users, ArrowRight, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

/* ─────────────────────────── track data ─────────────────────────── */
// Removed hardcoded tracks to only show database content.
const tracks: any[] = [];

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

    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || 'All';
    const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

    const dynamicCategories = useMemo(() => {
        const predefined = ['All', 'Backend', 'Frontend', 'Software Engineering', 'Data', 'AI', 'Cyber'];
        const cats = new Set(predefined);
        if (courses && courses.length > 0) {
            courses.forEach(c => {
                if (c.role_tag) cats.add(c.role_tag);
            });
        }
        return Array.from(cats);
    }, [courses]);

    const filteredCourses = useMemo(() => {
        if (activeCategory === 'All') return courses;
        return courses.filter(course => course.role_tag === activeCategory);
    }, [activeCategory, courses]);
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

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Elite curriculum. Real hiring partners. Verified skills that matter.
                        <br />Pick your path and start building clinical evidence today.
                    </motion.p>
                </div>
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

            {/* ── Dynamic courses from Admin ── */}
            {filteredCourses.length > 0 && (
                <section id="elite-catalog" className="max-w-7xl mx-auto px-4 sm:px-8 pb-32 pt-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                        <div>
                            <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.5em] mb-4 block">Proprietary Elite Modules</span>
                            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">Available <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DFF] via-[#EC4899] to-[#FF5B5B] inline-block">Elite Knowledge</span>.</h2>
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 pb-2">
                            {dynamicCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap ${activeCategory === cat
                                        ? 'bg-[#111827] text-white border-[#111827] shadow-lg scale-105'
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-[#7C3AED]/30 hover:text-gray-600'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredCourses.map((course) => (
                                <motion.div
                                    key={course._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    whileHover={{ y: -10 }}
                                    onClick={() => navigate(`/learn/courses/${createSlug(course.title, course._id)}`)}
                                    className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full"
                                >
                                    <div className="h-56 relative overflow-hidden shrink-0">
                                        <img
                                            src={course.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop'}
                                            alt={course.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/20">
                                                {course.role_tag || 'Module'}
                                            </span>
                                            {course.difficulty && (
                                                <span className="bg-[#7C3AED]/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                                                    {course.difficulty}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase leading-tight group-hover:text-[#7C3AED] transition-colors">{course.title}</h3>
                                            {course.rating && (
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                                    <span className="text-[10px] font-bold text-gray-600">{course.rating.toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-gray-500 text-xs mb-6 line-clamp-2 leading-relaxed flex-grow">{course.description}</p>
                                        
                                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">School of {course.school || 'Engineering'}</span>
                                                {course.price ? (
                                                    <span className="text-sm font-black text-[#111827]">${course.price}</span>
                                                ) : (
                                                    <span className="text-sm font-black text-[#7C3AED]">FREE</span>
                                                )}
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>
            )}
        </div>
    );
};

export default CoursesOverview;
