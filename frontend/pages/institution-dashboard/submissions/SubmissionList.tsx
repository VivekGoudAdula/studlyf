
import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, ExternalLink, Github, Play, FileText, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubmissionListProps {
    institutionId?: string;
}

const SubmissionList: React.FC<SubmissionListProps> = ({ institutionId = 'default_inst' }) => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/v1/institution/submissions/${institutionId}`);
                const data = await response.json();
                
                // Ensure data is an array
                if (Array.isArray(data)) {
                    setSubmissions(data);
                } else {
                    console.error('API returned non-array data:', data);
                    setSubmissions([]);
                }
            } catch (error) {
                console.error('Error fetching submissions:', error);
                setSubmissions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, [institutionId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            case 'Under Review': return 'bg-blue-100 text-blue-700';
            case 'Scored': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/v1/institution/submissions/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                setSubmissions(submissions.map(s => s._id === id ? { ...s, status: newStatus } : s));
                if (selectedSubmission?._id === id) {
                    setSelectedSubmission({ ...selectedSubmission, status: newStatus });
                }
            }
        } catch (error) {
            console.error("Failed to update status");
        }
    };

    if (loading) return (
        <div className="space-y-6">
            <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-96 bg-white border border-slate-100 rounded-2xl animate-pulse" />
        </div>
    );

    const filteredSubmissions = filterStatus === 'All' || filterStatus === 'All Status'
        ? submissions 
        : submissions.filter(s => s.status === filterStatus);

    return (
        <div className="space-y-6 font-['Outfit']">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Submissions Management</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Project Evaluation Hub</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6C3BFF] transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search projects..." 
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-[#6C3BFF] transition-all w-64 text-sm"
                        />
                    </div>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-[#6C3BFF] transition-all text-sm font-bold text-slate-600"
                    >
                        <option>All Status</option>
                        <option>Submitted</option>
                        <option>Under Review</option>
                        <option>Scored</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/20">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team & Project</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Engagement</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredSubmissions.length > 0 ? filteredSubmissions.map((sub, idx) => (
                            <motion.tr 
                                key={sub._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="hover:bg-slate-50/30 transition-colors group"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 group-hover:text-[#6C3BFF] transition-colors">{sub.project_title}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sub.team_name}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                                    {new Date(sub.submission_date || sub.submitted_at).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(sub.status)}`}>
                                        {sub.status || 'Submitted'}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className="bg-[#6C3BFF] h-full transition-all duration-1000" 
                                                style={{ width: `${sub.score || 0}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-black text-slate-700">{sub.score || 0}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => setSelectedSubmission(sub)}
                                            className="p-2 text-slate-400 hover:text-[#6C3BFF] hover:bg-purple-50 rounded-lg transition-all"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleStatusChange(sub._id, 'Approved')}
                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                            title="Approve"
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleStatusChange(sub._id, 'Rejected')}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Reject"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 uppercase font-black tracking-[0.2em] text-xs">
                                    No submissions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Submission Details Modal */}
            <AnimatePresence>
                {selectedSubmission && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/20"
                        >
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedSubmission.project_title}</h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Team: {selectedSubmission.team_name}</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedSubmission(null)}
                                    className="p-3 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-slate-900 shadow-sm"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                            
                            <div className="p-10 overflow-y-auto flex-1 space-y-10 no-scrollbar">
                                <section>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Project Description</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">{selectedSubmission.description || "No description provided."}</p>
                                </section>

                                <div className="grid grid-cols-2 gap-8">
                                    <section>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Resources</h3>
                                        <div className="space-y-3">
                                            {selectedSubmission.github_link && (
                                                <a href={selectedSubmission.github_link} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-[#6C3BFF] hover:text-white transition-all group/link shadow-sm">
                                                    <Github size={20} className="text-slate-400 group-hover/link:text-white" />
                                                    <span className="text-sm font-bold">GitHub Repo</span>
                                                    <ExternalLink size={14} className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                </a>
                                            )}
                                            {selectedSubmission.demo_link && (
                                                <a href={selectedSubmission.demo_link} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all group/link shadow-sm">
                                                    <Play size={20} className="text-slate-400 group-hover/link:text-white" />
                                                    <span className="text-sm font-bold">Demo Video</span>
                                                    <ExternalLink size={14} className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                </a>
                                            )}
                                        </div>
                                    </section>
                                    <section>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Attachments</h3>
                                        <div className="p-10 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-300">
                                            <FileText size={32} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">No files attached</span>
                                        </div>
                                    </section>
                                </div>

                                {selectedSubmission.internal_notes && (
                                    <section>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Reviewer Notes</h3>
                                        <div className="bg-purple-50 p-6 rounded-3xl flex gap-4 border border-purple-100/50 shadow-sm shadow-purple-100/20">
                                            <MessageSquare size={20} className="text-[#6C3BFF] shrink-0" />
                                            <p className="text-sm text-purple-900 italic font-medium leading-relaxed">"{selectedSubmission.internal_notes}"</p>
                                        </div>
                                    </section>
                                )}
                            </div>

                            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                                <button 
                                    onClick={() => handleStatusChange(selectedSubmission._id, 'Approved')}
                                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
                                >
                                    Approve Project
                                </button>
                                <button 
                                    onClick={() => handleStatusChange(selectedSubmission._id, 'Rejected')}
                                    className="flex-1 py-4 bg-white text-red-600 border border-red-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all"
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
