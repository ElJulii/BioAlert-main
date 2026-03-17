import Styles from "./Styles.module.css"
import { useEffect, useState } from "react";

export default function ComplaintListUser() {

    const [ complaints, setComplaints ] = useState([]);

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
        <div className={Styles.complaints}>
            {complaints.length > 0 ? complaints.map((complaint, i) => (

                <div key={i} className={Styles.complaint__cell_user}>
                <h3>{complaint.title}</h3>
                <p>{complaint.description}</p>
                <img
                    src={complaint.evidences?.[0]?.url}
                    width={200}
                    height={200}
                >
                </img>
                </div>
            )) :
                <h3>You have no complaints</h3>
            }
        </div>
    )
}