import "./Spinner.css";

function Spinner({ texto }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      {texto && <p className="spinner__texto">{texto}</p>}
    </div>
  );
}

export default Spinner;