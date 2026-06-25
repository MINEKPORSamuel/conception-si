import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getProduct } from '../services/products';
import { buildWhatsAppUrl } from '../services/whatsapp';
import { resolveLandingPath } from '../utils/access';

export default function ProductDetail() {
    const { user } = useAuth();
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const fallbackProductImage =
        'https://images.unsplash.com/photo-1550989460-0ad0f5227f45?auto=format&fit=crop&w=1200&q=80';
    const dashboardPath = resolveLandingPath(user);

    useEffect(() => {
        let mounted = true;

        const loadProduct = async () => {
            try {
                const data = await getProduct(slug);
                if (mounted) {
                    setProduct(data);
                }
            } catch {
                if (mounted) {
                    setError('Produit introuvable ou indisponible.');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadProduct();

        return () => {
            mounted = false;
        };
    }, [slug]);

    return (
        <div className="page-shell">
            <header className="topbar">
                <div className="brand-lockup">
                    <span className="brand-mark">🛍️</span>
                    <div>
                        <h1>E-Commerce Suite</h1>
                        <p>Fiche produit</p>
                    </div>
                </div>

                <div className="topbar-actions">
                    <Link to="/catalogue" className="pill-link">
                        Retour catalogue
                    </Link>
                    <Link to={user ? dashboardPath : '/login'} className="ghost-link">
                        {user ? 'Mon espace' : 'Connexion'}
                    </Link>
                </div>
            </header>

            <main className="page-main">
                {loading && (
                    <div className="loader-container">
                        <div className="spinner" />
                        <p>Chargement du produit...</p>
                    </div>
                )}

                {error && <div className="error-alert">{error}</div>}

                {product && (
                    <section className="product-detail">
                        <div
                            className="product-detail-image"
                            style={{ backgroundImage: `url(${product.image_url || fallbackProductImage})` }}
                        />

                        <article className="product-detail-card">
                            <h2>{product.name}</h2>
                            <p className="product-category">{product.category || 'Catégorie non renseignée'}</p>
                            <p>{product.description}</p>

                            <div className="meta-grid">
                                <div>
                                    <span className="section-kicker">Prix</span>
                                    <strong>{Math.round(product.price).toLocaleString('fr-FR')} FCFA</strong>
                                </div>
                                <div>
                                    <span className="section-kicker">Catégorie</span>
                                    <strong>{product.category || '—'}</strong>
                                </div>
                                <div>
                                    <span className="section-kicker">Stock</span>
                                    <strong>{product.stock}</strong>
                                </div>
                                <div>
                                    <span className="section-kicker">Contact</span>
                                    <strong>WhatsApp</strong>
                                </div>
                                <div>
                                    <span className="section-kicker">Support</span>
                                    <strong>Vendeur</strong>
                                </div>
                            </div>

                            <div className="card-actions">
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
                                <Link to="/catalogue" className="hero-secondary-btn">
                                    Retour au catalogue
                                </Link>
                            </div>
                        </article>
                    </section>
                )}
            </main>
        </div>
    );
}
