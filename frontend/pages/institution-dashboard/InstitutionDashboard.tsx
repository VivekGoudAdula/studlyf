
import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2 } from 'lucide-react';
import Sidebar from '../../components/institution/Sidebar';
import InstitutionNavbar from '../../components/institution/InstitutionNavbar';
import StatsSection from '../../components/institution/StatsSection';
import RecentListings from '../../components/institution/RecentListings';
import AlertsPanel from '../../components/institution/AlertsPanel';
import PostOpportunityModal from '../../components/institution/PostOpportunityModal';
import PostSelectionModal from '../../components/institution/PostSelectionModal';

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
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
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
                        <div className="flex-1">
                            <StatsSection institutionId={institutionId} key={profileRefreshTrigger} />
                            <RecentListings 
                                institutionId={institutionId} 
                                onViewEvent={handleViewEvent} 
                                onViewAll={() => setActiveTab('events')}
                            />
                        </div>
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
        </div>
    );
};

export default InstitutionDashboard;
