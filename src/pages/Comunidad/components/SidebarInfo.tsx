import { useTheme } from "../../../context/theme/ThemeContext"; // Ajusta ruta
import { useComunidadSeleccionada } from "../../Comunidad/hooks/useComunidadSeleccionada"; // Importa el hook

export function SidebarInfo() {
  const { isDarkMode } = useTheme();
  const { comunidadSeleccionada } = useComunidadSeleccionada(); // Usa el hook para obtener la comunidad seleccionada

  // Si no hay comunidad seleccionada, muestra valores por defecto
  const communityDescription = comunidadSeleccionada ? comunidadSeleccionada.descripcion : 'Descripción no disponible';
  const communityCreationYear = comunidadSeleccionada ? comunidadSeleccionada.fecha_creacion : 'Fecha no disponible';

  return (
    <div
      className={`rounded-lg p-4 shadow-lg border ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-700"}`}
    >
      <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        Acerca de
      </h3>
      <div className="space-y-2 text-sm">
        <p>{communityDescription}</p>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>📍 Creada en {communityCreationYear}</p>
      </div>
    </div>
  );
}
