"use client"

import Footer from "@/components/footer/Footer";
import Link from "next/link";
import Style from "../Style.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const complaints = [];
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser()

  }, [])

  

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-Type": "application/json",
        }
      });
      if (!res.ok) throw new Error("Unauthorized");

      router.push("/login");
    } catch (error) {
      console.error("Error logging out", error);
    } 
  }

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please login to see your profile.</div>;

  return (
    <div className="container">
      <header>
        <div>
          <h1>BioAlert</h1>
        </div>
        <div>
          <Link href="/" className={Style.button__home} >Back To Home</Link>
          <button onClick={logout} className="button__logout">Log out</button>
        </div>
        
      </header>
      <div className={Style.profile}>
        <div className={Style.profile__data}>
          <div className={Style.profile__image} style={{ 
              background: `url(${user.picture}) center / cover no-repeat` 
            }}>
          </div>
          <h2>{user.username}</h2>
          <h4>{user.email}</h4>
          <Link href={"/profile/" + user.username + "/settings"}>Settings</Link>
        </div>

        <hr />

        <div className={Style.complaints}>
          {complaints.length > 1 ? complaints.map((complaint, i) => (
            <div key={i} className={Style.complaint__cell}>
              <h3>{complaint.title}</h3>
              <p>{complaint.description}</p>
            </div>
          )) :
            <h3>No complaints</h3>
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}