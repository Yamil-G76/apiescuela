import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap, FaUser } from "react-icons/fa";

type AlumnoData = {
  usuario: string;
  firstname: string;
  lastname: string;
};

function DashboardAlumno() {
  const [alumno, setAlumno] = useState<AlumnoData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token inválido o sin permisos");
        return res.json();
      })
      .then((data: AlumnoData) => setAlumno(data))
      .catch((err) => {
        console.error("Error al obtener datos del estudiante:", err);
        navigate("/login");
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!alumno) return <p style={{ padding: "2rem" }}>Cargando datos...</p>;

  return (
    <div style={dashboardWrapper}>
      <aside style={sidebarStyle}>
        <div style={logoStyle}>Estudiante</div>
        <nav style={navStyle}>
          <div
            style={navItemStyle}
            onClick={() => navigate("/alumno/mis/pagos")}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <FaGraduationCap style={iconStyle} /> Mis pagos
          </div>
          <div
            style={navItemStyle}
            onClick={() => navigate("/alumno/mi/perfil")}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <FaUser style={iconStyle} /> Mi perfil
          </div>
        </nav>
      </aside>

      <main style={mainContentStyle}>
        <div style={topBarStyle}>
          <span style={logoutStyle} onClick={logout}>
            Cerrar sesión
          </span>
        </div>

        <div style={welcomeBoxStyle}>
          <h2 style={welcomeText}>Bienvenido, {alumno.firstname} {alumno.lastname}</h2>
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

const navItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "1rem",
  cursor: "pointer",
  padding: "0.5rem 0.75rem",
  borderRadius: "6px",
  transition: "background-color 0.2s ease",
};

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

export default DashboardAlumno;
