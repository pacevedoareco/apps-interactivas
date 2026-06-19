// Configuración centralizada de la API
// Vite expone las variables de entorno que comienzan con VITE_ en import.meta.env

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    AUTH: `${API_BASE_URL}/api/auth`,
    USUARIOS: `${API_BASE_URL}/api/usuarios`,
    PRODUCTOS: `${API_BASE_URL}/api/productos`,
    CATEGORIAS: `${API_BASE_URL}/api/categorias`,
    CARRITO: `${API_BASE_URL}/api/carrito`,
    PEDIDOS: `${API_BASE_URL}/api/pedidos`,
    ADMIN: `${API_BASE_URL}/api/admin`,
  },
};

export default API_CONFIG;

// Made with Bob
