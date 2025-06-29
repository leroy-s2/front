import { ToggleButton } from './ToggleButton';
import { DropdownMenu } from './DropdownMenu';
import { useTheme } from '../../context/theme/ThemeContext';

interface CommunityMenuProps {
  isOpen: boolean;
  toggleOpen: () => void;
  isActive: (path: string) => boolean;
  groups: { label: string; id: string }[];
  onCommunityClick: (id: number) => void;
}

export function CommunityMenu({ isOpen, toggleOpen, isActive, groups, onCommunityClick }: CommunityMenuProps) {
  const { isDarkMode } = useTheme();

  return (
    <>
      <ToggleButton isOpen={isOpen} toggleOpen={toggleOpen} isActive={isActive('/comunidades')} />
      {isOpen && (
        <DropdownMenu 
          groups={groups}
          isActive={isActive}
          isDarkMode={isDarkMode}
          onCommunityClick={onCommunityClick}
        />
      )}
    </>
  );
}