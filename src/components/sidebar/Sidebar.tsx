import { FaHome, FaGraduationCap, FaGamepad, FaCreditCard, FaPlus } from 'react-icons/fa';
import { useSidebar } from './useSidebar';
import { ItemSidebar } from './ItemSidebar';
import { CommunityMenu } from './CommunityMenu';
import { useTheme } from '../../context/theme/ThemeContext';
import { useCommunity } from '../../context/UserCommunitiesContext';
import { useComunidadSeleccionada } from "../../pages/Comunidad/hooks/useComunidadSeleccionada";
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../../context/auth/utils/authUtils'; // Importar la función isAdmin

export function Sidebar() {
  const { communityOpen, setCommunityOpen, isActive } = useSidebar();
  const { isDarkMode } = useTheme();
  const { setComunidad } = useComunidadSeleccionada();
  const { userCommunities } = useCommunity();
  const navigate = useNavigate();

  // Verificar que las comunidades tienen datos válidos antes de mapear
  const validCommunities = userCommunities.filter(community => community.comunidad && community.comunidad.id);

  // Función para manejar el clic en una comunidad
  const handleComunidadClick = (id: number) => {
    const selectedCommunity = validCommunities.find(community => community.comunidad.id === id);
    if (selectedCommunity) {
      setComunidad(selectedCommunity.comunidad);
      navigate(`/comunidad/${id}`);
    }
  };

  return (
    <aside
      className={`w-56 ${isDarkMode ? 'bg-custom-bg text-white' : 'bg-white text-gray-900 border-r border-gray-200'} flex flex-col p-4 gap-3`}
    >
      <div className="flex items-center gap-2 mb-8">
        <img src="/vite.png" alt="Logo" className="w-8 h-8" />
        <div>
          <h1 className="font-bold text-xl text-blue-500">
            Coding<span className="text-purple-600">Share</span>
          </h1>
          <p className={`text-xs ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`}>community</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        <ItemSidebar to="/Inicio" icon={<FaHome />} label="Inicio" active={isActive('/Inicio')} />
        <ItemSidebar to="/cursos" icon={<FaGraduationCap />} label="Cursos" active={isActive('/cursos')} />
        <ItemSidebar to="/gaming" icon={<FaGamepad />} label="Gaming" active={isActive('/gaming')} />
        
        {/* Mostrar opciones administrativas solo para administradores */}
        {isAdmin() && (
          <>
            <ItemSidebar 
              to="/confirmacion_de_pago" 
              icon={<FaCreditCard />} 
              label="Confirmación de Pago" 
              active={isActive('/confirmacion_de_pago')} 
            />
            <ItemSidebar 
              to="/AddLP" 
              icon={<FaPlus />} 
              label="Agregar curso" 
              active={isActive('/AddLP')} 
            />
          </>
        )}

        {/* Renderizamos las comunidades unidas */}
        <CommunityMenu
          isOpen={communityOpen}
          toggleOpen={() => setCommunityOpen(!communityOpen)}
          isActive={isActive}
          groups={validCommunities.map((community) => ({
            label: community.comunidad.nombre,
            id: community.comunidad.id.toString(),
          }))}
          onCommunityClick={handleComunidadClick}
        />
      </nav>
    </aside>
  );
}