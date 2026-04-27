import React, { useState } from 'react';
import { 
    ArrowLeft, 
    Save, 
    X, 
    Info, 
    Users, 
    Layers, 
    FileText, 
    Gavel, 
    BarChart3,
    Clock,
    MapPin,
    Trophy,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventDetailsProps {
    eventId: string | null;
    onBack: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventId, onBack }) => {
    const [activeTab, setActiveTab] = useState('basic');

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: Info },
        { id: 'participants', label: 'Participants', icon: Users },
        { id: 'teams', label: 'Teams', icon: Layers },
        { id: 'submissions', label: 'Submissions', icon: FileText },
        { id: 'judges', label: 'Judges', icon: Gavel },
        { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-slate-700">Event Title</label>
                                <input 
                                    type="text" 
                                    defaultValue="Global AI Hackathon 2024"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-slate-700">Category</label>
                                <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none transition-all">
                                    <option>Hackathon</option>
                                    <option>Coding Competition</option>
                                    <option>Design Challenge</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <label className="block text-sm font-bold text-slate-700">Description</label>
                                <textarea 
                                    rows={6}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                                    defaultValue="Join the biggest AI hackathon of the year! Build innovative solutions using the latest LLMs and computer vision technologies."
                                />
                            </div>
                        </div>

                        <div className="p-8 bg-purple-50 rounded-[2.5rem] border border-purple-100">
                            <h3 className="text-lg font-bold text-purple-900 mb-6 flex items-center gap-2">
                                <Clock size={20} />
                                Event Timeline
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-purple-600 uppercase tracking-wider">Start Date</label>
                                    <input type="date" className="w-full bg-white px-4 py-3 rounded-xl border border-purple-100 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-purple-600 uppercase tracking-wider">End Date</label>
                                    <input type="date" className="w-full bg-white px-4 py-3 rounded-xl border border-purple-100 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-purple-600 uppercase tracking-wider">Deadline</label>
                                    <input type="date" className="w-full bg-white px-4 py-3 rounded-xl border border-purple-100 outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'participants':
                return (
                    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Join Date</th>
                                    <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                                    JD
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">John Doe</div>
                                                    <div className="text-xs text-slate-500">john@example.com</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">Verified</span>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-600">Apr 15, 2024</td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="text-slate-400 hover:text-slate-900 font-bold text-sm">View Profile</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                        <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                            <activeTab.icon size={32} className="text-slate-300" />
                        </div>
                        <p className="font-medium text-slate-500">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} module is under development.</p>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-[#6C3BFF] hover:border-purple-100 hover:shadow-lg hover:shadow-purple-100/50 transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-['Outfit'] font-bold text-slate-900">Global AI Hackathon 2024</h1>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">Live</span>
                        </div>
                        <p className="text-slate-500 flex items-center gap-4 text-sm font-medium">
                            <span className="flex items-center gap-1"><MapPin size={14} /> Hybrid Event</span>
                            <span className="flex items-center gap-1"><Users size={14} /> 1,240 Participants</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                        <X size={20} /> Cancel
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-[#6C3BFF] shadow-lg shadow-slate-200 transition-all">
                        <Save size={20} /> Save Changes
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-[2rem] overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] font-bold text-sm whitespace-nowrap transition-all ${
                            activeTab === tab.id 
                                ? 'bg-white text-[#6C3BFF] shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white/40 backdrop-blur-sm border border-white/20 p-2 rounded-[3rem]">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 min-h-[500px]">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
