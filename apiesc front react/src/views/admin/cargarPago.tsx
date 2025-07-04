 import { useState } from "react";

interface ModalPagoProps {
  idUsuarioCarrera: number;
  costoMensual: number;
  onClose: () => void;
  onSuccess: () => void;
}

function ModalPago({ idUsuarioCarrera, costoMensual, onClose, onSuccess }: ModalPagoProps) {
  const [cuota, setCuota] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleEnviar = async () => {
    if (!cuota) {
      alert("Por favor ingresa la cuota afectada");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/payments/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_usuarioxcarrera: idUsuarioCarrera,
          cuota_afectada: cuota,
          amount: costoMensual,
        }),
      });

      if (res.ok) {
        alert("Pago registrado correctamente");
        setCuota("");
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        alert("Error al registrar pago: " + (err.detail || JSON.stringify(err)));
      }
    } catch (error) {
      console.error("Error en el envío:", error);
      alert("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <h3>Registrar Pago</h3>

        <label>Cuota Afectada:</label>
        <input
          type="number"
          value={cuota}
          onChange={(e) => setCuota(e.target.value === "" ? "" : parseInt(e.target.value))}
          style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
        />

        <label>Monto:</label>
        <input
          type="number"
          value={costoMensual}
          disabled
          style={{ padding: "0.5rem", width: "100%", backgroundColor: "#eee", marginBottom: "1.5rem" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              background: "#999",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviar}
            disabled={loading}
            style={{
              padding: "0.5rem 1rem",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {loading ? "Enviando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContent: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  width: "100%",
  maxWidth: "400px",
};

export default ModalPago;