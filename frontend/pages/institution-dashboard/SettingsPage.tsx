import React, { useState } from 'react';
import { 
    User, 
    Bell, 
    Shield, 
    Link2, 
    Globe, 
    Mail, 
    Phone,
    Building2,
    Save,
    Upload,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('profile');

    const sections = [
        { id: 'profile', label: 'Institutional Profile', icon: Building2 },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security & Auth', icon: Shield },
        { id: 'integrations', label: 'API & Integrations', icon: Link2 },
    ];

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-8 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-purple-600 overflow-hidden border-4 border-white shadow-xl">
                                    <img src="/images/studlyf.png" alt="Logo" className="w-20 h-20 object-contain group-hover:scale-110 transition-transform" />
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-3 bg-[#6C3BFF] text-white rounded-2xl shadow-lg shadow-purple-200 hover:scale-110 transition-all">
                                    <Upload size={18} />
                                </button>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Institution Logo</h3>
                                <p className="text-slate-500 text-sm mt-1">Recommended size: 512x512px. JPG or PNG.</p>
                                <div className="flex gap-2 mt-4">
                                    <button className="text-xs font-bold text-[#6C3BFF] px-4 py-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">Change Logo</button>
                                    <button className="text-xs font-bold text-red-500 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors">Remove</button>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Building2 size={16} className="text-slate-400" /> Institution Name
                                </label>
                                <input type="text" defaultValue="Stanford University" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none transition-all" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Globe size={16} className="text-slate-400" /> Website URL
                                </label>
                                <input type="text" defaultValue="https://stanford.edu" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none transition-all" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Mail size={16} className="text-slate-400" /> Contact Email
                                </label>
                                <input type="email" defaultValue="admin@stanford.edu" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none transition-all" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Phone size={16} className="text-slate-400" /> Phone Number
                                </label>
                                <input type="tel" defaultValue="+1 (650) 723-2300" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none transition-all" />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-sm font-bold text-slate-700">Bio / About Institution</label>
                                <textarea rows={4} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none" defaultValue="A leading research university in the heart of Silicon Valley..." />
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-6">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                                <Bell size={20} className="text-[#6C3BFF]" /> Email Notifications
                            </h3>
                            {[
                                { title: 'New Participant Registration', desc: 'Receive an email when a student joins your event' },
                                { title: 'Event Submissions', desc: 'Get notified when a team submits their project' },
                                { title: 'Judge Evaluation Completed', desc: 'Alert when a judge finishes scoring submissions' },
                                { title: 'System Updates', desc: 'Stay informed about new features and maintenance' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-200 last:border-0">
                                    <div>
                                        <p className="font-bold text-slate-800">{item.title}</p>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 cursor-pointer">
                                        <div className="h-4 w-4 translate-x-1 rounded-full bg-white transition shadow-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                        <div className="p-5 bg-slate-50 rounded-3xl mb-4">
                            <ExternalLink size={32} className="text-slate-300" />
                        </div>
                        <p className="font-medium text-slate-500">Advanced settings are coming soon.</p>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
            <div>
                <h1 className="text-4xl font-['Outfit'] font-black text-slate-900 tracking-tight">Settings</h1>
                <p className="text-slate-500 mt-2 text-lg">Manage your institutional identity and preferences</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-80 space-y-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center justify-between group px-6 py-4 rounded-2xl transition-all ${
                                activeSection === section.id 
                                    ? 'bg-white text-[#6C3BFF] shadow-xl shadow-purple-100/50 border-r-4 border-[#6C3BFF]' 
                                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl transition-colors ${
                                    activeSection === section.id ? 'bg-purple-50' : 'bg-slate-50 group-hover:bg-slate-100'
                                }`}>
                                    <section.icon size={20} />
                                </div>
                                <span className="font-bold">{section.label}</span>
                            </div>
                            <ChevronRight size={18} className={`transition-transform ${activeSection === section.id ? 'translate-x-1' : 'opacity-0'}`} />
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="bg-white/40 backdrop-blur-md p-2 rounded-[3.5rem] border border-white/40">
                        <div className="bg-white p-10 lg:p-14 rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden">
                            {/* Decorative background orb */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-50 rounded-full blur-[100px] -z-10" />
                            
                            {renderSectionContent()}

                            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                                <p className="text-sm text-slate-400">Last saved: Today at 2:45 PM</p>
                                <button className="flex items-center gap-2 px-10 py-4 bg-[#6C3BFF] text-white rounded-2xl font-bold hover:bg-[#5A2EE5] hover:scale-105 transition-all shadow-xl shadow-purple-200">
                                    <Save size={20} /> Save Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
