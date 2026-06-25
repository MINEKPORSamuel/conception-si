import api from './api';

export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

export const getProduct = async (slug) => {
    const response = await api.get(`/products/${slug}`);
    return response.data;
};
