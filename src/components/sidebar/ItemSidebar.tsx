import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/theme/ThemeContext';

interface ItemSidebarProps {
to: string;
icon: React.ReactNode;
label: string;
active: boolean;
}

export function ItemSidebar({ to, icon, label, active }: ItemSidebarProps) {
const { isDarkMode } = useTheme();

return (
  <Link
    to={to}
    className={`px-3 py-2 rounded flex items-center gap-2 transition-colors ${
      active
        ? (isDarkMode 
            ? 'bg-gray-800 font-semibold text-white' 
            : 'bg-blue-100 font-semibold text-blue-700')
        : (isDarkMode 
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
    }`}
  >
    {icon} {label}
  </Link>
);
}