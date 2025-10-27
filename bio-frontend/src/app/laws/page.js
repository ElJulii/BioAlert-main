"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Style from "./Laws.module.css";
import AnimalCarousel from "@/components/carousel/carousel";
import { useState } from "react";

export default function Laws() {
  const [ selectedCountry, setSelectedCountry ] = useState(null);
  const [hoveredAnimal, setHoveredAnimal] = useState(null);

  const countries = [
  {
      name: "Ecuador",
      flag: "/flags/ecuador.png",
      map: "/maps/ecuador.png",
      laws: [
        "Ley 611 - Protección de la Fauna Silvestre (2000).",
        "Ley Orgánica de Medio Ambiente (2008).",
        "Código Orgánico Penal Ambiental - Art. 250 (2015).",
      ],
      animals: [
        { name: "Condor Andino", img: "/animals/condor.png" },
        { name: "Mono Aullador", img: "/animals/aullador.png" },
        { name: "Jaguar", img: "/animals/jaguar.png" },
        { name: "Tortuga Galápagos", img: "/animals/tortuga.png" },
      ],
    },
    {
      name: "México",
      flag: "/flags/mexico.png",
      map: "/maps/mexico.png",
      laws: [
        "Ley General de Vida Silvestre (2000).",
        "Ley Federal de Sanidad Animal (2007).",
        "Código Penal Federal - Art. 420 (2014).",
      ],
      animals: [
        { name: "Ajolote", img: "/animals/ajolote.png" },
        { name: "Guacamaya Roja", img: "/animals/guacamaya.png" },
        { name: "Jaguar", img: "/animals/jaguar.png" },
        { name: "Ocelote", img: "/animals/ocelote.png" },
      ],
    },
    {
      name: "Colombia",
      flag: "/flags/colombia.png",
      map: "/maps/colombia.png",
      laws: [
        "Ley 611 - Manejo y Protección de la Fauna Silvestre (2000).",
        "Ley 1333 - Sanciones Ambientales (2009).",
        "Ley 1774 - Protección Animal (2016).",
      ],
      animals: [
        { name: "Oso de Anteojos", img: "/animals/oso.png" },
        { name: "Tucán", img: "/animals/tucan.png" },
        { name: "Delfín Rosado", img: "/animals/delfin.png" },
        { name: "Puma", img: "/animals/puma.png" },
      ],
    },
    {
      name: "Argentina",
      flag: "/flags/argentina.png",
      map: "/maps/argentina.png",
      laws: [
        "Ley 22.421 - Conservación de Fauna Silvestre (1981).",
        "Ley 27.499 - Ley de Protección Animal (2018).",
        "Código Penal Argentino - Art. 206 (2019).",
      ],
      animals: [
        { name: "Guanaco", img: "/animals/guanaco.png" },
        { name: "Cóndor Andino", img: "/animals/condor.png" },
        { name: "Zorro Colorado", img: "/animals/zorro.png" },
        { name: "Tucán", img: "/animals/tucan.png" },
      ],
    },
    {
      name: "Brasil",
      flag: "/flags/brasil.png",
      map: "/maps/brasil.png",
      laws: [
        "Ley 9.605 - Delitos Ambientales (1998).",
        "Ley de Protección de la Biodiversidad (2015).",
        "Constitución Federal - Art. 225 (1988).",
      ],
      animals: [
        { name: "Arara Azul", img: "/animals/arara.png" },
        { name: "Jaguar", img: "/animals/jaguar.png" },
        { name: "Mono Capuchino", img: "/animals/capuchino.png" },
        { name: "Pecarí", img: "/animals/pecari.png" },
      ],
    },
  ];

  const currentDisplay =  hoveredAnimal?.img ||
    (selectedCountry ? selectedCountry.map : "/maps/latinamerica.png");

  return (
    <div className="container">
        <Header />
        <div className={Style.laws}>
        {/* --- Lista de países (izquierda) --- */}
        <div className={Style.leftPanel}>
          {countries.map((country) => (
            <details
              key={country.name}
              open={selectedCountry?.name === country.name}
              onClick={() =>
                setSelectedCountry(
                  selectedCountry?.name === country.name ? null : country
                )
              }
            >
              <summary>
                <span>{country.name}</span>
                <img
                  src={country.flag}
                  alt={country.name}
                  className={Style.flag}
                />
              </summary>
              <ul className={Style.lawsList}>
                {country.laws.map((law, i) => (
                  <li key={i}>{law}</li>
                ))}
              </ul>
              <AnimalCarousel
                animals={country.animals}
                onHover={setHoveredAnimal}
              />
            </details>
          ))}
        </div>

        {/* --- Mapa / Imagen dinámica (derecha) --- */}
        <div className={Style.rightPanel}>
          <img
            src={currentDisplay}
            alt="Mapa o animal"
            className={Style.displayImage}
          />
          {selectedCountry && (
            <div className={Style.countryInfo}>
              <h2>{selectedCountry.name}</h2>
              <img
                src={selectedCountry.flag}
                alt={selectedCountry.name}
                className={Style.flagLarge}
              />
            </div>
          )}
        </div>
      </div>
        <Footer />
    </div>
  );
}