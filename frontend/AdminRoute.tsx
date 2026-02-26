
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from './AuthContext';

interface AdminRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

const AdminRoute: React.FC<AdminRouteProps> = ({
    children,
    allowedRoles = ['super_admin', 'admin']
}) => {
    const { user, role, loading } = useAuth();

    if (loading) {
        return <div className="h-screen flex items-center justify-center font-mono text-xs tracking-widest uppercase text-[#7C3AED]">Verifying Authority...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && !allowedRoles.includes(role)) {
        // If they have a role but it's not allowed, send to their respective dashboard
        if (role === 'student') return <Navigate to="/dashboard/learner" replace />;
        if (role === 'mentor') return <Navigate to="/dashboard/mentor" replace />; // To be implemented
        if (role === 'hiring_partner') return <Navigate to="/dashboard/partner" replace />;

        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
