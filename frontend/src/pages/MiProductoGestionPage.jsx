import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  crearProducto,
} from "../services/productoService";
import { obtenerCategorias } from "../services/categoriaService";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import Spinner from "../components/Spinner";
import PopUpConfirmacion from "../components/PopUpConfirmacion";
import "../styles/MiCuentaPages.css";
import "../styles/MiProductoGestionPage.css";

const valoresIniciales = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  marca: "",
  estadoProducto: "NUEVO",
  condicionPublicacion: "ACTIVA",
  categoriasIds: [],
};

const opcionesEstado = [
  { value: "NUEVO", label: "Nuevo" },
  { value: "USADO", label: "Usado" },
  { value: "EDICION_LIMITADA", label: "Edición Limitada" },
];

const opcionesCondicion = [
  { value: "ACTIVA", label: "Activa" },
  { value: "PAUSADA", label: "Pausada" },
];

function MiProductoGestionPage() {
  const { id } = useParams();
  console.log("id recibido:", JSON.stringify(id), "esNuevo:", id === "nuevo");
  const navigate = useNavigate();
  const esNuevo = !id || id === "nuevo";

  // formData: datos del producto (vacío si es nuevo, cargado si es existente)
  // categorias: listado completo de categorías disponibles
  // errors: mensajes de validación por campo
  // errorBackend: mensaje de error del backend
  // editando: true si se muestra el formulario (siempre true si es nuevo)
  const [formData, setFormData] = useState(esNuevo ? valoresIniciales : null);
  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorBackend, setErrorBackend] = useState("");
  const [editando, setEditando] = useState(esNuevo);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Carga las categorías disponibles, y el producto si no es nuevo
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const listaCategorias = await obtenerCategorias();
        setCategorias(listaCategorias);

        if (!esNuevo) {
          const producto = await obtenerProductoPorId(id);
          setFormData({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: producto.stock,
            marca: producto.marca,
            estadoProducto: producto.estadoProducto,
            condicionPublicacion: producto.condicionPublicacion,
            categoriasIds: listaCategorias
              .filter((cat) => producto.categorias.includes(cat.nombre))
              .map((cat) => cat.idCategoria),
          });
        }
      } catch (error) {
        setErrorBackend(error.message);
      }
    };

    cargarDatos();
  }, [id, esNuevo]);

  // Actualiza el formulario a medida que el usuario escribe
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Agrega o quita una categoría del array de seleccionadas
  const handleCategoriaToggle = (idCategoria) => {
    setFormData((prev) => {
      const yaEsta = prev.categoriasIds.includes(idCategoria);
      const categoriasIds = yaEsta
        ? prev.categoriasIds.filter((c) => c !== idCategoria)
        : [...prev.categoriasIds, idCategoria];
      return { ...prev, categoriasIds };
    });
  };

  // Validaciones del formulario
  const validar = () => {
    const erroresEncontrados = {};

    if (!formData.nombre) erroresEncontrados.nombre = "El nombre es obligatorio";
    if (formData.precio === "" || formData.precio < 0) erroresEncontrados.precio = "El precio no puede ser negativo";
    if (formData.stock === "" || formData.stock < 0) erroresEncontrados.stock = "El stock no puede ser negativo";
    if (formData.categoriasIds.length === 0) erroresEncontrados.categoriasIds = "Seleccioná al menos una categoría";

    return erroresEncontrados;
  };

  // Valida, arma el ProductoRequestDTO y crea o actualiza el producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBackend("");

    const erroresEncontrados = validar();
    if (Object.keys(erroresEncontrados).length > 0) {
      setErrors(erroresEncontrados);
      return;
    }
    setErrors({});

    const productoRequest = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      marca: formData.marca,
      estadoProducto: formData.estadoProducto,
      condicionPublicacion: formData.condicionPublicacion,
      categoriasIds: formData.categoriasIds,
    };

    try {
      if (esNuevo) {
        await crearProducto(productoRequest);
      } else {
        await actualizarProducto(id, productoRequest);
      }
      navigate("/mis-productos");
    } catch (error) {
      setErrorBackend(error.message);
    }
  };

  // Elimina el producto y vuelve al listado (llamado desde el popup de confirmación)
  const confirmarEliminar = async () => {
    try {
        await eliminarProducto(id);
        navigate("/mis-productos");
    } catch (error) {
        setErrorBackend(error.message);
    }
  };

  if (errorBackend && !formData) {
    return <p className="mi-cuenta__error">{errorBackend}</p>;
  }

  if (!formData) {
    return <Spinner texto="Cargando producto..." />;
  }

  return (
    <div className="mi-cuenta">
    <div className="producto-gestion__header">
      <div className="titulo-pagina">
        <span className="titulo-pagina__eyebrow">Área Personal</span>
        <h1 className="titulo-pagina__texto">{esNuevo ? "Nueva Publicación" : formData.nombre}</h1>
      </div>
      <Link to="/mis-productos" className="producto-gestion__volver">← Mis Productos</Link>
    </div>

      {errorBackend && <p className="mi-cuenta__error">{errorBackend}</p>}

      {!editando ? (
        // Vista de solo lectura
        <div className="producto-gestion__datos">
          <p>{formData.descripcion}</p>
          <p><strong>Marca:</strong> {formData.marca}</p>
          <p><strong>Precio:</strong> ${formData.precio}</p>
          <p><strong>Stock:</strong> {formData.stock}</p>
          <p><strong>Estado:</strong> {formData.estadoProducto}</p>
          <p><strong>Condición:</strong> {formData.condicionPublicacion}</p>
          <p><strong>Categorías:</strong> {categorias
            .filter((cat) => formData.categoriasIds.includes(cat.idCategoria))
            .map((cat) => cat.nombre)
            .join(", ")}</p>

          <div className="producto-gestion__acciones">
            <button className="producto-gestion__btn" onClick={() => setEditando(true)}>Editar</button>
            <button className="producto-gestion__btn producto-gestion__btn--peligro" onClick={() => setMostrarConfirmacion(true)}>Eliminar</button>
          </div>
        </div>
      ) : (
        // Formulario de creación/edición
        <form onSubmit={handleSubmit} className="producto-gestion__form">
          <FormInput label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} error={errors.nombre} />
          <FormInput label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} error={errors.descripcion} />
          <FormInput label="Marca" name="marca" value={formData.marca} onChange={handleChange} error={errors.marca} />
          <FormInput label="Precio" type="number" name="precio" value={formData.precio} onChange={handleChange} error={errors.precio} />
          <FormInput label="Stock" type="number" name="stock" value={formData.stock} onChange={handleChange} error={errors.stock} />

          <FormSelect label="Estado" name="estadoProducto" value={formData.estadoProducto} onChange={handleChange} opciones={opcionesEstado} />

          <FormSelect label="Condición de Publicación" name="condicionPublicacion" value={formData.condicionPublicacion} onChange={handleChange} opciones={opcionesCondicion} />

          <div className="form-input">
            <label className="form-input__label">Categorías</label>
            <div className="producto-gestion__categorias">
              {categorias.map((cat) => (
                <label key={cat.idCategoria} className="producto-gestion__categoria-item">
                  <input
                    type="checkbox"
                    checked={formData.categoriasIds.includes(cat.idCategoria)}
                    onChange={() => handleCategoriaToggle(cat.idCategoria)}
                  />
                  {cat.nombre}
                </label>
              ))}
            </div>
            {errors.categoriasIds && <span className="form-input__error">{errors.categoriasIds}</span>}
          </div>

          <div className="producto-gestion__acciones">
           <button
              type="button"
              className="producto-gestion__btn producto-gestion__btn--secundario"
              onClick={() => (esNuevo ? navigate("/mis-productos") : setEditando(false))}
            >
              Cancelar
            </button>
            <button type="submit" className="producto-gestion__btn">Guardar</button>
          </div>
        </form>
      )}
      {mostrarConfirmacion && (
        <PopUpConfirmacion
            mensaje="¿Seguro que querés eliminar este producto?"
            onConfirmar={confirmarEliminar}
            onCancelar={() => setMostrarConfirmacion(false)}
        />
      )}
    </div>
  );
}

export default MiProductoGestionPage;