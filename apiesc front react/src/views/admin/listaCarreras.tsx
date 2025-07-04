import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import CrearCarrera from "./AddCarrera"; // Asegúrate de que esté importado el componente CrearCarrera
import AsignarCarrera from "./asignarCarreras"; // Asegúrate de que esté importado el componente AsignarCarrera

// Tipo de datos que devuelve el backend
type Career = {
  id: number;
  name: string;
  costo_mensual: number;
  duracion_meses: number;
  inicio_cursado: string;
};

function ListaCarreras() {
  const [carreras, setCarreras] = useState<Career[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [modalCrearCarreraAbierto, setModalCrearCarreraAbierto] = useState(false); // Estado para abrir el modal Crear Carrera
  const [modalAsignarCarreraAbierto, setModalAsignarCarreraAbierto] = useState(false); // Estado para abrir el modal Asignar Carrera
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
        {/* Título y buscador */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>Listado de Carreras</h2>
          <input
            type="text"
            placeholder="Buscar carrera..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchStyle}
            aria-label="Buscar carrera"
          />
        </div>

        {/* Mensaje de error */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Mensaje cuando no se encuentran carreras */}
        {carrerasFiltradas.length === 0 && !error && (
          <p style={{ textAlign: "center", color: "#888" }}>No se encontraron carreras.</p>
        )}

        {/* Tabla de carreras */}
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

        {/* Total de carreras */}
        <p style={totalTextStyle}>Total de carreras: {carrerasFiltradas.length}</p>

        {/* Botones para crear y asignar carrera */}
        <div style={buttonContainerStyle}>
          <button
            onClick={() => setModalCrearCarreraAbierto(true)} // Abre el modal de CrearCarrera
            style={buttonCrearCarreraStyle}
          >
            Crear Carrera
          </button>
          <button
            onClick={() => setModalAsignarCarreraAbierto(true)} // Abre el modal de AsignarCarrera
            style={buttonCrearCarreraStyle}
          >
            Asignar Carrera
          </button>
        </div>
      </div>

      {/* Modal para Crear Carrera */}
      <Modal
        isOpen={modalCrearCarreraAbierto}
        onRequestClose={() => setModalCrearCarreraAbierto(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "0",
            border: "none",
            background: "none",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          },
        }}
      >
        <div style={{ position: "relative", background: "#fff", padding: "2rem", borderRadius: "12px" }}>
          <button
            onClick={() => setModalCrearCarreraAbierto(false)}
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.8rem",
              background: "transparent",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#999",
            }}
          >
            ×
          </button>

          <CrearCarrera isOpen={modalCrearCarreraAbierto} onRequestClose={() => setModalCrearCarreraAbierto(false)} />
        </div>
      </Modal>

      {/* Modal para Asignar Carrera */}
      <Modal
        isOpen={modalAsignarCarreraAbierto}
        onRequestClose={() => setModalAsignarCarreraAbierto(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "0",
            border: "none",
            background: "none",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          },
        }}
      >
        <div style={{ position: "relative", background: "#fff", padding: "2rem", borderRadius: "12px" }}>
          <button
            onClick={() => setModalAsignarCarreraAbierto(false)}
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.8rem",
              background: "transparent",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#999",
            }}
          >
            ×
          </button>

          <AsignarCarrera isOpen={modalAsignarCarreraAbierto} onRequestClose={() => setModalAsignarCarreraAbierto(false)} />
        </div>
      </Modal>
    </div>
  );
}

// === Estilos ===
const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start", 
  justifyContent: "flex-start", 
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

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
  width: "100%",
};

const titleStyle: React.CSSProperties = {
  color: "#1a237e",
  textAlign: "left",
  marginBottom: "0",
};

const searchStyle: React.CSSProperties = {
  padding: "0.75rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "300px",
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

const buttonCrearCarreraStyle: React.CSSProperties = {
  backgroundColor: "#1976d2",
  color: "white",
  padding: "0.75rem 1.5rem",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  border: "none",
  marginTop: "1.5rem",
  display: "block",
  marginLeft: "auto", 
};

const buttonContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "1rem", 
};

export default ListaCarreras;
