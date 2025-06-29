import { FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useTheme } from '../../context/theme/ThemeContext';

interface ToggleButtonProps {
  isOpen: boolean;
  toggleOpen: () => void;
  isActive: boolean;
}

function getButtonClasses(isDarkMode: boolean, isActive: boolean) {
  if (isDarkMode) {
    return isActive
      ? 'bg-gray-800 text-white font-semibold'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  }
  return isActive
    ? 'bg-purple-200 text-purple-700 font-semibold'
    : 'text-gray-700 hover:bg-purple-100 hover:text-purple-700';
}

function getIconClasses(isDarkMode: boolean, isActive: boolean) {
  if (isDarkMode) {
    return isActive
      ? 'text-white'
      : 'text-gray-300 group-hover:text-white';
  }
  return isActive
    ? 'text-purple-700'
    : 'text-gray-700 group-hover:text-purple-700';
}

export function ToggleButton({ isOpen, toggleOpen, isActive }: ToggleButtonProps) {
  const { isDarkMode } = useTheme();

  return (
    <button
      onClick={toggleOpen}
      className={`group flex items-center justify-between px-3 py-2 rounded ${getButtonClasses(isDarkMode, isActive)}`}
    >
      <div className="flex items-center gap-2">
        <FaUsers className={`transition-colors duration-200 ${getIconClasses(isDarkMode, isActive)}`} />
        Comunidad
      </div>
      {isOpen ? (
        <FaChevronUp className={`transition-colors duration-200 ${getIconClasses(isDarkMode, isActive)}`} />
      ) : (
        <FaChevronDown className={`transition-colors duration-200 ${getIconClasses(isDarkMode, isActive)}`} />
      )}
    </button>
  );
}
