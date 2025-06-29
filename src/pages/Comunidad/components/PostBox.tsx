import { useState, useRef, useEffect } from "react";
import { Camera, FileText, X, Video } from "lucide-react";
import { useComunidadSeleccionada } from "../hooks/useComunidadSeleccionada";
import { publicacionesService } from "../services/publicacionesService";
import type { PostPublicacion } from "../models/Publicacion";

// Hook simulado para el tema (puedes reemplazarlo con tu implementación)
const useTheme = () => ({ isDarkMode: false });

interface PostBoxProps {
  onPost?: (content: string, attachments?: File[]) => void;
  onPublicacionCreada?: () => void;
}

export function PostBox({ onPost, onPublicacionCreada }: PostBoxProps) {
  const { isDarkMode } = useTheme();
  const { comunidadSeleccionada } = useComunidadSeleccionada();
  
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        if (!text.trim() && attachments.length === 0) {
          setExpanded(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [text, attachments]);

  const handlePost = async () => {
    if (!text.trim() && attachments.length === 0) return;
    if (!comunidadSeleccionada) {
      console.error("No hay comunidad seleccionada");
      return;
    }

    setIsPosting(true);

    try {
      // Crear la publicación base con 'contenido' dentro de 'comunidad'
      const publicacionData: PostPublicacion = {
        publicacion: {
          contenido: text.trim(),
          comunidad: { id: comunidadSeleccionada.id }
        },
        // NO incluir archivos aquí - se envían por separado
      };

      // Crear publicación (con o sin archivos)
      const publicacionCreada = await publicacionesService.crearPublicacionConArchivos(
        publicacionData, 
        attachments // Puede ser un array vacío si no hay archivos
      );

      // Limpiar los campos y restablecer el estado
      setText("");
      setAttachments([]);
      setExpanded(false);

      // Callback para acciones posteriores
      if (onPost) {
        onPost(text, attachments);
      }
      if (onPublicacionCreada) {
        onPublicacionCreada();
      }

      console.log("Publicación creada exitosamente:", publicacionCreada);
    } catch (error) {
      console.error("Error al crear la publicación:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleFileSelect = (files: FileList | null, type: 'image' | 'video' | 'file') => {
    if (!files) return;
    
    const filesArray = Array.from(files);
    const newFiles = filesArray.filter(file => {
      if (type === 'image') {
        return file.type.startsWith('image/');
      } else if (type === 'video') {
        return file.type.startsWith('video/');
      }
      return true;
    });
    
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files, 'file');
      setExpanded(true);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Camera className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div
      ref={boxRef}
      className={`rounded-xl shadow-lg border transition-all duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} ${expanded ? 'shadow-xl' : 'shadow-sm hover:shadow-md'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${isDarkMode ? "bg-blue-600" : "bg-blue-500"}`}>
              TU
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          {/* Input Area */}
          <div className="flex-1">
            <textarea
              placeholder="¿Qué estás pensando?"
              className={`w-full rounded-lg px-4 py-3 resize-none border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${isDarkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-gray-50 text-gray-900 placeholder-gray-500"}`}
              style={{ height: expanded ? "100px" : "44px", minHeight: "44px" }}
              onFocus={() => setExpanded(true)}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Drag and Drop Overlay */}
      {dragActive && (
        <div className={`absolute inset-0 border-2 border-dashed border-blue-500 rounded-xl flex items-center justify-center z-10 ${isDarkMode ? "bg-gray-800/90" : "bg-white/90"}`}>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Suelta tus archivos aquí</p>
          </div>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 pb-3">
          <div className="space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                <div className={`p-2 rounded ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}>
                  {getFileIcon(file)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>{file.name}</p>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{formatFileSize(file.size)}</p>
                </div>
                <button onClick={() => removeAttachment(index)} className={`p-1 rounded-full hover:bg-red-100 ${isDarkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-600"}`}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {expanded && (
        <div className={`border-t px-4 py-3 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center justify-center space-x-1 mb-3">
            <button onClick={() => imageInputRef.current?.click()} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
              <Camera className="w-4 h-4 text-green-500" />
              <span>Foto</span>
            </button>
            
            <button onClick={() => videoInputRef.current?.click()} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
              <Video className="w-4 h-4 text-purple-500" />
              <span>Video</span>
            </button>
            
            <button onClick={() => fileInputRef.current?.click()} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Archivo</span>
            </button>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <button className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-700 border border-gray-600" : "text-gray-600 hover:bg-gray-100 border border-gray-300"}`} onClick={() => { setText(""); setAttachments([]); setExpanded(false); }}>
              Cancelar
            </button>
            <button className={`px-8 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${text.trim() || attachments.length > 0 && !isPosting ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg" : isDarkMode ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`} onClick={handlePost} disabled={(!text.trim() && attachments.length === 0) || isPosting || !comunidadSeleccionada}>
              {isPosting ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileSelect(e.target.files, 'image')} />
      <input ref={videoInputRef} type="file" accept="video/*" multiple className="hidden" onChange={(e) => handleFileSelect(e.target.files, 'video')} />
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFileSelect(e.target.files, 'file')} />
    </div>
  );
}
