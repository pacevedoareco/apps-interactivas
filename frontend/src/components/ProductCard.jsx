import { Link } from "react-router-dom";
import productPlaceholder from "../assets/product-placeholder.svg";
import "./ProductCard.css";

function ProductCard({ producto }) {
  const estadoLabel = {
    NUEVO: "Nuevo",
    USADO: "Usado",
    EDICION_LIMITADA: "Edicion limitada",
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
