import React from 'react';
import Sidebar from '../../components/institution/Sidebar';
import Topbar from '../../components/institution/Topbar';
import { BarChart3, Users, FileText, Target, Download, TrendingUp, Filter } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';

// Mock Data for Analytics
const participationData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const categoryData = [
  { name: 'Hackathon', value: 54 },
  { name: 'Coding', value: 26 },
  { name: 'Design', value: 20 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const AnalyticsPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Reports & Analytics</h1>
              <p className="text-gray-500 mt-1">Deep dive into your institution's event performance</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-blue-400 transition-all">
                <Filter size={16} />
                Custom Range
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                <Download size={16} />
                Export Full Report
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Participants', value: '1,284', icon: <Users className="text-blue-600" />, trend: '+12.5%' },
              { label: 'Submissions Rate', value: '78.2%', icon: <FileText className="text-green-600" />, trend: '+4.3%' },
              { label: 'Avg. Score', value: '7.4/10', icon: <Target className="text-purple-600" />, trend: '-1.2%' },
              { label: 'Active Events', value: '06', icon: <BarChart3 className="text-orange-600" />, trend: '0%' }
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">{kpi.value}</h3>
                    <div className={`mt-2 text-xs font-bold ${kpi.trend.startsWith('+') ? 'text-green-500' : kpi.trend === '0%' ? 'text-gray-400' : 'text-red-500'}`}>
                      {kpi.trend} <span className="text-gray-400 font-normal ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">{kpi.icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Participation Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600" />
                  Participation Trend
                </h3>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={participationData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-8">Event Categories</h3>
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-gray-900">100+</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Total Events</span>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                {categoryData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}} />
                      <span className="text-sm font-medium text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
