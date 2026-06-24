import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="logo-section">
                    <span className="logo-icon">🛒</span>
                    <h1>E-Commerce Suite</h1>
                </div>
                <div className="user-profile">
                    {user ? (
                        <>
                            <div className="user-details">
                                <span className="user-name">{user.name || user.email}</span>
                                <span className="user-role">
                                    Role: {user.role || 'Utilisateur'}
                                </span>
                            </div>
                            <button onClick={handleLogout} className="logout-btn">
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <button onClick={() => navigate('/login')} className="login-nav-btn">
                            Connexion
                        </button>
                    )}
                </div>
            </header>

            <main className="home-main">
                <div className="welcome-banner">
                    <h2>Bienvenue sur votre tableau de bord</h2>
                    <p>
                        Votre application E-Commerce est connectée et opérationnelle avec le backend Laravel API.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="card-icon">⚡</div>
                        <h3>Performances Optimes</h3>
                        <p>Propulsé par Vite.js et React pour une interface fluide et instantanée.</p>
                    </div>

                    <div className="feature-card">
                        <div className="card-icon">🔒</div>
                        <h3>Sécurité Robuste</h3>
                        <p>Authentification sécurisée par cookies HTTP-Only et jetons CSRF Laravel Sanctum.</p>
                    </div>

                    <div className="feature-card">
                        <div className="card-icon">🎨</div>
                        <h3>Design Épuré</h3>
                        <p>Interface moderne personnalisée en CSS natif avec animations délicates et mode sombre automatique.</p>
                    </div>
                </div>

                {user && (
                    <section className="user-session-debug">
                        <h3>Session Laravel Active</h3>
                        <pre>{JSON.stringify(user, null, 2)}</pre>
                    </section>
                )}
            </main>
        </div>
    );
}
