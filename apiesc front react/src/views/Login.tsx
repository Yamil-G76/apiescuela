import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode }   from "jwt-decode";

type LoginProcessResponse = {
  success: boolean;
  token?: string;
  message?: string;
};

type TokenPayload = {
  usuario: {
    idusuario: number;
    usuario: string;
    type: string;
  };
  iat: number;
  exp: number;
};

function Login() {
  const BACKEND_URL = "http://localhost:8000/users/login";
  const navigate = useNavigate();
  const userInputRef = useRef<HTMLInputElement>(null);
  const passInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  function loginProcess(dataObject: LoginProcessResponse) {
    if (dataObject.success && dataObject.token) {
      localStorage.setItem("token", dataObject.token);

      try {
        const decoded: TokenPayload = jwtDecode(dataObject.token);
        const tipo = decoded.usuario.type;

        if (tipo === "admin") {
          navigate("/Dashboard");
        } else {
          navigate("/alumno/dashboard");
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setMessage("Token inválido");
      }
    } else {
      setMessage(dataObject.message ?? "Usuario o contraseña incorrectos");
    }
  }

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const username = userInputRef.current?.value ?? "";
    const password = passInputRef.current?.value ?? "";

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    };

    fetch(BACKEND_URL, requestOptions)
      .then((res) => res.json())
      .then((dataObject) => loginProcess(dataObject))
      .catch((error) => {
        console.error("Error de red:", error);
        setMessage("Error al conectar con el servidor");
      });
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>🎓 Colegio Mariano</div>
        <h2 style={titleStyle}>Iniciar sesión</h2>

        <form onSubmit={handleLogin}>
          <div style={inputGroupStyle}>
            <label htmlFor="inputUser" style={labelStyle}>Usuario</label>
            <input
              type="text"
              id="inputUser"
              ref={userInputRef}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1976d2")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="inputPass" style={labelStyle}>Contraseña</label>
            <input
              type="password"
              id="inputPass"
              ref={passInputRef}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1976d2")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="submit"
              style={{ ...buttonStyle, width: "60%", maxWidth: "280px" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1565c0")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
            >
              Ingresar
            </button>
          </div>



          {message && (
            <div style={messageStyle(false)}>{message}</div>
          )}
        </form>
      </div>
    </div>
  );
}

// === ESTILOS (sin cambios) ===
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
  maxWidth: "400px",
  width: "100%",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "2rem",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
  border: "1px solid #e0e0e0",
  color: "#333333",
};

const logoStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#1a237e",
  marginBottom: "1rem",
  textAlign: "center",
};

const titleStyle: React.CSSProperties = {
  color: "#1a237e",
  textAlign: "center",
  marginBottom: "1.5rem",
};

const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "1.5rem",
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



const messageStyle = (isSuccess: boolean): React.CSSProperties => ({
  color: isSuccess ? "#2e7d32" : "#d32f2f",
  fontWeight: "500",
  marginTop: "1rem",
  textAlign: "center",
});

export default Login;