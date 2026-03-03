
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
    ArrowUpRight,
    Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { API_BASE_URL } from '../../../apiConfig';
import { useAuth } from '../../../AuthContext';

const CourseManagement: React.FC = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'create' | 'submissions'>('list');
    const [submissions, setSubmissions] = useState<any[]>([]);

    // Assessment Builder State
    const [questions, setQuestions] = useState([
        { question: 'What is the primary role of this technology?', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answers: [0], explanation: '' }
    ]);

    // Course Properties State
    const [courseTitle, setCourseTitle] = useState("New Custom Course");
    const [courseDescription, setCourseDescription] = useState("Learn the fundamentals of this new track.");
    const [coursePrice, setCoursePrice] = useState("14999");
    const [courseDifficulty, setCourseDifficulty] = useState("Intermediate");
    const [courseRoleTag, setCourseRoleTag] = useState("AI");
    const [courseSchool, setCourseSchool] = useState("Elite Systems");
    const [courseImage, setCourseImage] = useState("");
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

    const [modules, setModules] = useState<any[]>([
        { id: 1, title: 'Introduction to Course', lessons: [{ type: 'video', title: 'Setting up Environment' }] }
    ]);

    const resetForm = () => {
        setCourseTitle("New Custom Course");
        setCourseDescription("Learn the fundamentals of this new track.");
        setCoursePrice("14999");
        setCourseDifficulty("Intermediate");
        setCourseRoleTag("AI");
        setCourseSchool("Elite Systems");
        setCourseImage("");
        setModules([{ id: 1, title: 'Introduction to Course', lessons: [{ type: 'video', title: 'Setting up Environment' }] }]);
        setQuestions([{ question: 'What is the primary role of this technology?', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answers: [0], explanation: '' }]);
        setEditingCourseId(null);
    };

    const handleEditCourse = (course: any) => {
        setEditingCourseId(course._id);
        setCourseTitle(course.title || "");
        setCourseDescription(course.description || "");
        setCoursePrice(course.price?.toString() || "");
        setCourseDifficulty(course.difficulty || "Intermediate");
        setCourseRoleTag(course.role_tag || "AI");
        setCourseSchool(course.school || "Elite Systems");
        setCourseImage(course.image || "");
        setModules(course.modules || []);
        setQuestions(course.questions || []);
        setView('create');
    };

    const addModule = () => {
        setModules([...modules, { id: Date.now(), title: 'New Module', lessons: [] }]);
    };

    const deleteModule = (id: any) => {
        setModules(modules.filter(m => (m.id !== id && m._id !== id)));
    };

    const updateModuleTitle = (id: any, title: string) => {
        setModules(modules.map(m => (m.id === id || m._id === id) ? { ...m, title } : m));
    };

    const addLesson = (moduleId: any) => {
        setModules(modules.map(m => {
            if (m.id === moduleId || m._id === moduleId) {
                return { ...m, lessons: [...m.lessons, { type: 'video', title: 'New Lesson' }] };
            }
            return m;
        }));
    };

    const updateLesson = (moduleId: any, lessonIndex: number, updates: any) => {
        setModules(modules.map(m => {
            if (m.id === moduleId || m._id === moduleId) {
                const newLessons = [...m.lessons];
                newLessons[lessonIndex] = { ...newLessons[lessonIndex], ...updates };
                return { ...m, lessons: newLessons };
            }
            return m;
        }));
    };

    const deleteLesson = (moduleId: any, lessonIndex: number) => {
        setModules(modules.map(m => {
            if (m.id === moduleId || m._id === moduleId) {
                const newLessons = m.lessons.filter((_: any, i: number) => i !== lessonIndex);
                return { ...m, lessons: newLessons };
            }
            return m;
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCourseImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQuestionChange = (index: number, field: string, value: any) => {
        const updated = [...questions];
        if (field === 'question') updated[index].question = value;
        if (field === 'explanation') updated[index].explanation = value;
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };

    const handleCorrectOptionChange = (qIndex: number, oIndex: number) => {
        const updated = [...questions];
        updated[qIndex].correct_answers = [oIndex];
        setQuestions(updated);
    };

    const fetchSubmissions = async () => {
        if (!user?.email) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/submissions`, {
                headers: { 'X-Admin-Email': user.email }
            });
            if (res.ok) setSubmissions(await res.json());
        } catch (err) { console.error(err); }
    };

    const reviewSubmission = async (userId: string, moduleId: string, status: string) => {
        if (!user?.email) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/submissions/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Email': user.email
                },
                body: JSON.stringify({ user_id: userId, module_id: moduleId, status })
            });
            if (res.ok) {
                alert(`Project ${status} successfully!`);
                fetchSubmissions();
            }
        } catch (err) { console.error(err); }
    };

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

    const handlePublish = async () => {
        if (!user?.email) {
            alert('Error: No user email found. Please login.');
            return;
        }
        alert('Starting Publish/Update...');
        try {
            const coursePayload = {
                title: courseTitle,
                description: courseDescription,
                price: Number(coursePrice.toString().replace(/,/g, '')),
                difficulty: courseDifficulty,
                role_tag: courseRoleTag,
                school: courseSchool,
                image: courseImage || 'https://miro.medium.com/max/938/0*lbtSAeYRtmUMAWeY.png',
                modules: modules,
                questions: questions
            };

            // Always use POST to avoid environment-specific PUT/DELETE restrictions
            // Our updated backend /api/admin/courses POST endpoint now handles updates automatically if an ID is provided.
            const url = `${API_BASE_URL}/api/admin/courses`;
            const method = 'POST';

            // Ensure the ID is in the payload for an update
            if (editingCourseId) {
                (coursePayload as any)._id = editingCourseId;
            }

            console.log('Publishing course (via POST)...', {
                url,
                payload: coursePayload,
                editingId: editingCourseId
            });

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Email': user.email
                },
                body: JSON.stringify(coursePayload)
            });
            if (res.ok) {
                alert(editingCourseId ? "Course successfully updated!" : "Course & Assessment successfully generated!");
                setView('list');
                resetForm();
                fetchCourses();
            } else {
                const errData = await res.json();
                alert(`Server Error: ${errData.detail || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error("Error publishing course", error);
            alert(`Network or Script Error: ${error.message}`);
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
                    {view !== 'list' && (
                        <button
                            onClick={() => { setView('list'); resetForm(); }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    {view === 'list' && (
                        <button
                            onClick={() => { setView('submissions'); fetchSubmissions(); }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors"
                        >
                            Review Submissions
                        </button>
                    )}
                    <button
                        onClick={() => { resetForm(); setView('create'); }}
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
                                        <button
                                            onClick={() => handleEditCourse(course)}
                                            className="flex-grow flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold hover:text-white transition-all">
                                            <Edit2 size={14} />
                                            Edit Curriculum
                                        </button>
                                        <button
                                            onClick={() => window.open(`/learn/course-player/${course._id}`, '_blank')}
                                            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white transition-all">
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
                            onClick={() => { resetForm(); setView('create'); }}
                            className="bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-white/[0.08] hover:border-[#7C3AED]/30 transition-all group min-h-[300px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus size={32} className="text-[#7C3AED]" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Create New Course</h3>
                            <p className="text-white/40 text-sm mt-2 text-center max-w-xs">Template modules, video uploads, coding snippets and assessments ready.</p>
                        </div>
                    </motion.div>
                ) : view === 'create' ? (
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
                                    {modules.map((mod, i) => (
                                        <div key={mod.id} className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 group">
                                            <div className="flex items-center gap-3 mb-4">
                                                <GripVertical size={20} className="text-white/20 cursor-grab" />
                                                <div className="flex-grow">
                                                    <input
                                                        className="bg-transparent border-none p-0 text-white font-bold focus:ring-0 w-full"
                                                        value={mod.title}
                                                        onChange={(e) => updateModuleTitle(mod._id || mod.id, e.target.value)}
                                                    />
                                                </div>
                                                <button onClick={() => deleteModule(mod._id || mod.id)} className="p-1.5 text-white/30 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                            <div className="ml-8 space-y-2">
                                                {mod.lessons.map((les: any, lessonIndex: number) => (
                                                    <div key={lessonIndex} className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-all group/lesson">
                                                        <select
                                                            value={les.type}
                                                            onChange={(e) => updateLesson(mod._id || mod.id, lessonIndex, { type: e.target.value })}
                                                            className="bg-transparent border-none p-0 text-blue-400 text-xs focus:ring-0 cursor-pointer"
                                                        >
                                                            <option value="video">Video</option>
                                                            <option value="code">Code</option>
                                                            <option value="text">Text</option>
                                                            <option value="quiz">Quiz</option>
                                                        </select>
                                                        <input
                                                            className="text-sm text-white/70 flex-grow bg-transparent border-none p-0 focus:ring-0"
                                                            value={les.title}
                                                            onChange={(e) => updateLesson(mod._id || mod.id, lessonIndex, { title: e.target.value })}
                                                        />
                                                        <button onClick={() => deleteLesson(mod._id || mod.id, lessonIndex)} className="text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover/lesson:opacity-100"><Trash2 size={14} /></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => addLesson(mod._id || mod.id)} className="w-full py-2 border border-dashed border-white/10 rounded-lg text-xs font-semibold text-white/40 hover:text-[#7C3AED] hover:border-[#7C3AED]/30 transition-all flex items-center justify-center gap-2">
                                                    <Plus size={14} /> Add Lesson / Task
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={addModule} className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-sm font-bold text-white/20 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2 mt-4">
                                        <Plus size={18} /> Add New Module
                                    </button>

                                    {/* Final Capstone Section */}
                                    <div className="mt-8 pt-8 border-t border-white/10">
                                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                                            Final Capstone Project
                                        </h4>
                                        <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Problem Statement</label>
                                                    <textarea
                                                        rows={2}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-[#7C3AED] resize-none"
                                                        placeholder="e.g. Build an AI Resume Analyzer..."
                                                        defaultValue="Build an AI Resume Analyzer"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Evaluation Criteria (One per line)</label>
                                                    <textarea
                                                        rows={3}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-[#7C3AED] resize-none"
                                                        placeholder="e.g. Must handle PDF parsing&#10;Must rate skills accurately"
                                                        defaultValue="Must handle PDF parsing&#10;Must return accurate scoring schema&#10;Deploy on Vercel"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Assessment Questions Section */}
                                    <div className="mt-8 pt-8 border-t border-white/10">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                Final Assessment Builder
                                            </h4>
                                            <button
                                                onClick={() => setQuestions([...questions, { question: '', options: ['', '', '', ''], correct_answers: [0], explanation: '' }])}
                                                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs font-bold text-white rounded-lg transition-all flex items-center gap-1">
                                                <Plus size={14} /> Add Question
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {questions.map((q, qIndex) => (
                                                <div key={qIndex} className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-xs text-blue-400 font-bold">Question {qIndex + 1}</span>
                                                        {questions.length > 1 && (
                                                            <button onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))} className="text-red-500 hover:text-red-400"><Trash2 size={14} /></button>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:ring-1 focus:ring-blue-500 mb-4"
                                                        placeholder="Enter question text..."
                                                        value={q.question}
                                                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                                    />

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                                        {q.options.map((opt, oIndex) => (
                                                            <div key={oIndex} className={`flex items-center gap-3 bg-black/40 border rounded-lg px-3 py-2 transition-all ${q.correct_answers.includes(oIndex) ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'border-white/10'}`}>
                                                                <input
                                                                    type="radio"
                                                                    name={`question-${qIndex}`}
                                                                    checked={q.correct_answers.includes(oIndex)}
                                                                    onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                                                                    className="text-blue-500 focus:ring-blue-500 bg-transparent border-white/30"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={opt}
                                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                                    className="flex-grow bg-transparent border-none p-0 text-sm text-white focus:ring-0"
                                                                    placeholder={`Option ${oIndex + 1}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <input
                                                        type="text"
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white/70 text-xs focus:ring-1 focus:ring-blue-500"
                                                        placeholder="Explanation for the correct answer (optional)"
                                                        value={q.explanation}
                                                        onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

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
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Course Title</label>
                                            <input
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#7C3AED]"
                                                value={courseTitle}
                                                onChange={(e) => setCourseTitle(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Short Description</label>
                                            <textarea
                                                rows={2}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:ring-1 focus:ring-[#7C3AED] resize-none"
                                                value={courseDescription}
                                                onChange={(e) => setCourseDescription(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Course Thumbnail</label>
                                            <div className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-[#7C3AED]/50 transition-colors group relative overflow-hidden h-32 flex flex-col items-center justify-center">
                                                {courseImage ? (
                                                    <img src={courseImage} alt="Thumbnail preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                                ) : null}
                                                <div className="relative z-10 flex flex-col items-center pointer-events-none">
                                                    <Upload size={20} className="mx-auto text-white/80 mb-2 group-hover:text-white transition-colors drop-shadow-md" />
                                                    <span className="text-xs text-white drop-shadow-md font-bold block bg-black/50 px-2 py-1 rounded">Drag & drop or Click to browse</span>
                                                </div>
                                                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept="image/*" onChange={handleImageUpload} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Price (INR)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#7C3AED]"
                                                value={coursePrice}
                                                onChange={(e) => setCoursePrice(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Difficulty</label>
                                            <select
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#7C3AED] appearance-none cursor-pointer"
                                                value={courseDifficulty}
                                                onChange={(e) => setCourseDifficulty(e.target.value)}
                                            >
                                                <option className="bg-gray-900 text-white" value="Beginner">Beginner</option>
                                                <option className="bg-gray-900 text-white" value="Intermediate">Intermediate</option>
                                                <option className="bg-gray-900 text-white" value="Advanced">Advanced</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Role Tag</label>
                                            <select
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#7C3AED] appearance-none cursor-pointer"
                                                value={courseRoleTag}
                                                onChange={(e) => setCourseRoleTag(e.target.value)}
                                            >
                                                <option className="bg-gray-900 text-white" value="AI">AI</option>
                                                <option className="bg-gray-900 text-white" value="Software Engineering">Software Engineering</option>
                                                <option className="bg-gray-900 text-white" value="Data">Data</option>
                                                <option className="bg-gray-900 text-white" value="PM">PM</option>
                                                <option className="bg-gray-900 text-white" value="Cyber">Cyber</option>
                                                <option className="bg-gray-900 text-white" value="Frontend">Frontend</option>
                                                <option className="bg-gray-900 text-white" value="Backend">Backend</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">School Name</label>
                                            <input
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#7C3AED]"
                                                value={courseSchool}
                                                onChange={(e) => setCourseSchool(e.target.value)}
                                                placeholder="e.g. School of AI"
                                            />
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

                                <button
                                    onClick={handlePublish}
                                    className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-bold transition-all shadow-xl shadow-purple-500/20 active:scale-95">
                                    {editingCourseId ? 'Update Course' : 'Publish Course'}
                                </button>
                                <button onClick={() => { alert('Course state saved to drafts successfully!'); setView('list'); }} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl text-sm font-bold transition-all">
                                    Save as Draft
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : view === 'submissions' ? (
                    <motion.div
                        key="submissions"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-6">Pending Project Reviews</h3>
                        <div className="space-y-4">
                            {submissions.length === 0 && <p className="text-white/40">No pending projects to review.</p>}
                            {submissions.map((sub, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-bold text-white mb-1">User ID: {sub.user_id}</div>
                                        <div className="text-xs text-white/50 mb-3">Module ID: {sub.module_id} • Status: <span className="text-yellow-500">{sub.review_status || 'pending_review'}</span></div>
                                        <div className="flex gap-4">
                                            {sub.deployed_link && <a href={sub.deployed_link} target="_blank" className="text-xs text-[#7C3AED] hover:underline flex items-center gap-1"><ArrowUpRight size={12} /> Demo</a>}
                                            {sub.github_link && <a href={sub.github_link} target="_blank" className="text-xs text-blue-400 hover:underline flex items-center gap-1"><ArrowUpRight size={12} /> GitHub</a>}
                                            {sub.file_url && <a href={`${API_BASE_URL}${sub.file_url}`} target="_blank" className="text-xs text-green-400 hover:underline flex items-center gap-1"><ArrowUpRight size={12} /> Download File</a>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => reviewSubmission(sub.user_id, sub.module_id, 'approved')} className="px-4 py-1.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg hover:bg-green-500/30">Approve & Certify</button>
                                        <button onClick={() => reviewSubmission(sub.user_id, sub.module_id, 'rejected')} className="px-4 py-1.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/30">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div >
    );
};

export default CourseManagement;
