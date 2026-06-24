import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { login as authLogin } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUserAuth = async () => {
        try {
            const response = await api.get('/user');
            setUser(response.data);
        } catch (error) {
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
            await authLogin(email, password);
            await checkUserAuth();
            return { success: true };
        } catch (error) {
            setLoading(false);
            return {
                success: false,
                message: error.response?.data?.message || 'Identifiants invalides ou erreur de connexion.'
            };
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await api.post('/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkUserAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
