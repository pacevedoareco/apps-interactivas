import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ProductDetailPage() {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/productos/${id}`);

        if (!response.ok) {
          throw new Error("Error al obtener el detalle del producto");
        }

        const data = await response.json();
        setProducto(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerProducto();
  }, [id]);

  if (loading) {
    return <h2>Cargando detalle del producto...</h2>;
  }

  if (error) {
    return (
      <div>
        <h2>Error: {error}</h2>
        <Link to="/productos">Volver al listado</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>{producto.nombre}</h1>
      <p>{producto.descripcion}</p>
      <p><strong>Marca:</strong> {producto.marca}</p>
      <p><strong>Precio:</strong> ${producto.precio}</p>
      <p><strong>Stock:</strong> {producto.stock}</p>

      <Link to="/productos">Volver al listado</Link>
    </div>
  );
}

export default ProductDetailPage;