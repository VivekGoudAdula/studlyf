
import React from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Search,
    Filter,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    Download,
    MoreVertical
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const PaymentManagement: React.FC = () => {
    const payments = [
        { id: 'PAY-8821', student: 'John Doe', amount: '$499', plan: 'Full-Stack Track', status: 'Completed', date: '2m ago' },
        { id: 'PAY-8820', student: 'Jane Smith', amount: '$1200', plan: 'Corporate Training', status: 'Pending', date: '14m ago' },
        { id: 'PAY-8819', student: 'Sarah Connor', amount: '$699', plan: 'System Design Pro', status: 'Refunded', date: '1h ago' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Finance Hub</h1>
                        <p className="text-gray-500 text-sm">Track subscriptions, manage refunds, and monitor revenue across all tracks.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><DollarSign size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Revenue (MTD)</span>
                        </div>
                        <h4 className="text-3xl font-bold text-white mb-1">$84,200</h4>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                            <ArrowUpRight size={14} /> +12.4% vs Last Month
                        </div>
                    </div>
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><CheckCircle2 size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Subscriptions</span>
                        </div>
                        <h4 className="text-3xl font-bold text-white mb-1">1,242</h4>
                        <p className="text-xs text-gray-500 font-medium">Active recurring plans</p>
                    </div>
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5 text-gray-400">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-white/5"><AlertCircle size={20} /></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Refund Requests</span>
                        </div>
                        <h4 className="text-3xl font-bold text-white mb-1">4</h4>
                        <p className="text-xs text-gray-500 font-medium">Pending manual review</p>
                    </div>
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5 text-gray-400">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-white/5"><Calendar size={20} /></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Next Projection</span>
                        </div>
                        <h4 className="text-3xl font-bold text-white mb-1">$102k</h4>
                        <p className="text-xs text-gray-500 font-medium">Forecasting March 2026</p>
                    </div>
                </div>

                <div className="bg-[#0F0F12] border border-white/5 rounded-[32px] overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction ID</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student & Plan</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {payments.map((p) => (
                                <motion.tr
                                    key={p.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="group hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    <td className="px-8 py-6 text-sm font-mono text-gray-500">{p.id}</td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{p.student}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{p.plan}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-white">{p.amount}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded bg-white/5 uppercase tracking-widest ${p.status === 'Completed' ? 'text-emerald-400 bg-emerald-400/10' :
                                                p.status === 'Refunded' ? 'text-rose-400 bg-rose-400/10' :
                                                    'text-amber-400 bg-amber-400/10'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right font-medium text-xs text-gray-500">{p.date}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default PaymentManagement;
