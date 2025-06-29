import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { NotificationIcon } from './NotificationIcon';
import { NotificationPanel } from './NotificationPanel';
import { SettingsIcon } from './SettingsIcon';
import { SettingsModal } from './SettingsModal';
import UserStatus from './UserStatus';
import { useTheme } from '../../context/theme/ThemeContext';

export function Topbar() {
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const { isDarkMode } = useTheme();

  const handleNotificationToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir propagación del evento
    setMostrarNotificaciones(!mostrarNotificaciones);
  };

  return (
    <>
      <header className={`flex justify-between items-center px-6 py-3 ${
        isDarkMode
          ? 'bg-custom-bg text-white'
          : 'bg-white text-gray-900 border-b border-gray-200'
      } relative z-50`}>
        <SearchBar />
        
        <div className="flex items-center gap-6 flex-shrink-0">
          <div onClick={handleNotificationToggle}>
            <NotificationIcon
              mostrarNotificaciones={mostrarNotificaciones}
              setMostrarNotificaciones={setMostrarNotificaciones}
            />
          </div>
          <SettingsIcon onClick={() => setMostrarConfiguracion(true)} />
          <UserStatus />
        </div>
      </header>

      <NotificationPanel
        mostrarNotificaciones={mostrarNotificaciones}
        setMostrarNotificaciones={setMostrarNotificaciones}
      />

      <SettingsModal
        mostrar={mostrarConfiguracion}
        onClose={() => setMostrarConfiguracion(false)}
      />
    </>
  );
}