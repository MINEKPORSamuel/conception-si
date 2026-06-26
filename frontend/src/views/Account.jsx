import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { isAdmin, isVendor } from '../utils/access';

export default function Account() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="page-shell">
            <header className="topbar">
                <div className="brand-lockup">
                    <span className="brand-mark">👤</span>
                    <div>
                        <h1>E-Commerce Suite</h1>
                        <p>Espace personnel et accès</p>
                    </div>
                </div>

                <div className="topbar-actions">
                    <button onClick={() => navigate('/')} className="pill-link">
                        Retour au site
                    </button>
                    <button onClick={handleLogout} className="ghost-link">
                        Déconnexion
                    </button>
                </div>
            </header>

            <main className="page-main">
                <div className="welcome-banner">
                    <h2>Bienvenue dans votre espace</h2>
                    <p>Retrouvez ici les accès liés à votre compte et à votre niveau d’autorisation.</p>
                </div>

                {location.state?.notice && <div className="error-alert">{location.state.notice}</div>}

                <section className="compact-grid">
                    {isAdmin(user) && (
                        <article className="feature-card soft" style={{ cursor: 'pointer' }} onClick={() => navigate('/administration')}>
                            <div className="card-icon">🛡️</div>
                            <h3>Administration</h3>
                            <p>Gérer les utilisateurs et les produits de la plateforme.</p>
                        </article>
                    )}
                    {isVendor(user) && (
                        <>
                        <article className="feature-card soft" style={{ cursor: 'pointer' }} onClick={() => navigate('/vendeur')}>
                            <div className="card-icon">📦</div>
                            <h3>Mes produits</h3>
                            <p>Créez et suivez vos produits dans votre espace vendeur.</p>
                        </article>
                        </>
                    )}
                    <article className="feature-card soft" style={{ cursor: 'pointer' }} onClick={() => navigate('/catalogue')}>
                        <div className="card-icon">🔎</div>
                        <h3>Catalogue</h3>
                        <p>Accédez au catalogue public et parcourez les articles visibles.</p>
                    </article>
                </section>

                <section className="section-card">
                    <span className="section-kicker">Session active</span>
                    <h2>{user?.name || user?.email || 'Compte connecté'}</h2>
                    <p>
                        Votre session est active. Vous pouvez naviguer sur le site et ouvrir les espaces auxquels vous avez droit.
                    </p>
                    <div className="card-actions" style={{ marginTop: '18px' }}>
                        {isVendor(user) && (
                            <Link to="/vendeur" className="hero-secondary-btn">
                                Aller à l’espace vendeur
                            </Link>
                        )}
                        {isAdmin(user) ? (
                            <Link to="/administration" className="submit-btn">
                                Aller à l’administration
                            </Link>
                        ) : null}
                    </div>
                </section>
            </main>
        </div>
    );
}
