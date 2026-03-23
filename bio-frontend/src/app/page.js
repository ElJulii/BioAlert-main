"use client";

import Link from "next/link";
import "../components/header/Header.js";
import Header from "../components/header/Header.js";
import HeaderAdmin from "../components/header/HeaderAdmin.js";
import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import NotificationLogo from "@/components/notificationsLogo/NotificationLogo";

export default function Home() {

  const [ user, setUser ] = useState(null);
  const [ news, setNews ] = useState(null);
  const [ Loading, setLoading ] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
          const [userRes, newsRes] = await Promise.all([
            fetch("http://localhost:3001/auth/profile", {
              method: "GET",
              credentials: "include",
              headers: {
                "content-Type": "application/json",
              }
            }),
            fetch("http://localhost:3001/publications/all", {
              method: "GET",
              credentials: "include",
              headers: {
                "content-Type": "application/json",
              }
            })
          ]);

          if (!userRes.ok || !newsRes.ok) {
            console.log("Error fetching user profile or there is no user logged in")
            setLoading(false)
          }

          const [userData, newsData] = await Promise.all([userRes.json(), newsRes.json()]);
          setUser(userData);
          setNews(newsData);
          setLoading(false)
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData()
  }, [])

  if (Loading) return <div>Loading...</div>

  return (
    <div className="container">
      {user && user?.role === "ADMIN" ? <HeaderAdmin/> : <Header/>}

      <main>
        <h1>Welcome to Next.js!</h1>
        <div className="news">
          {
            news?.map((news, i) => (
              <div key={i} className="news__item">
                <h2>{news.title}</h2>
                <p>{news.context}</p>
                <p>{news.place}</p>
                {
                  news.image_url && (
                    <img src={news.image_url} alt={news.title}/>
                  )
                }
              </div>
            ))
          }
        </div>
        <NotificationLogo username={user?.username}/>
      </main>
      <Footer/>
    </div>
  );
}
