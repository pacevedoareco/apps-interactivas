import "./FormInput.css";

function FormInput({ label, type = "text", name, value, onChange, error }) {
  return (
    <div className="form-input">
      <label htmlFor={name} className="form-input__label">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="form-input__input"
      />
      {error && <span className="form-input__error">{error}</span>}
    </div>
  );
}

export default FormInput;