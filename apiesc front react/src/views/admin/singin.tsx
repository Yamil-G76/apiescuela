import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Singin() {
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
      type: 2, // tipo alumno
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/user/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        alert("Usuario creado con éxito");
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        alert("Error al crear usuario: " + (errorData.detail || errorData));
      }
    } catch (err) {
      console.error("Error de red:", err);
      alert("Error de red al crear usuario");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Crear cuenta</h2>

        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Nombre de usuario</label>
            <input type="text" style={inputStyle} value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Nombre</label>
            <input type="text" style={inputStyle} value={firstname} onChange={(e) => setFirstname(e.target.value)} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Apellido</label>
            <input type="text" style={inputStyle} value={lastname} onChange={(e) => setLastname(e.target.value)} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Contraseña</label>
            <input type="password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Repetir contraseña</label>
            <input type="password" style={inputStyle} value={repassword} onChange={(e) => setRepassword(e.target.value)} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>DNI</label>
            <input type="text" style={inputStyle} value={dni} onChange={(e) => setDni(e.target.value)} />
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button
              type="submit"
              style={{ ...buttonStyle, width: "60%", maxWidth: "280px" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1565c0")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
            >
              Crear cuenta
            </button>
            <button
              type="button"
              style={{ ...buttonStyle, width: "60%", maxWidth: "280px" }}
              onClick={() => navigate("/dashboard")}
            >
              Cancelar
            </button>
          </div>
        </form>
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
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  padding: "2rem",
};

const cardStyle: React.CSSProperties = {
  maxWidth: "500px",
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
  transition: "border-color 0.3s",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#1976d2",
  border: "none",
  color: "#ffffff",
  fontWeight: "600",
  padding: "0.75rem",
  borderRadius: "6px",
  fontSize: "1rem",
  marginTop: "0.75rem",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

export default Singin;