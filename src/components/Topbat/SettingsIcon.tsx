import { FiSettings } from 'react-icons/fi';

interface SettingsIconProps {
  onClick: () => void;
}

export function SettingsIcon({ onClick }: SettingsIconProps) {
  return (
    <FiSettings
      className="text-xl hover:text-purple-400 cursor-pointer"
      onClick={onClick}
    />
  );
}
