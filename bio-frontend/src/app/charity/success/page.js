"use client"

import { useRouter } from "next/navigation"

export default function Success() {
    const router = useRouter();
    const style = {
        padding: "30px",
        textAlign: "center",
        backgroundColor: "var(--strong-green)",
        lineHeight: "1.9",
        width: "clamp(300px, 90%, 1400px)",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "20px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.7)",
        
    }
    return (
        <main className="container">
            <div style={style}>
                <h1 style={{color: "var(--background)"}}>The payment was successful</h1>
                <h2>Thank you for your donation and support to BioAlert</h2>
                <button
                    onClick={() => {
                        router.push("/")
                    }}
                    style={{
                        backgroundColor: "var(--background)",
                        color: "var(--strong-green)",
                        padding: "10px 30px",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        borderRadius: "10px",
                        marginTop: "20px",
                    }}
                >
                    Go back to BioAlert
                </button>
            </div>
        </main>
        
    )
}