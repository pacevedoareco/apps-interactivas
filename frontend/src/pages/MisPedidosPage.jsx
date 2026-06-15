import "../styles/MiCuentaPages.css";

function MisPedidosPage() {
  return (
    <div className="mi-cuenta">
      <div className="titulo-pagina">
        <span className="titulo-pagina__eyebrow">Área Personal</span>
        <h1 className="titulo-pagina__texto">Mis Pedidos</h1>
      </div>

      <p className="mi-cuenta__vacio">No tenés pedidos realizados.</p>
    </div>
  );
}

export default MisPedidosPage;