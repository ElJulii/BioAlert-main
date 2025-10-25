import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Style from "./new.module.css";

export default function NewComplaint({ params }) {
    return (
        <div className="container">
            <Header />
            <div className={Style.complaints__new}>
                <div>
                    <h2>Complaint for user {params.id}</h2>
                </div>
                <div>
                    <form className={Style.complaints__new__form}  method="POST">
                        <label for="title">Title: </label>
                        <input type="text" id="title" name="title" />
                        <label for="description">Description: </label>
                        <textarea id="description" name="description"></textarea>
                        <label for="animal">Animal: </label>
                        <input id="animal" type="text" name="animal" />
                        <label for="address">Address: </label>
                        <input id="address" type="text" name="address" />
                        <label for="image">Image (only images): </label>
                        <input id="image" type="file" name="image" accept="image/*"/>
                        <button type="submit">Create</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}