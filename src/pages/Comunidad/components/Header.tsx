import { FaUsers } from 'react-icons/fa';
import { useComunidadSeleccionada } from "../../Comunidad/hooks/useComunidadSeleccionada"; // Importa el hook

interface HeaderProps {
  onBack: () => void;
}

export function Header({ onBack }: HeaderProps) {
  const { comunidadSeleccionada } = useComunidadSeleccionada(); // Usa el hook para obtener la comunidad seleccionada

  // Si no hay comunidad seleccionada, muestra un mensaje por defecto
  const communityName = comunidadSeleccionada ? comunidadSeleccionada.nombre : 'Comunidad';
  const backgroundImage = comunidadSeleccionada ? comunidadSeleccionada.urlLogo : ''; // Obtén la imagen de la comunidad

  return (
    <div className="relative">
      <div
        className="h-48 relative overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`, // Aplica la imagen de fondo
          backgroundSize: 'cover', // Asegura que la imagen cubra todo el área
          backgroundPosition: 'center', // Centra la imagen
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div> {/* Filtro oscuro para la imagen */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 flex items-center space-x-4">
          <div className="w-20 h-20 bg-white bg-opacity-50 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-black font-bold text-2xl">
              <FaUsers className="w-12 h-12" />
            </span>
          </div>

          <div className="text-white">
            <h1 className="text-4xl font-bold">{communityName}</h1>
          </div>
        </div>

        <button
          onClick={onBack}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg font-semibold backdrop-blur-sm transition-all"
        >
          ← Atrás
        </button>
      </div>
    </div>
  );
}
