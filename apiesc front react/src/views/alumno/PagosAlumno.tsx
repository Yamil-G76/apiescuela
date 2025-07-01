import { useEffect, useState } from "react";

type Pago = {
  amount: number;
  "fecha del pago": string;
  "cuota numero": number;
  carrera: string;
};

function MisPagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [carreras, setCarreras] = useState<string[]>([]);
  const [expandida, setExpandida] = useState<string | null>(null);

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

  const toggleExpand = (carrera: string) => {
    setExpandida(expandida === carrera ? null : carrera);
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Mis Pagos por Carrera</h2>

      {carreras.map((carrera) => {
        const pagosCarrera = pagos.filter((p) => p.carrera === carrera);

        return (
          <div
            key={carrera}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "1rem",
              backgroundColor: "#f8f9fa",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div
              onClick={() => toggleExpand(carrera)}
              style={{
                padding: "1rem",
                cursor: "pointer",
                backgroundColor: "#1976d2",
                color: "white",
                borderRadius: "8px 8px 0 0",
                fontWeight: 600,
              }}
            >
              {carrera} {expandida === carrera ? "▲" : "▼"}
            </div>

            {expandida === carrera && (
              <div style={{ padding: "1rem" }}>
                {pagosCarrera.length > 0 ? (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#e3f2fd" }}>
                        <th style={thStyle}>Fecha</th>
                        <th style={thStyle}>Cuota Nº</th>
                        <th style={thStyle}>Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagosCarrera.map((pago, idx) => (
                        <tr key={idx}>
                          <td style={tdStyle}>
                            {new Date(pago["fecha del pago"]).toLocaleDateString()}
                          </td>
                          <td style={tdStyle}>{pago["cuota numero"]}</td>
                          <td style={tdStyle}>${pago.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No hay pagos registrados.</p>
                )}
              </div>
            )}
          </div>
        );
      })}
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