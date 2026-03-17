"use client"

import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Styles from "../../complaints.module.css"
import { use } from "react";
import ComplaintInformation from "@/components/complaintInformation/ComplaintInformation";
import ComplaintTimeline from "@/components/ComplaintTimeline/ComplaintTimeline";

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
        async function fetchData() {
            try {

                const [reportRes, updatesRes] = await Promise.all([
                    fetch("http://localhost:3001/reports/get/" + id, {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }),
                    fetch("http://localhost:3001/reports/updates/" + id, {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    })
                ])

                if (!reportRes.ok) throw new Error("Error fetching report")
                if (!updatesRes.ok) throw new Error("Error fetching updates")

                const reportData = await reportRes.json()
                const updatesData = await updatesRes.json()

                setComplaint(reportData)
                setUpdates(updatesData)

            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

    }, [id])


   if (loading) return <div>Loading...</div>

    return (
        <div className="container">
            <Header />
            <div className={Styles.office}>
                <ComplaintInformation complaint={complaint} updates={updates} />
                
                {
                    sizeScreen > 749 && (
                        <div className={Styles.container__actions_pc}>
                            <div className={Styles.actions_pc__head}>
                                <h3>Worker Actions</h3>
                                <p>Case Management Operations</p>
                            </div>
                            <div className={Styles.actions_pc__body}>
                                <div className={Styles.actions__info}>
                                    <div>Icon</div>
                                    <div>
                                        <h5>Request Info</h5>
                                        <p>Ask user for details</p>
                                    </div>
                                </div>
                                <div className={Styles.actions__up}>
                                    <div>Icon</div>
                                    <div>
                                        <h5>Progress Update</h5>
                                        <p>Post case progress</p>
                                    </div>
                                </div>
                                <div className={Styles.actions__app}>
                                    <div>Icon</div>
                                    <div>
                                        <h5>Approve Closure</h5>
                                        <p>Accept closure  request</p>
                                    </div>
                                </div>
                                <div className={Styles.actions__rej}>
                                    <div>Icon</div>
                                    <div>
                                        <h5>Reject Closure</h5>
                                        <p>Deny closure request</p>
                                    </div>
                                </div>
                                <div className={Styles.actions__cl}>
                                    <div>Icon</div>
                                    <div>
                                        <h5>Close Complaint</h5>
                                        <p>Mark as resolved</p>
                                    </div>
                                </div>
                                <div className={Styles.actions__pub}>
                                    <div>Icon</div>
                                    <div>
                                        <h5>Publish Complaint</h5>
                                        <p>Create New of Complaint</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                
                <ComplaintTimeline updates={updates} />
            </div>
            {
                    sizeScreen < 750 && (
                        <div className={Styles.container__actions_phone}>
                            <div className={Styles.actions__info}>
                                <div>Icon</div>
                                <h5>Info</h5>
                            </div>
                            <div className={Styles.actions__up}>
                                <div>Icon</div>
                                <h5>Update</h5>
                            </div>
                            <div className={Styles.actions__app}>
                                <div>Icon</div>
                                <h5>Approve</h5>
                            </div>
                            <div className={Styles.actions__rej}>
                                <div>Icon</div>
                                <h5>Reject</h5>
                            </div>
                            <div className={Styles.actions__cl}>
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