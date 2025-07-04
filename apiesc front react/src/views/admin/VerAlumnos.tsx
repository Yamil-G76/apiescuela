import { useEffect, useState } from "react";
import Modal from "react-modal";
import Singin from "./singin";
import AsignarCarrera from "./asignarCarreras";
import { FaUserGraduate } from "react-icons/fa";

Modal.setAppElement("#root");

type User = {
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

function VerAlumnos() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mostrarModalSingin, setMostrarModalSingin] = useState(false);
  const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<User | null>(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/users/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener usuarios");
        return res.json();
      })
      .then((data: User[]) => {
        setUsuarios(data);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar los usuarios.");
      });
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.username.toLowerCase().includes(term) ||
      u.userdetail?.firstname.toLowerCase().includes(term) ||
      u.userdetail?.lastname.toLowerCase().includes(term) ||
      u.userdetail?.email.toLowerCase().includes(term)
    );
  });

  const abrirAsignarCarrera = (alumno: User) => {
    setAlumnoSeleccionado(alumno);
    setModalAsignarAbierto(true);
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Lista de Usuarios</h2>

      <div style={topControlsStyle}>
        <input
          type="text"
          placeholder="Buscar por nombre, usuario, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        <button
          onClick={() => setMostrarModalSingin(true)}
          style={agregarButtonStyle}
        >
          Agregar Alumno
        </button>
      </div>

      <p style={subTextStyle}>Total: {usuariosFiltrados.length} usuarios</p>

      {error && <p style={errorStyle}>{error}</p>}

      <div style={tableScrollContainer}>
        <table style={tableStyle}>
          <thead>
            <tr style={theadRowStyle}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Usuario</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Apellido</th>
              <th style={thStyle}>Correo</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.id} style={trStyle}>
                <td style={tdStyle}>{u.id}</td>
                <td style={tdStyle}>{u.username}</td>
                <td style={tdStyle}>{u.userdetail?.firstname}</td>
                <td style={tdStyle}>{u.userdetail?.lastname}</td>
                <td style={tdStyle}>{u.userdetail?.email}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => abrirAsignarCarrera(u)}
                    style={iconButtonStyle}
                    title="Asignar carrera"
                  >
                    <FaUserGraduate />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal agregar alumno */}
      <Modal
        isOpen={mostrarModalSingin}
        onRequestClose={() => setMostrarModalSingin(false)}
        style={modalSinginStyle}
      >
        <Singin
          onSuccess={() => {
            setMostrarModalSingin(false);
            cargarUsuarios();
          }}
          onClose={() => setMostrarModalSingin(false)}
        />
      </Modal>

      {/* Modal asignar carrera */}
      <AsignarCarrera
        isOpen={modalAsignarAbierto}
        onRequestClose={() => setModalAsignarAbierto(false)}
        alumno={alumnoSeleccionado}
      />
    </div>
  );
}

// === ESTILOS ===

const containerStyle: React.CSSProperties = {
  padding: "2rem",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: "#f9f9f9",
  height: "100%",
};

const titleStyle: React.CSSProperties = {
  fontSize: "1.8rem",
  fontWeight: "bold",
  color: "#1a237e",
  marginBottom: "0.8rem",
};

const topControlsStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  flexWrap: "wrap",
  gap: "1rem",
};

const agregarButtonStyle: React.CSSProperties = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  height: "2.75rem",
};

const subTextStyle: React.CSSProperties = {
  marginBottom: "1rem",
  color: "#555",
};

const searchInputStyle: React.CSSProperties = {
  flexGrow: 1,
  maxWidth: "400px",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const errorStyle: React.CSSProperties = {
  color: "red",
  marginBottom: "1rem",
};

const tableScrollContainer: React.CSSProperties = {
  overflowY: "auto",
  maxHeight: "60vh",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const theadRowStyle: React.CSSProperties = {
  backgroundColor: "#1976d2",
  color: "white",
};

const thStyle: React.CSSProperties = {
  padding: "0.75rem",
  textAlign: "left",
  fontWeight: "600",
};

const trStyle: React.CSSProperties = {
  borderBottom: "1px solid #e0e0e0",
};

const tdStyle: React.CSSProperties = {
  padding: "0.75rem",
};

const iconButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#1976d2",
  fontSize: "1.2rem",
};

const modalSinginStyle: Modal.Styles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "2rem",
    borderRadius: "12px",
    background: "#fff",
    width: "90%",
    maxWidth: "500px",
    height: "520px", // Más alto como pediste
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
};

export default VerAlumnos;