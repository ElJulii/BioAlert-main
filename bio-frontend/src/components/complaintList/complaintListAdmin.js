import Styles from "./Styles.module.css"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ComplaintListAdmin({ username }) {

    const [ complaints, setComplaints ] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchComplaints() {
            try {
                const res = await fetch("http://localhost:3001/reports/assigned", {
                    credentials: 'include'
                })
            
                if (!res.ok) throw new Error("Error fetching the complaints")
            
                const data = await res.json()
                setComplaints(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchComplaints()
    }, [])

    return (
        <>
            <div className={Styles.complaints__title}>
                <h2>My Assigned Reports</h2>
                <button onClick={() => {
                    router.push(`/admin/${username}`)
                }}>
                    + Take Report
                </button>
            </div>
            <div className={Styles.complaints}>
                {complaints.length > 0 ? complaints.map(complaint => (

                    <div 
                        key={complaint.id} 
                        className={Styles.complaint__cell} 
                        onClick={() => {
                            router.push(`/admin/${username}/office/${complaint.id}`)
                        }}
                    >
                        <img
                            src={complaint.evidences?.[0]?.url}
                            width="100%"
                            style={{
                                borderRadius: "10px 10px 0 0",
                                maxHeight: "200px",
                                objectFit: "cover"
                            }}
                        >
                        </img>
                        <div className={Styles.complaint__item}>
                            <h3>{complaint.title}</h3>
                            <div>
                                <p style={{marginRight: "25px"}}>&#128047; {complaint.animal}</p>
                                <p>&#128205; {complaint.country + " - " + complaint.city}</p>
                            </div>
                            <p>
                                {new Date(complaint.date).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                }).replace(",", "")
                                }
                            </p>
                        </div>
                    </div>
                )) :
                    <h3>You have no taken complaints</h3>
                }
            </div>
        </>
        
    )
}