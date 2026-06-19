import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { favoritoService } from "../services/favoritoService";
import productPlaceholder from "../assets/product-placeholder.svg";
import "./ProductCard.css";

function ProductCard({ producto, onFavoritoChange }) {
  const { token } = useContext(AuthContext);
  const [esFavorito, setEsFavorito] = useState(false);
  const [cargandoFavorito, setCargandoFavorito] = useState(false);
  const estadoLabel = {
    NUEVO: "Nuevo",
    USADO: "Usado",
    EDICION_LIMITADA: "Edición limitada",
  };

  useEffect(() => {
    if (token) {
      verificarFavorito();
    }
  }, [token, producto.idProducto]);

  const verificarFavorito = async () => {
    try {
      const resultado = await favoritoService.esFavorito(producto.idProducto);
      setEsFavorito(resultado);
    } catch (error) {
      console.error("Error al verificar favorito:", error);
    }
  };

  const handleToggleFavorito = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (cargandoFavorito) return;
    
    setCargandoFavorito(true);
    try {
      await favoritoService.toggleFavorito(producto.idProducto, esFavorito);
      const nuevoEstado = !esFavorito;
      setEsFavorito(nuevoEstado);
      
      // Notificar al componente padre si existe el callback
      if (onFavoritoChange) {
        onFavoritoChange(producto.idProducto, nuevoEstado);
      }
    } catch (error) {
      console.error("Error al cambiar favorito:", error);
    } finally {
      setCargandoFavorito(false);
    }
  };

  return (
    <Link
      to={`/productos/${producto.idProducto}`}
      className="product-card"
      aria-label={`Ver detalle de ${producto.nombre}`}
    >
      <div className="product-card__imagen">
        <img
          src={producto.imagenUrl || productPlaceholder}
          alt={producto.nombre}
          className="product-card__imagen-img"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = productPlaceholder;
          }}
        />
        {producto.estadoProducto && (
          <span className="product-card__estado">
            {estadoLabel[producto.estadoProducto]}
          </span>
        )}
        {token && (
          <button
            className={`product-card__favorito ${esFavorito ? 'product-card__favorito--activo' : ''}`}
            onClick={handleToggleFavorito}
            disabled={cargandoFavorito}
            aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
            title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={esFavorito ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="product-card__favorito-icon"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        )}
      </div>

      <div className="product-card__body">
        <p className="product-card__marca">{producto.marca}</p>
        <h3 className="product-card__nombre">{producto.nombre}</h3>
        <p className="product-card__descripcion">{producto.descripcion}</p>
      </div>

      <div className="product-card__footer">
        <span className="product-card__precio">${producto.precio}</span>
        {producto.stock > 0 ? (
          <span className="product-card__stock product-card__stock--ok">Disponible</span>
        ) : (
          <span className="product-card__stock product-card__stock--sin">Sin stock</span>
        )}
      </div>

      <span className="product-card__link">
        Ver detalle
      </span>
    </Link>
  );
}

export default ProductCard;
