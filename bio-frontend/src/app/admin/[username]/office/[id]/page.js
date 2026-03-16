"use client"

import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import HeaderAdmin from "@/components/header/HeaderAdmin";
import Styles from "../../../Style.module.css"
import { use } from "react";

export default function Office({ params }) {

    const { id, username } = use(params)

    const [ sizeScreen, setSizeScreen ] = useState(window.innerWidth);
    const [ complaint, setComplaint ] = useState(null);
    const [ updates, setUpdates ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setSizeScreen(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        async function fetchReport() {
            try {
                const res = await fetch("http://localhost:3001/reports/get/" + id, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type" : "application/json",
                    }
                })
                if (!res.ok) throw new Error("Error fetching report")
                const data = await res.json()
                setComplaint(data)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching report", error)
            }
        }
        fetchReport()
    }, [])

    useEffect(() => {
        async function fetchUpdates() {
            try {
                const res = await fetch("http://localhost:3001/reports/updates/" + id, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type" : "application/json",
                    }
                })
                if (!res.ok) throw new Error("Error fetching report")
                const data = await res.json()
                setUpdates(data)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching updates", error)
            }
        }
        fetchUpdates()
    }, [])


   if (loading) return <div>Loading...</div>

    return (
        <div className="container">
            <HeaderAdmin />
            <div className={Styles.office}>
                <div className={Styles.container__updates_data}>
                    <div className={Styles.updates_data__head}>
                        <div> <p>{complaint.id}</p> </div>
                        <div className={Styles.updates_data__head_last_child}> <p>{complaint.state}</p> </div>
                        <h2>{complaint.title}</h2>
                    </div>
                    <div className={Styles.container__updates_data__body}>
                        <div>
                            <h4>ANIMAL TYPE</h4>
                            <p>{complaint.animal}</p>
                        </div>
                        <div>
                            <h4>LOCATION</h4>
                            <p>{complaint.country}, {complaint.city}</p>
                        </div>
                        <div>
                            <h4>ADDRESS</h4>
                            <p>{complaint.address}</p>
                        </div>
                        <div>
                            <h4>INCIDENT DATE</h4>
                            <p>{new Date (complaint.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h4>PUBLISHED</h4>
                            <p>{ new Date (complaint.createAt).toLocaleDateString() }</p>
                        </div>
                        <div>
                            <h4>REPORTED BY</h4>
                            <p>{complaint.user.username}</p>
                        </div>
                        <div>
                            <h4>ASSIGNED TO</h4>
                            <p>{complaint.assignedTo.name} {complaint.assignedTo.surname}</p>
                        </div>
                        <div>
                            <h4>LAST UPDATED</h4>
                            <p>{ new Date (updates[0].createAt).toLocaleString() }</p>
                        </div>
                    </div>
                </div>

                <div className={Styles.container__updates_description}>
                    <div className={Styles.container__description_title}>
                        <p className={Styles.description__i}>&#128196;</p>
                        <h3>Complaint Description</h3>
                    </div>
                    <div className={Styles.container__description_des}>
                        <p>{complaint.description}</p>
                    </div>
                    <h3>AI ANALYSIS RESULT</h3>
                    <div className={Styles.container__description_ia}>
                        <div className={Styles.container__description_ia_icon}>
                            <p>&#127999;</p>
                        </div>
                        <div className={Styles.container__description_ia_results}>
                            <h4>{complaint.analysisResult.animalDetected ? "Animal detected" : "No animal detected"}</h4>
                            <p>{complaint.analysisResult.animals.length} animal/s identified by our AI</p>
                        </div>
                    </div>
                    
                    
                </div>

                <div>
                    evidences and actions

                    {
                        sizeScreen > 749 && (
                            <div>
                                <h3>Worker Actions</h3>
                                <p>Case Management Operations</p>
                                <div>
                                    <div>
                                        <div>Icon</div>
                                        <div>
                                            <h5>Request Info</h5>
                                            <p>Ask user for details</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div>Icon</div>
                                        <div>
                                            <h5>Progress Update</h5>
                                            <p>Post case progress</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div>Icon</div>
                                        <div>
                                            <h5>Approve Closure</h5>
                                            <p>Accept closure  request</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div>Icon</div>
                                        <div>
                                            <h5>Reject Closure</h5>
                                            <p>Deny closure request</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div>Icon</div>
                                        <div>
                                            <h5>Close Complaint</h5>
                                            <p>Mark as resolved</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                
                <div className={Styles.office__content}>
                    <div className={Styles.container__content_header}>
                        <h3>Case Updates Timeline</h3>
                        <p>{updates.length} updates</p>
                    </div>      
                    <div className={Styles.container__content_timeline}>
                        {
                            updates.map((update) => (
                              <div key={update.id} className={Styles.timeline__item_update}>
                                    
                                    <div className={Styles.timeline__data}>
                                        <div>
                                            <p>{update.user.username}</p>
                                            <p>{update.type}</p>
                                        </div>
                                        <div>
                                            <p>{  new Date (update.createdAt).toLocaleString() }</p>
                                        </div>
                                    </div>
                                    <div className={Styles.timeline__message}>
                                        <p>{update.message}</p>
                                    </div>
                                    
                                </div>  
                            ))
                        }
                    </div>        
                </div>

                
            </div>
            {
                    sizeScreen < 750 && (
                        <div className={Styles.container__actions_phone}>
                            <div className={Styles.actions_phone__info}>
                                <div>Icon</div>
                                <h5>Info</h5>
                            </div>
                            <div className={Styles.actions_phone__up}>
                                <div>Icon</div>
                                <h5>Update</h5>
                            </div>
                            <div className={Styles.actions_phone__app}>
                                <div>Icon</div>
                                <h5>Approve</h5>
                            </div>
                            <div className={Styles.actions_phone__rej}>
                                <div>Icon</div>
                                <h5>Reject</h5>
                            </div>
                            <div className={Styles.actions_phone__cl}>
                                <div>Icon</div>
                                <h5>Close</h5>
                            </div>
                        </div>
                    )
                }
            <Footer />
        </div>
    )
}