import FormInput from "./FormInput";

// Campos de datos personales/dirección, para generar los FormInput con .map()
const camposPersonales = [
  { label: "Nombre", name: "nombre", type: "text" },
  { label: "Apellido", name: "apellido", type: "text" },
  { label: "Teléfono", name: "telefono", type: "text" },
  { label: "Fecha de Nacimiento", name: "fechaNacimiento", type: "date" },
];

const camposDireccion = [
  { label: "Calle", name: "calle", type: "text" },
  { label: "Número", name: "numero", type: "text" },
  { label: "Piso", name: "piso", type: "text" },
  { label: "Departamento", name: "departamento", type: "text" },
  { label: "Ciudad", name: "ciudad", type: "text" },
  { label: "Provincia", name: "provincia", type: "text" },
  { label: "Código Postal", name: "codigoPostal", type: "text" },
  { label: "País", name: "pais", type: "text" },
];

function DatosPersonalesForm({ formData, errors, onChange }) {
  return (
    <>
      <h2 className="auth__subtitulo">Datos Personales</h2>

      {camposPersonales.map((campo) => (
        <FormInput
          key={campo.name}
          label={campo.label}
          type={campo.type}
          name={campo.name}
          value={formData[campo.name]}
          onChange={onChange}
          error={errors[campo.name]}
        />
      ))}

      <h2 className="auth__subtitulo">Dirección</h2>

      {camposDireccion.map((campo) => (
        <FormInput
          key={campo.name}
          label={campo.label}
          type={campo.type}
          name={campo.name}
          value={formData[campo.name]}
          onChange={onChange}
          error={errors[campo.name]}
        />
      ))}
    </>
  );
}

export default DatosPersonalesForm;