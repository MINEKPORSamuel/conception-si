import api from './api';

// Initialiser le cookie CSRF (à faire une fois au chargement de l'application)
export const getCsrfCookie = () => {
    return api.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
};

// Exemple de fonction de connexion
export const login = async (email, password) => {
    await getCsrfCookie(); // Récupère le jeton CSRF
    return api.post('/login', { email, password });
};
