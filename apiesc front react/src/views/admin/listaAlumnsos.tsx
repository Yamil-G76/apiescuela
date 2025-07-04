import { useEffect, useState } from "react";
import Modal from "react-modal";
import Singin from "./singin"; // Asegurate que esta ruta sea correcta

Modal.setAppElement("#root");

type User = {
  id: number;
  username: string;
  userdetail?: {
    dni: string;
    firstname: string;
    lastname: string;
    email: string;
  };
};

function VerAlumnos() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

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

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Lista de Usuarios</h2>
        <button
          onClick={() => setMostrarModal(true)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Agregar Alumno
        </button>
      </div>

      <p style={subTextStyle}>Total: {usuariosFiltrados.length} usuarios</p>

      <input
        type="text"
        placeholder="Buscar por nombre, usuario, email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchInputStyle}
      />

      {error && <p style={errorStyle}>{error}</p>}

      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={theadRowStyle}>
              <th style={thStyle}>IDENTIFICACIÓN</th>
              <th style={thStyle}>Usuario</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Apellido</th>
              <th style={thStyle}>Correo electrónico</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={mostrarModal}
        onRequestClose={() => setMostrarModal(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: 0,
            border: "none",
            background: "transparent", // 👈 corregido para permitir el fondo del modal interno
            overflow: "visible",
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          },
        }}
      >
        <Singin
          onSuccess={() => {
            setMostrarModal(false);
            cargarUsuarios();
          }}
          onClose={() => setMostrarModal(false)}
        />
      </Modal>
    </div>
  );
}

// === ESTILOS ===

const containerStyle: React.CSSProperties = {
  padding: "2rem",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: "#f9f9f9",
  minHeight: "100vh",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
};

const titleStyle: React.CSSProperties = {
  fontSize: "1.8rem",
  fontWeight: "bold",
  color: "#1a237e",
  marginBottom: "0.5rem",
};

const subTextStyle: React.CSSProperties = {
  marginBottom: "1rem",
  color: "#555",
};

const searchInputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "400px",
  padding: "0.6rem",
  marginBottom: "1.5rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const errorStyle: React.CSSProperties = {
  color: "red",
  marginBottom: "1rem",
};

const tableWrapperStyle: React.CSSProperties = {
  overflowX: "auto",
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

export default VerAlumnos;
