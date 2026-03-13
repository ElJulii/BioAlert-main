"use client"

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import HeaderAdmin from "@/components/header/HeaderAdmin";
import Styles from "../Style.module.css"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {

    const [user, setUser] = useState(null);
    const [ complaints, setComplaints ] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([])
    const [ selectedComplaints, setSelectedComplaints ] = useState("available");
    const [ dialog, setDialog ] = useState(false);
    const [ currentComplaint, setCurrentComplaint ] = useState(null);
    const router = useRouter();


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
              setUser(data);
          } catch (error) {
            console.error("Error fetching user profile", error);
          } 
        }
        fetchUser()
    }, [])

    const setComplaintToUser = async (complaintId) => {
        try {
            const res = await fetch(`http://localhost:3001/reports/${complaintId}/assign`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-Type": "application/json",
                }
            });
            if (!res.ok) throw new Error("Unauthorized");
            // const data = await res.json();
            setDialog(false)
            setCurrentComplaint(null)
            router.push("/profile/" + user.username)
        } catch (error) {
            console.error("Error assigning complaint to user", error);
        }
    }

    const openDialogConfirm = (complaintId) => {
        setCurrentComplaint(complaintId)
        setDialog(true)
    }

    const closeDialogConfirm = () => {
        setCurrentComplaint(null)
        setDialog(false)
    }

    
    if (!user) return <div>Loading...</div>

    return (
        <div className="container">
             <HeaderAdmin/>
            <div className={Styles.admin}>
                <h1> Complaints from users</h1>
                <div className={Styles.admin__filters}>
                    <h2>Filter by state: </h2>
                    <select className={Styles.admin__state_query} onChange={onChangeComplaints}>
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
                                    <li 
                                        
                                        onClick={ 
                                            complaint.state === "ACCEPTED" 
                                            ? () => openDialogConfirm(complaint.id) 
                                            : null 
                                        }
                                        className={Styles.admin__com_item} 
                                        key={complaint.id}
                                    >
                                        <div>
                                            <h3>
                                                {complaint.title}
                                            </h3>
                                            <p>
                                                <b className={Styles.com_item__b}>Description:</b> {complaint.description}
                                            </p>
                                            <p>
                                                <b className={Styles.com_item__b}>Animal:</b> {complaint.animal}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <b className={Styles.com_item__b}>Date published: </b> 
                                                {
                                                    new Date(complaint.createAt).toLocaleString()
                                                }
                                            </p>
                                            <p> 
                                                <b className={Styles.com_item__b}>State:</b> {complaint.state}
                                            </p>
                                        </div>
                                        
                                    </li>))
                            }
                        </ol> 
                        :
                        <h2>No complaints</h2>
                }
                <dialog className={Styles.dialog_confirm} open={dialog}>
                    <div>
                        <h4>Are you sure you want to assign this complaint?</h4>
                        <button className={Styles.dialog_confirm__button} onClick={closeDialogConfirm}>No</button>
                        <button className={Styles.dialog_confirm__button} onClick={() => setComplaintToUser(currentComplaint)}>Yes</button>
                    </div>
                    
                </dialog>
            </div>
            <Footer /> 
        </div>    
    )
}