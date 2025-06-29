import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCursos } from "../hooks/useCursos";
import { useLenguajes } from "../hooks/useLenguajes";
import { useTheme } from "../../../context/theme/ThemeContext";
import type { Curso } from "../models/Curso";
import CursoModal from "../components/AddCurso/CursoModal";
import ConfirmDeleteModal from "../components/AddCurso/ConfirmDeleteModal";

const statusColors = {
  A: "bg-green-100 text-green-700 border border-green-400",
  I: "bg-red-100 text-red-700 border border-red-400",
};
const statusText = {
  A: "Activo",
  I: "Inactivo",
};
const PAGE_SIZE = 10;

export default function AddCurso() {
  const { id_lenguaje } = useParams<{ id_lenguaje: string }>();
  const id_lenguaje_num = Number(id_lenguaje);
  const { cursos, loading, error, removeCurso, fetchCursos } = useCursos();
  const { lenguajes } = useLenguajes();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editCurso, setEditCurso] = useState<Curso | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteNombre, setDeleteNombre] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<{ text: string; color: string } | null>(null);
  const [estadoFilter, setEstadoFilter] = useState<"ALL" | "A" | "I">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar cursos por id_lenguaje
  const cursosFiltrados = cursos.filter(
    (c) => c.lenguaje?.id_lenguaje === id_lenguaje_num
  );

  // Filtrado avanzado (búsqueda y estado)
  const filtered = cursosFiltrados.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.descripcion.toLowerCase().includes(search.toLowerCase());
    const matchesEstado =
      estadoFilter === "ALL" ? true : c.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Modal handlers
  const openAdd = () => {
    setEditCurso(null);
    setShowModal(true);
  };
  const openEdit = (curso: Curso) => {
    setEditCurso(curso);
    setShowModal(true);
  };

  const handleModalSuccess = async (nuevo?: Curso) => {
    setShowModal(false);
    setEditCurso(null);
    setToast({
      text: nuevo ? "Curso agregado con éxito" : "Curso editado con éxito",
      color: nuevo ? "bg-green-500" : "bg-blue-500",
    });
    await fetchCursos();
    setTimeout(() => setToast(null), 2600);
  };

  const handleDeleteClick = (id: number, nombre: string) => {
    setDeleteId(id);
    setDeleteNombre(nombre);
    setShowConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (deleteId != null) {
      await removeCurso(deleteId);
      setShowConfirmDelete(false);
      setDeleteId(null);
      setDeleteNombre(undefined);
      setToast({ text: "Curso eliminado con éxito", color: "bg-red-500" });
      setTimeout(() => setToast(null), 2600);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  const handleEstadoFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstadoFilter(e.target.value as "ALL" | "A" | "I");
    setCurrentPage(1);
  };

  const handleActualizar = async () => {
    await fetchCursos();
    setToast({ text: "Registros actualizados", color: "bg-purple-600" });
    setTimeout(() => setToast(null), 1300);
  };

  const handleExportExcel = () => {
    alert("Función de exportar a Excel no implementada (usa xlsx o SheetJS)");
  };

  const handleAtras = () => {
    window.history.back();
  };

  // Encontrar el nombre del lenguaje seleccionado
  const lenguajeActual = lenguajes.find((l) => l.id_lenguaje === id_lenguaje_num);

  // Selección de curso para mostrar secciones
  const handleVerSecciones = (curso: Curso) => {
    navigate(`/AddLP/AddSeccion/${curso.id_curso}`);
  };

  return (
    <main className={`min-h-screen flex flex-col items-center ${
      isDarkMode ? "bg-gray-900" : "bg-blue-50"
    }`}>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-1 px-4 py-2 rounded ${toast.color} text-white shadow font-semibold text-sm`}>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {toast.text}
        </div>
      )}

      {/* Modal Agregar/Editar */}
      <CursoModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditCurso(null); }}
        onSuccess={handleModalSuccess}
        curso={editCurso}
        id_lenguaje={id_lenguaje_num}
      />

      {/* Modal Confirmar Eliminar */}
      <ConfirmDeleteModal
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        nombre={deleteNombre}
      />

      <div className="w-[79vw] max-w-6xl mt-10">

        {/* Fila de filtros y acciones */}
        <div className="flex items-center justify-between mb-2 gap-2 w-full">
          {/* Izquierda: Filtro y Actualizar */}
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
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M19.07 15.07A8 8 0 1 0 6 6" />
              </svg>
            </button>
          </div>
          
          {/* Centro: Botón Agregar */}
          <div className="flex-1 flex justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 px-5 py-1 text-white font-bold rounded text-xs h-8 shadow transition-colors"
              onClick={openAdd}
            >
              Agregar
            </button>
          </div>
          
          {/* Derecha: Atrás */}
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-1 text-white font-bold rounded-lg text-xs h-8 transition-all"
              onClick={handleAtras}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Atrás
            </button>
          </div>
        </div>

        {/* Separación menor entre filtros y tabla */}
        <div className="h-2" />

        {/* Tabla y buscador */}
        <div className={`rounded-xl border shadow overflow-hidden ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}>
          {/* Header tabla y buscador */}
          <div className={`flex justify-between items-center px-4 py-2 border-b ${
            isDarkMode 
              ? "bg-gray-700 border-gray-600" 
              : "bg-gray-50 border-gray-300"
          }`}>
            <div className="flex items-center gap-3">
              <span className={`text-base font-bold drop-shadow-sm ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                {lenguajeActual
                  ? `Cursos de ${lenguajeActual.nombre}`
                  : "Todos los Cursos"}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                isDarkMode
                  ? "bg-green-900 text-green-300 border-green-600"
                  : "bg-green-100 text-green-700 border-green-300"
              }`}>
                {cursosFiltrados.length} en Total
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
                  placeholder="Buscar"
                />
                <svg className={`w-4 h-4 absolute left-2 top-1.5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              {/* Botón descargar Excel */}
              <button
                title="Descargar Excel"
                onClick={handleExportExcel}
                className={`ml-1 rounded p-1 border h-7 w-7 flex items-center justify-center transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                </svg>
              </button>
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
                    <th className="py-2 px-3 font-semibold">Descripción</th>
                    <th className="py-2 px-3 font-semibold text-center">Fecha de Creación</th>
                    <th className="py-2 px-3 font-semibold text-center">Estado</th>
                    <th className="py-2 px-3 font-semibold text-center">Cambios</th>
                    <th className="py-2 px-3 font-semibold text-center">Ver Secciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`text-center py-4 opacity-70 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {lenguajeActual
                          ? "No hay cursos para este lenguaje"
                          : "No hay cursos"}
                      </td>
                    </tr>
                  ) : paginated.map((curso) => (
                    <tr key={curso.id_curso} className={`border-b ${
                      isDarkMode 
                        ? "border-gray-600 text-white" 
                        : "border-gray-200 text-gray-900"
                    }`}>
                      <td className="py-2 px-3">{curso.nombre}</td>
                      <td className="py-2 px-3">{curso.descripcion}</td>
                      <td className="py-2 px-3 text-center">
                        {curso.fechaCreacion
                          ? new Date(curso.fechaCreacion).toLocaleString()
                          : "—"}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[curso.estado as keyof typeof statusColors]}`}>
                          {statusText[curso.estado as keyof typeof statusText] || curso.estado}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex justify-center items-center gap-2 h-full">
                          <button title="Editar" onClick={() => openEdit(curso)}>
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button title="Eliminar" onClick={() => handleDeleteClick(curso.id_curso, curso.nombre)}>
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22m-5-4H8a2 2 0 00-2 2v0a2 2 0 002 2h8a2 2 0 002-2v0a2 2 0 00-2-2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      {/* --- VER SECCIONES --- */}
                      <td className="py-2 px-3 text-center align-middle">
                        <div className="flex justify-center items-center h-full">
                          <button
                            className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 transition text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            style={{ minWidth: 110 }}
                            onClick={() => handleVerSecciones(curso)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <rect x="4" y="4" width="16" height="16" rx="3" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
                            </svg>
                            Ver Secciones
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
    </main>
  );
}