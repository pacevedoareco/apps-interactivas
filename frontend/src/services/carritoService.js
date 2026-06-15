const API_URL = "http://localhost:8080/api/carrito";

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function obtenerCarrito() {
  const response = await fetch(API_URL, { headers: getHeaders() });
  if (!response.ok) throw new Error("No se pudo obtener el carrito");
  return response.json();
}

export async function agregarItemAlCarrito(productoId, cantidad) {
  const response = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ productoId, cantidad }),
  });
  if (!response.ok) throw new Error("No se pudo agregar el producto al carrito");
  return response.json();
}

export async function modificarItemCarrito(itemId, cantidad) {
  const response = await fetch(`${API_URL}/items/${itemId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ cantidad }),
  });
  if (!response.ok) throw new Error("No se pudo modificar la cantidad");
  return response.json();
}

export async function eliminarItemCarrito(itemId) {
  const response = await fetch(`${API_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("No se pudo eliminar el item");
  return response.json();
}

export async function vaciarCarritoAPI() {
  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("No se pudo vaciar el carrito");
}

export async function checkoutCarrito() {
  const response = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (response.status === 409) {
    const data = await response.json();
    const error = new Error(data.message || "Stock insuficiente");
    error.errores = data.errores ?? [];
    throw error;
  }
  if (!response.ok) throw new Error("No se pudo completar el checkout");
  return response.json();
}
