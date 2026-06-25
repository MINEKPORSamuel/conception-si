import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
    deleteProduct,
    getManagedProducts,
    getUsers,
    updateProductPublication,
    updateUserRole,
    updateVendorStatus,
} from '../services/management';

const roleOptions = ['Client', 'Vendeur', 'Admin'];

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [savingUserId, setSavingUserId] = useState(null);
    const [savingProductId, setSavingProductId] = useState(null);
    const [selectedVendorId, setSelectedVendorId] = useState(null);

    const loadData = async () => {
        try {
            setError('');
            const [usersData, productsData] = await Promise.all([getUsers(), getManagedProducts()]);
            setUsers(usersData);
            setProducts(productsData);
        } catch {
            setError('Impossible de charger le tableau de bord administrateur.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const selectedVendor = useMemo(() => {
        if (!selectedVendorId) return null;
        return users.find(u => u.id === selectedVendorId);
    }, [selectedVendorId, users]);

    const vendorProducts = useMemo(() => {
        if (!selectedVendorId) return [];
        return products.filter(p => p.user_id === selectedVendorId);
    }, [products, selectedVendorId]);

    const stats = useMemo(() => {
        const roles = users.reduce((acc, current) => {
            const key = current.role || 'Client';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        return {
            users: users.length,
            admins: roles.Admin || 0,
            vendors: roles.Vendeur || 0,
            pendingVendors: users.filter((current) => current.vendor_status === 'pending').length,
            products: products.length,
            pendingProducts: products.filter((product) => product.publication_status === 'pending').length,
        };
    }, [products.length, users]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleRoleChange = async (userId, role) => {
        setSavingUserId(userId);
        try {
            await updateUserRole(userId, role);
            await loadData();
        } catch (err) {
            setError(err.response?.data?.message || 'Impossible de mettre à jour le rôle.');
        } finally {
            setSavingUserId(null);
        }
    };

    const handleVendorStatusChange = async (userId, vendorStatus) => {
        setSavingUserId(userId);
        try {
            await updateVendorStatus(userId, vendorStatus);
            await loadData();
        } catch (err) {
            setError(err.response?.data?.message || 'Impossible de mettre à jour la validation du vendeur.');
        } finally {
            setSavingUserId(null);
        }
    };

    const handlePublicationChange = async (productId, publicationStatus) => {
        setSavingProductId(productId);
        try {
            await updateProductPublication(productId, publicationStatus);
            await loadData();
        } catch (err) {
            setError(err.response?.data?.message || 'Impossible de mettre à jour la publication.');
        } finally {
            setSavingProductId(null);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible.')) return;

        setSavingProductId(productId);
        try {
            await deleteProduct(productId);
            await loadData();
        } catch (err) {
            setError(err.response?.data?.message || 'Impossible de supprimer le produit.');
        } finally {
            setSavingProductId(null);
        }
    };

    return (
        <div className="page-shell">
            <header className="topbar">
                <div className="brand-lockup">
                    <span className="brand-mark">🛡️</span>
                    <div>
                        <h1>E-Commerce Suite</h1>
                        <p>Gestion des comptes, vendeurs et produits</p>
                    </div>
                </div>

                <div className="topbar-actions">
                    <Link to="/vendeur" className="pill-link">
                        Espace vendeur
                    </Link>
                    <Link to="/compte" className="pill-link">
                        Mon espace
                    </Link>
                    <button onClick={handleLogout} className="ghost-link">
                        Déconnexion
                    </button>
                </div>
            </header>

            <main className="page-main">
                <div className="welcome-banner">
                    <h2>Administration</h2>
                    <p>
                        {user?.name || user?.email} supervise les comptes, valide les vendeurs et modère les produits publiés.
                    </p>
                </div>

                <section className="compact-grid">
                    <article className="feature-card soft">
                        <div className="card-icon">👥</div>
                        <h3>{stats.users}</h3>
                        <p>Comptes</p>
                    </article>
                    <article className="feature-card soft">
                        <div className="card-icon">👑</div>
                        <h3>{stats.admins}</h3>
                        <p>Administrateurs</p>
                    </article>
                    <article className="feature-card soft">
                        <div className="card-icon">🏪</div>
                        <h3>{stats.vendors}</h3>
                        <p>Vendeurs</p>
                    </article>
                    <article className="feature-card soft">
                        <div className="card-icon">⏱️</div>
                        <h3>{stats.pendingVendors}</h3>
                        <p>Vendeurs en attente</p>
                    </article>
                    <article className="feature-card soft">
                        <div className="card-icon">📦</div>
                        <h3>{stats.products}</h3>
                        <p>Produits</p>
                    </article>
                    <article className="feature-card soft">
                        <div className="card-icon">⏳</div>
                        <h3>{stats.pendingProducts}</h3>
                        <p>Produits en attente</p>
                    </article>
                </section>

                {error && <div className="error-alert">{error}</div>}

                {loading ? (
                    <div className="loader-container">
                        <div className="spinner" />
                        <p>Chargement des données...</p>
                    </div>
                ) : (
                    <>
                    <section className="section-card">
                        <div className="section-toolbar">
                            <div>
                                <span className="section-kicker">Comptes</span>
                                <h2>Rôles et permissions</h2>
                                <p className="section-note">
                                    Ajustez le rôle de chaque utilisateur selon son niveau d’accès réel.
                                </p>
                            </div>
                        </div>

                        <div className="compact-grid">
                            {users.map((account) => (
                                <article key={account.id} className="feature-card" style={{ display: 'grid', gap: '12px' }}>
                                    <div className="section-toolbar">
                                        <div>
                                            <h3>{account.name}</h3>
                                            <p className="section-note">{account.email}</p>
                                            <p className="section-note">Statut vendeur: {account.vendor_status || 'aucun'}</p>
                                        </div>
                                    </div>

                                    <div className="card-actions">
                                        {roleOptions.map((role) => (
                                            <button
                                                key={role}
                                                type="button"
                                                className={account.role === role ? 'submit-btn' : 'hero-secondary-btn'}
                                                onClick={() => handleRoleChange(account.id, role)}
                                                disabled={savingUserId === account.id}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="section-card">
                        <div className="section-toolbar">
                            <div>
                                <span className="section-kicker">Vendeurs</span>
                                <h2>Liste des vendeurs</h2>
                                <p className="section-note">
                                    Cliquez sur un vendeur pour voir ses informations et gérer ses produits.
                                </p>
                            </div>
                        </div>

                        <div className="compact-grid">
                            {users
                                .filter((account) => account.role === 'Vendeur' || account.vendor_status)
                                .map((account) => (
                                    <article
                                        key={`vendor-${account.id}`}
                                        className={`feature-card ${selectedVendorId === account.id ? 'active-vendor' : 'soft'}`}
                                        style={{ display: 'grid', gap: '12px', cursor: 'pointer', border: selectedVendorId === account.id ? '2px solid var(--brand)' : '' }}
                                        onClick={() => setSelectedVendorId(selectedVendorId === account.id ? null : account.id)}
                                    >
                                        <div className="section-toolbar">
                                            <div>
                                                <h3>{account.name}</h3>
                                                <p className="section-note">{account.email}</p>
                                                <span className={`product-category ${account.vendor_status === 'approved' ? '' : 'warning'}`} style={{
                                                    background: account.vendor_status === 'approved' ? '#e6f2eb' : account.vendor_status === 'rejected' ? '#fcefe9' : '#fff4e5',
                                                    color: account.vendor_status === 'approved' ? '#0f5b44' : account.vendor_status === 'rejected' ? '#b04a3d' : '#a76b00',
                                                }}>
                                                    {account.vendor_status || 'aucun'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                type="button"
                                                className={account.vendor_status === 'approved' ? 'submit-btn' : 'hero-secondary-btn'}
                                                onClick={() => handleVendorStatusChange(account.id, 'approved')}
                                                disabled={savingUserId === account.id}
                                            >
                                                Valider
                                            </button>
                                            <button
                                                type="button"
                                                className={account.vendor_status === 'rejected' ? 'submit-btn' : 'hero-secondary-btn'}
                                                onClick={() => handleVendorStatusChange(account.id, 'rejected')}
                                                disabled={savingUserId === account.id}
                                            >
                                                Refuser
                                            </button>
                                        </div>
                                    </article>
                                ))}
                        </div>
                    </section>

                    {selectedVendor && (
                        <section className="section-card" style={{ border: '2px solid var(--brand)', animation: 'slideDownFade 0.3s ease' }}>
                            <div className="section-toolbar">
                                <div>
                                    <span className="section-kicker">Détails Vendeur</span>
                                    <h2>Produits de {selectedVendor.name}</h2>
                                    <p className="section-note">
                                        Gestion directe des articles publiés par ce vendeur.
                                    </p>
                                </div>
                                <button className="ghost-link" style={{ color: 'var(--text)' }} onClick={() => setSelectedVendorId(null)}>Fermer</button>
                            </div>

                            <div className="compact-grid" style={{ marginTop: '20px' }}>
                                {vendorProducts.length === 0 ? (
                                    <p className="section-note">Ce vendeur n'a aucun produit enregistré.</p>
                                ) : (
                                    vendorProducts.map((product) => (
                                        <article key={product.id} className="feature-card product-card" style={{ padding: '0', overflow: 'hidden' }}>
                                            <div
                                                className="product-image"
                                                style={{ backgroundImage: `url(${product.image_url || 'https://images.unsplash.com/photo-1550989460-0ad0f5227f45?auto=format&fit=crop&w=1200&q=80'})`, height: '100px' }}
                                            />
                                            <div className="product-meta" style={{ padding: '12px' }}>
                                                <h3>{product.name}</h3>
                                                <div className="price-row">
                                                    <strong>{Math.round(product.price).toLocaleString('fr-FR')} FCFA</strong>
                                                    <span>{product.stock} stock</span>
                                                </div>
                                                <div className="card-actions" style={{ marginTop: '10px' }}>
                                                    <button
                                                        type="button"
                                                        className={product.publication_status === 'approved' ? 'submit-btn' : 'hero-secondary-btn'}
                                                        style={{ fontSize: '0.7rem', minHeight: '32px' }}
                                                        onClick={() => handlePublicationChange(product.id, product.publication_status === 'approved' ? 'rejected' : 'approved')}
                                                        disabled={savingProductId === product.id}
                                                    >
                                                        {product.publication_status === 'approved' ? 'Masquer' : 'Publier'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="submit-btn"
                                                        style={{ background: '#b04a3d', fontSize: '0.7rem', minHeight: '32px' }}
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        disabled={savingProductId === product.id}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))
                                )}
                            </div>
                        </section>
                    )}

                    <section className="section-card">
                        <div className="section-toolbar">
                            <div>
                                <span className="section-kicker">Publications</span>
                                <h2>Valider ou refuser un produit</h2>
                                <p className="section-note">
                                    Les produits en attente ne sont pas visibles sur le catalogue public.
                                </p>
                            </div>
                        </div>

                        <div className="compact-grid">
                            {products.map((product) => (
                                <article key={product.id} className="feature-card" style={{ display: 'grid', gap: '12px' }}>
                                    <div className="section-toolbar">
                                        <div>
                                            <h3>{product.name}</h3>
                                            <p className="product-category">{product.category || 'Catégorie non renseignée'}</p>
                                            <p className="section-note">{product.description}</p>
                                        </div>
                                        <span className="section-kicker">{product.publication_status || 'pending'}</span>
                                    </div>

                                    <div className="price-row">
                                        <strong>{Math.round(product.price).toLocaleString('fr-FR')} FCFA</strong>
                                        <span>{product.stock} en stock</span>
                                    </div>

                                    <div className="card-actions">
                                        <button
                                            type="button"
                                            className={product.publication_status === 'approved' ? 'submit-btn' : 'hero-secondary-btn'}
                                            onClick={() => handlePublicationChange(product.id, 'approved')}
                                            disabled={savingProductId === product.id}
                                        >
                                            Valider
                                        </button>
                                        <button
                                            type="button"
                                            className={product.publication_status === 'rejected' ? 'submit-btn' : 'hero-secondary-btn'}
                                            onClick={() => handlePublicationChange(product.id, 'rejected')}
                                            disabled={savingProductId === product.id}
                                        >
                                            Refuser
                                        </button>
                                        <button
                                            type="button"
                                            className="hero-secondary-btn"
                                            onClick={() => handlePublicationChange(product.id, 'pending')}
                                            disabled={savingProductId === product.id}
                                        >
                                            En attente
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                    </>
                )}
            </main>
        </div>
    );
}
