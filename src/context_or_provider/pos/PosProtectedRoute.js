import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePosAuth } from './PosAuth/PosAuthContext';

const PosProtectedRoute = ({ children }) => {
    const { isAuthenticated } = usePosAuth();
    const location = useLocation();

    // If authenticated and trying to access login page, redirect to dashboard
    if (isAuthenticated && location.pathname === "/poslogin") {
        return <Navigate to="/dashboard" replace />;
    }

    // If not authenticated and trying to access protected routes
    if (!isAuthenticated && location.pathname !== "/poslogin") {
        return <Navigate to="/poslogin" state={{ from: location }} replace />;
    }

    return children;
};

export default PosProtectedRoute;
