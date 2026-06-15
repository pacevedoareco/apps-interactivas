import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import { obtenerCategorias } from "../services/categoriaService";
import { obtenerProductos } from "../services/productoService";
import "../styles/ProductListPage.css";

const FILTROS_INICIALES = {
  busqueda: "",
  categoria: "todas",
  estado: "todos",
  stock: "todos",
  orden: "recientes",
};
const PRODUCTOS_POR_BLOQUE = 6;

function normalizarTexto(texto) {
  return (texto ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cantidadVisible, setCantidadVisible] = useState(PRODUCTOS_POR_BLOQUE);
  const [filtros, setFiltros] = useState({
    busqueda: searchParams.get("q") ?? FILTROS_INICIALES.busqueda,
    categoria: searchParams.get("categoria") ?? FILTROS_INICIALES.categoria,
    estado: searchParams.get("estado") ?? FILTROS_INICIALES.estado,
    stock: searchParams.get("stock") ?? FILTROS_INICIALES.stock,
    orden: searchParams.get("orden") ?? FILTROS_INICIALES.orden,
  });

  useEffect(() => {
    const cargarCatalogo = async () => {
      try {
        const [productosData, categoriasData] = await Promise.all([
          obtenerProductos(),
          obtenerCategorias(),
        ]);

        setProductos(productosData);
        setCategorias(categoriasData);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    cargarCatalogo();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filtros.busqueda.trim()) {
      params.set("q", filtros.busqueda.trim());
    }
    if (filtros.categoria !== FILTROS_INICIALES.categoria) {
      params.set("categoria", filtros.categoria);
    }
    if (filtros.estado !== FILTROS_INICIALES.estado) {
      params.set("estado", filtros.estado);
    }
    if (filtros.stock !== FILTROS_INICIALES.stock) {
      params.set("stock", filtros.stock);
    }
    if (filtros.orden !== FILTROS_INICIALES.orden) {
      params.set("orden", filtros.orden);
    }

    setSearchParams(params, { replace: true });
  }, [filtros, setSearchParams]);

  useEffect(() => {
    setCantidadVisible(PRODUCTOS_POR_BLOQUE);
  }, [filtros]);

  const handleFiltroChange = (event) => {
    const { name, value } = event.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const quitarFiltro = (clave) => {
    setFiltros((prev) => ({
      ...prev,
      [clave]: FILTROS_INICIALES[clave],
    }));
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
  };

  const hayFiltrosActivos = Object.entries(filtros).some(([clave, valor]) => {
    if (clave === "busqueda") {
      return valor.trim() !== "";
    }

    return valor !== FILTROS_INICIALES[clave];
  });

  const terminoBusqueda = normalizarTexto(filtros.busqueda);

  const etiquetasFiltros = {
    busqueda: `Busqueda: ${filtros.busqueda.trim()}`,
    categoria: `Categoria: ${filtros.categoria}`,
    estado: `Estado: ${filtros.estado === "EDICION_LIMITADA" ? "Edicion limitada" : normalizarTexto(filtros.estado) === "nuevo" ? "Nuevo" : "Usado"}`,
    stock: filtros.stock === "disponibles" ? "Solo con stock" : "Solo sin stock",
    orden: {
      recientes: "Mas recientes",
      "precio-asc": "Precio ascendente",
      "precio-desc": "Precio descendente",
      "nombre-asc": "Nombre A-Z",
      "nombre-desc": "Nombre Z-A",
    }[filtros.orden],
  };

  const filtrosActivos = [
    filtros.busqueda.trim() ? { clave: "busqueda", label: etiquetasFiltros.busqueda } : null,
    filtros.categoria !== FILTROS_INICIALES.categoria ? { clave: "categoria", label: etiquetasFiltros.categoria } : null,
    filtros.estado !== FILTROS_INICIALES.estado ? { clave: "estado", label: etiquetasFiltros.estado } : null,
    filtros.stock !== FILTROS_INICIALES.stock ? { clave: "stock", label: etiquetasFiltros.stock } : null,
    filtros.orden !== FILTROS_INICIALES.orden ? { clave: "orden", label: etiquetasFiltros.orden } : null,
  ].filter(Boolean);

  const productosFiltrados = productos
    .filter((producto) => {
      if (!terminoBusqueda) {
        return true;
      }

      const textoProducto = normalizarTexto(
        [
          producto.nombre,
          producto.marca,
          producto.descripcion,
          ...(producto.categorias ?? []),
        ].join(" ")
      );

      return textoProducto.includes(terminoBusqueda);
    })
    .filter((producto) => {
      if (filtros.categoria === FILTROS_INICIALES.categoria) {
        return true;
      }

      return (producto.categorias ?? []).includes(filtros.categoria);
    })
    .filter((producto) => {
      if (filtros.estado === FILTROS_INICIALES.estado) {
        return true;
      }

      return producto.estadoProducto === filtros.estado;
    })
    .filter((producto) => {
      if (filtros.stock === FILTROS_INICIALES.stock) {
        return true;
      }

      return filtros.stock === "disponibles" ? producto.stock > 0 : producto.stock === 0;
    })
    .sort((productoA, productoB) => {
      switch (filtros.orden) {
        case "precio-asc":
          return productoA.precio - productoB.precio;
        case "precio-desc":
          return productoB.precio - productoA.precio;
        case "nombre-asc":
          return productoA.nombre.localeCompare(productoB.nombre, "es", { sensitivity: "base" });
        case "nombre-desc":
          return productoB.nombre.localeCompare(productoA.nombre, "es", { sensitivity: "base" });
        case "recientes":
        default: {
          const fechaA = productoA.fechaPublicacion ? new Date(productoA.fechaPublicacion).getTime() : 0;
          const fechaB = productoB.fechaPublicacion ? new Date(productoB.fechaPublicacion).getTime() : 0;

          if (fechaA !== fechaB) {
            return fechaB - fechaA;
          }

          return (productoB.idProducto ?? 0) - (productoA.idProducto ?? 0);
        }
      }
    });

  const productosVisibles = productosFiltrados.slice(0, cantidadVisible);
  const hayMasResultados = productosFiltrados.length > productosVisibles.length;
  const cantidadMostrada = productosVisibles.length;

  const mostrarMasProductos = () => {
    setCantidadVisible((prev) => prev + PRODUCTOS_POR_BLOQUE);
  };

  return (
    <div className="product-list">
      <h1 className="product-list__titulo">Coleccion Exclusiva</h1>

      {loading && <Spinner texto="Cargando productos..." />}
      {error && <p className="mensaje-error">{error}</p>}

      {!loading && !error && (
        productos.length === 0 ? (
          <p className="mensaje-vacio">No hay productos disponibles.</p>
        ) : (
          <>
            <section className="product-list__filtros" aria-label="Filtros del catalogo">
              <div className="product-list__campo product-list__campo--busqueda">
                <label htmlFor="busqueda">Buscar</label>
                <input
                  id="busqueda"
                  name="busqueda"
                  type="search"
                  placeholder="Producto, marca o categoria"
                  value={filtros.busqueda}
                  onChange={handleFiltroChange}
                />
              </div>

              <div className="product-list__campo">
                <label htmlFor="categoria">Categoria</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={filtros.categoria}
                  onChange={handleFiltroChange}
                >
                  <option value="todas">Todas</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.idCategoria} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="product-list__campo">
                <label htmlFor="estado">Estado del producto</label>
                <select
                  id="estado"
                  name="estado"
                  value={filtros.estado}
                  onChange={handleFiltroChange}
                >
                  <option value="todos">Todos</option>
                  <option value="NUEVO">Nuevo</option>
                  <option value="USADO">Usado</option>
                  <option value="EDICION_LIMITADA">Edicion limitada</option>
                </select>
              </div>

              <div className="product-list__campo">
                <label htmlFor="stock">Disponibilidad</label>
                <select
                  id="stock"
                  name="stock"
                  value={filtros.stock}
                  onChange={handleFiltroChange}
                >
                  <option value="todos">Todos</option>
                  <option value="disponibles">Con stock</option>
                  <option value="sin-stock">Sin stock</option>
                </select>
              </div>

              <div className="product-list__campo">
                <label htmlFor="orden">Ordenar por</label>
                <select
                  id="orden"
                  name="orden"
                  value={filtros.orden}
                  onChange={handleFiltroChange}
                >
                  <option value="recientes">Mas recientes</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                  <option value="nombre-asc">Nombre: A-Z</option>
                  <option value="nombre-desc">Nombre: Z-A</option>
                </select>
              </div>

              <div className="product-list__acciones">
                <button
                  type="button"
                  className="product-list__limpiar"
                  onClick={limpiarFiltros}
                  disabled={!hayFiltrosActivos}
                >
                  Limpiar filtros
                </button>
              </div>
            </section>

            <div className="product-list__resumen">
              <p>
                Mostrando <strong>{cantidadMostrada}</strong> de <strong>{productosFiltrados.length}</strong> productos
              </p>
              {hayFiltrosActivos && <span>Filtrados sobre {productos.length} productos del catalogo</span>}
            </div>

            {filtrosActivos.length > 0 && (
              <div className="product-list__chips" aria-label="Filtros activos">
                {filtrosActivos.map((filtro) => (
                  <button
                    key={filtro.clave}
                    type="button"
                    className="product-list__chip"
                    onClick={() => quitarFiltro(filtro.clave)}
                  >
                    <span>{filtro.label}</span>
                    <span className="product-list__chip-cerrar" aria-hidden="true">x</span>
                  </button>
                ))}
              </div>
            )}

            {productosFiltrados.length === 0 ? (
              <section className="product-list__sin-resultados">
                <span className="product-list__sin-resultados-eyebrow">Busqueda sin coincidencias</span>
                <h2>No encontramos productos para esos filtros</h2>
                <p>
                  Proba con otra categoria, cambia la busqueda o limpia los filtros para volver a ver todo el catalogo.
                </p>
                <div className="product-list__sin-resultados-acciones">
                  <button
                    type="button"
                    className="product-list__btn-secundario"
                    onClick={limpiarFiltros}
                  >
                    Ver todo el catalogo
                  </button>
                </div>
              </section>
            ) : (
              <>
                <div className="product-list__grid">
                  {productosVisibles.map((producto) => (
                    <ProductCard key={producto.idProducto || producto.id} producto={producto} />
                  ))}
                </div>

                {hayMasResultados && (
                  <div className="product-list__paginacion">
                    <button
                      type="button"
                      className="product-list__btn-secundario"
                      onClick={mostrarMasProductos}
                    >
                      Ver mas productos
                    </button>
                    <p>
                      Quedan {productosFiltrados.length - productosVisibles.length} productos por mostrar
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )
      )}
    </div>
  );
}

export default ProductListPage;
