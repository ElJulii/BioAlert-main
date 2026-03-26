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
  const [ news, setNews ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/auth/profile", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) console.log("User not logged in");

        const user = await res.json();
        
        setUser(user);
        setLoading(false);
        
      } catch (error) {
        console.log(error)
      }
    }
    fetchUser();
  }, [])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("http://localhost:3001/publications/all", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) throw new Error("Error fetching news ");

        const news = await res.json();
        setNews(news);
        
      } catch (error) {
        console.log(error)
      }
    }
    fetchNews();
  }, [])

  
  const toggleLike = async (publicationId) => {
    const liked = news.find(n => n.id === publicationId)
      ?.likes.some(l => l.userId === user.id)

    setNews(prev =>
      prev.map(item => {
        if (item.id === publicationId) {
          return {
            ...item,
            likes: liked
              ? item.likes.filter(l => l.userId !== user.id)
              : [...item.likes, { userId: user.id }]
          }
        }
        return item
      })
    )
    try {
      const res = await fetch(`http://localhost:3001/likes/toggle/${publicationId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) alert("Error setting like")

    } catch (error) {
      console.log(error)
    }
  }


  if (loading) return <div>Loading...</div>

  return (
    <div className="container">
      {user && user?.role === "ADMIN" ? <HeaderAdmin/> : <Header/>}

      <main>
        <h1>Welcome to Next.js!</h1>
        <div className="news">
          {
            news?.map((news, i) => (
              <div key={i} className="news__item">
                <div>
                  <h2>{news.title}</h2>
                  <p>{news.context}</p>
                  <p>{news.place}</p>
                  {
                    news.image_url && (
                      <img src={news.image_url} alt={news.title}/>
                    )
                  }
                </div>
                <div>
                  <p>Likes: {news.likes.length}</p>
                  <p>Comments: {news.comments.length}</p>
                </div>
                <div>
                  <button onClick={() => toggleLike(news.id)}>
                    {
                      news.likes.some(l => l.userId === user?.id)
                        ? "❤️"
                        : "🤍"
                    }
                  </button>
                  <input type="text" />
                </div>
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
