import { useEffect, useState } from "react";
import { obtenerMisPedidos, cancelarPedido } from "../services/pedidoService";
import Spinner from "../components/Spinner";
import "../styles/MiCuentaPages.css";
import "../styles/MisPedidosPage.css";

const estadoLabel = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const estadoClase = {
  PENDIENTE: "pedido__estado--pendiente",
  CONFIRMADO: "pedido__estado--confirmado",
  ENVIADO: "pedido__estado--enviado",
  ENTREGADO: "pedido__estado--entregado",
  CANCELADO: "pedido__estado--cancelado",
};

function formatFecha(fechaISO) {
  if (!fechaISO) return "—";
  return new Date(fechaISO).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function MisPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [cancelando, setCancelando] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerMisPedidos();
        setPedidos(data.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)));
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const handleCancelar = async (id) => {
    setCancelando(id);
    try {
      const pedidoActualizado = await cancelarPedido(id);
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? pedidoActualizado : p))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelando(null);
    }
  };

  return (
    <div className="mi-cuenta mi-cuenta--pedidos">
      <div className="titulo-pagina">
        <span className="titulo-pagina__eyebrow">Area Personal</span>
        <h1 className="titulo-pagina__texto">Mis Pedidos</h1>
      </div>

      {cargando && <Spinner texto="Cargando pedidos..." />}
      {error && <p className="mensaje-error">{error}</p>}

      {!cargando && !error && pedidos.length === 0 && (
        <p className="mensaje-vacio">No tenes pedidos realizados.</p>
      )}

      {!cargando && pedidos.length > 0 && (
        <div className="pedidos__lista">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="pedido">
              <div className="pedido__encabezado">
                <div className="pedido__meta">
                  <span className="pedido__numero">Pedido #{pedido.id}</span>
                  <span className="pedido__fecha">{formatFecha(pedido.fechaCreacion)}</span>
                </div>
                <span className={`pedido__estado ${estadoClase[pedido.estado] ?? ""}`}>
                  {estadoLabel[pedido.estado] ?? pedido.estado}
                </span>
              </div>

              <div className="pedido__items">
                {pedido.items.map((item) => (
                  <div key={item.id} className="pedido__item">
                    <span className="pedido__item-nombre">{item.nombreProducto}</span>
                    <span className="pedido__item-detalle">
                      {item.cantidad} × ${item.precioUnitario?.toLocaleString("es-AR")}
                    </span>
                    <span className="pedido__item-subtotal">
                      ${item.subtotal?.toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pedido__pie">
                <span className="pedido__total">
                  Total: <strong>${pedido.total?.toLocaleString("es-AR")}</strong>
                </span>
                {pedido.estado !== "CANCELADO" && pedido.estado !== "ENTREGADO" && (
                  <button
                    className="pedido__btn-cancelar"
                    onClick={() => handleCancelar(pedido.id)}
                    disabled={cancelando === pedido.id}
                  >
                    {cancelando === pedido.id ? "Cancelando..." : "Cancelar pedido"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisPedidosPage;
