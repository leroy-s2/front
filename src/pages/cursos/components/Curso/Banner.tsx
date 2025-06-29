import { ArrowLeft } from 'lucide-react';

interface BannerProps {
  onBack: () => void;
}

const Banner: React.FC<BannerProps> = ({ onBack }) => (
  <div
    className="relative w-full rounded-xl mb-8 overflow-hidden flex items-center"
    style={{
      minHeight: 90,
      maxHeight: 120,
      marginTop: "24px",
      background: "transparent",
      boxShadow: "0 8px 32px 0 rgba(0,255,255,0.07), 0 2px 8px 0 rgba(0,0,0,0.32)",
      position: 'relative'
    }}
  >
    {/* Imagen cyberpunk a todo el banner */}
    <img
      src="https://i.ytimg.com/vi/ibNrPjETR_k/maxresdefault.jpg"
      alt="cyberpunk"
      className="absolute inset-0 w-full h-full object-cover opacity-70"
      style={{ zIndex: 1 }}
    />
    {/* Overlay para degrade oscuro y mejor contraste */}
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(90deg, rgba(19,28,43,0.40) 20%, rgba(19,28,43,0.7) 60%, rgba(19,28,43,0.12) 100%)",
        zIndex: 2
      }}
    />
    {/* Banner content */}
    <div className="relative z-10 flex flex-row items-center justify-between w-full px-6 py-3 gap-2">
      <h2 className="text-xl md:text-2xl text-white font-bold tracking-tight text-left drop-shadow-lg"
        style={{ textShadow: "0 0 12px #0ff4fa, 0 0 2px #0bb1b9" }}>
        Ven y Únete a Esta Comunidad
      </h2>
      <button
        className="flex items-center gap-1 px-3 py-1.5 rounded-md font-semibold bg-slate-900/70 text-cyan-300 hover:bg-slate-800 transition-all"
        onClick={onBack}
        style={{ zIndex: 3 }}
      >
        <ArrowLeft className="w-5 h-5" /> Volver
      </button>
    </div>
  </div>
);

export default Banner;