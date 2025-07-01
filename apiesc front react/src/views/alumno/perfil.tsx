import { useEffect, useState } from "react";

type AlumnoData = {
  usuario: string;
  firstname: string;
  lastname: string;
  dni: string;
  email: string;
};

function MiPerfil() {
  const [alumno, setAlumno] = useState<AlumnoData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setAlumno)
      .catch((err) => console.error("Error:", err));
  }, []);

  if (!alumno) return <p style={{ padding: "2rem" }}>Cargando perfil...</p>;

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: "1.5rem", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h2 style={{ marginBottom: "1rem", color: "#1565c0" }}>Mi Perfil</h2>
      <div style={rowStyle}><strong>Nombre:</strong> {alumno.firstname} {alumno.lastname}</div>
      <div style={rowStyle}><strong>Usuario:</strong> {alumno.usuario}</div>
      <div style={rowStyle}><strong>DNI:</strong> {alumno.dni}</div>
      <div style={rowStyle}><strong>Email:</strong> {alumno.email}</div>
    </div>
  );
}

const rowStyle: React.CSSProperties = {
  marginBottom: "1rem",
  fontSize: "1rem",
  color: "#444",
};

export default MiPerfil;