import React, { useState } from 'react';
import { Trophy, Medal, Star, TrendingUp, Search, QrCode } from 'lucide-react';
import Sidebar from '../../components/institution/Sidebar';
import Topbar from '../../components/institution/Topbar';

const LiveTicker = () => {
  const [updates] = useState([
    "Team Alpha scored 9.5 in Innovation!",
    "New Submission from Green Guardians",
    "Judging for 'EcoTrack' is complete",
    "Final Leaderboard locking in 5 minutes",
    "Team CodeNinjas moved up to 2nd Place!"
  ]);

  return (
    <div className="bg-gray-900 py-2 overflow-hidden border-b border-white/10">
      <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
        {updates.map((update, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px] font-black text-white/80 uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            {update}
          </div>
        ))}
        {updates.map((update, i) => (
          <div key={`dup-${i}`} className="flex items-center gap-2 text-[11px] font-black text-white/80 uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            {update}
          </div>
        ))}
      </div>
    </div>
  );
};

const LeaderboardPage: React.FC = () => {
  const [rankings] = useState([
    { rank: 1, team: 'Team Alpha', college: 'IIT Bombay', score: 96.5, prize: 'Winner - ₹50,000' },
    { rank: 2, team: 'MedTech Savants', college: 'BITS Pilani', score: 94.2, prize: 'Runner Up - ₹25,000' },
    { rank: 3, team: 'Code Ninjas', college: 'VIT Vellore', score: 91.8, prize: 'Special Mention' },
    { rank: 4, team: 'Green Guardians', college: 'MIT Manipal', score: 88.5, prize: '-' },
  ]);

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <LiveTicker />
        <Topbar />
        
        <main className="p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">
                  <TrendingUp size={14} />
                  Live Results
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Hall of Fame</h1>
                <p className="text-gray-500 mt-1">Final Rankings for National Innovation Hackathon 2026</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 shadow-sm hover:border-blue-400 transition-all">
                  <QrCode size={18} />
                  Verify Results
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="mt-8 order-2 md:order-1">
                <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center relative shadow-sm hover:shadow-xl transition-all group">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                    <Medal className="text-slate-400" size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-400 mt-4 uppercase">2nd Place</p>
                  <h3 className="text-xl font-black text-gray-900 mt-1">{rankings[1].team}</h3>
                  <p className="text-xs text-gray-500 mb-6">{rankings[1].college}</p>
                  <div className="text-3xl font-black text-blue-600">{rankings[1].score}</div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="bg-white p-10 rounded-[2.5rem] border-4 border-yellow-400/30 text-center relative shadow-2xl shadow-yellow-100 transform scale-105">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center border-8 border-white shadow-xl animate-bounce">
                    <Trophy className="text-white" size={36} />
                  </div>
                  <div className="mt-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-black uppercase mb-4">
                      <Star size={10} fill="currentColor" /> Champion <Star size={10} fill="currentColor" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">{rankings[0].team}</h3>
                    <p className="text-xs text-gray-500 mb-6">{rankings[0].college}</p>
                    <div className="text-5xl font-black text-blue-600 mb-2">{rankings[0].score}</div>
                    <div className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Perfect execution in technical round</div>
                  </div>
                </div>
              </div>

              <div className="mt-12 order-3">
                <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center relative shadow-sm hover:shadow-xl transition-all">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                    <Medal className="text-orange-300" size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-400 mt-4 uppercase">3rd Place</p>
                  <h3 className="text-xl font-black text-gray-900 mt-1">{rankings[2].team}</h3>
                  <p className="text-xs text-gray-500 mb-6">{rankings[2].college}</p>
                  <div className="text-3xl font-black text-blue-600">{rankings[2].score}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Overall Standings</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="text" placeholder="Search team..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all w-48" />
                </div>
              </div>
              <table className="w-full text-left">
                <tbody>
                  {rankings.map((r) => (
                    <tr key={r.rank} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                      <td className="p-6 w-16 text-center">
                        <span className="text-xl font-black text-gray-300 group-hover:text-blue-500 transition-colors">#{r.rank}</span>
                      </td>
                      <td className="p-6">
                        <div className="font-bold text-gray-900">{r.team}</div>
                        <div className="text-xs text-gray-400">{r.college}</div>
                      </td>
                      <td className="p-6">
                        <div className="text-xs font-bold text-gray-500 uppercase">Total Score</div>
                        <div className="text-lg font-black text-gray-800">{r.score}</div>
                      </td>
                      <td className="p-6 text-right">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          r.prize !== '-' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {r.prize}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;
