import { API_CONFIG } from '../config/api';

const API_URL = `${API_CONFIG.BASE_URL}/api/favoritos`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const favoritoService = {
  agregarFavorito: async (productoId) => {
    const response = await fetch(`${API_URL}/${productoId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('No se pudo agregar a favoritos');
    }

    return response.ok;
  },

  eliminarFavorito: async (productoId) => {
    const response = await fetch(`${API_URL}/${productoId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('No se pudo eliminar de favoritos');
    }

    return response.ok;
  },

  obtenerFavoritos: async () => {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('No se pudieron obtener los favoritos');
    }

    return response.json();
  },

  esFavorito: async (productoId) => {
    const response = await fetch(`${API_URL}/${productoId}/es-favorito`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('No se pudo verificar el favorito');
    }

    return response.json();
  },

  toggleFavorito: async (productoId, esFavorito) => {
    if (esFavorito) {
      return await favoritoService.eliminarFavorito(productoId);
    } else {
      return await favoritoService.agregarFavorito(productoId);
    }
  }
};

// Made with Bob
