import React, { useState, useEffect } from "react";
import type { Community } from "../models/Community";

interface ModalCrearComunidadProps {
  visible: boolean;
  onClose: () => void;
  onCrear: (comunidad: any, imagenFile?: File | null) => Promise<void>;
  isDarkMode: boolean;
  comunidadInicial?: Community;
  onLoadingChange?: (loading: boolean) => void;
}

export function ModalCrearComunidad({
  visible,
  onClose,
  onCrear,
  isDarkMode,
  comunidadInicial,
  onLoadingChange,
}: ModalCrearComunidadProps) {
  const [nombre, setNombre] = useState("");
  const [infoAdicional, setInfoAdicional] = useState("");
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Notificar cambios de loading al componente padre
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  // Cuando cambia comunidadInicial, precarga los campos
  useEffect(() => {
    if (comunidadInicial) {
      setNombre(comunidadInicial.nombre);
      setInfoAdicional(comunidadInicial.descripcion);
      setPreviewUrl(comunidadInicial.urlLogo || "");
      setImagenFile(null);
    } else {
      setNombre("");
      setInfoAdicional("");
      setPreviewUrl("");
      setImagenFile(null);
    }
    setError(null);
  }, [comunidadInicial]);

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setNombre("");
    setInfoAdicional("");
    setImagenFile(null);
    setPreviewUrl("");
    setError(null);
    setIsLoading(false);
  };

  // Limpiar los valores del formulario y cerrar el modal
  const handleClose = () => {
    if (!isLoading) {
      limpiarFormulario();
      onClose();
    }
  };

  // Limpiar el estado cuando el modal se cierra
  useEffect(() => {
    if (!visible) {
      limpiarFormulario();
    }
  }, [visible]);

  if (!visible) return null;

  const inputBaseClasses =
    "w-full mb-4 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400";

  const inputClasses = isDarkMode
    ? inputBaseClasses + " bg-gray-700 border-gray-600 text-white"
    : inputBaseClasses + " bg-white border-gray-300 text-gray-900";

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagenFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(comunidadInicial?.urlLogo || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevenir múltiples envíos
    if (isLoading) {
      return;
    }

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    if (!infoAdicional.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    // Para nuevas comunidades, la imagen es obligatoria
    if (!comunidadInicial && !imagenFile) {
      setError("La imagen es obligatoria");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Crear objeto con datos básicos
    const comunidadData = {
      nombre: nombre.trim(),
      descripcion: infoAdicional.trim(),
    };

    try {
      // Llamar al callback del padre que maneja la creación/edición
      await onCrear(comunidadData, imagenFile);
      
      // El componente padre se encarga de cerrar el modal y actualizar la lista
      // Solo limpiar el formulario aquí
      limpiarFormulario();
      
    } catch (err: unknown) {
      // Manejar errores localmente
      if (err && typeof err === "object" && "message" in err) {
        const errorMessage = (err as { message: string }).message;
        setError(errorMessage);
      } else {
        setError("Hubo un error al procesar la solicitud.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={handleClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className={`rounded-lg p-6 max-w-md w-full relative ${
          isDarkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-gray-900 shadow-lg"
        }`}
      >
        <h3 className="font-bold mb-4">
          {comunidadInicial ? "Editar comunidad" : "Crea una nueva comunidad"}
        </h3>

        {error && (
          <div className="text-red-500 mb-4 p-2 bg-red-100 dark:bg-red-900/20 rounded">
            {error}
          </div>
        )}

        <label htmlFor="nombre" className="block mb-2 font-semibold">
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={inputClasses}
          required
          disabled={isLoading}
          maxLength={100}
        />

        <label htmlFor="imagen" className="block mb-2 font-semibold">
          Imagen representativa del grupo
          {!comunidadInicial && <span className="text-red-500"> *</span>}
        </label>
        <input
          id="imagen"
          type="file"
          accept="image/*"
          onChange={handleImagenChange}
          className="mb-4"
          disabled={isLoading}
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Previsualización imagen"
            className="mb-4 max-h-40 object-contain rounded border"
          />
        )}

        <label htmlFor="infoAdicional" className="block mb-2 font-semibold">
          Descripción
        </label>
        <textarea
          id="infoAdicional"
          value={infoAdicional}
          onChange={(e) => setInfoAdicional(e.target.value)}
          rows={5}
          className={inputClasses}
          required
          disabled={isLoading}
          maxLength={500}
          placeholder="Describe brevemente de qué trata esta comunidad..."
        />

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className={`px-4 py-2 rounded transition ${
              isDarkMode
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-500 hover:bg-green-600 text-white shadow-md"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {isLoading
              ? comunidadInicial 
                ? "Guardando..." 
                : "Creando..."
              : comunidadInicial
              ? "Guardar cambios"
              : "Crear comunidad"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className={`px-4 py-2 rounded transition ${
              isDarkMode
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-500 hover:bg-red-600 text-white shadow-md"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}