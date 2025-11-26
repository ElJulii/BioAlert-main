"use client";

import Footer from "@/components/footer/Footer";
import Style from "../../Style.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsProfile({ params }) {
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
          setImagePreview(data.picture); // URL que viene del backend
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
        setImagePreview(data.profilePicture); 
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
          <h1>BioAlert</h1>
        </div>
        <div className={Style.header__buttons}>
          <Link href="/" className={Style.button__home} >Back To Home</Link>
        </div>
      </header>

      <div className={Style.settings}>
        <div>
          <h2>Edit Profile</h2>

          <div className={Style.pictureSection}>
            <h3>Profile Picture</h3>

            <div className={Style.previewContainer} style={{
                background: `url(${imagePreview || "/default-profile.png"}) center / cover no-repeat`
            }}>
              
            </div>

            <form onSubmit={onSubmit}>
              <label htmlFor="profile_picture">Upload a picture</label>

              <input
                id="profile_picture"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
              />

              <button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>


        <button onClick={logout} className="button__logout">Log out</button>
      </div>

      <Footer />
    </div>
  );
}
