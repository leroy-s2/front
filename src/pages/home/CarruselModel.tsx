import nft1 from '../../assets/imghome/nft1.png';
import nft2 from '../../assets/imghome/nft2.png';
import nft3 from '../../assets/imghome/nft3.png';
import nft4 from '../../assets/imghome/nft4.png';
import nft5 from '../../assets/imghome/nft5.png';
import nft6 from '../../assets/imghome/nft6.png';
import nft7 from '../../assets/imghome/nft7.png';
import modelImg from '../../assets/imghome/model.png';



    const images = [nft1, nft2, nft3, nft4, nft5, nft6, nft7];

export default function CarruselModel() {
  const quantity = images.length;

  return (
    <div className="relative z-10 flex flex-col items-center">
      <div className="flex flex-col items-center">
        {/* Carrusel 3D */}
        <div className="relative w-36 h-32 mb-6 slider3d">
          {images.map((img, i) => (
            <div
              key={i}
              className="slider3d-item"
              style={
                {
                  '--position': i + 1,
                  '--quantity': quantity,
                } as React.CSSProperties
              }
            >
              <img
                src={img}
                alt={`dragon_${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
        {/* Model */}
        <div
          className="w-[260px] h-[300px] bg-no-repeat bg-top-center pointer-events-none -mt-2 ml-8"
          style={{
            backgroundImage: `url(${modelImg})`,
            backgroundSize: "contain",
          }}
        />
      </div>
      {/* CSS para el efecto 3D */}
      <style>{`
        .slider3d {
          transform-style: preserve-3d;
          perspective: 10000px;
          animation: slider3d-rotate 20s linear infinite;
        }
        @keyframes slider3d-rotate {
          from {
            transform: perspective(1000px) rotateX(-16deg) rotateY(0deg);
          }
          to {
            transform: perspective(1000px) rotateX(-16deg) rotateY(360deg);
          }
        }
        .slider3d-item {
          position: absolute;
          inset: 0;
          transform:
            rotateY(calc((var(--position) - 1) * (360deg / var(--quantity))))
            translateZ(200px);
        }
        .slider3d-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        @media (max-width: 1023px) {
          .slider3d { width: 60px; height: 75px; }
          .slider3d-item {
            transform:
              rotateY(calc((var(--position) - 1) * (360deg / var(--quantity))))
              translateZ(110px);
          }
        }
        @media (max-width: 767px) {
          .slider3d { width: 40px; height: 55px; }
          .slider3d-item {
            transform:
              rotateY(calc((var(--position) - 1) * (360deg / var(--quantity))))
              translateZ(60px);
          }
        }
      `}</style>
    </div>
  );
}