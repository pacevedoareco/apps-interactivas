import { useState, useContext } from "react";
import { loginUsuario } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import "../styles/AuthPages.css";

// Configuración de los campos del formulario
const camposFormulario = [
  { label: "Email", name: "email", type: "email" },
  { label: "Contraseña", name: "password", type: "password" },
];

const valoresIniciales = {
  email: "",
  password: "",
};

function LoginPage() {
  // formData: valores ingresados por el usuario
  // errors: mensajes de validación por campo
  // errorBackend: mensaje de error devuelto por el backend
  const [formData, setFormData] = useState(valoresIniciales);
  const [errors, setErrors] = useState({});
  const [errorBackend, setErrorBackend] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Actualiza el formulario a medida que el usuario escribe
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validaciones del formulario
  const validar = () => {
    const erroresEncontrados = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      erroresEncontrados.email = "El email es obligatorio";
    } else if (!emailRegex.test(formData.email)) {
      erroresEncontrados.email = "El email no tiene un formato válido";
    }

    if (!formData.password) {
      erroresEncontrados.password = "La contraseña es obligatoria";
    }

    return erroresEncontrados;
  };

  // Envío del formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBackend("");

    // Validación
    const erroresEncontrados = validar();
    if (Object.keys(erroresEncontrados).length > 0) {
      setErrors(erroresEncontrados);
      return;
    }
    setErrors({});

    // POST al backend
    try {
      const token = await loginUsuario(formData);
      login(token);
      navigate("/");
    } catch (error) {
      setErrorBackend(error.message);
    }
  };

  // Formulario de login
  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleSubmit}>
        <h1 className="auth__titulo">Iniciar Sesión</h1>

        {camposFormulario.map((campo) => (
          <FormInput
            key={campo.name}
            label={campo.label}
            type={campo.type}
            name={campo.name}
            value={formData[campo.name]}
            onChange={handleChange}
            error={errors[campo.name]}
          />
        ))}

        {errorBackend && <p className="auth__error">{errorBackend}</p>}

        <button type="submit" className="auth__btn">Ingresar</button>
      </form>
    </div>
  );
}

export default LoginPage;