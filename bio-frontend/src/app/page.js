"use client";

import Link from "next/link";
import "../components/header/Header.js";
import Header from "../components/header/Header.js";
import HeaderAdmin from "../components/header/HeaderAdmin.js";
import { use, useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import NotificationLogo from "@/components/notificationsLogo/NotificationLogo";

export default function Home() {

  const [ user, setUser ] = useState(null);
  const [ news, setNews ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ comments, setComments ] = useState([]);
  const [ commentInputs, setCommentInputs ] = useState([]);

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

  useEffect(() => {

    async function loadComments() {
      const data = {}

      for (const item of news) {
        const res = await fetch(`http://localhost:3001/comments/get/${item.id}`)
        const comments = await res.json()
        data[item.id] = comments
      }

      setComments(data)
    }

    if (news.length > 0) loadComments()

  }, [news])

  const addComment = async (newsId) => {
    const content = commentInputs[newsId]
    if (!content?.trim()) return

    const temp= {
      id: Date.now(),
      content,
      user: {
        username: user?.username
      }
    }

    setComments(prev => ({
      ...prev,
      [newsId]: [temp, ...(prev[newsId] || [])]
    }))

    setCommentInputs(prev => ({
      ...prev,
      [newsId]: ""
    }))

    try {
      const res = await fetch(`http://localhost:3001/comments/create/${newsId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content })
      })

      if (!res.ok) throw new Error("Error creating comment")
      const saved = await res.json()
      setComments(prev => ({
        ...prev,
        [newsId]: prev[newsId].map(c => 
          c.id === saved.id ? saved : c
        )
      }))
    } catch (error) {
      console.log(error)
    }
  }

  const deleteComment = async (commentId, newsId) => {
    setComments(prev => ({
      ...prev,
      [newsId]: prev[newsId].filter(c => c.id !== commentId)
    }))
    try {
      const res = await fetch(`http://localhost:3001/comments/delete/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Error deleting comment")

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
                  <p>Comments: {comments[news.id]?.length || 0}</p>
                </div>
                <div>
                  <button onClick={() => toggleLike(news.id)}>
                    {
                      news.likes.some(l => l.userId === user?.id)
                        ? "❤️"
                        : "🤍"
                    }
                  </button>

                  <input
                    type="text"
                    placeholder="Add comment..."
                    value={commentInputs[news.id] || ""}
                    onChange={(e) =>
                      setCommentInputs(prev => ({
                        ...prev,
                        [news.id]: e.target.value
                      }))
                    }
                  />

                  <button onClick={() => addComment(news.id)}>
                    Post
                  </button>

                  <div>
                    {
                      comments[news.id]?.map(comment => (
                        <div key={comment.id}>
                          <strong>{comment.user.username}</strong>
                          <p>{comment.content}</p>

                          {
                            comment.user.username === user.username && (
                              <button
                                onClick={() => deleteComment(comment.id, news.id)}
                              >
                                delete
                              </button>
                            )
                          }
                        </div>
                      ))
                    }
                  </div>
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
