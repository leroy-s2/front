import React, { useState, useEffect } from "react";
import type { Curso } from "../../models/Curso";
import { createCurso, updateCurso } from "../../services/CursoService";

interface CursoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (nuevo?: Curso) => void;
  curso?: Curso | null;
  id_lenguaje: number;
}

export default function CursoModal({
  open,
  onClose,
  onSuccess,
  curso,
  id_lenguaje,
}: CursoModalProps) {
  const isEdit = !!curso;
  const [nombre, setNombre] = useState<string>(curso?.nombre || "");
  const [descripcion, setDescripcion] = useState<string>(curso?.descripcion || "");
  const [estado, setEstado] = useState<"A" | "I">(curso?.estado as "A" | "I" || "A");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (curso) {
      setNombre(curso.nombre);
      setDescripcion(curso.descripcion);
      setEstado(curso.estado as "A" | "I");
    } else {
      setNombre("");
      setDescripcion("");
      setEstado("A");
    }
  }, [curso, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const datos = {
        nombre,
        descripcion,
        estado,
        lenguaje: { id_lenguaje },
      };
      if (isEdit && curso && typeof curso.id_curso !== "undefined") {
        await updateCurso(curso.id_curso, datos);
        onSuccess();
      } else if (!isEdit) {
        const nuevo = await createCurso(datos);
        onSuccess(nuevo);
      } else {
        setError("Error: id_curso no definido.");
      }
    } catch {
      setError(isEdit ? "Error al editar curso" : "Error al agregar curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40 transition-all">
      <div
        className="w-full sm:w-[360px] h-full bg-[#18181b] shadow-lg px-6 py-8 relative animate-slide-in-right"
        style={{
          maxWidth: "360px",
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
          {isEdit ? "Editar Curso" : "Agregar Curso"}
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
              placeholder="Nombre del curso"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-white mb-1 text-sm font-semibold">Descripción</label>
            <textarea
              className="w-full px-3 py-2 rounded bg-[#23232A] border border-gray-700 text-white focus:outline-none focus:border-white placeholder:text-gray-400 text-sm"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
              placeholder="Descripción del curso"
              rows={2}
              maxLength={255}
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