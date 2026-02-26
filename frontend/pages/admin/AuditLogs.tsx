
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Search,
    Filter,
    Calendar,
    User,
    Database,
    AlertTriangle,
    FileText,
    Clock,
    ExternalLink,
    ShieldCheck
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AuditLogs: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const logs = [
        {
            id: 'LOG-8842',
            user: 'Vivek Goud',
            role: 'Super Admin',
            action: 'DELETED_COURSE',
            target: 'Introduction to AI',
            ip: '192.168.1.1',
            timestamp: '2m ago',
            severity: 'high'
        },
        {
            id: 'LOG-8841',
            user: 'System Bot',
            role: 'AI Service',
            action: 'AUTO_GRADED',
            target: 'Assessment #42 (React)',
            ip: 'internal',
            timestamp: '14m ago',
            severity: 'low'
        },
        {
            id: 'LOG-8840',
            user: 'Hiring Partner',
            role: 'Partner',
            action: 'VIEWED_PROFILE',
            target: 'John Doe',
            ip: '45.12.88.2',
            timestamp: '28m ago',
            severity: 'medium'
        },
        {
            id: 'LOG-8839',
            user: 'Admin Sarah',
            role: 'Admin',
            action: 'MODIFIED_USER_ROLE',
            target: 'Jane Smith (Mentor -> Admin)',
            ip: '102.14.5.1',
            timestamp: '1h ago',
            severity: 'high'
        },
        {
            id: 'LOG-8838',
            user: 'Vivek Goud',
            role: 'Super Admin',
            action: 'UPDATE_PRICING',
            target: 'Gold Tier Model',
            ip: '192.168.1.1',
            timestamp: '3h ago',
            severity: 'high'
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Audit Logs</h1>
                        <p className="text-gray-500 text-sm">Review all significant activities and security events across the platform.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-white/5 bg-[#0F0F12] rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all flex items-center gap-2 uppercase tracking-widest">
                            <Calendar size={16} /> Filter by Date
                        </button>
                        <button className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/20 transition-all flex items-center gap-2 uppercase tracking-widest">
                            <ShieldCheck size={16} /> Security Report
                        </button>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by user, action, or target ID..."
                            className="w-full bg-[#0F0F12] border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 outline-none focus:border-purple-500/30 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'High Severity', 'Security', 'Config'].map(f => (
                            <button key={f} className="px-4 py-2.5 rounded-xl bg-[#0F0F12] border border-white/5 text-xs font-bold text-gray-500 hover:text-white transition-all uppercase tracking-widest">
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-[#0F0F12] border border-white/5 rounded-[32px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Operator</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Activity</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">IP Address</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map((log) => (
                                    <motion.tr
                                        key={log.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-8 py-6">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${log.severity === 'high' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                                    log.severity === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                        'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                }`}>
                                                {log.severity === 'high' ? <AlertTriangle size={18} /> : <Activity size={18} />}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div>
                                                <p className="text-sm font-bold text-white tracking-tight">{log.user}</p>
                                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-0.5">{log.role}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <code className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 text-purple-400 border border-white/5 uppercase tracking-widest">
                                                {log.action}
                                            </code>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-300 font-medium">
                                            {log.target}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Database size={14} />
                                                <span className="text-xs font-mono">{log.ip}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <p className="text-sm font-bold text-white">{log.timestamp}</p>
                                                <p className="text-[10px] text-gray-600 font-medium uppercase tracking-widest">ID: {log.id}</p>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity Volume */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">System Activity Volume</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Total requests log volume across last 24h</p>
                            </div>
                        </div>
                        <div className="h-40 flex items-end gap-1 px-4">
                            {Array.from({ length: 48 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-t-sm transition-all duration-500 ${i % 12 === 0 ? 'bg-purple-500 h-[80%]' :
                                            i % 5 === 0 ? 'bg-purple-800/40 h-[40%]' :
                                                'bg-white/5 h-[15%]'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#120D1A] to-[#0F0F12] border border-purple-500/10">
                        <h3 className="text-xl font-bold text-white mb-6">Risk Intelligence</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Suspicious Logins', count: 4, status: 'Active' },
                                { label: 'API Rate Limits', count: 0, status: 'Healthy' },
                                { label: 'Database Spikes', count: 12, status: 'Monitoring' },
                            ].map((risk, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{risk.label}</span>
                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${risk.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                            }`}>{risk.status}</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <p className="text-lg font-bold text-white">{risk.count}</p>
                                        <span className="text-[10px] text-gray-600 font-medium">INCIDENTS</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AuditLogs;
