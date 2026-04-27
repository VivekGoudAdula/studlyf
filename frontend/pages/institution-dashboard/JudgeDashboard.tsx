import React, { useState } from 'react';
import Sidebar from '../../components/institution/Sidebar';
import Topbar from '../../components/institution/Topbar';
import SubmissionsTable from '../../components/institution/SubmissionsTable';
import SubmissionModal from '../../components/institution/SubmissionModal';
import { Eye, EyeOff, Search, Filter } from 'lucide-react';

const JudgeDashboard: React.FC = () => {
  const [isBlindMode, setIsBlindMode] = useState(false);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  // Mock Data
  const mockSubmissions = [
    { id: 'sub_001', project_title: 'EcoTrack AI', team_name: 'Green Guardians', college_name: 'BITS Pilani', status: 'Under Review' as const, plagiarism_score: 8, github_url: '#', average_score: 0 },
    { id: 'sub_002', project_title: 'SafeRoute', team_name: 'Code Ninjas', college_name: 'VIT Vellore', status: 'Submitted' as const, plagiarism_score: 32, github_url: '#', average_score: 0 },
    { id: 'sub_003', project_title: 'HealthSync', team_name: 'MedTech Savants', college_name: 'MIT Manipal', status: 'Scored' as const, plagiarism_score: 5, github_url: '#', average_score: 8.5 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Judge Dashboard</h1>
              <p className="text-gray-500 mt-1">Evaluate projects for "Innovation Hackathon 2026"</p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsBlindMode(!isBlindMode)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm border ${
                  isBlindMode 
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-indigo-100' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400'
                }`}
              >
                {isBlindMode ? <EyeOff size={18} /> : <Eye size={18} />}
                {isBlindMode ? 'Blind Mode Active' : 'Enable Blind Mode'}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Submissions', value: '42', color: 'bg-blue-500' },
              { label: 'Scored', value: '18', color: 'bg-green-500' },
              { label: 'Pending Review', value: '24', color: 'bg-orange-500' }
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} opacity-10`} />
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by project name or ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              <Filter size={16} />
              Filters
            </button>
          </div>

          <SubmissionsTable 
            submissions={mockSubmissions} 
            isBlindMode={isBlindMode} 
            onViewDetails={(id) => setSelectedSub(id)}
          />
        </main>
      </div>

      {selectedSub && (
        <SubmissionModal 
          submissionId={selectedSub}
          isBlindMode={isBlindMode}
          rubric={[
            { name: "Innovation", max_score: 10 },
            { name: "Technical Execution", max_score: 10 },
            { name: "Impact", max_score: 10 }
          ]}
          onClose={() => setSelectedSub(null)}
        />
      )}
    </div>
  );
};

export default JudgeDashboard;
