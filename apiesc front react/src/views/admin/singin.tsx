import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Singin({ onSuccess, onClose }: { onSuccess?: () => void; onClose?: () => void }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [dni, setDni] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No tienes permisos para crear usuarios.");
      navigate("/login");
      return;
    }

    const nuevoUsuario = {
      username,
      password,
      dni,
      firstname,
      lastname,
      email,
      type: 2,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/user/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        alert("Usuario creado con éxito");
        onSuccess?.();
      } else {
        const errorData = await response.json();
        alert("Error: " + (errorData.detail || "No se pudo crear el usuario"));
      }
    } catch (err) {
      console.error("Error de red:", err);
      alert("Error de red al crear usuario");
    }
  };

  return (
    <div style={modalStyle}>
      <button style={closeButtonStyle} onClick={onClose}>×</button>

      <h2 style={titleStyle}>Crear cuenta</h2>

      <form onSubmit={handleSubmit}>
        <div style={rowStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Nombre</label>
            <input type="text" style={inputStyle} value={firstname} onChange={(e) => setFirstname(e.target.value)} />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Apellido</label>
            <input type="text" style={inputStyle} value={lastname} onChange={(e) => setLastname(e.target.value)} />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Usuario</label>
            <input type="text" style={inputStyle} value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Contraseña</label>
            <input type="password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Repetir contraseña</label>
            <input type="password" style={inputStyle} value={repassword} onChange={(e) => setRepassword(e.target.value)} />
          </div>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>DNI</label>
          <input type="text" style={inputStyle} value={dni} onChange={(e) => setDni(e.target.value)} />
        </div>

        <div style={{ textAlign: "right" }}>
          <button type="submit" style={buttonStyle}>Crear cuenta</button>
        </div>
      </form>
    </div>
  );
}

// === ESTILOS ===

const modalStyle: React.CSSProperties = {
  position: "relative",
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "2rem",
  width: "90%",
  maxWidth: "600px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  maxHeight: "90vh",
  overflowY: "auto",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const closeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "15px",
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
  color: "#555",
};

const titleStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#1a237e",
  marginBottom: "1rem",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
};

const inputGroupStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  marginBottom: "1rem",
  minWidth: "200px",
};

const labelStyle: React.CSSProperties = {
  fontWeight: "bold",
  marginBottom: "0.3rem",
};

const inputStyle: React.CSSProperties = {
  padding: "0.5rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  padding: "0.75rem 1.5rem",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default Singin;
