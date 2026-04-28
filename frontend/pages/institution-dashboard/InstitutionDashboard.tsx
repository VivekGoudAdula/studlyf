import React, { useState } from 'react';
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
import Footer from '../../components/institution/Footer';

const InstitutionDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    const handleViewEvent = (eventId: string) => {
        setSelectedEventId(eventId);
        setActiveTab('event-details');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'events':
                return <EventsManagement 
                    onViewEvent={handleViewEvent} 
                    onCreateEvent={() => setIsPostModalOpen(true)}
                />;
            case 'event-details':
                return <EventDetails eventId={selectedEventId} onBack={() => setActiveTab('events')} />;
            case 'participants':
                return <ParticipantsManagement />;
            case 'teams':
                return <TeamsManagement />;
            case 'submissions':
                return <SubmissionList />;
            case 'judges':
                return <JudgeDashboard />;
            case 'leaderboard':
                return <LeaderboardPage />;
            case 'analytics':
                return <ReportsPage />;
            case 'settings':
                return <SettingsPage />;
            case 'dashboard':
            default:
                return (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Center Column */}
                        <div className="flex-1">
                            <StatsSection />
                            <RecentListings onViewEvent={handleViewEvent} />
                        </div>

                        {/* Right Sidebar */}
                        <div className="w-full lg:w-80 xl:w-96">
                            <AlertsPanel />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex pt-0">
            {/* Sidebar */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onPostOpportunity={() => setIsPostModalOpen(true)}
            />

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <div className="px-8 pt-10">
                    <Topbar />
                </div>

                <main className="p-10 pt-10 pb-20 flex-1">
                    {renderContent()}
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
