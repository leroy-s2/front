// NotificationIcon.tsx - Sin cambios, usa el hook normalmente
import { FiBell } from 'react-icons/fi';
import { useTheme } from '../../context/theme/ThemeContext';
import { useNotifications } from '../UseNotifications';

interface NotificationIconProps {
  mostrarNotificaciones: boolean;
  setMostrarNotificaciones: (value: boolean) => void;
}

export function NotificationIcon({
  mostrarNotificaciones,
  setMostrarNotificaciones,
}: NotificationIconProps) {
  const { isDarkMode } = useTheme();
  const { contadorNoLeidas } = useNotifications(true, 30000);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMostrarNotificaciones(!mostrarNotificaciones);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
        mostrarNotificaciones
          ? (isDarkMode
             ? 'bg-blue-600 text-white shadow-lg'
             : 'bg-blue-500 text-white shadow-lg')
          : (isDarkMode
            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100')
      }`}
      aria-label="Notificaciones"
    >
      <FiBell className="w-5 h-5" />
      
      {contadorNoLeidas > 0 && (
        <span
          className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full transition-all duration-200 ${
            isDarkMode ? 'bg-red-500' : 'bg-red-600'
          }`}
        >
          {contadorNoLeidas > 99 ? '99+' : contadorNoLeidas}
        </span>
      )}
    </button>
  );
}