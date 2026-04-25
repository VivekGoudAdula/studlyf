import React from 'react';
import { MoreHorizontal, ExternalLink, Users } from 'lucide-react';

const listings = [
    { 
        id: 1, 
        title: 'Full Stack Developer Intern', 
        type: 'Internship', 
        applied: 124, 
        finalized: 3, 
        status: 'Needs Review',
        org: 'Aurora Deemed University'
    },
    { 
        id: 2, 
        title: 'Cloud Engineering Workshop', 
        type: 'Workshop', 
        applied: 89, 
        finalized: 0, 
        status: 'Completed',
        org: 'Aurora Deemed University'
    },
    { 
        id: 3, 
        title: 'Product Design Hackathon', 
        type: 'Hackathon', 
        applied: 243, 
        finalized: 12, 
        status: 'Completed',
        org: 'Aurora Deemed University'
    }
];

const RecentListings: React.FC = () => {
    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 flex items-center justify-between border-b border-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Recent Listings</h2>
                <button className="text-sm font-bold text-[#6C3BFF] hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Opportunity Details</th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                            <th className="px-8 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied</th>
                            <th className="px-8 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Finalized</th>
                            <th className="px-8 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {listings.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 mb-1 group-hover:text-[#6C3BFF] transition-colors">{item.title}</span>
                                        <span className="text-xs text-gray-400">{item.org}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Users size={14} className="text-gray-400" />
                                        <span className="font-bold text-gray-700">{item.applied}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center font-bold text-gray-400">
                                    {item.finalized > 0 ? (
                                        <span className="text-green-600">+{item.finalized}</span>
                                    ) : '-'}
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        item.status === 'Completed' 
                                            ? 'bg-green-50 text-green-600 border border-green-100' 
                                            : 'bg-orange-50 text-orange-600 border border-orange-100'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                                            <ExternalLink size={18} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentListings;
