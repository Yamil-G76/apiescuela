import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// === Interfaz del token JWT ===
interface TokenPayload {
  usuario: {
    idusuario: number;
    username: string;
    type: "admin" | "Alumno";
  };
  iat: number;
  exp?: number;
}

function AlumnoRoutes() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    if (decoded.usuario.type !== "Alumno") {
      return <Navigate to="/forbidden" />;
    }
  } catch (err) {
    console.error("Error al decodificar token:", err);
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default AlumnoRoutes;