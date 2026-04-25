import React, { useState } from 'react';
import Sidebar from '../../components/institution/Sidebar';
import Topbar from '../../components/institution/Topbar';
import StatsSection from '../../components/institution/StatsSection';
import RecentListings from '../../components/institution/RecentListings';
import AlertsPanel from '../../components/institution/AlertsPanel';
import PostOpportunityModal from '../../components/institution/PostOpportunityModal';

const InstitutionDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

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
                <div className="px-8 pt-6"> {/* Added top wrapper with padding */}
                    <Topbar />
                </div>

                <main className="p-10 pt-6 flex-1">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Center Column */}
                        <div className="flex-1">
                            <StatsSection />
                            <RecentListings />
                        </div>

                        {/* Right Sidebar */}
                        <div className="w-full lg:w-80 xl:w-96">
                            <AlertsPanel />
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <PostOpportunityModal 
                isOpen={isPostModalOpen} 
                onClose={() => setIsPostModalOpen(false)} 
            />
        </div>
    );
};

export default InstitutionDashboard;
