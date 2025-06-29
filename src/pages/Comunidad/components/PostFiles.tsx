import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import type { Archivo } from "../models/Publicacion";

interface PostFilesProps {
  archivos: Archivo[];
}

// Modal para ver imágenes/videos en pantalla completa
interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaFiles: Archivo[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  onClose,
  mediaFiles,
  currentIndex,
  onNavigate
}) => {
  if (!isOpen) return null;

  const currentFile = mediaFiles[currentIndex];

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : mediaFiles.length - 1;
    onNavigate(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < mediaFiles.length - 1 ? currentIndex + 1 : 0;
    onNavigate(newIndex);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Contador */}
      <div className="absolute top-4 left-4 text-white text-sm z-10">
        {currentIndex + 1} de {mediaFiles.length}
      </div>

      {/* Navegación */}
      {mediaFiles.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Contenido del modal */}
      <div className="max-w-full max-h-full p-8">
        {currentFile.tipo_publicacion === "IMAGEN" ? (
          <img
            src={currentFile.url_archivo}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <video
            src={currentFile.url_archivo}
            controls
            className="max-w-full max-h-full"
            autoPlay
          />
        )}
      </div>
    </div>
  );
};

// Componente principal para mostrar archivos
export const PostFiles: React.FC<PostFilesProps> = ({ archivos }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Separar archivos por tipo
  const mediaFiles = archivos.filter(archivo => 
    archivo.tipo_publicacion === "IMAGEN" || archivo.tipo_publicacion === "VIDEO"
  );
  const documentFiles = archivos.filter(archivo => 
    archivo.tipo_publicacion === "DOCUMENTO"
  );

  const openModal = (index: number) => {
    setCurrentMediaIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Función para renderizar la galería según el número de archivos multimedia
  const renderMediaGallery = () => {
    if (mediaFiles.length === 0) return null;

    const maxDisplayed = 4;
    const remainingCount = mediaFiles.length - maxDisplayed;

    // Una sola imagen/video
    if (mediaFiles.length === 1) {
      const file = mediaFiles[0];
      return (
        <div 
          className="relative w-full h-80 rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => openModal(0)}
        >
          {file.tipo_publicacion === "IMAGEN" ? (
            <img
              src={file.url_archivo}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="relative w-full h-full">
              <video
                src={file.url_archivo}
                className="w-full h-full object-cover"
                muted
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Dos archivos multimedia
    if (mediaFiles.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 h-80 rounded-lg overflow-hidden">
          {mediaFiles.slice(0, 2).map((file, index) => (
            <div
              key={file.id}
              className="relative cursor-pointer group overflow-hidden"
              onClick={() => openModal(index)}
            >
              {file.tipo_publicacion === "IMAGEN" ? (
                <img
                  src={file.url_archivo}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="relative w-full h-full">
                  <video
                    src={file.url_archivo}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Tres archivos multimedia
    if (mediaFiles.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-1 h-80 rounded-lg overflow-hidden">
          {/* Primera imagen ocupa toda la altura a la izquierda */}
          <div
            className="relative cursor-pointer group overflow-hidden"
            onClick={() => openModal(0)}
          >
            {mediaFiles[0].tipo_publicacion === "IMAGEN" ? (
              <img
                src={mediaFiles[0].url_archivo}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  src={mediaFiles[0].url_archivo}
                  className="w-full h-full object-cover"
                  muted
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Las otras dos imágenes se apilan a la derecha */}
          <div className="grid grid-rows-2 gap-1">
            {mediaFiles.slice(1, 3).map((file, index) => (
              <div
                key={file.id}
                className="relative cursor-pointer group overflow-hidden"
                onClick={() => openModal(index + 1)}
              >
                {file.tipo_publicacion === "IMAGEN" ? (
                  <img
                    src={file.url_archivo}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={file.url_archivo}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Cuatro o más archivos multimedia
    return (
      <div className="grid grid-cols-2 gap-1 h-80 rounded-lg overflow-hidden">
        {mediaFiles.slice(0, maxDisplayed).map((file, index) => (
          <div
            key={file.id}
            className="relative cursor-pointer group overflow-hidden"
            onClick={() => openModal(index)}
          >
            {file.tipo_publicacion === "IMAGEN" ? (
              <img
                src={file.url_archivo}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  src={file.url_archivo}
                  className="w-full h-full object-cover"
                  muted
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Overlay para mostrar "+X más" en la última imagen */}
            {index === maxDisplayed - 1 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Función para renderizar documentos
  const renderDocuments = () => {
    if (documentFiles.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        {documentFiles.map((documento) => (
          <a
            key={documento.id}
            href={documento.url_archivo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 group"
          >
            <div className="flex-shrink-0">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                Documento adjunto
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Haz clic para descargar
              </p>
            </div>
            <div className="flex-shrink-0">
              <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
            </div>
          </a>
        ))}
      </div>
    );
  };

  if (archivos.length === 0) return null;

  return (
    <div className="mt-3">
      {/* Galería de imágenes y videos */}
      {renderMediaGallery()}

      {/* Documentos (si los hay) */}
      {renderDocuments()}

      {/* Modal para ver archivos multimedia */}
      <MediaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mediaFiles={mediaFiles}
        currentIndex={currentMediaIndex}
        onNavigate={setCurrentMediaIndex}
      />
    </div>
  );
};