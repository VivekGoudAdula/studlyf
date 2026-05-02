
import React, { useState, useEffect } from 'react';
import { 
    Award, 
    Search, 
    Download, 
    ExternalLink, 
    User, 
    Calendar,
    CheckCircle2,
    Filter,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Certificate {
    _id: string;
    student_name: string;
    event_title: string;
    certificate_id: string;
    issue_date: string;
    category: string;
    verification_code: string;
}

interface CertificatesPageProps {
    institutionId: string;
}

const CertificatesPage: React.FC<CertificatesPageProps> = ({ institutionId }) => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                setLoading(true);
                // Fetch real certificates from the backend
                const res = await fetch(`/api/v1/institution/certificates/${institutionId}`);
                if (res.ok) {
                    const data = await res.json();
                    setCertificates(data);
                }
            } catch (err) {
                console.error("Failed to load certificates", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCertificates();
    }, [institutionId]);

    const filteredCertificates = certificates.filter(cert => 
        cert.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.event_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.certificate_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-[#6C3BFF]" size={40} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Authenticating Records...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-20 font-sans">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Achievement Registry</h1>
                    <p className="text-slate-500 mt-3 text-xl font-medium">Verify and manage official recognition issued by your institution.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6C3BFF] transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-100/50 outline-none focus:ring-4 focus:ring-purple-50 focus:border-[#6C3BFF] transition-all w-80 font-bold text-slate-800 placeholder:text-slate-300"
                        />
                    </div>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Total Issued', value: certificates.length, icon: Award, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Verified Today', value: '24', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Pending Requests', value: '0', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50' }
                ].map((stat, i) => (
                    <div key={i} className="p-10 bg-white rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-100/20 flex items-center gap-8">
                        <div className={`w-20 h-20 ${stat.bg} rounded-[2rem] flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={32} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h4 className="text-4xl font-black text-slate-900">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Certificates List */}
            <div className="bg-white/40 backdrop-blur-3xl p-3 rounded-[4rem] border border-white/40 shadow-2xl shadow-slate-200/20">
                <div className="bg-white rounded-[3.5rem] overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-8 text-xs font-black text-slate-400 uppercase tracking-widest">Recipient</th>
                                <th className="px-10 py-8 text-xs font-black text-slate-400 uppercase tracking-widest">Event / Opportunity</th>
                                <th className="px-10 py-8 text-xs font-black text-slate-400 uppercase tracking-widest">Issue Date</th>
                                <th className="px-10 py-8 text-xs font-black text-slate-400 uppercase tracking-widest">Certificate ID</th>
                                <th className="px-10 py-8 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredCertificates.length > 0 ? filteredCertificates.map((cert) => (
                                <tr key={cert._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-[#6C3BFF] font-black">
                                                {cert.student_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900">{cert.student_name}</p>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{cert.category || 'Winner'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <p className="font-bold text-slate-700">{cert.event_title}</p>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                                            <Calendar size={16} />
                                            {new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <code className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600 tracking-wider">
                                            {cert.certificate_id}
                                        </code>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center justify-center gap-3">
                                            <button className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-[#6C3BFF] hover:border-purple-100 hover:shadow-lg hover:shadow-purple-50 transition-all">
                                                <Download size={18} />
                                            </button>
                                            <button className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-[#6C3BFF] hover:border-purple-100 hover:shadow-lg hover:shadow-purple-50 transition-all">
                                                <ExternalLink size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <Award size={64} />
                                            <p className="text-xl font-black uppercase tracking-widest">No Certificates Dispatched Yet</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CertificatesPage;
