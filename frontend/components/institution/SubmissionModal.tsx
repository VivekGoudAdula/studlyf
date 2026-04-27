import React, { useState } from 'react';
import { X, ShieldCheck, Github, AlertTriangle, Star } from 'lucide-react';

interface SubmissionModalProps {
  submissionId: string;
  isBlindMode: boolean;
  rubric: { name: string, max_score: number }[];
  onClose: () => void;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ submissionId, isBlindMode, rubric, onClose }) => {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(rubric.map(r => [r.name, 0]))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Project Evaluation</h2>
            <p className="text-sm text-gray-500">ID: {submissionId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side: Submission Content */}
          <div className="p-8 border-r border-gray-100 overflow-y-auto max-h-[70vh]">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Title</label>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">AI-Powered Disaster Management</h3>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Identity Information</label>
                {isBlindMode ? (
                  <div className="mt-2 flex items-center p-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                    <ShieldCheck size={18} className="mr-2" />
                    <span className="font-medium">Blind Judging Mode Active</span>
                    <span className="ml-2 text-xs opacity-80">(Personal info hidden)</span>
                  </div>
                ) : (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">Team Alpha</p>
                    <p className="text-sm text-gray-500">IIT Bombay</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Solution Abstract</label>
                <p className="text-gray-700 leading-relaxed mt-2 text-sm">
                  This project utilizes real-time satellite imagery and machine learning to predict flood patterns.
                  Built using React, FastAPI, and TensorFlow.
                </p>
              </div>

              <div className="flex gap-3">
                <a href="#" className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
                  <Github size={18} />
                  <span>GitHub Code</span>
                </a>
              </div>

              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <div className="flex items-center text-red-700 font-bold mb-2">
                  <AlertTriangle size={18} className="mr-2" />
                  Plagiarism Report
                </div>
                <p className="text-xs text-red-600">
                  12% similarity detected in the database connection module. Review required before final scoring.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Scoring Panel */}
          <div className="p-8 bg-gray-50/30">
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Star size={20} className="mr-2 text-yellow-500 fill-yellow-500" />
              Scorecard
            </h4>

            <div className="space-y-8">
              {rubric.map((criteria) => (
                <div key={criteria.name}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-bold text-gray-800">{criteria.name} (1-{criteria.max_score})</label>
                    <span className="text-blue-600 font-black text-xl">{scores[criteria.name] || 0}</span>
                  </div>
                  <input 
                    type="range" min="0" max={criteria.max_score} step="1"
                    value={scores[criteria.name] || 0}
                    onChange={(e) => setScores({...scores, [criteria.name]: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-3">
              <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                Submit Scores
              </button>
              <p className="text-[10px] text-center text-gray-400">
                Scores once submitted cannot be modified during this round.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;
