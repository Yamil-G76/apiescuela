import { useNavigate } from "react-router-dom";

function Dashboard() {
 const navigate = useNavigate();
 const userLs =localStorage.getItem("user");
const user = JSON.parse(userLs || "{}")
const firstname = user.firstname
const type = user.type

console.log(user) 

function logout (){
 localStorage.removeItem("user")
 localStorage.removeItem("token")
 navigate("/login")
  }

  return (
    <div style={pageWrapperStyle}>
      {/* Espacio para encabezado */}
      <div style={headerPlaceholderStyle}>
        {/* Acá podés poner luego tu componente Header */}
      </div>

      {/* Contenido centrado */}
      <div style={cardStyle}>
        <div style={welcomeTextStyle}>
          Bienvenido {type} {firstname} a tu dashboard
        </div>

        <div style={dividerStyle}></div>

        <button style={buttonStyle} onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
  

const pageWrapperStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#121212",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const headerPlaceholderStyle: React.CSSProperties = {
  height: "60px", // o el alto que tendrá tu Header
  backgroundColor: "#1a1a1a",
  borderBottom: "1px solid #2a2a2a",
};

const cardStyle: React.CSSProperties = {
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
};

const welcomeTextStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: "600",
  marginBottom: "1rem",
  color: "#ffffff",
  textAlign: "center",
};

const dividerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "400px",
  height: "1px",
  backgroundColor: "#444",
  margin: "1rem 0",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#4f9ded",
  borderColor: "#4f9ded",
  color: "#ffffff",
  fontWeight: "600",
  padding: "0.75rem 1.5rem",
  borderRadius: "6px",
  fontSize: "1rem",
  transition: "background-color 0.3s ease",
  cursor: "pointer",
};


export default Dashboard