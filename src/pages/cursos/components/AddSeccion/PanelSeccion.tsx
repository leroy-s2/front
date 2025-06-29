import { useRef, useState, useEffect } from "react";
import ClasesPanelUXPro from "./ClasesPanelUXPro";
import type { ClaseUX, ClasesPanelUXProRef } from "./ClasesPanelUXPro";
import type { SeccionDTO } from "../../models/SeccionModels";
import { createSeccion, updateSeccion } from "../../services/SeccionService";
import { syncRecursos } from "../../services/RecursoService";
import { getSasUploadUrl, uploadVideoToAzure } from "../../services/AzureService";

type Props = {
  modo: "crear" | "editar";
  seccionActual?: SeccionDTO;
  clasesIniciales?: ClaseUX[];
  idCurso: number;
  onClose: () => void;
  onSuccess: () => void;
};

export default function PanelSeccion({
  modo,
  seccionActual,
  clasesIniciales,
  idCurso,
  onClose,
  onSuccess,
}: Props) {
  const [nombre, setNombre] = useState(seccionActual?.nombre ?? "");
  const [estado, setEstado] = useState<"A" | "I">(seccionActual?.estado ?? "A");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clasesPanelRef = useRef<ClasesPanelUXProRef>(null);

  // Limpieza de blobs al desmontar/cancelar
  useEffect(() => {
    const refSnapshot = clasesPanelRef.current;
    return () => {
      const clases = refSnapshot?.getClases() ?? [];
      clases.forEach(clase => {
        if (clase.videoBlobUrl) {
          try {
            URL.revokeObjectURL(clase.videoBlobUrl);
          } catch {
            // intentionally left blank: blob cleanup error ignored
          }
        }
      });
    };
  }, []);

  const handleAceptar = async () => {
    const clases = clasesPanelRef.current?.getClases() ?? [];
    const eliminadas = clasesPanelRef.current?.getEliminadas() ?? [];

    if (!nombre.trim()) {
      setError("El nombre de la sección es obligatorio");
      return;
    }
    if (clases.length === 0) {
      setError("Debe haber al menos una clase");
      return;
    }
    setLoading(true);
    try {
      // 1. Crear/editar sección
      let id_seccion = seccionActual?.id_seccion;
      const orden = seccionActual?.orden ?? 1;
      if (modo === "crear") {
        const nueva = await createSeccion({
          nombre,
          estado,
          orden,
          id_curso: idCurso,
        });
        id_seccion = nueva.id_seccion!;
      } else {
        await updateSeccion(id_seccion!, {
          nombre,
          estado,
          orden,
          id_curso: idCurso,
        });
      }

      // 2. Subir videos nuevos/cambiados usando el File, nunca fetch al blob
      const recursosFinal: {
        id_recurso: number;
        nombre: string;
        descripcion: string;
        estado: "A" | "I";
        url_video?: string;
        orden: number;
        duracion_segundos?: number;
      }[] = [];
      for (let i = 0; i < clases.length; i++) {
        const clase = clases[i];
        let url_video: string | undefined = undefined;
        // Si hay un videoFile (nuevo/cambiado), lo subimos
        if (clase.videoFile) {
          const { sas_url, url } = await getSasUploadUrl(id_seccion!);
          await uploadVideoToAzure(sas_url, clase.videoFile);
          url_video = url;
          if (clase.videoBlobUrl) {
            try { URL.revokeObjectURL(clase.videoBlobUrl); } catch { /* ignore */ }
          }
        } else if (clase.video?.url && !clase.video.url.startsWith("blob:")) {
          url_video = clase.video.url;
        }

        recursosFinal.push({
          id_recurso: clase.id,
          nombre: clase.nombre,
          descripcion: clase.descripcion,
          estado: clase.status === "Activo" ? "A" : "I",
          url_video,
          orden: i + 1,
          duracion_segundos: undefined,
        });
      }

      // NUEVO: ids de recursos eliminados (solo si tienen id real)
      const idsEliminados = eliminadas
        .filter(c => !!c.id && typeof c.id === "number")
        .map(c => c.id);

      // 3. Guardar recursos en lote (enviando eliminados)
      await syncRecursos(id_seccion!, recursosFinal, idsEliminados);

      setLoading(false);
      onSuccess();
    } catch (e) {
      setLoading(false);
      setError((e as Error)?.message || "Error al guardar");
    }
  };

  return (
    <div className="flex gap-0 items-start">
      {/* Panel sección */}
      <div className="bg-neutral-900 border border-neutral-800 shadow-2xl rounded-xl px-6 py-8 w-[290px] h-[82vh] flex flex-col pointer-events-auto relative">
        <h2 className="mb-6 font-bold text-white text-center text-xl">
          {modo === "editar" ? "Editar Sección" : "Agregar Sección"}
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-white mb-1 text-sm font-semibold">
              Nombre de la Sección
            </label>
            <input
              className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-white placeholder:text-gray-400 text-sm"
              placeholder="Nombre de la sección"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-white mb-1 text-sm font-semibold">
              Estado
            </label>
            <select
              className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-white text-sm"
              value={estado}
              onChange={e => setEstado(e.target.value as "A" | "I")}
            >
              <option value="A">Activo</option>
              <option value="I">Inactivo</option>
            </select>
          </div>
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
              type="button"
              className="flex-1 bg-[#16B6A5] hover:bg-[#10a199] text-white font-bold rounded py-2 transition text-sm"
              onClick={handleAceptar}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Aceptar"}
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-xs mt-2">{error}</div>
          )}
        </div>
      </div>
      {/* Panel Clases */}
      <ClasesPanelUXPro ref={clasesPanelRef} initialClases={clasesIniciales} />
    </div>
  );
}