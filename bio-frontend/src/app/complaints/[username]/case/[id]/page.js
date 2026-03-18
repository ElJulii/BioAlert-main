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
    const [ lastUpdate, setLastUpdate ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ dialogInformation, setDialogInformation ] = useState(false);
    const [ dialogRequestClose, setDialogRequestClose ] = useState(false);

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
                setLastUpdate(updatesData[updatesData.length - 1])
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

    }, [id])

    const loadUpdates = async () => {
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
            setLastUpdate(updatesData[updatesData.length - 1])
        } catch (error) {
            console.error(error)
        }
    }

    // Actions functions
    const sendInformation = () => {
        console.log('sendInformation')
    }

    const requestClose = async (id) => {
        try {
            const res = await fetch("http://localhost:3001/actions/request/close/" + id, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (!res.ok) throw new Error("Error sending information")

            setDialogRequestClose(false)
            await loadUpdates()

        } catch (error) {
            console.error(error)
        }
    }


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
                                <h3>Management complaint</h3>
                                <p>You can send more Information or Request to Cancel Request</p>
                            </div>
                            <div className={Styles.actions_pc__body}>
                                <div className={Styles.actions__info}
                                    {
                                        ...lastUpdate?.type === "REQUEST_INFO" ? {
                                            onClick: () => setDialogInformation(true)
                                        } : null
                                    }
                                    
                                >
                                    <div>Icon</div>
                                    <div>
                                        <h5>Send Information</h5>
                                        <p>Text Worker</p>
                                    </div>
                                </div>
                                <div className={Styles.actions__req}
                                    { 
                                        ...!complaint?.requestClose ?  {
                                            onClick: () => setDialogRequestClose(true)
                                        } : null
                                    }
                                
                                >
                                    <div>Icon</div>
                                    <div>
                                        <h5>Request Closure</h5>
                                        <p>Cancel the complaint</p>
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
                            <div 
                                className={Styles.actions__info}
                                {
                                    ...lastUpdate?.type === "REQUEST_INFO" ? {
                                        onClick: () => setDialogInformation(true)
                                    } : null
                                }
                            >
                                <div>Icon</div>
                                <h5>Send Response</h5>
                            </div>
                            <div className={Styles.actions__req} onClick={() => setDialogRequestClose(true)}>
                                <div>Icon</div>
                                <h5>Request Closure</h5>
                            </div>
                        </div>
                    )
                }

                <dialog className={Styles.dialog} open={dialogInformation}>
                    <div className={Styles.dialog__body}>
                        <h3>Request Information</h3>
                        <div>
                            <textarea placeholder="Write your message here" maxLength={400}></textarea>
                            <button className={Styles.dialog__body__button_send} onClick={sendInformation}>Send</button>
                            <button className={Styles.dialog__body__button_cancel} onClick={() => setDialogInformation(false)}>Cancel</button>
                        </div>
                    </div>
                </dialog>
                <dialog className={Styles.dialog} open={dialogRequestClose}>
                    <div className={Styles.dialog__body}>
                        <h3>Cancel Complaint</h3>
                        <p style={{ color: "#771112" }}>Are you sure you want to cancel this complaint?</p>
                        <div>
                            <button className={Styles.dialog__body__button_send} onClick={() => requestClose(complaint?.id)}>Confirm</button>
                            <button className={Styles.dialog__body__button_cancel} onClick={() => setDialogRequestClose(false)}>Cancel</button>
                        </div>
                    </div>
                </dialog>
            <Footer />
        </div>
    )
}