import React from "react";

interface CourseHeaderAndStatsProps {
  nombre: string;
  descripcion: string;
  estado: string;
  fecha_creacion: string;
  stats: {
    totalLessons: number;
    sectionsCount: number;
    totalDuration: string;
  };
  rating: number;
  students: number;
}

const CursoHeader: React.FC<CourseHeaderAndStatsProps> = ({
  nombre,
  descripcion,
  estado,
  fecha_creacion,
  stats
}) => (

  <div className="grid lg:grid-cols-5 gap-6 mb-12">

    <div className="lg:col-span-3 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/25">
          <span className="text-gray-900 text-xl font-bold">{nombre.charAt(0)}</span>
        </div>
        <div>
          <p className="text-sky-400 text-xs font-bold uppercase tracking-wider">
            CURSO • {new Date(fecha_creacion).getFullYear()}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-gray-400 text-xs">Estado:</span>
            <div className="px-1.5 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-emerald-500 to-cyan-600 text-gray-900 capitalize">
              {estado}
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
        {nombre}
      </h1>
      <p className="text-base text-gray-300 mb-4 leading-relaxed flex-grow">
        {descripcion}
      </p>

    </div>

    <div className="lg:col-span-2 space-y-2 flex flex-col">
      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
        <div className="w-0.5 h-4 bg-gradient-to-b from-sky-500 to-fuchsia-600"></div>
        DETALLES DEL CURSO
      </h3>

      <div className="grid grid-cols-1 gap-2 mt-auto px-4">
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-2.5 flex items-center justify-between hover:border-purple-500/30 transition-all duration-300">
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Secciones</div>
          </div>
          <div className="text-lg font-bold text-purple-400">{stats.sectionsCount}</div>
        </div>

        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-2.5 flex items-center justify-between hover:border-sky-500/30 transition-all duration-300">
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Clases</div>
          </div>
          <div className="text-lg font-bold text-sky-400">{stats.totalLessons}</div>
        </div>

        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-2.5 flex items-center justify-between hover:border-fuchsia-500/30 transition-all duration-300">
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Duración</div>
          </div>
          <div className="text-lg font-bold text-fuchsia-400">{stats.totalDuration}</div>
        </div>

      </div>


    </div>


  </div>
);

export default CursoHeader;