//Proporciona filtros para ordenar las publicaciones. Los filtros incluyen "Todo", "Tú" (tus publicaciones), "Videos" y "
// Documentos". Permite al usuario seleccionar un filtro para mostrar las publicaciones correspondientes.
interface FiltersProps {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

export function Filters({ selectedFilter, onSelectFilter }: FiltersProps) {
  const filters = [
    { label: "TODO", value: "all" },
    { label: "TÚ", value: "mine" },
    { label: "Videos", value: "videos", icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    )},
    { label: "Documentos", value: "documents", icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )},
  ];

  return (
    <div className="flex gap-3">
      {filters.map(({ label, value, icon }) => (
        <button
          key={value}
          onClick={() => onSelectFilter(value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
            selectedFilter === value
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
