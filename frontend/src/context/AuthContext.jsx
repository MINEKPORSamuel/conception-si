import React, { useState, useEffect } from 'react';
import { getCurrentUser, login as authLogin, logout as authLogout, register as authRegister } from '../services/auth';
import { clearToken, getToken } from '../services/token';
import AuthContext from './auth-context';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUserAuth = async () => {
        if (!getToken()) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch {
            clearToken();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUserAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const result = await authLogin(email, password);
            setUser(result.user);
            setLoading(false);
            return { success: true, user: result.user };
        } catch (error) {
            setLoading(false);
            console.error('Login error details:', error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || error.response?.data?.error || 'Identifiants invalides ou erreur de connexion.'
            };
        }
    };

    const register = async (payload) => {
        setLoading(true);
        try {
            const result = await authRegister(payload);
            setUser(result.user);
            setLoading(false);
            return { success: true, user: result.user };
        } catch (error) {
            setLoading(false);
            console.error('Register error details:', error.response?.data);
            const validationErrors = error.response?.data?.errors;
            const firstValidationMessage = validationErrors
                ? Object.values(validationErrors).flat().find(Boolean)
                : '';
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    firstValidationMessage ||
                    'Impossible de créer le compte.',
            };
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await authLogout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkUserAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
