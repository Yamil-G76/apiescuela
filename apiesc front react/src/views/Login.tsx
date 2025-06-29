
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa" ; // ← Íconos sociales
type LoginProcessResponse = {
  success: boolean;
  token: string;
  message: string;
};
function Login() {
  const BACKEND_IP = "localhost";
  const BACKEND_PORT = "8000";
  const ENDPOINT = "users/login";
  const LOGIN_URL = `http://${BACKEND_IP}:${BACKEND_PORT}/${ENDPOINT}`;

  const navigate = useNavigate();
  const userInputRef = useRef<HTMLInputElement>(null);
  const passInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  function loginProcess(dataObject: LoginProcessResponse) {
    if (dataObject.success === true && dataObject.token) {
      localStorage.setItem("token", dataObject.token );
      setMessage("Iniciando sesión...");
      navigate("/dashboard");

    } else {
      setMessage(dataObject.message ?? "Error desconocido");
    }
  } 
  

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const username = userInputRef.current?.value ?? "";
    const password = passInputRef.current?.value ?? "";

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ username, password });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch(LOGIN_URL, requestOptions)
      .then((respond) => respond.json())
      .then((dataObject) => loginProcess(dataObject))
      .catch((error) => console.log("error", error));
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* === LOGO INSTITUCIONAL (ficticio) === */}
        <div style={logoStyle}>
          🎓 Colegio Mariano
        </div>

        <h2 style={titleStyle}>Iniciar sesión</h2>

        <form onSubmit={handleLogin}>
          {/* === Usuario === */}
          <div style={inputGroupStyle}>
            <label htmlFor="inputUser" style={labelStyle}>
              Usuario
            </label>
            <input
              type="text"
              id="inputUser"
              ref={userInputRef}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1976d2")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
            />
          </div>

          {/* === Contraseña === */}
          <div style={inputGroupStyle}>
            <label htmlFor="exampleInputPassword1" style={labelStyle}>
              Contraseña
            </label>
            <input
              type="password"
              id="exampleInputPassword1"
              ref={passInputRef}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1976d2")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
            />
          </div>

          {/* === Botón Ingresar (centrado + ancho) === */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="submit"
              style={{
                ...buttonStyle,
                width: "60%",
                maxWidth: "280px",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#1565c0")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#1976d2")
              }
            >
              Ingresar
            </button>
          </div>

          {/* === Link Crear cuenta === */}
          <p style={linkStyle} onClick={() => navigate("/singin")}>
            Crear una cuenta nueva
          </p>

          {/* === Mensaje login === */}
          {message && (
            <div
              className="mt-3 text-center"
              style={messageStyle(message.includes("success"))}
            >
              {message}
            </div>
          )}
        </form>

        {/* === Redes sociales === */}
        <div style={socialContainerStyle}>
          <a href="#" style={iconStyle}><FaFacebookF /></a>
          <a href="#" style={iconStyle}><FaInstagram /></a>
          <a href="#" style={iconStyle}><FaTwitter /></a>
        </div>
      </div>
    </div>
  );
}

// === ESTILOS ===

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

const linkStyle: React.CSSProperties = {
  marginTop: "1rem",
  color: "#1976d2",
  textDecoration: "underline",
  textAlign: "center",
  cursor: "pointer",
  fontWeight: "500",
};

const messageStyle = (isSuccess: boolean): React.CSSProperties => ({
  color: isSuccess ? "#2e7d32" : "#d32f2f",
  fontWeight: "500",
  marginTop: "1rem",
  textAlign: "center",
});

/*const forgotPasswordStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "#888",
  marginTop: "1rem",
  textAlign: "center",
};*/

const socialContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  marginTop: "2rem",
};

const iconStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  color: "#1976d2",
  textDecoration: "none",
};

export default Login;
