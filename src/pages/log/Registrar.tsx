import React, { useState } from "react";
import fondo from "../../assets/fondo.png";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/register";
import { loginUser } from "../../context/auth/authActions";
import { useAuth } from '../../context/auth/AuthContext';
import { IoEye, IoEyeOff, IoCheckmarkCircle, IoCloseCircle, IoChevronDown } from 'react-icons/io5';

// Lista de países
const paises = [
  "Perú",
  "Argentina",
  "Bolivia",
  "Brasil",
  "Chile",
  "Colombia",
  "Ecuador",
  "Guyana",
  "Paraguay",
  "Suriname",
  "Uruguay",
  "Venezuela",
  "México",
  "Guatemala",
  "Belice",
  "El Salvador",
  "Honduras",
  "Nicaragua",
  "Costa Rica",
  "Panamá",
  "Cuba",
  "República Dominicana",
  "Haití",
  "Jamaica",
  "Puerto Rico",
  "Trinidad y Tobago",
  "Barbados",
  "España",
  "Estados Unidos",
  "Canadá",
  "Reino Unido",
  "Francia",
  "Alemania",
  "Italia",
  "Portugal",
  "Países Bajos",
  "Bélgica",
  "Suiza",
  "Austria",
  "Suecia",
  "Noruega",
  "Dinamarca",
  "Finlandia",
  "Polonia",
  "República Checa",
  "Hungría",
  "Rumania",
  "Bulgaria",
  "Grecia",
  "Turquía",
  "Rusia",
  "Ucrania",
  "Japón",
  "China",
  "Corea del Sur",
  "India",
  "Tailandia",
  "Vietnam",
  "Filipinas",
  "Indonesia",
  "Malasia",
  "Singapur",
  "Australia",
  "Nueva Zelanda",
  "Sudáfrica",
  "Egipto",
  "Marruecos",
  "Nigeria",
  "Kenia"
];

export default function Registrar() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    pais: "Perú", // Valor por defecto
    fechaNacimiento: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCountrySelect = (pais: string) => {
    setFormData((prevData) => ({
      ...prevData,
      pais: pais,
    }));
    setShowCountryDropdown(false);
    setCountrySearch("");
  };

  const filteredCountries = paises.filter(pais =>
    pais.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return { minLength, hasUpper, hasLower, hasNumber };
  };

  const passwordValidation = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar términos y condiciones
    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar que todos los campos obligatorios estén llenos
    const requiredFields = ['nombre', 'apellido', 'email', 'pais', 'fechaNacimiento', 'password', 'username'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Validar fortaleza de contraseña
    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordValid) {
      setError("La contraseña debe cumplir todos los requisitos de seguridad");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Registrar usuario
      await registerUser(formData);
      console.log('Usuario registrado exitosamente');
      
      // Iniciar sesión automáticamente después del registro
      const loginResult = await loginUser(formData.username, formData.password);
      
      if (loginResult.success && loginResult.userData) {
        console.log('Login automático exitoso después del registro');
        
        // El token ya fue guardado por loginUser a través de loginUtil
        // Solo necesitamos obtener el token guardado y actualizar el contexto
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Actualizamos el contexto de autenticación
          const loginSuccess = await login(token);
          
          if (loginSuccess) {
            // Navegamos al inicio
            navigate("/Inicio", { replace: true });
          } else {
            setError('Error al inicializar la sesión después del registro');
          }
        } else {
          setError('Error al obtener el token de autenticación después del registro');
        }
      } else {
        // Si el login automático falla, mostrar error pero mantener al usuario en la página
        setError(loginResult.error || 'Usuario registrado, pero ocurrió un error al iniciar sesión automáticamente. Intenta iniciar sesión manualmente.');
        console.error('Error en login automático:', loginResult.error);
      }
      
    } catch (err) {
      console.error('Error durante el registro:', err);
      if (err instanceof Error) {
        if (err.message.includes('409') || err.message.includes('conflict')) {
          setError("El usuario o email ya existe. Intenta con otros datos.");
        } else if (err.message.includes('400')) {
          setError("Datos inválidos. Verifica la información ingresada.");
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          setError("Error de conexión. Verifica tu conexión a internet.");
        } else {
          setError(`Error al registrar el usuario: ${err.message}`);
        }
      } else {
        setError("Error desconocido durante el registro");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <div className="w-full max-w-5xl bg-black/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        
        {/* Efectos decorativos */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="absolute -top-5 -right-5 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>

        {/* Header compacto */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Codingshare
          </h1>
          <p className="text-sm text-gray-300 mt-1">Crea tu cuenta y únete a la comunidad</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Grid principal con 3 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Columna 1: Información Personal */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/90 border-b border-white/20 pb-1">
                Información Personal
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/80 mb-1 block">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm placeholder:text-gray-400 outline-none border border-white/20 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-white/80 mb-1 block">Apellido *</label>
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Tu apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm placeholder:text-gray-400 outline-none border border-white/20 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-white/80 mb-1 block">Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm placeholder:text-gray-400 outline-none border border-white/20 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="relative">
                  <label className="text-xs text-white/80 mb-1 block">País *</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="w-full bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm text-left outline-none border border-white/20 focus:border-blue-400 focus:bg-white/15 transition-all duration-300 flex items-center justify-between"
                      disabled={loading}
                    >
                      <span>{formData.pais}</span>
                      <IoChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCountryDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-50 max-h-48 overflow-hidden">
                        <div className="p-2 border-b border-white/10">
                          <input
                            type="text"
                            placeholder="Buscar país..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full bg-white/10 text-white px-2 py-1 rounded text-xs outline-none border border-white/20 focus:border-blue-400"
                          />
                        </div>
                        <div className="max-h-32 overflow-y-auto">
                          {filteredCountries.map((pais) => (
                            <button
                              key={pais}
                              type="button"
                              onClick={() => handleCountrySelect(pais)}
                              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-150"
                            >
                              {pais}
                            </button>
                          ))}
                          {filteredCountries.length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-400">
                              No se encontraron países
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/80 mb-1 block">Fecha de Nacimiento *</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm outline-none border border-white/20 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Columna 2: Seguridad */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/90 border-b border-white/20 pb-1">
                Seguridad
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/80 mb-1 block">Contraseña *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Contraseña segura"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-white/10 backdrop-blur-sm text-white px-3 py-2 pr-10 rounded-lg text-sm placeholder:text-gray-400 outline-none border border-white/20 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      {showPassword ? <IoEyeOff className="w-4 h-4" /> : <IoEye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Validación compacta de contraseña */}
                  {formData.password && (
                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        {passwordValidation.minLength ? 
                          <IoCheckmarkCircle className="text-green-400 w-3 h-3" /> : 
                          <IoCloseCircle className="text-red-400 w-3 h-3" />
                        }
                        <span className={passwordValidation.minLength ? "text-green-400" : "text-red-400"}>
                          8+ chars
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {passwordValidation.hasUpper ? 
                          <IoCheckmarkCircle className="text-green-400 w-3 h-3" /> : 
                          <IoCloseCircle className="text-red-400 w-3 h-3" />
                        }
                        <span className={passwordValidation.hasUpper ? "text-green-400" : "text-red-400"}>
                          Mayús.
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {passwordValidation.hasLower ? 
                          <IoCheckmarkCircle className="text-green-400 w-3 h-3" /> : 
                          <IoCloseCircle className="text-red-400 w-3 h-3" />
                        }
                        <span className={passwordValidation.hasLower ? "text-green-400" : "text-red-400"}>
                          Minús.
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {passwordValidation.hasNumber ? 
                          <IoCheckmarkCircle className="text-green-400 w-3 h-3" /> : 
                          <IoCloseCircle className="text-red-400 w-3 h-3" />
                        }
                        <span className={passwordValidation.hasNumber ? "text-green-400" : "text-red-400"}>
                          Número
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-white/80 mb-1 block">Confirmar Contraseña *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirma contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-white/10 backdrop-blur-sm text-white px-3 py-2 pr-10 rounded-lg text-sm placeholder:text-gray-400 outline-none border border-white/20 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <IoEyeOff className="w-4 h-4" /> : <IoEye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {formData.confirmPassword && (
                    <div className="mt-1 flex items-center gap-1 text-xs">
                      {passwordsMatch ? 
                        <IoCheckmarkCircle className="text-green-400 w-3 h-3" /> : 
                        <IoCloseCircle className="text-red-400 w-3 h-3" />
                      }
                      <span className={passwordsMatch ? "text-green-400" : "text-red-400"}>
                        {passwordsMatch ? "Contraseñas coinciden" : "No coinciden"}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-white/80 mb-1 block">Nombre de usuario *</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Usuario único"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm placeholder:text-gray-400 outline-none border border-white/20 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                    disabled={loading}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Tu identificador único</p>
                </div>
              </div>
            </div>

            {/* Columna 3: Términos y Botón */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/90 border-b border-white/20 pb-1">
                Finalizar Registro
              </h3>
              
              <div className="space-y-4">
                {/* Error */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-red-300 text-xs flex items-center gap-2">
                      <IoCloseCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="leading-relaxed">{error}</span>
                    </p>
                  </div>
                )}

                {/* Términos */}
                <div className="flex items-start gap-2">
                  <input 
                    id="terms" 
                    type="checkbox" 
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2" 
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="text-xs text-gray-200 leading-relaxed">
                    Acepto los{" "}
                    <Link 
                      to="/terminos_y_condiciones" 
                      className="text-blue-400 hover:text-blue-300 transition-colors underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Términos
                    </Link>{" "}
                    y{" "}
                    <Link 
                      to="/terminos_y_condiciones" 
                      className="text-blue-400 hover:text-blue-300 transition-colors underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Política de privacidad
                    </Link>
                  </label>
                </div>

                {/* Botón de registro */}
                <button
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-sm"
                  type="submit"
                  disabled={loading || !acceptTerms}
                >
                  <span className={`transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                    Crear cuenta
                  </span>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span className="text-sm">Creando...</span>
                      </div>
                    </div>
                  )}
                </button>

                {/* Footer */}
                <div className="text-center pt-4">
                  <p className="text-xs text-gray-300">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium underline">
                      Inicia sesión
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Overlay para cerrar dropdown al hacer clic fuera */}
        {showCountryDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowCountryDropdown(false)}
          />
        )}
      </div>
    </div>
  );
}