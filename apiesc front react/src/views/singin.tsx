
import { useNavigate } from "react-router-dom";

function Singin() {
 const navigate = useNavigate();
    
/*const cancelarbutton = document.getElementById("cancelar")
const crearbutton = document.getElementById("crear")

const userInput = document.getElementById("usuario");
const contraseñaInput = document.getElementById("password");
const nombreInput = document.getElementById("firstname");
const apellidoInput = document.getElementById("lastname");

const emailInput = document.getElementById("email");
const dniInput = document.getElementById("dni");
const typeInput = document.getElementById("type");


const resultContainer = document.getElementById("CrearResultContainer")

cancelarbutton.addEventListener("click", () => {
    window.location.href = "login.html";
});



crearbutton.addEventListener("click", (evento) => {
    evento.preventDefault(); // Evita el envío predeterminado del formulario
    handleUser2(); // Llama a tu función handleUser
   });
      
   function handleUser2() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
   
    const raw = JSON.stringify({
   
      username: userInput.value,
      password: contraseñaInput.value,
      firstname: nombreInput.value,
      lastname: apellidoInput.value ,
      email: emailInput.value ,
      dni: dniInput.value,
      type: typeInput.value  
    });
   
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
   
    fetch("http://127.0.0.1:8000/users/new/", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

    if (result="usuario agregado"){
 
      resultContainer.textContent = "Usuario agregado exitosamente"
      
      setTimeout(() =>{window.location.href = "login.html";},3000);
               
    }
    else {
      resultContainer.textContent = "error al crear usuario  # "+ result;

    }

}*/ 


  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Crear cuenta</h2>
        <form>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Nombre</label>
            <input type="text" style={inputStyle} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Apellido</label>
            <input type="text" style={inputStyle} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input type="email" style={inputStyle} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Contraseña</label>
            <input type="password" style={inputStyle} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Repetir contraseña</label>
            <input type="password" style={inputStyle} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>DNI</label>
            <input type="text" style={inputStyle} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Teléfono</label>
            <input type="text" style={inputStyle} />
          </div>

          <button type="submit" style={buttonStyle}>Crear cuenta</button>
          <button type="button" style={buttonStyle} onClick={()=>navigate("/login")}>volver al login</button> 
        </form>
      </div>
    </div>
 
  )
}


 const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#121212",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  padding: "2rem",
  overflowY: "auto", // para que no quede bloqueado en pantallas chicas
};

 const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "500px",
  backgroundColor: "#1e1e1e",
  borderRadius: "10px",
  padding: "2rem",
  boxShadow: "0 12px 24px rgba(0,0,0,0.6)",
  border: "1px solid #2a2a2a",
  color: "#e0e0e0",
};

 const titleStyle: React.CSSProperties = {
  color: "#ffffff",
  textAlign: "center",
  marginBottom: "2rem",
};

 const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "1.5rem",
};

 const labelStyle: React.CSSProperties = {
  fontWeight: "500",
  color: "#cccccc",
  marginBottom: "0.5rem",
};

 const inputStyle: React.CSSProperties = {
  borderRadius: "6px",
  border: "1px solid #444",
  backgroundColor: "#2a2a2a",
  color: "#f5f5f5",
  padding: "0.75rem",
  fontSize: "1rem",
  transition: "border-color 0.3s, box-shadow 0.3s",
  outline: "none",
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
  cursor: "pointer",
  marginTop: "1.5rem",
  width: "100%",
};
export default Singin