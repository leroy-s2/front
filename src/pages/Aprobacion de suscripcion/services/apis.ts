import { getToken } from '../../../context/auth/utils/authUtils';

// Definición de las interfaces para las respuestas de las APIs
interface Plan {
  precio: number;
  id: number;
  nombre: string;
}

interface Suscripcion {
  keycloakId: string;
  estado: string;
  fechaInicio: string;
  id: number;
  fechaFin: string;
  plan: Plan;
}

interface Transaccion {
  estado: string;
  monto: number;
  mercadoPagoId: string;
  suscripcion: Suscripcion;
  moneda: string;
  fechaCreacion: string;
  id: number;
  detalleError: string;
}

interface PaginaTransacciones {
  totalItems: number;
  transacciones: Transaccion[];
  totalPages: number;
  currentPage: number;
}

// Servicio para obtener las transacciones pendientes
export const getTransaccionesPendientes = async (): Promise<PaginaTransacciones | null> => {
  const token = getToken();
  if (!token) {
    console.error("Token no encontrado");
    return null;
  }

  try {
    const response = await fetch('http://localhost:8099/api/admin/transacciones/pendientes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener transacciones pendientes: ${response.statusText}`);
    }

    const data: PaginaTransacciones = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Servicio para obtener todas las transacciones
export const getTodasTransacciones = async (): Promise<PaginaTransacciones | null> => {
  const token = getToken();
  if (!token) {
    console.error("Token no encontrado");
    return null;
  }

  try {
    const response = await fetch('http://localhost:8099/api/admin/transacciones/todas', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener todas las transacciones: ${response.statusText}`);
    }

    const data: PaginaTransacciones = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Servicio para aprobar una transacción
export const aprobarTransaccion = async (transaccionId: number): Promise<void> => {
  const token = getToken();
  if (!token) {
    console.error("Token no encontrado");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8099/api/admin/aprobar/${transaccionId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al aprobar transacción: ${response.statusText}`);
    }

    console.log(`Transacción ${transaccionId} aprobada con éxito.`);
  } catch (error) {
    console.error(error);
  }
};
