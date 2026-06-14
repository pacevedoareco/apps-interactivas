import { useState } from "react";
import { registrarUsuario } from "../services/authService";
import FormInput from "../components/FormInput";
import DatosPersonalesForm from "../components/DatosPersonalesForm";
import "../styles/AuthPages.css";

// Campos de email/contraseña, para generar los FormInput con .map()
const camposCuenta = [
  { label: "Email", name: "email", type: "email" },
  { label: "Contraseña", name: "password", type: "password" },
  { label: "Confirmar Contraseña", name: "confirmarPassword", type: "password" },
];

// Valores iniciales del formulario
const valoresIniciales = {
  nombre: "",
  apellido: "",
  telefono: "",
  fechaNacimiento: "",
  calle: "",
  numero: "",
  piso: "",
  departamento: "",
  ciudad: "",
  provincia: "",
  codigoPostal: "",
  pais: "",
  email: "",
  password: "",
  confirmarPassword: "",
};

function RegisterPage() {
  // formData: valores ingresados por el usuario
  // errors: mensajes de validación por campo
  // errorBackend: mensaje de error devuelto por el backend
  const [formData, setFormData] = useState(valoresIniciales);
  const [errors, setErrors] = useState({});
  const [errorBackend, setErrorBackend] = useState("");

  // Actualiza el formulario a medida que el usuario escribe
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validaciones del formulario
  const validar = () => {
    const erroresEncontrados = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const camposObligatorios = {
      nombre: "El nombre es obligatorio",
      apellido: "El apellido es obligatorio",
      telefono: "El teléfono es obligatorio",
      fechaNacimiento: "La fecha de nacimiento es obligatoria",
      calle: "La calle es obligatoria",
      numero: "El número es obligatorio",
      ciudad: "La ciudad es obligatoria",
      provincia: "La provincia es obligatoria",
      codigoPostal: "El código postal es obligatorio",
      pais: "El país es obligatorio",
      password: "La contraseña es obligatoria",
    };

    for (const campo in camposObligatorios) {
      if (!formData[campo]) {
        erroresEncontrados[campo] = camposObligatorios[campo];
      }
    }

    if (!formData.email) {
      erroresEncontrados.email = "El email es obligatorio";
    } else if (!emailRegex.test(formData.email)) {
      erroresEncontrados.email = "El email no tiene un formato válido";
    }

    if (formData.password !== formData.confirmarPassword) {
      erroresEncontrados.confirmarPassword = "Las contraseñas no coinciden";
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

    // Mapeo a RegisterRequest
    const registerRequest = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono,
      fechaNacimiento: formData.fechaNacimiento,
      direccion: {
        calle: formData.calle,
        numero: formData.numero,
        piso: formData.piso,
        departamento: formData.departamento,
        ciudad: formData.ciudad,
        provincia: formData.provincia,
        codigoPostal: formData.codigoPostal,
        pais: formData.pais,
      },
    };

    // POST al backend
    try {
      await registrarUsuario(registerRequest);
      window.location.href = "/login";
    } catch (error) {
      setErrorBackend(error.message);
    }
  };

  // Formulario de registro
  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleSubmit}>
        <h1 className="auth__titulo">Crear Cuenta</h1>

        <DatosPersonalesForm formData={formData} errors={errors} onChange={handleChange} />

        <h2 className="auth__subtitulo">Cuenta</h2>

        {camposCuenta.map((campo) => (
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

        <button type="submit" className="auth__btn">Registrarse</button>
      </form>
    </div>
  );
}

export default RegisterPage;