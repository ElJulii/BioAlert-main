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
    const [ verifiedNotifications, setVerifiedNotifications ] = useState([])
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
                const verifiedNotifications = notificationsData.filter(notification => !notification.isVerified)

                setUser(userData);
                setNotifications(notificationsData);
                setVerifiedNotifications(verifiedNotifications);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile", error);
            }
        }

        fetchData()
    }, [])

    const verifyNotification = async (idNotification, idComplaint) => {
        try {
            const res = await fetch("http://localhost:3001/notifications/verify/" + idNotification, {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-Type": "application/json",
                }
            })

            if (!res.ok) throw new Error("Error verifying notification")

            if (user?.role === "ADMIN") {
                if (idComplaint) router.push(`/admin/${user?.username}/office/${idComplaint}`)
                else router.push(`/publication/${user?.username}`)
            } else router.push(`/complaints/${user?.username}/case/${idComplaint}`)

            
        } catch (error) {
            console.error(error)
        }
    }

    const setColorAndState = (state) => {
        switch (state) {
            case "STATUS_CHANGE":
                return {color: "rgb(9, 4, 109)", state: "Status Change", background: "#eff6ff"}
                break;
            case "USER_RESPONSE":
                return {color: "rgb(128, 128, 2)", state: "User Response", background: "#f5f292"}
                break;
            case "REQUEST_INFO":
                return {color: "rgb(139, 73, 6)", state: "Request Info", background: "rgb(255, 180, 104)"}
                break;
            case "PROGRESS_UPDATE":
                return {color: "#167509", state: "Progress Update", background: "rgb(134, 255, 123)"}
                break;
            case "REQUEST_CLOSE":
                return {color: "rgb(125, 19, 11)", state: "Request Close", background: "rgb(244, 116, 109)"}
                break;
            case "CLOSE_APPROVED":
                return {color: "rgb(61, 41, 125)", state: "Close Approved", background: "rgb(93, 95, 191)"}
                break;
            case "CLOSE_REJECTED":
                return {color: "rgb(125, 19, 11)", state: "Request Close", background: "rgb(244, 116, 109)"}
                break;
            default:
                return {color: "rgb(6, 66, 91)", state: "New Notification", background: "#84edf1"}
                break;
        }
    }

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = [
            { label: "year", seconds: 31536000 },
            { label: "month", seconds: 2592000 },
            { label: "day", seconds: 86400 },
            { label: "hour", seconds: 3600 },
            { label: "min", seconds: 60 },
            { label: "sec", seconds: 1 },
        ];

        for (const i of intervals) {
            const count = Math.floor(seconds / i.seconds);
            if (count > 0) {
            return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
            }
        }

        return "just now";
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="container">
            {
                user && user?.role === "ADMIN" ? <HeaderAdmin/> : <Header/>
            }
            <main className={Styles.notifications}>
                <div className={Styles.notifications__header}>
                    <div>
                        <h1>Your Notifications</h1>
                        <p style={{color: "#666", fontSize: "0.9rem"}}>
                            Stay updated on your case status, reports, and important alerts
                        </p>
                    </div>
                    <div className={Styles.notifications__header__stats_container}>
                        <div className={Styles.notifications__header__stats}>
                            <span style={{color: "var(--strong-green)", fontSize: "1.6rem", fontWeight: "700"}}>
                                {notifications.length}
                            </span>
                            <span style={{color: "#999", fontSize: "0.7rem"}}>
                                TOTAL
                            </span>
                        </div>
                        <div className={Styles.notifications__header__stats}>
                            <span style={{color: "var(--strong-green)", fontSize: "1.6rem", fontWeight: "700"}}>
                                {verifiedNotifications.length}
                            </span>
                            <span style={{color: "#999", fontSize: "0.7rem"}}>
                                UNREAD
                            </span>
                        </div>
                    </div>
                </div>
                <div className={Styles.notifications__body}>
                    {
                        notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <div 
                                    className={Styles.notifications__item}
                                    style={{
                                        backgroundColor: notification.isVerified 
                                        ? "#eee" 
                                        : "var(--background)"
                                    }}
                                    key={index}
                                    onClick={() => verifyNotification(notification.id, notification.reportId)}
                                >
                                    <div className={Styles.notifications__topic}>
                                        <div className={Styles.notifications__topic__header}>
                                            <p style={{
                                                color: setColorAndState(notification.state).color,
                                                background: setColorAndState(notification.state).background,
                                                padding: "3px 15px",
                                                borderRadius: "10px",
                                            }}>
                                                {setColorAndState(notification.state).state}
                                            </p>
                                            <p>{ new Date(notification.createAt).toLocaleString("en-US", {
                                                hour: "numeric",
                                                minute: "numeric",
                                                month: "short",
                                                day: "numeric"
                                            }) }</p>
                                        </div>
                                    </div>
                                    <div className={Styles.notifications__item__content}>
                                        <p>{notification.message}</p>
                                    </div>
                                    <div className={Styles.notifications__item__footer}>
                                        {
                                            notification?.reportId &&
                                            <h3>
                                                &#128196; 
                                                <span
                                                    style={{
                                                        padding: "2px 10px",
                                                        border: "solid transparent",
                                                        borderRadius: "10px",
                                                        marginLeft: "10px",
                                                        background: "var(--strong-green",
                                                        color: "var(--background)",
                                                        
                                                    }}
                                                >
                                                {notification.reportId}  
                                                </span>
                                            </h3>
                                        }
                                        
                                        <div>
                                            <p style={{color: "#888"}}>
                                               { timeAgo(notification.createAt) } 
                                            </p>
                                        </div>
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