"use client";

import Footer from "@/components/footer/Footer";
import Style from "../../Style.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { set } from "react-hook-form";

export default function SettingsProfile({ params }) {

  const router = useRouter()
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ username, setUsername ] = useState("");
  const [ email, setEmail ] = useState("");


  // Al cargar, traemos datos del usuario para imagen inicial
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await fetch("http://localhost:3001/auth/profile", {
          method: 'GET',
          credentials: "include",
          headers: {
            "Content-Type": "Application/json"
          }
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        if (data.picture) {
          console.log(data.picture)
          setImagePreview(data.picture); // URL que viene del backend
          setUsername(data.username)
          setEmail(data.email)
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserProfile();
  }, []);

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) throw new Error("Unauthorized")
      router.push("/login")
    } catch (error) {
      console.log(error)
    }

  }

  

  // Cuando el usuario selecciona una nueva imagen
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleUsernameChange = (event) => {
    setUser({ ...user, username: event.target.value })
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return alert("Please select an image first.");

    setUploading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:3001/profile/upload-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile picture updated!");
        setImagePreview(data.image);
        router.push(`/profile/${params.id}`)
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading the image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <div>
          <h1 className={Style.header__title}>BioAlert</h1>
        </div>
        <div className={Style.header__buttons}>
          <Link href="/" className={Style.button__home} >Back To Home</Link>
        </div>
      </header>

      <div className={Style.settings}>
        <h2>Edit Profile</h2>
        
        <form className={Style.settings__edit} onSubmit={onSubmit}>
          <div className={Style.pictureSection}>
            <div className={Style.previewContainer} 
              style={{
                background: `url(${imagePreview || "/default-profile.jpg"}) center / cover no-repeat`
              }}
            > </div>
            <label htmlFor="profile_picture" className={Style.pictureSection__upload}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M23 19V5a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2z"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              Upload photo
              <input id="profile_picture" type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} hidden/>
            </label>
            <span>Upload JPG or PNG (max 5MB)</span>
          </div>
          
          <div className={Style.settings__info_profile}>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={handleUsernameChange}/>
            <span>Your unique handle on BioAlert</span>

            <label htmlFor="email" style={{marginTop: "15px"}}>Email Address</label>
            <input id="email" type="email" value={email} disabled/>
            <span>Email is read-only and managed through account settings</span>
          </div>

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Save Changes"}
          </button>   
        </form>
        
        <div className={Style.settings__danger_zone}>
          <h2>Danger Zone</h2>
          <button onClick={logout} className="button__logout">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log out
          </button>
          <button className="button__delete_account">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/>
              <path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Delete Account
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
