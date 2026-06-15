const API_URL = "http://localhost:8080/api/pedidos";

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function obtenerMisPedidos() {
  const response = await fetch(`${API_URL}/mis-pedidos`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("No se pudieron obtener los pedidos");
  return response.json();
}

export async function cancelarPedido(id) {
  const response = await fetch(`${API_URL}/${id}/cancelar`, {
    method: "PUT",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("No se pudo cancelar el pedido");
  return response.json();
}
