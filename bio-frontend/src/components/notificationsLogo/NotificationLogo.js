"use client"
import { useRouter } from "next/navigation" 
import { useEffect, useState } from "react";

export default function NotificationLogo({ username }) {
    const router = useRouter();
    const [ notifications, setNotifications ] = useState([])

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch("http://localhost:3001/notifications", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "content-Type": "application/json",
                    }
                })

                if (!res.ok) throw new Error("Error fetching notifications")

                const data = await res.json()
                setNotifications(data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchNotifications()
    }, [])

    const StylesContainer = {
        position: "sticky",
        bottom: "20px",
        marginLeft: "auto",
        zIndex: "100",
        cursor: "pointer",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "var(--strong-green)",
    }

    const StylesCounter = {
        position: "absolute",
        top: "0px",
        right: "0px",
        borderRadius: "50%",
        backgroundColor: "var(--warning-color-strong)",
        padding: "5px 7px",
        color: "var(--background)",
        fontSize: "12px",
    }

    return (
        <div style={StylesContainer} onClick={() => {
            router.push(`/notifications/${username}`)
        }}>
            <img
                style={{
                    width: "100%"
                }}
                className="notifications__logo" 
                src="https://static.vecteezy.com/system/resources/previews/010/366/210/non_2x/bell-icon-transparent-notification-free-png.png"
                 alt="notifications"
            />
            {
                notifications.length > 0 && (
                    <div style={StylesCounter} className="notifications__logo__counter">
                        <span>{notifications.length}</span>
                    </div>
                )
            }
        </div>
    )            
}