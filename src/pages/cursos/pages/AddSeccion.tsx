import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSecciones } from "../hooks/useSecciones";
import { getRecursosBySeccion } from "../services/RecursoService";
import { deleteSeccion } from "../services/SeccionService";
import PanelSeccion from "../components/AddSeccion/PanelSeccion";
import ConfirmDeleteModal from "../components/AddSeccion/ConfirmModal";
import { useTheme } from "../../../context/theme/ThemeContext";
import type { SeccionDTO } from "../models/SeccionModels";
import type { ClaseTemp } from "../models/RecursoModels";
import { mapSeccionToDTO } from "../models/mapSeccionToDTO";
import { mapClaseTempToUX } from "../components/AddSeccion/mapClaseTempToUX";

const statusColors = {
  A: "bg-green-100 text-green-700 border border-green-400",
  I: "bg-red-100 text-red-700 border border-red-400",
};
const statusText = {
  A: "Activo",
  I: "Inactivo",
};
const PAGE_SIZE = 10;

export default function AddSeccion() {
  const { id_curso } = useParams<{ id_curso: string }>();
  const idCursoNum = Number(id_curso);
  const { secciones, loading, error, fetchSecciones } = useSecciones();
  const { isDarkMode } = useTheme();

  const [search, setSearch] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [panelMode, setPanelMode] = useState<"crear" | "editar">("crear");
  const [editSeccion, setEditSeccion] = useState<SeccionDTO | null>(null);
  const [panelClases, setPanelClases] = useState<ClaseTemp[] | undefined>(undefined);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteNombre, setDeleteNombre] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<{ text: string; color: string } | null>(null);
  const [estadoFilter, setEstadoFilter] = useState<"ALL" | "A" | "I">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const seccionesFiltradas = secciones.filter(
    (s) => s.curso?.id_curso === idCursoNum
  );

  const filtered = seccionesFiltradas
    .filter(s => s.nombre.toLowerCase().includes(search.toLowerCase()))
    .filter(s => estadoFilter === "ALL" ? true : s.estado === estadoFilter);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // -------------------
  // ABRIR PANEL AGREGAR
  // -------------------
  const openAdd = () => {
    setPanelMode("crear");
    setEditSeccion(null);
    setPanelClases([]);
    setShowPanel(true);
  };

  // -----------------
  // ABRIR PANEL EDITAR
  // -----------------
  const openEdit = async (seccion: SeccionDTO) => {
    setPanelMode("editar");
    setEditSeccion(seccion);
    // Traer recursos/clases de la sección
    const recursos = await getRecursosBySeccion(seccion.id_seccion!);
    // Mapear a ClaseTemp
    const clasesTemp: ClaseTemp[] = recursos.map((r) => ({
      tempId: Date.now() + Math.random(),
      id_recurso: r.id_recurso,
      nombre: r.nombre,
      descripcion: r.descripcion,
      estado: r.estado,
      orden: r.orden,
      url_video: r.url_video,
      duracion_segundos: r.duracion_segundos,
    }));
    setPanelClases(clasesTemp);
    setShowPanel(true);
  };

  // -----------------
  // CUANDO SE GUARDA PANEL
  // -----------------
  const handlePanelSuccess = async () => {
    setShowPanel(false);
    setEditSeccion(null);
    setPanelClases(undefined);
    await fetchSecciones();
    setToast({ text: "Sección guardada con éxito", color: "bg-green-500" });
    setTimeout(() => setToast(null), 2200);
  };

  // -----------------
  // ELIMINAR SECCION
  // -----------------
  const handleDeleteClick = (id: number, nombre: string) => {
    setDeleteId(id);
    setDeleteNombre(nombre);
    setShowConfirmDelete(true);
  };
  const handleDelete = async () => {
    if (deleteId != null) {
      await deleteSeccion(deleteId);
      setShowConfirmDelete(false);
      setDeleteId(null);
      setDeleteNombre(undefined);
      await fetchSecciones();
      setToast({ text: "Sección eliminada con éxito", color: "bg-red-500" });
      setTimeout(() => setToast(null), 2200);
    }
  };

  // -----------------
  // FILTROS Y BUSQUEDA
  // -----------------
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  const handleEstadoFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstadoFilter(e.target.value as "ALL" | "A" | "I");
    setCurrentPage(1);
  };
  const handleActualizar = async () => {
    await fetchSecciones();
    setToast({ text: "Registros actualizados", color: "bg-purple-600" });
    setTimeout(() => setToast(null), 1300);
  };
  const handleAtras = () => {
    window.history.back();
  };

  console.log("Respuesta del servidor:", Response);

  // -----------------
  // RENDER
  // -----------------
  return (
    <main className={`min-h-screen flex flex-col items-center ${
      isDarkMode ? "bg-gray-900" : "bg-blue-50"
    }`}>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-1 px-4 py-2 rounded ${toast.color} text-white shadow font-semibold text-sm`}>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {toast.text}
        </div>
      )}

      {/* PANEL AGREGAR/EDITAR SECCIÓN Y CLASES */}
      {showPanel && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black bg-opacity-50">
          <div className="flex flex-row h-full max-h-screen">
            <PanelSeccion
              modo={panelMode}
              seccionActual={editSeccion ?? undefined}
              clasesIniciales={mapClaseTempToUX(panelClases)}
              idCurso={idCursoNum}
              onClose={() => setShowPanel(false)}
              onSuccess={handlePanelSuccess}
            />
          </div>
          <div className="flex-1" onClick={() => setShowPanel(false)} />
        </div>
      )}

      {/* Modal Confirmar Eliminar */}
      <ConfirmDeleteModal
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        nombre={deleteNombre || ""}
      />

      <div className="w-[79vw] max-w-6xl mt-10">
        {/* Fila de filtros y acciones */}
        <div className="flex items-center justify-between mb-2 gap-2 w-full">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Filtrar por estado:
            </span>
            <select
              className={`py-1 px-3 rounded border text-xs h-7 focus:outline-none ${
                isDarkMode 
                  ? "bg-gray-800 text-white border-gray-600" 
                  : "bg-white text-gray-900 border-gray-300"
              }`}
              value={estadoFilter}
              onChange={handleEstadoFilter}
            >
              <option value="ALL">Todos</option>
              <option value="A">Activo</option>
              <option value="I">Inactivo</option>
            </select>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-1 text-white font-bold rounded-lg text-xs h-8 transition-all"
              onClick={handleActualizar}
              title="Actualizar"
            >
              Actualizar
            </button>
          </div>
          
          <div className="flex-1 flex justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 px-5 py-1 text-white font-bold rounded text-xs h-8 shadow transition-colors"
              onClick={openAdd}
            >
              Agregar
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-1 text-white font-bold rounded-lg text-xs h-8 transition-all"
              onClick={handleAtras}
            >
              Atrás
            </button>
          </div>
        </div>
        
        <div className="h-2" />
        
        <div className={`rounded-xl border shadow overflow-hidden ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}>
          <div className={`flex justify-between items-center px-4 py-2 border-b ${
            isDarkMode 
              ? "bg-gray-700 border-gray-600" 
              : "bg-gray-50 border-gray-300"
          }`}>
            <div className="flex items-center gap-3">
              <span className={`text-base font-bold drop-shadow-sm ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Secciones del Curso
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                isDarkMode
                  ? "bg-green-900 text-green-300 border-green-600"
                  : "bg-green-100 text-green-700 border-green-300"
              }`}>
                {filtered.length} en Total
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  value={search}
                  onChange={handleSearch}
                  className={`pl-9 pr-2 py-1 rounded border focus:outline-none text-xs h-7 w-48 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="Buscar por nombre"
                />
                <svg className={`w-4 h-4 absolute left-2 top-1.5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Tabla */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className={`px-4 py-4 text-sm ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Cargando...
              </div>
            ) : error ? (
              <div className={`px-4 py-4 text-sm ${
                isDarkMode ? "text-red-400" : "text-red-600"
              }`}>
                {error}
              </div>
            ) : (
              <table className={`w-full text-left text-xs ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}>
                <thead>
                  <tr className={`border-b ${
                    isDarkMode 
                      ? "bg-gray-700 text-gray-300 border-gray-600" 
                      : "bg-gray-50 text-gray-700 border-gray-300"
                  }`}>
                    <th className="py-2 px-3 font-semibold">Nombre</th>
                    <th className="py-2 px-3 font-semibold text-center">Estado</th>
                    <th className="py-2 px-3 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={3} className={`text-center py-4 opacity-70 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}>
                        No hay secciones
                      </td>
                    </tr>
                  ) : paginated.map((seccion) => (
                    <tr key={seccion.id_seccion} className={`border-b ${
                      isDarkMode 
                        ? "border-gray-600 text-white" 
                        : "border-gray-200 text-gray-900"
                    }`}>
                      <td className="py-2 px-3">{seccion.nombre}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[seccion.estado as keyof typeof statusColors]}`}>
                          {statusText[seccion.estado as keyof typeof statusText] || seccion.estado}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            title="Editar"
                            onClick={() => openEdit(mapSeccionToDTO(seccion))}
                          >
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            title="Eliminar"
                            onClick={() => handleDeleteClick(seccion.id_seccion!, seccion.nombre)}
                          >
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22m-5-4H8a2 2 0 00-2 2v0a2 2 0 002 2h8a2 2 0 002-2v0a2 2 0 00-2-2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Paginación */}
          <div className={`flex items-center justify-between px-2 py-3 border-t rounded-b-xl ${
            isDarkMode 
              ? "border-gray-600 bg-gray-800" 
              : "border-gray-300 bg-white"
          }`}>
            <button
              className={`flex items-center gap-1 px-2 py-1 rounded border text-xs h-7 transition-colors ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              } ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
            
            <div className="flex gap-1">
              {[...Array(pageCount).keys()].map((i) => (
                <button
                  key={i + 1}
                  className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                    currentPage === i + 1
                      ? (isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900")
                      : (isDarkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white text-gray-700 hover:bg-gray-100")
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button
              className={`flex items-center gap-1 px-2 py-1 rounded border text-xs h-7 transition-colors ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              } ${(currentPage === pageCount || pageCount === 0) ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentPage === pageCount || pageCount === 0}
              onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
            >
              Siguiente
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
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
    </main>
  );
}