"use client"

import Headers from "@/components/header/Header";
import Link from "next/link";
import Style from "./complaints.module.css";
import Footer from "@/components/footer/Footer";
import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";

export default function Complaints({ params }) {

    const [ windowWidth, setWindowWidth ] = useState(0);
    const { username } = React.use(params)
    const [ userComplaints, setUserComplaints ] = useState([])
    const router = useRouter();


    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
        
    }, []);

    useEffect(() => {
        async function fetchComplaints() {
            try {
                const res = await fetch('http://localhost:3001/reports/me',  {
                    credentials: 'include'
                })

                if (!res.ok) throw new Error('It was en error with the response')
                const data = await res.json()
                setUserComplaints(data)
                
            } catch (error) {
                console.error('Error fetching: ', error)
            }
        }

        fetchComplaints()
    }, [])

    const getStateColor = (state) => {
        switch (state) {
            case "PENDING":
                return "#E0BC00"
                break;
            case "ACCEPTED":
                return "#00008A"
                break;
            case "IN_PROGRESS":
                return "#b6441b"
                break;
            case "RESOLVED":
                return "#008000"
                break;
            case "REJECTED":
                return "#FF0000"
                break;
            default:
                return "#E0BC00"
                break;
        }
    }

    const goToCasePage = (id) => {
        router.push(`/complaints/${username}/case/${id}`)
    }

    return (
        <div className="container">
            <Headers />
            <div className={Style.complaints__body}>
                <div className={Style.complaints__introduction}>
                    <h2 className={Style.complaints__title}>Complaints</h2>
                    <p>
                        This is the complaints page of user {username}. Where it will
                        show all the complaints of the user and also here some text to 
                        guide the user to create a new complaint.
                    </p>  
                </div>
                <div className={Style.complaints__button__container}>
                    <button className={Style.complaints__button} onClick={() => {
                        window.location.href = "/complaints/" + username + "/new"
                    }}>Create a complaint</button>
                </div>
                <ol 
                    className={Style.complaints__list} 
                    style={{
                        flexDirection: windowWidth > 700 ? "row" : "column",
                        flexWrap: windowWidth > 700 ? "wrap" : "nowrap",
                        justifyContent: windowWidth > 700 ? "center" : "none",
                    }}
                >
                    {
                        userComplaints.length > 0 ? (
                            userComplaints.map((complaint, index) => (
                                <li className={Style.complaints__item} key={index} onClick={() => {
                                    goToCasePage(complaint.id)
                                }}>
                                    <div className={Style.complaints__itemID}>
                                        <p>ID: {complaint.id}</p>
                                    </div>
                                    <div className={Style.complaints__itemDescription}>
                                        <h3>{complaint.title}</h3>
                                        <p>{complaint.description}</p>
                                    </div>
                                    <div className={Style.complaints__itemData}>
                                        <p>Date: { new Date(complaint.date).toLocaleDateString() }</p>
                                        <div>
                                            <p>State:</p>
                                            <span style={{
                                                color: getStateColor(complaint.state),
                                                fontWeight: "bold"
                                            }}>{complaint.state}</span>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li>
                                <h2>No complaints</h2>
                                <p>You have no complaints until now</p>
                            </li>
                        )
                    }
                </ol>            
            </div>
            <Footer />
        </div>
    )
}