"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import "../components/header/Header.js";
import Header from "../components/header/Header.js";
import HeaderAdmin from "../components/header/HeaderAdmin.js";
import { useEffect, useState } from "react";

export default function Home() {

  const [user, setUser] = useState(null);

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

          if (!res.ok) throw new Error("Unauthorized"); 

          const data = await res.json();
          setUser(data);
      } catch (error) {
        console.error("Error fetching user profile", error);
      } 
    }
    fetchUser()
  }, [])

  

  if (!user) return <div>Loading profile</div>;

  return (
    <div className={styles.page}>
      {user?.role === "ADMIN" ? <HeaderAdmin/> : <Header/>}

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
    </div>
  );
}
