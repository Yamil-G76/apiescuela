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
        setPagosPorCarrera({}); // Resetear pagos anteriores
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
    <div style={{ maxWidth: 800, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Ver Pagos</h2>

      <label>Seleccionar Alumno:</label>
      <select
        value={alumnoSeleccionado?.id || ""}
        onChange={(e) => {
          const id = Number(e.target.value);
          const alumno = alumnos.find((a) => a.id === id) || null;
          setAlumnoSeleccionado(alumno);
          setCarreraExpandida(null);
        }}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1.5rem" }}
      >
        <option value="">-- Seleccionar alumno --</option>
        {alumnos.map((a) => (
          <option key={a.id} value={a.id}>
            {a.userdetail?.firstname} {a.userdetail?.lastname} ({a.username})
          </option>
        ))}
      </select>

      {relacionesCarreras.length > 0 &&
        relacionesCarreras.map((rel) => (
          <div
            key={rel.id_usuarioxcarrera}
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginBottom: "1rem",
              padding: "1rem",
              backgroundColor: "#f9f9f9",
            }}
          >
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

            {carreraExpandida === rel.id_usuarioxcarrera && (
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
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

const tdStyle: React.CSSProperties = {
  padding: "0.5rem",
  borderBottom: "1px solid #ccc",
  textAlign: "left",
};

export default VerPagos;