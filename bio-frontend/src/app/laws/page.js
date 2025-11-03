"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Style from "./Laws.module.css";
import Image from "next/image";
import AnimalCarousel from "@/components/carousel/carousel";
import { useState } from "react";

// Images
import LatinAmerica from "../../../public/laws-imgs/continent/latinAmerica.jpg";
import flagEcuador from "../../../public/laws-imgs/flags/flag_ecu.png";
import flagMexico from "../../../public/laws-imgs/flags/flag_mex.png";
import flagColombia from "../../../public/laws-imgs/flags/flag_col.png";
import flagArgentina from "../../../public/laws-imgs/flags/flag_arg.png";
import flagBrasil from "../../../public/laws-imgs/flags/flag_bra.png";

// Images Animals Ecuador
import condor from "../../../public/laws-imgs/animals/condor.jpg";
import howlerMonkey from "../../../public/laws-imgs/animals/mono-aullador.jpeg";
import jaguar from "../../../public/laws-imgs/animals/jaguar.jpeg";
import gpTurtle from "../../../public/laws-imgs/animals/tortuga-galapagos.jpg";
// Images Animals Mexico
import axolotl from "../../../public/laws-imgs/animals/ajolote.jpg";
import parrot from "../../../public/laws-imgs/animals/guacamayo-rojo.jpg";
import ocelot from "../../../public/laws-imgs/animals/ocelote.jpg";
// Images Animals Colombia
import beard from "../../../public/laws-imgs/animals/oso-anteojos.jpg";
import toucan from "../../../public/laws-imgs/animals/tucan.jpg";
import dolphin from "../../../public/laws-imgs/animals/pink-dolphin.jpg";
import puma from "../../../public/laws-imgs/animals/puma.jpg";
// Images Animals Argentina
import guanaco from "../../../public/laws-imgs/animals/guanaco.jpg";
import redFox from "../../../public/laws-imgs/animals/zorro.jpg";
// Images Animals Brasil
import blueParrot from "../../../public/laws-imgs/animals/blue.jpeg";
import capuchinMonkey from "../../../public/laws-imgs/animals/capuchino.jpg";
import peccary from "../../../public/laws-imgs/animals/pecari.png";


export default function Laws() {
  const [ selectedCountry, setSelectedCountry ] = useState(null);
  const [hoveredAnimal, setHoveredAnimal] = useState(null);

  const countries = [
  {
      name: "Ecuador",
      flag: flagEcuador,
      map: "",
      laws: [
        "Ley 611 - Protección de la Fauna Silvestre (2000).",
        "Ley Orgánica de Medio Ambiente (2008).",
        "Código Orgánico Penal Ambiental - Art. 250 (2015).",
      ],
      animals: [
        { name: "Condor", img: condor },
        { name: "Monkey howler", img: howlerMonkey },
        { name: "Jaguar", img: jaguar},
        { name: "Galapagos Turtle", img: gpTurtle },
      ],
    },
    {
      name: "México",
      flag: flagMexico,
      map: "/maps/mexico.png",
      laws: [
        "Ley General de Vida Silvestre (2000).",
        "Ley Federal de Sanidad Animal (2007).",
        "Código Penal Federal - Art. 420 (2014).",
      ],
      animals: [
        { name: "Axolotl", img: axolotl },
        { name: "red parrot", img: parrot },
        { name: "Jaguar", img: jaguar },
        { name: "Ocelot", img: ocelot },
      ],
    },
    {
      name: "Colombia",
      flag: flagColombia,
      map: "/maps/colombia.png",
      laws: [
        "Ley 611 - Manejo y Protección de la Fauna Silvestre (2000).",
        "Ley 1333 - Sanciones Ambientales (2009).",
        "Ley 1774 - Protección Animal (2016).",
      ],
      animals: [
        { name: "beard", img: beard },
        { name: "Toucan", img: toucan },
        { name: "Dolphin", img: dolphin },
        { name: "Puma", img: puma },
      ],
    },
    {
      name: "Argentina",
      flag: flagArgentina,
      map: "/maps/argentina.png",
      laws: [
        "Ley 22.421 - Conservación de Fauna Silvestre (1981).",
        "Ley 27.499 - Ley de Protección Animal (2018).",
        "Código Penal Argentino - Art. 206 (2019).",
      ],
      animals: [
        { name: "Guanaco", img: guanaco },
        { name: "Condor", img: condor },
        { name: "Zorro", img: redFox },
        { name: "Toucan", img: toucan },
      ],
    },
    {
      name: "Brasil",
      flag: flagBrasil,
      map: "/maps/brasil.png",
      laws: [
        "Ley 9.605 - Delitos Ambientales (1998).",
        "Ley de Protección de la Biodiversidad (2015).",
        "Constitución Federal - Art. 225 (1988).",
      ],
      animals: [
        { name: "blue parrot", img: blueParrot },
        { name: "Capuchin Monkey", img: capuchinMonkey },
        { name: "Peccary", img: peccary },
        { name: "Jaguar", img: jaguar },
      ],
    },
  ];

  const currentDisplay =  hoveredAnimal?.img ||
    (selectedCountry ? selectedCountry.flag : LatinAmerica);

  return (
     <div className="container">
      <Header />
      <div className={Style.laws}>
        {/* --- Lista de países (izquierda) --- */}
        <div className={Style.leftPanel}>
          {countries.map((country) => {
            const isOpen = selectedCountry?.name === country.name;
            return (
              <details
                key={country.name}
                open={isOpen}
                onClick={(e) => {
                  e.preventDefault(); // evita comportamiento nativo
                  setSelectedCountry(isOpen ? null : country);
                  setHoveredAnimal(null);
                }}
              >
                <summary>
                  <span>{country.name}</span>
                  <Image
                    src={country.flag}
                    alt={country.name}
                    className={Style.flag}
                  />
                </summary>

                {isOpen && (
                  <>
                    <ul className={Style.lawsList}>
                      {country.laws.map((law, i) => (
                        <li key={i}>{law}</li>
                      ))}
                    </ul>

                    <AnimalCarousel
                      animals={country.animals}
                      onHover={setHoveredAnimal}
                    />
                  </>
                )}
              </details>
            );
          })}
        </div>

        {/* --- Mapa / Imagen dinámica (derecha) --- */}
        <div className={Style.rightPanel}>
          <Image  
            src={currentDisplay}
            alt="Flag or animal"
            className={Style.displayImage}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}