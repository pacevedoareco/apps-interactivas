import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const [cuentaAbierta, setCuentaAbierta] = useState(false);
  const { token, isAdmin, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const publishTarget = token
    ? "/mis-productos/nuevo"
    : `/login?redirect=${encodeURIComponent("/mis-productos/nuevo")}`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Link to="/" className="navbar__logo">
          Mercado <span>Exclusivo</span>
        </Link>
      </div>

      <nav className="navbar__links">
        <Link to="/" className="navbar__link">Inicio</Link>
        <Link to="/carrito" className="navbar__link navbar__link--carrito">
          Carrito
          {totalItems > 0 && (
            <span className="navbar__carrito-badge">{totalItems}</span>
          )}
        </Link>
        <Link
          to={publishTarget}
          state={
            token
              ? undefined
              : {
                  from: location.pathname,
                  message: "Inicia sesion para crear una nueva publicacion.",
                }
          }
          className="navbar__link"
        >
          Publicar
        </Link>

        {token && (
          <div
            className="navbar__dropdown"
            onMouseEnter={() => setCuentaAbierta(true)}
            onMouseLeave={() => setCuentaAbierta(false)}
          >
            <span className="navbar__link navbar__link--dropdown">
              Mi Cuenta
              <span className="navbar__arrow">v</span>
            </span>

            {cuentaAbierta && (
              <div className="navbar__dropdown-menu">
                <Link to="/mis-productos" className="navbar__dropdown-item">Mis Productos</Link>
                <Link to="/mis-pedidos" className="navbar__dropdown-item">Mis Pedidos</Link>
                <Link to="/perfil" className="navbar__dropdown-item">Mi Perfil</Link>
                {isAdmin && <Link to="/admin" className="navbar__dropdown-item">Admin</Link>}
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="navbar__auth">
        {token ? (
          <button className="navbar__link navbar__logout" onClick={handleLogout}>
            Cerrar Sesion
          </button>
        ) : (
          <>
            <Link to="/login" className="navbar__link">Iniciar Sesion</Link>
            <Link to="/register" className="navbar__btn">Registrarse</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
