"use client"

import HeaderAdmin from "@/components/header/HeaderAdmin";
import Footer from "@/components/footer/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Styles from "../Style.module.css";

export default function Publication() {

    const router = useRouter();

    const [ user, setUser] = useState(null)
    const [ publications, setPublications] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ selectedPublication, setSelectedPublication ] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:3001/auth/profile", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                if (!res.ok) throw new Error("Error fetching user");

                const user = await res.json();
                
                setUser(user);
                setLoading(false);
                
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser();
    }, [])

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const res = await fetch(`http://localhost:3001/publications/id/${user.id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                if (!res.ok) throw new Error("Error fetching publications");

                const publications = await res.json();
                setPublications(publications);
                
            } catch (error) {
                console.log(error)
            }
        }

        fetchPublications();
    }, [user])

    if (loading) return <div>Loading...</div>

    return (
        <div className="container">
            <HeaderAdmin />
            <main>
                <div className={Styles.publication__head}>
                    <h1>My publications</h1>
                    <section className={Styles.publication__action_section}>
                        <button className={Styles.action_section__button_create}
                            onClick={() => {
                                router.push(`/publication/${user.username}/new`)
                            }}
                        >
                            New Publication 
                        </button>
                        <button className={Styles.action_section__button_edit} disabled={!selectedPublication} style={{
                            cursor: selectedPublication ? "pointer" : "not-allowed",
                            backgroundColor: selectedPublication ? "var(--strong-green)" : "#aaa",
                            color: selectedPublication ? "var(--background)" : "var(--foreground)"
                        }} onClick={() => {
                                router.push('/')
                            }}>
                            Edit Publication
                        </button>
                    </section>
                </div>
                {
                    publications.length > 0 ? (
                        <ol className={Styles.publication__list}>
                            {
                                publications.map((publication) => (
                                    <li key={publication.id} onClick={() => {
                                            setSelectedPublication(publication.id)
                                        }}
                                        className={
                                        `${Styles.publication__item} ${
                                            selectedPublication === publication.id ? Styles.publication__item_selected : ""
                                        }`}
                                    >
                                        <h3>{publication.title}</h3>
                                        <p>{publication.context}</p>
                                        <p>{publication.date_new}</p>
                                        <img src={publication.image_url} alt="publication" />
                                    </li>
                                ))
                            }
                        </ol>
                    ) : (
                        <h2>No publications</h2>
                    )
                }
            </main>
            <Footer />
        </div>
    )
}