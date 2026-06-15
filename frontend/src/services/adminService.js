const API_BASE_URL = "http://localhost:8080/api/admin";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function obtenerProductosAdmin() {
  const response = await fetch(`${API_BASE_URL}/productos`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener las publicaciones del panel administrador");
  }

  return response.json();
}

export async function obtenerUsuariosAdmin() {
  const response = await fetch(`${API_BASE_URL}/usuarios`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los usuarios del panel administrador");
  }

  return response.json();
}
