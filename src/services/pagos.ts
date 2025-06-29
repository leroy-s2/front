import { getToken } from '../context/auth/utils/authUtils'; // Asegúrate de que la función getToken esté bien importada

// Definimos la interfaz para la respuesta esperada
interface CrearPreferenciaResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
  planId: number;
  nombrePlan: string;
  precio: number;
}

// Servicio para crear la preferencia de pago
export const crearPreferenciaPago = async (planId: number): Promise<CrearPreferenciaResponse | null> => {
  const token = getToken();
  if (!token) {
    console.error("Token no encontrado");
    return null;
  }

  try {
    // Hacemos la solicitud POST para crear la preferencia
    const response = await fetch(`http://localhost:8099/api/pagos/crear-preferencia?planId=${planId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Comprobamos si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error(`Error al crear la preferencia de pago: ${response.statusText}`);
    }

    // Procesamos la respuesta JSON
    const data: CrearPreferenciaResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error al hacer la solicitud:", error);
    return null;
  }
};
