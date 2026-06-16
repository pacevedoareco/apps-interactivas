import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
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
import MisPedidosPage from "./pages/MisPedidosPage";
import MisProductosPage from "./pages/MisProductosPage";
import PerfilPage from "./pages/PerfilPage";
import AdminPage from "./pages/AdminPage";
import MiProductoGestionPage from "./pages/MiProductoGestionPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/productos/:id" element={<ProductDetailPage />} />
          <Route
            path="/carrito"
            element={
              <ProtectedRoute>
                <CarritoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-pedidos"
            element={
              <ProtectedRoute>
                <MisPedidosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-productos"
            element={
              <ProtectedRoute>
                <MisProductosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <PerfilPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-productos/nuevo"
            element={
              <ProtectedRoute>
                <MiProductoGestionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-productos/:id"
            element={
              <ProtectedRoute>
                <MiProductoGestionPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <MarcasCarousel />
        <Footer />
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
