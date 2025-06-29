import { useNavigate } from "react-router-dom";

export interface Course {
  id: number;
  title: string;
  instructor: string;
  image: string;
  isCodingShare: boolean;
  isNew?: boolean;
}

const CARD_WIDTH = 275;
const CARD_HEIGHT = 187;

// Imagen ocupará ~75% del alto total (antes era 60%)
const IMAGE_HEIGHT = Math.round(CARD_HEIGHT * 0.75); // ≈ 140px

const CourseCard: React.FC<{ course: Course; showInstructor?: boolean }> = ({ course, showInstructor = true }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/cursos/Ruta/${course.id}`);
  };

  return (
    <div
      className="group rounded-xl bg-[#181f2c] border border-cyan-400/40 shadow flex flex-col cursor-pointer snap-center transition-all duration-300 hover:scale-[1.014] hover:shadow-lg hover:border-cyan-400 mx-0 z-10"
      style={{
        minWidth: `${CARD_WIDTH}px`,
        maxWidth: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`
      }}
      onClick={handleClick}
    >
      {/* Parte superior (imagen/fondo) */}
      <div
        className="relative w-full flex items-start justify-between px-3 pt-2 pb-1 overflow-hidden rounded-t-xl"
        style={{ height: `${IMAGE_HEIGHT}px`, background: "#d1d5db" }}
      >
        {course.isCodingShare && (
          <span
            className="absolute top-2 right-2 px-2.5 py-0.5 text-[11px] font-bold rounded-lg"
            style={{
              background: 'linear-gradient(90deg, #00ffe7 0%, #00c3ff 100%)',
              color: '#131c23',
              fontWeight: 700,
              textAlign: 'center'
            }}
          >
            CodingShare
          </span>
        )}
        <span className="mx-auto text-gray-500 text-[15px] font-semibold select-none z-0" style={{ marginTop: 20 }}>
          400×225
        </span>
      </div>
      {/* Info principal rectangular abajo (más pequeña) */}
      <div className="flex-1 flex flex-col justify-center px-3 pb-1 pt-1 min-h-[30px] bg-[#151d29] border border-cyan-400/20 rounded-b-xl">
        <div
          className="text-white text-[0.85rem] font-semibold mb-0.5 leading-snug"
          style={{
            wordBreak: "break-word",
            whiteSpace: "normal",
            overflow: "visible",
            display: "block",
            lineHeight: 1.1,
            minHeight: "16px"
          }}
          title={course.title}
        >
          {course.title}
        </div>
        {showInstructor && (
          <p
            className="text-gray-400 text-[0.73rem] font-normal"
            style={{
              margin: 0,
              lineHeight: 1.1,
              minHeight: "12px"
            }}
            title={course.instructor}
          >
            {course.instructor}
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseCard;