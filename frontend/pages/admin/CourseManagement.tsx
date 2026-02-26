
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    MoreVertical,
    Users,
    BarChart2,
    Clock,
    Layers,
    Layout,
    Play,
    FileCode,
    CheckSquare,
    DollarSign,
    GripVertical
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const CourseManagement: React.FC = () => {
    const courses = [
        {
            id: 1,
            name: 'Full-Stack Foundation',
            students: 1240,
            completion: 68,
            dropout: 12,
            avgPerformance: 74,
            modules: 12,
            difficulty: 'Intermediate',
            price: '$499'
        },
        {
            id: 2,
            name: 'Advanced UI/UX Design',
            students: 820,
            completion: 45,
            dropout: 18,
            avgPerformance: 82,
            modules: 8,
            difficulty: 'Expert',
            price: '$399'
        },
        {
            id: 3,
            name: 'System Design Pro',
            students: 410,
            completion: 22,
            dropout: 8,
            avgPerformance: 91,
            modules: 15,
            difficulty: 'Expert',
            price: '$699'
        },
        {
            id: 4,
            name: 'Data Structures Essentials',
            students: 2100,
            completion: 82,
            dropout: 5,
            avgPerformance: 65,
            modules: 20,
            difficulty: 'Beginner',
            price: '$299'
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Course Management</h1>
                        <p className="text-gray-500 text-sm">Design, edit, and monitor your educational content.</p>
                    </div>
                    <button className="px-6 py-3 bg-purple-600 rounded-2xl text-sm font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all flex items-center gap-2">
                        <Plus size={18} /> Create New Course
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Active Learners', value: '4,570', icon: Users, color: 'purple' },
                        { label: 'Avg. Completion', value: '54.2%', icon: BarChart2, color: 'emerald' },
                        { label: 'Total Modules', value: '55 Units', icon: Layers, color: 'blue' },
                        { label: 'Learning Hours', value: '124,000', icon: Clock, color: 'amber' },
                    ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-[24px] bg-[#0F0F12] border border-white/5 relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 blur-[40px] -mr-12 -mt-12`} />
                            <stat.icon size={20} className="text-gray-500 mb-4" />
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {courses.map((course) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0F0F12] border border-white/5 rounded-[32px] p-8 group hover:border-purple-500/30 transition-all relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
                                        <Layout size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{course.name}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">{course.difficulty}</span>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{course.modules} Modules</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 border-y border-white/5 py-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Enrolled</p>
                                    <p className="text-lg font-bold text-white">{course.students}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Completion</p>
                                    <p className="text-lg font-bold text-emerald-400">{course.completion}%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Dropout</p>
                                    <p className="text-lg font-bold text-rose-400">{course.dropout}%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Performance</p>
                                    <p className="text-lg font-bold text-purple-400">{course.avgPerformance}%</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign size={14} className="text-purple-500" />
                                    <span className="text-sm font-bold text-white">{course.price}</span>
                                    <span className="text-[10px] text-gray-500 uppercase ml-2 tracking-widest">Pricing Strategy: Premium</span>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button className="flex-1 sm:flex-none px-4 py-2 border border-white/5 bg-white/5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all uppercase tracking-widest">
                                        Analytics
                                    </button>
                                    <button className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl text-xs font-bold text-white shadow-lg shadow-purple-600/20 hover:scale-[1.02] transition-all uppercase tracking-widest">
                                        Edit Content
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Drag-and-drop Curriculum Builder Preview */}
                <div className="bg-[#0F0F12] border border-white/5 rounded-[32px] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Curriculum Architect</h3>
                            <p className="text-gray-500 text-xs mt-1">Drag and drop to reorder modules and lessons.</p>
                        </div>
                        <button className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl text-xs font-bold uppercase tracking-widest">
                            Save Layout
                        </button>
                    </div>

                    <div className="space-y-3 max-w-3xl">
                        {[
                            { title: 'Module 1: Introduction to Web Architecture', units: 4, icon: Play },
                            { title: 'Module 2: Advanced React Patterns (Hooks & Context)', units: 6, icon: Play },
                            { title: 'Module 3: Engineering System Design', units: 3, icon: FileCode },
                            { title: 'Mid-Course Assessment: Real-world Simulation', units: 1, icon: CheckSquare },
                            { title: 'Module 4: Deployment & Optimization', units: 5, icon: Play },
                        ].map((module, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                                <div className="cursor-grab text-gray-600 group-hover:text-purple-400 transition-colors">
                                    <GripVertical size={18} />
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-purple-400 transition-colors">
                                    <module.icon size={18} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white group-hover:text-white transition-colors">{module.title}</h4>
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-0.5">{module.units} Units · Video Content + Assignments</p>
                                </div>
                                <button className="p-2 text-gray-600 hover:text-white transition-colors">
                                    <Edit3 size={16} />
                                </button>
                            </div>
                        ))}
                        <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-gray-500 hover:text-purple-400 hover:border-purple-500/20 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
                            <Plus size={16} /> Add New Module
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

const Edit3 = ({ size, className }: { size: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);

export default CourseManagement;
