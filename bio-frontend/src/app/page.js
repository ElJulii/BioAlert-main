"use client";

import Styles from "./Style.module.css"
import Header from "../components/header/Header.js";
import HeaderAdmin from "../components/header/HeaderAdmin.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/Footer";
import NotificationLogo from "@/components/notificationsLogo/NotificationLogo";
import getAllReports from "../../api/getAllReports";

export default function Home() {

  const [ user, setUser ] = useState(null);
  const [ news, setNews ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ comments, setComments ] = useState([]);
  const [ commentInputs, setCommentInputs ] = useState([]);
  const [ reports, setReports ] = useState([]);
  const router = useRouter()

  // Get just the reports with cases
  useEffect(() => {
    const getAllReportsByApi = async () => {
      const data = await getAllReports()
      setReports(data)
    }
    getAllReportsByApi()
  }, [])

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

      if (!res.ok) {
        alert("Please log in to like this publication")
        router.push("/login")
      }

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

      <main className={Styles.news}>
        <div className={Styles.news__header}>
          <div>
            <div className={Styles.news__header__introduction}>
              <h1>Wildlife Protection News</h1>
              <p>
                Stay informed about wildlife protection efforts, case updates, environmental
                laws, and conservation news from around the world. Your engagement helps 
                raise awareness and protect endangered species.
              </p>
            </div>
            <div className={Styles.news__header__objective}>
              <h2>&#128204; OUR OBJECTIVE</h2>
              <p>Record A wildlife protection cases solved with AI assistance and community support</p>
            </div>
          </div>
          <div className={Styles.news__header__stats}>
            <img src="https://png.pngtree.com/png-vector/20230419/ourmid/pngtree-white-shield-vector-png-image_6714259.png" alt="shield log"/>
            <h2>
              {reports?.length}
            </h2>
            <p>Cases Reported</p>
          </div>
        </div>
        
        <div className={Styles.news}>
          {
            news?.map((news, i) => (
              <div key={i} className={Styles.news__item}>
                <div className={Styles.item__author}>
                  <div className={Styles.item__author__circle}>
                    {
                      news.worker?.name.charAt(0).toUpperCase() + news.worker?.surname.charAt(0).toUpperCase()
                    } 
                  </div>
                  <div className={Styles.item__author__info}>
                    <p>{news.worker?.username} - BioAlert Team</p>
                    <p>
                      {new Date(news.date_new).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
                <div className={Styles.item__content}>
                  <div className={Styles.item__content__info}>
                    <h2>{news.title}</h2>
                    <p style={{marginBottom: "10px"}}>&#128205; {news.place}</p>
                    <p>{news.context}</p>
                  </div>
                  <div className={Styles.item__content__image}>
                    {
                      news.image_url && (
                        <img src={news.image_url} alt={news.title}/>
                      )
                    }
                  </div>
                </div>

                <div className={Styles.item__statistics}>
                  <p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"  strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {news.likes.length}
                  </p>
                  <p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
                    </svg>
                    {comments[news.id]?.length || 0}
                  </p>
                </div>

                <div className={Styles.item__actions_comments}>
                  <div className={Styles.item__actions}>
                    <button className={Styles.item__like} onClick={() => toggleLike(news.id)}>
                      {
                        news.likes.some(l => l.userId === user?.id)
                          ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#f00" stroke="currentColor"  strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          )
                          : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          )
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

                    <button className={Styles.item__post} onClick={() => addComment(news.id)}>
                      Post
                    </button>
                  </div>
              
                  <div className={Styles.item__comments}>
                    <h2>Comments</h2>
                    {
                      comments[news.id]?.map(comment => (
                        <div key={comment.id} style={{lineHeight: "25.px"}}>
                          <strong >{comment.user.username}</strong>
                          <p style={{color: "#555", fontSize: "0.9rem"}} >{comment.content}</p>

                          {
                            comment.user.username === user.username && (
                              <button
                                onClick={() => deleteComment(comment.id, news.id)}
                              >
                                Delete
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
