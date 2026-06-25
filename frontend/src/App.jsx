import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './views/Home';
import Catalog from './views/Catalog';
import Login from './views/Login';
import Register from './views/Register';
import Account from './views/Account';
import ProductDetail from './views/ProductDetail';
import VendorDashboard from './views/VendorDashboard';
import AddProduct from './views/AddProduct';
import EditProduct from './views/EditProduct';
import AdminDashboard from './views/AdminDashboard';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-root">
                    <div className="site-backdrop" aria-hidden="true" />
                    <div className="app-content">
                        <Routes>
                            {/* Public Route */}
                            <Route path="/" element={<Home />} />
                            <Route path="/catalogue" element={<Catalog />} />
                            <Route path="/produit/:slug" element={<ProductDetail />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected Route */}
                            <Route
                                path="/compte"
                                element={
                                    <ProtectedRoute roles={['Vendeur', 'Admin']}>
                                        <Account />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/vendeur"
                                element={
                                    <ProtectedRoute roles={['Vendeur', 'Admin']}>
                                        <VendorDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/vendeur/ajouter-produit"
                                element={
                                    <ProtectedRoute roles={['Vendeur', 'Admin']}>
                                        <AddProduct />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/vendeur/modifier-produit/:id"
                                element={
                                    <ProtectedRoute roles={['Vendeur', 'Admin']}>
                                        <EditProduct />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/administration"
                                element={
                                    <ProtectedRoute roles={['Admin']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Fallback redirect */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
