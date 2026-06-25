import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const userHasAllowedRole = (user, allowedRoles = []) => {
    if (allowedRoles.length === 0) {
        return true;
    }

    const roles = user?.roles || (user?.role ? [user.role] : []);
    return roles.some((role) => allowedRoles.includes(role));
};

export default function ProtectedRoute({ children, roles = [] }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="loader-container">
                <div className="spinner"></div>
                <p>Chargement de la session...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (!userHasAllowedRole(user, roles)) {
        return <Navigate to="/compte" replace />;
    }

    return children;
}
