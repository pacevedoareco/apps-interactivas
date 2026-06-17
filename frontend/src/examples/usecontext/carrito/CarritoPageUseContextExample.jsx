import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContextLegacy } from "./CartContextLegacy";
import "../../../styles/CarritoPage.css";

function CarritoPageUseContextExample() {
  const { items, totalPrecio, cambiarCantidad, eliminarDelCarrito, vaciarCarrito, checkout } =
    useContext(CartContextLegacy);
  const [esRegalo, setEsRegalo] = useState(false);
  const [cargandoCheckout, setCargandoCheckout] = useState(false);
  const [errorCheckout, setErrorCheckout] = useState("");
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const navigate = useNavigate();

  const handleCambiarCantidad = async (itemId, nuevaCantidad) => {
    try {
      await cambiarCantidad(itemId, nuevaCantidad);
    } catch {
      // example only
    }
  };

  const handleEliminar = async (itemId) => {
    try {
      await eliminarDelCarrito(itemId);
    } catch {
      // example only
    }
  };

  const handleVaciar = async () => {
    try {
      await vaciarCarrito();
      window.scrollTo(0, 0);
    } catch {
      // example only
    }
  };

  const handleCheckout = async () => {
    setCargandoCheckout(true);
    setErrorCheckout("");

    try {
      const pedido = await checkout();
      setPedidoConfirmado(pedido);
    } catch (err) {
      if (err.errores?.length) {
        const lista = err.errores
          .map((e) => `${e.nombreProducto}: pediste ${e.cantidadSolicitada}, quedan ${e.stockDisponible}`)
          .join("; ");
        setErrorCheckout(`Stock insuficiente - ${lista}`);
      } else {
        setErrorCheckout(err.message || "No se pudo completar el pedido.");
      }
    } finally {
      setCargandoCheckout(false);
    }
  };

  if (pedidoConfirmado) {
    return (
      <div className="carrito carrito--confirmado">
        <div className="carrito__confirmacion">
          <span className="carrito__confirmacion-icono">OK</span>
          <h1 className="carrito__confirmacion-titulo">Pedido confirmado</h1>
          <p className="carrito__confirmacion-subtitulo">
            Tu pedido #{pedidoConfirmado.id} fue registrado exitosamente.
          </p>
          {esRegalo && (
            <p className="carrito__confirmacion-regalo">
              Se incluira empaque especial para regalo.
            </p>
          )}
          <div className="carrito__confirmacion-acciones">
            <button
              className="carrito__btn-pagar"
              onClick={() => navigate("/mis-pedidos")}
            >
              Ver mis pedidos
            </button>
            <Link to="/" className="carrito__link-catalogo">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="carrito">
        <div className="titulo-pagina">
          <span className="titulo-pagina__eyebrow">Tu seleccion</span>
          <h1 className="titulo-pagina__texto">Carrito</h1>
        </div>
        <p className="mensaje-vacio">Tu carrito esta vacio.</p>
        <Link to="/" className="carrito__link-catalogo">
          Explorar la coleccion
        </Link>
      </div>
    );
  }

  return (
    <div className="carrito">
      <div className="titulo-pagina">
        <span className="titulo-pagina__eyebrow">Tu seleccion</span>
        <h1 className="titulo-pagina__texto">Carrito</h1>
      </div>

      <div className="carrito__layout">
        <div className="carrito__items">
          {items.map((item) => (
            <div key={item.id} className="carrito__item">
              <div className="carrito__item-info">
                <Link to={`/productos/${item.productoId}`} className="carrito__item-nombre">
                  {item.nombreProducto}
                </Link>
                <p className="carrito__item-precio">
                  ${item.precioUnitario?.toLocaleString("es-AR")} c/u
                </p>
              </div>

              <div className="carrito__item-controles">
                <div className="carrito__cantidad">
                  <button
                    className="carrito__cantidad-btn"
                    onClick={() => handleCambiarCantidad(item.id, item.cantidad - 1)}
                    aria-label="Reducir cantidad"
                  >
                    -
                  </button>
                  <span className="carrito__cantidad-valor">{item.cantidad}</span>
                  <button
                    className="carrito__cantidad-btn"
                    onClick={() => handleCambiarCantidad(item.id, item.cantidad + 1)}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                <p className="carrito__item-subtotal">
                  ${item.subtotal?.toLocaleString("es-AR")}
                </p>

                <button
                  className="carrito__item-eliminar"
                  onClick={() => handleEliminar(item.id)}
                  aria-label={`Eliminar ${item.nombreProducto}`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <div className="carrito__acciones">
            <button className="carrito__btn-vaciar" onClick={handleVaciar}>
              Vaciar carrito
            </button>
            <Link to="/" className="carrito__link-catalogo">
              Seguir comprando
            </Link>
          </div>
        </div>

        <aside className="carrito__resumen">
          <h2 className="carrito__resumen-titulo">Resumen del pedido</h2>

          <div className="carrito__resumen-lineas">
            {items.map((item) => (
              <div key={item.id} className="carrito__resumen-linea">
                <span>
                  {item.nombreProducto} x {item.cantidad}
                </span>
                <span>${item.subtotal?.toLocaleString("es-AR")}</span>
              </div>
            ))}
          </div>

          <div className="carrito__regalo">
            <label className="carrito__regalo-label">
              <input
                type="checkbox"
                checked={esRegalo}
                onChange={(event) => setEsRegalo(event.target.checked)}
                className="carrito__regalo-check"
              />
              <span>Marcar como regalo</span>
            </label>
            {esRegalo && (
              <p className="carrito__regalo-nota">
                El pedido se enviara con empaque especial para regalo.
              </p>
            )}
          </div>

          <div className="carrito__total">
            <span>Total</span>
            <span className="carrito__total-precio">
              ${totalPrecio?.toLocaleString("es-AR")}
            </span>
          </div>

          {errorCheckout && <p className="mensaje-error">{errorCheckout}</p>}

          <button
            className="carrito__btn-pagar"
            onClick={handleCheckout}
            disabled={cargandoCheckout}
          >
            {cargandoCheckout ? "Procesando..." : "Confirmar pedido"}
          </button>
        </aside>
      </div>
    </div>
  );
}

export default CarritoPageUseContextExample;
