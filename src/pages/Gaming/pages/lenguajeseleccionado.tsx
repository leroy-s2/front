import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Code,
  Crown,
  Unlock,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";
import { useExercises } from "../hooks/EsarEjecicios";

export default function LenguajeSeleccionado() {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("todos");
  const [selectedNivel, setSelectedNivel] = useState("Todos los niveles");
  const navigate = useNavigate();
  const { exercises, loading, error } = useExercises();

  // Función para obtener los niveles únicos de los ejercicios
  const getUniqueNiveles = () => {
    const niveles = exercises.map(exercise => exercise.nivel).filter(Boolean);
    return [...new Set(niveles)];
  };

  const getNivelColor = (nivel: string): string => {
    switch (nivel.toLowerCase()) {
      case "principiante":
      case "básico":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "intermedio":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "avanzado":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "experto":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
    }
  };

  // Función para manejar el click en un ejercicio
  const handleExerciseClick = (exercise: any) => {
    if (exercise.desbloqueado) {
      navigate(`/gaming/lenguajeseleccionado/programa/${exercise.id}`);
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    // Filtro por tab
    let passesTabFilter = true;
    if (activeTab === "premium") passesTabFilter = exercise.requierePremium;
    if (activeTab === "gratis") passesTabFilter = !exercise.requierePremium;

    // Filtro por nivel
    let passesNivelFilter = true;
    if (selectedNivel !== "Todos los niveles") {
      passesNivelFilter = exercise.nivel === selectedNivel;
    }

    return passesTabFilter && passesNivelFilter;
  });

  // Loading state
  if (loading) {
    return (
      <div className={`w-full min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className={`text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Cargando ejercicios...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`w-full min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className={`text-lg mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900"
      }`}
    >
      {/* Header Simplificado */}
      <div
        className={`px-6 py-8 ${
          isDarkMode 
            ? "bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700" 
            : "bg-gradient-to-r from-white to-gray-50 shadow-lg border-b border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                isDarkMode ? "bg-gradient-to-br from-blue-500 to-blue-700" : "bg-gradient-to-br from-blue-500 to-blue-600"
              }`}
            >
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Java</h1>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {exercises.length} ejercicios disponibles
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/gaming")}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center hover:scale-105"
            type="button"
            aria-label="Atrás"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atrás
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center rounded-xl p-3 ${isDarkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
              <span className="text-2xl mr-3">🏋️</span>
              <span className={`font-semibold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Ejercicios
              </span>
            </div>
          </div>
          
          {/* Selector de Nivel Dinámico */}
          <select
            value={selectedNivel}
            onChange={(e) => setSelectedNivel(e.target.value)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              isDarkMode 
                ? "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700" 
                : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-md"
            }`}
          >
            <option value="Todos los niveles">Todos los niveles</option>
            {getUniqueNiveles().map(nivel => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3">
          {[
            { key: "todos", label: "Todos", icon: "📚" },
            { key: "gratis", label: "Gratis", icon: "🆓" },
            { key: "premium", label: "Premium", icon: "✨" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="px-6 pb-8">
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              No hay ejercicios disponibles en esta categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                onClick={() => handleExerciseClick(exercise)}
                className={`rounded-2xl p-6 shadow-lg transition-all duration-300 group relative overflow-hidden ${
                  exercise.desbloqueado 
                    ? `cursor-pointer hover:shadow-2xl hover:scale-105 ${
                        isDarkMode 
                          ? "bg-gray-800 hover:bg-gray-750 border border-gray-700" 
                          : "bg-white hover:bg-gray-50 border border-gray-100"
                      }`
                    : `cursor-not-allowed opacity-75 ${
                        isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"
                      }`
                }`}
              >
                {/* Badge Premium/Gratis */}
                <div className="absolute top-4 right-4 z-10">
                  {exercise.requierePremium ? (
                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                      <Crown className="w-3 h-3" />
                      Premium
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold rounded-full shadow-lg">
                      <Unlock className="w-3 h-3" />
                      Gratis
                    </div>
                  )}
                </div>

                {/* Estado bloqueado únicamente */}
                <div className="absolute top-4 left-4 z-10">
                  {!exercise.desbloqueado && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      🔒 Bloqueado
                    </div>
                  )}
                </div>

                <div className="flex items-start space-x-4 mt-8">
                  {exercise.icon}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className={`text-xl font-bold pr-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {exercise.nombre}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      {/* Badge de Nivel (dinámico desde BD) */}
                      {exercise.nivel && (
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getNivelColor(exercise.nivel)}`}>
                          {exercise.nivel}
                        </span>
                      )}
                      
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < exercise.stars 
                                ? "text-yellow-400 fill-current" 
                                : isDarkMode ? "text-gray-600" : "text-gray-300"
                            }`} 
                          />
                        ))}
                      </div>
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        ⏱️ {exercise.estimatedTime || exercise.tiempoCreacion}
                      </span>
                    </div>
                    
                    <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {exercise.descripcion}
                    </p>

                    {/* Mensaje de bloqueo */}
                    {!exercise.desbloqueado && exercise.nivel && (
                      <div className={`text-sm p-3 rounded-lg mb-4 ${
                        isDarkMode 
                          ? "bg-red-900/30 text-red-300 border border-red-700" 
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        🔒 Requiere completar ejercicios de nivel anterior
                      </div>
                    )}

                    {/* Botón de acción simplificado */}
                    <div className="mt-4">
                      <button
                        disabled={!exercise.desbloqueado}
                        className={`w-full py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          !exercise.desbloqueado
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : exercise.requierePremium
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                      >
                        {!exercise.desbloqueado 
                          ? "Bloqueado" 
                          : exercise.requierePremium 
                          ? "Comenzar Premium" 
                          : "Comenzar"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Efecto de brillo en hover */}
                {exercise.desbloqueado && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}