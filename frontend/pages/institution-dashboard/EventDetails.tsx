import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../apiConfig';
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
    Plus,
    ShieldCheck,
    Trash2,
    Settings2,
    Filter,
    Send,
    CheckCircle2,
    AlertCircle,
    Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LeaderboardPage from './LeaderboardPage';
import { useNavigate } from 'react-router-dom';
import StageBuilder from './components/StageBuilder';

interface EventDetailsProps {
    eventId: string | null;
    onBack: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventId, onBack }) => {
    const [activeTab, setActiveTab] = useState('basic');
    const [event, setEvent] = useState<any>(null);
    const [institution, setInstitution] = useState<any>(null);
    const [participants, setParticipants] = useState<any[]>([]);
    const [stages, setStages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [criteria, setCriteria] = useState<any[]>([]);
    const [bundleData, setBundleData] = useState<any>(null);
    const [threshold, setThreshold] = useState(90);
    const [bundleTab, setBundleTab] = useState('approved');

    useEffect(() => {
        const fetchData = async () => {
            if (!eventId) return;
            try {
                // Fetch Event
                const eventRes = await fetch(`${API_BASE_URL}/api/v1/institution/events/${eventId}/details`);
                const eventData = await eventRes.json();
                setEvent(eventData);
                setStages(eventData.stages || []);

                // Fetch Institution for Team Members
                if (eventData.institution_id) {
                    const instRes = await fetch(`${API_BASE_URL}/api/v1/institution/profile/${eventData.institution_id}`);
                    const instData = await instRes.json();
                    setInstitution(instData);

                    const partRes = await fetch(`${API_BASE_URL}/api/v1/institution/events/${eventId}/participants`);
                    const partData = await partRes.json();
                    setParticipants(partData);
                }
                
                setCriteria(eventData.judging_criteria || [
                    { id: '1', name: 'Innovation', max_points: 25 },
                    { id: '2', name: 'UI/UX Design', max_points: 25 },
                    { id: '3', name: 'Technical Depth', max_points: 25 },
                    { id: '4', name: 'Completeness', max_points: 25 },
                ]);
            } catch (err) {
                console.error("Failed to load event data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [eventId]);

    const fetchBundle = async (val: number) => {
        try {
            const res = await fetch(`/api/v1/institution/events/${eventId}/qualified-bundle?threshold=${val}`);
            const data = await res.json();
            setBundleData(data);
        } catch (err) {
            console.error("Failed to fetch bundle");
        }
    };

    useEffect(() => {
        if(activeTab === 'participants' || activeTab === 'submissions') {
            fetchBundle(threshold);
        }
    }, [eventId, activeTab, threshold]);

    if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div></div>;
    if (!event) return <div>Event not found</div>;

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: Info },
        { id: 'stages', label: 'Stages & Timeline', icon: Clock },
        { id: 'participants', label: 'Participants', icon: Users },
        { id: 'teams', label: 'Teams', icon: Layers },
        { id: 'submissions', label: 'Submissions', icon: FileText },
        { id: 'judges', label: 'Judges', icon: Gavel },
        { id: 'criteria', label: 'Scoring Rubrics', icon: ShieldCheck },
        { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
        { id: 'assessments', label: 'Assessments', icon: HelpCircle },
        { id: 'prizes', label: 'Prizes & Rewards', icon: Trophy },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'stages':
                return (
                    <StageBuilder stages={stages} onUpdate={setStages} />
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
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* THE COMMAND CENTER HEADER */}
                        <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="px-3 py-1 bg-[#6C3BFF] text-white text-[10px] font-black uppercase tracking-widest rounded-full">Automated Filtering</div>
                                    <h3 className="text-3xl font-black tracking-tight">Selection Command Center</h3>
                                </div>
                                <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
                                    Use the threshold slider to dynamically bundle teams based on their aggregate scores from all judges.
                                </p>
                            </div>

                            <div className="mt-10 p-8 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="flex-1 w-full space-y-4">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-sm font-black uppercase tracking-widest text-slate-400">Qualification Threshold</label>
                                        <span className="text-2xl font-black text-[#6C3BFF] bg-white px-4 py-1 rounded-xl">{threshold}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={threshold}
                                        onChange={(e) => setThreshold(parseInt(e.target.value))}
                                        className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#6C3BFF]"
                                    />
                                </div>
                                
                                <div className="flex gap-4">
                                    <button 
                                        onClick={async () => {
                                            const confirmSend = confirm(`Are you sure you want to send selection emails to all ${bundleData?.summary?.approved} approved teams?`);
                                            if(confirmSend && bundleData?.approved) {
                                                const res = await fetch(`/api/v1/institution/events/${eventId}/bulk-notify`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ 
                                                        team_ids: bundleData.approved.map((t: any) => t.team_id),
                                                        next_stage: "Final Round"
                                                    })
                                                });
                                                if(res.ok) alert("Bulk notifications sent successfully!");
                                            }
                                        }}
                                        disabled={!bundleData?.approved?.length}
                                        className="px-8 py-4 bg-[#6C3BFF] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl shadow-purple-500/20 flex items-center gap-3 disabled:opacity-50 disabled:grayscale"
                                    >
                                        <Send size={18} />
                                        Notify Approved Bundle
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* TABS FOR FILTERED LISTS */}
                        <div className="flex gap-4 p-2 bg-slate-100 rounded-3xl w-fit">
                            {[
                                { id: 'approved', label: 'Approved', count: bundleData?.summary?.approved, color: 'text-emerald-600', icon: CheckCircle2 },
                                { id: 'pending', label: 'Pending', count: bundleData?.summary?.pending, color: 'text-amber-600', icon: Timer },
                                { id: 'rejected', label: 'Rejected', count: bundleData?.summary?.rejected, color: 'text-rose-600', icon: AlertCircle },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setBundleTab(tab.id)}
                                    className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${bundleTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <tab.icon size={16} className={bundleTab === tab.id ? tab.color : 'text-slate-300'} />
                                    {tab.label}
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] ${bundleTab === tab.id ? 'bg-slate-100 text-slate-900' : 'bg-slate-200/50 text-slate-400'}`}>
                                        {tab.count || 0}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* FILTERED LIST TABLE */}
                        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Name</th>
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Score</th>
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Judging Progress</th>
                                        <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(bundleData?.[bundleTab] || []).length > 0 ? bundleData[bundleTab].map((team: any) => (
                                        <tr key={team.team_id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-10 py-7 font-black text-slate-900">{team.team_name}</td>
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#6C3BFF]" style={{ width: `${team.score}%` }}></div>
                                                    </div>
                                                    <span className="font-black text-slate-600 text-sm">{team.score}%</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${team.is_fully_evaluated ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {team.judges_completed} Judges Scored
                                                </span>
                                            </td>
                                            <td className="px-10 py-7 text-right">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                                    bundleTab === 'approved' ? 'bg-emerald-500 text-white' : 
                                                    bundleTab === 'rejected' ? 'bg-rose-500 text-white' : 
                                                    'bg-amber-500 text-white'
                                                }`}>
                                                    {bundleTab}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-10 py-24 text-center">
                                                <Filter size={48} className="mx-auto text-slate-100 mb-4" />
                                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">No teams found in this category.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'judges':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Hero Section */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden gap-8">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="px-3 py-1 bg-[#6C3BFF] text-white text-[10px] font-black uppercase tracking-widest rounded-full">Pro Feature</div>
                                    <h3 className="text-2xl font-black tracking-tight">Judging Panel</h3>
                                </div>
                                <p className="text-slate-400 max-w-md">Assign professional evaluators from your faculty or invite external experts to review submissions.</p>
                            </div>
                            <Gavel size={160} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
                            
                            <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => {
                                        const name = prompt("Enter Judge Name:");
                                        const email = prompt("Enter Judge Email:");
                                        const expertise = prompt("Enter Expertise (e.g. AI, Fullstack):");
                                        if(name && email) {
                                            fetch(`/api/v1/institution/events/${eventId}/judges`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ name, email, expertise })
                                            }).then(() => window.location.reload());
                                        }
                                    }}
                                    className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#6C3BFF] hover:text-white transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} /> Invite External Judge
                                </button>
                            </div>
                        </div>

                        {/* Quick Assign Section */}
                        {institution?.team && institution.team.length > 0 && (
                            <div className="p-8 bg-purple-50/50 rounded-[2.5rem] border border-purple-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white rounded-lg text-[#6C3BFF] shadow-sm">
                                        <Users size={20} />
                                    </div>
                                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Quick Assign from Faculty</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {institution.team.map((member: any, i: number) => {
                                        const isAlreadyJudge = event.judges?.some((j: any) => j.email === member.email);
                                        return (
                                            <button 
                                                key={i}
                                                disabled={isAlreadyJudge}
                                                onClick={() => {
                                                    fetch(`/api/v1/institution/events/${eventId}/judges`, {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ name: member.name, email: member.email, expertise: member.role })
                                                    }).then(() => window.location.reload());
                                                }}
                                                className={`p-4 bg-white border rounded-2xl flex flex-col items-center text-center transition-all group ${
                                                    isAlreadyJudge 
                                                        ? 'opacity-50 grayscale cursor-not-allowed border-slate-100' 
                                                        : 'border-slate-100 hover:border-[#6C3BFF] hover:shadow-lg hover:shadow-purple-100'
                                                }`}
                                            >
                                                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center font-bold mb-2 group-hover:bg-purple-100 group-hover:text-[#6C3BFF]">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className="font-bold text-xs text-slate-900 truncate w-full">{member.name}</div>
                                                <div className="text-[10px] text-slate-400 font-medium truncate w-full">{member.role}</div>
                                                {!isAlreadyJudge && (
                                                    <div className="mt-3 text-[9px] font-black uppercase text-[#6C3BFF] opacity-0 group-hover:opacity-100 transition-all">Assign Now</div>
                                                )}
                                                {isAlreadyJudge && (
                                                    <div className="mt-3 text-[9px] font-black uppercase text-emerald-500">Already Added</div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* List of Judges */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {event.judges && event.judges.length > 0 ? event.judges.map((judge: any, idx: number) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-purple-100 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-16 h-16 bg-slate-50 text-[#6C3BFF] rounded-2xl flex items-center justify-center font-black text-xl border border-slate-100 group-hover:bg-[#6C3BFF] group-hover:text-white transition-all">
                                            {judge.name.charAt(0)}
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            judge.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {judge.status}
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-1">{judge.name}</h4>
                                    <p className="text-sm text-slate-500 font-medium mb-4">{judge.email}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {(judge.expertise || 'Expert').split(',').map((tag: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-100 uppercase tracking-wider">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 pt-6 border-t border-slate-50">
                                        <button 
                                            onClick={() => {
                                                if(confirm("Remove this judge from the event?")) {
                                                    fetch(`/api/v1/institution/events/${eventId}/judges/${judge.email}`, { method: 'DELETE' })
                                                        .then(() => window.location.reload());
                                                }
                                            }}
                                            className="w-full py-3 text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition-all"
                                        >
                                            Remove Judge
                                        </button>
                                        <div className="h-4 w-px bg-slate-100"></div>
                                        <button className="w-full py-3 text-slate-400 hover:text-[#6C3BFF] font-black text-[10px] uppercase tracking-widest transition-all">
                                            Resend Invite
                                        </button>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
                                    <Gavel className="mx-auto text-slate-200 mb-6" size={64} />
                                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No judges assigned to this event yet</p>
                                    <button 
                                        onClick={() => {/* trigger prompt */}}
                                        className="mt-6 px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-[#6C3BFF] hover:text-[#6C3BFF] transition-all shadow-sm"
                                    >
                                        Click 'Invite Judge' to start
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'criteria':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem] relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Scoring Rubrics</h3>
                                <p className="text-slate-500 mt-1 max-w-md">Define the parameters and weightage for judging submissions.</p>
                            </div>
                            <ShieldCheck size={140} className="absolute -right-6 -bottom-6 text-[#6C3BFF]/5 -rotate-12" />
                        </div>

                        <div className="space-y-4">
                            {(event.judging_criteria || []).map((criterion: any, idx: number) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center gap-6"
                                >
                                    <div className="w-12 h-12 bg-purple-50 text-[#6C3BFF] rounded-xl flex items-center justify-center font-black">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Criteria Name</label>
                                            <input 
                                                value={criterion.name}
                                                onChange={(e) => {
                                                    const newCriteria = [...(event.judging_criteria || [])];
                                                    newCriteria[idx].name = e.target.value;
                                                    setEvent({...event, judging_criteria: newCriteria});
                                                }}
                                                placeholder="e.g. Innovation"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm font-bold"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Points</label>
                                            <input 
                                                type="number"
                                                value={criterion.max_points}
                                                onChange={(e) => {
                                                    const newCriteria = [...(event.judging_criteria || [])];
                                                    newCriteria[idx].max_points = parseInt(e.target.value);
                                                    setEvent({...event, judging_criteria: newCriteria});
                                                }}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm font-bold"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const newCriteria = [...(event.judging_criteria || [])];
                                            newCriteria.splice(idx, 1);
                                            setEvent({...event, judging_criteria: newCriteria});
                                        }}
                                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </motion.div>
                            ))}

                            <button 
                                onClick={() => {
                                    const newCriteria = [...(event.judging_criteria || []), { name: '', max_points: 10 }];
                                    setEvent({...event, judging_criteria: newCriteria});
                                }}
                                className="w-full py-6 border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-[#6C3BFF] hover:text-[#6C3BFF] transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add New Criterion
                            </button>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button 
                                onClick={async () => {
                                    const res = await fetch(`/api/v1/institution/events/${eventId}/criteria`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(event.judging_criteria || [])
                                    });
                                    if(res.ok) alert("Rubrics saved successfully!");
                                }}
                                className="px-10 py-4 bg-[#6C3BFF] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] shadow-xl shadow-purple-100 transition-all flex items-center gap-2"
                            >
                                <Save size={18} /> Save Rubrics
                            </button>
                        </div>
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
                    <button 
                        disabled={saving}
                        onClick={async () => {
                            setSaving(true);
                            try {
                                await fetch(`${API_BASE_URL}/api/v1/institution/events/${eventId}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ ...event, stages })
                                });
                                alert("Changes saved successfully!");
                            } catch (err) {
                                alert("Failed to save changes.");
                            } finally {
                                setSaving(false);
                            }
                        }}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-[#6C3BFF] shadow-lg shadow-slate-200 transition-all disabled:opacity-50"
                    >
                        <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
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
