import { Link } from "react-router-dom";

function ProductCard({ producto }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", margin: "12px", borderRadius: "8px" }}>
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>
      <p><strong>Marca:</strong> {producto.marca}</p>
      <p><strong>Precio:</strong> ${producto.precio}</p>
      <p><strong>Stock:</strong> {producto.stock}</p>

      {producto.stock > 0 ? (
        <p>Disponible</p>
      ) : (
        <p>Sin stock</p>
      )}

      <Link to={`/productos/${producto.idProducto}`}>
        Ver detalle
      </Link>
    </div>
  );
}

export default ProductCard;