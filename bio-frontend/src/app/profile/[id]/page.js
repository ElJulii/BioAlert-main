import Footer from "@/components/footer/Footer";
import Link from "next/link";
import Style from "../Style.module.css";

export default function Profile() {

  const complaints = [ {title: "complaint 1", description: "description 1"},
                       {title: "complaint 2", description: "description 2"},
                       {title: "complaint 3", description: "description 3"},
                       {title: "complaint 4", description: "description 4"},
                       {title: "complaint 5", description: "description 5"},
                       {title: "complaint 6", description: "description 6"},
                       {title: "complaint 7", description: "description 7"},
                       {title: "complaint 8", description: "description 8"},
                       {title: "complaint 9", description: "description 9"},
                       {title: "complaint 10", description: "description 10"},
                     ];

  return (
    <div className="container">
      <header>
        <div>
          <h1>BioAlert</h1>
        </div>
        <Link href="/" className={Style.button__home} >Back To Home</Link>
      </header>
      <div className={Style.profile}>
        <div className={Style.profile__data}>
          <div className={Style.profile__image}>Photo of the user</div>
          <h2>Name of the user</h2>
          <h4>Email of the user</h4>
          <p>Setting</p>
        </div>

        <hr />

        <div className={Style.complaints}>
          {complaints.length > 1 ? complaints.map((complaint, i) => (
            <div key={i} className={Style.complaint__cell}>
              <h3>{complaint.title}</h3>
              <p>{complaint.description}</p>
            </div>
          )) :
            <h3>No complaints</h3>
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}