"use client"

import HeaderAdmin from "@/components/header/HeaderAdmin";
import Footer from "@/components/footer/Footer";
import Styles from "../../Style.module.css";
import {useState, useEffect, use} from "react";
import { useSearchParams } from "next/navigation";
import { set } from "react-hook-form";

export default function NewPublication() {
    const searchParams = useSearchParams();

    const [ report, setReport ] = useState(null);
    const [ reportTitle, setReportTitle ] = useState("");
    const [ reportDescription, setReportDescription ] = useState("");
    const [ reportPlace, setReportPlace ] = useState("");
    const [ imagePreview, setImagePreview ] = useState(null);

    useEffect(() => {
        const id = searchParams.get("id");
        const title = searchParams.get("title");
        const description = searchParams.get("description");
        const country = searchParams.get("country");
        const city = searchParams.get("city");

        if (id) {
            setReport({ id})

            setReportTitle(title || "");
            setReportDescription(description || "");
            setReportPlace(country && city ? country + ", " + city : "");
        }
    }, [searchParams])

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImagePreview(URL.createObjectURL(file));
    };
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "title":
                setReportTitle(value);
                break;
            case "context":
                setReportDescription(value);
                break;
            case "date":
                setReportPlace(value);
                break;
            default:
                break;
        }
    };


    return (
        <div className="container">
            <HeaderAdmin />
            <main>
                <div className={Styles.publication__new}>
                    <div className={Styles.publication__new__form}>
                        <div className={Styles.publication__new__form__header}>
                            <h1>New publication</h1>
                            <p style={{ fontWeight: 800 }}>Fill the form to create a new publication</p>
                            {
                                report && (
                                    <h2>ID Report: {report.id}</h2>
                                )
                                
                            }
                        </div>
                        <div className={Styles.publication__new__form__body}>
                            <div 
                                className={Styles.publication__new__form__preview}
                                style={{
                                    background: `url(${imagePreview || "/default-publication.png"}) center / cover no-repeat`
                                }}
                            >    
                            </div>
                            <form className={Styles.publication__new__form__body__form}>
                                <label htmlFor="title">Title</label>
                                <input onChange={handleChange} type="text" id="title" name="title" placeholder="Set a new title" required value={reportTitle} max={100} />
                                <label htmlFor="context">Context</label>
                                <textarea onChange={handleChange} id="context" name="context" placeholder="Write the new description" required value={reportDescription}></textarea>
                                <label htmlFor="date">Place (country and city)</label>
                                <input onChange={handleChange} type="text" id="date" name="date" placeholder="Write a place (country and city)" required  value={reportPlace} />
                                
                                <label htmlFor="image">Image</label>
                                <input onChange={handleImageChange} type="file" id="image" name="image" accept="image/*" />
                                
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                        
                        
                    </div>
                </div>
                

            </main>
            <Footer />
        </div>
    )
}