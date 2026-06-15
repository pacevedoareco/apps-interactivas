import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { obtenerProductoPorId, obtenerProductos } from "../services/productoService";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import productPlaceholder from "../assets/product-placeholder.svg";
import "../styles/ProductDetailPage.css";

const estadoLabel = {
  NUEVO: "Nuevo",
  USADO: "Usado",
  EDICION_LIMITADA: "Edicion Limitada",
};

const MAX_RECOMENDADOS = 4;

function obtenerPublicacionesRelacionadas(productoActual, catalogo) {
  const categoriasActuales = new Set(productoActual.categorias ?? []);

  const candidatos = catalogo
    .filter((item) => item.idProducto !== productoActual.idProducto)
    .map((item) => {
      const coincidenciasCategoria = (item.categorias ?? []).filter((categoria) =>
        categoriasActuales.has(categoria)
      ).length;
      const mismoVendedor = item.vendedorId === productoActual.vendedorId;
      const mismoEstado = item.estadoProducto === productoActual.estadoProducto;
      const conStock = item.stock > 0;

      let puntaje = 0;

      if (mismoVendedor) {
        puntaje += 5;
      }
      puntaje += coincidenciasCategoria * 3;
      if (mismoEstado) {
        puntaje += 1;
      }
      if (conStock) {
        puntaje += 1;
      }

      return {
        ...item,
        coincidenciasCategoria,
        mismoVendedor,
        puntaje,
      };
    })
    .sort((itemA, itemB) => {
      if (itemB.puntaje !== itemA.puntaje) {
        return itemB.puntaje - itemA.puntaje;
      }

      if (itemB.coincidenciasCategoria !== itemA.coincidenciasCategoria) {
        return itemB.coincidenciasCategoria - itemA.coincidenciasCategoria;
      }

      const fechaA = itemA.fechaPublicacion ? new Date(itemA.fechaPublicacion).getTime() : 0;
      const fechaB = itemB.fechaPublicacion ? new Date(itemB.fechaPublicacion).getTime() : 0;

      if (fechaB !== fechaA) {
        return fechaB - fechaA;
      }

      return (itemB.idProducto ?? 0) - (itemA.idProducto ?? 0);
    });

  const relacionados = candidatos.filter((item) => item.puntaje > 0).slice(0, MAX_RECOMENDADOS);

  if (relacionados.length === MAX_RECOMENDADOS) {
    return relacionados;
  }

  const fallback = candidatos.filter(
    (item) => !relacionados.some((relacionado) => relacionado.idProducto === item.idProducto)
  );

  return [...relacionados, ...fallback].slice(0, MAX_RECOMENDADOS);
}

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { agregarAlCarrito } = useContext(CartContext);
  const [producto, setProducto] = useState(null);
  const [vendedor, setVendedor] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");
  const [mensajeCarrito, setMensajeCarrito] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      setProducto(null);
      setVendedor(null);
      setRelacionados([]);
      setCantidad(1);
      setError("");
      window.scrollTo(0, 0);

      try {
        const [dataProducto, catalogo] = await Promise.all([
          obtenerProductoPorId(id),
          obtenerProductos(),
        ]);

        setProducto(dataProducto);
        setRelacionados(obtenerPublicacionesRelacionadas(dataProducto, catalogo));

        const responseVendedor = await fetch(`http://localhost:8080/api/usuarios/${dataProducto.vendedorId}`);
        if (responseVendedor.ok) {
          const dataVendedor = await responseVendedor.json();
          setVendedor(dataVendedor);
        }
      } catch (fetchError) {
        setError(fetchError.message);
      }
    };

    cargarDatos();
  }, [id]);

  const handleCantidadChange = (event) => {
    const valor = Number(event.target.value);
    if (valor >= 1 && valor <= producto.stock) {
      setCantidad(valor);
    }
  };

  const handleAgregarAlCarrito = async () => {
    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent("/productos/" + id)}`, {
        state: { message: "Inicia sesion para agregar productos al carrito." },
      });
      return;
    }
    setMensajeCarrito("");
    try {
      await agregarAlCarrito(producto.idProducto, cantidad);
      setMensajeCarrito("exito");
    } catch {
      setMensajeCarrito("error");
    }
  };

  if (error) {
    return <p className="mensaje-error">{error}</p>;
  }

  if (!producto) {
    return <Spinner texto="Cargando producto..." />;
  }

  return (
    <div className="product-detail">
      <div className="product-detail__header">
        <Link to="/" className="product-detail__volver">← Volver a Coleccion</Link>
      </div>

      <div className="product-detail__contenido">
        <div className="product-detail__imagen">
          <img
            src={producto.imagenUrl || productPlaceholder}
            alt={producto.nombre}
            className="product-detail__imagen-img"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = productPlaceholder;
            }}
          />
          <span className="product-detail__estado">{estadoLabel[producto.estadoProducto]}</span>
        </div>

        <div className="product-detail__info">
          <p className="product-detail__marca">{producto.marca}</p>
          <h1 className="product-detail__nombre">{producto.nombre}</h1>
          <p className="product-detail__precio">${producto.precio}</p>

          <p className="product-detail__descripcion">{producto.descripcion}</p>

          <div className="product-detail__meta">
            <p><strong>Categorias:</strong> {producto.categorias.join(", ")}</p>
            {vendedor && <p><strong>Vendido por:</strong> {vendedor.nombre} {vendedor.apellido}</p>}
          </div>

          {producto.stock > 0 ? (
            <div className="product-detail__compra">
              <div className="product-detail__cantidad">
                <label htmlFor="cantidad">Cantidad</label>
                <input
                  id="cantidad"
                  type="number"
                  min="1"
                  max={producto.stock}
                  value={cantidad}
                  onChange={handleCantidadChange}
                />
                <span className="product-detail__stock">{producto.stock} disponibles</span>
              </div>

              {mensajeCarrito === "exito" && (
                <p className="mensaje-exito">Producto agregado al carrito.</p>
              )}
              {mensajeCarrito === "error" && (
                <p className="mensaje-error">No se pudo agregar al carrito.</p>
              )}
              <button className="product-detail__btn" onClick={handleAgregarAlCarrito}>
                {token ? "Agregar al Carrito" : "Iniciar sesion para comprar"}
              </button>
            </div>
          ) : (
            <p className="product-detail__sin-stock">Sin stock disponible</p>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="product-detail__relacionados" aria-label="Otras publicaciones relacionadas">
          <div className="product-detail__relacionados-header">
            <span className="product-detail__relacionados-eyebrow">Segui explorando</span>
            <h2>Otras publicaciones que te pueden interesar</h2>
            <p>
              Te mostramos opciones del mismo vendedor, de categorias parecidas o destacadas del catalogo.
            </p>
          </div>

          <div className="product-detail__relacionados-grid">
            {relacionados.map((item) => (
              <ProductCard key={item.idProducto} producto={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetailPage;
