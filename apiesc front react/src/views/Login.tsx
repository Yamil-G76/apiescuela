import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


type LoginProcessResponse = {
 status: string;
 token?: string;
 user?: unknown;
 message?: string;
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
   if (dataObject.status === "success") {
     localStorage.setItem("token", dataObject.token ?? "");
     localStorage.setItem("user", JSON.stringify(dataObject.user));
     setMessage("Initiating session...");
     navigate("/dashboard");
   } else {
     setMessage(dataObject.message ?? "Unknown error");
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
        <h2 className="text-center mb-4" style={titleStyle}>
          Iniciar sesión
        </h2>
 
<form onSubmit={handleLogin}>
  <div style={inputGroupStyle}>
    <label htmlFor="inputUser" style={labelStyle}>
      Usuario
    </label>
    <input
      type="text"
      id="inputUser"
      ref={userInputRef}
      style={inputStyle}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#4f9ded")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#444")}
    />
  </div>

  <div style={inputGroupStyle}>
    <label htmlFor="exampleInputPassword1" style={labelStyle}>
      Contraseña
    </label>
    <input
      type="password"
      id="exampleInputPassword1"
      ref={passInputRef}
      style={inputStyle}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#4f9ded")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#444")}
    />
  </div>

  <button
    type="submit"
    style={buttonStyle}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3b7dc4")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f9ded")}
  >
    Ingresar
  </button>
  <button onClick={()=>navigate("/singin")}
    type="button" 
    style={buttonStyle}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3b7dc4")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f9ded")}
  >
    Create una cuenta nueva
  </button>

  {message && (
    <div className="mt-3 text-center" style={messageStyle(message.includes("success"))}>
      {message}
    </div>
  )}
</form>

        <div className="text-center mt-3" style={forgotPasswordStyle}>
         
        </div>
      </div>
    </div>
  );
};



const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "1.5rem", // separación entre los campos
};

const labelStyle: React.CSSProperties = {
  fontWeight: "500",
  color: "#cccccc",
  marginBottom: "0.5rem", // separación entre label e input
};

 const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#121212",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  padding: "1rem",
};

 const cardStyle: React.CSSProperties = {
  maxWidth: "400px",
  width: "100%",
  backgroundColor: "#1e1e1e",
  borderRadius: "10px",
  padding: "2rem",
  boxShadow: "0 12px 24px rgba(0,0,0,0.6)",
  border: "1px solid #2a2a2a",
  color: "#e0e0e0",
  transition: "transform 0.3s ease-in-out",
};

 const titleStyle: React.CSSProperties = {
  color: "#ffffff",
};


 const inputStyle: React.CSSProperties = {
  borderRadius: "6px",
  border: "1px solid #444",
  backgroundColor: "#2a2a2a",
  color: "#f5f5f5",
  padding: "0.75rem",
  fontSize: "1rem",
  transition: "border-color 0.3s",
};


 const buttonStyle: React.CSSProperties = {
  backgroundColor: "#4f9ded",
  borderColor: "#4f9ded",
  color: "#ffffff",
  fontWeight: "600",
  padding: "0.75rem",
  borderRadius: "6px",
  fontSize: "1rem",
  transition: "background-color 0.3s ease",
};

 const messageStyle = (isSuccess: boolean): React.CSSProperties => ({
  color: isSuccess ? "lightgreen" : "#ff5c5c",
  fontWeight: "500",
});

 const forgotPasswordStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "#888",
};



 export default Login;