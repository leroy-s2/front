import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, RotateCcw, Flag, Loader2, AlertCircle, CheckCircle, ChevronDown, ChevronUp, X } from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";
import BaseConverterService from "../services/ejercicios"; 
import type{ espesificoBaseConverter } from "../services/ejercicios";

export default function Programa() {
  const { isDarkMode } = useTheme();
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<espesificoBaseConverter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  
  // Estados para manejar el colapso de las descripciones
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isPruebasExpanded, setIsPruebasExpanded] = useState(false);
  
  // Estado para manejar qué se muestra en la consola
  const [consoleMode, setConsoleMode] = useState<'output' | 'submission'>('output');

  // Función para determinar si un texto es largo (más de 200 caracteres)
  const isTextLong = (text: string, maxLength: number = 200) => {
    return text && text.length > maxLength;
  };

  // Función para truncar texto
  const truncateText = (text: string, maxLength: number = 200) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Función para obtener el número de líneas del código
  const getLineNumbers = (text: string) => {
    const lines = text.split('\n');
    return lines.map((_, index) => index + 1);
  };

  // Cargar los datos del ejercicio específico
  useEffect(() => {
    const loadExercise = async () => {
      console.log("Exercise ID desde params:", exerciseId);
      
      if (!exerciseId) {
        setError("ID del ejercicio no encontrado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Llamando API con ID:", exerciseId);
        const exerciseData = await BaseConverterService.getBaseConverterById(parseInt(exerciseId));
        console.log("Datos recibidos:", exerciseData);
        setExercise(exerciseData);
        setCode(exerciseData.plantilla);
        setError(null);
      } catch (err) {
        console.error("Error al cargar el ejercicio:", err);
        setError("Error al cargar el ejercicio. Por favor, inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [exerciseId]);

  const runCode = () => {
    setIsRunning(true);
    setConsoleMode('output'); // Cambiar a modo salida cuando se ejecuta código
    setTimeout(() => {
      try {
        if (code.includes("print(")) {
          const matches = code.match(/print\(["'`]?(.*?)["'`]?\)/g);
          if (matches) {
            const outputs = matches.map(match => {
              const content = match.match(/print\(["'`]?(.*?)["'`]?\)/);
              return content ? content[1] : "";
            });
            setOutput(outputs.join("\n"));
          } else {
            setOutput("Código ejecutado");
          }
        } else {
          setOutput("Código ejecutado - sin salida visible");
        }
      } catch (error) {
        setOutput("Error en la ejecución del código");
      }
      setIsRunning(false);
    }, 1000);
  };

  const resetCode = () => {
    if (exercise) {
      setCode(exercise.plantilla);
      setOutput("");
      setSubmissionResult(null);
      setConsoleMode('output');
    }
  };

  const surrender = () => {
    // Navegación directa sin confirmación
    navigate("/gaming/lenguajeseleccionado");
  };

  const finalize = async () => {
    if (!exercise || !exerciseId) {
      setSubmissionResult({
        success: false,
        message: "Error: No se puede enviar la solución sin un ejercicio válido.",
        errors: []
      });
      setConsoleMode('submission');
      return;
    }

    if (!code.trim()) {
      setSubmissionResult({
        success: false,
        message: "Por favor, escribe algún código antes de finalizar.",
        errors: []
      });
      setConsoleMode('submission');
      return;
    }

    // Envío directo sin confirmación
    try {
      setIsSubmitting(true);
      setSubmissionResult(null);
      setConsoleMode('submission'); // Cambiar a modo submisión

      console.log("Enviando solución:", {
        exerciseId: parseInt(exerciseId),
        code: code
      });

      const result = await BaseConverterService.postSolution(parseInt(exerciseId), code);
      
      console.log("Resultado de la submisión:", result);
      setSubmissionResult(result);
      
    } catch (error) {
      console.error("Error al enviar la solución:", error);
      
      let errorMessage = "Error al enviar la solución. ";
      if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += "Por favor, inténtalo de nuevo.";
      }
      
      setSubmissionResult({ 
        success: false, 
        message: errorMessage, 
        errors: [] 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para limpiar el resultado de la submisión
  const clearSubmissionResult = () => {
    setSubmissionResult(null);
    setConsoleMode('output');
  };

  // Loading state
  if (loading) {
    return (
      <div className={`w-full min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-blue-50"
      }`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className={`text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Cargando ejercicio... ID: {exerciseId}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !exercise) {
    return (
      <div className={`w-full min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-blue-50"
      }`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className={`text-lg mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {error || "Ejercicio no encontrado"}
          </p>
          <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            ID buscado: {exerciseId}
          </p>
          <button
            onClick={() => navigate("/gaming/lenguajeseleccionado")}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Volver a ejercicios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen flex flex-col mt-3 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`px-6 py-4 flex items-center justify-between border-b ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/gaming/lenguajeseleccionado")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
          <div
            className={`h-6 w-px ${
              isDarkMode ? "bg-gray-600" : "bg-gray-400"
            }`}
          ></div>
          <div>
            <h1 className="text-xl font-bold">{exercise.nombre}</h1>
            <span className={`text-sm px-2 py-1 rounded-full ${
              exercise.nivel === "Principiante" 
                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                : exercise.nivel === "Intermedio"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
            }`}>
              {exercise.nivel}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={surrender}
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Flag className="w-4 h-4" />
            <span>Rendirse</span>
          </button>
          <button
            onClick={finalize}
            disabled={isSubmitting || !code.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Finalizar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Exercise Description */}
      <div
        className={`px-6 py-4 border-b ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        <div className="max-w-4xl">
          {/* Descripción Principal */}
          <div
            className={`rounded-lg border transition-all duration-300 ${
              isDarkMode
                ? "bg-blue-900/30 border-blue-700/50 text-blue-100"
                : "bg-blue-100 border-blue-300 text-blue-700"
            }`}
          >
            <div 
              className={`p-4 ${isTextLong(exercise.descripcion) ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
              onClick={() => isTextLong(exercise.descripcion) && setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold mb-2">📋 Descripción del ejercicio:</h3>
                {isTextLong(exercise.descripcion) && (
                  <button className="flex items-center space-x-1 text-sm opacity-70 hover:opacity-100">
                    {isDescriptionExpanded ? (
                      <>
                        <span>Contraer</span>
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Expandir</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap">
                {isTextLong(exercise.descripcion) && !isDescriptionExpanded
                  ? truncateText(exercise.descripcion)
                  : exercise.descripcion}
              </p>
              {isTextLong(exercise.descripcion) && !isDescriptionExpanded && (
                <p className="text-xs mt-2 opacity-60">
                  Haz clic para ver la descripción completa
                </p>
              )}
            </div>
          </div>
          
          {/* Mostrar información adicional si existe el campo Pruebas */}
          {exercise.Pruebas && (
            <div
              className={`mt-4 rounded-lg border transition-all duration-300 ${
                isDarkMode
                  ? "bg-orange-900/30 border-orange-700/50 text-orange-100"
                  : "bg-orange-100 border-orange-300 text-orange-700"
              }`}
            >
              <div 
                className={`p-4 ${isTextLong(exercise.Pruebas) ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                onClick={() => isTextLong(exercise.Pruebas) && setIsPruebasExpanded(!isPruebasExpanded)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold mb-2">🧪 Pruebas y criterios:</h3>
                  {isTextLong(exercise.Pruebas) && (
                    <button className="flex items-center space-x-1 text-sm opacity-70 hover:opacity-100">
                      {isPruebasExpanded ? (
                        <>
                          <span>Contraer</span>
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Expandir</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">
                  {isTextLong(exercise.Pruebas) && !isPruebasExpanded
                    ? truncateText(exercise.Pruebas)
                    : exercise.Pruebas}
                </p>
                {isTextLong(exercise.Pruebas) && !isPruebasExpanded && (
                  <p className="text-xs mt-2 opacity-60">
                    Haz clic para ver los criterios completos
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div
            className={`px-6 py-3 border-b flex items-center justify-between ${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
            }`}
          >
            <h2
              className={`${isDarkMode ? "text-white" : "text-gray-900"} text-lg font-semibold`}
            >
              Editor de Código - {exercise.nombre}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={resetCode}
                disabled={isSubmitting}
                className={`px-3 py-1.5 rounded text-sm transition-colors flex items-center space-x-1 ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white"
                    : "bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 text-gray-900"
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar</span>
              </button>
              <button
                onClick={runCode}
                disabled={isRunning || isSubmitting}
                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <Play className="w-3 h-3" />
                <span>{isRunning ? "Ejecutando..." : "Ejecutar"}</span>
              </button>
            </div>
          </div>

          <div
            className={`flex-1 p-6 ${
              isDarkMode ? "bg-gray-900" : "bg-blue-50"
            }`}
          >
            {/* Editor con numeración de líneas */}
            <div
              className={`w-full h-full rounded-lg border flex overflow-hidden ${
                isDarkMode
                  ? "border-gray-700 bg-gray-900"
                  : "border-gray-300 bg-white"
              }`}
            >
              {/* Panel de números de línea */}
              <div
                className={`px-2 py-4 border-r select-none ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-500"
                }`}
                style={{
                  minWidth: '50px',
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                }}
              >
                {getLineNumbers(code).map((lineNumber) => (
                  <div
                    key={lineNumber}
                    className="text-right text-sm leading-6"
                    style={{ height: '24px' }}
                  >
                    {lineNumber}
                  </div>
                ))}
              </div>

              {/* Editor de código */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isSubmitting}
                className={`flex-1 font-mono text-sm p-4 focus:outline-none resize-none leading-6 ${
                  isDarkMode
                    ? "bg-gray-900 text-green-400 disabled:bg-gray-800 disabled:text-gray-500"
                    : "bg-white text-green-700 disabled:bg-gray-100 disabled:text-gray-500"
                }`}
                style={{ 
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  lineHeight: '24px'
                }}
                placeholder="El código de la plantilla aparecerá aquí..."
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div
          className={`w-96 flex flex-col border-l ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
          }`}
        >
          {/* Header de la consola con tabs */}
          <div className="px-6 py-3 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Consola
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setConsoleMode('output')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    consoleMode === 'output'
                      ? "bg-blue-500 text-white"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Salida
                </button>
                <button
                  onClick={() => setConsoleMode('submission')}
                  disabled={!submissionResult}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    consoleMode === 'submission'
                      ? "bg-blue-500 text-white"
                      : submissionResult
                      ? isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-gray-400 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Resultado
                  {submissionResult && (
                    <span className={`ml-1 w-2 h-2 rounded-full inline-block ${
                      submissionResult.success ? 'bg-green-400' : 'bg-red-400'
                    }`}></span>
                  )}
                </button>
                {submissionResult && consoleMode === 'submission' && (
                  <button
                    onClick={clearSubmissionResult}
                    className="p-1 rounded hover:bg-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            <div
              className={`rounded-lg p-4 h-full font-mono text-sm min-h-[200px] overflow-y-auto ${
                isDarkMode ? "bg-black" : "bg-gray-100"
              }`}
            >
              {consoleMode === 'output' ? (
                // Modo salida de código
                <>
                  {isRunning ? (
                    <div className="text-yellow-400">Ejecutando código...</div>
                  ) : output ? (
                    <div className={`whitespace-pre-wrap ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                      {output}
                    </div>
                  ) : (
                    <div className={isDarkMode ? "text-gray-500" : "text-gray-600"}>
                      La salida del código aparecerá aquí...
                      <br />
                      <br />
                      💡 Modifica el código de la plantilla según las instrucciones
                    </div>
                  )}
                </>
              ) : (
                // Modo resultado de submisión
                <>
                  {isSubmitting ? (
                    <div className="text-yellow-400">
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Enviando solución al servidor...
                    </div>
                  ) : submissionResult ? (
                    <div className="space-y-4">
                      {/* Mensaje principal */}
                      <div className={`flex items-start space-x-2 ${
                        submissionResult.success ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <span className="mt-0.5">
                          {submissionResult.success ? '✅' : '❌'}
                        </span>
                        <div>
                          <div className="font-semibold">
                            {submissionResult.success ? 'Éxito' : 'Error'}
                          </div>
                          <div className="text-sm mt-1">
                            {submissionResult.message}
                          </div>
                        </div>
                      </div>

                      {/* Mostrar errores si existen */}
                      {submissionResult.errors && submissionResult.errors.length > 0 && (
                        <div className="mt-4">
                          <div className="text-red-400 font-semibold mb-2">
                            🔍 Errores encontrados ({submissionResult.errors.length}):
                          </div>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {submissionResult.errors.map((error: string, index: number) => (
                              <div
                                key={index}
                                className={`p-2 rounded text-xs border-l-2 border-red-400 ${
                                  isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-700'
                                }`}
                              >
                                <span className="font-mono">{error}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Información adicional */}
                      {submissionResult.solutionId && (
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          ID de solución: {submissionResult.solutionId}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={isDarkMode ? "text-gray-500" : "text-gray-600"}>
                      Los resultados de la submisión aparecerán aquí...
                      <br />
                      <br />
                      📤 Presiona "Finalizar" para enviar tu solución
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Exercise Info */}
          <div
            className={`px-6 py-4 border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            }`}
          >
            <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
              ℹ️ Información del ejercicio:
            </h3>
            <div className={`text-xs space-y-1 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
              <div><strong>Nivel:</strong> {exercise.nivel}</div>
              <div><strong>Premium:</strong> {exercise.requierePremium ? "Sí" : "No"}</div>
              <div><strong>Líneas de código:</strong> {code.split('\n').length}</div>
              <div><strong>Caracteres en código:</strong> {code.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}