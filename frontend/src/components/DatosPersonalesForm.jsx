import FormInput from "./FormInput";

// Campos de datos personales, para generar los FormInput con .map()
// Reutilizable en Register y Perfil
const camposPersonales = [
  { label: "Nombre", name: "nombre", type: "text" },
  { label: "Apellido", name: "apellido", type: "text" },
  { label: "Teléfono", name: "telefono", type: "text" },
  { label: "Fecha de Nacimiento", name: "fechaNacimiento", type: "date" },
];

function DatosPersonalesForm({ formData, errors, onChange }) {
  return (
    <>
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
    </>
  );
}

export default DatosPersonalesForm;