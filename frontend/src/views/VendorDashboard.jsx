import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { createProduct, deleteProduct, getManagedProducts, updateProduct } from '../services/management';

const emptyForm = {
    name: '',
    slug: '',
    description: '',
    category: '',
    price: '',
    image_url: '',
    whatsapp_number: '',
    stock: 0,
    is_active: true,
};

export default function VendorDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const loadProducts = async () => {
        try {
            setError('');
            const data = await getManagedProducts();
            setProducts(data);
        } catch {
            setError('Impossible de charger les produits du vendeur.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const stats = useMemo(() => {
        const active = products.filter((product) => product.is_active).length;
        const stock = products.reduce((total, product) => total + Number(product.stock || 0), 0);
        return { total: products.length, active, stock };
    }, [products]);

    const handleChange = (field) => (event) => {
        const value = field === 'is_active' ? event.target.checked : event.target.value;
        setForm((current) => ({ ...current, [field]: value }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        const payload = {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
        };

        try {
            if (editingId) {
                await updateProduct(editingId, payload);
            } else {
                await createProduct(payload);
            }

            await loadProducts();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Impossible d’enregistrer le produit.');
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (product) => {
        setEditingId(product.id);
        setForm({
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
            category: product.category || '',
            price: product.price ?? '',
            image_url: product.image_url || '',
            whatsapp_number: product.whatsapp_number || '',
            stock: product.stock ?? 0,
            is_active: Boolean(product.is_active),
        });
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Supprimer ce produit ?')) {
            return;
        }

        try {
            await deleteProduct(productId);
            await loadProducts();
        } catch (err) {
            setError(err.response?.data?.message || 'Impossible de supprimer le produit.');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="page-shell">
            <header className="topbar">
                <div className="brand-lockup">
                    <span className="brand-mark">📦</span>
                    <div>
                        <h1>E-Commerce Suite</h1>
                        <p>Gestion des produits</p>
                    </div>
                </div>

                <div className="topbar-actions">
                    <Link to="/catalogue" className="pill-link">
                        Catalogue
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h2>Espace vendeur</h2>
                            <p>{user?.name || user?.email}, gérez votre catalogue de produits ici.</p>
                        </div>
                        <button onClick={() => navigate('/vendeur/ajouter-produit')} className="primary-btn">
                            ➕ Ajouter un produit
                        </button>
                    </div>
                </div>

                <section className="compact-grid">
                    <article className="feature-card soft">
                        <div className="card-icon">📦</div>
                        <h3>{stats.total}</h3>
                        <p>Produits</p>
                    </article>
                    <article className="feature-card soft">
                        <div className="card-icon">✅</div>
                        <h3>{stats.active}</h3>
                        <p>Actifs</p>
                    </article>
                    <article className="feature-card soft">
                        <div className="card-icon">📊</div>
                        <h3>{stats.stock}</h3>
                        <p>Stock total</p>
                    </article>
                </section>

                {loading ? (
                    <div className="loader-container">
                        <div className="spinner" />
                        <p>Chargement des produits...</p>
                    </div>
                ) : (
                    <section className="section-card">
                        <div className="section-toolbar" style={{ marginBottom: '20px' }}>
                            <div>
                                <span className="section-kicker">Gestion</span>
                                <h2>Vos articles en ligne</h2>
                            </div>
                        </div>

                        <div className="compact-grid">
                            {products.length === 0 ? (
                                <p className="section-note">Vous n'avez pas encore de produits. Cliquez sur "Ajouter un produit" pour commencer.</p>
                            ) : (
                                products.map((product) => (
                                    <article key={product.id} className="feature-card product-card">
                                        <div
                                            className="product-image"
                                            style={{
                                                backgroundImage: `url(${product.image_url || 'https://images.unsplash.com/photo-1550989460-0ad0f5227f45?auto=format&fit=crop&w=1200&q=80'})`,
                                                height: '120px'
                                            }}
                                        />
                                        <div className="product-meta">
                                            <div>
                                                <h3>{product.name}</h3>
                                                <p className="product-category">{product.category || 'Sans catégorie'}</p>
                                                <div className="status-badge" style={{
                                                    fontSize: '0.7rem',
                                                    padding: '2px 8px',
                                                    borderRadius: '999px',
                                                    background: product.publication_status === 'approved' ? '#e6f2eb' : '#fff4e5',
                                                    color: product.publication_status === 'approved' ? '#0f5b44' : '#a76b00',
                                                    marginTop: '4px',
                                                    display: 'inline-block'
                                                }}>
                                                    {product.publication_status === 'approved' ? 'En ligne' : 'En attente'}
                                                </div>
                                            </div>

                                            <div className="price-row">
                                                <strong>{Math.round(product.price).toLocaleString('fr-FR')} FCFA</strong>
                                                <span>{product.stock} stock</span>
                                            </div>

                                            <div className="card-actions">
                                                <button
                                                    type="button"
                                                    className="hero-secondary-btn"
                                                    onClick={() => navigate(`/vendeur/modifier-produit/${product.id}`)}
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    type="button"
                                                    className="submit-btn"
                                                    style={{ background: '#b04a3d' }}
                                                    onClick={() => handleDelete(product.id)}
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

            </main>
        </div>
    );
}
