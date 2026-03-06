"use client"

import Footer from "@/components/footer/Footer";
import Link from "next/link";
import Style from "../Style.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Profile() {
  const [ complaints, setComplaints ] = useState([]);
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
  
  // For the data of complaints
  useEffect(() => {
    async function fetchComplaints() {
      try {
        const res = await fetch("http://localhost:3001/reports/me", {
          credentials: 'include'
      })
      
      if (!res.ok) throw new Error("Error fetching the complaints")
      
      const data = await res.json()
      setComplaints(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchComplaints()
  }, [])
    
    

  if (!user) return <div>Loading profile</div>;

  return (
    <div className="container">
      <header>
        <div>
          <h1>BioAlert</h1>
        </div>
        <div className={Style.header__buttons}>
          <Link href="/" className={Style.button__home} >Back To Home</Link>
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

        {
          user.role === "ADMIN" ?
              <div className={Style.complaints}>
                <h3>HERE WILL BE THE COMPLAINTS TAKEN FOR THE ADMIN</h3>
              </div>
            :
              <div className={Style.complaints}>
                {complaints.length > 0 ? complaints.map((complaint, i) => (

                  <div key={i} className={Style.complaint__cell}>
                    <h3>{complaint.title}</h3>
                    <p>{complaint.description}</p>
                    <img
                      src={complaint.evidences?.[0]?.url}
                      width={200}
                      height={200}
                    >
                    </img>
                  </div>
                )) :
                  <h3>No complaints</h3>
                }
              </div>
        }

        
      </div>
      <Footer />
    </div>
  );
}