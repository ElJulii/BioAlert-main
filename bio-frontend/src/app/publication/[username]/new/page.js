"use client"

import HeaderAdmin from "@/components/header/HeaderAdmin";
import Footer from "@/components/footer/Footer";
import Styles from "../../Style.module.css";
import {useState, useEffect, use} from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function NewPublication({ params }) {
    const { username } = use(params)
    const searchParams = useSearchParams();

    const [ report, setReport ] = useState(null);
    const [ reportId, setReportId ] = useState(null);
    const [ reportTitle, setReportTitle ] = useState("");
    const [ reportDescription, setReportDescription ] = useState("");
    const [ reportPlace, setReportPlace ] = useState("");
    const [ image, setImage ] = useState(null);
    const [ imagePreview, setImagePreview ] = useState(null);

    // upload info
    const router = useRouter();
    const [ uploading, setUploading ] = useState(false);

    useEffect(() => {
        const id = searchParams.get("id");
        const title = searchParams.get("title");
        const description = searchParams.get("description");
        const country = searchParams.get("country");
        const city = searchParams.get("city");

        if (id) {
            setReport({ id})

            setReportId(id);
            setReportTitle(title || "");
            setReportDescription(description || "");
            setReportPlace(country && city ? country + ", " + city : "");
        }
    }, [searchParams])

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImage(file);
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
            case "place":
                setReportPlace(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setUploading(true);

        const formData = new FormData();
        formData.append("title", reportTitle);
        formData.append("description", reportDescription);
        formData.append("place", reportPlace);
        
        if (image) {
            formData.append("image", image);
        }

        if (reportId) {
            formData.append("idReport", reportId);
        }
            

        try {
            const res = await fetch(`http://localhost:3001/publications/create`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!res.ok) throw new Error("Error creating report");

            alert("Publication created successfully");
            router.push(`/publication/${username}`);
        } catch (error) {
            console.log(error);
        } finally {
            setUploading(false);
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
                            <form className={Styles.publication__new__form__body__form} onSubmit={handleSubmit}>
                                <label htmlFor="title">Title</label>
                                <input onChange={handleChange} type="text" id="title" name="title" placeholder="Set a new title" required value={reportTitle} />
                                <label htmlFor="context">Context</label>
                                <textarea onChange={handleChange} id="context" name="context" placeholder="Write the new description" required value={reportDescription}></textarea>
                                <label htmlFor="place">Place (country and city)</label>
                                <input onChange={handleChange} type="text" id="place" name="place" placeholder="Write a place (country and city)" required  value={reportPlace} />
                                
                                <label htmlFor="image">Image</label>
                                <input onChange={handleImageChange} type="file" id="image" name="image" accept="image/*" />
                                
                                <button type="submit">
                                    { uploading ? "Uploading..." : "Submit" }
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}