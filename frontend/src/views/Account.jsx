import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { isAdmin, isApprovedVendor, isPendingVendor } from '../utils/access';

export default function Account() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const vendorIsPending = isPendingVendor(user);
    const vendorIsApproved = isApprovedVendor(user);

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

                {vendorIsPending && (
                    <div className="error-alert">
                        Votre compte vendeur est en attente de validation par l’administrateur. Vous pouvez continuer à utiliser
                        votre compte, mais l’espace vendeur restera verrouillé jusqu’à approbation.
                    </div>
                )}

                <section className="compact-grid">
                    <article className="feature-card soft">
                        <div className="card-icon">🧾</div>
                        <h3>Mon compte</h3>
                        <p>Consultez vos informations de profil et votre statut d’accès.</p>
                    </article>
                    <article className="feature-card soft">
                        <div className="card-icon">📦</div>
                        <h3>Mes produits</h3>
                        <p>Créez et suivez vos produits selon votre rôle utilisateur.</p>
                    </article>
                    <article className="feature-card soft">
                        <div className="card-icon">🔎</div>
                        <h3>Catalogue</h3>
                        <p>Accédez au catalogue public et parcourez les articles visibles.</p>
                    </article>
                    <article className="feature-card soft">
                        <div className="card-icon">💬</div>
                        <h3>Statut vendeur</h3>
                        <p>Vérifiez si votre accès vendeur est approuvé, en attente ou refusé.</p>
                    </article>
                </section>

                <section className="section-card">
                    <span className="section-kicker">Session active</span>
                    <h2>{user?.name || user?.email || 'Compte connecté'}</h2>
                    <p>
                        Votre session est active. Vous pouvez naviguer sur le site et ouvrir les espaces auxquels vous avez droit.
                    </p>
                    <div className="card-actions" style={{ marginTop: '18px' }}>
                        {vendorIsApproved || isAdmin(user) ? (
                            <Link to="/vendeur" className="hero-secondary-btn">
                                Aller à l’espace vendeur
                            </Link>
                        ) : null}
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
