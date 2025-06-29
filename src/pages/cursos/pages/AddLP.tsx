import { useState } from "react";
import { useLenguajes } from "../hooks/useLenguajes";
import type { Lenguaje } from "../models/Lenguaje";
import LenguajeModal from "../components/AddLP/LenguajeModal";
import ConfirmDeleteModal from "../components/AddLP/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/theme/ThemeContext";

const statusColors = {
  A: "bg-green-100 text-green-700 border border-green-400",
  I: "bg-red-100 text-red-700 border border-red-400",
};
const statusText = {
  A: "Activo",
  I: "Inactivo",
};
const PAGE_SIZE = 10;

export default function AddLP() {
  const { lenguajes, loading, error, removeLenguaje, fetchLenguajes } = useLenguajes();
  const { isDarkMode } = useTheme();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editLenguaje, setEditLenguaje] = useState<Lenguaje | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteNombre, setDeleteNombre] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<{ text: string; color: string } | null>(null);
  const [estadoFilter, setEstadoFilter] = useState<"ALL" | "A" | "I">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const filtered = lenguajes.filter((l) => {
    const matchesSearch = l.nombre.toLowerCase().includes(search.toLowerCase());
    const matchesEstado =
      estadoFilter === "ALL" ? true : l.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Modal handlers
  const openAdd = () => {
    setEditLenguaje(null);
    setShowModal(true);
  };
  const openEdit = (lenguaje: Lenguaje) => {
    setEditLenguaje(lenguaje);
    setShowModal(true);
  };

  const handleModalSuccess = async (nuevo?: Lenguaje) => {
    setShowModal(false);
    setEditLenguaje(null);
    setToast({
      text: nuevo ? "Lenguaje Agregado con éxito" : "Lenguaje Editado con éxito",
      color: nuevo ? "bg-green-500" : "bg-blue-500"
    });
    await fetchLenguajes();
    setTimeout(() => setToast(null), 2600);
  };

  const handleDeleteClick = (id: number, nombre: string) => {
    setDeleteId(id);
    setDeleteNombre(nombre);
    setShowConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (deleteId != null) {
      await removeLenguaje(deleteId);
      setShowConfirmDelete(false);
      setDeleteId(null);
      setDeleteNombre(undefined);
      setToast({ text: "Lenguaje Eliminado con éxito", color: "bg-red-500" });
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
    await fetchLenguajes();
    setToast({ text: "Registros actualizados", color: "bg-purple-600" });
    setTimeout(() => setToast(null), 1300);
  };
  const handleAtras = () => {
    window.history.back();
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
      <LenguajeModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditLenguaje(null); }}
        onSuccess={handleModalSuccess}
        lenguaje={editLenguaje}
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
          <div className={`flex justify-between items-center px-4 py-3 border-b ${
            isDarkMode 
              ? "bg-gray-700 border-gray-600" 
              : "bg-gray-50 border-gray-300"
          }`}>
            <div className="flex items-center gap-3">
              <span className={`text-base font-bold drop-shadow-sm ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Lenguajes de Programación
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                isDarkMode
                  ? "bg-green-900 text-green-300 border-green-600"
                  : "bg-green-100 text-green-700 border-green-300"
              }`}>
                {lenguajes.length} en Total
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
                    <th className="py-2 px-3 font-semibold text-right">Estado</th>
                    <th className="py-2 px-3 font-semibold text-right">Cambios</th>
                    <th className="py-2 px-3 font-semibold text-right">Ver Cursos</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={4} className={`text-center py-4 opacity-70 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}>
                        No hay lenguajes
                      </td>
                    </tr>
                  ) : paginated.map((lang) => (
                    <tr key={lang.id_lenguaje} className={`border-b ${
                      isDarkMode 
                        ? "border-gray-600 text-white" 
                        : "border-gray-200 text-gray-900"
                    }`}>
                      <td className="py-2 px-3">{lang.nombre}</td>
                      <td className="py-2 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[lang.estado as keyof typeof statusColors]}`}>
                          {statusText[lang.estado as keyof typeof statusText] || lang.estado}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button title="Editar" onClick={() => openEdit(lang)}>
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button title="Eliminar" onClick={() => handleDeleteClick(lang.id_lenguaje, lang.nombre)}>
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22m-5-4H8a2 2 0 00-2 2v0a2 2 0 002 2h8a2 2 0 002-2v0a2 2 0 00-2-2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded transition-colors"
                          onClick={() => navigate(`/AddLP/AddCurso/${lang.id_lenguaje}`)}
                        >
                          Ver Cursos
                        </button>
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
                  key={`page-btn-${i + 1}`}
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