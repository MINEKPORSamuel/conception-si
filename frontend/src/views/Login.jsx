import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { resolveLandingPath } from '../utils/access';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && user) {
            navigate(location.state?.from?.pathname || resolveLandingPath(user), { replace: true });
        }
    }, [loading, navigate, location.state, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await login(email, password);
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
                <div className="form-header">
                    <h2>Connexion</h2>
                    <p className="login-subtitle">Connectez-vous pour accéder à votre compte.</p>
                </div>

                {error && (
                    <div className="error-alert">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Adresse Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="exemple@domaine.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>

                <div className="login-footer">
                    <button type="button" className="text-link-btn" onClick={() => navigate('/register')}>
                        Créer un compte
                    </button>
                    <button type="button" className="text-link-btn" onClick={() => navigate('/')}>
                        Retour au site
                    </button>
                </div>
            </div>
        </div>
    );
}
