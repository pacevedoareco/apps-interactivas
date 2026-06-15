import { createContext, useEffect, useState } from "react";
import { obtenerUsuarioActual } from "../services/usuarioService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    const cargarUsuario = async () => {
      if (!token) {
        setUsuario(null);
        setAuthLoading(false);
        return;
      }

      setAuthLoading(true);

      try {
        const usuarioActual = await obtenerUsuarioActual();
        setUsuario(usuarioActual);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setUsuario(null);
      } finally {
        setAuthLoading(false);
      }
    };

    cargarUsuario();
  }, [token]);

  const login = (nuevoToken) => {
    localStorage.setItem("token", nuevoToken);
    setToken(nuevoToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        authLoading,
        isAdmin: usuario?.role === "ADMIN",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
