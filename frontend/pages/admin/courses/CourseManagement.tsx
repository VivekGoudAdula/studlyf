
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

const createLessonByType = (type: string, title = 'New Lesson') => {
    if (type === 'text') {
        return {
            type: 'text',
            title,
            text_blocks: [{ kind: 'paragraph', text: '' }]
        };
    }
    if (type === 'code') {
        return {
            type: 'code',
            title,
            code_intro: '',
            code_snippet: '',
            code_language: 'javascript'
        };
    }
    if (type === 'quiz') {
        return {
            type: 'quiz',
            title,
            quiz_question: '',
            quiz_options: ['', '', '', ''],
            quiz_correct_index: 0,
            quiz_explanation: ''
        };
    }
    return {
        type: 'video',
        title,
        video_source: 'url',
        video_url: '',
        video_file_name: '',
        video_file_data: ''
    };
};

const normalizeLesson = (lesson: any) => {
    const safeType = lesson?.type || 'video';
    const base = createLessonByType(safeType, lesson?.title || 'New Lesson');
    const merged = { ...base, ...(lesson || {}) };

    if (safeType === 'quiz') {
        const options = Array.isArray(merged.quiz_options) ? merged.quiz_options.slice(0, 4) : [];
        while (options.length < 4) options.push('');
        merged.quiz_options = options;
        if (typeof merged.quiz_correct_index !== 'number') merged.quiz_correct_index = 0;
    }

    if (safeType === 'text') {
        if (!Array.isArray(merged.text_blocks) || merged.text_blocks.length === 0) {
            merged.text_blocks = [{ kind: 'paragraph', text: '' }];
        }
    }

    return merged;
};

const normalizeModules = (incoming: any[]) => {
    if (!Array.isArray(incoming) || incoming.length === 0) {
        return [{ id: 1, title: 'Introduction to Course', lessons: [createLessonByType('video', 'Setting up Environment')] }];
    }
    return incoming.map((m: any, idx: number) => ({
        ...m,
        id: m.id || m._id || Date.now() + idx,
        title: m.title || `Module ${idx + 1}`,
        lessons: Array.isArray(m.lessons) ? m.lessons.map(normalizeLesson) : []
    }));
};

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|bmp|svg|avif)(\?.*)?$/i;

const isProbablyImageFile = (file?: File | null): file is File => {
    if (!file) return false;
    if (file.type?.startsWith('image/')) return true;
    return IMAGE_EXT_RE.test(file.name || '');
};

const normalizeDroppedUrl = (value: string): string => {
    return (value || '').trim();
};

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
    const [courseInstructorName, setCourseInstructorName] = useState("Studlyf Mentor");
    const [courseInstructorBio, setCourseInstructorBio] = useState("Industry practitioner helping you become role-ready with practical workflows.");
    const [courseInstructorImage, setCourseInstructorImage] = useState("");
    const [courseImage, setCourseImage] = useState("");
    const [courseSkills, setCourseSkills] = useState("");
    const [courseDuration, setCourseDuration] = useState("10 Weeks");
    const [customId, setCustomId] = useState("");
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

    const [modules, setModules] = useState<any[]>([
        { id: 1, title: 'Introduction to Course', lessons: [createLessonByType('video', 'Setting up Environment')] }
    ]);

    const resetForm = () => {
        setCourseTitle("New Custom Course");
        setCourseDescription("Learn the fundamentals of this new track.");
        setCoursePrice("14999");
        setCourseDifficulty("Intermediate");
        setCourseRoleTag("AI");
        setCourseSchool("Elite Systems");
        setCourseInstructorName("Studlyf Mentor");
        setCourseInstructorBio("Industry practitioner helping you become role-ready with practical workflows.");
        setCourseInstructorImage("");
        setCourseImage("");
        setCourseSkills("");
        setCourseDuration("10 Weeks");
        setCustomId("");
        setModules([{ id: 1, title: 'Introduction to Course', lessons: [createLessonByType('video', 'Setting up Environment')] }]);
        setQuestions([{ question: 'What is the primary role of this technology?', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answers: [0], explanation: '' }]);
        setEditingCourseId(null);
    };

    const handleEditCourse = async (course: any) => {
        setEditingCourseId(course._id);
        setCourseTitle(course.title || "");
        setCourseDescription(course.description || "");
        setCoursePrice(course.price?.toString() || "");
        setCourseDifficulty(course.difficulty || "Intermediate");
        setCourseRoleTag(course.role_tag || "AI");
        setCourseSchool(course.school || "Elite Systems");
        setCourseInstructorName(course.instructor_name || course.instructor || "Studlyf Mentor");
        setCourseInstructorBio(course.instructor_bio || "");
        setCourseInstructorImage(course.instructor_image || "");
        setCourseImage(course.image || "");
        setCourseSkills(Array.isArray(course.skills) ? course.skills.join(", ") : "");
        setCourseDuration(course.duration || "10 Weeks");
        setCustomId(course._id || "");

        let modulesFromCourse = Array.isArray(course.modules) ? course.modules : [];
        if (modulesFromCourse.length === 0 && course._id) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/courses/${course._id}/modules`);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    modulesFromCourse = data;
                }
            } catch (err) {
                console.error('Failed to load modules for edit:', err);
            }
        }

        setModules(normalizeModules(modulesFromCourse));
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
                return { ...m, lessons: [...m.lessons, createLessonByType('video', 'New Lesson')] };
            }
            return m;
        }));
    };

    const handleVideoFileUpload = (moduleId: any, lessonIndex: number, file?: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            updateLesson(moduleId, lessonIndex, {
                video_source: 'file',
                video_file_name: file.name,
                video_file_data: reader.result as string
            });
        };
        reader.readAsDataURL(file);
    };

    const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>, moduleId: any, lessonIndex: number) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleVideoFileUpload(moduleId, lessonIndex, file);
    };

    const addTextBlock = (moduleId: any, lessonIndex: number, kind: 'paragraph' | 'image' | 'link') => {
        const module = modules.find(m => m.id === moduleId || m._id === moduleId);
        if (!module) return;
        const lesson = module.lessons[lessonIndex] || {};
        const blocks = Array.isArray(lesson.text_blocks) ? [...lesson.text_blocks] : [];
        if (kind === 'paragraph') blocks.push({ kind: 'paragraph', text: '' });
        if (kind === 'image') blocks.push({ kind: 'image', image_url: '', image_file_name: '', image_file_data: '' });
        if (kind === 'link') blocks.push({ kind: 'link', label: '', url: '' });
        updateLesson(moduleId, lessonIndex, { text_blocks: blocks });
    };

    const updateTextBlock = (moduleId: any, lessonIndex: number, blockIndex: number, updates: any) => {
        const module = modules.find(m => m.id === moduleId || m._id === moduleId);
        if (!module) return;
        const lesson = module.lessons[lessonIndex] || {};
        const blocks = Array.isArray(lesson.text_blocks) ? [...lesson.text_blocks] : [];
        blocks[blockIndex] = { ...blocks[blockIndex], ...updates };
        updateLesson(moduleId, lessonIndex, { text_blocks: blocks });
    };

    const moveTextBlock = (moduleId: any, lessonIndex: number, blockIndex: number, direction: -1 | 1) => {
        const module = modules.find(m => m.id === moduleId || m._id === moduleId);
        if (!module) return;
        const lesson = module.lessons[lessonIndex] || {};
        const blocks = Array.isArray(lesson.text_blocks) ? [...lesson.text_blocks] : [];
        const newIndex = blockIndex + direction;
        if (newIndex < 0 || newIndex >= blocks.length) return;
        const temp = blocks[blockIndex];
        blocks[blockIndex] = blocks[newIndex];
        blocks[newIndex] = temp;
        updateLesson(moduleId, lessonIndex, { text_blocks: blocks });
    };

    const removeTextBlock = (moduleId: any, lessonIndex: number, blockIndex: number) => {
        const module = modules.find(m => m.id === moduleId || m._id === moduleId);
        if (!module) return;
        const lesson = module.lessons[lessonIndex] || {};
        const blocks = Array.isArray(lesson.text_blocks) ? [...lesson.text_blocks] : [];
        const nextBlocks = blocks.filter((_: any, i: number) => i !== blockIndex);
        updateLesson(moduleId, lessonIndex, { text_blocks: nextBlocks.length ? nextBlocks : [{ kind: 'paragraph', text: '' }] });
    };

    const handleTextImageFileUpload = (moduleId: any, lessonIndex: number, blockIndex: number, file?: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            updateTextBlock(moduleId, lessonIndex, blockIndex, {
                image_file_name: file.name,
                image_file_data: reader.result as string
            });
        };
        reader.readAsDataURL(file);
    };

    const handleTextImageDrop = (
        e: React.DragEvent<HTMLDivElement>,
        moduleId: any,
        lessonIndex: number,
        blockIndex: number
    ) => {
        e.preventDefault();
        e.stopPropagation();

        const itemFiles = Array.from(e.dataTransfer.items || [])
            .filter((item) => item.kind === 'file')
            .map((item) => item.getAsFile())
            .filter((file): file is File => isProbablyImageFile(file));

        const fallbackFiles = Array.from(e.dataTransfer.files || []).filter(isProbablyImageFile);
        const file = itemFiles[0] || fallbackFiles[0];

        if (file) {
            handleTextImageFileUpload(moduleId, lessonIndex, blockIndex, file);
            return;
        }

        const droppedUrl = normalizeDroppedUrl(
            e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain') || ''
        );

        if (droppedUrl) {
            updateTextBlock(moduleId, lessonIndex, blockIndex, { image_url: droppedUrl });
        }
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
        handleCourseImageFile(e.target.files?.[0]);
    };

    const handleCourseImageFile = (file?: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setCourseImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleCourseImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleCourseImageFile(e.dataTransfer.files?.[0]);
    };

    const handleInstructorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleInstructorImageFile(e.target.files?.[0]);
    };

    const handleInstructorImageFile = (file?: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setCourseInstructorImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleInstructorImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleInstructorImageFile(e.dataTransfer.files?.[0]);
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
                instructor_name: courseInstructorName,
                instructor_bio: courseInstructorBio,
                instructor_image: courseInstructorImage,
                image: courseImage || 'https://miro.medium.com/max/938/0*lbtSAeYRtmUMAWeY.png',
                skills: courseSkills.split(",").map(s => s.trim()).filter(s => s !== ""),
                duration: courseDuration,
                modules: modules,
                questions: questions
            };

            // Always use POST to avoid environment-specific PUT/DELETE restrictions
            // Our updated backend /api/admin/courses POST endpoint now handles updates automatically if an ID is provided.
            const url = `${API_BASE_URL}/api/admin/courses`;
            const method = 'POST';

            // Ensure the ID is in the payload for an update or custom ID for new course
            if (editingCourseId) {
                (coursePayload as any)._id = editingCourseId;
            } else if (customId) {
                (coursePayload as any)._id = customId;
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
                window.dispatchEvent(new Event('courses-updated'));
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
                                                    <div key={lessonIndex} className="p-2.5 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-all group/lesson space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <select
                                                                value={les.type}
                                                                onChange={(e) => {
                                                                    const nextType = e.target.value;
                                                                    updateLesson(mod._id || mod.id, lessonIndex, createLessonByType(nextType, les.title || 'New Lesson'));
                                                                }}
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

                                                        {les.type === 'video' && (
                                                            <div className="space-y-2">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                    <select
                                                                        value={les.video_source || 'url'}
                                                                        onChange={(e) => updateLesson(mod._id || mod.id, lessonIndex, { video_source: e.target.value })}
                                                                        className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-blue-500"
                                                                    >
                                                                        <option className="bg-gray-900" value="url">Video by URL</option>
                                                                        <option className="bg-gray-900" value="file">Upload / Drag & Drop</option>
                                                                    </select>
                                                                    {(les.video_source || 'url') === 'url' ? (
                                                                        <input
                                                                            placeholder="https://..."
                                                                            value={les.video_url || ''}
                                                                            onChange={(e) => updateLesson(mod._id || mod.id, lessonIndex, { video_url: e.target.value })}
                                                                            className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-blue-500"
                                                                        />
                                                                    ) : (
                                                                        <input
                                                                            type="file"
                                                                            accept="video/*"
                                                                            onChange={(e) => handleVideoFileUpload(mod._id || mod.id, lessonIndex, e.target.files?.[0])}
                                                                            className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-xs"
                                                                        />
                                                                    )}
                                                                </div>
                                                                {(les.video_source || 'url') === 'file' && (
                                                                    <div
                                                                        onDragOver={(e) => e.preventDefault()}
                                                                        onDrop={(e) => handleVideoDrop(e, mod._id || mod.id, lessonIndex)}
                                                                        className="w-full border border-dashed border-white/20 rounded-lg p-3 text-center text-xs text-white/60"
                                                                    >
                                                                        Drag & drop video file here or choose from file input above
                                                                        {les.video_file_name ? <div className="mt-1 text-green-400 font-semibold">Selected: {les.video_file_name}</div> : null}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {les.type === 'text' && (
                                                            <div className="space-y-2">
                                                                {(les.text_blocks || []).map((block: any, blockIndex: number) => (
                                                                    <div key={blockIndex} className="bg-black/30 border border-white/10 rounded-lg p-3 space-y-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">{block.kind || 'paragraph'} block</span>
                                                                            <div className="flex items-center gap-1">
                                                                                <button type="button" onClick={() => moveTextBlock(mod._id || mod.id, lessonIndex, blockIndex, -1)} className="px-2 py-1 text-xs bg-white/10 rounded text-white/70">↑</button>
                                                                                <button type="button" onClick={() => moveTextBlock(mod._id || mod.id, lessonIndex, blockIndex, 1)} className="px-2 py-1 text-xs bg-white/10 rounded text-white/70">↓</button>
                                                                                <button type="button" onClick={() => removeTextBlock(mod._id || mod.id, lessonIndex, blockIndex)} className="px-2 py-1 text-xs bg-red-500/20 rounded text-red-300">Remove</button>
                                                                            </div>
                                                                        </div>

                                                                        {block.kind === 'paragraph' && (
                                                                            <textarea
                                                                                rows={3}
                                                                                value={block.text || ''}
                                                                                onChange={(e) => updateTextBlock(mod._id || mod.id, lessonIndex, blockIndex, { text: e.target.value })}
                                                                                placeholder="Write paragraph text..."
                                                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-blue-500"
                                                                            />
                                                                        )}

                                                                        {block.kind === 'image' && (
                                                                            <div className="space-y-2">
                                                                                <input
                                                                                    placeholder="Image URL (optional)"
                                                                                    value={block.image_url || ''}
                                                                                    onChange={(e) => updateTextBlock(mod._id || mod.id, lessonIndex, blockIndex, { image_url: e.target.value })}
                                                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-blue-500"
                                                                                />
                                                                                <div
                                                                                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                                                    onDrop={(e) => handleTextImageDrop(e, mod._id || mod.id, lessonIndex, blockIndex)}
                                                                                    className="w-full border border-dashed border-white/20 rounded-lg p-3 text-center text-[11px] text-white/60"
                                                                                >
                                                                                    Drag image file or image link here
                                                                                </div>
                                                                                <input
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    onChange={(e) => handleTextImageFileUpload(mod._id || mod.id, lessonIndex, blockIndex, e.target.files?.[0])}
                                                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs"
                                                                                />
                                                                                {(block.image_file_name || block.image_url) && (
                                                                                    <div className="text-[11px] text-green-400">Image set: {block.image_file_name || 'via URL'}</div>
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                        {block.kind === 'link' && (
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                                <input
                                                                                    placeholder="Resource label"
                                                                                    value={block.label || ''}
                                                                                    onChange={(e) => updateTextBlock(mod._id || mod.id, lessonIndex, blockIndex, { label: e.target.value })}
                                                                                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-blue-500"
                                                                                />
                                                                                <input
                                                                                    placeholder="https://resource-link"
                                                                                    value={block.url || ''}
                                                                                    onChange={(e) => updateTextBlock(mod._id || mod.id, lessonIndex, blockIndex, { url: e.target.value })}
                                                                                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-blue-500"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}

                                                                <div className="flex flex-wrap gap-2">
                                                                    <button type="button" onClick={() => addTextBlock(mod._id || mod.id, lessonIndex, 'paragraph')} className="px-3 py-1.5 text-xs bg-white/10 rounded-lg text-white/80">+ Paragraph</button>
                                                                    <button type="button" onClick={() => addTextBlock(mod._id || mod.id, lessonIndex, 'image')} className="px-3 py-1.5 text-xs bg-white/10 rounded-lg text-white/80">+ Image</button>
                                                                    <button type="button" onClick={() => addTextBlock(mod._id || mod.id, lessonIndex, 'link')} className="px-3 py-1.5 text-xs bg-white/10 rounded-lg text-white/80">+ Resource Link</button>
                                                                </div>

                                                                <div className="mt-3 border border-white/10 rounded-lg bg-black/20 p-3">
                                                                    <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Learner Preview</div>
                                                                    <div className="space-y-3 text-sm text-white/85">
                                                                        {(les.text_blocks || []).map((block: any, previewIndex: number) => (
                                                                            <div key={`preview-${previewIndex}`}>
                                                                                {block.kind === 'paragraph' && block.text ? (
                                                                                    <p className="leading-relaxed whitespace-pre-wrap">{block.text}</p>
                                                                                ) : null}
                                                                                {block.kind === 'image' && (block.image_file_data || block.image_url) ? (
                                                                                    <img
                                                                                        src={block.image_file_data || block.image_url}
                                                                                        alt="Lesson visual"
                                                                                        className="w-full max-h-56 object-cover rounded-lg border border-white/10"
                                                                                    />
                                                                                ) : null}
                                                                                {block.kind === 'link' && block.url ? (
                                                                                    <a
                                                                                        href={block.url}
                                                                                        target="_blank"
                                                                                        rel="noreferrer"
                                                                                        className="text-blue-300 underline break-all"
                                                                                    >
                                                                                        {block.label || block.url}
                                                                                    </a>
                                                                                ) : null}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {les.type === 'code' && (
                                                            <div className="space-y-2">
                                                                <textarea
                                                                    rows={2}
                                                                    value={les.code_intro || ''}
                                                                    onChange={(e) => updateLesson(mod._id || mod.id, lessonIndex, { code_intro: e.target.value })}
                                                                    placeholder="Explain what this code lesson covers..."
                                                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-blue-500"
                                                                />
                                                                <select
                                                                    value={les.code_language || 'javascript'}
                                                                    onChange={(e) => updateLesson(mod._id || mod.id, lessonIndex, { code_language: e.target.value })}
                                                                    className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-blue-500"
                                                                >
                                                                    <option className="bg-gray-900" value="javascript">JavaScript</option>
                                                                    <option className="bg-gray-900" value="typescript">TypeScript</option>
                                                                    <option className="bg-gray-900" value="python">Python</option>
                                                                    <option className="bg-gray-900" value="java">Java</option>
                                                                    <option className="bg-gray-900" value="cpp">C++</option>
                                                                </select>
                                                                <textarea
                                                                    rows={6}
                                                                    value={les.code_snippet || ''}
                                                                    onChange={(e) => updateLesson(mod._id || mod.id, lessonIndex, { code_snippet: e.target.value })}
                                                                    placeholder="Paste your code snippet here..."
                                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                        )}

                                                        {les.type === 'quiz' && (
                                                            <div className="space-y-2">
                                                                <input
                                                                    value={les.quiz_question || ''}
                                                                    onChange={(e) => updateLesson(mod._id || mod.id, lessonIndex, { quiz_question: e.target.value })}
                                                                    placeholder="Quiz question"
                                                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-blue-500"
                                                                />
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                    {(les.quiz_options || ['', '', '', '']).slice(0, 4).map((opt: string, optIdx: number) => (
                                                                        <div key={optIdx} className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg px-2 py-1.5">
                                                                            <input
                                                                                type="radio"
                                                                                checked={(les.quiz_correct_index ?? 0) === optIdx}
                                                                                onChange={() => updateLesson(mod._id || mod.id, lessonIndex, { quiz_correct_index: optIdx })}
                                                                            />
                                                                            <input
                                                                                value={opt}
                                                                                onChange={(e) => {
                                                                                    const nextOptions = [...(les.quiz_options || ['', '', '', ''])];
                                                                                    while (nextOptions.length < 4) nextOptions.push('');
                                                                                    nextOptions[optIdx] = e.target.value;
                                                                                    updateLesson(mod._id || mod.id, lessonIndex, { quiz_options: nextOptions });
                                                                                }}
                                                                                placeholder={`Option ${optIdx + 1}`}
                                                                                className="flex-grow bg-transparent border-none p-0 text-white text-xs focus:ring-0"
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
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
                                            <div
                                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                onDrop={handleCourseImageDrop}
                                                className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-[#7C3AED]/50 transition-colors group relative overflow-hidden h-32 flex flex-col items-center justify-center"
                                            >
                                                {courseImage ? (
                                                    <img src={courseImage} alt="Thumbnail preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                                ) : null}
                                                <div className="relative z-10 flex flex-col items-center pointer-events-none">
                                                    <Upload size={20} className="mx-auto text-white/80 mb-2 group-hover:text-white transition-colors drop-shadow-md" />
                                                    <span className="text-xs text-white drop-shadow-md font-bold block bg-black/50 px-2 py-1 rounded">Drag & drop or Click to browse</span>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                    onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleCourseImageFile(e.dataTransfer.files?.[0]); }}
                                                />
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
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Internal Course ID (e.g. ai-01)</label>
                                            <input
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#7C3AED]"
                                                value={customId}
                                                onChange={(e) => setCustomId(e.target.value)}
                                                disabled={!!editingCourseId}
                                                placeholder="ai-01"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Skills (Comma separated)</label>
                                            <input
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#7C3AED]"
                                                value={courseSkills}
                                                onChange={(e) => setCourseSkills(e.target.value)}
                                                placeholder="LLMs, GPT, Transformers"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Duration</label>
                                            <input
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#7C3AED]"
                                                value={courseDuration}
                                                onChange={(e) => setCourseDuration(e.target.value)}
                                                placeholder="10 Weeks"
                                            />
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
                                        <div className="pt-2 border-t border-white/10">
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Instructor Name</label>
                                            <input
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#7C3AED]"
                                                value={courseInstructorName}
                                                onChange={(e) => setCourseInstructorName(e.target.value)}
                                                placeholder="e.g. Neha Sharma"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Instructor Description</label>
                                            <textarea
                                                rows={3}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:ring-1 focus:ring-[#7C3AED] resize-none"
                                                value={courseInstructorBio}
                                                onChange={(e) => setCourseInstructorBio(e.target.value)}
                                                placeholder="Share the instructor's expertise and background"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-white/40 uppercase mb-1.5 block">Instructor Image</label>
                                            <div
                                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                onDrop={handleInstructorImageDrop}
                                                className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-xl p-3 text-center hover:border-[#7C3AED]/50 transition-colors group relative overflow-hidden h-24 flex flex-col items-center justify-center"
                                            >
                                                {courseInstructorImage ? (
                                                    <img src={courseInstructorImage} alt="Instructor preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                                ) : null}
                                                <div className="relative z-10 flex flex-col items-center pointer-events-none">
                                                    <Upload size={16} className="mx-auto text-white/80 mb-1" />
                                                    <span className="text-[11px] text-white drop-shadow-md font-bold block bg-black/50 px-2 py-0.5 rounded">Upload Instructor Photo</span>
                                                </div>
                                                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept="image/*" onChange={handleInstructorImageUpload} />
                                            </div>
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
