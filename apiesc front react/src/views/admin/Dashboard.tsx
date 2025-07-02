import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaMoneyBill, FaGraduationCap } from "react-icons/fa";

// === Tipo para los datos que retorna el backend ===
type UserData = {
  usuario: string;
  firstname: string;
  lastname: string;
  dni: string;
  email: string;
};

function DashboardAdmin() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();

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
        navigate("/login");
      });
  }, [navigate]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (!userData) return <p style={{ padding: "2rem" }}>Cargando...</p>;

  const firstname = userData.firstname;
  const username = userData.usuario;

  return (
    <div style={dashboardWrapper}>
      {/* === Menú lateral izquierdo === */}
      <aside style={sidebarStyle}>
        <div style={logoStyle}>ISMM</div>
        <nav style={navStyle}>
          <div
            style={getNavItemStyle(hoveredItem === "agregar")}
            onMouseEnter={() => setHoveredItem("agregar")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => navigate("/singin")}
          >
            <FaUser style={iconStyle} /> Agregar Alumno
          </div>
          <div
            style={getNavItemStyle(hoveredItem === "verAlumnos")}
            onMouseEnter={() => setHoveredItem("verAlumnos")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => navigate("/admin/alumnos/lista")}
          >
            <FaGraduationCap style={iconStyle} /> Ver Alumnos
          </div>
          <div
            style={getNavItemStyle(hoveredItem === "agregarCarrera")}
            onMouseEnter={() => setHoveredItem("agregarCarrera")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => navigate("/admin/carrera/nueva")}
          >
            <FaGraduationCap style={iconStyle} /> Agregar Carreras
          </div>
          <div
            style={getNavItemStyle(hoveredItem === "verCarreras")}
            onMouseEnter={() => setHoveredItem("verCarreras")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => navigate("/admin/carrera/lista")}
          >
            <FaGraduationCap style={iconStyle} /> Ver Carreras
          </div>
          <div
            style={getNavItemStyle(hoveredItem === "asignarCarreras")}
            onMouseEnter={() => setHoveredItem("asignarCarreras")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => navigate("/admin/carrera/asignar")}
          >
            <FaGraduationCap style={iconStyle} /> Asignar Carreras
          </div>
          <div
            style={getNavItemStyle(hoveredItem === "cargarPagos")}
            onMouseEnter={() => setHoveredItem("cargarPagos")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => navigate("/admin/cargar/pago")}
          >
            <FaMoneyBill style={iconStyle} /> Cargar Pagos
          </div>
          <div
            style={getNavItemStyle(hoveredItem === "verPagos")}
            onMouseEnter={() => setHoveredItem("verPagos")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => navigate("/admin/ver/pago")}
          >
            <FaMoneyBill style={iconStyle} /> Ver Pagos
          </div>
        </nav>
      </aside>

      {/* === Área principal === */}
      <main style={mainContentStyle}>
        <div style={topBarStyle}>
          <span style={logoutStyle} onClick={logout}>
            Cerrar sesión
          </span>
        </div>

        <div style={welcomeBoxStyle}>
          <h2 style={welcomeText}>Bienvenido Al Dashboard Administrativo {username} {firstname}</h2>
          <p style={subtext}>Seleccioná una opción del menú para comenzar.</p>
        </div>
      </main>
    </div>
  );
}

// === ESTILOS ===

const dashboardWrapper: React.CSSProperties = {
  display: "flex",
  height: "100vh",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const sidebarStyle: React.CSSProperties = {
  width: "220px",
  background: "linear-gradient(to bottom, #1565c0, #1e88e5)",
  color: "white",
  display: "flex",
  flexDirection: "column",
  padding: "1.5rem 1rem",
};

const logoStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  marginBottom: "2rem",
  textAlign: "center",
};

const navStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const getNavItemStyle = (isHovered: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "1rem",
  cursor: "pointer",
  padding: "0.5rem 0.75rem",
  borderRadius: "6px",
  backgroundColor: isHovered ? "rgba(255,255,255,0.2)" : "transparent",
  transition: "background-color 0.2s ease",
});

const iconStyle: React.CSSProperties = {
  fontSize: "1.1rem",
};

const mainContentStyle: React.CSSProperties = {
  flexGrow: 1,
  backgroundColor: "#f5f5f5",
  padding: "2rem",
  position: "relative",
};

const topBarStyle: React.CSSProperties = {
  position: "absolute",
  top: "1rem",
  right: "2rem",
};

const logoutStyle: React.CSSProperties = {
  color: "#1565c0",
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "underline",
};

const welcomeBoxStyle: React.CSSProperties = {
  marginTop: "4rem",
  textAlign: "center",
};

const welcomeText: React.CSSProperties = {
  fontSize: "1.8rem",
  fontWeight: 700,
  color: "#333",
};

const subtext: React.CSSProperties = {
  marginTop: "1rem",
  color: "#555",
};

export default DashboardAdmin;
