// Servicio para obtener el nombre del autor
export const usuariosService = {
  async obtenerAutor(id: number): Promise<string> {
    try {
      const response = await fetch(`http://localhost:8222/api/v1/usuarios/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos del autor');
      }
      const data = await response.json();
      return data.nombre; // Suponemos que la respuesta tiene un campo `nombre`
    } catch (error) {
      console.error("Error en el servicio de autor:", error);
      throw error;
    }
  },
};