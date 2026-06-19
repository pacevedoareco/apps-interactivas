import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Spinner from "./Spinner";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { token, authLoading, isAdmin } = useContext(AuthContext);
  const location = useLocation();

  if (authLoading) {
    return <Spinner texto="Validando sesión..." />;
  }

  if (!token) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
        state={{
          message: "Necesitas iniciar sesión para acceder a esta sección.",
        }}
      />
    );
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
