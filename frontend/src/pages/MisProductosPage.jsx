import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerMisProductos } from "../services/productoService";
import Spinner from "../components/Spinner";
import "../styles/MiCuentaPages.css";
import "../styles/MisProductosPage.css";

function MisProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await obtenerMisProductos();
        setProductos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  return (
    <div className="mi-cuenta">
      <div className="titulo-pagina">
        <span className="titulo-pagina__eyebrow">Área Personal</span>
        <h1 className="titulo-pagina__texto">Mis Productos</h1>
      </div>

      <Link to="/mis-productos/nuevo" className="mis-productos__nuevo">
        Nueva Publicación
      </Link>

      {loading && <Spinner texto="Cargando tus productos..." />}
      {error && <p className="mi-cuenta__error">{error}</p>}

      {!loading && !error && productos.length === 0 && (
        <p>Todavía no publicaste productos.</p>
      )}

      <div className="mis-productos__lista">
        {productos.map((producto) => (
          <Link
            key={producto.idProducto}
            to={`/mis-productos/${producto.idProducto}`}
            className="mis-productos__fila"
          >
            <div className="mis-productos__imagen">Sin imagen</div>
            <span className="mis-productos__nombre">{producto.nombre}</span>
            <span className="mis-productos__precio">${producto.precio}</span>
            <span className="mis-productos__stock">Stock: {producto.stock}</span>
            <span className="mis-productos__estado">{producto.condicionPublicacion}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MisProductosPage;