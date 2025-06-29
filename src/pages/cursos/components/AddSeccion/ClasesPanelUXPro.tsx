import { useState, useRef, useImperativeHandle, forwardRef } from "react";

// Tipos para el video preview y clase UX
export type VideoPreview = {
  name: string;
  url: string;
  thumb: string | null;
};

export type ClaseUX = {
  id: number;
  orden: number;
  nombre: string;
  descripcion: string;
  status: string;
  checked: boolean;
  video?: VideoPreview;
  // Frontend-only:
  videoFile?: File;        // Nuevo video, si existe
  videoBlobUrl?: string;   // Para preview local
};

function isVideo(file: File) {
  return file.type.startsWith("video/");
}

async function getVideoThumbnail(file: File, time = 8): Promise<string | null> {
  return new Promise(resolve => {
    const video = document.createElement("video");
    video.preload = "metadata";
    const url = URL.createObjectURL(file);
    video.src = url;
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(time, Math.max(0, video.duration - 0.1));
    };
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbUrl = canvas.toDataURL("image/png");
        resolve(thumbUrl);
      } else {
        resolve(null);
      }
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
  });
}

export type ClasesPanelUXProRef = {
  getClases: () => ClaseUX[];
  setClases: (clases: ClaseUX[]) => void;
  reset: () => void;
  getEliminadas: () => ClaseUX[]; // <-- NUEVO
};

const ClasesPanelUXPro = forwardRef<ClasesPanelUXProRef, {
  initialClases?: ClaseUX[];
}>(({ initialClases }, ref) => {
  const [clases, setClases] = useState<ClaseUX[]>(
  initialClases && initialClases.length > 0
    ? initialClases.map((c, idx) => ({ ...c, orden: idx + 1 }))
    : [
        { id: Date.now(), orden: 1, nombre: "", descripcion: "", status: "Activo", checked: false }
      ]
);

  const [clasesEliminadas, setClasesEliminadas] = useState<ClaseUX[]>([]);
  const fileInputRefs = useRef<{ [id: number]: HTMLInputElement | null }>({});
  const dragItem = useRef<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  useImperativeHandle(ref, () => ({
    getClases: () => clases,
    setClases: (arr) => setClases(arr.map((c, i) => ({ ...c, orden: i + 1 }))),
    reset: () => {
      setClases(
        initialClases && initialClases.length > 0
          ? initialClases.map((c, idx) => ({ ...c, orden: idx + 1 }))
          : [
              { id: Date.now(), orden: 1, nombre: "", descripcion: "", status: "Activo", checked: false },
              { id: Date.now() + 1, orden: 2, nombre: "", descripcion: "", status: "Activo", checked: false }
            ]
      );
      setClasesEliminadas([]);
    },
    getEliminadas: () => clasesEliminadas, // <-- NUEVO
  }), [clases, initialClases, clasesEliminadas]);

  function moveClase(from: number, to: number) {
    setClases(prev => {
      if (from === to) return prev;
      const arr = [...prev];
      const [removed] = arr.splice(from, 1);
      arr.splice(to, 0, removed);
      return arr.map((c, idx) => ({ ...c, orden: idx + 1 }));
    });
  }

  const addClase = () => {
    setClases(prev => {
      const maxOrden = prev.length > 0 ? Math.max(...prev.map(c => c.orden)) : 0;
      return [
        ...prev,
        { id: Date.now() + Math.floor(Math.random() * 10000), orden: maxOrden + 1, nombre: "", descripcion: "", status: "Activo", checked: false }
      ];
    });
  };

  const removeCheckedClases = () => {
    setClases(prev => {
      const eliminadas = prev.filter(c => c.checked);
      setClasesEliminadas(old => [...old, ...eliminadas]);
      const arr = prev.filter(c => !c.checked);
      return arr.map((c, idx) => ({ ...c, orden: idx + 1 }));
    });
  };

  const restoreClases = () => {
    setClases(prev => {
      let merged = [...prev];
      clasesEliminadas
        .sort((a, b) => a.orden - b.orden)
        .forEach(restaurada => {
          if (!merged.find(c => c.id === restaurada.id)) {
            merged = [
              ...merged.slice(0, restaurada.orden - 1),
              { ...restaurada, checked: false },
              ...merged.slice(restaurada.orden - 1)
            ];
          }
        });
      merged = merged.map((c, idx) => ({ ...c, orden: idx + 1 }));
      return merged;
    });
    setClasesEliminadas([]);
  };

  const handleClaseChange = (
    idx: number,
    field: keyof ClaseUX,
    value: string | boolean | VideoPreview | undefined
  ) => {
    setClases(prev =>
      prev.map((c, i) =>
        i === idx ? { ...c, [field]: value } : c
      )
    );
  };

  const handleCheckboxChange = (idx: number, checked: boolean) => {
    setClases(prev =>
      prev.map((c, i) =>
        i === idx ? { ...c, checked } : c
      )
    );
  };

  // Cambia el video: guarda File + blobUrl
  const handleVideoChange = async (idx: number, file?: File) => {
    if (!file || !isVideo(file)) return;
    const thumb = await getVideoThumbnail(file, 8);
    const url = URL.createObjectURL(file);

    setClases(prev =>
      prev.map((c, i) =>
        i === idx
          ? {
              ...c,
              video: { name: file.name, url, thumb },
              videoFile: file,
              videoBlobUrl: url
            }
          : c
      )
    );
  };

  const handleVideoDrop = async (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && isVideo(file)) {
      await handleVideoChange(idx, file);
    }
  };

  const hasChecked = clases.some(clase => clase.checked);

  return (
    <div className="bg-neutral-900 border border-neutral-800 shadow-2xl rounded-xl px-6 py-8 w-[500px] h-[82vh] flex flex-col pointer-events-auto relative">
      <div className="flex items-center justify-between mb-4 pt-1">
        <h2 className="text-base font-semibold text-white text-center tracking-tight flex-1">
          Clases
        </h2>
        <div className="flex gap-1.5 ml-2">
          <button
            className={`group text-white bg-neutral-800 hover:text-teal-400 transition-opacity rounded-lg p-1.5 flex items-center justify-center ${clasesEliminadas.length === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            style={{ width: 24, height: 24 }}
            title="Restaurar clases eliminadas"
            onClick={restoreClases}
            disabled={clasesEliminadas.length === 0}
            tabIndex={-1}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12v-2a9 9 0 1 1 9 9"/>
              <polyline points="3 8 3 12 7 12"/>
            </svg>
          </button>
          <button
            className={`group text-white bg-neutral-800 hover:text-red-500 transition-opacity rounded-lg p-1.5 flex items-center justify-center ${!hasChecked ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            style={{ width: 24, height: 24 }}
            title="Eliminar las clases seleccionadas"
            onClick={removeCheckedClases}
            disabled={!hasChecked}
            tabIndex={-1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={14} height={14} className="text-inherit">
              <path d="M7 4V3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1h5v2H2V4h5zm2-1v1h6V3H9zm-5 5h16l-1.5 14.5A2 2 0 0 1 16.5 21h-9a2 2 0 0 1-1.99-1.5L4 8zm3 3v7a1 1 0 0 0 2 0v-7a1 1 0 1 0-2 0zm6 0v7a1 1 0 0 0 2 0v-7a1 1 0 1 0-2 0z"/>
            </svg>
          </button>
          <button
            className="text-white bg-teal-500 hover:bg-teal-600 p-1.5 rounded-lg transition flex items-center justify-center"
            style={{ width: 24, height: 24, fontSize: 13 }}
            title="Agregar clase"
            onClick={addClase}
            type="button"
            tabIndex={-1}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-5 overflow-y-auto scrollbar-none flex-1 pb-2"
        style={{ maxHeight: "calc(100vh - 140px)" }}
      >
        {clases.map((clase, idx) => (
          <div
            key={clase.id}
            className={`
              relative rounded-xl bg-neutral-800 border border-neutral-700 px-4 pt-4 pb-5
              transition-all duration-150
              ${dropIndex === idx ? "ring-2 ring-teal-400 bg-neutral-700" : ""}
            `}
            draggable
            onDragStart={() => {
              dragItem.current = idx;
            }}
            onDragOver={e => {
              e.preventDefault();
              setDropIndex(idx);
            }}
            onDragLeave={() => setDropIndex(null)}
            onDrop={() => {
              if (dragItem.current !== null && dragItem.current !== idx) {
                moveClase(dragItem.current, idx);
              }
              dragItem.current = null;
              setDropIndex(null);
            }}
            onDragEnd={() => {
              dragItem.current = null;
              setDropIndex(null);
            }}
            style={{ cursor: "grab" }}
          >
            <div className="flex items-start gap-2">
              <div className="flex flex-col items-center justify-start min-w-[10px] mr-2 pt-1 select-none">
                <span className="text-xs text-neutral-400 font-bold">{clase.orden}</span>
              </div>
              <input
                type="checkbox"
                className="accent-teal-500 border border-neutral-700 bg-neutral-900 rounded mt-[2px]"
                checked={clase.checked}
                onChange={e => handleCheckboxChange(idx, e.target.checked)}
                tabIndex={-1}
                style={{
                  width: 16,
                  height: 16,
                  marginLeft: 0,
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 mb-1 items-center w-full">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-neutral-300 text-xs mb-0.5 font-semibold">Nombre de la Clase</span>
                    <input
                      className="w-full min-w-0 rounded-lg bg-neutral-900 py-1 px-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 border border-neutral-700 transition"
                      placeholder="Nombre de la clase"
                      value={clase.nombre}
                      onChange={e => handleClaseChange(idx, "nombre", e.target.value)}
                      maxLength={60}
                    />
                  </div>
                  <div className="flex flex-col flex-shrink w-[90px]">
                    <span className="text-neutral-300 text-xs mb-0.5 font-semibold">Estado</span>
                    <select
                      className="w-full rounded-lg bg-neutral-900 py-1 px-2 text-white text-xs border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                      value={clase.status}
                      onChange={e => handleClaseChange(idx, "status", e.target.value)}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 w-full mt-1">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-neutral-300 text-xs mb-0.5 font-semibold">Descripción de la Clase</span>
                    <textarea
                      className="w-full min-h-[60px] rounded-lg bg-neutral-900 py-1 px-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 border border-neutral-700 transition resize-none"
                      placeholder="Descripción"
                      value={clase.descripcion}
                      onChange={e => handleClaseChange(idx, "descripcion", e.target.value)}
                      maxLength={300}
                      rows={3}
                    />
                  </div>
                  <div
                    className="flex flex-col flex-shrink w-[130px] cursor-pointer group"
                    tabIndex={-1}
                    onClick={() => fileInputRefs.current[clase.id]?.click()}
                    onDragOver={e => {
                      e.preventDefault();
                      e.currentTarget.classList.add("ring-2", "ring-teal-400");
                    }}
                    onDragLeave={e => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("ring-2", "ring-teal-400");
                    }}
                    onDrop={async e => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("ring-2", "ring-teal-400");
                      await handleVideoDrop(idx, e);
                    }}
                  >
                    <span className="text-neutral-300 text-xs mb-0.5 font-semibold truncate" style={{ minHeight: 14 }}>
                      {clase.video?.name ? clase.video.name : "Video"}
                    </span>
                    <div className="w-full min-h-[60px] rounded-lg bg-neutral-700 flex flex-col items-center justify-center border-none relative group-hover:ring-2 group-hover:ring-teal-400 transition">
                      {clase.video?.thumb ? (
                        <img
                          src={clase.video.thumb}
                          alt="preview"
                          className="w-full h-[54px] object-cover rounded"
                        />
                      ) : (
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#2dd4bf" className="opacity-60">
                          <path strokeWidth="2" strokeLinecap="round" d="M12 19V6m-7 6l7-7 7 7"/>
                        </svg>
                      )}
                      <input
                        ref={el => { fileInputRefs.current[clase.id] = el; }}
                        type="file"
                        accept="video/*"
                        style={{ display: "none" }}
                        onChange={async e => {
                          if (e.target.files && e.target.files[0]) {
                            await handleVideoChange(idx, e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ClasesPanelUXPro;