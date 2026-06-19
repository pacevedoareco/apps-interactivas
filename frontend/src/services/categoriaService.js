import { API_CONFIG } from "../config/api.js";

const API_URL = API_CONFIG.ENDPOINTS.CATEGORIAS;

export async function obtenerCategorias() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("No se pudieron obtener las categorías");
  }

  return response.json();
}