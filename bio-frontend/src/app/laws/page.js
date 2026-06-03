"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import HeaderAdmin from "@/components/header/HeaderAdmin";
import Style from "./Laws.module.css";
import AnimalCarousel from "@/components/carousel/carousel";
import { useState, useEffect } from "react";
import Image from "next/image";
import NotificationLogo from "@/components/notificationsLogo/NotificationLogo";

// Images
import mapLatam from "../../../public/laws-imgs/continent/latinAmerica.jpg";

export default function Laws() {
  const [ selectedCountry, setSelectedCountry ] = useState(null);
  const [hoveredAnimal, setHoveredAnimal] = useState(null);
  const [ user, setUser ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ countries, setCountries ] = useState([]);

  useEffect(() => {
      async function fetchUser() {
          try {
            const res = await fetch("http://localhost:3001/auth/profile", {
              method: "GET",
              credentials: "include",
              headers: {
                "content-Type": "application/json",
              }
            })
            if (!res.ok) {
              console.log("Error fetching user profile or there is no user logged in")
              setLoading(false)
            }
            const data = await res.json();
            setUser(data);
            setLoading(false)
        } catch (error) {
          console.error("Error fetching user profile", error);
        } 
      }
      
      fetchUser()
    }, [])

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("/Countries.json");
      const data = await res.json();
      setCountries(data.Countries);
    }
    fetchCountries();
  }, [])


  const currentDisplay =  hoveredAnimal?.img ||
    (selectedCountry ? selectedCountry.flag : mapLatam);

    if (loading) return <div>Loading...</div>;

  return (
     <div className="container">
      { user?.role === "ADMIN" ? <HeaderAdmin/> : <Header/> }
      <main className={Style.laws}>
        {/* --- Lista de países (izquierda) --- */}
        <div className={Style.leftPanel}>
          {countries.map((country) => {
            const isOpen = selectedCountry?.name === country.name;
            return (
              <details
                key={country.name}
                open={isOpen}
                onClick={(e) => {
                  e.preventDefault(); 
                  setSelectedCountry(isOpen ? null : country);
                  setHoveredAnimal(null);
                }}
              >
                <summary>
                  <span>{country.name}</span>
                  <img
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
            width={800}
            height={600}
            className={Style.displayImage}
          />
        </div>
        <NotificationLogo username={user?.username}/>
      </main>
      <Footer />
    </div>
  );
}