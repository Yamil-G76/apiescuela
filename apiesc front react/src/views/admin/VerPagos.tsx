import { useEffect, useState } from "react";
import ModalPago from "./cargarPago";

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
  const [filtroAlumnos, setFiltroAlumnos] = useState("");
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  const [relacionesCarreras, setRelacionesCarreras] = useState<RelacionCarrera[]>([]);
  const [pagosPorCarrera, setPagosPorCarrera] = useState<Record<number, Pago[]>>({});
  const [carreraExpandida, setCarreraExpandida] = useState<number | null>(null);
  const [modalCarrera, setModalCarrera] = useState<RelacionCarrera | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("http://127.0.0.1:8000/users/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setAlumnos)
      .catch(console.error);
  }, [token]);

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

  const alumnosFiltrados = alumnos.filter((a) => {
    const nombreCompleto = `${a.userdetail?.firstname ?? ""} ${a.userdetail?.lastname ?? ""}`.toLowerCase();
    const userLower = a.username.toLowerCase();
    const filtro = filtroAlumnos.toLowerCase();
    return nombreCompleto.includes(filtro) || userLower.includes(filtro);
  });

  return (
    <div style={containerStyle}>
      <h2 style={tituloStyle}>Ver Pagos</h2>

      <div style={filtroContainerStyle}>
        <input
          type="text"
          placeholder="Buscar alumno..."
          value={filtroAlumnos}
          onChange={(e) => setFiltroAlumnos(e.target.value)}
          style={inputFiltroStyle}
        />

        <select
          value={alumnoSeleccionado?.id || ""}
          onChange={(e) => {
            const id = Number(e.target.value);
            const alumno = alumnosFiltrados.find((a) => a.id === id) || null;
            setAlumnoSeleccionado(alumno);
            setCarreraExpandida(null);
          }}
          style={selectStyle}
        >
          <option value="">-- Seleccionar alumno --</option>
          {alumnosFiltrados.map((a) => (
            <option key={a.id} value={a.id}>
              {a.userdetail?.firstname} {a.userdetail?.lastname} ({a.username})
            </option>
          ))}
        </select>
      </div>

      <div style={cardsContainerStyle}>
        {relacionesCarreras.length > 0 ? (
          relacionesCarreras.map((rel) => {
            const expanded = carreraExpandida === rel.id_usuarioxcarrera;
            return (
              <div key={rel.id_usuarioxcarrera} style={{ ...carreraCardStyle, height: expanded ? "auto" : "fit-content" }}>
                <div
                  style={{ cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem" }}
                  onClick={() =>
                    setCarreraExpandida((prev) =>
                      prev === rel.id_usuarioxcarrera ? null : rel.id_usuarioxcarrera
                    )
                  }
                >
                  {rel.name} - ${rel.costo_mensual}/mes
                </div>

                {expanded && (
                  <div style={{ marginTop: "1rem" }}>
                    {pagosPorCarrera[rel.id_usuarioxcarrera]?.length > 0 ? (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#ddd" }}>
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
                      <p>No hay pagos registrados para esta carrera.</p>
                    )}

                    <button
                      onClick={() => setModalCarrera(rel)}
                      style={btnRegistrarPago}
                    >
                      Registrar nuevo pago
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : alumnoSeleccionado ? (
          <p style={{ marginTop: "1rem" }}>Este alumno no tiene carreras asignadas.</p>
        ) : null}
      </div>

      {modalCarrera && (
        <ModalPago
          idUsuarioCarrera={modalCarrera.id_usuarioxcarrera}
          costoMensual={modalCarrera.costo_mensual}
          onClose={() => setModalCarrera(null)}
          onSuccess={() => {
            fetch(`http://127.0.0.1:8000/payments/byrelacion/${modalCarrera.id_usuarioxcarrera}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((res) => res.json())
              .then((pagos: Pago[]) => {
                setPagosPorCarrera((prev) => ({
                  ...prev,
                  [modalCarrera.id_usuarioxcarrera]: pagos,
                }));
              })
              .catch(console.error);
          }}
        />
      )}
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

const tituloStyle: React.CSSProperties = {
  color: "#1a237e",
  marginBottom: "1rem",
  fontWeight: "700",
  fontSize: "1.8rem",
};

const filtroContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "1.5rem",
};

const inputFiltroStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "250px",
};

const selectStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "250px",
};

const cardsContainerStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  maxHeight: "60vh",
  overflowY: "auto",
  paddingRight: "15px",
  boxSizing: "content-box",
  alignItems: "flex-start", // <-- Aquí el cambio para que no estiren altura las tarjetas
};

const carreraCardStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "10px",
  marginBottom: "1.5rem",
  backgroundColor: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  padding: "1rem",
  width: "48%", // ancho para 2 tarjetas por fila
  boxSizing: "border-box",
};

const tdStyle: React.CSSProperties = {
  padding: "0.5rem",
  borderBottom: "1px solid #ccc",
  textAlign: "left",
};

const btnRegistrarPago: React.CSSProperties = {
  marginTop: "1rem",
  padding: "0.5rem 1rem",
  backgroundColor: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
};

export default VerPagos;