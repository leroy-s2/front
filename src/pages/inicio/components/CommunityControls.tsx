import { isAdmin } from '../../../context/auth/utils/authUtils'; // Ajusta la ruta según tu estructura

interface CommunityControlsProps {
  titulo: string;
  totalComunidades: number;
  isLoading: boolean;
  editarActivo: boolean;
  mostrarListadas: boolean;
  isDarkMode: boolean;
  onAgregarClick: () => void;
  onToggleEditar: () => void;
  onToggleMostrarListadas: () => void;
  onNavigateBack: () => void;
}

export function CommunityControls({
  titulo,
  totalComunidades,
  isLoading,
  editarActivo,
  mostrarListadas,
  isDarkMode,
  onAgregarClick,
  onToggleEditar,
  onToggleMostrarListadas,
  onNavigateBack,
}: CommunityControlsProps) {
  const isUserAdmin = isAdmin();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <h2
          className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {titulo} {!isLoading && `(${totalComunidades})`}
        </h2>

        {/* Botón Agregar Comunidad - Solo visible para administradores */}
        {isUserAdmin && (
          <button
            onClick={onAgregarClick}
            className="bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 rounded text-white font-semibold hover:opacity-90 transition flex items-center gap-2"
            title="Agregar comunidad"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Agregar comunidad
          </button>
        )}

        {/* Botón Editar - Solo visible para administradores */}
        {isUserAdmin && (
          <button
            onClick={onToggleEditar}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition"
          >
            {editarActivo ? "Cancelar" : "Editar"}
          </button>
        )}

        {/* Botón Activo/Inactivo - Solo visible para administradores */}
        {isUserAdmin && (
          <button
            onClick={onToggleMostrarListadas}
            className="flex items-center gap-1 border border-gray-400 rounded px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title={mostrarListadas ? "Mostrar comunidades inactivas" : "Mostrar comunidades disponibles"}
          >
            {mostrarListadas ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.269-3.314m1.438-1.437A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-4.191 5.243"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 616 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18"
                />
              </svg>
            )}
            <span
              className={`hidden sm:inline ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {mostrarListadas ? "disponibles" : "inactivas"}
            </span>
          </button>
        )}
      </div>

      <button
        onClick={onNavigateBack}
        className={`transition font-semibold ${
          isDarkMode
            ? "text-gray-400 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Ver menos ▲
      </button>
    </div>
  );
}