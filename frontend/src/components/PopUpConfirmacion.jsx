import "./PopUpConfirmacion.css";

function PopUpConfirmacion({ mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="popup-confirmacion__overlay" onClick={onCancelar}>
      <div className="popup-confirmacion" onClick={(e) => e.stopPropagation()}>
        <p className="popup-confirmacion__mensaje">{mensaje}</p>
        <div className="popup-confirmacion__acciones">
          <button className="popup-confirmacion__btn popup-confirmacion__btn--secundario" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="popup-confirmacion__btn popup-confirmacion__btn--peligro" onClick={onConfirmar}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopUpConfirmacion;