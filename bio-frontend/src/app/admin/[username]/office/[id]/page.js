"use client"

import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import HeaderAdmin from "@/components/header/HeaderAdmin";
import Styles from "../../../Style.module.css"
import { use } from "react";
import ComplaintInformation from "@/components/complaintInformation/ComplaintInformation";
import ComplaintTimeline from "@/components/ComplaintTimeline/ComplaintTimeline";
import { useRouter } from "next/navigation";

export default function Office({ params }) {

    const { id, username } = use(params)

    const [ sizeScreen, setSizeScreen ] = useState(window.innerWidth);
    const [ complaint, setComplaint ] = useState(null);
    const [ updates, setUpdates ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const router = useRouter();

    // Dialogs
    const [dialogInformation, setDialogInformation] = useState(false);
    const [dialogProgress, setDialogProgress] = useState(false);
    const [dialogAccept, setDialogAccept] = useState(false);
    const [dialogReject, setDialogReject] = useState(false);
    const [dialogClose, setDialogClose] = useState(false);
    
    // message
    const [message, setMessage] = useState("");

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
        } catch (error) {
            console.error(error)
        }
    }

    // Actions functions
    const requestInfo = async (id) => {
        try {
            const res = await fetch("http://localhost:3001/actions/request/information/" + id, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message })
            })

            if (!res.ok) throw new Error("Error sending information")

            setMessage("")
            setDialogInformation(false)
            await loadUpdates()

        } catch (error) {
            console.error(error)
        }
    }

    const progressUpdate = async (id) => {
        try {
            const res = await fetch("http://localhost:3001/actions/progress/" + id, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message })
            })

            if (!res.ok) throw new Error("Error sending progress")

            setMessage("")
            setDialogProgress(false)
            await loadUpdates()
        } catch (error) {
            console.error(error)
        }
    }

    const acceptRequestClose = async (id) => {
        try {
            const res = await fetch("http://localhost:3001/actions/accept/close/" + id, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message })
            })

            if (!res.ok) throw new Error("Error sending information")

            setDialogAccept(false)
            await loadUpdates()

        } catch (error) {
            console.error(error)
        }
    }

    const rejectRequestClose = async () => {
        try {
            const res = await fetch("http://localhost:3001/actions/reject/close/" + id, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message })
            })

            if (!res.ok) throw new Error("Error sending information")

            setMessage("")
            setDialogReject(false)
            await loadUpdates()

        } catch (error) {
            console.error(error)
        }
    }

    const closeComplaint = async (id) => {
        try {
            const res = await fetch("http://localhost:3001/actions/resolve/" + id, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message })
            })

            if (!res.ok) throw new Error("Error sending information")

            setDialogClose(false)
            await loadUpdates()

        } catch (error) {
            console.error(error)
        }
    }

    const publishComplaint = () => {
        alert('publishComplaint')
    }


   if (loading) return <div>Loading...</div>

    return (
        <div className="container">
            <HeaderAdmin />
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
                                <div 
                                    className={Styles.actions__info}
                                    onClick={() => setDialogInformation(true)}
                                >
                                    <div>Icon</div>
                                    <div>
                                        <h5>Request Info</h5>
                                        <p>Ask user for details</p>
                                    </div>
                                </div>
                                <div 
                                    className={Styles.actions__up}
                                    onClick={() => setDialogProgress(true)}
                                >
                                    <div>Icon</div>
                                    <div>
                                        <h5>Progress Update</h5>
                                        <p>Post case progress</p>
                                    </div>
                                </div>
                                <div 
                                    className={Styles.actions__app}
                                    { ...complaint?.requestClose ?  {
                                        onClick: () => setDialogAccept(true)
                                    } : null }
                                >
                                    <div>Icon</div>
                                    <div>
                                        <h5>Approve Closure</h5>
                                        <p>Accept closure  request</p>
                                    </div>
                                </div>
                                <div 
                                    className={Styles.actions__rej}
                                    { ...complaint?.requestClose ?  {
                                        onClick: () => setDialogReject(true)
                                    } : null }
                                >
                                    <div>Icon</div>
                                    <div>
                                        <h5>Reject Closure</h5>
                                        <p>Deny closure request</p>
                                    </div>
                                </div>
                                <div 
                                    className={Styles.actions__cl}
                                    onClick={() => setDialogClose(true)}
                                >
                                    <div>Icon</div>
                                    <div>
                                        <h5>Close Complaint</h5>
                                        <p>Mark as resolved</p>
                                    </div>
                                </div>
                                <div 
                                    className={Styles.actions__pub}
                                    {
                                        ...complaint?.state === 'RESOLVED' ? {
                                            onClick: () => publishComplaint()
                                        } : null
                                    }
                                >
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
                            <div 
                                className={Styles.actions__info}
                                onClick={() => setDialogInformation(true)}
                            >
                                <div>Icon</div>
                                <h5>Info</h5>
                            </div>
                            <div 
                                className={Styles.actions__up}
                                onClick={setDialogProgress}
                            >
                                <div>Icon</div>
                                <h5>Update</h5>
                            </div>
                            <div 
                                className={Styles.actions__app}
                                { ...complaint?.requestClose ?  {
                                    onClick: () => setDialogAccept(true)
                                } : null }
                            >
                                <div>Icon</div>
                                <h5>Approve</h5>
                            </div>
                            <div 
                                className={Styles.actions__rej}
                                { ...complaint?.requestClose ?  {
                                    onClick: () => setDialogReject(true)
                                } : null }
                            >
                                <div>Icon</div>
                                <h5>Reject</h5>
                            </div>
                            <div 
                                className={Styles.actions__cl}
                                onClick={() => setDialogClose(true)}
                            >
                                <div>Icon</div>
                                <h5>Close</h5>
                            </div>
                            <div 
                                className={Styles.actions__pub}
                                {
                                    ...complaint?.state === 'RESOLVED' ? {
                                        onClick: () => publishComplaint()
                                    } : null
                                }
                            >
                                <div>Icon</div>
                                <h5>Publish</h5>
                            </div>
                        </div>
                    )
                }
                <dialog className={Styles.dialog} open={dialogInformation}>
                    <div className={Styles.dialog__body}>
                        <h3>Request Information</h3>
                        <div>
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message here" maxLength={400}></textarea>
                            <button className={Styles.dialog__body__button_send} onClick={() => requestInfo(complaint?.id)}>Confirm</button>
                            <button className={Styles.dialog__body__button_cancel} onClick={() => setDialogInformation(false)}>Cancel</button>
                        </div>
                    </div>
                </dialog>
                <dialog className={Styles.dialog} open={dialogProgress}>
                    <div className={Styles.dialog__body}>
                        <h3>Progress Update</h3>
                        <div>
                            <textarea  value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message here" maxLength={400}>
                            </textarea>
                            <button className={Styles.dialog__body__button_send} onClick={() => progressUpdate(complaint?.id)}>Confirm</button>
                            <button className={Styles.dialog__body__button_cancel} onClick={() => setDialogProgress(false)}>Cancel</button>
                        </div>
                    </div>
                </dialog>
                <dialog className={Styles.dialog} open={dialogAccept}>
                    <div className={Styles.dialog__body}>
                        <h3>Accept Closure Request by user {complaint?.user?.username}</h3>
                        <p style={{ marginBottom: "10px" }}>Are you sure you want to cancel this complaint closure?</p>
                        <p style={{ color: "#771112" }}>This will close the complaint and set is as "canceled"</p>
                        <div>
                            <button className={Styles.dialog__body__button_send} onClick={() => acceptRequestClose(complaint?.id)}>Confirm</button>
                            <button className={Styles.dialog__body__button_cancel} onClick={() => setDialogAccept(false)}>Cancel</button>
                        </div>
                    </div>
                </dialog>
                <dialog className={Styles.dialog} open={dialogReject}>
                    <div className={Styles.dialog__body}>
                        <h3>Reject Closure</h3>
                        <div>
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message here"></textarea>
                            <button className={Styles.dialog__body__button_send} onClick={() => rejectRequestClose(complaint?.id)}>Confirm</button>
                            <button className={Styles.dialog__body__button_cancel} onClick={() => setDialogReject(false)}>Cancel</button>
                        </div>
                    </div>
                </dialog>
                <dialog className={Styles.dialog} open={dialogClose}>
                    <div className={Styles.dialog__body}>
                        <h3>Close Complaint</h3>
                        <p style={{ color: "#771112" }}>Are you sure you want to close this complaint?</p>
                        <div>
                            <button className={Styles.dialog__body__button_send} onClick={() => closeComplaint(complaint?.id)}>Confirm</button>
                            <button className={Styles.dialog__body__button_cancel} onClick={() => setDialogClose(false)}>Cancel</button>
                        </div>
                    </div>
                </dialog>
            <Footer />
        </div>
    )
}