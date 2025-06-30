import { useNavigate } from "react-router-dom";

function Forbidden() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>🚫 Acceso denegado</h1>
        <p style={textStyle}>No tenés permisos para ver esta página.</p>
        <button
          style={buttonStyle}
          onClick={() =>{ localStorage.removeItem("token"); navigate("/login")}}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#c62828")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#d32f2f")
          }
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

// === Estilos ===
const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#fce4ec",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "2rem 3rem",
  borderRadius: "12px",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  maxWidth: "400px",
};

const titleStyle: React.CSSProperties = {
  color: "#d32f2f",
  fontSize: "2rem",
  marginBottom: "1rem",
};

const textStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  color: "#555",
  marginBottom: "2rem",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#d32f2f",
  color: "#fff",
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "6px",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

export default Forbidden;