import React from 'react';
import { useAuth } from '../../AuthContext';
import { Bell, Search, User, CreditCard, LogOut, Settings as SettingsIcon, Menu } from 'lucide-react';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Topbar: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const displayName = user?.displayName || 'User';

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="w-full flex items-center justify-between mb-10 animate-in slide-in-from-top duration-1000">
            {/* Left Side: Greeting */}
            <div className="hidden lg:block">
                <h1 className="text-2xl font-['Outfit'] font-bold text-slate-900">
                    Welcome Back, <span className="text-[#6C3BFF]">{displayName}</span> 👋
                </h1>
                <p className="text-slate-400 text-sm font-medium mt-1">Here's your institutional overview for today.</p>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-xl mx-8 hidden md:block">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6C3BFF] transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search events, students, or reports..." 
                        className="w-full pl-14 pr-6 py-4 bg-white/70 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-xl shadow-slate-200/40 focus:ring-4 focus:ring-purple-50 focus:border-[#6C3BFF] outline-none transition-all placeholder:text-slate-400 font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-400 rounded-lg border border-slate-100">
                        ⌘ K
                    </div>
                </div>
            </div>

            {/* Right Side: Actions & Profile */}
            <div className="flex items-center gap-4">
                {/* Credit / Status */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 font-bold text-xs">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    System Live
                </div>

                {/* Notifications */}
                <button className="relative p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-[#6C3BFF] hover:border-purple-100 hover:shadow-lg hover:shadow-purple-100/50 transition-all group">
                    <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                </button>

                {/* Profile Toggle */}
                <div className="flex items-center gap-3 p-1.5 pr-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C3BFF] to-[#9F6BFF] flex items-center justify-center text-white font-bold shadow-lg shadow-purple-100">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 leading-tight">{displayName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</p>
                    </div>
                    
                    <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block" />
                    
                    <button 
                        onClick={handleLogout}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
