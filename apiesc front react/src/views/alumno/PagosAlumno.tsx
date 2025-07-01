import { useEffect, useState } from "react";

type Pago = {
  amount: number;
  "fecha del pago": string;
  "cuota numero": number;
  carrera: string;
};

function MisPagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<string | null>(null);
  const [carreras, setCarreras] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/payment/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then((data: Pago[]) => {
        setPagos(data);
        const carrerasUnicas = Array.from(new Set(data.map((p) => p.carrera)));
        setCarreras(carrerasUnicas);
      })
      .catch((err) => console.error("Error al obtener pagos:", err));
  }, []);

  const pagosFiltrados = pagos.filter((p) => p.carrera === carreraSeleccionada);

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2>Mis Pagos</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: 600 }}>Seleccioná una carrera:</label>
        <select
          value={carreraSeleccionada || ""}
          onChange={(e) => setCarreraSeleccionada(e.target.value || null)}
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
        >
          <option value="">-- Elegir carrera --</option>
          {carreras.map((carrera) => (
            <option key={carrera} value={carrera}>
              {carrera}
            </option>
          ))}
        </select>
      </div>

      {carreraSeleccionada && (
        <>
          <h3>Pagos para {carreraSeleccionada}</h3>
          {pagosFiltrados.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#e3f2fd" }}>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Cuota Nº</th>
                  <th style={thStyle}>Monto</th>
                </tr>
              </thead>
              <tbody>
                {pagosFiltrados.map((pago, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{new Date(pago["fecha del pago"]).toLocaleDateString()}</td>
                    <td style={tdStyle}>{pago["cuota numero"]}</td>
                    <td style={tdStyle}>${pago.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay pagos registrados para esta carrera.</p>
          )}
        </>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "0.5rem",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "0.5rem",
};

export default MisPagos;