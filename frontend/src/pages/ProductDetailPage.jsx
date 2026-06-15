import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { obtenerProductoPorId } from "../services/productoService";
import Spinner from "../components/Spinner";
import "../styles/ProductDetailPage.css";

const estadoLabel = {
  NUEVO: "Nuevo",
  USADO: "Usado",
  EDICION_LIMITADA: "Edición Limitada",
};

function ProductDetailPage() {
  const { id } = useParams();

  // producto: datos del producto
  // vendedor: nombre/apellido del vendedor (fetch separado por /api/usuarios/{id})
  // cantidad: cantidad seleccionada para agregar al carrito
  // error: mensaje de error si falla la carga
  const [producto, setProducto] = useState(null);
  const [vendedor, setVendedor] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");

  // Carga el producto y los datos del vendedor
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const dataProducto = await obtenerProductoPorId(id);
        setProducto(dataProducto);

        const responseVendedor = await fetch(`http://localhost:8080/api/usuarios/${dataProducto.vendedorId}`);
        if (responseVendedor.ok) {
          const dataVendedor = await responseVendedor.json();
          setVendedor(dataVendedor);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    cargarDatos();
  }, [id]);

  // Maneja el cambio de cantidad, respetando el límite de stock
  const handleCantidadChange = (e) => {
    const valor = Number(e.target.value);
    if (valor >= 1 && valor <= producto.stock) {
      setCantidad(valor);
    }
  };

  // Agrega el producto al carrito (sin funcionalidad todavía)
  const handleAgregarAlCarrito = () => {
    console.log(`Agregar ${cantidad} x ${producto.nombre} al carrito`);
  };

  if (error) {
    return <p className="mi-cuenta__error">{error}</p>;
  }

  if (!producto) {
    return <Spinner texto="Cargando producto..." />;
  }

  return (
      <div className="product-detail">
        <div className="product-detail__header">
          <Link to="/" className="product-detail__volver">← Volver a Colección</Link>
        </div>

        <div className="product-detail__contenido">
        <div className="product-detail__imagen">
          <span className="product-detail__imagen-placeholder">Sin imagen</span>
          <span className="product-detail__estado">{estadoLabel[producto.estadoProducto]}</span>
        </div>

        <div className="product-detail__info">
          <p className="product-detail__marca">{producto.marca}</p>
          <h1 className="product-detail__nombre">{producto.nombre}</h1>
          <p className="product-detail__precio">${producto.precio}</p>

          <p className="product-detail__descripcion">{producto.descripcion}</p>

          <div className="product-detail__meta">
            <p><strong>Categorías:</strong> {producto.categorias.join(", ")}</p>
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

              <button className="product-detail__btn" onClick={handleAgregarAlCarrito}>
                Agregar al Carrito
              </button>
            </div>
          ) : (
            <p className="product-detail__sin-stock">Sin stock disponible</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;