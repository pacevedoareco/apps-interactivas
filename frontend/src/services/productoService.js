const API_URL = "http://localhost:8080/api/productos";

export async function obtenerMisProductos() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/mis-productos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener tus productos");
  }

  return response.json();
}

export async function obtenerProductoPorId(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("No se pudo obtener el producto");
  }

  return response.json();
}

export async function crearProducto(productoRequest) {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productoRequest),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear el producto");
  }

  return response.json();
}

export async function actualizarProducto(id, productoRequest) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productoRequest),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el producto");
  }

  return response.json();
}

export async function eliminarProducto(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el producto");
  }
}