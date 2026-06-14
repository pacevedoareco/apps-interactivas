import { useEffect, useState } from "react";
import { obtenerUsuarioActual, actualizarUsuarioActual } from "../services/usuarioService";
import DatosPersonalesForm from "../components/DatosPersonalesForm";
import DireccionForm from "../components/DireccionForm";
import PerfilCard from "../components/PerfilCard";
import Spinner from "../components/Spinner";
import "../styles/MiCuentaPages.css";

// Campos obligatorios de cada sección, usados para validar antes de guardar
const obligatoriosDatos = {
  nombre: "El nombre es obligatorio",
  apellido: "El apellido es obligatorio",
  telefono: "El teléfono es obligatorio",
  fechaNacimiento: "La fecha de nacimiento es obligatoria",
};

const obligatoriosDireccion = {
  calle: "La calle es obligatoria",
  numero: "El número es obligatorio",
  ciudad: "La ciudad es obligatoria",
  provincia: "La provincia es obligatoria",
  codigoPostal: "El código postal es obligatorio",
  pais: "El país es obligatorio",
};

function PerfilPage() {
  // formData: datos del usuario cargados desde el backend
  // errors: mensajes de validación por campo
  // errorBackend: mensaje de error del backend
  // editandoDatos / editandoDireccion: qué tarjeta está en modo edición
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [errorBackend, setErrorBackend] = useState("");
  const [editandoDatos, setEditandoDatos] = useState(false);
  const [editandoDireccion, setEditandoDireccion] = useState(false);

  // Carga los datos del usuario logueado al entrar a la página
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const usuario = await obtenerUsuarioActual();
        setFormData({
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          telefono: usuario.telefono,
          fechaNacimiento: usuario.fechaNacimiento?.split("T")[0] || "",
          calle: usuario.direccion?.calle || "",
          numero: usuario.direccion?.numero || "",
          piso: usuario.direccion?.piso || "",
          departamento: usuario.direccion?.departamento || "",
          ciudad: usuario.direccion?.ciudad || "",
          provincia: usuario.direccion?.provincia || "",
          codigoPostal: usuario.direccion?.codigoPostal || "",
          pais: usuario.direccion?.pais || "",
        });
      } catch (error) {
        setErrorBackend(error.message);
      }
    };

    cargarUsuario();
  }, []);

  // Actualiza el formulario a medida que el usuario escribe
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Revisa que los campos obligatorios indicados tengan valor
  const validarCampos = (camposObligatorios) => {
    const erroresEncontrados = {};
    for (const campo in camposObligatorios) {
      if (!formData[campo]) {
        erroresEncontrados[campo] = camposObligatorios[campo];
      }
    }
    return erroresEncontrados;
  };

  // Valida, guarda los cambios en el backend y cierra el modo edición
    const guardarSeccion = (camposObligatorios, cerrarEdicion) => async (e) => {
    e.preventDefault();
    setErrorBackend("");

    const erroresEncontrados = validarCampos(camposObligatorios);
    if (Object.keys(erroresEncontrados).length > 0) {
      setErrors(erroresEncontrados);
      return;
    }
    setErrors({});

    const usuarioUpdate = {
      nombre: formData.nombre,
      apellido: formData.apellido,
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

    try {
      await actualizarUsuarioActual(usuarioUpdate);
      cerrarEdicion(false);
    } catch (error) {
      setErrorBackend(error.message);
    }
  };

  if (!formData) {
    return <Spinner texto="Cargando perfil..." />;
  }

  return (
    <div className="mi-cuenta">
      <div className="titulo-pagina">
        <span className="titulo-pagina__eyebrow">Área Personal</span>
        <h1 className="titulo-pagina__texto">Mi Perfil</h1>
      </div>
      {errorBackend && <p className="mi-cuenta__error">{errorBackend}</p>}

      <PerfilCard
        titulo="Datos Personales"
        editando={editandoDatos}
        onEditar={() => setEditandoDatos(true)}
        onCancelar={() => setEditandoDatos(false)}
        onSubmit={guardarSeccion(obligatoriosDatos, setEditandoDatos)}
        vistaLectura={
          <>
            <p><strong>Nombre:</strong> {formData.nombre} {formData.apellido}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Teléfono:</strong> {formData.telefono}</p>
            <p><strong>Fecha de Nacimiento:</strong> {formData.fechaNacimiento}</p>
          </>
        }
      >
        <DatosPersonalesForm formData={formData} errors={errors} onChange={handleChange} />
      </PerfilCard>

      <PerfilCard
        titulo="Dirección"
        editando={editandoDireccion}
        onEditar={() => setEditandoDireccion(true)}
        onCancelar={() => setEditandoDireccion(false)}
        onSubmit={guardarSeccion(obligatoriosDireccion, setEditandoDireccion)}
        vistaLectura={
          <>
            <p>{formData.calle} {formData.numero}{formData.piso && `, Piso ${formData.piso}`}{formData.departamento && `, Depto ${formData.departamento}`}</p>
            <p>{formData.ciudad}, {formData.provincia} ({formData.codigoPostal})</p>
            <p>{formData.pais}</p>
          </>
        }
      >
        <DireccionForm formData={formData} errors={errors} onChange={handleChange} />
      </PerfilCard>
    </div>
  );
}

export default PerfilPage;