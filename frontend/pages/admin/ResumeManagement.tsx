
import React from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Search,
    Filter,
    Download,
    Eye,
    Star,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Briefcase
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const ResumeManagement: React.FC = () => {
    const resumes = [
        { id: 'RES-4422', student: 'Adithya S.', course: 'Full-Stack Track', score: 92, status: 'ATS Optimized', date: '2d ago' },
        { id: 'RES-4421', student: 'Neha Kapoor', course: 'Advanced UI/UX', score: 88, status: 'Pending Review', date: '4d ago' },
        { id: 'RES-4420', student: 'Rahul Varma', course: 'System Design Pro', score: 64, status: 'Needs Improvement', date: '1w ago' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Resume Intelligence</h1>
                        <p className="text-gray-500 text-sm">Monitor candidate CVs, review AI-generated ATS scores, and provide feedback.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><Star size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Avg. ATS Score</span>
                        </div>
                        <h4 className="text-3xl font-bold text-white mb-1">84%</h4>
                        <p className="text-xs text-gray-500">Across ecosystem CVs</p>
                    </div>
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><Briefcase size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Job Ready CVs</span>
                        </div>
                        <h4 className="text-3xl font-bold text-white mb-1">1,420</h4>
                        <p className="text-xs text-gray-500">Ready for partner sharing</p>
                    </div>
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><AlertCircle size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resumes Flagged</span>
                        </div>
                        <h4 className="text-3xl font-bold text-white mb-1">28</h4>
                        <p className="text-xs text-gray-500">Manual review requested</p>
                    </div>
                </div>

                <div className="bg-[#0F0F12] border border-white/5 rounded-[32px] overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">File Name</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Candidate & Track</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ATS Score</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {resumes.map((res) => (
                                <motion.tr
                                    key={res.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="group hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-purple-400 transition-colors">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">CV_{res.student.replace(' ', '_')}.pdf</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-medium tracking-widest mt-0.5">{res.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-white">{res.student}</p>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{res.course}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${res.score > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{res.score}%</span>
                                            <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full bg-purple-500`} style={{ width: `${res.score}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${res.status === 'ATS Optimized' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                res.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            }`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400">
                                            <button className="p-2 hover:text-white transition-colors" title="Quick View"><Eye size={18} /></button>
                                            <button className="p-2 hover:text-white transition-colors" title="Download"><Download size={18} /></button>
                                            <button className="p-2 hover:text-white transition-colors"><MoreVertical size={18} /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ResumeManagement;
