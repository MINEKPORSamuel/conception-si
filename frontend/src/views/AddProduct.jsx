import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../services/management';
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

const initialForm = {
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    whatsapp_number: '',
    image_url: '',
    image: null,
};

export default function AddProduct() {
    const [form, setForm] = useState(initialForm);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Fermer le dropdown si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
            await createProduct({
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock),
            });
            navigate('/vendeur');
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue lors de la création du produit.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-shell">
            <header className="topbar">
                <div className="brand-lockup">
                    <span className="brand-mark">➕</span>
                    <div>
                        <h1>Nouveau Produit</h1>
                        <p>Ajoutez un article au catalogue</p>
                    </div>
                </div>
                <div className="topbar-actions">
                    <Link to="/vendeur" className="pill-link">Retour Dashboard</Link>
                </div>
            </header>

            <main className="page-main">
                <div className="login-card" style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
                    <h2>Informations du produit</h2>
                    <p className="login-subtitle">Remplissez les détails pour mettre votre article en ligne.</p>

                    {error && <div className="error-alert"><span>⚠️</span> {error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="feature-grid">
                            <div className="form-group">
                                <label htmlFor="name">Nom du produit</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Ex: Panier de légumes frais"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                />
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
                                                <div
                                                    key={cat}
                                                    className={`custom-select-option ${form.category === cat ? 'selected' : ''}`}
                                                    onClick={() => selectCategory(cat)}
                                                >
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
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Décrivez votre produit en quelques phrases..."
                                value={form.description}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="feature-grid">
                            <div className="form-group">
                                <label htmlFor="price">Prix (FCFA)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    step="1"
                                    placeholder="0"
                                    value={form.price}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="stock">Stock disponible</label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    placeholder="Ex: 10"
                                    value={form.stock}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="whatsapp_number">Numéro WhatsApp de contact</label>
                            <input
                                type="text"
                                id="whatsapp_number"
                                name="whatsapp_number"
                                placeholder="+22890000000"
                                value={form.whatsapp_number}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group">
                            <label>Photo du produit</label>
                            <div className="upload-container" style={{
                                border: '2px dashed var(--border)',
                                borderRadius: '16px',
                                padding: '20px',
                                textAlign: 'center',
                                background: 'var(--surface-soft)'
                            }}>
                                {imagePreview ? (
                                    <div style={{ marginBottom: '15px' }}>
                                        <img src={imagePreview} alt="Preview" style={{ maxHeight: '200px', borderRadius: '12px', margin: '0 auto' }} />
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📸</div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="secondary-btn" style={{ cursor: 'pointer' }}>
                                    {imagePreview ? 'Changer la photo' : 'Choisir une photo'}
                                </label>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginTop: '10px' }}>
                                    Formats acceptés : JPG, PNG. Taille max : 5Mo.
                                </p>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Publication en cours...' : 'Publier le produit'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
