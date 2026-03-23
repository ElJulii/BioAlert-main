"use client"

import HeaderAdmin from "@/components/header/HeaderAdmin";
import Footer from "@/components/footer/Footer";
import { useState, useEffect } from "react";
import { use } from "react";

export default function Publication({ params }) {

    const { username } = use(params)
    const [ publications, setPublications] = useState([])

    return (
        <div className="container">
            <HeaderAdmin />
            <main>
                <div className="publication">
                    <h1>My publications</h1>
                </div>
                {
                    publications.length > 0 ? (
                        <lo className="publication__list">
                            {
                                publications.map((publication, index) => (
                                    <li className="publication__list__item" key={index}>
                                        <h3>{publication.title}</h3>
                                        <p>{publication.context}</p>
                                        <p>{publication.date_new}</p>
                                        <p>{publication.image_url}</p>
                                    </li>
                                ))
                            }
                        </lo>
                    ) : (
                        <h2>No publications</h2>
                    )
                }
            </main>
            <Footer />
        </div>
    )
}