import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/ProductListPage.css";

function ProductListPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/productos");

        if (!response.ok) {
          throw new Error("Error al obtener productos");
        }

        const data = await response.json();
        setProductos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, []);

  if (loading) {
    return <h2>Cargando productos...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  return (
    <div className="product-list">
      <h1 className="product-list__titulo">Listado de Productos</h1>

      {productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div className="product-list__grid">
          {productos.map((producto) => (
            <ProductCard
              key={producto.idProducto || producto.id}
              producto={producto}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductListPage;