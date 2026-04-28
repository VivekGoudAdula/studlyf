import React, { useState, useEffect } from 'react';
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
    ChevronRight,
    Award,
    HelpCircle,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LeaderboardPage from './LeaderboardPage';
import { useNavigate } from 'react-router-dom';

interface EventDetailsProps {
    eventId: string | null;
    onBack: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventId, onBack }) => {
    const [activeTab, setActiveTab] = useState('basic');
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!eventId) return;
            try {
                const res = await fetch(`/api/v1/institution/events/${eventId}/details`);
                const data = await res.json();
                setEvent(data);
            } catch (err) {
                console.error("Failed to load event details");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div></div>;
    if (!event) return <div>Event not found</div>;

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: Info },
        { id: 'stages', label: 'Stages & Timeline', icon: Clock },
        { id: 'participants', label: 'Participants', icon: Users },
        { id: 'teams', label: 'Teams', icon: Layers },
        { id: 'submissions', label: 'Submissions', icon: FileText },
        { id: 'judges', label: 'Judges', icon: Gavel },
        { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
        { id: 'assessments', label: 'Assessments', icon: HelpCircle },
        { id: 'prizes', label: 'Prizes & Rewards', icon: Trophy },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'stages':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {(event.stages || [
                            { name: 'Registration Deadline', date: event.registration_deadline, type: 'Deadline' },
                            { name: 'Hackathon Start', date: event.start_date, type: 'Event' },
                            { name: 'Submission Deadline', date: event.submission_deadline, type: 'Submission' }
                        ]).map((stage, i) => (
                            <div key={i} className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                                    <span className="text-[10px] font-black text-purple-600 uppercase">Step</span>
                                    <span className="text-lg font-black text-slate-900">{i+1}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900">{stage.name}</h4>
                                    <p className="text-sm text-slate-500">{new Date(stage.date).toLocaleString()}</p>
                                </div>
                                <div className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold uppercase tracking-widest">
                                    {stage.type}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'prizes':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {[
                            { rank: '1st Prize', val: event.prize_pool ? `₹${event.prize_pool * 0.6}` : 'Winner Trophy', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                            { rank: '2nd Prize', val: event.prize_pool ? `₹${event.prize_pool * 0.3}` : 'Runner Up', icon: Award, color: 'text-slate-500', bg: 'bg-slate-50' },
                            { rank: 'Participation', val: 'Digital Certificates', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' }
                        ].map((p, i) => (
                            <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2rem] text-center shadow-sm hover:shadow-xl transition-all">
                                <div className={`w-16 h-16 ${p.bg} ${p.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm`}>
                                    <p.icon size={32} />
                                </div>
                                <h4 className="font-bold text-slate-900">{p.rank}</h4>
                                <p className="text-2xl font-black text-purple-600 mt-2">{p.val}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'assessments':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Event Assessments</h3>
                                <p className="text-sm text-slate-500">Create and manage quiz rounds for this event</p>
                            </div>
                            <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all flex items-center gap-2">
                                <Plus size={18} />
                                Create New Quiz
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center text-slate-400">
                                <HelpCircle size={48} className="mb-4 opacity-20" />
                                <p className="font-medium">No assessments created yet</p>
                                <p className="text-xs mt-1">Quizzes are mandatory for 'Assessment' stages</p>
                            </div>
                        </div>
                    </div>
                );
            case 'basic':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-slate-700">Event Title</label>
                                <input 
                                     type="text" 
                                     defaultValue={event.title}
                                     className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                 />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-slate-700">Category</label>
                                <select 
                                    defaultValue={event.category || 'Hackathon'}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                >
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
                                     defaultValue={event.description}
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
            case 'leaderboard':
                return <LeaderboardPage />;
            default:
                const Icon = tabs.find(t => t.id === activeTab)?.icon || Info;
                return (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                        <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                            <Icon size={32} className="text-slate-300" />
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
                             <h1 className="text-3xl font-['Outfit'] font-bold text-slate-900">{event.title}</h1>
                             <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">{event.status || 'Live'}</span>
                         </div>
                         <p className="text-slate-500 flex items-center gap-4 text-sm font-medium">
                             <span className="flex items-center gap-1"><MapPin size={14} /> Hybrid Event</span>
                             <span className="flex items-center gap-1"><Users size={14} /> {event.participant_count || 0} Participants</span>
                         </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-bold hover:scale-[1.02] shadow-lg shadow-orange-100 transition-all"
                        onClick={() => {
                            if(window.confirm("Are you sure you want to finalize this event? This will issue certificates to all participants.")) {
                                fetch(`/api/v1/institution/finalize-event/${eventId}`, { method: 'POST' });
                                alert("Certificates are being generated in the background.");
                            }
                        }}
                    >
                        <Trophy size={20} /> Finalize & Issue Certs
                    </button>
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
