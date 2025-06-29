// services/cursoService.ts

import type { Curso } from '../models/Curso';

const API_URL = 'http://localhost:8090/api/cursos';

export const cursoService = {
  async getCursos(): Promise<Curso[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data: Curso[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener los cursos:', error);
      return [];
    }
  },

  async buscarCursosPorNombre(nombre: string): Promise<Curso[]> {
    const cursos = await this.getCursos();
    const nombreLower = nombre.toLowerCase();
    return cursos.filter(curso =>
      curso.nombre.toLowerCase().includes(nombreLower)
    );
  }
};
