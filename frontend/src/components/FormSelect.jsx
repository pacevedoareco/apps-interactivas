function FormSelect({ label, name, value, onChange, opciones, error }) {
  return (
    <div className="form-input">
      <label htmlFor={name} className="form-input__label">{label}</label>
      <select id={name} name={name} value={value} onChange={onChange} className="form-input__input">
        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
        ))}
      </select>
      {error && <span className="form-input__error">{error}</span>}
    </div>
  );
}

export default FormSelect;