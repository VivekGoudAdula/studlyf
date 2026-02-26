
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Settings,
    Shield,
    CreditCard,
    Bell,
    Globe,
    Lock,
    Database,
    Users,
    CheckCircle2,
    Trash2,
    Cloud,
    ChevronRight,
    Monitor
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('General');

    const tabs = [
        { id: 'General', icon: Settings },
        { id: 'Security', icon: Shield },
        { id: 'System', icon: Database },
        { id: 'Billing', icon: CreditCard },
        { id: 'Roles', icon: Users },
        { id: 'Profile', icon: User },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Ecosystem Configuration</h1>
                        <p className="text-gray-500 text-sm">Fine-tune the Studlyf engine, manage permissions, and control global parameters.</p>
                    </div>
                    <button className="px-6 py-3 bg-purple-600 rounded-2xl text-sm font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all">
                        Save Changes
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Navigation Sidebar */}
                    <div className="w-full lg:w-64 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                        ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.id}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 space-y-8">
                        {activeTab === 'General' && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5 space-y-6">
                                    <h3 className="text-xl font-bold text-white mb-6">Platform Identity</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Platform Name</label>
                                            <input type="text" defaultValue="Studlyf Engine" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Global Support Email</label>
                                            <input type="email" defaultValue="hq@studlyf.com" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Meta Description (SEO)</label>
                                        <textarea rows={3} defaultValue="The elite ecosystem for modern engineering readiness." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition-all resize-none" />
                                    </div>
                                </div>

                                <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                                    <h3 className="text-xl font-bold text-white mb-6">Ecosystem Parameters</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Public Registration', desc: 'Allow new students to sign up without invitations.', status: true },
                                            { label: 'AI Auto-Grading', desc: 'Questions are scored instantly by the neural engine.', status: true },
                                            { label: 'Mentor Review Required', desc: 'Mock interviews must be manually reviewed.', status: false },
                                            { label: 'Enterprise Mode', desc: 'Enable multi-company tenant architecture.', status: true },
                                        ].map((setting, i) => (
                                            <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                                                <div>
                                                    <p className="text-sm font-bold text-white">{setting.label}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{setting.desc}</p>
                                                </div>
                                                <button className={`w-12 h-6 rounded-full relative transition-all ${setting.status ? 'bg-purple-600' : 'bg-white/10'}`}>
                                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${setting.status ? 'right-1' : 'left-1'}`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'Security' && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500"><Shield size={20} /></div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">Access Control & Security</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-xl bg-white/5 text-gray-400"><Lock size={18} /></div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                                                    <p className="text-xs text-gray-500">Enforce 2FA for all Admin & Mentor roles.</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-2 py-1 rounded bg-emerald-400/10 border border-emerald-400/20">Active</span>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Password Policy</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-gray-400">Minimum Length</p>
                                                    <select className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none">
                                                        <option>8 Characters</option>
                                                        <option>12 Characters</option>
                                                        <option>16 Characters</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-gray-400">Rotation Cycle</p>
                                                    <select className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none">
                                                        <option>No Rotation</option>
                                                        <option>30 Days</option>
                                                        <option>90 Days</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-rose-500/10 space-y-6">
                                    <h3 className="text-xl font-bold text-rose-500">Danger Zone</h3>
                                    <p className="text-xs text-gray-500">These actions are irreversible and will affect the entire ecosystem.</p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button className="flex-1 px-6 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-widest hover:bg-rose-500 transition-all hover:text-white">
                                            Purge Assessment Data
                                        </button>
                                        <button className="flex-1 px-6 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-widest hover:bg-rose-500 transition-all hover:text-white">
                                            Reset Master Encryption
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'Roles' && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl font-bold text-white">Role Authority Levels</h3>
                                        <button className="text-[10px] font-bold text-purple-400 uppercase tracking-widest border border-purple-500/20 px-3 py-1 rounded-lg">Add Custom Role</button>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Super Admin', count: 2, authority: 'Full Control', color: 'purple' },
                                            { name: 'Admin', count: 5, authority: 'Ops Manager', color: 'indigo' },
                                            { name: 'Mentor', count: 42, authority: 'Reviewer', color: 'blue' },
                                            { name: 'Hiring Partner', count: 18, authority: 'Candidate View', color: 'emerald' },
                                        ].map((role, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-2 h-2 rounded-full bg-${role.color}-500`} />
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{role.name}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{role.count} Active Users</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{role.authority}</span>
                                                    <button className="p-2 text-gray-600 hover:text-white transition-colors"><ChevronRight size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
