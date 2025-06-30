import { useEffect, useState } from "react";

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

  useEffect(() => {
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
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Lista de Usuarios</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#1976d2", color: "white" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Usuario</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Apellido</th>
            <th style={thStyle}>DNI</th>
            <th style={thStyle}>Email</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={tdStyle}>{u.id}</td>
              <td style={tdStyle}>{u.username}</td>
              <td style={tdStyle}>{u.userdetail?.firstname}</td>
              <td style={tdStyle}>{u.userdetail?.lastname}</td>
              <td style={tdStyle}>{u.userdetail?.dni}</td>
              <td style={tdStyle}>{u.userdetail?.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// === Estilos ===

const thStyle: React.CSSProperties = {
  padding: "0.75rem",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  padding: "0.75rem",
};

export default VerAlumnos;