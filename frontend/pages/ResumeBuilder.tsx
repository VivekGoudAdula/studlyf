import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Loader2, Plus, Trash2, Code, Layout, User, Briefcase, GraduationCap, Star, Rocket, Award } from 'lucide-react';

const ResumeBuilder: React.FC = () => {
    const [step, setStep] = useState(1); // 1: Template, 2: Details
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);

    const [formData, setFormData] = useState({
        template_id: 'chicago',
        name: '',
        email: '',
        phone: '',
        address: '',
        linkedin: '',
        github: '',
        skills: '',
    });

    const [experience, setExperience] = useState([{ company: '', role: '', year: '', details: '', location: '' }]);
    const [education, setEducation] = useState([{ college: '', degree: '', year: '', location: '' }]);
    const [projects, setProjects] = useState([{ name: '', technologies: '', description: '' }]);
    const [certifications, setCertifications] = useState([{ title: '' }]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleListChange = (setter: any, list: any[], index: number, field: string, value: string) => {
        const newList = [...list];
        newList[index] = { ...newList[index], [field]: value };
        setter(newList);
    };

    const addListEntry = (setter: any, list: any[], defaultVal: any) => setter([...list, defaultVal]);
    const removeListEntry = (setter: any, list: any[], index: number) => setter(list.filter((_, i) => i !== index));

    const generateResume = async () => {
        setIsGenerating(true);
        setResult(null);

        const payload = {
            ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
            certifications: certifications.map(c => c.title).filter(t => t),
            experience,
            education,
            projects
        };

        try {
            const response = await fetch('http://localhost:8000/generate-resume/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
            alert("Failed to connect to backend.");
        } finally {
            setIsGenerating(false);
        }
    };

    const templates = [
        { id: 'chicago', name: 'Chicago Professional', desc: 'Classic, serif-based architectural layout.', image: '/templates/resume/chicago.png' },
        { id: 'easy', name: 'Easy Minimal', desc: 'Clean, modern, and high readability approach.', image: '/templates/resume/easy.png' },
        { id: 'swiss', name: 'Swiss Minimalist', desc: 'Symmetric, modernist design with bold accents.', image: '/templates/resume/swiss.png' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-900 pb-20">
            <div className="max-w-6xl mx-auto px-6 pt-32">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter mb-4 inline-block">Professional Suite</span>
                    <h1 className="text-5xl font-black mb-4 tracking-tighter text-slate-900">
                        Resume <span className="text-purple-600">Architect</span>
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto font-medium">
                        Select a blueprint, provide your history, and let our compiler generate a production-ready PDF.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-10">

                    {/* Main Interface */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* Step Navigation */}
                        <div className="flex gap-4 mb-2">
                            {[1, 2].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStep(s)}
                                    className={`flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${step === s ? 'bg-white border-purple-600 text-purple-600 shadow-xl shadow-purple-100' : 'bg-transparent border-slate-200 text-slate-400 opacity-60'}`}
                                >
                                    {s === 1 ? <Layout size={18} /> : <FileText size={18} />}
                                    Step {s}: {s === 1 ? 'Template' : 'Details'}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid md:grid-cols-3 gap-6">
                                    {templates.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => { setFormData({ ...formData, template_id: t.id }); setStep(2); }}
                                            className={`p-1 rounded-[2.5rem] text-left border-4 transition-all group relative overflow-hidden h-[340px] flex flex-col ${formData.template_id === t.id ? 'bg-white border-purple-600 shadow-2xl shadow-purple-100 scale-[1.02]' : 'bg-white border-slate-100 hover:border-purple-200 shadow-sm'}`}
                                        >
                                            <div className="h-2/3 w-full rounded-[2rem] overflow-hidden bg-slate-100 relative">
                                                <img
                                                    src={t.image}
                                                    alt={t.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=' + t.name.replace(' ', '+');
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            </div>
                                            <div className="p-5 h-1/3 flex flex-col justify-center">
                                                <h3 className="font-black text-lg mb-1 text-slate-900">{t.name}</h3>
                                                <p className="text-[10px] text-slate-500 font-medium leading-tight">{t.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 pb-10">

                                    {/* Personal Info */}
                                    <section className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600"><User size={20} /></div>
                                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Core Identity</h3>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-5 mb-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Identity</label>
                                                <input name="name" placeholder="Johnathan Doe" value={formData.name} onChange={handleInputChange} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-purple-600 outline-none transition-all font-medium" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Digital Mail</label>
                                                <input name="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-purple-600 outline-none transition-all font-medium" />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-5 mb-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Global Address</label>
                                                <input name="address" placeholder="San Francisco, CA" value={formData.address} onChange={handleInputChange} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-purple-600 outline-none transition-all font-medium" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px) font-black text-slate-400 uppercase tracking-widest px-1">Secure Line</label>
                                                <input name="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleInputChange} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-purple-600 outline-none transition-all font-medium" />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-5 mb-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Professional Link (LinkedIn)</label>
                                                <input name="linkedin" placeholder="linkedin.com/in/username" value={formData.linkedin} onChange={handleInputChange} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-purple-600 outline-none transition-all font-medium" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Code Portfolio (GitHub)</label>
                                                <input name="github" placeholder="github.com/username" value={formData.github} onChange={handleInputChange} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-purple-600 outline-none transition-all font-medium" />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Skills */}
                                    <section className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600"><Star size={20} /></div>
                                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Skill Matrix</h3>
                                        </div>
                                        <textarea name="skills" placeholder="List your competencies, separated by commas..." value={formData.skills} onChange={handleInputChange} className="w-full p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:bg-white focus:border-purple-600 outline-none transition-all font-medium h-32" />
                                    </section>

                                    {/* Experience */}
                                    <section className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-center mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><Briefcase size={20} /></div>
                                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Experience</h3>
                                            </div>
                                            <button onClick={() => addListEntry(setExperience, experience, { company: '', role: '', year: '', details: '', location: '' })} className="bg-slate-900 text-white px-5 py-2 rounded-full font-black text-xs flex items-center gap-2 hover:scale-105 transition-all"><Plus size={14} /> EXPAND</button>
                                        </div>
                                        <div className="space-y-6">
                                            {experience.map((exp, i) => (
                                                <div key={i} className="group relative p-8 rounded-3xl bg-slate-50 border-2 border-transparent hover:border-blue-200 transition-all">
                                                    <button onClick={() => removeListEntry(setExperience, experience, i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                        <input placeholder="Organization" value={exp.company} onChange={(e) => handleListChange(setExperience, experience, i, 'company', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none p-2 font-black text-slate-900" />
                                                        <input placeholder="Position / Role" value={exp.role} onChange={(e) => handleListChange(setExperience, experience, i, 'role', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none p-2 font-bold text-slate-600" />
                                                    </div>
                                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                        <input placeholder="Temporal Range" value={exp.year} onChange={(e) => handleListChange(setExperience, experience, i, 'year', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none p-2 text-sm" />
                                                        <input placeholder="Geographic Location" value={exp.location} onChange={(e) => handleListChange(setExperience, experience, i, 'location', e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none p-2 text-sm" />
                                                    </div>
                                                    <textarea placeholder="Bullet points of impact..." value={exp.details} onChange={(e) => handleListChange(setExperience, experience, i, 'details', e.target.value)} className="w-full p-4 bg-white/50 rounded-2xl text-sm h-24 border border-slate-100" />
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Education */}
                                    <section className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-center mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600"><GraduationCap size={20} /></div>
                                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Academic Record</h3>
                                            </div>
                                            <button onClick={() => addListEntry(setEducation, education, { college: '', degree: '', year: '', location: '' })} className="bg-slate-900 text-white px-5 py-2 rounded-full font-black text-xs flex items-center gap-2 hover:scale-105 transition-all"><Plus size={14} /> EXPAND</button>
                                        </div>
                                        <div className="space-y-4">
                                            {education.map((edu, i) => (
                                                <div key={i} className="group relative p-6 rounded-3xl bg-slate-50 border-2 border-transparent hover:border-green-200 transition-all">
                                                    <button onClick={() => removeListEntry(setEducation, education, i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                                                    <input placeholder="Institution Name" value={edu.college} onChange={(e) => handleListChange(setEducation, education, i, 'college', e.target.value)} className="w-full bg-transparent border-b-2 border-slate-200 mb-4 p-2 font-black text-slate-900 outline-none" />
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <input placeholder="Degree Awarded" value={edu.degree} onChange={(e) => handleListChange(setEducation, education, i, 'degree', e.target.value)} className="bg-transparent border-b-2 border-slate-200 p-2 text-sm outline-none" />
                                                        <input placeholder="Graduation Year" value={edu.year} onChange={(e) => handleListChange(setEducation, education, i, 'year', e.target.value)} className="bg-transparent border-b-2 border-slate-200 p-2 text-sm outline-none" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Projects */}
                                    <section className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-center mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><Rocket size={20} /></div>
                                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Strategic Projects</h3>
                                            </div>
                                            <button onClick={() => addListEntry(setProjects, projects, { name: '', technologies: '', description: '' })} className="bg-slate-900 text-white px-5 py-2 rounded-full font-black text-xs flex items-center gap-2 hover:scale-105 transition-all"><Plus size={14} /> EXPAND</button>
                                        </div>
                                        <div className="space-y-4">
                                            {projects.map((proj, i) => (
                                                <div key={i} className="group relative p-6 rounded-3xl bg-slate-50 border-2 border-transparent hover:border-blue-200 transition-all">
                                                    <button onClick={() => removeListEntry(setProjects, projects, i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                                                    <input placeholder="Project Name" value={proj.name} onChange={(e) => handleListChange(setProjects, projects, i, 'name', e.target.value)} className="w-full bg-transparent border-b-2 border-slate-200 mb-4 p-2 font-black text-slate-900 outline-none" />
                                                    <input placeholder="Technologies Used (e.g. React, Python)" value={proj.technologies} onChange={(e) => handleListChange(setProjects, projects, i, 'technologies', e.target.value)} className="w-full bg-transparent border-b-2 border-slate-200 mb-4 p-2 text-sm outline-none" />
                                                    <textarea placeholder="Briefly describe the purpose and outcome..." value={proj.description} onChange={(e) => handleListChange(setProjects, projects, i, 'description', e.target.value)} className="w-full p-4 bg-white/50 rounded-2xl text-sm h-20 border border-slate-100" />
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Certifications */}
                                    <section className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-center mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600"><Award size={20} /></div>
                                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Certifications</h3>
                                            </div>
                                            <button onClick={() => addListEntry(setCertifications, certifications, { title: '' })} className="bg-slate-900 text-white px-5 py-2 rounded-full font-black text-xs flex items-center gap-2 hover:scale-105 transition-all"><Plus size={14} /> EXPAND</button>
                                        </div>
                                        <div className="space-y-4">
                                            {certifications.map((cert, i) => (
                                                <div key={i} className="group relative pt-4 pb-2 border-b-2 border-slate-50 flex items-center gap-4">
                                                    <input
                                                        placeholder="Certification Name (e.g. AWS Certified Cloud Practitioner)"
                                                        value={cert.title}
                                                        onChange={(e) => handleListChange(setCertifications, certifications, i, 'title', e.target.value)}
                                                        className="flex-1 bg-transparent outline-none font-medium text-slate-700"
                                                    />
                                                    <button onClick={() => removeListEntry(setCertifications, certifications, i)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="pt-10">
                                        <button
                                            onClick={generateResume}
                                            disabled={isGenerating}
                                            className="w-full py-6 bg-purple-600 text-white rounded-[2rem] font-black text-xl hover:scale-[1.01] transition-all shadow-2xl shadow-purple-200 disabled:opacity-70 flex items-center justify-center gap-4"
                                        >
                                            {isGenerating ? <Loader2 className="animate-spin" size={32} /> : <Code size={30} />}
                                            {isGenerating ? "BUILDING RESUME..." : "GENERATE RESUME"}
                                        </button>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Output */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <div className="bg-white rounded-[3rem] p-8 text-slate-600 shadow-xl border-2 border-slate-100 flex flex-col min-h-[400px]">

                            <div className="flex items-center gap-2 mb-10 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                                <FileText size={14} className="text-purple-600" /> RESUME STATUS
                            </div>

                            {!result && !isGenerating && (
                                <div className="flex-grow flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
                                        <Layout size={32} />
                                    </div>
                                    <p className="font-black text-slate-900 mb-2">Ready to Build</p>
                                    <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">Fill in your details and click generate to create your PDF.</p>
                                </div>
                            )}

                            {isGenerating && (
                                <div className="flex-grow flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6">
                                        <Loader2 size={32} className="animate-spin" />
                                    </div>
                                    <p className="text-slate-900 font-black mb-2 uppercase tracking-widest">Building Resume</p>
                                    <p className="text-[10px] text-slate-400 font-medium italic">Our AI is synthesisng your profile...</p>
                                </div>
                            )}

                            {result && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-grow flex flex-col">
                                    {(result.status === 'success' || result.pdf_url || result.status === 'partial_success') ? (
                                        <div className="text-center py-6">
                                            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-100">
                                                <Download size={40} />
                                            </div>
                                            <h4 className="text-slate-900 font-black text-2xl mb-2 tracking-tighter">Success!</h4>
                                            <p className="text-sm mb-10 text-slate-500 font-medium">Your professional resume is ready for use.</p>

                                            <a
                                                href={result.pdf_url || result.tex_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full py-5 bg-purple-600 text-white font-black rounded-[2rem] hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 mb-4 group scale-100 hover:scale-[1.02]"
                                            >
                                                DOWNLOAD RESUME
                                            </a>

                                        </div>
                                    ) : (
                                        <div className="py-4">
                                            <h4 className="text-red-500 font-black mb-4 uppercase tracking-tighter flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Compilation Error
                                            </h4>
                                            <pre className="text-[10px] font-mono text-slate-500 bg-slate-50 p-6 rounded-[2rem] h-64 overflow-auto border-2 border-slate-100 leading-relaxed">
                                                {result.log || result.message}
                                            </pre>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
