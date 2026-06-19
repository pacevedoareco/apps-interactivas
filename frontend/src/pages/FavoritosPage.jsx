import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import { favoritoService } from "../services/favoritoService";
import "../styles/ProductListPage.css";

function FavoritosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const cargarFavoritos = async () => {
    try {
      setLoading(true);
      const data = await favoritoService.obtenerFavoritos();
      setProductos(data);
    } catch (fetchError) {
      setError(fetchError.message || "Error al cargar favoritos");
    } finally {
      setLoading(false);
    }
  };

  const handleFavoritoChange = (productoId, nuevoEstado) => {
    // Si se eliminó de favoritos (nuevoEstado = false), recargar la lista
    if (!nuevoEstado) {
      cargarFavoritos();
    }
  };

  return (
    <div className="product-list">
      <h1 className="product-list__titulo">Mis Favoritos</h1>

      {loading && <Spinner texto="Cargando favoritos..." />}
      {error && <p className="mensaje-error">{error}</p>}

      {!loading && !error && (
        productos.length === 0 ? (
          <section className="product-list__sin-resultados">
            <span className="product-list__sin-resultados-eyebrow">Sin favoritos</span>
            <h2>Aún no tienes productos favoritos</h2>
            <p>
              Explora nuestro catálogo y agrega productos a favoritos haciendo clic en el corazón.
            </p>
            <div className="product-list__sin-resultados-acciones">
              <Link
                to="/"
                className="product-list__btn-secundario"
              >
                Ver catálogo
              </Link>
            </div>
          </section>
        ) : (
          <>
            <div className="product-list__resumen">
              <p>
                Tienes <strong>{productos.length}</strong> {productos.length === 1 ? 'producto favorito' : 'productos favoritos'}
              </p>
            </div>

            <div className="product-list__grid">
              {productos.map((producto) => (
                <ProductCard
                  key={producto.idProducto}
                  producto={producto}
                  onFavoritoChange={handleFavoritoChange}
                />
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
}

export default FavoritosPage;

// Made with Bob
