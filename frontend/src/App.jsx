import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { cargarCarrito, resetearCarrito } from "./store/slices/carritoSlice";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import MarcasCarousel from "./components/MarcasCarousel";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CarritoPage from "./pages/CarritoPage";
import FavoritosPage from "./pages/FavoritosPage";
import MisPedidosPage from "./pages/MisPedidosPage";
import MisProductosPage from "./pages/MisProductosPage";
import PerfilPage from "./pages/PerfilPage";
import AdminPage from "./pages/AdminPage";
import MiProductoGestionPage from "./pages/MiProductoGestionPage";

function AppContent() {
  const dispatch = useDispatch();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      dispatch(cargarCarrito());
      return;
    }

    dispatch(resetearCarrito());
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/productos/:id" element={<ProductDetailPage />} />
        <Route
          path="/carrito"
          element={(
            <ProtectedRoute>
              <CarritoPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/mis-favoritos"
          element={(
            <ProtectedRoute>
              <FavoritosPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/mis-pedidos"
          element={(
            <ProtectedRoute>
              <MisPedidosPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/mis-productos"
          element={(
            <ProtectedRoute>
              <MisProductosPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/perfil"
          element={(
            <ProtectedRoute>
              <PerfilPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin"
          element={(
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/mis-productos/nuevo"
          element={(
            <ProtectedRoute>
              <MiProductoGestionPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/mis-productos/:id"
          element={(
            <ProtectedRoute>
              <MiProductoGestionPage />
            </ProtectedRoute>
          )}
        />
      </Routes>
      <MarcasCarousel />
      <Footer />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
