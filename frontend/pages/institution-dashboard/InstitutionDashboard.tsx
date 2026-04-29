
import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/institution/Sidebar';
import Topbar from '../../components/institution/Topbar';
import StatsSection from '../../components/institution/StatsSection';
import RecentListings from '../../components/institution/RecentListings';
import AlertsPanel from '../../components/institution/AlertsPanel';
import PostOpportunityModal from '../../components/institution/PostOpportunityModal';

import EventsManagement from './EventsManagement';
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

    const renderContent = () => {
        switch (activeTab) {
            case 'events':
                return <EventsManagement 
                    institutionId={institutionId}
                    onViewEvent={handleViewEvent} 
                    onCreateEvent={() => setIsPostModalOpen(true)}
                />;
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
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Center Column */}
                        <div className="flex-1">
                            <StatsSection institutionId={institutionId} />
                            <RecentListings 
                                institutionId={institutionId} 
                                onViewEvent={handleViewEvent} 
                                onViewAll={() => setActiveTab('events')}
                            />
                        </div>

                        {/* Right Sidebar */}
                        <div className="w-full lg:w-80 xl:w-96">
                            <AlertsPanel 
                                institutionId={institutionId} 
                                onUpgrade={() => setActiveTab('settings')}
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex pt-0 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-200/20 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

            {/* Sidebar */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onPostOpportunity={() => setIsPostModalOpen(true)}
            />

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
                <div className="px-8 pt-10">
                    <Topbar 
                        key={profileRefreshTrigger} 
                        onNavigateToSettings={() => setActiveTab('settings')} 
                    />
                </div>

                <main className="p-10 pt-10 pb-20 flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Modals */}
            <PostOpportunityModal 
                isOpen={isPostModalOpen} 
                onClose={() => setIsPostModalOpen(false)} 
            />

            <Footer />
        </div>
    );
};

export default InstitutionDashboard;
