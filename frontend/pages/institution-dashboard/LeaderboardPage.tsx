import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp, QrCode, Search } from 'lucide-react';

// Live Ticker Component (Dynamic Activity Feed)
const LiveTicker: React.FC = () => {
  const [updates, setUpdates] = useState<string[]>([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch('/api/v1/institution/notifications');
        const data = await res.json();
        setUpdates(data.map((n: any) => n.message));
      } catch (err) {
        setUpdates(["System operational", "Awaiting live updates..."]);
      }
    };
    fetchUpdates();
  }, []);

  if (updates.length === 0) return null;

  return (
    <div className="bg-[#0f172a] py-3 overflow-hidden border-b border-white/10 relative z-10">
      <div className="flex whitespace-nowrap animate-marquee gap-12">
        {updates.map((update, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px] font-black text-white/80 uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            {update}
          </div>
        ))}
        {/* Repeat for seamless loop */}
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

interface LeaderboardEntry {
    rank: number;
    team_name: string;
    project_title: string;
    total_score: number;
    college?: string;
    prize?: string;
}

const LeaderboardPage: React.FC = () => {
    const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                // Akshay's Dynamic Integration: Fetch real scores from DB
                const response = await fetch('/api/v1/institution/leaderboard/active_event');
                const data = await response.json();
                setRankings(data);
            } catch (error) {
                console.error("Integration Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRankings();
    }, []);

    if (loading) {
        return <div className="h-screen flex items-center justify-center bg-[#fafafa] text-gray-400 italic">Synchronizing Live Standings...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#fafafa]">
            <LiveTicker />
            
            <main className="p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">
                                <TrendingUp size={14} />
                                Live Results
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Hall of Fame</h1>
                            <p className="text-gray-500 mt-1">Dynamic rankings powered by institutional scoring.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 shadow-sm hover:border-blue-400 transition-all">
                                <QrCode size={18} />
                                Verify Results
                            </button>
                        </div>
                    </div>

                    {/* Podium (Top 3) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {rankings.length >= 2 && (
                            <div className="mt-8 order-2 md:order-1">
                                <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center relative shadow-sm hover:shadow-xl transition-all group">
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                                        <Medal className="text-slate-400" size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 mt-4 uppercase">2nd Place</p>
                                    <h3 className="text-xl font-black text-gray-900 mt-1">{rankings[1].team_name}</h3>
                                    <p className="text-xs text-gray-500 mb-6">{rankings[1].college || 'Institution Network'}</p>
                                    <div className="text-3xl font-black text-blue-600">{rankings[1].total_score}</div>
                                </div>
                            </div>
                        )}

                        {rankings.length >= 1 && (
                            <div className="order-1 md:order-2">
                                <div className="bg-white p-10 rounded-[2.5rem] border-4 border-yellow-400/30 text-center relative shadow-2xl shadow-yellow-100 transform scale-105">
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center border-8 border-white shadow-xl">
                                        <Trophy className="text-white" size={36} />
                                    </div>
                                    <div className="mt-8">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-black uppercase mb-4">
                                            <Star size={10} fill="currentColor" /> Champion <Star size={10} fill="currentColor" />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900">{rankings[0].team_name}</h3>
                                        <p className="text-xs text-gray-500 mb-6">{rankings[0].college || 'Institution Network'}</p>
                                        <div className="text-5xl font-black text-blue-600 mb-2">{rankings[0].total_score}</div>
                                        <div className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Validated Performance</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {rankings.length >= 3 && (
                            <div className="mt-12 order-3">
                                <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center relative shadow-sm hover:shadow-xl transition-all">
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                                        <Medal className="text-orange-300" size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 mt-4 uppercase">3rd Place</p>
                                    <h3 className="text-xl font-black text-gray-900 mt-1">{rankings[2].team_name}</h3>
                                    <p className="text-xs text-gray-500 mb-6">{rankings[2].college || 'Institution Network'}</p>
                                    <div className="text-3xl font-black text-blue-600">{rankings[2].total_score}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Overall Standings Table */}
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
                                {rankings.length === 0 ? (
                                    <tr><td className="p-20 text-center text-gray-400">No results published yet.</td></tr>
                                ) : (
                                    rankings.map((r) => (
                                        <tr key={r.rank} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                                            <td className="p-6 w-16 text-center">
                                                <span className="text-xl font-black text-gray-300 group-hover:text-blue-500 transition-colors">#{r.rank}</span>
                                            </td>
                                            <td className="p-6">
                                                <div className="font-bold text-gray-900">{r.team_name || 'Unnamed Team'}</div>
                                                <div className="text-xs text-gray-400">{r.project_title || 'No project title'}</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="text-xs font-bold text-gray-500 uppercase">Total Score</div>
                                                <div className="text-lg font-black text-gray-800">{r.total_score}</div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                                    r.prize && r.prize !== '-' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    {r.prize || 'Verified'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

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
