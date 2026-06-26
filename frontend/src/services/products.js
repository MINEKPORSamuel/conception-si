import api from './api';

export const getProducts = async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
};

export const extractProductItems = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return Array.isArray(payload?.data) ? payload.data : [];
};

export const getProduct = async (slug) => {
    const response = await api.get(`/products/${slug}`);
    return response.data;
};
