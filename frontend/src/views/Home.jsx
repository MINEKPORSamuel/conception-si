import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { extractProductItems, getProducts } from '../services/products';
import { buildWhatsAppUrl } from '../services/whatsapp';
import { resolveLandingPath } from '../utils/access';

const defaultHeroImages = [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=80',
];

const fallbackProductImage =
    'https://images.unsplash.com/photo-1550989460-0ad0f5227f45?auto=format&fit=crop&w=1200&q=80';

export default function Home() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        let mounted = true;

        const loadProducts = async () => {
            try {
                const data = await getProducts({ per_page: 12 });
                if (mounted) {
                    setProducts(extractProductItems(data));
                }
            } catch {
                if (mounted) {
                    setProducts([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            mounted = false;
        };
    }, []);

    const featuredProducts = useMemo(() => {
        return products.slice(0, 5);
    }, [products]);

    // Catégories dynamiques extraites des produits
    const categories = useMemo(() => {
        const seen = new Set();
        const cats = [];
        for (const p of products) {
            if (p.category && !seen.has(p.category)) {
                seen.add(p.category);
                cats.push({ name: p.category, count: 0 });
            }
        }
        for (const c of cats) {
            c.count = products.filter((p) => p.category === c.name).length;
        }
        return cats.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    }, [products]);

    const dashboardPath = resolveLandingPath(user);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const value = search.trim();
        navigate(value ? `/catalogue?search=${encodeURIComponent(value)}` : '/catalogue');
    };

    return (
        <div className="page-shell">
            <header className="topbar">
                <div className="brand-lockup">
                    <span className="brand-mark">🛒</span>
                    <div>
                        <h1>Marché Libre</h1>
                        <p>Une boutique claire, simple et agréable à parcourir</p>
                    </div>
                </div>

                <form className="topbar-search" onSubmit={handleSearchSubmit}>
                    <input
                        type="search"
                        placeholder="Que cherchez-vous ?"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="search-submit-btn" aria-label="Rechercher">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </form>

                <div className="topbar-actions">
                    <button onClick={() => navigate('/catalogue')} className="pill-link">
                        Catalogue
                    </button>
                    {user ? (
                        <>
                            <button onClick={() => navigate(dashboardPath)} className="pill-link">
                                Mon espace
                            </button>
                            <button onClick={handleLogout} className="ghost-link">
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate('/register')} className="pill-link">
                                Créer un compte
                            </button>
                            <button onClick={() => navigate('/login')} className="ghost-link">
                                Connexion
                            </button>
                        </>
                    )}
                </div>
            </header>

            <main className="page-main">
                <section className="hero-panel">
                    <div className="hero-copy">
                        <span className="eyebrow">Boutique ouverte</span>
                        <h2>Parcourez la boutique, comparez les produits et faites votre choix à votre rythme.</h2>
                        <p>
                            La boutique reste ouverte à tous. La création d'un compte n'intervient que pour vendre
                            ou accéder aux espaces personnels.
                        </p>

                        <div className="hero-actions">
                            <button onClick={() => navigate('/catalogue')} className="primary-btn">
                                Voir le catalogue
                            </button>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <article className="showcase-card large">
                            <img src={defaultHeroImages[0]} alt="Produits frais en rayon" />
                        </article>
                        <article className="showcase-card stack">
                            <img src={defaultHeroImages[1]} alt="Assortiment de produits" />
                        </article>
                        <article className="showcase-card stack">
                            <img src={defaultHeroImages[2]} alt="Rayon de produits du quotidien" />
                        </article>
                    </div>
                </section>

                {/* Section catégories dynamiques */}
                {!loading && categories.length > 0 && (
                    <section className="section-card">
                        <div className="section-toolbar">
                            <div>
                                <span className="section-kicker">Catégories</span>
                                <h2>Parcourir par catégorie</h2>
                                <p className="section-note">
                                    Sélectionnez une catégorie pour voir directement les articles correspondants.
                                </p>
                            </div>
                        </div>
                        <div className="catalog-category-strip">
                            <button
                                type="button"
                                className="cat-filter-pill"
                                onClick={() => navigate('/catalogue')}
                            >
                                <span>Tous les produits</span>
                                <strong>{products.length}</strong>
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.name}
                                    type="button"
                                    className="cat-filter-pill"
                                    onClick={() => navigate(`/catalogue?category=${encodeURIComponent(cat.name)}`)}
                                >
                                    <span>{cat.name}</span>
                                    <strong>{cat.count}</strong>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                <section className="section-card">
                    <div className="section-toolbar">
                        <div>
                            <span className="section-kicker">Coups de cœur</span>
                            <h2>Quelques produits à découvrir</h2>
                            <p className="section-note">
                                Une sélection simple et élégante pour entrer dans l'univers de la boutique.
                            </p>
                        </div>
                        <Link to="/catalogue" className="ghost-link">
                            Voir tout le catalogue
                        </Link>
                    </div>
                </section>

                {loading ? (
                    <div className="loader-container">
                        <div className="spinner" />
                        <p>Chargement des produits...</p>
                    </div>
                ) : (
                    <section className="compact-grid">
                        {featuredProducts.map((product) => (
                            <article key={product.id} className="feature-card product-card">
                                <div
                                    className="product-image"
                                    style={{ backgroundImage: `url(${product.image_url || fallbackProductImage})` }}
                                />
                                <div className="product-meta">
                                    <div>
                                        <h3>{product.name}</h3>
                                        {product.category && (
                                            <button
                                                type="button"
                                                className="product-category"
                                                onClick={() => navigate(`/catalogue?category=${encodeURIComponent(product.category)}`)}
                                                title={`Voir tous les produits "${product.category}"`}
                                            >
                                                {product.category}
                                            </button>
                                        )}
                                    </div>
                                    <div className="price-row">
                                        <strong>{Math.round(product.price).toLocaleString('fr-FR')} FCFA</strong>
                                        <span>{product.stock} en stock</span>
                                    </div>
                                    <div className="card-actions">
                                        <Link to={`/produit/${product.slug}`} className="hero-secondary-btn">
                                            Voir le produit
                                        </Link>
                                        {product.whatsapp_number ? (
                                            <a
                                                className="submit-btn"
                                                href={buildWhatsAppUrl(
                                                    product.whatsapp_number,
                                                    `Bonjour, je souhaite des informations sur ${product.name}.`
                                                )}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Contacter le vendeur
                                            </a>
                                        ) : null}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                )}

            </main>
        </div>
    );
}
