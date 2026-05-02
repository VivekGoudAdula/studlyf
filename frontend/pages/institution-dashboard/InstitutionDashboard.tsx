
import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Info, ChevronRight } from 'lucide-react';
import Sidebar from '../../components/institution/Sidebar';
import InstitutionNavbar from '../../components/institution/InstitutionNavbar';
import StatsSection from '../../components/institution/StatsSection';
import RecentListings from '../../components/institution/RecentListings';
import AlertsPanel from '../../components/institution/AlertsPanel';
import PostOpportunityModal from '../../components/institution/PostOpportunityModal';
import PostSelectionModal from '../../components/institution/PostSelectionModal';
import ContactConsultationDrawer from '../../components/institution/ContactConsultationDrawer';
import CreditBalanceModal from '../../components/institution/CreditBalanceModal';
import DashboardTour from '../../components/institution/DashboardTour';
import PostJobModal from '../../components/institution/PostJobModal';
import PostInternshipModal from '../../components/institution/PostInternshipModal';

import EventsManagement from './EventsManagement';
import OpportunitiesManagement from './OpportunitiesManagement';
import EventDetails from './EventDetails';
import SettingsPage from './SettingsPage';
import SubmissionList from './submissions/SubmissionList';
import JudgeDashboard from './judge/JudgeDashboard';
import ParticipantsManagement from './ParticipantsManagement';
import TeamsManagement from './TeamsManagement';
import LeaderboardPage from './LeaderboardPage';
import ReportsPage from './ReportsPage';
import CertificatesPage from './CertificatesPage';
import DownloadsPage from './DownloadsPage';
import Footer from '../../components/institution/Footer';

const InstitutionDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
    const [isConsultationOpen, setIsConsultationOpen] = useState(false);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [profileRefreshTrigger, setProfileRefreshTrigger] = useState(0);

    const { user } = useAuth();
    const institutionId = user?.user_id || 'default_inst';

    const handleViewEvent = (eventId: string) => {
        setSelectedEventId(eventId);
        setActiveTab('event-details');
    };

    const handleProfileUpdate = () => {
        setProfileRefreshTrigger(prev => prev + 1);
    };

    const handlePostSelect = (type: string) => {
        setIsSelectionModalOpen(false);
        const opportunityTypes = ['opportunity', 'hackathon', 'competition', 'quiz', 'webinar'];
        if (opportunityTypes.includes(type)) {
            setIsPostModalOpen(true);
        } else if (type === 'job') {
            setIsJobModalOpen(true);
        } else if (type === 'internship') {
            setIsInternshipModalOpen(true);
        } else if (type === 'dashboard') {
            setActiveTab('dashboard');
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'events':
                return (
                    <EventsManagement 
                        institutionId={institutionId}
                        onViewEvent={handleViewEvent} 
                        onCreateEvent={() => setIsPostModalOpen(true)}
                    />
                );
            case 'opportunities':
                return (
                    <OpportunitiesManagement 
                        institutionId={institutionId}
                        onViewEvent={handleViewEvent} 
                        onCreateEvent={() => setIsPostModalOpen(true)}
                    />
                );
            case 'event-details':
                return <EventDetails institutionId={institutionId} eventId={selectedEventId} onBack={() => setActiveTab('events')} />;
            case 'participants':
                return <ParticipantsManagement institutionId={institutionId} />;
            case 'teams':
                return <TeamsManagement institutionId={institutionId} />;
            case 'submissions':
                return <SubmissionList institutionId={institutionId} />;
            case 'judges':
                return <JudgeDashboard institutionId={institutionId} />;
            case 'leaderboard':
                return <LeaderboardPage institutionId={institutionId} />;
            case 'analytics':
                return <ReportsPage institutionId={institutionId} />;
            case 'downloads':
                return <DownloadsPage institutionId={institutionId} onNavigate={setActiveTab} />;
            case 'certificates':
                return <CertificatesPage institutionId={institutionId} />;
            case 'settings':
                return <SettingsPage institutionId={institutionId} onProfileUpdate={handleProfileUpdate} />;
            case 'dashboard':
            default:
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Header Area */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                    Welcome Back, {user?.name || 'Admin'} <span className="animate-bounce">👋</span>
                                </h1>
                                <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
                                    Here is the summary of overall performance <Info size={14} className="text-slate-300" />
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div id="team-manage-icon" className="px-3 py-1 bg-slate-100 rounded-full flex items-center justify-center text-[11px] font-black text-slate-500">KN</div>
                                <button 
                                    onClick={() => setIsCreditModalOpen(true)}
                                    className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-[11px] font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                                >
                                    Credit Balance
                                </button>
                                <button 
                                    onClick={() => setIsTourOpen(true)}
                                    className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-[#6C3BFF] transition-all shadow-sm"
                                >
                                    <Info size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Top Stats & Customise Grid */}
                        <div className="flex flex-col xl:flex-row gap-6">
                            <div className="flex-1" id="stats-section">
                                <StatsSection 
                                    institutionId={institutionId} 
                                    key={profileRefreshTrigger} 
                                    onUpgrade={() => setActiveTab('settings')} 
                                    onContact={() => setIsConsultationOpen(true)}
                                    onNavigate={(tab) => {
                                        if (tab === 'opportunities') setActiveTab('opportunities');
                                        else setActiveTab('events');
                                    }}
                                />
                            </div>
                            
                            {/* Customise Card */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="w-full xl:w-[380px] bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] rounded-3xl p-8 relative overflow-hidden group shadow-xl shadow-purple-900/5"
                            >
                                <div className="relative z-10">
                                    <h3 className="text-xl font-black text-slate-900 mb-2">Customise your Experience</h3>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 max-w-[200px]">
                                        Enhance your experience with tailored services designed to meet your specific requirements.
                                    </p>
                                    <button 
                                        onClick={() => setIsConsultationOpen(true)}
                                        className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 transition-all"
                                    >
                                        Contact Us <ChevronRight size={14} />
                                    </button>
                                </div>
                                {/* 3D Icon Effect */}
                                <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl border-8 border-slate-50/50">
                                    <div className="w-24 h-24 bg-[#7C3AED] rounded-[2rem] flex items-center justify-center text-white text-3xl font-black rotate-[-15deg]">
                                        <span className="text-[14px] uppercase tracking-tighter">Studlyf</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Recent Listings & Alerts */}
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-1">
                                <RecentListings 
                                    institutionId={institutionId} 
                                    onViewEvent={handleViewEvent} 
                                    onViewAll={() => setActiveTab('events')}
                                />
                            </div>
                            <div className="w-full lg:w-80 xl:w-96" id="alerts-panel">
                                <AlertsPanel 
                                    institutionId={institutionId} 
                                    onUpgrade={() => setActiveTab('settings')}
                                />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="h-screen bg-[#F8FAFC] flex overflow-hidden font-['Outfit']">
            {/* Sidebar: Fixed width, full height */}
            <Sidebar 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                onPost={() => setIsSelectionModalOpen(true)}
            />

            {/* Main Content Area: Fills remaining width, has its own scrollbar */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Navbar: In the flow, so it cannot overlap the sidebar logo */}
                <InstitutionNavbar 
                    institutionId={institutionId} 
                    onNavigate={setActiveTab}
                    onNavigateToSettings={() => setActiveTab('settings')}
                />
                
                <main className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8">
                    <div className="max-w-[1600px] mx-auto py-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <Footer />
                </main>
            </div>

            <PostSelectionModal 
                isOpen={isSelectionModalOpen} 
                onClose={() => setIsSelectionModalOpen(false)}
                onSelect={handlePostSelect}
            />

            <PostOpportunityModal 
                isOpen={isPostModalOpen} 
                onClose={() => setIsPostModalOpen(false)}
                institutionId={institutionId}
            />

            <PostJobModal 
                isOpen={isJobModalOpen} 
                onClose={() => setIsJobModalOpen(false)}
                institutionId={institutionId}
            />

            <PostInternshipModal 
                isOpen={isInternshipModalOpen} 
                onClose={() => setIsInternshipModalOpen(false)}
                onSuccess={() => setActiveTab('opportunities')}
                institutionId={institutionId}
            />

            <ContactConsultationDrawer 
                isOpen={isConsultationOpen}
                onClose={() => setIsConsultationOpen(false)}
                institutionId={institutionId} 
            />

            <CreditBalanceModal 
                isOpen={isCreditModalOpen} 
                onClose={() => setIsCreditModalOpen(false)} 
                onUpgrade={() => { setIsCreditModalOpen(false); setActiveTab('settings'); }} 
            />

            <DashboardTour 
                isOpen={isTourOpen} 
                onClose={() => setIsTourOpen(false)} 
            />
        </div>
    );
};

export default InstitutionDashboard;
