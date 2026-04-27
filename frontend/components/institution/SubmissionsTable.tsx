import React, { useState } from 'react';
import { Shield, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

interface Submission {
  id: string;
  project_title: string;
  team_name: string;
  college_name: string;
  status: 'Submitted' | 'Under Review' | 'Scored';
  plagiarism_score: number;
  github_url: string;
  average_score: number;
}

interface SubmissionsTableProps {
  submissions: Submission[];
  isBlindMode: boolean;
  onViewDetails: (subId: string) => void;
}

const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ submissions, isBlindMode, onViewDetails }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="p-4 text-sm font-semibold text-gray-600">Project Title</th>
            <th className="p-4 text-sm font-semibold text-gray-600">Identity</th>
            <th className="p-4 text-sm font-semibold text-gray-600">Plagiarism Check</th>
            <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="p-4">
                <div className="font-medium text-gray-900">{sub.project_title}</div>
                <div className="text-xs text-blue-500 flex items-center mt-1">
                  <ExternalLink size={12} className="mr-1" />
                  <a href={sub.github_url} target="_blank" rel="noreferrer" className="hover:underline">View Repository</a>
                </div>
              </td>
              <td className="p-4">
                {isBlindMode ? (
                  <div className="flex items-center text-gray-400 italic">
                    <Shield size={14} className="mr-2" />
                    Anonymous_Team_{sub.id.slice(-4)}
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-medium text-gray-800">{sub.team_name}</div>
                    <div className="text-xs text-gray-500">{sub.college_name}</div>
                  </div>
                )}
              </td>
              <td className="p-4">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  sub.plagiarism_score > 25 ? 'bg-red-100 text-red-800' : 
                  sub.plagiarism_score > 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {sub.plagiarism_score > 25 ? <AlertCircle size={12} className="mr-1" /> : <CheckCircle size={12} className="mr-1" />}
                  {sub.plagiarism_score}% Similarity
                </div>
              </td>
              <td className="p-4">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  sub.status === 'Scored' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {sub.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <button 
                  onClick={() => onViewDetails(sub.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-shadow shadow-sm"
                >
                  Evaluate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsTable;
