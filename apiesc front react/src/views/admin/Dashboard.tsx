import { useState, useEffect } from "react";
import { FaUser, FaMoneyBill, FaGraduationCap, FaSignOutAlt } from "react-icons/fa";
import VerAlumnos from "./VerAlumnos";
import VerPagos from "./VerPagos";
import Modal from "react-modal";
import ListaCarreras from "./listaCarreras";

Modal.setAppElement("#root");

type UserData = {
  usuario: string;
  firstname: string;
  lastname: string;
  dni: string;
  email: string;
};

function DashboardAdmin() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [seccionActiva, setSeccionActiva] = useState("inicio");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token inválido");
        return res.json();
      })
      .then((data: UserData) => {
        setUserData(data);
      })
      .catch((err) => {
        console.error("Error al obtener datos del usuario:", err);
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  if (!userData) return <p style={{ padding: "2rem" }}>Cargando...</p>;

  return (
    <div style={dashboardWrapper}>
      {/* === Sidebar === */}
      <aside style={sidebarStyle}>
        <div>
          <div style={logoStyle}>ISMM</div>
          <div style={iconContainer}>
            <FaUser
              title="Alumnos"
              style={iconStyle}
              onClick={() => setSeccionActiva("alumnos")}
            />
            <FaGraduationCap
              title="Carreras"
              style={iconStyle}
              onClick={() => setSeccionActiva("carreras")}
            />
            <FaMoneyBill
              title="Pagos"
              style={iconStyle}
              onClick={() => setSeccionActiva("pagos")}
            />
          </div>
        </div>

        {/* Ícono de Logout abajo */}
        <div style={logoutContainerStyle}>
          <FaSignOutAlt
            title="Cerrar sesión"
            style={iconStyle}
            onClick={logout}
          />
        </div>
      </aside>

      {/* === Contenido dinámico === */}
      <main style={mainContentStyle}>
        {seccionActiva === "inicio" && (
          <div>
            <h2 style={welcomeText}>Bienvenido {userData.firstname}</h2>
            <p>Seleccioná una opción del menú para comenzar.</p>
          </div>
        )}

        {seccionActiva === "alumnos" && <VerAlumnos />}
        {seccionActiva === "carreras" && <ListaCarreras />}
        {seccionActiva === "pagos" && <VerPagos />}
      </main>
    </div>
  );
}

// === Estilos ===

const dashboardWrapper: React.CSSProperties = {
  display: "flex",
  height: "100vh",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  overflow: "hidden", // elimina scroll general
};

const sidebarStyle: React.CSSProperties = {
  width: "80px",
  background: "linear-gradient(to bottom, #1565c0, #1e88e5)",
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between", // íconos arriba y logout abajo
  alignItems: "center",
  padding: "1rem 0",
};

const logoStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "1rem",
  marginBottom: "1rem",
  textAlign: "center",
};

const iconContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  alignItems: "center",
};

const logoutContainerStyle: React.CSSProperties = {
  marginBottom: "1rem",
};

const iconStyle: React.CSSProperties = {
  fontSize: "1.4rem",
  cursor: "pointer",
};

const mainContentStyle: React.CSSProperties = {
  flexGrow: 1,
  backgroundColor: "#f5f5f5",
  padding: "2rem",
  overflow: "hidden", // sin scroll
};

const welcomeText: React.CSSProperties = {
  fontSize: "1.8rem",
  fontWeight: 700,
  color: "#333",
};

export default DashboardAdmin;