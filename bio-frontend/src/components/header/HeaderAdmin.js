"use client"

import Style from "./Header.module.css"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function HeaderAdmin() {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const path = usePathname()

  //Mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ displayMenu, setDisplayMenu ] = useState('none') 
  const [ displaySecondMenu, setDisplaySecondMenu ] = useState(false)
  const [username, setUsername] = useState(null);

  // effect resize window
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchUser() {
        try {
          const res = await fetch("http://localhost:3001/auth/profile", {
            method: "GET",
            credentials: "include",
            headers: {
              "content-Type": "application/json",
            }
          });

          if (!res.ok) {
            console.log("user not found")
            setUsername("someone")
          }; 

          const data = await res.json();
          setUsername(data.username);
      } catch (error) {
        console.error("Error fetching user profile", error);
      } 
    }
    
    fetchUser()

  }, [])

  const onClickMobileMenu = async () => {
    await setDisplayMenu('block')
    await setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const opeSecondMenu = () => {
    setDisplaySecondMenu(!displaySecondMenu)
  }


  return (
    <header>
      <div className={Style.header__logo}>
        <h1>BioAlert</h1>
      </div>
      <nav className={Style.nav}>
          <ul className={Style.header__list}>
            {windowWidth > 768 && (
              <>
                <li>
                  <Link href="/">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{
                      color: path === "/" ? "#22c55e" : "#374151"
                    }}>
                      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                      <path d="M2 3h20a1 1 0 011 1v16a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1zm2 2v14h16V5H4z"/>
                    </svg>
                  </Link>
                  <div className={Style.header__cloud}><p>News</p></div>
                </li>
                <li>
                    <Link href={"/admin/" + username}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{
                        color: path.startsWith( "/admin") ? "#22c55e" : "#374151"
                      }}>
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 13.5l-6-6 1.41-1.41L13 12.67l8.59-8.59L23 5.5l-10 10z"/>
                      </svg>
                    </Link>
                    <div className={Style.header__cloud}><p>My complaints</p></div>
                </li> 
                <li>
                    <Link href="/laws">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{
                        color: path === "/laws" ? "#22c55e" : "#374151"
                    }}>
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg></Link>
                    <div className={Style.header__cloud}><p>Laws</p></div>
                </li>
                <li>
                  <button onClick={opeSecondMenu}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>
                  <div>
                    <ol className={Style.header__second__list} style={{ display:  displaySecondMenu ? "block" : "none" }}>
                      <li className={Style.header__second__item}><Link href="/about">About</Link></li>
                    </ol>
                  </div>
                </li>
              </>
            )}
          </ul>
      </nav>
      <div className={Style.header__profile}>
          <Link href={"/profile/" + username} className={Style.header__profile__button}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
            <span>Profile</span>
          </Link>
      </div>
      
      {windowWidth < 768 && (
        <div className={Style.header__menu}>
          <button className={Style.header__menu__button} onClick={onClickMobileMenu}>
            =
          </button>
        </div>
      )}
      {windowWidth < 768 && (
            <div className={Style.menu} style={{
                   display: displayMenu,
                   left: isMobileMenuOpen ? "0" : "100%"
                 }}>
              <ol className={Style.menu__phone}>
                <li onClick={() => {
                    setIsMobileMenuOpen(!isMobileMenuOpen)
                    setTimeout(() => {
                        setDisplayMenu('none')
                    }, 700)
                }}
                  style={{
                    position: "absolute",
                    top: "1%",
                    right: "10%",
                    fontSize: "5rem",
                  }}
                >
                  =
                </li>
                <li>
                  <Link href="/"> Home</Link>
                </li>
                <li>
                  <Link href={"/admin/" + username}>Complaints</Link>
                </li>
                <li>
                  <Link  href="/laws">Laws</Link>
                </li>
                <li>
                  <Link href="/about">About</Link>
                </li>
              </ol>
            </div>
      )}
    </header>
  )
}