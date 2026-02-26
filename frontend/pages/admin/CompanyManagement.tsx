
import React from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Plus,
    Search,
    Users,
    Target,
    Briefcase,
    CheckCircle2,
    ExternalLink,
    MapPin,
    Globe
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const CompanyManagement: React.FC = () => {
    const companies = [
        { id: 1, name: 'Google', students: 24, hires: 12, industry: 'Tech / AI', location: 'Bangalore / Remote', status: 'Silver' },
        { id: 2, name: 'Zomato', students: 18, hires: 5, industry: 'FoodTech', location: 'Gurgaon', status: 'Gold' },
        { id: 3, name: 'Razorpay', students: 32, hires: 8, industry: 'FinTech', location: 'Bangalore', status: 'Platinum' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Hiring Partners</h1>
                        <p className="text-gray-500 text-sm">Manage company relationships, track hiring pipelines, and update tiered authority.</p>
                    </div>
                    <button className="px-6 py-3 bg-purple-600 rounded-2xl text-sm font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all flex items-center gap-2">
                        <Plus size={18} /> Add New Partner
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <div key={company.id} className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5 group hover:border-purple-500/30 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-purple-400 transition-colors">
                                    <Building2 size={32} />
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${company.status === 'Platinum' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                        company.status === 'Gold' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                            'bg-gray-500/10 text-gray-400 border-white/5'
                                    }`}>
                                    {company.status} Partner
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-1">{company.name}</h3>
                            <div className="flex items-center gap-2 text-gray-500 mb-6">
                                <MapPin size={14} />
                                <span className="text-xs font-medium">{company.location}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-6 mb-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Total Hired</p>
                                    <p className="text-lg font-bold text-white tracking-tight">{company.hires}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Active Trials</p>
                                    <p className="text-lg font-bold text-purple-400 tracking-tight">{company.students}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Globe size={14} />
                                    <span className="text-xs font-medium">{company.industry}</span>
                                </div>
                                <button className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                    <ExternalLink size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default CompanyManagement;
