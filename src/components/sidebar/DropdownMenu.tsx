import { Link } from 'react-router-dom';
import { FaUsers, FaCode, FaRocket } from 'react-icons/fa';

interface DropdownMenuProps {
  groups: { label: string; id: string }[];
  isActive: (path: string) => boolean;
  isDarkMode: boolean;
  onCommunityClick: (id: number) => void;
}

export function DropdownMenu({ groups, isActive, isDarkMode, onCommunityClick }: DropdownMenuProps) {
  // Array de iconos para rotar entre las comunidades
  const communityIcons = [FaUsers, FaCode, FaRocket, FaUsers, FaCode, FaRocket];

  return (
    <div className={`flex flex-col pl-7 mt-1 gap-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      {groups.map(({ label, id }) => {
        if (!label) return null; // Evitar renderizar elementos sin label
        
        const IconComponent = communityIcons[parseInt(id) % communityIcons.length];
        const isCurrentCommunity = isActive(`/comunidad/${id}`);
        
        return (
          <Link
            key={id}
            to={`/comunidad/${id}`}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group
              ${isCurrentCommunity 
                ? isDarkMode 
                  ? 'bg-purple-600/20 text-purple-400 font-semibold' 
                  : 'bg-purple-100 text-purple-700 font-semibold'
                : isDarkMode
                  ? 'hover:bg-gray-700/50 hover:text-purple-400'
                  : 'hover:bg-gray-100 hover:text-purple-600'
              }
            `}
            onClick={() => onCommunityClick(Number(id))}
          >
            <div className={`
              p-1.5 rounded-md transition-colors duration-200
              ${isCurrentCommunity
                ? isDarkMode
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'bg-purple-200 text-purple-600'
                : isDarkMode
                  ? 'bg-gray-600 text-gray-400 group-hover:bg-purple-500/20 group-hover:text-purple-400'
                  : 'bg-gray-200 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600'
              }
            `}>
              <IconComponent className="w-3 h-3" />
            </div>
            
            <span className="font-medium truncate">
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}