"use client"

import Header from "@/components/header/Header";
import HeaderAdmin from "@/components/header/HeaderAdmin";
import Footer from "@/components/footer/Footer";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

export default function Notifications() {

    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ notifications, setNotifications ] = useState([])

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

    if (loading) return <div>Loading...</div>

    return (
        <div className="container">
            {
                user && user?.role === "ADMIN" ? <HeaderAdmin/> : <Header/>
            }
            <main className="notifications">
                <h1>Notifications</h1>
                <div className="notifications__body">
                    {
                        notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <div className="notifications__item" key={index}>
                                    <div className="notifications__topic">
                                        <h3>Report ID: {notification.reportId}</h3>
                                        <p>{notification.state}</p>
                                        <p>{ new Date(notification.createAt).toLocaleString() }</p>
                                    </div>
                                    <div className="notifications__item__content">
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