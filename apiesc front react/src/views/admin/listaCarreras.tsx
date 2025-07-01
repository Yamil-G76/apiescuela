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
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Listado de Carreras</h2>

        {carreras.length === 0 ? (
          <p style={{ textAlign: "center", margin: "2rem" }}>No hay carreras registradas.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={td}>Nombre</th>
                <th style={td}>Mensualidad</th>
                <th style={td}>Duración</th>
                <th style={td}>Inicio</th>
              </tr>
            </thead>
            <tbody>
              {carreras.map((carrera) => (
                <tr key={carrera.id}>
                  <td style={td}>{carrera.name}</td>
                  <td style={td}>${carrera.costo_mensual}</td>
                  <td style={td}>{carrera.duracion_meses} meses</td>
                  <td style={td}>{new Date(carrera.inicio_cursado).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button style={buttonStyle} onClick={() => navigate("/dashboard")}>
            Volver al Dashboard
          </button>
        </div>
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
  background: "linear-gradient(to right, #f3f8fc, #ffffff)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  padding: "2rem",
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
  textAlign: "center",
  color: "#1a237e",
  marginBottom: "1.5rem",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const td : React.CSSProperties ={
    border:"1px solid #ccc",
    padding:"0.75rem",
    textAlign:"left",
}




const buttonStyle: React.CSSProperties = {
  backgroundColor: "#1976d2",
  border: "none",
  color: "#fff",
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  fontWeight: 600,
  borderRadius: "6px",
  cursor: "pointer",
};



export default VerCarreras;