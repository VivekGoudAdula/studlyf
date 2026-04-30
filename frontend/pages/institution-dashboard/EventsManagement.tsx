import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../apiConfig';
import { 
    Search, 
    Filter, 
    Plus, 
    MoreVertical, 
    Edit2, 
    Trash2, 
    Calendar, 
    Users, 
    ChevronRight,
    Trophy,
    ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
    id: string;
    name: string;
    status: 'Draft' | 'Live' | 'Ended' | 'Archived';
    type: 'Hackathon' | 'Coding Competition' | 'Design Challenge' | 'Quiz';
    startDate: string;
    participants: number;
    image: string;
}

interface EventsManagementProps {
    institutionId?: string;
    onViewEvent: (id: string) => void;
    onCreateEvent: () => void;
}

const EventsManagement: React.FC<EventsManagementProps> = ({ institutionId = 'default_inst', onViewEvent, onCreateEvent }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/institution/events/${institutionId}`);
                if (!response.ok) throw new Error("Fetch failed");
                const data = await response.json();
                setEvents(data.map((e: any) => ({
                    id: e._id,
                    name: e.title,
                    status: e.status || 'Live',
                    type: e.category || 'Hackathon',
                    startDate: new Date(e.start_date).toLocaleDateString(),
                    participants: e.participant_count || 0,
                    image: e.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
                })));
            } catch (err) {
                console.error("Dynamic events fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || statusFilter === 'All Status' || event.status === statusFilter;
        const matchesType = typeFilter === 'All' || typeFilter === 'All Types' || event.type.includes(typeFilter);
        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Live': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Draft': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Ended': return 'bg-gray-50 text-gray-600 border-gray-100';
            case 'Archived': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-['Outfit'] font-bold text-slate-900">Events Management</h1>
                    <p className="text-slate-500 mt-1">Create, manage and monitor your institutional events</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCreateEvent}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#6C3BFF] to-[#8B5CF6] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-purple-200"
                >
                    <Plus size={20} />
                    Create New Event
                </motion.button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/20 p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search events by name..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl">
                        <Filter size={18} className="text-slate-400" />
                        <select 
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-600 outline-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option>All Status</option>
                            <option>Live</option>
                            <option>Draft</option>
                            <option>Ended</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl">
                        <Trophy size={18} className="text-slate-400" />
                        <select 
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-600 outline-none"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option>All Types</option>
                            {Array.from(new Set(events.map(e => e.type))).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Events Grid/Table */}
            <div className="grid grid-cols-1 gap-6">
                {filteredEvents.map((event) => (
                    <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group bg-white hover:bg-slate-50 border border-slate-100 p-6 rounded-[2rem] transition-all hover:shadow-2xl hover:shadow-purple-100/50"
                    >
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Event Image/Thumbnail */}
                            <div className="w-full lg:w-48 h-32 rounded-2xl overflow-hidden relative bg-slate-100">
                                <img 
                                    src={event.image} 
                                    alt={event.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(event.status)}`}>
                                    {event.status}
                                </div>
                            </div>

                            {/* Event Info */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">{event.type}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#6C3BFF] transition-colors">{event.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => onViewEvent(event.id)}
                                            className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-[#6C3BFF]"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-red-500">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Calendar size={16} />
                                        <span className="text-sm font-medium">{event.startDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Users size={16} />
                                        <span className="text-sm font-medium">{event.participants} registered</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex items-center">
                                <button 
                                    onClick={() => onViewEvent(event.id)}
                                    className="w-full lg:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-[#6C3BFF] transition-all group/btn"
                                >
                                    Manage Event
                                    <ArrowUpRight size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default EventsManagement;
