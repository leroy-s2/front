import axios from 'axios';
import { getToken } from '../../../context/auth/utils/authUtils'; // Asegúrate de que la ruta es correcta

// Definir la interfaz BaseConverter
export interface BaseConverter {
  id: number;
  nombre: string;
  descripcion: string;
  requierePremium: boolean;
  tiempoCreacion: string;
  desbloqueado: boolean;
  nivel: string;
}

// Definir la interfaz BaseConverter
export interface espesificoBaseConverter {
  id: number;
  nombre: string;
  descripcion: string;
  requierePremium: boolean;
  Pruebas: string;
  plantilla: string;
  nivel: string;
}

// Crear el servicio para obtener los datos de la API
class BaseConverterService {
  private apiUrl: string = 'http://localhost:8222/api/v1/ejercicios';

  // Método GET para obtener todos los BaseConverters
  public async getAllBaseConverters(): Promise<BaseConverter[]> {
    try {
      const token = getToken(); // Obtener el token desde el localStorage
      const headers = token ? { Authorization: `Bearer ${token}` } : {}; // Si hay token, lo incluye en los encabezados

      const response = await axios.get(this.apiUrl, { headers });
      return response.data; // Suponiendo que la respuesta contiene un array de BaseConverter
    } catch (error) {
      console.error('Error al obtener los BaseConverters:', error);
      throw error; // Lanza el error para que pueda ser manejado donde se invoque este método
    }
  }

  // Método GET para obtener un BaseConverter específico por ID
  public async getBaseConverterById(id: number): Promise<espesificoBaseConverter> {
    try {
      const token = getToken(); // Obtener el token desde el localStorage
      const headers = token ? { Authorization: `Bearer ${token}` } : {}; // Si hay token, lo incluye en los encabezados

      const response = await axios.get(`${this.apiUrl}/${id}`, { headers });
      return response.data; // Suponiendo que la respuesta contiene un objeto BaseConverter
    } catch (error) {
      console.error(`Error al obtener el BaseConverter con ID ${id}:`, error);
      throw error; // Lanza el error para que pueda ser manejado donde se invoque este método
    }
  }

  // Método POST para enviar una nueva solución a la API
  public async postSolution(exerciseId: number, code: string): Promise<any> {
    try {
      const token = getToken(); // Obtener el token desde el localStorage
      const headers = token ? { Authorization: `Bearer ${token}` } : {}; // Si hay token, lo incluye en los encabezados

      const payload = {
        exerciseId: exerciseId,
        code: code,
      };

      const response = await axios.post('http://localhost:8222/api/v1/soluciones', payload, { headers });
      return response.data; // Suponiendo que la respuesta contiene los datos de la solución
    } catch (error) {
      console.error('Error al enviar la solución:', error);
      throw error; // Lanza el error para que pueda ser manejado donde se invoque este método
    }
  }
}

export default new BaseConverterService();
