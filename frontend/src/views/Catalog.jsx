import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getProducts } from '../services/products';
import { buildWhatsAppUrl } from '../services/whatsapp';
import { resolveLandingPath, isAdmin, isVendor } from '../utils/access';

const fallbackProductImage =
    'https://images.unsplash.com/photo-1550989460-0ad0f5227f45?auto=format&fit=crop&w=1200&q=80';

export default function Catalog() {
    const { user, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const initialQuery = params.get('search') || '';
        const initialCategory = params.get('category') || 'all';
        setQuery(initialQuery);
        setSearchInput(initialQuery);
        setActiveCategory(initialCategory);
    }, [location.search]);

    useEffect(() => {
        let mounted = true;

        const loadProducts = async () => {
            try {
                const data = await getProducts();
                if (mounted) {
                    setProducts(data);
                }
            } catch {
                if (mounted) {
                    setError('Impossible de charger le catalogue pour le moment.');
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

    // Catégories dynamiques extraites des produits
    const categories = useMemo(() => {
        const seen = new Set();
        const cats = [];
        for (const p of products) {
            const cat = p.category || null;
            if (cat && !seen.has(cat)) {
                seen.add(cat);
                cats.push(cat);
            }
        }
        return cats.sort((a, b) => a.localeCompare(b, 'fr'));
    }, [products]);

    // Fonction pour supprimer les accents et mettre en minuscule
    const normalize = (str) => {
        return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
    };

    // Calcul de la distance entre deux mots (Levenshtein) pour tolérer les fautes
    const getLevenshteinDistance = (a, b) => {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
                else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
        return matrix[b.length][a.length];
    };

    // Algorithme de recherche équilibré (Précis mais tolérant aux fautes)
    const isSmartMatch = (query, target) => {
        const q = normalize(query);
        const t = normalize(target);
        if (!q) return true;

        const queryWords = q.split(/\s+/).filter(w => w.length > 0);
        const targetWords = t.split(/[\s,.-]+/).filter(w => w.length > 0);

        // CHAQUE mot de la recherche doit être trouvé (exactement ou approximativement)
        return queryWords.every(qWord => {
            // 1. Test de correspondance exacte ou inclusion (ex: "tel" dans "telephone")
            if (t.includes(qWord)) return true;

            // 2. Test de tolérance aux fautes (si le mot est assez long)
            if (qWord.length >= 4) {
                const threshold = qWord.length >= 7 ? 2 : 1; // 1 erreur permise, ou 2 pour les longs mots
                return targetWords.some(tWord => getLevenshteinDistance(qWord, tWord) <= threshold);
            }

            return false;
        });
    };

    const filteredProducts = useMemo(() => {
        const query = searchInput.trim();
        const sorted = [...products].sort((a, b) => b.id - a.id);

        if (!query && activeCategory === 'all') return sorted;

        return sorted.filter((product) => {
            const categoryMatch = activeCategory === 'all' ||
                                 (activeCategory === 'uncategorized' ? !product.category : product.category === activeCategory);

            if (!categoryMatch) return false;
            if (!query) return true;

            const searchableText = `${product.name} ${product.category || ""} ${product.description || ""}`;
            return isSmartMatch(query, searchableText);
        });
    }, [activeCategory, products, searchInput]);

    const countForCategory = (cat) => {
        if (cat === 'all') return products.length;
        if (cat === 'uncategorized') return products.filter((p) => !p.category).length;
        return products.filter((p) => p.category === cat).length;
    };

    const clearSearch = () => {
        setSearchInput('');
    };

    const handleLogout = async () => {
        await logout();
        window.location.reload();
    };

    const uncategorizedCount = products.filter((p) => !p.category).length;

    return (
        <div className="page-shell">
            <header className="topbar">
                <div className="brand-lockup">
                    <span className="brand-mark">🛍️</span>
                    <div>
                        <h1>E-Commerce Suite</h1>
                        <p>Catalogue public et recherche rapide</p>
                    </div>
                </div>

                <form className="topbar-search" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="search"
                        placeholder="Filtrer les produits..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    {searchInput && (
                        <button
                            type="button"
                            className="search-clear-btn"
                            onClick={clearSearch}
                            aria-label="Effacer"
                        >
                            ✕
                        </button>
                    )}
                    <button type="button" className="search-submit-btn" aria-label="Rechercher">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </form>

                <div className="topbar-actions">
                    <Link to="/" className="pill-link">
                        Accueil
                    </Link>
                    {user ? (
                        <>
                            {isAdmin(user) && <Link to="/administration" className="pill-link">Administration</Link>}
                            {isVendor(user) && <Link to="/vendeur" className="pill-link">Mon Espace Vendeur</Link>}
                            <button onClick={handleLogout} className="ghost-link">Déconnexion</button>
                        </>
                    ) : (
                        <Link to="/login" className="pill-link">Connexion</Link>
                    )}
                </div>
            </header>

            <main className="page-main">
                <section className="section-card">
                    <div className="section-toolbar">
                        <div>
                            <span className="section-kicker">Catalogue</span>
                            <h2>Découvrez nos produits</h2>
                            <p className="section-note">
                                Filtrez par catégorie, recherchez un article et consultez sa fiche détaillée.
                            </p>
                        </div>
                        <span className="section-note">{filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} affiché{filteredProducts.length !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Pills de catégories dynamiques */}
                    {!loading && (
                        <div className="catalog-category-strip">
                            {/* Bouton "Tous" */}
                            <button
                                type="button"
                                className={`cat-filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveCategory('all')}
                            >
                                <span>Tous</span>
                                <strong>{products.length}</strong>
                            </button>

                            {/* Une pill par catégorie réelle */}
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`cat-filter-pill ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    <span>{cat}</span>
                                    <strong>{countForCategory(cat)}</strong>
                                </button>
                            ))}

                            {/* Pill "Sans catégorie" si nécessaire */}
                            {uncategorizedCount > 0 && (
                                <button
                                    type="button"
                                    className={`cat-filter-pill ${activeCategory === 'uncategorized' ? 'active' : ''}`}
                                    onClick={() => setActiveCategory('uncategorized')}
                                >
                                    <span>Sans catégorie</span>
                                    <strong>{uncategorizedCount}</strong>
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {loading && (
                    <div className="loader-container">
                        <div className="spinner" />
                        <p>Chargement du catalogue...</p>
                    </div>
                )}

                {error && <div className="error-alert">{error}</div>}

                {!loading && !error && filteredProducts.length === 0 && (
                    <div className="section-card">
                        <h2>Aucun résultat</h2>
                        <p>
                            Aucun produit ne correspond à votre recherche ou à cette catégorie. Essayez un autre mot-clé ou sélectionnez une autre catégorie.
                        </p>
                        <button type="button" className="hero-secondary-btn" onClick={() => {
                            setActiveCategory('all');
                            clearSearch();
                        }}>
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}

                {!loading && !error && filteredProducts.length > 0 && (
                    <section className="compact-grid">
                        {filteredProducts.map((product) => (
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
                                                onClick={() => setActiveCategory(product.category)}
                                                title={`Filtrer par ${product.category}`}
                                            >
                                                {product.category}
                                            </button>
                                        )}
                                        <p className="product-description">{product.description}</p>
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
