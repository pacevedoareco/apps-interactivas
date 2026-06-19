import FormInput from "./FormInput";

// Campos de dirección, para generar los FormInput con .map()
// Reutilizable en Register y Perfil
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

function DireccionForm({ formData, errors, onChange }) {
  return (
    <>
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

export default DireccionForm;