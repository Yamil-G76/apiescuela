import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  usuario: {
    idusuario: number;
    username: string;
    type: "admin" | "alumno";
  };
  iat: number;
  exp?: number;
}

function AdminRoutes() {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    if (decoded.usuario.type !== "admin") {
      return <Navigate to="/forbidden" />;
    }
  } catch (err) {
    console.log(err)
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default AdminRoutes;