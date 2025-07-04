import { useEffect, useState } from "react";

type Alumno = {
  id: number;
  username: string;
  userdetail?: {
    firstname: string;
    lastname: string;
  };
};

type RelacionCarrera = {
  id: number;
  name: string;
  costo_mensual: number;
  id_usuarioxcarrera: number;
};

type Pago = {
  id: number;
  amount: number;
  cuota_afectada: number;
  created_at: string;
};

function VerPagos() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  const [relacionesCarreras, setRelacionesCarreras] = useState<RelacionCarrera[]>([]);
  const [pagosPorCarrera, setPagosPorCarrera] = useState<Record<number, Pago[]>>({});
  const [carreraExpandida, setCarreraExpandida] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  // Traer alumnos
  useEffect(() => {
    if (!token) return;
    fetch("http://127.0.0.1:8000/users/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setAlumnos)
      .catch(console.error);
  }, [token]);

  // Traer relaciones de usuario con carreras
  useEffect(() => {
    if (!token || !alumnoSeleccionado) return;

    fetch(`http://127.0.0.1:8000/usuario/carrera/relaciones/${alumnoSeleccionado.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: RelacionCarrera[]) => {
        setRelacionesCarreras(data);
        setPagosPorCarrera({});
        data.forEach((rel) => {
          fetch(`http://127.0.0.1:8000/payments/byrelacion/${rel.id_usuarioxcarrera}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((pagos: Pago[]) => {
              setPagosPorCarrera((prev) => ({
                ...prev,
                [rel.id_usuarioxcarrera]: pagos,
              }));
            })
            .catch(console.error);
        });
      })
      .catch(console.error);
  }, [alumnoSeleccionado, token]);

  return (
    <div style={wrapper}>
      <div style={header}>
        <h2 style={titulo}>Gestión de Pagos</h2>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={labelStyle}>Seleccionar Alumno:</label>
        <select
          value={alumnoSeleccionado?.id || ""}
          onChange={(e) => {
            const id = Number(e.target.value);
            const alumno = alumnos.find((a) => a.id === id) || null;
            setAlumnoSeleccionado(alumno);
            setCarreraExpandida(null);
          }}
          style={selectStyle}
        >
          <option value="">-- Seleccionar alumno --</option>
          {alumnos.map((a) => (
            <option key={a.id} value={a.id}>
              {a.userdetail?.firstname} {a.userdetail?.lastname} ({a.username})
            </option>
          ))}
        </select>
      </div>

      {relacionesCarreras.length > 0 &&
        relacionesCarreras.map((rel) => (
          <div key={rel.id_usuarioxcarrera} style={cardStyle}>
            <div
              style={cardHeaderStyle}
              onClick={() =>
                setCarreraExpandida((prev) =>
                  prev === rel.id_usuarioxcarrera ? null : rel.id_usuarioxcarrera
                )
              }
            >
              {rel.name} - ${rel.costo_mensual}/mes
            </div>

            {carreraExpandida === rel.id_usuarioxcarrera && (
              <div style={{ marginTop: "1rem" }}>
                {pagosPorCarrera[rel.id_usuarioxcarrera]?.length > 0 ? (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#e3f2fd" }}>
                        <th style={tdStyle}>ID</th>
                        <th style={tdStyle}>Monto</th>
                        <th style={tdStyle}>Cuota</th>
                        <th style={tdStyle}>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagosPorCarrera[rel.id_usuarioxcarrera].map((pago) => (
                        <tr key={pago.id}>
                          <td style={tdStyle}>{pago.id}</td>
                          <td style={tdStyle}>${pago.amount}</td>
                          <td style={tdStyle}>{pago.cuota_afectada}</td>
                          <td style={tdStyle}>
                            {new Date(pago.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ marginTop: "0.5rem", fontStyle: "italic", color: "#777" }}>
                    No hay pagos registrados para esta carrera.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

// === ESTILOS ===
const wrapper: React.CSSProperties = {
  maxWidth: "850px",
  margin: "2rem auto",
  padding: "2rem",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  fontFamily: "'Segoe UI', sans-serif",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
};

const titulo: React.CSSProperties = {
  fontSize: "1.8rem",
  fontWeight: 700,
  color: "#1565c0",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  marginBottom: "0.3rem",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "6px",
  marginBottom: "1rem",
  padding: "1rem",
  backgroundColor: "#f9f9f9",
};

const cardHeaderStyle: React.CSSProperties = {
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1.1rem",
  color: "#1976d2",
};

const tdStyle: React.CSSProperties = {
  padding: "0.5rem",
  borderBottom: "1px solid #ccc",
  textAlign: "left",
};

export default VerPagos;
