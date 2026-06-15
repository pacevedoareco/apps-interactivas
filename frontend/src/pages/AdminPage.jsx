import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { obtenerProductosAdmin, obtenerUsuariosAdmin } from "../services/adminService";
import productPlaceholder from "../assets/product-placeholder.svg";
import "../styles/MiCuentaPages.css";
import "../styles/AdminPage.css";

const FILTROS_INICIALES = {
  busqueda: "",
  condicion: "todas",
  stock: "todos",
};

function normalizarTexto(texto) {
  return (texto ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function obtenerNombreCondicion(condicion) {
  const etiquetas = {
    ACTIVA: "Activa",
    PAUSADA: "Pausada",
    ELIMINADA: "Eliminada",
  };

  return etiquetas[condicion] ?? condicion;
}

function AdminPage() {
  const { usuario } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  useEffect(() => {
    const cargarPanel = async () => {
      try {
        const [productosData, usuariosData] = await Promise.all([
          obtenerProductosAdmin(),
          obtenerUsuariosAdmin(),
        ]);

        setProductos(productosData);
        setUsuarios(usuariosData);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    cargarPanel();
  }, []);

  const usuariosPorId = new Map(usuarios.map((item) => [item.id, item]));
  const busquedaNormalizada = normalizarTexto(filtros.busqueda);

  const productosFiltrados = productos.filter((producto) => {
    const vendedor = usuariosPorId.get(producto.vendedorId);
    const nombreVendedor = vendedor
      ? `${vendedor.nombre ?? ""} ${vendedor.apellido ?? ""}`.trim()
      : "Vendedor no disponible";

    const coincideBusqueda = !busquedaNormalizada || normalizarTexto(
      [
        producto.nombre,
        producto.marca,
        producto.descripcion,
        producto.condicionPublicacion,
        ...(producto.categorias ?? []),
        nombreVendedor,
      ].join(" ")
    ).includes(busquedaNormalizada);

    const coincideCondicion = filtros.condicion === "todas"
      || producto.condicionPublicacion === filtros.condicion;

    const coincideStock = filtros.stock === "todos"
      || (filtros.stock === "con-stock" ? producto.stock > 0 : producto.stock === 0);

    return coincideBusqueda && coincideCondicion && coincideStock;
  });

  const resumen = {
    total: productos.length,
    activas: productos.filter((producto) => producto.condicionPublicacion === "ACTIVA").length,
    pausadas: productos.filter((producto) => producto.condicionPublicacion === "PAUSADA").length,
    eliminadas: productos.filter((producto) => producto.condicionPublicacion === "ELIMINADA").length,
    sinStock: productos.filter((producto) => (producto.stock ?? 0) === 0).length,
    usuariosActivos: usuarios.filter((item) => item.activo).length,
    vendedoresConPublicaciones: new Set(productos.map((producto) => producto.vendedorId)).size,
  };

  const hayFiltrosActivos = filtros.busqueda.trim()
    || filtros.condicion !== FILTROS_INICIALES.condicion
    || filtros.stock !== FILTROS_INICIALES.stock;

  const filtrosActivos = [
    filtros.busqueda.trim()
      ? { clave: "busqueda", label: `Busqueda: ${filtros.busqueda.trim()}` }
      : null,
    filtros.condicion !== FILTROS_INICIALES.condicion
      ? { clave: "condicion", label: `Publicacion: ${obtenerNombreCondicion(filtros.condicion)}` }
      : null,
    filtros.stock !== FILTROS_INICIALES.stock
      ? { clave: "stock", label: filtros.stock === "con-stock" ? "Con stock" : "Sin stock" }
      : null,
  ].filter(Boolean);

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

  return (
    <div className="admin-page">
      <div className="titulo-pagina">
        <span className="titulo-pagina__eyebrow">Panel Administrador</span>
        <h1 className="titulo-pagina__texto">Control del marketplace</h1>
      </div>

      <section className="admin-page__intro">
        <p>
          {usuario ? `Hola, ${usuario.nombre}.` : "Vista de administrador."} Desde aca podes monitorear el
          catalogo completo, incluidas publicaciones pausadas o eliminadas.
        </p>
        <p>
          El home publico sigue mostrando solo publicaciones activas. El estado de publicacion ahora se
          controla y revisa en esta seccion.
        </p>
      </section>

      {loading && <Spinner texto="Cargando panel administrador..." />}
      {error && <p className="mensaje-error">{error}</p>}

      {!loading && !error && (
        <>
          <section className="admin-page__metricas" aria-label="Metricas del marketplace">
            <article className="admin-page__metrica">
              <span className="admin-page__metrica-label">Publicaciones activas</span>
              <strong>{resumen.activas}</strong>
              <p>Son las que hoy aparecen en el home publico.</p>
            </article>

            <article className="admin-page__metrica">
              <span className="admin-page__metrica-label">Publicaciones pausadas</span>
              <strong>{resumen.pausadas}</strong>
              <p>Quedaron fuera del catalogo publico pero siguen registradas.</p>
            </article>

            <article className="admin-page__metrica">
              <span className="admin-page__metrica-label">Publicaciones sin stock</span>
              <strong>{resumen.sinStock}</strong>
              <p>Sirve para detectar productos que requieren reposicion.</p>
            </article>

            <article className="admin-page__metrica">
              <span className="admin-page__metrica-label">Usuarios activos</span>
              <strong>{resumen.usuariosActivos}</strong>
              <p>Usuarios habilitados para operar en la plataforma.</p>
            </article>
          </section>

          <section className="admin-page__resumen">
            <div>
              <span>Total de publicaciones</span>
              <strong>{resumen.total}</strong>
            </div>
            <div>
              <span>Eliminadas</span>
              <strong>{resumen.eliminadas}</strong>
            </div>
            <div>
              <span>Vendedores con publicaciones</span>
              <strong>{resumen.vendedoresConPublicaciones}</strong>
            </div>
          </section>

          <section className="admin-page__filtros" aria-label="Filtros del panel">
            <div className="admin-page__campo admin-page__campo--busqueda">
              <label htmlFor="busqueda-admin">Buscar</label>
              <input
                id="busqueda-admin"
                name="busqueda"
                type="search"
                placeholder="Producto, marca, vendedor o categoria"
                value={filtros.busqueda}
                onChange={handleFiltroChange}
              />
            </div>

            <div className="admin-page__campo">
              <label htmlFor="condicion-admin">Estado de publicacion</label>
              <select
                id="condicion-admin"
                name="condicion"
                value={filtros.condicion}
                onChange={handleFiltroChange}
              >
                <option value="todas">Todas</option>
                <option value="ACTIVA">Activas</option>
                <option value="PAUSADA">Pausadas</option>
                <option value="ELIMINADA">Eliminadas</option>
              </select>
            </div>

            <div className="admin-page__campo">
              <label htmlFor="stock-admin">Disponibilidad</label>
              <select
                id="stock-admin"
                name="stock"
                value={filtros.stock}
                onChange={handleFiltroChange}
              >
                <option value="todos">Todos</option>
                <option value="con-stock">Con stock</option>
                <option value="sin-stock">Sin stock</option>
              </select>
            </div>

            <button
              type="button"
              className="admin-page__limpiar"
              onClick={limpiarFiltros}
              disabled={!hayFiltrosActivos}
            >
              Limpiar filtros
            </button>
          </section>

          {filtrosActivos.length > 0 && (
            <div className="admin-page__chips" aria-label="Filtros activos de admin">
              {filtrosActivos.map((filtro) => (
                <button
                  key={filtro.clave}
                  type="button"
                  className="admin-page__chip"
                  onClick={() => quitarFiltro(filtro.clave)}
                >
                  <span>{filtro.label}</span>
                  <span aria-hidden="true">x</span>
                </button>
              ))}
            </div>
          )}

          <div className="admin-page__listado-resumen">
            <p>
              Mostrando <strong>{productosFiltrados.length}</strong> de <strong>{productos.length}</strong> publicaciones
            </p>
          </div>

          {productosFiltrados.length === 0 ? (
            <p className="mensaje-vacio">
              No hay publicaciones que coincidan con los filtros seleccionados.
            </p>
          ) : (
            <section className="admin-page__listado" aria-label="Listado de publicaciones administrables">
              {productosFiltrados.map((producto) => {
                const vendedor = usuariosPorId.get(producto.vendedorId);
                const nombreVendedor = vendedor
                  ? `${vendedor.nombre} ${vendedor.apellido}`
                  : "Vendedor no disponible";

                return (
                  <article key={producto.idProducto} className="admin-page__card">
                    <img
                      className="admin-page__imagen"
                      src={producto.imagenUrl || productPlaceholder}
                      alt={producto.nombre}
                      onError={(event) => {
                        event.currentTarget.src = productPlaceholder;
                      }}
                    />

                    <div className="admin-page__contenido">
                      <div className="admin-page__encabezado">
                        <div>
                          <p className="admin-page__marca">{producto.marca}</p>
                          <h2>{producto.nombre}</h2>
                        </div>
                        <span className={`admin-page__badge admin-page__badge--${normalizarTexto(producto.condicionPublicacion)}`}>
                          {obtenerNombreCondicion(producto.condicionPublicacion)}
                        </span>
                      </div>

                      <p className="admin-page__descripcion">{producto.descripcion}</p>

                      <div className="admin-page__meta">
                        <span><strong>Vendedor:</strong> {nombreVendedor}</span>
                        <span><strong>Precio:</strong> ${producto.precio}</span>
                        <span><strong>Stock:</strong> {producto.stock}</span>
                        <span><strong>Estado del producto:</strong> {producto.estadoProducto?.replaceAll("_", " ")}</span>
                      </div>

                      <div className="admin-page__categorias">
                        {(producto.categorias ?? []).map((categoria) => (
                          <span key={`${producto.idProducto}-${categoria}`}>{categoria}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPage;
