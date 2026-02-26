
import React, { useState, useEffect } from 'react';
import {
    Plus,
    Play,
    FileText,
    Code,
    Video,
    GripVertical,
    Trash2,
    Edit2,
    Eye,
    Star,
    ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { API_BASE_URL } from '../../../apiConfig';
import { useAuth } from '../../../AuthContext';

const CourseManagement: React.FC = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'create'>('list');

    const fetchCourses = async () => {
        if (!user?.email) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/courses`, {
                headers: { 'X-Admin-Email': user.email }
            });
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [user]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this course?') || !user?.email) return;
        try {
            await fetch(`${API_BASE_URL}/api/admin/courses/${id}`, {
                method: 'DELETE',
                headers: { 'X-Admin-Email': user.email }
            });
            setCourses(courses.filter(c => c._id !== id));
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {view === 'list' ? 'Course Management' : 'Curriculum Builder'}
                    </h1>
                    <p className="text-white/50 mt-1">Design, monitor and optimize StudLyf learning paths.</p>
                </div>
                <div className="flex items-center gap-3">
                    {view === 'create' && (
                        <button
                            onClick={() => setView('list')}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={() => setView('create')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-500/20"
                    >
                        <Plus size={18} />
                        Create New Course
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {courses.map(course => (
                            <div key={course._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-[#7C3AED]/50 transition-all flex flex-col md:flex-row h-full">
                                <div className="md:w-56 h-48 md:h-full relative overflow-hidden flex-shrink-0">
                                    <img src={course.image || 'https://miro.medium.com/max/938/0*lbtSAeYRtmUMAWeY.png'} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                                        {course.difficulty}
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold text-white leading-tight">{course.title}</h3>
                                            <div className="text-lg font-bold text-[#7C3AED]">{course.price || 'Free'}</div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                                            <span className="flex items-center gap-1.5"><Play size={14} className="text-[#7C3AED]" /> {course.modules_count || 0} Modules</span>
                                            <span className="flex items-center gap-1.5"><FileText size={14} className="text-[#7C3AED]" /> {course.lessons?.length || 0} Lessons</span>
                                            <span className="flex items-center gap-1.5"><Plus size={14} className="text-[#7C3AED]" /> {course.students_count || 0} Enrolled</span>
                                        </div>
                                        <p className="text-xs text-white/40 mt-3 line-clamp-2">{course.description}</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                                        <div className="text-center">
                                            <div className="text-xs text-white/40 mb-1">Completion</div>
                                            <div className="text-lg font-bold text-green-500">{course.completion || 0}%</div>
                                        </div>
                                        <div className="text-center border-x border-white/5">
                                            <div className="text-xs text-white/40 mb-1">Dropout</div>
                                            <div className="text-lg font-bold text-red-500">{course.dropout || 0}%</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-white/40 mb-1">Avg Score</div>
                                            <div className="text-lg font-bold text-blue-500">{course.avgPerf || 0}%</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-6">
                                        <button className="flex-grow flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold hover:text-white transition-all">
                                            <Edit2 size={14} />
                                            Edit Curriculum
                                        </button>
                                        <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white transition-all">
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course._id)}
                                            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-red-500 transition-all font-bold"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div
                            onClick={() => setView('create')}
                            className="bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-white/[0.08] hover:border-[#7C3AED]/30 transition-all group min-h-[300px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus size={32} className="text-[#7C3AED]" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Create New Course</h3>
                            <p className="text-white/40 text-sm mt-2 text-center max-w-xs">Template modules, video uploads, coding snippets and assessments ready.</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                        {/* Course Config */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                <h3 className="text-lg font-semibold text-white">Curriculum Designer</h3>
                                <div className="space-y-4 mt-6">
                                    {[1, 2, 3].map((mod, i) => (
                                        <div key={mod} className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 group">
                                            <div className="flex items-center gap-3 mb-4">
                                                <GripVertical size={20} className="text-white/20 cursor-grab" />
                                                <div className="flex-grow">
                                                    <input
                                                        className="bg-transparent border-none p-0 text-white font-bold focus:ring-0 w-full"
                                                        defaultValue={`Module ${mod}: ${i === 0 ? 'Introduction to React' : i === 1 ? 'State Management' : 'Advanced Hooks'}`}
                                                    />
                                                </div>
                                                <button className="p-1.5 text-white/30 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                            <div className="ml-8 space-y-2">
                                                {[1, 2].map(les => (
                                                    <div key={les} className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                                                        {les === 1 ? <Video size={16} className="text-blue-400" /> : <Code size={16} className="text-purple-400" />}
                                                        <span className="text-sm text-white/70 flex-grow">{les === 1 ? 'Setting up Environment' : 'Exercise: First Component'}</span>
                                                        <button className="text-white/20 hover:text-white transition-colors"><Edit2 size={14} /></button>
                                                    </div>
                                                ))}
                                                <button className="w-full py-2 border border-dashed border-white/10 rounded-lg text-xs font-semibold text-white/40 hover:text-[#7C3AED] hover:border-[#7C3AED]/30 transition-all flex items-center justify-center gap-2">
                                                    <Plus size={14} /> Add Lesson / Task
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-sm font-bold text-white/20 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2 mt-4">
                                        <Plus size={18} /> Add New Module
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Settings Panel */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 sticky top-24">
                                <div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Course Properties</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Price (INR)</label>
                                            <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#7C3AED]" defaultValue="14,999" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Difficulty</label>
                                            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#7C3AED]">
                                                <option>Beginner</option>
                                                <option selected>Intermediate</option>
                                                <option>Advanced</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-white/60">Auto-grading AI</span>
                                        <div className="w-10 h-5 bg-[#7C3AED] rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" /></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-white/60">Certificate Enabled</span>
                                        <div className="w-10 h-5 bg-[#7C3AED] rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" /></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-white/60">Loom Video Integration</span>
                                        <div className="w-10 h-5 bg-white/10 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white/30 rounded-full shadow-sm" /></div>
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-bold transition-all shadow-xl shadow-purple-500/20 active:scale-95">
                                    Publish Course
                                </button>
                                <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl text-sm font-bold transition-all">
                                    Save as Draft
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseManagement;
