import React from 'react';
import { FileText, Eye, MoreVertical, CheckCircle2, Clock } from 'lucide-react';

const SubmissionsTable = ({ onOpenSubmission }: { onOpenSubmission: (id: string) => void }) => {
  const submissions = [
    { id: 'SUB-001', team: 'Team Alpha', title: 'AI Disaster Management', status: 'Graded', score: '88/100', time: '2h ago' },
    { id: 'SUB-002', team: 'Quantum Coders', title: 'Smart Agriculture IoT', status: 'Pending', score: '-', time: '5h ago' },
    { id: 'SUB-003', team: 'Eco Warriors', title: 'Sustainable Energy Grid', status: 'Graded', score: '92/100', time: '1d ago' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Event Submissions</h3>
        <button className="text-sm text-blue-600 font-semibold hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Submission ID</th>
              <th className="px-6 py-4">Team / Project</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{sub.id}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{sub.team}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <FileText size={12} /> {sub.title}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    sub.status === 'Graded' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {sub.status === 'Graded' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {sub.status}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-700">{sub.score}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onOpenSubmission(sub.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionsTable;
