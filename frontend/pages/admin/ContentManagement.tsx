
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Layout,
    Image as ImageIcon,
    FileText,
    Plus,
    Edit3,
    Eye,
    Trash2,
    RefreshCw,
    Search,
    CheckCircle2,
    Globe,
    Star,
    Layers,
    Monitor
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const ContentManagement: React.FC = () => {
    const [selectedView, setSelectedView] = useState('Landing');

    const sections = [
        { id: 'Landing', label: 'Landing Page', icon: Monitor },
        { id: 'Testimonials', label: 'Testimonials', icon: Star },
        { id: 'Partners', label: 'Company Logos', icon: ImageIcon },
        { id: 'Roadmap', label: 'Career Roadmap', icon: Layers },
        { id: 'Blog', label: 'Blog Posts', icon: FileText },
    ];

    const landingSections = [
        { name: 'Hero Section', lastUpdated: '2d ago', status: 'Live', type: 'Main Content' },
        { name: 'Why Studlyf?', lastUpdated: '1w ago', status: 'Live', type: 'Features' },
        { name: 'Impact Numbers', lastUpdated: '14h ago', status: 'Draft', type: 'Statistics' },
        { name: 'Featured Modules', lastUpdated: '3d ago', status: 'Live', type: 'Selection' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Content Experience Manager</h1>
                        <p className="text-gray-500 text-sm">Update landing page visuals, manage testimonials, and control brand messaging.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all flex items-center gap-2 uppercase tracking-widest">
                            <Eye size={16} /> Preview Site
                        </button>
                        <button className="px-6 py-3 bg-purple-600 rounded-2xl text-sm font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all flex items-center gap-2">
                            <RefreshCw size={18} /> Deploy Changes
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* View Switcher */}
                    <div className="w-full lg:w-64 space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setSelectedView(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedView === section.id
                                        ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <section.icon size={18} />
                                {section.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 space-y-8">
                        {selectedView === 'Landing' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {landingSections.map((section, i) => (
                                        <div key={i} className="bg-[#0F0F12] border border-white/5 rounded-[32px] p-8 group hover:border-purple-500/30 transition-all">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-3 rounded-2xl bg-white/5 text-gray-400 group-hover:text-purple-400 transition-colors">
                                                    <Layout size={24} />
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${section.status === 'Live' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
                                                        }`}>{section.status}</span>
                                                    <span className="text-[10px] text-gray-600 font-medium mt-1 uppercase tracking-tighter">Updated {section.lastUpdated}</span>
                                                </div>
                                            </div>
                                            <div className="mb-8">
                                                <h3 className="text-xl font-bold text-white mb-1">{section.name}</h3>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">{section.type}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button className="flex-1 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all">
                                                    Visual Editor
                                                </button>
                                                <button className="flex-1 py-3 bg-purple-600/10 border border-purple-500/20 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400 hover:bg-purple-600 hover:text-white transition-all">
                                                    Raw Data
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="border-2 border-dashed border-white/5 bg-[#0F0F12]/50 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 text-gray-600 hover:text-purple-400 hover:border-purple-500/20 transition-all hover:bg-purple-500/5 group">
                                        <div className="p-4 rounded-full bg-white/5 group-hover:bg-purple-500/10 transition-colors">
                                            <Plus size={32} />
                                        </div>
                                        <p className="text-sm font-bold uppercase tracking-widest">Add New Section</p>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {selectedView === 'Partners' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#0F0F12] border border-white/5 rounded-[32px] p-8"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold text-white">Trust Ecosystem Logos</h3>
                                    <button className="px-4 py-2.5 bg-purple-600 rounded-xl text-xs font-bold text-white">Upload New Logo</button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
                                    {Array.from({ length: 11 }).map((_, i) => (
                                        <div key={i} className="aspect-square bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center p-4 group relative overflow-hidden">
                                            <div className="w-full h-full bg-white/10 rounded-lg animate-pulse" />
                                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"><Edit3 size={14} /></button>
                                                <button className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {selectedView === 'Testimonials' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-4"
                            >
                                <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-900 p-0.5">
                                            <div className="w-full h-full rounded-full bg-[#0F0F12] flex items-center justify-center text-white font-bold">JD</div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white">John Doe</h4>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Placed at Google · Full-Stack Track</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 max-w-lg">
                                        <p className="text-sm italic text-gray-400">"Studlyf transformed my engineering mindset. The mock interviews were scary accurate to reality."</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all"><Edit3 size={18} /></button>
                                        <button className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                                <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-[32px] text-gray-500 hover:text-purple-400 hover:border-purple-500/20 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs">
                                    <Plus size={18} /> Add New Testimonial
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ContentManagement;
