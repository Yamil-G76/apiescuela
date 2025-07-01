import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
type Alumno = {
   id: number;
   username: string;
   userdetail?: {
    dni: string;
    firstname: string;
    lastname: string;
    email: string;
    id_type: number;}
};

type Carrera = {
  id: number;
  name: string;
};

function AsignarCarrera() {

  const  navigate = useNavigate() 
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  const [carrerasAsignadas, setCarrerasAsignadas] = useState<Carrera[]>([]);
  const [carreraNueva, setCarreraNueva] = useState<number | "">("");

  // Traer alumnos al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://127.0.0.1:8000/users/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setAlumnos)
      .catch(console.error);
  }, []);

  // Traer carreras disponibles
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://127.0.0.1:8000/career/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCarreras)
      .catch(console.error);
  }, []);

  // Traer carreras asignadas cuando cambia el alumno seleccionado
  useEffect(() => {
    if (!alumnoSeleccionado) {
      setCarrerasAsignadas([]);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://127.0.0.1:8000/usuario/carrera/${alumnoSeleccionado.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCarrerasAsignadas)
      .catch(console.error);
  }, [alumnoSeleccionado]);

  // Asignar nueva carrera
  const handleAsignarCarrera = async () => {
    if (!alumnoSeleccionado || carreraNueva === "") {
      alert("Seleccioná alumno y carrera");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No autorizado");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/usuario/carrera/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_user: alumnoSeleccionado.id,
          id_carrera: carreraNueva,
        }),
      });

      if (res.ok) {
        alert("Carrera asignada con éxito");
        // Actualizo la lista de carreras asignadas
        const updated = await fetch(`http://127.0.0.1:8000/usuario/carrera/${alumnoSeleccionado.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await updated.json();
        setCarrerasAsignadas(data);
        setCarreraNueva("");
      } else {
        const err = await res.json();
        alert("Error al asignar: " + (err.detail || JSON.stringify(err)));
      }
    } catch (error) {
      console.error(error);
      alert("Error de red al asignar carrera");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Asignar Carrera a Usuario</h2>

      {/* Seleccionar alumno */}
      <label>Seleccionar Alumno:</label>
      <select
        value={alumnoSeleccionado?.id || ""}
        onChange={(e) => {
          const id = Number(e.target.value);
          const alumno = alumnos.find((a) => a.id === id) || null;
          setAlumnoSeleccionado(alumno);
        }}
        style={selectStyle}
      >
        <option value="">-- Seleccioná un alumno --</option>
        {alumnos.map((a) => (
          <option key={a.id} value={a.id}>
            {a.userdetail?.firstname} {a.userdetail?.lastname} ({a.username})
          </option>
        ))}
      </select>

      {/* Mostrar carreras asignadas */}
      {alumnoSeleccionado && (
        <>
          <h3>Carreras asignadas a  {alumnoSeleccionado.userdetail?.firstname}:</h3>
          {carrerasAsignadas.length === 0 ? (
            <p>No tiene carreras asignadas.</p>
          ) : (
            <ul>
              {carrerasAsignadas.map((c) => (
                <li key={c.id}>{c.name}</li>
              ))}
            </ul>
          )}

          {/* Seleccionar nueva carrera */}
          <label>Asignar nueva carrera:</label>
          <select
            value={carreraNueva}
            onChange={(e) => setCarreraNueva(Number(e.target.value))}
            style={selectStyle}
          >
            <option value="">-- Seleccioná una carrera --</option>
            {carreras
              .filter((c) => !carrerasAsignadas.some((ac) => ac.id === c.id))
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>

          <button style={buttonStyle} onClick={handleAsignarCarrera}>
            Asignar Carrera
          </button>
          <button
            type="button"
            style={{ ...buttonStyle, width: "60%", maxWidth: "280px" }}
            onClick={() => navigate("/dashboard")} >
              Cancelar
            </button>
        </>
      )}
    </div>
  );
}

// === Estilos ===
const containerStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "2rem auto",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  marginBottom: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#1976d2",
  color: "#fff",
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
};

export default AsignarCarrera;