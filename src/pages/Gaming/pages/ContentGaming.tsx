import { useNavigate } from "react-router-dom";
import banner from "../../../assets/gamin.png";
import { useTheme } from "../../../context/theme/ThemeContext";

export function ContentGaming() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const languages = [
    {
      name: "Java",
      color: "#ed8b00",
      bgColor: "#fff8f0",
      darkBgColor: "#2d1810",
      isPremium: false,
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <path fill="currentColor" d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.639"/>
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`w-full min-h-screen p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900"
      }`}
    >
      {/* Banner mejorado */}
      <div className="rounded-2xl mb-8 overflow-hidden relative shadow-2xl">
        <img src={banner} alt="Banner" className="w-full object-cover h-40 md:h-52" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40"></div>
        <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-2xl mb-2">
              Pon a prueba tu conocimiento
            </h1>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-lg">
              Desafía tus habilidades de programación
            </p>
          </div>
        </div>

        {/* Botón Atrás mejorado */}
        <div className="absolute right-6 top-6">
          <button
            onClick={() => navigate("/inicio")}
            className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold shadow-lg hover:bg-white/30 transition-all duration-300 flex items-center gap-2 border border-white/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Atrás
          </button>
        </div>
      </div>

      {/* Sección de filtros y botón agregar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
            } shadow-lg hover:shadow-xl transform hover:scale-105`}
          >
            Todos los lenguajes
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-white hover:bg-gray-50 text-gray-700 shadow-md"
            } border border-gray-300`}
          >
            Solo Gratis
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-white hover:bg-gray-50 text-gray-700 shadow-md"
            } border border-gray-300`}
          >
            Solo Premium
          </button>
        </div>

        <button
          className={`px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
              : "bg-white hover:bg-gray-50 text-gray-700 shadow-lg border border-gray-200"
          } hover:shadow-xl transform hover:scale-105`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar lenguaje
        </button>
      </div>

      {/* Lenguajes con cards modernas */}
      <section>
        <h2 className={`text-2xl font-bold mb-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Lenguajes de Programación
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {languages.map(({ name, color, bgColor, darkBgColor, icon, isPremium }) => (
            <div
              key={name}
              className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group ${
                isDarkMode 
                  ? "bg-gray-800 hover:bg-gray-750 border border-gray-700" 
                  : "bg-white hover:bg-gray-50 shadow-lg border border-gray-100"
              }`}
              onClick={() => navigate(`/gaming/lenguajeseleccionado`)}
            >

              {/* Icono hexagonal */}
              <div className="flex justify-center mb-4 mt-2">
                <div className="relative w-20 h-20">
                  <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0 transform group-hover:rotate-12 transition-transform duration-300">
                    <defs>
                      <linearGradient id={`gradient-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                    <polygon 
                      points="40,8 64,22 64,50 40,64 16,50 16,22" 
                      fill={isDarkMode ? darkBgColor : bgColor}
                      stroke={`url(#gradient-${name})`}
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color }}>
                    {icon}
                  </div>
                </div>
              </div>

              {/* Información del lenguaje simplificada */}
              <div className="text-center">
                <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {name}
                </h3>

                {/* Botón de acción */}
                <button
                  className={`w-full py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    isPremium
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
                      : "bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600"
                  } shadow-lg hover:shadow-xl transform hover:scale-105`}
                >
                  {isPremium ? "Comenzar Premium" : "Comenzar"}
                </button>
              </div>

              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}