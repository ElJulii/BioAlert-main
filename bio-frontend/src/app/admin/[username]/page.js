"use client"

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import HeaderAdmin from "@/components/header/HeaderAdmin";
import Styles from "../Style.module.css"
import { useEffect, useState } from "react";

export default function AdminPage() {

    // const [user, setUser] = useState(null);
    const [ complaints, setComplaints ] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([])
    const [ selectedComplaints, setSelectedComplaints ] = useState("available");


    useEffect(() => {
        async function fetchComplaints() {
            try {
                const res = await fetch("http://localhost:3001/reports/all", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type" : "application/json",
                    }
                })

                if (!res.ok) throw new Error("Error fetching complaints")
                const data = await res.json()
                setComplaints(data)
                setFilteredComplaints(data)
                
            } catch (error) {
                console.error("Error fetching complaints: ", error)
            }
        }
        fetchComplaints()
    }, [])

    useEffect(() => {
        let filtered = complaints

        switch (selectedComplaints) {
            case "available":
                filtered = complaints.filter(complaint => complaint.state === "ACCEPTED")
                break;
            case "in_progress":
                filtered = complaints.filter(complaint => complaint.state === "IN_PROGRESS")
                break;
            case "resolved":
                filtered = complaints.filter(complaint => complaint.state === "RESOLVED")
                break;
            case "all":
                filtered = complaints
                break;
        }

        setFilteredComplaints(filtered)

    }, [selectedComplaints, complaints])

    const onChangeComplaints = (e) => {
        setSelectedComplaints(e.target.value)
    }

    // useEffect(() => {
    //     async function fetchUser() {
    //         try {
    //           const res = await fetch("http://localhost:3001/auth/profile", {
    //             method: "GET",
    //             credentials: "include",
    //             headers: {
    //               "content-Type": "application/json",
    //             }
    //           });

    //           if (!res.ok) throw new Error("Unauthorized"); 

    //           const data = await res.json();
    //           setUser(data);
    //       } catch (error) {
    //         console.error("Error fetching user profile", error);
    //       } 
    //     }
    //     fetchUser()
    // }, [])


    return (
        <div className="container">
             <HeaderAdmin/>
            <div className={Styles.admin}>
                <h1> Complaints from users</h1>
                <div>
                    <select onChange={onChangeComplaints}>
                        <option value="available">Available</option>
                        <option value="in_progress">In progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="all">All</option>
                    </select>
                </div>
                {
                    filteredComplaints.length > 0 ?
                        <ol>
                            {
                                filteredComplaints.map((complaint) => (
                                    <li key={complaint.id}>
                                        <h3>{complaint.title}</h3>
                                        <p>{complaint.description}</p>
                                        <p>{complaint.userId}</p>
                                        <p>{complaint.state}</p>
                                    </li>))
                            }
                        </ol> 
                        :
                        <h2>No complaints</h2>
                }
            </div>
            <Footer /> 
        </div>    
    )
}