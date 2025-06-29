import { useState, useEffect } from "react";
import type { ReactionType } from "../types/ReactionTypes";
import { useTheme } from "../../../context/theme/ThemeContext";
import { getReaccionesPorComunidad } from "../services/ReaccionesService"; // Ajusta la ruta según tu estructura

interface ReactionsProps {
  reactions: Record<ReactionType, number>;
  userReaction: ReactionType | null;
  onToggleReaction: (type: ReactionType) => void;
  onToggleComments: () => void;
  commentsCount: number;
  idComunidad: number; // Nuevo prop para el ID de la comunidad
  currentUserId: number; // Nuevo prop para el ID del usuario actual
}

export function Reactions({
  reactions,
  userReaction,
  onToggleReaction,
  onToggleComments,
  commentsCount,
  idComunidad,
  currentUserId,
}: ReactionsProps) {
  const { isDarkMode } = useTheme();
  const [showReactionPanel, setShowReactionPanel] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [userReactionFromAPI, setUserReactionFromAPI] = useState<ReactionType | null>(null);
  const [loading, setLoading] = useState(true);

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

  // Mapa de emojis para cada tipo de reacción
  const emojiMap: Record<ReactionType, string> = {
    LIKE: "👍",
    DISLIKE: "👎",
    LOVE: "❤️",
    ANGRY: "😠",
    LAUGH: "😂",
  };

  // Mapa de nombres para cada reacción
  const reactionNames: Record<ReactionType, string> = {
    LIKE: "Me gusta",
    DISLIKE: "No me gusta",
    LOVE: "Me encanta",
    ANGRY: "Me enoja",
    LAUGH: "Me divierte",
  };

  // Mapa de colores para cada reacción
  const reactionColors: Record<ReactionType, string> = {
    LIKE: isDarkMode ? "text-blue-400" : "text-blue-500",
    DISLIKE: isDarkMode ? "text-gray-400" : "text-gray-500",
    LOVE: isDarkMode ? "text-red-400" : "text-red-500",
    ANGRY: isDarkMode ? "text-red-500" : "text-red-600",
    LAUGH: isDarkMode ? "text-yellow-400" : "text-yellow-500",
  };

  // Colores para los badges según tipo y tema
  const bgColorMap: Record<ReactionType, string> = {
    LIKE: isDarkMode ? "bg-blue-500" : "bg-blue-300",
    DISLIKE: isDarkMode ? "bg-gray-500" : "bg-gray-300",
    LOVE: isDarkMode ? "bg-red-500" : "bg-red-300",
    ANGRY: isDarkMode ? "bg-red-600" : "bg-red-400",
    LAUGH: isDarkMode ? "bg-yellow-500" : "bg-yellow-300",
  };

  // Efecto para cargar las reacciones del usuario
  useEffect(() => {
    const loadUserReactions = async () => {
      try {
        setLoading(true);
        const reacciones = await getReaccionesPorComunidad(idComunidad);
        
        // Encontrar la reacción del usuario actual
        const userReactionData = reacciones.find(
          (reaccion) => reaccion.id_usuario_reaccion === currentUserId
        );
        
        if (userReactionData) {
          setUserReactionFromAPI(userReactionData.tipo_reaccion);
        } else {
          setUserReactionFromAPI(null);
        }
      } catch (error) {
        console.error('Error loading user reactions:', error);
        setUserReactionFromAPI(null);
      } finally {
        setLoading(false);
      }
    };

    if (idComunidad && currentUserId) {
      loadUserReactions();
    }
  }, [idComunidad, currentUserId]);

  // Función para mostrar el panel
  const handleMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setShowReactionPanel(true);
  };

  // Función para ocultar el panel con delay
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowReactionPanel(false);
    }, 300);
    setHideTimeout(timeout);
  };

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  // Función para manejar la reacción
  const handleReactionClick = (type: ReactionType) => {
    onToggleReaction(type);
    setUserReactionFromAPI(type);
    setShowReactionPanel(false);
  };

  // Función para manejar click en el botón principal
  const handleMainButtonClick = () => {
    const currentReaction = userReactionFromAPI || userReaction;
    
    if (currentReaction) {
      // Si ya hay una reacción, la quitamos
      onToggleReaction(currentReaction);
      setUserReactionFromAPI(null);
    } else {
      // Si no hay reacción, ponemos "LIKE" por defecto
      onToggleReaction("LIKE");
      setUserReactionFromAPI("LIKE");
    }
  };

  // Determinar qué reacción mostrar (priorizar la de la API)
  const displayReaction = userReactionFromAPI || userReaction;

  return (
    <>
      {totalReactions > 0 && (
        <div
          className={`mt-4 pt-4 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <div
            className={`flex items-center space-x-2 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-700"
            }`}
          >
            <div className="flex -space-x-1">
              {Object.entries(reactions).map(([type, count]) =>
                count > 0 ? (
                  <div
                    key={type}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      bgColorMap[type as ReactionType]
                    }`}
                    title={`${emojiMap[type as ReactionType]} ${count}`}
                  >
                    {emojiMap[type as ReactionType]}
                  </div>
                ) : null
              )}
            </div>
            <span>{totalReactions} reacciones</span>
            <span>•</span>
            <button
              onClick={onToggleComments}
              className={`hover:text-white transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-700"
              }`}
              aria-label="Mostrar comentarios"
            >
              {commentsCount} comentarios
            </button>
          </div>
        </div>
      )}

      <div
        className={`mt-4 pt-4 border-t flex justify-between ${
          isDarkMode ? "border-gray-700" : "border-gray-300"
        }`}
      >
        {/* Botón de Reacción y menú desplegable */}
        <div className="relative">
          <button
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
              displayReaction
                ? `${reactionColors[displayReaction]} font-semibold ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`
                : isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-700 hover:text-black hover:bg-gray-200"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleMainButtonClick}
            aria-label="Reaccionar"
            disabled={loading}
          >
            {loading ? (
              // Mostrar loading spinner
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                <span className="text-sm">Cargando...</span>
              </>
            ) : displayReaction ? (
              // Mostrar emoji y nombre de la reacción seleccionada
              <>
                <span className="text-lg">{emojiMap[displayReaction]}</span>
                <span className="text-sm font-medium">
                  {reactionNames[displayReaction]}
                </span>
              </>
            ) : (
              // Mostrar botón por defecto
              <>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                </svg>
                <span className="text-sm">Reacciona</span>
              </>
            )}
          </button>

          {/* Panel de reacciones */}
          {showReactionPanel && !loading && (
            <div
              className={`absolute bottom-full left-0 mb-2 rounded-lg shadow-lg p-2 flex space-x-1 transition-all duration-200 transform scale-100 z-10 ${
                isDarkMode ? "bg-gray-700 border border-gray-600" : "bg-white border border-gray-200"
              }`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {(["LIKE", "LOVE", "LAUGH", "ANGRY", "DISLIKE"] as ReactionType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => handleReactionClick(type)}
                    className={`p-2 rounded-lg text-xl transition-all duration-200 transform hover:scale-125 ${
                      displayReaction === type 
                        ? (isDarkMode ? "bg-blue-600 ring-2 ring-blue-400" : "bg-blue-200 ring-2 ring-blue-500")
                        : (isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100")
                    }`}
                    title={reactionNames[type]}
                    aria-label={`Reaccionar con ${emojiMap[type]}`}
                  >
                    {emojiMap[type]}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Botón comentar */}
        <button
          onClick={onToggleComments}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
            isDarkMode
              ? "text-gray-400 hover:text-white hover:bg-gray-700"
              : "text-gray-700 hover:text-black hover:bg-gray-200"
          }`}
          aria-label="Comentar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-sm">Comentar</span>
        </button>

        {/* Botón compartir */}
        <button
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
            isDarkMode
              ? "text-gray-400 hover:text-white hover:bg-gray-700"
              : "text-gray-700 hover:text-black hover:bg-gray-200"
          }`}
          aria-label="Compartir"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
          <span className="text-sm">Compartir</span>
        </button>
      </div>
    </>
  );
}