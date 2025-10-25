"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Style from "./About.module.css";
import { useEffect, useState } from "react";

export default function About() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsWide(width > 800);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div className="container">
      <Header />
      <div className={Style.about} style={{padding: windowWidth > 800 ? "30px 15%" : "30px 5%"}}>
        <h2>About BioAlert</h2>
        <details className={Style.about__details}
          open={isWide} 
          onToggle={(e) => { if (isWide) e.preventDefault(); }}
        >
          <summary>🦜 BioAlert: Technology to protect wildlife</summary>
          <p>
            BioAlert is a web platform dedicated to the protection and 
            conservation of wildlife. Its mission is to connect citizens with authorities and organizations responsible for animal protection, making it easy to report cases of abuse, illegal trafficking, and threats to endangered species.
          </p>
          <p>
            Through a simple and secure interface, users can register, file reports, and upload evidence such as photos or videos.
            Using Artificial Intelligence, BoAlert automatically analyzes uploaded images to identify potential protected species and prioritize high-risk cases, helping authorities act faster and more efficiently.        
          </p>
          <p>
            The platform also includes an interactive map of reports, an environmental news section, and a transparent donation system to support rescued animals.
            BioAlert aims to build an active community of citizens committed to wildlife preservation, harnessing technology as a tool for real environmental change.
          </p>
          <p>BioAlert: The digital voice that protects those who cannot defend themselves.</p>
        </details>

        <details className={Style.about__details}
          open={isWide} 
          onToggle={(e) => { if (isWide) e.preventDefault(); }}
        >
          <summary>🌿 Mission, vision and Values of BioAlert</summary>
          <h3>Mission</h3>
          <p>
            To develop a technological platform that promotes the protection and conservation of wildlife, enabling citizens to report acts of abuse or illegal trafficking safely and anonymously.
            BioAlert leverages artificial intelligence and modern digital systems to ensure transparency, efficiency, and real impact in environmental protection.
          </p>
          <h3>Vision</h3>
          <p>
            To become an international reference in the use of technology for the prevention, detection, and reporting of environmental crimes, strengthening collaboration between citizens, authorities, and organizations dedicated to wildlife preservation.
          </p>
          <h3>Values</h3>
          <ol>
            <li><b>Environmental Commitment: </b>We promote respect and protection for all forms of life.</li>
            <li><b>Confidentiality: </b>We safeguard the identity and privacy of every user.</li>
            <li><b>Transparency: </b>We manage cases and donations openly and responsibly.</li>
            <li><b>Innovation: </b>We apply cutting-edge technology to create real and positive change.</li>
            <li><b>Collaboration: </b>We foster a united community driven by nature conservation.</li>
          </ol>
        </details>
        <details className={Style.about__details}
          open={isWide} 
          onToggle={(e) => { if (isWide) e.preventDefault(); }}
        >
          <summary>⚖️ Terms and Conditions</summary>
          <h3>1. Acceptance of Terms</h3>
          <p>
            By registering or using the BioAlert platform, the user agrees to these Terms and Conditions and the related Privacy Policy established by the company.
          </p>
          <h3>2. Use of Platform</h3>
          <p>
            BioAlert is intended exclusively for the reporting of wildlife abuse, illegal trafficking, or environmental threats.
            Users agree to provide truthful and accurate information and to avoid using the system for false, defamatory, or unlawful purposes.
          </p>
          <h3>3. Confidentiality and Anonymity</h3>
          <p>
            Reports submitted through the platform are not published under the user’s name.
            All reports are processed and sent to authorities under the institutional name of BioAlert, ensuring full anonymity and protection of the whistleblower’s identity.
          </p>
          <h3>4. Protection of Personal Data</h3>
          
          <ol>
            <li>User data ia safe and it can not be shared with third parties.</li>
            <li>BioAlert does not share, sell, or disclose personal information to third parties.</li>
            <li>Users may request deletion of their accounts and data at any time.</li>
            <li>Security measures include data encryption, HTTPS connections, JWT authentication, and secure media storage for uploaded evidence.</li>
          </ol>
          
          <h3>5. Evidence and Artificial Intelligence</h3>
          <p>
            Photos and videos uploaded by users are processed by an AI-based image classification system for the purpose of species identification and case prioritization.
            This process does not involve facial recognition or any personal identification, maintaining full user privacy.
          </p>
          <h3>6. User Responsibility</h3>
          <p>
            Users are responsible for ensuring that uploaded content does not violate third-party rights and is relevant to the platform’s objectives.
            False or malicious reports may be reviewed and removed by the BioAlert team.
          </p>
          <h3>7. Limitation of Liability</h3>
          <p>
            BioAlert acts as a technological intermediary, collecting and forwarding information to the appropriate authorities.
            It is not responsible for the actions or decisions taken by third-party entities based on the reports received.
          </p>
          <h3>8. Modifications</h3>
          <p>
            BioAlert reserves the right to update or modify these Terms and Conditions at any time, with notification provided to registered users when applicable.
          </p>
        </details>
        <details className={Style.about__details}
          open={isWide} 
          onToggle={(e) => { if (isWide) e.preventDefault(); }}
        >
          <summary>🛡️ User Security and Data Protection Policy</summary>
          <ol>
            <li>All communication between the user and the platform is conducted over secure HTTPS connections.</li>
            <li>Passwords are encrypted and never visible to administrators.</li>
            <li>Uploaded files (images, videos, documents) are stored in a secure environment with restricted access.</li>
            <li>Captcha validation and email verification are implemented to prevent bot activity and fake accounts.</li>
            <li>The platform prioritizes user anonymity and safety as a fundamental ethical principle.</li>
          </ol>
        </details>
      </div>
      <Footer />
    </div>
  )
}