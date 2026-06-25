import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { resolveLandingPath } from '../utils/access';

const initialForm = {
    name: '',
    email: '',
    password: '',
    role: 'Client',
};

export default function Register() {
    const { register, user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            navigate(location.state?.from?.pathname || resolveLandingPath(user), { replace: true });
        }
    }, [loading, navigate, location.state, user]);

    const handleChange = (field) => (event) => {
        setForm((current) => ({ ...current, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await register(form);

        if (result.success) {
            navigate(location.state?.from?.pathname || resolveLandingPath(result.user), { replace: true });
        } else {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Créer un compte</h2>
                <p className="login-subtitle">
                    Créez un compte pour accéder à votre espace personnel ou publier des produits si vous choisissez le profil vendeur.
                </p>

                {error && (
                    <div className="error-alert">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="name">Nom complet</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Votre nom"
                            value={form.name}
                            onChange={handleChange('name')}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Adresse Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="exemple@domaine.com"
                            value={form.email}
                            onChange={handleChange('email')}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Profil</label>
                        <select
                            id="role"
                            value={form.role}
                            onChange={handleChange('role')}
                            disabled={isSubmitting}
                        >
                            <option value="Client">Client</option>
                            <option value="Vendeur">Vendeur</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Au moins 8 caractères"
                            value={form.password}
                            onChange={handleChange('password')}
                            required
                            minLength={8}
                            disabled={isSubmitting}
                        />
                    </div>

                    <button type="submit" className={`submit-btn ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
                        {isSubmitting ? 'Création en cours...' : 'Créer le compte'}
                    </button>
                </form>

                <div className="login-footer">
                    <button type="button" className="text-link-btn" onClick={() => navigate('/login')}>
                        J’ai déjà un compte
                    </button>
                    <button type="button" className="text-link-btn" onClick={() => navigate('/')}>
                        Retour au site
                    </button>
                </div>
            </div>
        </div>
    );
}
