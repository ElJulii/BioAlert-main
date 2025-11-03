import { useRef } from "react";
import Style from "./AnimalCarousel.module.css";
import Image from "next/image";

export default function AnimalCarousel({ animals, onHover }) {
  const carouselRef = useRef(null);

  return (
    <div
      className={Style.carousel}
      ref={carouselRef}
      onMouseLeave={() => onHover(null)}
    >
      {animals.map((a, i) => (
        <div
          key={i}
          className={Style.item}
          onMouseEnter={() => onHover(a)}
          onTouchStart={() => onHover(a)} // para móvil
        >
          <Image src={a.img} alt={a.name} />
          <p>{a.name}</p>
        </div>
      ))}
    </div>
  );
}
