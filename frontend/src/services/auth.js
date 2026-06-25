import api from './api';
import { clearToken, setToken } from './token';

export const login = async (email, password) => {
    const response = await api.post('/login', { email, password });

    if (response.data?.token) {
        setToken(response.data.token);
    }

    return response.data;
};

export const register = async (payload) => {
    const response = await api.post('/register', payload);

    if (response.data?.token) {
        setToken(response.data.token);
    }

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/user');

    return response.data;
};

export const logout = async () => {
    try {
        await api.post('/logout');
    } finally {
        clearToken();
    }
};
