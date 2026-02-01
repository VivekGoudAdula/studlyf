
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="h-screen flex items-center justify-center font-mono text-xs tracking-widest uppercase text-[#7C3AED]">Synchronizing Protocol...</div>;
    }

    if (user) {
        const role = localStorage.getItem('userRole') || 'learner';
        // Ensure we don't redirect to a non-existent dashboard role
        const targetDashboard = role === 'partner' ? '/dashboard/partner' : '/dashboard/learner';
        return <Navigate to={targetDashboard} replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;
