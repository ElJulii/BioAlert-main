"use client"

import Header from "@/components/header/Header";
import Link from "next/link";
import Style from "./Style.module.css";
import Footer from "@/components/footer/Footer";
import NotificationLogo from "@/components/notificationsLogo/NotificationLogo";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Charity() {

  const [ user, setUser ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ totalDonations, setTotalDonations ] = useState(0);
  const [ loadingPayments, setLoadingPayments ] = useState(false);
  const [ amount, setAmount ] = useState(5);
  const router = useRouter();

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

    fetchUser()
  }, [])

  useEffect(() => {
    async function fetchTotalDonations() {
      try {
        const res = await fetch("http://localhost:3001/payments/total", {
          method: "GET",
          credentials: "include",
          headers: {
            "content-Type": "application/json",
          }
        });

        if (!res.ok) {
          console.log("Error fetching total donations")
          setLoading(false)
        }

        const data = await res.json();
        setTotalDonations(data);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching total donations", error);
      } 
    }

    fetchTotalDonations()
  }, [])

  const handleDonate = async (amount) => {
    setLoadingPayments(true)
    const res = await fetch("http://localhost:3001/payments/create-checkout", {
      method: "POST",
      credentials: "include",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({ amount })
    });

    const data = await res.json();
    router.push(data.url)
    setLoadingPayments(false)
  }

  const onChangeAmount = (e) => {
    setAmount(e.target.value)
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <Header />
      <main className={Style.charity}>
        <div className={Style.charity__data}>
          <h1 style={{color: "var(--background)"}}>Support Wildlife Protection</h1>
          <p>Every donation helps rescue injured animals, respond to environmental threats, and protect endangered wildlife in real time.</p>
          <p>Together, we turn reports into real-world action.</p>
          <h2>Total until now: <span>{totalDonations}</span> USD</h2>
        </div>

        <div className={Style.charity__information}>
          <h2>Make Your Donation</h2>
          <p>Your generosity funds real rescue operations and protects vulnerable species.</p>
          <div>
            <label htmlFor="amount">
              Enter donation amount:
              <input id="amount" type="number" placeholder="$" max={100} onChange={onChangeAmount}/>
            </label>
            
          </div>

          <div className={Style.charity__standardButtons}>
            <button onClick={()=> handleDonate(5)}>$5</button>
            <button onClick={()=> handleDonate(10)}>$10</button>
            <button onClick={()=> handleDonate(20)}>$20</button>
            <button onClick={()=> handleDonate(50)}>$50</button>
          </div>

          

          <p>Even $5 helps fund a real rescue operation.</p>

          <button className={Style.charity__donateButton} onClick={()=> handleDonate(amount)}>
            {
              loadingPayments ? "Loading Payment..." : "Donate Now"
            }
          </button> 
        </div>
        <NotificationLogo username={user?.username}/>
      </main>
      <Footer />
    </div>
  )
}