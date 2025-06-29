import { useState } from "react";
import CarruselModel from './CarruselModel';
import extra from '../../assets/imghome/image.png';
import { Link } from "react-router-dom";
import Ruta from "../../assets/imghome/Ruta.png";

export default function MinimalFuturisticNFT() {
  const [plan, setPlan] = useState<"annual" | "monthly">("annual");

  const prices = {
    Starter: { annual: 49, monthly: 59 },
    Professional: { annual: 149, monthly: 179 },
    Enterprise: { annual: 999, monthly: 1199 },
  };

  // Cursos informativos para plataforma learning
  const cursos = [
    {
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      title: "Python para Principiantes",
      desc: "Inicia tu aprendizaje en programación con Python desde cero."
    },
    {
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      title: "Java Backend Developer",
      desc: "Aprende a crear APIs y servicios robustos usando Java."
    },
    {
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
      title: "Go para Microservicios",
      desc: "Desarrolla sistemas modernos y escalables con Go."
    },
    {
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      title: "JavaScript Web Essentials",
      desc: "Domina la programación web con JavaScript, HTML y CSS."
    },
    {
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
      title: "Estructuras de Datos en C++",
      desc: "Profundiza en algoritmos y estructuras de datos en C++."
    },
    {
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      title: "Desarrollo Web Moderno",
      desc: "Crea sitios web responsivos y atractivos desde cero."
    },
  ];

  return (
    <div className="bg-[#2b1e44] min-h-screen text-black font-sans overflow-x-hidden">
      {/* Navbar - Mejorado y simplificado */}
      <div id="Inicio"></div>
      <div className="w-full bg-[#631283] px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-[#ffffff]">Learning Platform</span>
          <input 
            className="ml-8 px-4 py-2 rounded-full bg-[#211d24] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7a36fa] w-60 text-white" 
            placeholder="Busca cursos o rutas..." 
          />
        </div>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 font-medium">
            <a href="#Inicio" className="text-[#7a36fa] transition-colors hover:text-[#41ffd8]">Inicio</a>
            <a href="#Rutas" className="text-white hover:text-[#7a36fa] transition-colors">Rutas</a>
            <a href="#Cursos" className="text-white hover:text-[#7a36fa] transition-colors">Cursos</a>
            <a href="#Precios" className="text-white hover:text-[#7a36fa] transition-colors">Precios</a>
          </nav>
          <Link 
            to="/login" 
            className="bg-[#e7e7e7] hover:bg-[#a377fa] hover:text-white px-6 py-2 rounded-full font-semibold transition-all duration-200"
          >
            Registrarse
          </Link>
        </div>
      </div>

      {/* Hero CENTRADO - Mejorado */}
      <section
        className="w-full flex justify-center bg-gradient-to-br from-[#1a1924] to-[#85848a] relative"
        style={{
          backgroundImage: `url(${extra})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-black/50 pointer-events-none z-0"></div>
        <div className="relative overflow-hidden min-h-[80vh] w-full max-w-7xl flex flex-col md:flex-row items-center justify-center px-6 md:px-16 py-16 md:py-12 z-0">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/4 top-1/3 w-72 h-72 bg-gradient-to-tr from-[#7a36fa]/50 to-transparent opacity-40 rounded-full blur-2xl"></div>
            <div className="absolute right-0 bottom-0 w-96 h-96 bg-gradient-to-br from-[#00e0ff]/40 to-transparent opacity-30 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 flex-1 flex flex-col justify-center items-center md:items-start">
            <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-8 leading-tight text-center md:text-left">
              Aprende a programar con <br />
              <span className="bg-gradient-to-r from-[#00e0ff] via-[#7a36fa] to-[#ffd6fa] bg-clip-text text-transparent">
                rutas guiadas
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-lg text-center md:text-left leading-relaxed">
              Explora cursos en Python, Java, Go, JavaScript, C++ y más. Rutas de aprendizaje estructuradas, comunidad activa y certificaciones reconocidas.
            </p>
            <div className="w-full flex justify-center md:justify-start gap-4">
              <button className="bg-gradient-to-r from-[#00e0ff] to-[#7a36fa] text-white font-semibold px-10 py-4 rounded-full hover:scale-105 transition-all duration-200 shadow-xl">
                Explorar rutas y cursos
              </button>
            </div>
          </div>
          <div className="relative top-10 z-10 flex-1 flex items-center justify-center">
            <CarruselModel />
          </div>
        </div>
      </section>

      {/* Rutas - Mejorada */}
      <div id="Rutas"></div>
      <section className="relative px-4 md:px-16 py-24 bg-gradient-to-br from-[#631283] via-[#631283] to-[#111163] overflow-x-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          {/* TEXTO */}
          <div className="flex-1 min-w-[300px] md:pl-16">
            <h3 className="uppercase tracking-widest text-xs text-[#d8c5fc] mb-4">RUTAS DE APRENDIZAJE</h3>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight text-white">
              Tu camino estructurado para dominar la programación
            </h2>
            <p className="text-gray-300 text-lg mb-12 leading-relaxed">
              Sigue rutas de aprendizaje diseñadas por expertos, desde conceptos básicos hasta proyectos avanzados.
            </p>
            
            <ul className="space-y-10 mt-12">
              <li className="flex items-start gap-6">
                <span className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#00e0ff] via-[#7a36fa] to-[#41ffd8] rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </span>
                <div>
                  <h4 className="font-bold text-xl mb-2 text-white">Fundamentos de Programación</h4>
                  <p className="text-gray-400">
                    Aprende lógica, variables, estructuras de control y algoritmos básicos con ejercicios prácticos.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-6">
                <span className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#7a36fa] to-[#41ffd8] rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </span>
                <div>
                  <h4 className="font-bold text-xl mb-2 text-white">Estructuras y Algoritmos</h4>
                  <p className="text-gray-400">
                    Profundiza en algoritmos, estructuras de datos y resolución eficiente de problemas complejos.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-6">
                <span className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#41ffd8] to-[#7a36fa] rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </span>
                <div>
                  <h4 className="font-bold text-xl mb-2 text-white">Desarrollo Backend y Web</h4>
                  <p className="text-gray-400">
                    Construye APIs, microservicios y aplicaciones web escalables con tecnologías modernas.
                  </p>
                </div>
              </li>
            </ul>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-[#00e0ff] to-[#7a36fa] text-white font-semibold px-10 py-4 rounded-full hover:scale-105 transition-all duration-200 shadow-xl">
                Comenzar Ruta Gratuita
              </button>
              <button className="border-2 border-[#7a36fa] text-[#7a36fa] font-semibold px-8 py-4 rounded-full hover:bg-[#7a36fa] hover:text-white transition-all duration-200">
                Ver todas las rutas
              </button>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-3">
              <span className="bg-[#00e0ff]/20 text-[#00e0ff] px-4 py-2 rounded-full text-sm font-semibold border border-[#00e0ff]/30">🔰 Principiantes</span>
              <span className="bg-[#7a36fa]/20 text-[#7a36fa] px-4 py-2 rounded-full text-sm font-semibold border border-[#7a36fa]/30">☕ Java Backend</span>
              <span className="bg-[#ffd6fa]/20 text-[#ffd6fa] px-4 py-2 rounded-full text-sm font-semibold border border-[#ffd6fa]/30">🐍 Python Científico</span>
              <span className="bg-[#41ffd8]/20 text-[#41ffd8] px-4 py-2 rounded-full text-sm font-semibold border border-[#41ffd8]/30">🌀 Go Microservicios</span>
            </div>
          </div>
          
          {/* IMAGEN AL COSTADO */}
          <div className="flex-1 flex justify-center items-center">
            <img 
              src={Ruta} 
              alt="Ruta de aprendizaje" 
              className="max-w-sm md:max-w-lg lg:max-w-xl rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Cursos - Mejorada */}
      <div id="Cursos"></div>
      <section className="w-full py-20 bg-gradient-to-br from-[#631283] via-[#111163] to-[#232355]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <div className="text-center mb-16">
            <h3 className="uppercase tracking-widest text-xs text-[#d8c5fc] mb-4">CATÁLOGO COMPLETO</h3>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Cursos por Especialidad</h2>
            <p className="text-gray-400 max-w-3xl text-lg leading-relaxed">
              Explora nuestro catálogo de cursos especializados. Cada curso está diseñado para llevarte del nivel básico al avanzado con proyectos prácticos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full mb-12">
            {cursos.map((curso, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center bg-[#201d37] rounded-3xl shadow-xl p-8 transition hover:scale-105 hover:shadow-2xl duration-300 border border-[#7a36fa]/20 hover:border-[#7a36fa]/50"
              >
                <div className="mb-6 p-4 bg-[#7a36fa]/10 rounded-2xl group-hover:bg-[#7a36fa]/20 transition-colors duration-300">
                  <img
                    src={curso.img}
                    alt={curso.title}
                    className="w-16 h-16 object-contain"
                    draggable={false}
                  />
                </div>
                <div className="text-lg font-bold text-white mb-3 text-center">{curso.title}</div>
                <div className="text-gray-400 text-center text-sm leading-relaxed mb-6">{curso.desc}</div>
                <button className="w-full bg-[#7a36fa]/20 hover:bg-[#7a36fa] text-[#7a36fa] hover:text-white font-semibold py-3 rounded-xl transition-all duration-200 border border-[#7a36fa]/30">
                  Ver curso
                </button>
              </div>
            ))}
          </div>
          
          <div className="w-full flex justify-center">
            <button className="bg-gradient-to-r from-[#00e0ff] to-[#7a36fa] text-white font-semibold px-12 py-4 rounded-full hover:scale-105 transition-all duration-200 shadow-xl">
              Explorar todos los cursos
            </button>
          </div>
        </div>
      </section>

      {/* Precios - Mejorada */}
      <div id="Precios"></div>
      <section className="w-full py-20 bg-gradient-to-br from-[#111163] via-[#631283] to-[#631283] flex flex-col items-center relative">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#2e2670]/30 via-transparent to-transparent opacity-50"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-16 w-96 h-96 bg-[#7a36fa]/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center mb-16">
          <h3 className="uppercase tracking-widest text-xs text-[#d8c5fc] mb-4">PLANES Y PRECIOS</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Elige tu plan de aprendizaje</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Planes flexibles que se adaptan a tu ritmo de aprendizaje y objetivos profesionales.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-3 mb-12">
          <button
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 ${
              plan === "annual"
                ? "bg-[#7a36fa] text-white shadow-xl scale-105"
                : "bg-[#232355] text-[#7a36fa] hover:bg-[#302d4e] hover:scale-105"
            }`}
            onClick={() => setPlan("annual")}
          >
            Anual <span className="text-[#41ffd8] text-sm">(2 meses gratis)</span>
          </button>
          <button
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 ${
              plan === "monthly"
                ? "bg-[#7a36fa] text-white shadow-xl scale-105"
                : "bg-[#232355] text-[#7a36fa] hover:bg-[#302d4e] hover:scale-105"
            }`}
            onClick={() => setPlan("monthly")}
          >
            Mensual
          </button>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
          {/* Starter */}
          <div className="bg-[#232355]/80 rounded-3xl shadow-xl p-10 flex flex-col items-center border border-[#7a36fa]/20 hover:border-[#7a36fa]/40 transition-all duration-300">
            <div className="text-2xl font-bold mb-2 text-white">Starter</div>
            <div className="text-5xl font-extrabold text-white mb-3">
              ${prices.Starter[plan]}
              <span className="text-lg font-medium text-gray-400">/ {plan === "annual" ? "año" : "mes"}</span>
            </div>
            <div className="text-gray-400 mb-8 text-center">
              Perfecto para comenzar tu viaje en programación
            </div>
            <button className="w-full bg-[#181635] hover:bg-[#7a36fa]/70 text-white font-semibold py-4 rounded-xl mb-8 transition-all duration-200 hover:scale-105">
              Empezar gratis
            </button>
            <ul className="text-gray-200 space-y-4 w-full">
              <li className="flex items-center gap-3">
                <span className="text-[#7a36fa] text-lg">✓</span> Acceso a rutas básicas
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#7a36fa] text-lg">✓</span> 5 cursos introductorios
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#7a36fa] text-lg">✓</span> Comunidad y retos
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#7a36fa] text-lg">✓</span> Soporte por email
              </li>
            </ul>
          </div>
          
          {/* Professional */}
          <div className="bg-[#292966]/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center border-2 border-[#7a36fa] scale-105 z-20 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00e0ff] to-[#7a36fa] text-white text-sm px-6 py-2 rounded-full font-bold">
              MÁS POPULAR
            </div>
            <div className="text-2xl font-bold mb-2 text-white">Professional</div>
            <div className="text-5xl font-extrabold text-white mb-3">
              ${prices.Professional[plan]}
              <span className="text-lg font-medium text-gray-300">/ {plan === "annual" ? "año" : "mes"}</span>
            </div>
            <div className="text-gray-300 mb-8 text-center">
              Para desarrolladores serios que buscan acelerar su carrera
            </div>
            <button className="w-full bg-gradient-to-r from-[#7a36fa] to-[#41ffd8] text-white font-semibold py-4 rounded-xl mb-8 shadow-xl hover:scale-105 transition-all duration-200">
              Comenzar ahora
            </button>
            <ul className="text-gray-100 space-y-4 w-full">
              <li className="flex items-center gap-3">
                <span className="text-[#41ffd8] text-lg">✓</span> Todos los cursos y rutas
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#41ffd8] text-lg">✓</span> Proyectos prácticos
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#41ffd8] text-lg">✓</span> Certificados verificados
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#41ffd8] text-lg">✓</span> Soporte prioritario
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#41ffd8] text-lg">✓</span> Mentoría 1-on-1
              </li>
            </ul>
          </div>
          
          {/* Enterprise */}
          <div className="bg-[#232355]/80 rounded-3xl shadow-xl p-10 flex flex-col items-center border border-[#7a36fa]/20 hover:border-[#7a36fa]/40 transition-all duration-300">
            <div className="text-2xl font-bold mb-2 text-white">Enterprise</div>
            <div className="text-5xl font-extrabold text-white mb-3">
              ${prices.Enterprise[plan]}
              <span className="text-lg font-medium text-gray-400">/ {plan === "annual" ? "año" : "mes"}</span>
            </div>
            <div className="text-gray-400 mb-8 text-center">
              Soluciones empresariales para equipos y organizaciones
            </div>
            <button className="w-full bg-[#181635] hover:bg-[#41ffd8]/70 text-white font-semibold py-4 rounded-xl mb-8 transition-all duration-200 hover:scale-105">
              Contactar ventas
            </button>
            <ul className="text-gray-200 space-y-4 w-full">
              <li className="flex items-center gap-3">
                <span className="text-[#41ffd8] text-lg">✓</span> Gestión de equipos
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#41ffd8] text-lg">✓</span> Analítica avanzada
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#41ffd8] text-lg">✓</span> Integración SSO
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#41ffd8] text-lg">✓</span> Soporte dedicado
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#41ffd8] text-lg">✓</span> Contenido personalizado
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Best Sellers - Mejorada */}
      <section className="px-6 md:px-16 py-16 bg-gradient-to-br from-[#191726] to-[#2a1f3d]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-[#231f35] to-[#2a2240] rounded-3xl px-10 py-12 flex flex-col md:flex-row items-center justify-between shadow-2xl border border-[#7a36fa]/20">
            <div className="flex-1 mb-8 md:mb-0">
              <h3 className="uppercase tracking-widest text-xs text-[#d8c5fc] mb-3">LO MÁS DEMANDADO</h3>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Cursos Best Sellers</h2>
              <p className="text-gray-400 mb-6 text-lg leading-relaxed max-w-lg">
                Descubre los cursos y rutas más populares de nuestra plataforma. Contenido probado y valorado por miles de estudiantes.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-[#7a36fa]/20 text-[#7a36fa] px-4 py-2 rounded-full text-sm font-semibold">⭐ 4.9/5 rating</span>
                <span className="bg-[#41ffd8]/20 text-[#41ffd8] px-4 py-2 rounded-full text-sm font-semibold">👥 +50K estudiantes</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-[#00e0ff] to-[#7a36fa] text-white font-semibold px-8 py-4 rounded-full hover:scale-105 transition-all duration-200 shadow-xl">
                Ver Best Sellers
              </button>
              <button className="border-2 border-[#7a36fa] text-[#7a36fa] font-semibold px-8 py-4 rounded-full hover:bg-[#7a36fa] hover:text-white transition-all duration-200">
                Explorar gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="bg-[#1a1626] py-12 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold text-white mb-4">Learning Platform</div>
          <p className="text-gray-400 mb-8">Transformando el futuro a través de la educación en programación</p>
          <div className="flex justify-center gap-8 text-gray-400">
            <a href="#" className="hover:text-[#7a36fa] transition-colors">Términos</a>
            <a href="#" className="hover:text-[#7a36fa] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[#7a36fa] transition-colors">Contacto</a>
            <a href="#" className="hover:text-[#7a36fa] transition-colors">Ayuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
}