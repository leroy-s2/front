interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nombre?: string;
}

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  nombre,
}: ConfirmDeleteModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40 transition-all">
      <div
        className="w-full sm:w-[340px] h-full bg-[#18181b] shadow-lg px-6 py-10 relative animate-slide-in-right"
        style={{
          maxWidth: "340px",
          minHeight: "100vh",
          boxShadow: "0 0 20px #0008",
        }}
      >
        <button
          className="absolute top-3 right-4 text-gray-300 text-xl hover:text-white"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-lg font-bold text-red-400 mb-7 text-center">
          Eliminar Lenguaje
        </h2>
        <div className="flex flex-col gap-3 items-center justify-center">
          <p className="text-white text-base font-semibold text-center">
            ¿Estás seguro de eliminar este Lenguaje de Programación?
          </p>
          {nombre && (
            <div className="mb-4 text-gray-300 text-sm text-center">
              <span className="font-bold">Nombre:</span> {nombre}
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-8">
          <button
            className="flex-1 border border-gray-500 text-gray-300 rounded py-2 hover:bg-gray-700 transition text-sm"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="flex-1 bg-[#e53e3e] hover:bg-[#c53030] text-white font-bold rounded py-2 transition text-sm"
            onClick={onConfirm}
          >
            Aceptar
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slide-in-right {
          0% { transform: translateX(100%); opacity: 0.7; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.22s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}