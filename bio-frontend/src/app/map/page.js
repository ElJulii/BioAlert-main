"use client"

import Header from "@/components/header/Header";
import { useRouter } from "next/navigation";

export default function Map() {
  const router = useRouter();
  return (
      <>
          <Header />
          <p>We are worker in this section, we let you know when you can see the map...</p>
          <button
              style={{
                  backgroundColor: "var(--background)",
                  color: "var(--strong-green)",
                  padding: "10px 30px",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  borderRadius: "10px",
                  marginTop: "20px",
              }}
              onClick={() => {
                  router.push("/")
              }}
          >
              Get back to BioAlert
          </button>
      </>
  )
}