
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, role, loading } = useAuth();

    if (loading) {
        return <div className="h-screen flex items-center justify-center font-mono text-xs tracking-widest uppercase text-[#7C3AED]">Verifying Authority...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If an Admin tries to access a regular protected route (like learner dashboard),
    // redirect them to the Admin System.
    if (role === 'super_admin' || role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
