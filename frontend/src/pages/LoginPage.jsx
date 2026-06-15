import { useState, useContext } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { loginUsuario } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import "../styles/AuthPages.css";

const camposFormulario = [
  { label: "Email", name: "email", type: "email" },
  { label: "Contrasena", name: "password", type: "password" },
];

const valoresIniciales = {
  email: "",
  password: "",
};

function LoginPage() {
  const [formData, setFormData] = useState(valoresIniciales);
  const [errors, setErrors] = useState({});
  const [errorBackend, setErrorBackend] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const loginMessage = location.state?.message || "";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const erroresEncontrados = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      erroresEncontrados.email = "El email es obligatorio";
    } else if (!emailRegex.test(formData.email)) {
      erroresEncontrados.email = "El email no tiene un formato valido";
    }

    if (!formData.password) {
      erroresEncontrados.password = "La contrasena es obligatoria";
    }

    return erroresEncontrados;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBackend("");

    const erroresEncontrados = validar();
    if (Object.keys(erroresEncontrados).length > 0) {
      setErrors(erroresEncontrados);
      return;
    }
    setErrors({});

    try {
      const token = await loginUsuario(formData);
      login(token);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorBackend(error.message);
    }
  };

  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleSubmit}>
        <h1 className="auth__titulo">Iniciar Sesion</h1>

        {loginMessage && <p className="mensaje-vacio">{loginMessage}</p>}

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
