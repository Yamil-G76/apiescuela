import { useEffect, useState } from "react";
import Modal from "react-modal";

type Alumno = {
  id: number;
  username: string;
  userdetail?: {
    dni: string;
    firstname: string;
    lastname: string;
    email: string;
    id_type: number;
  };
};

type Carrera = {
  id: number;
  name: string;
};

interface AsignarCarreraProps {
  isOpen: boolean;
  onRequestClose: () => void;
  alumno?: Alumno | null;
}

function AsignarCarrera({ isOpen, onRequestClose, alumno }: AsignarCarreraProps) {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [carrerasAsignadas, setCarrerasAsignadas] = useState<Carrera[]>([]);
  const [carreraNueva, setCarreraNueva] = useState<number | "">("");

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

  useEffect(() => {
    if (!alumno) {
      setCarrerasAsignadas([]);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://127.0.0.1:8000/usuario/carrera/${alumno.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCarrerasAsignadas)
      .catch(console.error);
  }, [alumno]);

  const handleAsignarCarrera = async () => {
    if (!alumno || carreraNueva === "") {
      alert("Seleccioná una carrera");
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
          id_user: alumno.id,
          id_carrera: carreraNueva,
        }),
      });

      if (res.ok) {
        alert("Carrera asignada con éxito");
        onRequestClose();
      } else {
        const err = await res.json();
        alert("Error al asignar: " + (err.detail || JSON.stringify(err)));
      }
    } catch (error) {
      console.error(error);
      alert("Error de red");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyle}
    >
      <div style={containerStyle}>
        <h2>Asignar Carrera a {alumno?.userdetail?.firstname}</h2>

        <div style={scrollableContent}>
          {alumno && (
            <>
              <h3>Carreras asignadas:</h3>
              {carrerasAsignadas.length === 0 ? (
                <p>No tiene carreras asignadas.</p>
              ) : (
                <ul style={listaCarrerasAsignadasStyle}>
                  {carrerasAsignadas.map((c) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
                </ul>
              )}

              <label>Nueva carrera:</label>
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
            </>
          )}
        </div>

        <div style={buttonRow}>
          <button style={buttonStyle} onClick={handleAsignarCarrera}>
            Asignar
          </button>
          <button
            style={{ ...buttonStyle, backgroundColor: "#ccc", color: "#333" }}
            onClick={onRequestClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
}

// === ESTILOS ===

const modalStyle: Modal.Styles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "2rem",
    borderRadius: "12px",
    background: "#fff",
    width: "90%",
    maxWidth: "500px",
    height: "420px",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const scrollableContent: React.CSSProperties = {
  flex: 1,
  marginTop: "1rem",
  paddingRight: "0.5rem",
  display: "flex",
  flexDirection: "column",
};

const listaCarrerasAsignadasStyle: React.CSSProperties = {
  flexShrink: 0,
  maxHeight: "140px",
  overflowY: "auto",
  marginBottom: "1rem",
  paddingLeft: "1rem", // solo indentado básico
  listStyle: "disc",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  marginTop: "0.5rem",
  marginBottom: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const buttonRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "1rem",
  marginTop: "1rem",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#1976d2",
  color: "#fff",
  padding: "0.6rem 1.2rem",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
};

export default AsignarCarrera;