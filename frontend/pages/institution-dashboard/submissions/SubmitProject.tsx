import React, { useState } from 'react';
import { Send, Upload, Link, Users, Type, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const SubmitProject = () => {
    const [formData, setFormData] = useState({
        team_name: '',
        project_title: '',
        description: '',
        github_link: '',
        demo_link: '',
        status: 'Submitted'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/v1/institution/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert('Project submitted successfully!');
                setFormData({
                    team_name: '',
                    project_title: '',
                    description: '',
                    github_link: '',
                    demo_link: '',
                    status: 'Submitted'
                });
            }
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Manual Submission Entry</h1>
                <p className="text-gray-500">Record a submission manually for a team</p>
            </div>

            <motion.form 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6"
            >
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Users size={16} className="text-purple-500" />
                            Team Name
                        </label>
                        <input 
                            required
                            type="text" 
                            value={formData.team_name}
                            onChange={(e) => setFormData({...formData, team_name: e.target.value})}
                            placeholder="e.g. Team Alpha"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Type size={16} className="text-purple-500" />
                            Project Title
                        </label>
                        <input 
                            required
                            type="text" 
                            value={formData.project_title}
                            onChange={(e) => setFormData({...formData, project_title: e.target.value})}
                            placeholder="e.g. AI Health Assistant"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <FileText size={16} className="text-purple-500" />
                        Project Description
                    </label>
                    <textarea 
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Describe the project goal, tech stack, and key features..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Link size={16} className="text-purple-500" />
                            GitHub Repository
                        </label>
                        <input 
                            type="url" 
                            value={formData.github_link}
                            onChange={(e) => setFormData({...formData, github_link: e.target.value})}
                            placeholder="https://github.com/..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Link size={16} className="text-purple-500" />
                            Demo Video Link
                        </label>
                        <input 
                            type="url" 
                            value={formData.demo_link}
                            onChange={(e) => setFormData({...formData, demo_link: e.target.value})}
                            placeholder="https://youtube.com/..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Upload size={16} className="text-purple-500" />
                        Project Documentation (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:border-purple-300 transition-all cursor-pointer bg-gray-50/50">
                        <Upload className="text-gray-400" size={32} />
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">PDF, DOCX, ZIP (MAX 10MB)</p>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-[#6C3BFF] to-[#9F6BFF] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-purple-100 hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                        <Send size={20} />
                        Submit Project Record
                    </button>
                </div>
            </motion.form>
        </div>
    );
};

export default SubmitProject;
