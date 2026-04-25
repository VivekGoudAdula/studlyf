import React from 'react';
import { useAuth } from '../../AuthContext';
import { Bell, Search, User, CreditCard } from 'lucide-react';

const Topbar: React.FC = () => {
    const { user } = useAuth();
    const displayName = user?.displayName || 'User';

    return (
        <div className="h-20 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl flex items-center justify-between px-8 shadow-sm z-40">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-gray-900">
                    Welcome Back, {displayName} 👋
                </h1>
                <p className="text-sm text-gray-400">Here's what's happening today.</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search opportunities..." 
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 w-64"
                    />
                </div>

                <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                    <CreditCard size={18} className="text-purple-500" />
                    Credit Balance
                </button>

                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                        <Bell size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C3BFF] to-[#9F6BFF] flex items-center justify-center text-white font-bold shadow-lg shadow-purple-100">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
