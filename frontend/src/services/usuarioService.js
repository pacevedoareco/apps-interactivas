import { API_CONFIG } from "../config/api.js";

const API_URL = API_CONFIG.ENDPOINTS.USUARIOS;

export async function obtenerUsuarioActual() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/me`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("No se pudo obtener el usuario");
    }

    return response.json();
}

export async function actualizarUsuarioActual(usuarioUpdate) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/me`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuarioUpdate),
    });

    if (!response.ok) {
        throw new Error("No se pudo actualizar el perfil");
    }

    return response.json();
}