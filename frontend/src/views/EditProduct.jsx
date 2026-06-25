import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { updateProduct, getManagedProducts } from '../services/management';
import { useAuth } from '../context/useAuth';

const PRODUCT_CATEGORIES = [
    'Électroménager',
    'Informatique & High-Tech',
    'Mode & Vêtements',
    'Maison & Décoration',
    'Bricolage & Jardin',
    'Beauté & Bien-être',
    'Sports & Loisirs',
    'Jouets & Enfants',
    'Auto & Moto',
    'Alimentation & Épicerie',
    'Instruments de musique',
    'Livres & Médias',
    'Services',
    'Autres'
].sort();

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const products = await getManagedProducts();
                const product = products.find(p => p.id === parseInt(id));
                if (product) {
                    setForm({
                        name: product.name,
                        description: product.description,
                        category: product.category || '',
                        price: product.price,
                        stock: product.stock,
                        whatsapp_number: product.whatsapp_number || '',
                        image_url: product.image_url || '',
                        image: null,
                    });
                    setImagePreview(product.image_url);
                } else {
                    setError("Produit introuvable.");
                }
            } catch (err) {
                setError("Erreur lors du chargement du produit.");
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const selectCategory = (cat) => {
        setForm(prev => ({ ...prev, category: cat }));
        setIsDropdownOpen(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await updateProduct(id, {
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock),
            });
            navigate('/vendeur');
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue lors de la mise à jour.");
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="loader-container">
            <div className="spinner" />
            <p>Chargement du produit...</p>
        </div>
    );

    if (!form && error) return (
        <div className="page-shell">
            <div className="error-alert">{error}</div>
            <Link to="/vendeur" className="primary-btn" style={{ marginTop: '20px' }}>Retour au dashboard</Link>
        </div>
    );

    return (
        <div className="page-shell">
            <header className="topbar">
                <div className="brand-lockup">
                    <span className="brand-mark">📝</span>
                    <div>
                        <h1>Modifier Produit</h1>
                        <p>Mettez à jour vos informations</p>
                    </div>
                </div>
                <div className="topbar-actions">
                    <Link to="/vendeur" className="pill-link">Annuler</Link>
                </div>
            </header>

            <main className="page-main">
                <div className="login-card" style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
                    <h2>Édition de l'article</h2>

                    {error && <div className="error-alert"><span>⚠️</span> {error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="feature-grid">
                            <div className="form-group">
                                <label htmlFor="name">Nom du produit</label>
                                <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required disabled={isSubmitting} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">Catégorie</label>
                                <div className="custom-select-container" ref={dropdownRef}>
                                    <div
                                        className={`custom-select-trigger ${isDropdownOpen ? 'open' : ''} ${!form.category ? 'placeholder' : ''}`}
                                        onClick={() => !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span>{form.category || "-- Choisir une catégorie --"}</span>
                                        <span className="arrow">▼</span>
                                    </div>
                                    {isDropdownOpen && (
                                        <div className="custom-select-options">
                                            {PRODUCT_CATEGORIES.map(cat => (
                                                <div key={cat} className={`custom-select-option ${form.category === cat ? 'selected' : ''}`} onClick={() => selectCategory(cat)}>
                                                    {cat}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description détaillée</label>
                            <textarea id="description" name="description" value={form.description} onChange={handleChange} required disabled={isSubmitting} />
                        </div>

                        <div className="feature-grid">
                            <div className="form-group">
                                <label htmlFor="price">Prix (FCFA)</label>
                                <input type="number" id="price" name="price" step="1" value={form.price} onChange={handleChange} required disabled={isSubmitting} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="stock">Stock disponible</label>
                                <input type="number" id="stock" name="stock" value={form.stock} onChange={handleChange} required disabled={isSubmitting} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="whatsapp_number">Numéro WhatsApp</label>
                            <input type="text" id="whatsapp_number" name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} disabled={isSubmitting} />
                        </div>

                        <div className="form-group">
                            <label>Photo du produit</label>
                            <div className="upload-container" style={{ border: '2px dashed var(--border)', borderRadius: '16px', padding: '20px', textAlign: 'center', background: 'var(--surface-soft)' }}>
                                {imagePreview && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <img src={imagePreview} alt="Preview" style={{ maxHeight: '200px', borderRadius: '12px', margin: '0 auto' }} />
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} id="image-upload" />
                                <label htmlFor="image-upload" className="secondary-btn" style={{ cursor: 'pointer' }}>
                                    Changer la photo
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Mise à jour...' : 'Enregistrer les modifications'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
