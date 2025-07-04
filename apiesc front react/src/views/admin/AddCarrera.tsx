import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CrearCarreraProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

function CrearCarrera({ onRequestClose }: CrearCarreraProps) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [costoMensual, setCostoMensual] = useState(0);
  const [duracionMeses, setDuracionMeses] = useState(0);
  const [inicioCursado, setInicioCursado] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No tienes permisos para crear carreras.");
      navigate("/login");
      return;
    }

    const nuevaCarrera = {
      name,
      costo_mensual: costoMensual,
      duracion_meses: duracionMeses,
      inicio_cursado: inicioCursado,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/Career/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaCarrera),
      });

      if (response.ok) {
        alert("Carrera creada con éxito");
        onRequestClose(); // Cierra el modal directamente
      } else {
        const errorData = await response.json();
        alert("Error al crear carrera: " + (errorData.detail || errorData));
      }
    } catch (err) {
      console.error("Error de red:", err);
      alert("Error de red al crear carrera");
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Crear Nueva Carrera</h2>

      <form onSubmit={handleSubmit}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Nombre de la carrera</label>
          <input
            type="text"
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Costo mensual</label>
          <input
            type="number"
            style={{ ...inputStyle, appearance: "textfield" }}
            value={costoMensual}
            onChange={(e) => setCostoMensual(Number(e.target.value))}
            required
            min={0}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Duración (meses)</label>
          <input
            type="number"
            style={{ ...inputStyle, appearance: "textfield" }}
            value={duracionMeses}
            onChange={(e) => setDuracionMeses(Number(e.target.value))}
            required
            min={1}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Inicio del cursado</label>
          <input
            type="date"
            style={inputStyle}
            value={inicioCursado}
            onChange={(e) => setInicioCursado(e.target.value)}
            required
          />
        </div>

        <div style={buttonGroupStyle}>
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1565c0")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
          >
            Crear Carrera
          </button>
          <button
            type="button"
            style={{ ...buttonStyle, backgroundColor: "#ccc", color: "#333" }}
            onClick={onRequestClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

// === Estilos ===

const cardStyle: React.CSSProperties = {
  maxWidth: "520px",
  width: "100%",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "2rem",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
  border: "1px solid #e0e0e0",
  color: "#333333",
};

const titleStyle: React.CSSProperties = {
  color: "#1a237e",
  textAlign: "center",
  marginBottom: "1.5rem",
};

const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "1.2rem",
};

const labelStyle: React.CSSProperties = {
  fontWeight: "600",
  color: "#333333",
  marginBottom: "0.5rem",
};

const inputStyle: React.CSSProperties = {
  borderRadius: "6px",
  border: "1px solid #ccc",
  backgroundColor: "#f9f9f9",
  color: "#333",
  padding: "0.75rem",
  fontSize: "1rem",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  marginTop: "1.5rem",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.6rem 1.4rem",
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "1rem",
};

export default CrearCarrera;