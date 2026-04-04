"use client"

import Footer from "@/components/footer/Footer";
import Link from "next/link";
import Style from "../Style.module.css";
import { useEffect, useState } from "react";

import ComplaintListUser from "@/components/complaintList/complaintListUser";
import ComplaintListAdmin from "@/components/complaintList/complaintListAdmin";

export default function Profile() {
  
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
    <div className="container">
      <header>
        <div>
          <h1 className={Style.header__title}>BioAlert</h1>
        </div>
        <div className={Style.header__buttons}>
          <Link href="/" className={Style.button__home} >Back To Home</Link>
          {
            user.role === "ADMIN" && <Link href={"/publication/" + user.username} className={Style.button__publications} >Publications</Link>
          }
        </div>
      </header>
      <div className={Style.profile}>
        <div className={Style.profile__data}>
          <div className={Style.profile__image} style={{ 
              background: `url(${user.picture || "/default-profile.jpg"}) center / cover no-repeat`
            }}>
          </div>
          <div className={Style.profile__data__body}>
            <h2>{user.name + " " + user.surname}</h2>
            <h3>
              @{user.username}
              {
                user.isVerified &&
                <svg xmlns="http://www.w3.org/2000/svg" width="19"  height="19"viewBox="0 0 24 24" fill="var(--week-green)">
                  <path d="M12 2l2.39 2.26 3.29-.36.36 3.29L20 9.61 18.74 12 20 14.39l-1.96 1.42-.36 3.29-3.29-.36L12 22l-2.39-2.26-3.29.36-.36-3.29L4 14.39 5.26 12 4 9.61l1.96-1.42.36-3.29 3.29.36L12 2z"/>
                  <path d="M9.5 12.5l1.5 1.5 3-3"  fill="none"  stroke="white"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"/>
                </svg>
              } 
            </h3>
            <h4>&#128231; {user.email}</h4>
            <h4
              style={{marginBottom: "20px"}}
            >&#128197; Member since {new Date(user.createdAt).toLocaleString("en-US", {
                  month: "long",
                  year: "numeric"
                })}
            </h4>
            <Link className={Style.data__body__settings_btn} href={"/profile/" + user.username + "/settings"}>&#128295; Settings</Link>
          </div>
        </div>

        {
          user?.role === "ADMIN" ?
              <ComplaintListAdmin username={user.username}/>
            :
              <ComplaintListUser username={user.username} />
        }
      </div>
      <Footer />
    </div>
  );
}