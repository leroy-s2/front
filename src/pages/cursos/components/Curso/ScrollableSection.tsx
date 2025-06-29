import { useRef } from 'react';
import CourseCard, { type Course } from './CourseCard';

interface ScrollableSectionProps {
  courses: Course[];
}

const CARD_WIDTH = 275;
const CARD_GAP = 16;
const CARD_HEIGHT = 187;

const ScrollableSection: React.FC<ScrollableSectionProps> = ({ courses }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Saltar exactamente una tarjeta (más gap)
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = CARD_WIDTH + CARD_GAP;
      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Detectar si hay overflow para mostrar/ocultar flechas (opcional)
  // Puedes hacerlo con useEffect y state si quieres hacer el UX más pro.

  return (
    <div className="relative my-2">
      {/* Flecha izquierda */}
      <button
        className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#23283a] hover:bg-cyan-200/80 transition border border-gray-700 rounded-full w-7 h-7"
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        type="button"
        style={{ boxShadow: "0 2px 8px rgb(0 0 0 / 0.16)" }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="text-cyan-400">
          <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {/* Carrusel SCROLLEABLE */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 pb-1"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
        tabIndex={0} // Para scroll con teclado si quieres
      >
        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              minWidth: `${CARD_WIDTH}px`,
              maxWidth: `${CARD_WIDTH}px`,
              height: `${CARD_HEIGHT}px`
            }}
            className="snap-center"
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>
      {/* Flecha derecha */}
      <button
        className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#23283a] hover:bg-fuchsia-200/90 transition border border-gray-700 rounded-full w-7 h-7"
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        type="button"
        style={{ boxShadow: "0 2px 8px rgb(0 0 0 / 0.16)" }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="text-fuchsia-400">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {/* Opcional: ocultar scrollbar visual */}
      <style>
        {`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        `}
      </style>
    </div>
  );
};

export default ScrollableSection;