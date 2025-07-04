import { useState, useEffect } from "react";
import { FaUser, FaMoneyBill, FaGraduationCap, FaSignOutAlt } from "react-icons/fa";
import VerAlumnos from "./listaAlumnsos";
import VerPagos from "./VerPagos";
import CargarPago from "./cargarPago";
import Modal from "react-modal";
import ListaCarreras from "./listaCarreras"; // Importamos ListaCarreras.tsx

// Seteo global para accesibilidad del modal
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
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);

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

        {/* Sección Carreras */}
        {seccionActiva === "carreras" && (
          <div>
            <ListaCarreras /> {/* Los botones de Crear y Asignar carrera están dentro de ListaCarreras */}
          </div>
        )}

        {seccionActiva === "pagos" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <button
                onClick={() => setModalPagoAbierto(true)}
                style={buttonCargarPago}
              >
                Cargar Pago
              </button>
            </div>

            <VerPagos />
          </div>
        )}
      </main>
    </div>
  );
}

// === Estilos ===
const dashboardWrapper: React.CSSProperties = {
  display: "flex",
  height: "100vh",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const sidebarStyle: React.CSSProperties = {
  width: "80px",
  background: "linear-gradient(to bottom, #1565c0, #1e88e5)",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "1rem 0",
  gap: "2rem",
};

const logoStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "1rem",
  marginBottom: "1rem",
};

const iconContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
};

const iconStyle: React.CSSProperties = {
  fontSize: "1.4rem",
  cursor: "pointer",
};

const mainContentStyle: React.CSSProperties = {
  flexGrow: 1,
  backgroundColor: "#f5f5f5",
  padding: "2rem",
  overflowY: "auto",
};

const welcomeText: React.CSSProperties = {
  fontSize: "1.8rem",
  fontWeight: 700,
  color: "#333",
};

const buttonCargarPago: React.CSSProperties = {
  padding: "0.5rem 1rem",
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
};

export default DashboardAdmin;
