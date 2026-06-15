import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
        state={{
          message: "Necesitas iniciar sesion para acceder a esta seccion.",
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
