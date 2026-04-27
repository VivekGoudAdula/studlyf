import React, { useState } from 'react';
import SubmissionsTable from '../../components/institution/SubmissionsTable';
import SubmissionModal from '../../components/institution/SubmissionModal';
import { Gavel, Users, Target, Shield } from 'lucide-react';

const JudgeDashboard = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);

  const stats = [
    { label: 'Pending Reviews', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Teams Graded', value: '45', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Avg. Score', value: '82', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Blind Mode', value: 'ON', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Judge Dashboard</h1>
          <p className="text-gray-500 mt-1 font-medium">Evaluation Workspace: HackTheFuture 2024</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
           <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Gavel size={20} />
           </div>
           <div className="pr-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logged in as</p>
              <p className="text-sm font-bold text-gray-900">Dr. Sarah Johnson</p>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <SubmissionsTable onOpenSubmission={(id) => setSelectedSubmission(id)} />

      {selectedSubmission && (
        <SubmissionModal 
          submissionId={selectedSubmission}
          isBlindMode={true}
          rubric={[
            { name: 'Innovation', max_score: 10 },
            { name: 'Technical Execution', max_score: 10 },
            { name: 'Impact', max_score: 10 },
            { name: 'Presentation', max_score: 5 }
          ]}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
};

// Internal icon mappings for stats
import { Clock, CheckCircle2 } from 'lucide-react';

export default JudgeDashboard;
