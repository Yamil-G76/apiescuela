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

  // Traer todos los alumnos
  useEffect(() => {
    if (!token) return;
    fetch("http://127.0.0.1:8000/users/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setAlumnos)
      .catch(console.error);
  }, [token]);

  // Traer carreras del alumno seleccionado
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
          Authorization: `Bearer ${token}`,
        },
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
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Cargar Pago</h2>

      {/* Seleccionar Alumno */}
      <label>Alumno:</label>
      <select
        value={alumnoSeleccionado?.id || ""}
        onChange={(e) => {
          const id = Number(e.target.value);
          const alumno = alumnos.find((a) => a.id === id) || null;
          setAlumnoSeleccionado(alumno);
          setIdUsuarioCarrera("");
          setMonto("");
        }}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      >
        <option value="">-- Seleccionar alumno --</option>
        {alumnos.map((a) => (
          <option key={a.id} value={a.id}>
            {a.userdetail?.firstname} {a.userdetail?.lastname} ({a.username})
          </option>
        ))}
      </select>

      {/* Seleccionar carrera asignada */}
      {alumnoSeleccionado && (
        <>
          <label>Carrera:</label>
          <select
            value={idUsuarioCarrera === "" ? "" : String(idUsuarioCarrera)}
            onChange={(e) => {
              const idUc = parseInt(e.target.value);
              setIdUsuarioCarrera(idUc);
              const carrera = carrerasAsignadas.find((c) => c.id_usuarioxcarrera === idUc);
              setMonto(carrera?.costo_mensual ?? "");
            }}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          >
            <option value="">-- Seleccionar carrera --</option>
            {carrerasAsignadas.map((c) => (
              <option key={c.id_usuarioxcarrera} value={c.id_usuarioxcarrera}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Campos de pago */}
          <label>Cuota afectada:</label>
          <input
            type="number"
            value={cuotaAfectada}
            onChange={(e) =>
              setCuotaAfectada(e.target.value === "" ? "" : parseInt(e.target.value))
            }
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />

          <label>Monto:</label>
          <input
            type="number"
            value={monto}
            disabled
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", backgroundColor: "#eee" }}
          />

          <button
            onClick={handleEnviarPago}
            style={{
              backgroundColor: "#1976d2",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Enviar Pago
          </button>
        </>
      )}
    </div>
  );
}

export default CargarPago;