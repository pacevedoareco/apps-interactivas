import { API_CONFIG } from "../config/api.js";

const API_BASE_URL = API_CONFIG.ENDPOINTS.ADMIN;

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
