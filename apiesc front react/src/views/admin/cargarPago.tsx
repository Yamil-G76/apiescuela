import { useEffect, useState } from "react";

type Alumno = {
  id: number;
  username: string;
  userdetail?: {
    firstname: string;
    lastname: string;
  };
};

type Carrera = {
  id_carrera: number;
  name: string;
  id_usuarioxcarrera: number;
  costo_mensual: number;
};

function CargarPago() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  const [carrerasAsignadas, setCarrerasAsignadas] = useState<Carrera[]>([]);
  const [idUsuarioCarrera, setIdUsuarioCarrera] = useState<number | "">("");
  const [cuotaAfectada, setCuotaAfectada] = useState<number | "">("");
  const [monto, setMonto] = useState<number | "">("");

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
    if (!alumnoSeleccionado || !token) {
      setCarrerasAsignadas([]);
      return;
    }

    fetch(`http://127.0.0.1:8000/usuario/carrera/relaciones/${alumnoSeleccionado.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCarrerasAsignadas(data);
      })
      .catch(console.error);
  }, [alumnoSeleccionado, token]);

  const handleEnviarPago = async () => {
    if (!idUsuarioCarrera || !cuotaAfectada || !monto) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/payments/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          id_usuarioxcarrera: idUsuarioCarrera,
          cuota_afectada: cuotaAfectada,
          amount: monto,
        }),
      });

      if (res.ok) {
        alert("Pago cargado con éxito");
        setCuotaAfectada("");
        setMonto("");
        setIdUsuarioCarrera("");
      } else {
        const err = await res.json();
        alert("Error al cargar el pago: " + (err.detail || JSON.stringify(err)));
      }
    } catch (error) {
      console.error("Error al enviar pago:", error);
      alert("Error de red");
    }
  };

  return (
    <div style={formWrapper}>
      <h2 style={formTitle}>Cargar Pago</h2>

      <div style={formGrid}>
        <div style={formGroup}>
          <label>Alumno</label>
          <select
            value={alumnoSeleccionado?.id || ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              const alumno = alumnos.find((a) => a.id === id) || null;
              setAlumnoSeleccionado(alumno);
              setIdUsuarioCarrera("");
              setMonto("");
            }}
            style={inputStyle}
          >
            <option value="">-- Seleccionar alumno --</option>
            {alumnos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.userdetail?.firstname} {a.userdetail?.lastname} ({a.username})
              </option>
            ))}
          </select>
        </div>

        {alumnoSeleccionado && (
          <>
            <div style={formGroup}>
              <label>Carrera</label>
              <select
                value={idUsuarioCarrera === "" ? "" : String(idUsuarioCarrera)}
                onChange={(e) => {
                  const idUc = parseInt(e.target.value);
                  setIdUsuarioCarrera(idUc);
                  const carrera = carrerasAsignadas.find((c) => c.id_usuarioxcarrera === idUc);
                  setMonto(carrera?.costo_mensual ?? "");
                }}
                style={inputStyle}
              >
                <option value="">-- Seleccionar carrera --</option>
                {carrerasAsignadas.map((c) => (
                  <option key={c.id_usuarioxcarrera} value={c.id_usuarioxcarrera}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={formGroup}>
              <label>Cuota afectada</label>
              <input
                type="number"
                value={cuotaAfectada}
                onChange={(e) =>
                  setCuotaAfectada(e.target.value === "" ? "" : parseInt(e.target.value))
                }
                style={inputStyle}
              />
            </div>

            <div style={formGroup}>
              <label>Monto</label>
              <input
                type="number"
                value={monto}
                disabled
                style={{ ...inputStyle, backgroundColor: "#eee" }}
              />
            </div>
          </>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
        <button style={buttonStyle} onClick={handleEnviarPago}>
          Enviar Pago
        </button>
      </div>
    </div>
  );
}

// === ESTILOS ===

const formWrapper: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "12px",
  width: "100%",
  maxWidth: "600px",
  fontFamily: "'Segoe UI', sans-serif",
};

const formTitle: React.CSSProperties = {
  color: "#1565c0",
  fontWeight: 700,
  fontSize: "1.5rem",
  marginBottom: "1.5rem",
  textAlign: "center",
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem 1.5rem",
};

const formGroup: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const inputStyle: React.CSSProperties = {
  padding: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  marginTop: "0.3rem",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#1565c0",
  color: "white",
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
};

export default CargarPago;
