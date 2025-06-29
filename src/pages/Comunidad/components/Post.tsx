import React, { useState, useEffect } from "react";
import { User, MoreHorizontal } from 'lucide-react';
import type { Comentario } from "../types/ReactionTypes";
import type { Comentariopost } from "../models/Comentarios";
import type { Archivo } from "../models/Publicacion";
import { Reactions } from "../components/Reactions";
import useReactions from "../hooks/ReactionsProvider";
import { useTheme } from "../../../context/theme/ThemeContext";
import { usuariosService } from '../services/autordepublicacion';
import { comentariosService } from '../services/comentariosService';
import { PostFiles } from "../components/PostFiles";
import { getUserId } from '../../../context/auth/utils/authUtils';

interface PostProps {
  author: string;
  time: string;
  content: React.ReactNode;
  initialComments: Comentario[];
  postId: number;
  archivos: Archivo[];
  onCommentAdded?: (newComment: Comentario) => void;
  idComunidad: number;
}

// Componente mejorado para cada comentario individual
interface CommentComponentProps {
  comment: Comentario;
  isDarkMode: boolean;
}

const CommentComponent: React.FC<CommentComponentProps> = ({ comment, isDarkMode }) => {
  const [authorName, setAuthorName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        const name = await usuariosService.obtenerAutor(comment.id_usuario_comenta);
        setAuthorName(name);
      } catch (error) {
        console.error('Error al obtener el autor del comentario:', error);
        setAuthorName(`Usuario ${comment.id_usuario_comenta}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [comment.id_usuario_comenta]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className={`flex gap-3 p-4 transition-colors group ${
      isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
    }`}>
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
      
      {/* Contenido del comentario */}
      <div className="flex-1 min-w-0">
        {/* Header del comentario con nombre y tiempo */}
        <div className="flex items-center gap-2 mb-1">
          {loading ? (
            <div className={`h-4 w-20 rounded animate-pulse ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          ) : (
            <span className={`font-semibold text-sm ${
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            }`}>
              {authorName}
            </span>
          )}
          <span className={`text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {formatTime(comment.fecha_creacion)}
          </span>
        </div>
        
        {/* Contenido del comentario */}
        <div className={`text-sm leading-relaxed ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {comment.comentario}
        </div>
      </div>
      
      {/* Menú de opciones */}
      <button className={`p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 ${
        isDarkMode 
          ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
          : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'
      }`}>
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
};

// Componente separado para el formulario de comentarios
interface CommentFormProps {
  isDarkMode: boolean;
  postId: number;
  onCommentSubmit?: (newComment: Comentario) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ isDarkMode, postId, onCommentSubmit }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Crear el objeto comentario según el modelo Comentariopost (para enviar)
      const comentarioData: Comentariopost = {
        comentario: newComment.trim(),
        publicacion: { id: postId }
      };

      // Enviar el comentario usando el servicio
      const response = await comentariosService.crearComentario(comentarioData) as Comentario;
      console.log('Comentario creado exitosamente:', response);
      
      // Llamar al callback si existe para actualizar la lista
      if (onCommentSubmit && response) {
        onCommentSubmit(response);
      }
      
      setNewComment('');
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      setError(error instanceof Error ? error.message : 'Error al enviar el comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-4 border-t ${
      isDarkMode ? 'border-gray-700' : 'border-gray-100'
    }`}>
      {/* Mostrar error si existe */}
      {error && (
        <div className={`mb-3 p-2 rounded text-sm ${
          isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
        }`}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmitComment} className="flex gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className={`w-full p-3 rounded-lg border resize-none text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            rows={2}
            disabled={isSubmitting}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                newComment.trim() && !isSubmitting
                  ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// Componente para la lista completa de comentarios
interface CommentsListProps {
  comments: Comentario[];
  isDarkMode: boolean;
  postId: number;
  onCommentAdded?: (newComment: Comentario) => void;
}

const CommentsList: React.FC<CommentsListProps> = ({ 
  comments, 
  isDarkMode, 
  postId,
  onCommentAdded
}) => {
  const [showAllComments, setShowAllComments] = useState(false);
  const [currentComments, setCurrentComments] = useState<Comentario[]>(comments);

  // Actualizar los comentarios cuando cambien las props
  useEffect(() => {
    setCurrentComments(comments);
  }, [comments]);

  // Función para manejar nuevos comentarios
  const handleNewComment = (newComment: Comentario) => {
    setCurrentComments(prevComments => [newComment, ...prevComments]);
    if (onCommentAdded) {
      onCommentAdded(newComment);
    }
  };

  // Mostrar solo los primeros 3 comentarios inicialmente
  const visibleComments = showAllComments ? currentComments : currentComments.slice(0, 3);
  const hasMoreComments = currentComments.length > 3;

  return (
    <div className={`mt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      {/* Header de comentarios - solo mostrar si hay comentarios */}
      {currentComments.length > 0 && (
        <div className={`px-4 py-3 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <h4 className={`font-semibold text-sm ${
              isDarkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Comentarios ({currentComments.length})
            </h4>
            {hasMoreComments && (
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className={`text-xs font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                {showAllComments 
                  ? 'Ver menos' 
                  : `Ver los ${currentComments.length - 3} comentarios restantes`
                }
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Lista de comentarios */}
      {currentComments.length > 0 && (
        <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
          {visibleComments.map((comment) => (
            <CommentComponent 
              key={comment.id || `temp-${comment.comentario}-${Date.now()}`} 
              comment={comment} 
              isDarkMode={isDarkMode} 
            />
          ))}
        </div>
      )}
      
      {/* Mensaje cuando no hay comentarios */}
      {currentComments.length === 0 && (
        <div className={`text-center py-6 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p className="text-sm">No hay comentarios aún</p>
          <p className="text-xs mt-1">¡Sé el primero en comentar!</p>
        </div>
      )}
      
      {/* Formulario para nuevo comentario */}
      <CommentForm 
        isDarkMode={isDarkMode} 
        postId={postId}
        onCommentSubmit={handleNewComment}
      />
    </div>
  );
};

// Componente Post principal con comentarios mejorados y archivos adjuntos
export function Post({
  author,
  time,
  content,
  initialComments,
  postId,
  archivos,
  onCommentAdded,
  idComunidad
}: PostProps) {
  const { isDarkMode } = useTheme();
  const { reactions, toggleReaction } = useReactions(postId);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(initialComments.length);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Obtener el ID del usuario actual usando getUserId()
  useEffect(() => {
    const fetchCurrentUserId = () => {
      try {
        const userId = getUserId();
        setCurrentUserId(userId);
        console.log('Current User ID obtenido desde getUserId():', userId);
      } catch (error) {
        console.error("Error al obtener el ID del usuario actual:", error);
        setCurrentUserId(null);
      }
    };

    fetchCurrentUserId();
  }, []);

  // Función para manejar cuando se agrega un nuevo comentario
  const handleCommentAdded = (newComment: Comentario) => {
    setCommentsCount(prev => prev + 1);
    if (onCommentAdded) {
      onCommentAdded(newComment);
    }
  };

  return (
    <div className={`rounded-lg p-6 shadow-lg transition-all duration-200 hover:shadow-xl ${
      isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
    }`}>
      {/* Header del post */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isDarkMode ? "bg-gray-600" : "bg-gray-300"
          }`}>
            <User className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <div>
            <h3 className={`${isDarkMode ? "text-white" : "text-gray-900"} font-semibold`}>
              {author}
            </h3>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs`}>
              {time}
            </p>
          </div>
        </div>
        
        {/* Menú de opciones del post */}
        <button className={`p-2 rounded-full transition-all duration-200 ${
          isDarkMode 
            ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
        }`}>
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Contenido del post */}
      <div className={`${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-4 leading-relaxed`}>
        {content}
      </div>

      {/* Archivos adjuntos */}
      {archivos && archivos.length > 0 && (
        <div className="mb-4">
          <h4 className={`${isDarkMode ? 'text-gray-200' : 'text-gray-900'} font-semibold text-sm mb-2`}>
            Archivos adjuntos ({archivos.length})
          </h4>
          <PostFiles archivos={archivos} />
        </div>
      )}

      {/* Reactions con los nuevos props */}
      {currentUserId !== null ? (
        <Reactions
          reactions={reactions}
          userReaction={null}
          onToggleReaction={toggleReaction}
          onToggleComments={() => setShowComments(!showComments)}
          commentsCount={commentsCount}
          idComunidad={idComunidad}
          currentUserId={currentUserId}
        />
      ) : (
        // Mostrar loading mientras se obtiene el usuario
        <div className={`mt-4 pt-4 border-t flex justify-center ${
          isDarkMode ? "border-gray-700" : "border-gray-300"
        }`}>
          <div className="animate-pulse flex items-center space-x-2">
            <div className={`h-4 w-4 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Cargando reacciones...
            </span>
          </div>
        </div>
      )}

      {/* Mostrar los comentarios mejorados si 'showComments' es verdadero */}
      {showComments && (
        <CommentsList
          comments={initialComments}
          isDarkMode={isDarkMode}
          postId={postId}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}