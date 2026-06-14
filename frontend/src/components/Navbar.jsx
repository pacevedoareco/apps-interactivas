import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [cuentaAbierta, setCuentaAbierta] = useState(false);
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
        <Link to="/carrito" className="navbar__link">Carrito</Link>

        {token && (
          <div
            className="navbar__dropdown"
            onMouseEnter={() => setCuentaAbierta(true)}
            onMouseLeave={() => setCuentaAbierta(false)}
          >
            <span className="navbar__link navbar__link--dropdown">
              Mi Cuenta
              <span className="navbar__arrow">▾</span>
            </span>

            {cuentaAbierta && (
              <div className="navbar__dropdown-menu">
                <Link to="/mis-productos" className="navbar__dropdown-item">Mis Productos</Link>
                <Link to="/mis-pedidos" className="navbar__dropdown-item">Mis Pedidos</Link>
                <Link to="/perfil" className="navbar__dropdown-item">Mi Perfil</Link>
                <Link to="/admin" className="navbar__dropdown-item">Admin</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="navbar__auth">
        {token ? (
            <button className="navbar__link navbar__logout" onClick={handleLogout}>
                Cerrar Sesión
            </button>
        ) : (
          <>
            <Link to="/login" className="navbar__link">Iniciar Sesión</Link>
            <Link to="/register" className="navbar__btn">Registrarse</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;