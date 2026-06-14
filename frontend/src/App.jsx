import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CarritoPage from "./pages/CarritoPage";
import MisPedidosPage from "./pages/MisPedidosPage";
import MisProductosPage from "./pages/MisProductosPage";
import PerfilPage from "./pages/PerfilPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/productos/:id" element={<ProductDetailPage />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/mis-pedidos" element={<MisPedidosPage />} />
        <Route path="/mis-productos" element={<MisProductosPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;