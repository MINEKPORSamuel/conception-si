import api from './api';

export const getManagedProducts = async () => {
    const response = await api.get('/vendor/products');
    return response.data;
};

export const createProduct = async (payload) => {
    // Si le payload contient un fichier, on utilise FormData
    if (payload.image instanceof File) {
        const formData = new FormData();
        Object.keys(payload).forEach(key => {
            formData.append(key, payload[key]);
        });
        const response = await api.post('/vendor/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    const response = await api.post('/vendor/products', payload);
    return response.data;
};

export const updateProduct = async (productId, payload) => {
    // Si le payload contient un fichier, on utilise FormData et un hack POST pour Laravel
    if (payload.image instanceof File) {
        const formData = new FormData();
        Object.keys(payload).forEach(key => {
            // Laravel ne gère pas bien PATCH avec multipart/form-data
            // On envoie en POST avec un champ _method
            formData.append(key, payload[key]);
        });
        formData.append('_method', 'PATCH');

        const response = await api.post(`/vendor/products/${productId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    const response = await api.patch(`/vendor/products/${productId}`, payload);
    return response.data;
};

export const deleteProduct = async (productId) => {
    const response = await api.delete(`/vendor/products/${productId}`);
    return response.data;
};

export const getUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
};

export const updateVendorStatus = async (userId, vendor_status) => {
    const response = await api.patch(`/admin/users/${userId}/vendor-status`, { vendor_status });
    return response.data;
};

export const updateProductPublication = async (productId, publication_status) => {
    const response = await api.patch(`/admin/products/${productId}/publication`, { publication_status });
    return response.data;
};
