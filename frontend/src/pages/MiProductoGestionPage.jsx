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
import productPlaceholder from "../assets/product-placeholder.svg";
import "../styles/MiCuentaPages.css";
import "../styles/MiProductoGestionPage.css";

const LIMITES = {
  nombreMax: 80,
  descripcionMin: 30,
  descripcionMax: 280,
  marcaMax: 40,
  imagenUrlMax: 500,
};

const valoresIniciales = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  marca: "",
  imagenUrl: "",
  estadoProducto: "NUEVO",
  condicionPublicacion: "ACTIVA",
  categoriasIds: [],
};

const opcionesEstado = [
  { value: "NUEVO", label: "Nuevo" },
  { value: "USADO", label: "Usado" },
  { value: "EDICION_LIMITADA", label: "Edicion Limitada" },
];

const opcionesCondicion = [
  { value: "ACTIVA", label: "Activa" },
  { value: "PAUSADA", label: "Pausada" },
];

const etiquetasEstado = {
  NUEVO: "Nuevo",
  USADO: "Usado",
  EDICION_LIMITADA: "Edicion Limitada",
};

const etiquetasCondicion = {
  ACTIVA: "Activa",
  PAUSADA: "Pausada",
};

function MiProductoGestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esNuevo = !id || id === "nuevo";

  const [formData, setFormData] = useState(esNuevo ? valoresIniciales : null);
  const [snapshotData, setSnapshotData] = useState(esNuevo ? valoresIniciales : null);
  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorBackend, setErrorBackend] = useState("");
  const [editando, setEditando] = useState(esNuevo);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const listaCategorias = await obtenerCategorias();
        setCategorias(listaCategorias);

        if (!esNuevo) {
          const producto = await obtenerProductoPorId(id);
          const productoMapeado = {
            nombre: producto.nombre ?? "",
            descripcion: producto.descripcion ?? "",
            precio: producto.precio ?? "",
            stock: producto.stock ?? "",
            marca: producto.marca ?? "",
            imagenUrl: producto.imagenUrl ?? "",
            estadoProducto: producto.estadoProducto ?? "NUEVO",
            condicionPublicacion: producto.condicionPublicacion ?? "ACTIVA",
            categoriasIds: listaCategorias
              .filter((cat) => producto.categorias.includes(cat.nombre))
              .map((cat) => cat.idCategoria),
          };

          setFormData(productoMapeado);
          setSnapshotData(productoMapeado);
        }
      } catch (error) {
        setErrorBackend(error.message);
      }
    };

    cargarDatos();
  }, [id, esNuevo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nombre" && value.length > LIMITES.nombreMax) {
      return;
    }

    if (name === "descripcion" && value.length > LIMITES.descripcionMax) {
      return;
    }

    if (name === "marca" && value.length > LIMITES.marcaMax) {
      return;
    }

    if (name === "imagenUrl" && value.length > LIMITES.imagenUrlMax) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategoriaToggle = (idCategoria) => {
    setFormData((prev) => {
      const yaEsta = prev.categoriasIds.includes(idCategoria);
      const categoriasIds = yaEsta
        ? prev.categoriasIds.filter((categoriaId) => categoriaId !== idCategoria)
        : [...prev.categoriasIds, idCategoria];

      return { ...prev, categoriasIds };
    });

    setErrors((prev) => ({ ...prev, categoriasIds: "" }));
  };

  const validar = () => {
    const erroresEncontrados = {};
    const nombre = formData.nombre.trim();
    const descripcion = formData.descripcion.trim();
    const marca = formData.marca.trim();
    const imagenUrl = formData.imagenUrl.trim();
    const precio = Number(formData.precio);
    const stock = Number(formData.stock);

    if (!nombre) {
      erroresEncontrados.nombre = "El nombre es obligatorio";
    } else if (nombre.length < 4) {
      erroresEncontrados.nombre = "El nombre debe tener al menos 4 caracteres";
    }

    if (!descripcion) {
      erroresEncontrados.descripcion = "La descripcion es obligatoria";
    } else if (descripcion.length < LIMITES.descripcionMin) {
      erroresEncontrados.descripcion = `La descripcion debe tener al menos ${LIMITES.descripcionMin} caracteres`;
    }

    if (!marca) {
      erroresEncontrados.marca = "La marca es obligatoria";
    } else if (marca.length < 2) {
      erroresEncontrados.marca = "La marca debe tener al menos 2 caracteres";
    }

    if (imagenUrl) {
      try {
        const url = new URL(imagenUrl);
        if (!["http:", "https:"].includes(url.protocol)) {
          erroresEncontrados.imagenUrl = "La imagen debe comenzar con http:// o https://";
        }
      } catch {
        erroresEncontrados.imagenUrl = "La imagen debe ser una URL valida";
      }
    }

    if (formData.precio === "" || Number.isNaN(precio) || precio <= 0) {
      erroresEncontrados.precio = "El precio debe ser mayor a 0";
    }

    if (
      formData.stock === "" ||
      Number.isNaN(stock) ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      erroresEncontrados.stock = "El stock debe ser un numero entero igual o mayor a 0";
    }

    if (formData.categoriasIds.length === 0) {
      erroresEncontrados.categoriasIds = "Selecciona al menos una categoria";
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
    setGuardando(true);

    const productoRequest = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      marca: formData.marca.trim(),
      imagenUrl: formData.imagenUrl.trim() || null,
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

      navigate("/mis-productos", {
        state: {
          successMessage: esNuevo
            ? "La publicacion se creo correctamente."
            : "La publicacion se actualizo correctamente.",
        },
      });
    } catch (error) {
      setErrorBackend(error.message);
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarProducto(id);
      navigate("/mis-productos", {
        state: {
          successMessage: "La publicacion se elimino correctamente.",
        },
      });
    } catch (error) {
      setErrorBackend(error.message);
    }
  };

  if (errorBackend && !formData) {
    return <p className="mensaje-error">{errorBackend}</p>;
  }

  if (!formData) {
    return <Spinner texto="Cargando producto..." />;
  }

  const categoriasSeleccionadas = categorias.filter((cat) =>
    formData.categoriasIds.includes(cat.idCategoria)
  );
  const descripcionRestante = LIMITES.descripcionMax - formData.descripcion.length;
  const previewNombre = formData.nombre.trim() || "Tu producto todavia no tiene nombre";
  const previewDescripcion =
    formData.descripcion.trim() ||
    "La descripcion aparecera aqui para que puedas revisar como se vera tu publicacion.";
  const previewMarca = formData.marca.trim() || "Marca";
  const handleCancelarEdicion = () => {
    if (esNuevo) {
      navigate("/mis-productos");
      return;
    }

    setFormData(snapshotData);
    setErrors({});
    setErrorBackend("");
    setEditando(false);
  };

  return (
    <div className="mi-cuenta producto-gestion">
      <div className="producto-gestion__header">
        <div className="titulo-pagina">
          <span className="titulo-pagina__eyebrow">Area Personal</span>
          <h1 className="titulo-pagina__texto">
            {esNuevo ? "Nueva Publicacion" : formData.nombre}
          </h1>
        </div>
        <Link to="/mis-productos" className="producto-gestion__volver">
          Volver a Mis Productos
        </Link>
      </div>

      {errorBackend && <p className="mensaje-error">{errorBackend}</p>}

      {!editando ? (
        <div className="producto-gestion__datos">
          <p>{formData.descripcion}</p>
          <p><strong>Marca:</strong> {formData.marca}</p>
          <p><strong>Imagen:</strong> {formData.imagenUrl || "Sin imagen cargada"}</p>
          <p><strong>Precio:</strong> ${Number(formData.precio).toLocaleString("es-AR")}</p>
          <p><strong>Stock:</strong> {formData.stock}</p>
          <p><strong>Estado:</strong> {etiquetasEstado[formData.estadoProducto]}</p>
          <p><strong>Condicion:</strong> {etiquetasCondicion[formData.condicionPublicacion]}</p>
          <p>
            <strong>Categorias:</strong>{" "}
            {categoriasSeleccionadas.map((cat) => cat.nombre).join(", ")}
          </p>

          <div className="producto-gestion__acciones">
            <button className="producto-gestion__btn" onClick={() => setEditando(true)}>
              Editar
            </button>
            <button
              className="producto-gestion__btn producto-gestion__btn--peligro"
              onClick={() => setMostrarConfirmacion(true)}
            >
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        <div className="producto-gestion__editor">
          <form onSubmit={handleSubmit} className="producto-gestion__form">
            <div className="producto-gestion__bloque">
              <div className="producto-gestion__bloque-header">
                <h2>Datos principales</h2>
                <span>Completa la informacion esencial de la publicacion</span>
              </div>

              <FormInput
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
              />
              <div className="producto-gestion__contador">
                {formData.nombre.length}/{LIMITES.nombreMax}
              </div>

              <div className="form-input">
                <label htmlFor="descripcion" className="form-input__label">Descripcion</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="form-input__input producto-gestion__textarea"
                  rows="6"
                  placeholder="Describe el producto, su estado, diferenciales y detalles importantes."
                />
                <div className="producto-gestion__contador">
                  <span>
                    Minimo recomendado: {LIMITES.descripcionMin} caracteres
                  </span>
                  <span className={descripcionRestante < 25 ? "producto-gestion__contador-alerta" : ""}>
                    {formData.descripcion.length}/{LIMITES.descripcionMax}
                  </span>
                </div>
                {errors.descripcion && <span className="form-input__error">{errors.descripcion}</span>}
              </div>

              <FormInput
                label="Marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                error={errors.marca}
              />
              <FormInput
                label="Imagen URL"
                name="imagenUrl"
                value={formData.imagenUrl}
                onChange={handleChange}
                error={errors.imagenUrl}
              />
              <div className="producto-gestion__contador">
                <span>Pega una URL publica de imagen para mostrar el producto</span>
                <span>{formData.imagenUrl.length}/{LIMITES.imagenUrlMax}</span>
              </div>
            </div>

            <div className="producto-gestion__bloque">
              <div className="producto-gestion__bloque-header">
                <h2>Precio y stock</h2>
                <span>Define cuanto vale y cuantas unidades hay disponibles</span>
              </div>

              <FormInput
                label="Precio"
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                error={errors.precio}
              />

              <FormInput
                label="Stock"
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                error={errors.stock}
              />
            </div>

            <div className="producto-gestion__bloque">
              <div className="producto-gestion__bloque-header">
                <h2>Clasificacion</h2>
                <span>Selecciona el estado del producto y como se publicara</span>
              </div>

              <FormSelect
                label="Estado"
                name="estadoProducto"
                value={formData.estadoProducto}
                onChange={handleChange}
                opciones={opcionesEstado}
              />

              <FormSelect
                label="Condicion de Publicacion"
                name="condicionPublicacion"
                value={formData.condicionPublicacion}
                onChange={handleChange}
                opciones={opcionesCondicion}
              />
            </div>

            <div className="producto-gestion__bloque">
              <div className="producto-gestion__bloque-header">
                <h2>Categorias</h2>
                <span>Puedes elegir una o varias para mejorar la visibilidad</span>
              </div>

              <div className="form-input">
                <label className="form-input__label">Categorias</label>
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
            </div>

            <div className="producto-gestion__acciones">
              <button
                type="button"
                className="producto-gestion__btn producto-gestion__btn--secundario"
                onClick={handleCancelarEdicion}
                disabled={guardando}
              >
                Cancelar
              </button>
              <button type="submit" className="producto-gestion__btn" disabled={guardando}>
                {guardando ? "Guardando..." : esNuevo ? "Publicar" : "Guardar cambios"}
              </button>
            </div>
          </form>

          <aside className="producto-gestion__preview">
            <div className="producto-gestion__preview-card">
              <span className="producto-gestion__preview-eyebrow">Vista previa</span>
              <img
                src={formData.imagenUrl.trim() || productPlaceholder}
                alt={previewNombre}
                className="producto-gestion__preview-imagen"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = productPlaceholder;
                }}
              />
              <span className="producto-gestion__preview-estado">
                {etiquetasEstado[formData.estadoProducto]}
              </span>
              <h2>{previewNombre}</h2>
              <p className="producto-gestion__preview-marca">{previewMarca}</p>
              <p className="producto-gestion__preview-descripcion">{previewDescripcion}</p>

              <div className="producto-gestion__preview-meta">
                <div>
                  <span>Precio</span>
                  <strong>
                    {formData.precio !== ""
                      ? `$${Number(formData.precio).toLocaleString("es-AR")}`
                      : "A definir"}
                  </strong>
                </div>
                <div>
                  <span>Stock</span>
                  <strong>
                    {formData.stock === ""
                      ? "Sin definir"
                      : Number(formData.stock) > 0
                        ? `${formData.stock} disponibles`
                        : "Sin stock"}
                  </strong>
                </div>
              </div>

              <div className="producto-gestion__preview-tags">
                {categoriasSeleccionadas.length > 0 ? (
                  categoriasSeleccionadas.map((categoria) => (
                    <span key={categoria.idCategoria}>{categoria.nombre}</span>
                  ))
                ) : (
                  <span className="producto-gestion__preview-tag-vacio">
                    Selecciona categorias para completar la vista previa
                  </span>
                )}
              </div>

              <div className="producto-gestion__preview-footer">
                <span>Condicion: {etiquetasCondicion[formData.condicionPublicacion]}</span>
                <span>Publicacion lista para revisar antes de guardar</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {mostrarConfirmacion && (
        <PopUpConfirmacion
          mensaje="Seguro que quieres eliminar este producto?"
          onConfirmar={confirmarEliminar}
          onCancelar={() => setMostrarConfirmacion(false)}
        />
      )}
    </div>
  );
}

export default MiProductoGestionPage;
