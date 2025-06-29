import React, { useState } from 'react';
import fondo from "../../assets/fondo.png";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../context/auth/authActions";
import { useAuth } from '../../context/auth/AuthContext';
import { IoEye, IoEyeOff } from 'react-icons/io5';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Nuevo estado para Remember Me
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!username.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setError(null);
    setIsLoading(true);

    console.log('Intentando login con:', { username, password: '***', rememberMe });

    try {
      // Llamamos a loginUser del authService y obtenemos la respuesta completa
      const loginResult = await loginUser(username, password);
      
      if (loginResult.success && loginResult.userData) {
        console.log('Login exitoso, datos del usuario obtenidos');
        
        // Guardar preferencia de "Remember Me" en localStorage
        localStorage.setItem('rememberMe', rememberMe.toString());
        
        // El token ya fue guardado por loginUser a través de loginUtil
        // Solo necesitamos obtener el token guardado y actualizar el contexto
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Si Remember Me está activo, almacenamos un tiempo más largo o establecemos lógica para mantener la sesión
          if (rememberMe) {
            // Aquí podrías extender la validez del token o configurar renovación
            // Como ejemplo, podrías almacenar la fecha de expiración en el localStorage
            const expirationTime = new Date().getTime() + 1000 * 60 * 60 * 24 * 30; // 30 días
            localStorage.setItem('tokenExpiration', expirationTime.toString());
          }

          // Actualizamos el contexto de autenticación con la opción de remember me
          const loginSuccess = await login(token, rememberMe);
          
          if (loginSuccess) {
            // Navegamos al inicio
            navigate('/Inicio', { replace: true });
          } else {
            setError('Error al inicializar la sesión');
          }
        } else {
          setError('Error al obtener el token de autenticación');
        }
      } else {
        // Mostramos el error específico del servicio de autenticación
        setError(loginResult.error || 'Error durante el login');
      }
      
    } catch (err) {
      console.error('Error durante el login:', err);
      
      // Manejo más específico de errores
      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('400')) {
          setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          setError('Error de conexión. Verifica tu conexión a internet.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError('Error desconocido durante el login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleHomeRedirect = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado izquierdo con fondo y texto */}
      <div
        className="w-full hidden sm:flex md:w-1/2 lg:w-3/4 flex-col justify-center items-center text-white bg-cover bg-center p-6 md:p-10"
        style={{ backgroundImage: `url(${fondo})` }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Codingshare</h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-8">Bienvenido de nuevo!</h2>
        <button 
          onClick={handleHomeRedirect}
          className="px-4 py-2 border border-white rounded-lg text-base italic hover:bg-white hover:text-black transition"
        >
          Regresar al home
        </button>
      </div>

      {/* Lado derecho con login */}
      <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 flex flex-col justify-center items-center p-6 sm:p-8 bg-black text-white">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Login!</h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-6">Inicia sesión o crea una cuenta con:</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <input
                type="text"
                placeholder="Nombre de Usuario"
                className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded p-1"
                disabled={isLoading}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <IoEyeOff className="w-5 h-5" />
                ) : (
                  <IoEye className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* Mostrar error si hay */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 animate-pulse">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox text-blue-500 rounded focus:ring-2 focus:ring-blue-400"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="select-none">Recordar sesión</span>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative overflow-hidden"
            >
              <span className={`transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Login
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                </div>
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="my-6 flex items-center justify-center">
            <hr className="w-full border-gray-600" />
            <span className="px-2 text-gray-400 text-xs sm:text-sm">Or</span>
            <hr className="w-full border-gray-600" />
          </div>

          {/* Botones sociales */}
          <div className="flex justify-center gap-4 mb-6">
            <button className="bg-white text-black p-2 rounded-full hover:scale-105 transition-transform duration-200">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button className="bg-white text-black p-2 rounded-full hover:scale-105 transition-transform duration-200">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button className="bg-white text-black p-2 rounded-full hover:scale-105 transition-transform duration-200">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Footer */}
          <p className="text-xs sm:text-sm text-center text-gray-500">
            No tienes una cuenta?{" "}
            <Link to="/registrar" className="text-blue-400 hover:underline">
              Registrate
            </Link>
          </p>

          <div className="mt-4 text-xs flex justify-between text-gray-600">
            <Link to="/terminos_y_condiciones" className="hover:underline">
              Términos y condiciones
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}