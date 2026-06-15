import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  agregarItemAlCarrito,
  eliminarItemCarrito,
  modificarItemCarrito,
  obtenerCarrito,
  vaciarCarritoAPI,
  checkoutCarrito,
} from "../services/carritoService";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [carrito, setCarrito] = useState(null);

  const cargarCarrito = useCallback(async () => {
    if (!token) {
      setCarrito(null);
      return;
    }
    try {
      const data = await obtenerCarrito();
      setCarrito(data);
    } catch {
      setCarrito(null);
    }
  }, [token]);

  useEffect(() => {
    cargarCarrito();
  }, [cargarCarrito]);

  const agregarAlCarrito = async (productoId, cantidad) => {
    const data = await agregarItemAlCarrito(productoId, cantidad);
    setCarrito(data);
    return data;
  };

  const cambiarCantidad = async (itemId, cantidad) => {
    if (cantidad < 1) {
      return eliminarDelCarrito(itemId);
    }
    const data = await modificarItemCarrito(itemId, cantidad);
    setCarrito(data);
  };

  const eliminarDelCarrito = async (itemId) => {
    const data = await eliminarItemCarrito(itemId);
    setCarrito(data);
  };

  const vaciarCarrito = async () => {
    await vaciarCarritoAPI();
    setCarrito((prev) => (prev ? { ...prev, items: [], total: 0 } : null));
  };

  const checkout = async () => {
    const pedido = await checkoutCarrito();
    setCarrito((prev) => (prev ? { ...prev, items: [], total: 0 } : null));
    return pedido;
  };

  const items = carrito?.items ?? [];
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito?.total ?? 0;

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrecio,
        agregarAlCarrito,
        cambiarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
