import Styles from "./Styles.module.css"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function ComplaintListUser({ username }) {

    const [ complaints, setComplaints ] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchComplaints() {
            try {
                const res = await fetch("http://localhost:3001/reports/me", {
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
            <div className={Styles.complaints__introduction}>
                <div className={Styles.complaints__icon}>
                   <h2>&#128196;</h2> 
                </div>

                <h2>{complaints.length}</h2>
                <h3>REPORTS CREATED</h3>
            </div>
            <div className={Styles.complaints__title}>
                <h2>My Reports</h2>
                <button
                onClick={() => {
                    router.push(`/complaints/${username}/new`)
                }}>
                    + New Report
                </button>
            </div>
            <div className={Styles.complaints}>
                {complaints.length > 0 ? complaints.map((complaint, i) => (

                    <div key={i} className={Styles.complaint__cell_user}>
                        <img
                            src={complaint.evidences?.[0]?.url}
                            width="100%"
                            style={{
                                borderRadius: "10px 10px 0 0"
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
                    <h3>You have no complaints</h3>
                }
            </div>
        </>

        
    )
}