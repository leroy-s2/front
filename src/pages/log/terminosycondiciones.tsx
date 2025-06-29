import React from 'react';
import { ArrowLeft } from 'lucide-react';

const TermsAndPrivacy: React.FC = () => {
  const handleGoBack = () => {
    // Intentar cerrar la pestaña actual
    try {
      // Si la pestaña fue abierta por script, se puede cerrar
      window.close();
      
      // Si no se puede cerrar (por ejemplo, si fue abierta manualmente por el usuario),
      // intentar navegar de vuelta como fallback
      setTimeout(() => {
        // Verificar si la ventana sigue abierta
        if (!window.closed) {
          window.location.href = '/registrar';
        }
      }, 100);
    } catch (error) {
      // Fallback: navegar a la página de registro
      window.location.href = '/registrar';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/vite.png" alt="Logo" className="w-8 h-8" />
            <div>
              <h1 className="font-bold text-xl text-blue-500">
                Coding<span className="text-purple-600">Share</span>
              </h1>
              <p className="text-xs text-purple-500">community</p>
            </div>
          </div>
          <h1 className="text-gray-800 text-xl font-semibold hidden md:block">
            Términos y Política de privacidad
          </h1>
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg border transition-all duration-200 hover:scale-105 shadow-sm"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Cerrar</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Title Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              Términos y Política de Privacidad
            </h1>
            <p className="text-purple-100 text-center mt-2">
              CodingShare Community
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8 space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</span>
                Introducción
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Bienvenido a CodingShare Community. Al acceder y utilizar nuestros servicios, ya sea para tomar cursos de programación, interactuar en comunidades, participar en juegos de programación o estar al tanto de las noticias más recientes, aceptas cumplir con estos Términos y Condiciones de Uso, así como con nuestra Política de Privacidad. Si no estás de acuerdo con estos términos, te pedimos que no utilices nuestra plataforma.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</span>
                Uso de la plataforma
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                En CodingShare Community, ofrecemos una variedad de servicios, incluyendo cursos de programación, un espacio para que los usuarios interactúen en comunidades, juegos de programación y noticias relacionadas con el ámbito tecnológico. Al utilizar cualquiera de estos servicios, te comprometes a:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Proporcionar información precisa y actualizada durante el registro y uso del sitio.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  No utilizar el sitio web para fines ilegales o no autorizados.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  No participar en actividades que puedan interrumpir el funcionamiento del sitio o perjudicar a otros usuarios.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Respetar las normas de convivencia y participación en las comunidades.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">3</span>
                Privacidad y Protección de Datos Personales
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nos tomamos tu privacidad muy en serio. A continuación, explicamos cómo recopilamos, utilizamos y protegemos tus datos personales:
              </p>
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-gray-800 mb-2">Recopilación de datos:</h3>
                  <p className="text-gray-700">Recopilamos datos personales como nombre, correo electrónico y otros detalles que decidas proporcionar durante tu registro o interacción con el sitio.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-gray-800 mb-2">Uso de los datos:</h3>
                  <p className="text-gray-700">Utilizamos tus datos para mejorar tu experiencia en la plataforma, procesar inscripciones a cursos, mantenerte informado sobre novedades y eventos relacionados con la programación, y permitirte la participación en las comunidades y juegos.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="font-semibold text-gray-800 mb-2">Protección de datos:</h3>
                  <p className="text-gray-700">Implementamos medidas de seguridad para proteger tu información personal. Sin embargo, debes tener en cuenta que ningún sistema es completamente seguro, y no podemos garantizar la seguridad total de tus datos.</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                  <h3 className="font-semibold text-gray-800 mb-2">Cookies:</h3>
                  <p className="text-gray-700">Usamos cookies para mejorar el funcionamiento del sitio y personalizar tu experiencia. Puedes configurar tu navegador para rechazar las cookies, pero esto puede afectar tu acceso a algunas funciones del sitio.</p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">4</span>
                Propiedad intelectual
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Todo el contenido disponible en CodingShare Community, incluidos los cursos, materiales, gráficos, logotipos, software y otros recursos, está protegido por derechos de propiedad intelectual. No se permite la reproducción, distribución, modificación ni el uso no autorizado del contenido sin el permiso expreso del propietario.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">5</span>
                Responsabilidad
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Aunque nos esforzamos por ofrecer un contenido de calidad, no garantizamos que los cursos, comunidades, juegos o noticias estén libres de errores o sean completamente precisos. Nos reservamos el derecho de realizar cambios o actualizaciones en cualquier momento, sin previo aviso.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">6</span>
                Enlaces a sitios externos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Nuestro sitio web puede contener enlaces a otros sitios. No somos responsables de las prácticas de privacidad o el contenido de estos sitios externos. Te recomendamos leer sus políticas de privacidad antes de proporcionarles cualquier dato personal.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">7</span>
                Cambios en los Términos y Condiciones
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Nos reservamos el derecho de modificar estos Términos y Condiciones y la Política de Privacidad en cualquier momento. Los cambios entrarán en vigor tan pronto como se publiquen en el sitio web. Te recomendamos revisar regularmente esta página para estar al tanto de las actualizaciones.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">8</span>
                Contacto
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Si tienes alguna pregunta o inquietud sobre estos Términos y Condiciones o nuestra Política de Privacidad, no dudes en contactarnos a través de los canales habilitados en el sitio.
              </p>
            </section>

            {/* Final Notice */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
              <p className="text-gray-800 font-medium text-center leading-relaxed">
                Al utilizar CodingShare Community, confirmas que has leído, entendido y aceptado los Términos y Condiciones y la Política de Privacidad.
              </p>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsAndPrivacy;