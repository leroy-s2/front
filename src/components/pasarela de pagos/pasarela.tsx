import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import mercadoPagoLogo from '../../assets/mercado pago.png'; // Asegúrate de tener la imagen en esta ruta

// Interfaz para los datos de la preferencia
interface PreferenceData {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
  planId: number;
  nombrePlan: string;
  precio: number;
}

const PaymentGateway: React.FC = () => {

  const [isProcessing, setIsProcessing] = useState(false);
  const [preferenceData, setPreferenceData] = useState<PreferenceData | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos de la preferencia al montar el componente
  useEffect(() => {
    const loadPreferenceData = () => {
      try {
        const storedData = localStorage.getItem('preferenceData');
        if (storedData) {
          const parsedData: PreferenceData = JSON.parse(storedData);
          setPreferenceData(parsedData);
        } else {
          console.warn('No se encontraron datos de preferencia en localStorage');
        }
      } catch (error) {
        console.error('Error al cargar datos de preferencia:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferenceData();
  }, []);

  const handleGoBack = () => {
    try {
      // Limpiar datos del localStorage al volver
      localStorage.removeItem('preferenceData');
      window.close();
      setTimeout(() => {
        if (!window.closed) {
          window.location.href = '/inicio';
        }
      }, 100);
    } catch (error) {
      localStorage.removeItem('preferenceData');
      window.location.href = '/inicio';
    }
  };


  const handleMercadoPagoPayment = async () => {
    if (!preferenceData) {
      alert('No se encontraron datos de la preferencia de pago');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Redirigir directamente al sandboxInitPoint de MercadoPago
      window.location.href = preferenceData.sandboxInitPoint;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Hubo un error al procesar el pago. Por favor, inténtalo nuevamente.');
      setIsProcessing(false);
    }
  };

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del pago...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si no hay datos de preferencia
  if (!preferenceData) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">
              No se encontraron datos de la preferencia de pago. 
              Por favor, intenta nuevamente desde el inicio.
            </p>
            <button
              onClick={handleGoBack}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/vite.png" alt="Logo" className="w-8 h-8" />
            <div>
              <h1 className="font-bold text-xl text-blue-500">
                Coding<span className="text-purple-600">Share</span>
              </h1>
              <p className="text-xs text-purple-500">community</p>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <h1 className="text-gray-800 text-xl font-semibold hidden md:block">
              Pasarela de Pago Segura
            </h1>
          </div>
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg border transition-all duration-200 hover:scale-105 shadow-sm"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Volver</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Title Section */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Información de Pago
                </h2>
              </div>

              {/* Payment Method - Solo Mercado Pago */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Método de Pago</h3>
                <div className="w-full">
                  <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
                        <img 
                          src={mercadoPagoLogo} 
                          alt="Mercado Pago" 
                          className="w-12 h-8 object-contain"
                        />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-center text-gray-800 mb-2">
                      Mercado Pago
                    </h4>
                    <p className="text-center text-gray-600 text-sm">
                      Paga de forma segura con tarjeta de crédito, débito o efectivo
                    </p>
                    <div className="mt-4 flex justify-center space-x-2">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        VISA
                      </div>
                      <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        MC
                      </div>
                      <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        +
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* Info about Mercado Pago */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    ¿Qué sucede después?
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Serás redirigido a Mercado Pago</li>
                    <li>• Podrás elegir tu método de pago preferido</li>
                    <li>• Completa tu pago de forma segura</li>
                    <li>• El acceso podria tardar hasta 72 horas al plan {preferenceData.nombrePlan}</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleMercadoPagoPayment}
                  disabled={isProcessing}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Redirigiendo a Mercado Pago...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <img 
                        src={mercadoPagoLogo} 
                        alt="MP" 
                        className="w-6 h-4 object-contain mr-2"
                      />
                      Continuar con Mercado Pago
                    </div>
                  )}
                </button>

                {/* Security Notice */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Tu información está protegida con cifrado SSL
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-fit">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Resumen del Pedido</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Nombre del plan</span>
                  <span className="font-semibold text-gray-800 capitalize">
                    {preferenceData.nombrePlan}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Precio</span>
                  <span className="font-semibold text-gray-800">
                    ${preferenceData.precio.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>${preferenceData.precio.toFixed(2)}</span>
                </div>

                {/* Plan ID for debugging (optional) */}
                <div className="text-xs text-gray-500 text-center">
                  Plan ID: {preferenceData.planId}
                </div>

                {/* Security Features */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Compra Segura</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Procesamiento seguro con Mercado Pago
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Protección del comprador
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Garantía de devolución 30 días
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Le pedimos paciencia con la aprobacion de su plan {preferenceData.nombrePlan}
                    </div>
                  </div>
                </div>

                {/* Mercado Pago Badge */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500 mb-2">Procesado por</p>
                  <img 
                    src={mercadoPagoLogo} 
                    alt="Mercado Pago" 
                    className="h-8 mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentGateway;