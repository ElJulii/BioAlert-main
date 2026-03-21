"use client"

import HeaderAdmin from "@/components/header/HeaderAdmin";
import Footer from "@/components/footer/Footer";
import {useState, useEffect} from "react";

export default function Publication() {

    const [ reportInformation, setReportInformation ] = useState(null);
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);


    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("http://localhost:3001/auth/profile", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "content-Type": "application/json",
                    }
                })

                if (!res.ok) throw new Error("The user is not logged in")

                const userData = await res.json();

                setUser(userData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile", error);
            }
        }

        fetchUser()
    }, [])

    return (
        <div className="container">
            <HeaderAdmin />
            <main>
                <h1>My publications</h1>
            </main>
            <Footer />
        </div>
    )
}