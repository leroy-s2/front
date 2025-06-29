import { useState, useEffect } from "react";
import { useTheme } from "../../../context/theme/ThemeContext";
import { Header } from "../components/Header";
import { CommunityInfo } from "../components/CommunityInfo";
import { Filters } from "../components/Filters";
import { Post } from "../components/Post";
import { SidebarInfo } from "../components/SidebarInfo";
import { PostBox } from "../components/PostBox";
import { useComunidadSeleccionada } from "../hooks/useComunidadSeleccionada";
import { publicacionesService } from "../services/publicacionesService";
import { usuariosService } from "../services/autordepublicacion";
import { comentariosService } from "../services/comentariosService";
import { getToken } from '../../../context/auth/utils/authUtils';
import type { Comentario } from "../types/ReactionTypes";

export default function ContentComunidad() {
  const { isDarkMode } = useTheme();
  const { comunidadSeleccionada } = useComunidadSeleccionada();
  const [filter, setFilter] = useState("all");
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comentarios, setComentarios] = useState<Record<number, Comentario[]>>({});
  const [usuarioActual, setUsuarioActual] = useState<string>("");

  // Obtener el usuario actual al cargar el componente
  useEffect(() => {
    const fetchUsuarioActual = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.warn("No hay token de autenticación disponible");
          return;
        }

        const idUsuarioActual = obtenerIdUsuarioDelToken(token);
        
        if (idUsuarioActual) {
          const nombreUsuario = await usuariosService.obtenerAutor(idUsuarioActual);
          setUsuarioActual(nombreUsuario);
        }
      } catch (err) {
        console.error("Error al obtener el usuario actual:", err);
      }
    };

    fetchUsuarioActual();
  }, []);

  // Función helper para obtener el ID del usuario del token
  const obtenerIdUsuarioDelToken = (token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || null;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  // Obtiene las publicaciones de la comunidad seleccionada
  useEffect(() => {
    const fetchPublicaciones = async () => {
      if (!comunidadSeleccionada) return;

      try {
        setLoading(true);
        const publicaciones = await publicacionesService.obtenerPublicacionesPorComunidad(comunidadSeleccionada.id);

        // Obtener los nombres de los autores y los archivos
        const publicacionesConAutoresYArchivos = await Promise.all(publicaciones.map(async (publicacion) => {
          const autorNombre = await usuariosService.obtenerAutor(publicacion.id_usuario_publica);
          return { ...publicacion, autor: autorNombre };
        }));

        // Obtener los comentarios para cada publicación
        const comentariosPorPublicacion = await Promise.all(publicacionesConAutoresYArchivos.map(async (publicacion) => {
          try {
            const comentarios = await comentariosService.obtenerComentariosPorPublicacion(publicacion.id);
            return { id: publicacion.id, comentarios };
          } catch (error) {
            console.error(`Error al obtener comentarios para publicación ${publicacion.id}:`, error);
            return { id: publicacion.id, comentarios: [] };
          }
        }));

        // Almacenar los comentarios en un estado
        const comentariosMap = comentariosPorPublicacion.reduce((acc: any, { id, comentarios }) => {
          acc[id] = comentarios;
          return acc;
        }, {});

        // Ordenar las publicaciones por fecha_creacion (de más reciente a más antiguo)
        const publicacionesOrdenadas = publicacionesConAutoresYArchivos.sort((a, b) => {
          const fechaA = new Date(a.fecha_creacion).getTime();
          const fechaB = new Date(b.fecha_creacion).getTime();
          return fechaB - fechaA;
        });

        setPublicaciones(publicacionesOrdenadas);
        setComentarios(comentariosMap);
      } catch (err) {
        console.error("Error al obtener las publicaciones:", err);
        setError("Error al obtener las publicaciones");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, [comunidadSeleccionada]);

  // Función para manejar nuevos comentarios
  const handleNewComment = (postId: number, newComment: Comentario) => {
    setComentarios(prev => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])]
    }));
  };

  // Lógica para crear una nueva publicación
  const handleNewPost = async (content: string) => {
    try {
      const newPost = {
        id: Date.now(),
        contenido: content,
        fecha_creacion: new Date().toISOString(),
        autor: usuarioActual || "Usuario",
        archivos: [],
        id_usuario_publica: obtenerIdUsuarioDelToken(getToken() || '') || 0
      };

      setPublicaciones([newPost, ...publicaciones]);
      setComentarios(prev => ({
        ...prev,
        [newPost.id]: []
      }));
    } catch (error) {
      console.error("Error al crear nueva publicación:", error);
    }
  };

  return (
    <div
      className={isDarkMode ? "bg-gray-900 min-h-screen text-white" : "bg-blue-50 min-h-screen text-gray-800"}
    >
      <Header onBack={() => console.log("Navegando atrás...")} />
      <CommunityInfo />

      <div className="flex gap-6 p-6">
        <div
          className={isDarkMode ? "flex-1 space-y-6" : "flex-1 space-y-6 bg-blue-100 rounded-lg shadow-md p-4"}
        >
          <Filters selectedFilter={filter} onSelectFilter={setFilter} />

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                isDarkMode ? 'border-white' : 'border-blue-500'
              }`}></div>
              <span className="ml-2">Cargando publicaciones...</span>
            </div>
          ) : error ? (
            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
            }`}>
              <p className="font-semibold">Error</p>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className={`mt-2 px-3 py-1 rounded text-sm ${
                  isDarkMode ? 'bg-red-800 hover:bg-red-700' : 'bg-red-200 hover:bg-red-300'
                }`}
              >
                Intentar de nuevo
              </button>
            </div>
          ) : publicaciones.length === 0 ? (
            <div className={`text-center py-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <p className="text-lg font-semibold mb-2">No hay publicaciones en esta comunidad</p>
              <p className="text-sm">¡Sé el primero en compartir algo!</p>
            </div>
          ) : (
            publicaciones.map((publicacion) => (
              <Post
                key={publicacion.id}
                author={publicacion.autor}
                time={new Date(publicacion.fecha_creacion).toLocaleString()}
                initialComments={comentarios[publicacion.id] || []}
                postId={publicacion.id}
                archivos={publicacion.archivos || []}
                onCommentAdded={(newComment) => handleNewComment(publicacion.id, newComment)}
                idComunidad={comunidadSeleccionada?.id || 0} // Pasar el ID de la comunidad
                content={
                  <div>
                    <p>{publicacion.contenido}</p>
                  </div>
                }
              />
            ))
          )}
        </div>

        <div className="w-80 space-y-6">
          <PostBox onPost={handleNewPost} />
          <SidebarInfo />
        </div>
      </div>
    </div>
  );
}