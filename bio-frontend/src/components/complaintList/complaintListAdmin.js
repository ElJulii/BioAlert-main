import Styles from "./Styles.module.css"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ComplaintListAdmin() {

    const [ complaints, setComplaints ] = useState([]);
    const [ username, setUsername ] = useState(null);
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

    useEffect(() => {
        async function fetchUser() {
            try {
              const res = await fetch("http://localhost:3001/auth/profile", {
                method: "GET",
                credentials: "include",
                headers: {
                  "content-Type": "application/json",
                }
              });

              if (!res.ok) throw new Error("Unauthorized"); 

              const data = await res.json();
              setUsername(data.username);
          } catch (error) {
            console.error("Error fetching user profile", error);
          } 
        }
        fetchUser()
    }, [])

    const goToComplaint = (id) => {
        router.push(`/admin/${username}/office/${id}`)
    }

    return (
        <div className={Styles.complaints}>
            {complaints.length > 0 ? complaints.map(complaint => (

                <div 
                    key={complaint.id} 
                    className={Styles.complaint__cell} 
                    onClick={() => {
                        router.push(`/admin/${username}/office/${complaint.id}`)
                    }}>
                <h3>{complaint.title}</h3>
                <p>{complaint.description}</p>
                </div>
            )) :
                <h3>You have no taken complaints</h3>
            }
        </div>
    )
}