import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function DashboardAlumno() {
  const navigate = useNavigate();
  const userLs = localStorage.getItem("user");
  const user = JSON.parse(userLs || "{}");
  const firstname = user.firstname;
  const type = user.type;

  const [carreras, setCarreras] = useState<string[]>([]);

  // Simulamos carreras inscriptas (más adelante esto puede venir del backend)
  useEffect(() => {
    setCarreras(["Tecnicatura en Programación", "Analista de Sistemas"]);
  }, []);

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div style={wrapperStyle}>
      {/* === Barra lateral === */}
      <div style={sidebarStyle}>
        <h2 style={logoStyle}>Mi Escuela</h2>
        <ul style={navListStyle}>
          <li style={navItemStyle}>Inicio</li>
          <li style={navItemStyle}>Mis pagos</li>
        </ul>
      </div>

      {/* === Contenido principal === */}
      <div style={mainContentStyle}>
        <div style={topBarStyle}>
          <span onClick={logout} style={logoutLinkStyle}>
            Cerrar sesión
          </span>
        </div>

        <div style={contentStyle}>
          <h1 style={welcomeStyle}>Bienvenido {type} {firstname}</h1>
          <p style={sectionTitleStyle}>Tus carreras inscriptas:</p>
          <ul style={careerListStyle}>
            {carreras.map((carrera, index) => (
              <li key={index} style={careerItemStyle}>{carrera}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// === ESTILOS ===
const wrapperStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const sidebarStyle: React.CSSProperties = {
  width: "220px",
  backgroundColor: "#1a237e",
  color: "white",
  padding: "2rem 1rem",
};

const logoStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "2rem",
};

const navListStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
};

const navItemStyle: React.CSSProperties = {
  marginBottom: "1rem",
  cursor: "pointer",
  fontWeight: "500",
};

const mainContentStyle: React.CSSProperties = {
  flexGrow: 1,
  background: "linear-gradient(to right, #e9f1f7, #ffffff)",
  padding: "2rem",
  position: "relative",
};

const topBarStyle: React.CSSProperties = {
  position: "absolute",
  top: "1rem",
  right: "2rem",
};

const logoutLinkStyle: React.CSSProperties = {
  color: "#1976d2",
  cursor: "pointer",
  textDecoration: "underline",
  fontWeight: 500,
};

const contentStyle: React.CSSProperties = {
  marginTop: "3rem",
};

const welcomeStyle: React.CSSProperties = {
  fontSize: "1.75rem",
  color: "#1a237e",
};

const sectionTitleStyle: React.CSSProperties = {
  marginTop: "2rem",
  fontWeight: "600",
  color: "#333",
};

const careerListStyle: React.CSSProperties = {
  paddingLeft: "1.25rem",
  marginTop: "0.5rem",
};

const careerItemStyle: React.CSSProperties = {
  marginBottom: "0.5rem",
  color: "#444",
};

export default DashboardAlumno;
