"use client"

import Header from "@/components/header/Header";
import HeaderAdmin from "@/components/header/HeaderAdmin";
import Footer from "@/components/footer/Footer";
import {  useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "../Style.module.css";

export default function Notifications() {

    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ notifications, setNotifications ] = useState([])
    const router = useRouter();

    useEffect(() => {

        async function fetchData() {
            try {
                const [userRes, notificationsRes] = await Promise.all([
                    fetch("http://localhost:3001/auth/profile", {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "content-Type": "application/json",
                        }
                    }),
                    fetch("http://localhost:3001/notifications", {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "content-Type": "application/json",
                        }
                    })
                ])

                if (!userRes.ok || !notificationsRes.ok) { 
                    console.log("Error fetching user profile or notifications")
                    setLoading(false)
                }

                const userData = await userRes.json();
                const notificationsData = await notificationsRes.json();

                setUser(userData);
                setNotifications(notificationsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile", error);
            }
        }

        fetchData()
    }, [])

    const verifyNotification = async (idNotification, idComplaint) => {
        console.log(idNotification, " ", idComplaint)
        try {
            const res = await fetch("http://localhost:3001/notifications/verify/" + idNotification, {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-Type": "application/json",
                }
            })

            if (!res.ok) throw new Error("Error verifying notification")

            if (user?.role === "ADMIN") router.push(`/admin/${user?.username}/office/${idComplaint}`)
            else router.push(`/complaints/${user?.username}/case/${idComplaint}`)
            
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="container">
            {
                user && user?.role === "ADMIN" ? <HeaderAdmin/> : <Header/>
            }
            <main className={Styles.notifications}>
                <h1>Notifications</h1>
                <div className={Styles.notifications__body}>
                    {
                        notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <div 
                                    className={Styles.notifications__item}
                                    style={{
                                        backgroundColor: notification.isVerified 
                                        ? "#ddd" 
                                        : "var(--background)"
                                    }}
                                    key={index}
                                    onClick={() => verifyNotification(notification.id, notification.reportId)}
                                >
                                    <div className={Styles.notifications__topic}>
                                        <div className={Styles.notifications__topic__header}>
                                            <h3>Report ID: {notification.reportId}</h3>
                                            <p>{ new Date(notification.createAt).toLocaleString() }</p>
                                        </div>
                                        
                                        <p>{notification.state}</p>
                                        
                                    </div>
                                    <div className={Styles.notifications__item__content}>
                                        <p>{notification.message}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="notifications__item">
                                <h2>You have no notifications</h2>
                            </div>
                        )
                    }
                </div>
            </main>
            <Footer />
        </div>
    )
}