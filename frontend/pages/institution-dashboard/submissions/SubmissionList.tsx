import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, ExternalLink, Github, Play, FileText, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubmissionList = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');

    // Mock data for initial UI - replace with API call
    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetch('/api/v1/institution/submissions');
                const data = await response.json();
                setSubmissions(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching submissions:', error);
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            case 'Under Review': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(`/api/v1/institution/submissions/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                setSubmissions(submissions.map(s => s._id === id ? { ...s, status: newStatus } : s));
            }
        } catch (error) {
            console.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Submissions Management</h1>
                    <p className="text-gray-500">Track and evaluate project submissions from all teams</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search projects..." 
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all w-64"
                        />
                    </div>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    >
                        <option>All Status</option>
                        <option>Submitted</option>
                        <option>Under Review</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-bottom border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Team & Project</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {submissions.map((sub) => (
                            <motion.tr 
                                key={sub._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900">{sub.project_title}</span>
                                        <span className="text-sm text-gray-500">{sub.team_name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(sub.submission_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className="bg-purple-500 h-full" 
                                                style={{ width: `${sub.score}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">{sub.score}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setSelectedSubmission(sub)}
                                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleStatusChange(sub._id, 'Approved')}
                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                            title="Approve"
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleStatusChange(sub._id, 'Rejected')}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Reject"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Submission Details Modal */}
            <AnimatePresence>
                {selectedSubmission && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedSubmission.project_title}</h2>
                                    <p className="text-gray-500">by {selectedSubmission.team_name}</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedSubmission(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-all"
                                >
                                    <XCircle size={24} className="text-gray-400" />
                                </button>
                            </div>
                            
                            <div className="p-8 overflow-y-auto flex-1 space-y-8">
                                <section>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Description</h3>
                                    <p className="text-gray-700 leading-relaxed">{selectedSubmission.description}</p>
                                </section>

                                <div className="grid grid-cols-2 gap-6">
                                    <section>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Resources</h3>
                                        <div className="space-y-2">
                                            <a href={selectedSubmission.github_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all text-gray-700">
                                                <Github size={18} />
                                                <span className="text-sm font-medium">GitHub Repository</span>
                                                <ExternalLink size={14} className="ml-auto opacity-50" />
                                            </a>
                                            <a href={selectedSubmission.demo_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all text-gray-700">
                                                <Play size={18} />
                                                <span className="text-sm font-medium">Demo Video</span>
                                                <ExternalLink size={14} className="ml-auto opacity-50" />
                                            </a>
                                        </div>
                                    </section>
                                    <section>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Attachments</h3>
                                        <div className="p-3 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-400">
                                            <FileText size={18} />
                                            <span className="text-xs">No files attached</span>
                                        </div>
                                    </section>
                                </div>

                                <section>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Judge Comments</h3>
                                    <div className="bg-purple-50 p-4 rounded-2xl flex gap-3">
                                        <MessageSquare size={18} className="text-purple-500 shrink-0" />
                                        <p className="text-sm text-purple-900 italic">"The core concept is brilliant. Could use more optimization in the frontend rendering."</p>
                                    </div>
                                </section>
                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                                <button 
                                    onClick={() => handleStatusChange(selectedSubmission._id, 'Approved')}
                                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                                >
                                    Approve Project
                                </button>
                                <button 
                                    onClick={() => handleStatusChange(selectedSubmission._id, 'Rejected')}
                                    className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
                                >
                                    Reject
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubmissionList;
