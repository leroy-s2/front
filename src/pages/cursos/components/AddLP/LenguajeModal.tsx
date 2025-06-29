import React, { useState, useEffect } from "react";
import type { Lenguaje } from "../../models/Lenguaje";
import { createLenguaje, updateLenguaje } from "../../services/LenguajeService";

interface LenguajeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (nuevo?: Lenguaje) => void;
  lenguaje?: Lenguaje | null;
}

export default function LenguajeModal({
  open,
  onClose,
  onSuccess,
  lenguaje,
}: LenguajeModalProps) {
  const isEdit = !!lenguaje;
  const [nombre, setNombre] = useState(lenguaje?.nombre || "");
  const [estado, setEstado] = useState<"A" | "I">(lenguaje?.estado as "A" | "I" || "A");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lenguaje) {
      setNombre(lenguaje.nombre);
      setEstado(lenguaje.estado as "A" | "I");
    } else {
      setNombre("");
      setEstado("A");
    }
  }, [lenguaje, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEdit && lenguaje && typeof lenguaje.id_lenguaje !== "undefined") {
        await updateLenguaje(lenguaje.id_lenguaje, { nombre, estado });
        onSuccess();
      } else if (!isEdit) {
        const nuevo = await createLenguaje({ nombre, estado });
        onSuccess(nuevo);
        setNombre("");
        setEstado("A");
      } else {
        setError("Error: id_lenguaje no definido.");
      }
    } catch {
      setError(isEdit ? "Error al editar lenguaje" : "Error al agregar lenguaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40 transition-all">
      <div
        className="w-full sm:w-[340px] h-full bg-[#18181b] shadow-lg px-6 py-8 relative animate-slide-in-right"
        style={{
          maxWidth: "340px",
          minHeight: "100vh",
          boxShadow: "0 0 20px #0008",
        }}
      >
        <button
          className="absolute top-3 right-4 text-gray-300 text-xl hover:text-white"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="mb-6 font-bold text-white text-center text-lg">
          {isEdit ? "Editar Lenguaje de Programación" : "Agregar Lenguaje de Programación"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-white mb-1 text-sm font-semibold">Nombre</label>
            <input
              className="w-full px-3 py-2 rounded bg-[#23232A] border border-gray-700 text-white focus:outline-none focus:border-white placeholder:text-gray-400 text-sm"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              autoFocus
              placeholder="Nombre del lenguaje"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-white mb-1 text-sm font-semibold">Estado</label>
            <select
              className="w-full px-3 py-2 rounded bg-[#23232A] border border-gray-700 text-white focus:outline-none focus:border-white text-sm"
              value={estado}
              onChange={e => setEstado(e.target.value as "A" | "I")}
            >
              <option value="A">Activo</option>
              <option value="I">Inactivo</option>
            </select>
          </div>
          {error && <div className="text-red-400 mb-2 text-sm text-center">{error}</div>}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              className="flex-1 border border-gray-500 text-gray-300 rounded py-2 hover:bg-gray-700 transition text-sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#16B6A5] hover:bg-[#10a199] text-white font-bold rounded py-2 transition text-sm"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Aceptar"}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes slide-in-right {
          0% { transform: translateX(100%); opacity: 0.7; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.22s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}