import "./PerfilCard.css";

function PerfilCard({ titulo, editando, onEditar, onCancelar, onSubmit, vistaLectura, children }) {
  return (
    <div className="perfil-card">
      <div className="perfil-card__header">
        <h2 className="perfil-card__titulo">{titulo}</h2>
        {!editando && (
          <button className="perfil-card__editar" onClick={onEditar}>
            Editar
          </button>
        )}
      </div>

      {editando ? (
        <form onSubmit={onSubmit}>
          {children}
          <div className="perfil-card__acciones">
            <button type="button" className="perfil-card__btn perfil-card__btn--secundario" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" className="perfil-card__btn">Guardar</button>
          </div>
        </form>
      ) : (
        <div className="perfil-card__datos">{vistaLectura}</div>
      )}
    </div>
  );
}

export default PerfilCard;