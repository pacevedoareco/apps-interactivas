import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { obtenerMisProductos } from "../services/productoService";
import Spinner from "../components/Spinner";
import productPlaceholder from "../assets/product-placeholder.svg";
import "../styles/MiCuentaPages.css";
import "../styles/MisProductosPage.css";

function MisProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const successMessage = location.state?.successMessage || "";

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await obtenerMisProductos();
        setProductos(data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigate(location.pathname, { replace: true, state: {} });
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage, navigate, location.pathname]);

  return (
    <div className="mi-cuenta">
      <div className="titulo-pagina">
        <span className="titulo-pagina__eyebrow">Area Personal</span>
        <h1 className="titulo-pagina__texto">Mis Productos</h1>
      </div>

      <Link to="/mis-productos/nuevo" className="mis-productos__nuevo">
        Nueva Publicacion
      </Link>

      {successMessage && <p className="mensaje-exito">{successMessage}</p>}
      {loading && <Spinner texto="Cargando tus productos..." />}
      {error && <p className="mensaje-error">{error}</p>}

      {!loading && !error && productos.length === 0 && (
        <p className="mensaje-vacio">No tenes productos publicados.</p>
      )}

      <div className="mis-productos__lista">
        {productos.map((producto) => (
          <Link
            key={producto.idProducto}
            to={`/mis-productos/${producto.idProducto}`}
            className="mis-productos__fila"
          >
            <img
              src={producto.imagenUrl || productPlaceholder}
              alt={producto.nombre}
              className="mis-productos__imagen"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = productPlaceholder;
              }}
            />
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
