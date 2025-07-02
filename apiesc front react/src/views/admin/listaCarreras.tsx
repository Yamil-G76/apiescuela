import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Tipo de datos que devuelve el backend
type Career = {
  id: number;
  name: string;
  costo_mensual: number;
  duracion_meses: number;
  inicio_cursado: string;
};

function VerCarreras() {
  const [carreras, setCarreras] = useState<Career[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/career/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token inválido");
        return res.json();
      })
      .then((data: Career[]) => {
        setCarreras(data);
      })
      .catch((err) => {
        console.error("Error al obtener carreras:", err);
        setError("No se pudieron cargar las carreras.");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const carrerasFiltradas = carreras.filter((carrera) =>
    carrera.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Listado de Carreras</h2>

        <input
          type="text"
          placeholder="Buscar carrera..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchStyle}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <table style={tableStyle}>
          <thead>
            <tr style={headerRowStyle}>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Mensualidad</th>
              <th style={thStyle}>Duración</th>
              <th style={thStyle}>Inicio</th>
            </tr>
          </thead>
          <tbody>
            {carrerasFiltradas.map((carrera) => (
              <tr key={carrera.id} style={rowStyle}>
                <td style={tdStyle}>{carrera.name}</td>
                <td style={tdStyle}>${carrera.costo_mensual}</td>
                <td style={tdStyle}>{carrera.duracion_meses} meses</td>
                <td style={tdStyle}>
                  {new Date(carrera.inicio_cursado).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={totalTextStyle}>Total de carreras: {carrerasFiltradas.length}</p>

        <p style={linkStyle} onClick={() => navigate("/dashboard")}>Volver al Dashboard</p>
      </div>
    </div>
  );
}

// === Estilos ===
const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(to right, #e9f1f7, #ffffff)",
  padding: "2rem",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "900px",
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "2rem",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  border: "1px solid #e0e0e0",
};

const titleStyle: React.CSSProperties = {
  color: "#1a237e",
  textAlign: "center",
  marginBottom: "1.5rem",
};

const searchStyle: React.CSSProperties = {
  marginBottom: "1.5rem",
  width: "100%",
  padding: "0.75rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const headerRowStyle: React.CSSProperties = {
  backgroundColor: "#1976d2",
  color: "white",
};

const thStyle: React.CSSProperties = {
  padding: "0.75rem",
  textAlign: "left",
};

const rowStyle: React.CSSProperties = {
  borderBottom: "1px solid #ccc",
};

const tdStyle: React.CSSProperties = {
  padding: "0.75rem",
};

const totalTextStyle: React.CSSProperties = {
  marginTop: "1.5rem",
  textAlign: "right",
  fontWeight: 600,
  color: "#333",
};

const linkStyle: React.CSSProperties = {
  marginTop: "2rem",
  textAlign: "center",
  color: "#1976d2",
  textDecoration: "underline",
  cursor: "pointer",
};

export default VerCarreras;
