"use client";

import styles from "./page.module.css";
import Link from "next/link";
import "../components/header/Header.js";
import Header from "../components/header/Header.js";
import HeaderAdmin from "../components/header/HeaderAdmin.js";
import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";

export default function Home() {

  const [ user, setUser ] = useState(null);
  const [ Loading, setLoading ] = useState(true);

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

    async function fetchTest() {
        try {
          const res = await fetch("http://localhost:3001/reports/test", {
            method: "GET",
            credentials: "include",
            headers: {
              "content-Type": "application/json",
            }
          });

          if (!res.ok) {
            console.log("Error fetching user profile or there is no user logged in")
            setLoading(false)
          }

          const data = await res.json();
          console.log(data)
          
      } catch (error) {
        console.error("Error fetching user profile", error);
      } 
    }

    fetchUser()
    fetchTest()
  }, [])

  if (Loading) return <div>Loading...</div>

  return (
    <div className="container">
      {user && user?.role === "ADMIN" ? <HeaderAdmin/> : <Header/>}

      <main className={styles.main}>
        <h1>Welcome to Next.js!</h1>
        <p>
          Get started by editing <code>app/page.js</code>
        </p>
        <ol>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
        </ol>
      </main>
      <Footer/>
    </div>
  );
}
