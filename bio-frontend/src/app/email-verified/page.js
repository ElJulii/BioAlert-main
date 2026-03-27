"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function EmailVerified() {

    const router = useRouter()
    const [ buttonBackground, setButtonBackground ] = useState("var(--foreground)")

    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "var(--foreground)"
        }}>
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem"
            }}>
                <h1>Email Verified</h1>
                <p style={{
                    fontSize: "1.5rem",
                    color: "var(--background)"
                }}>
                    Your email has been verified successfully
                </p>
                <button 
                    style={{
                        backgroundColor: buttonBackground,
                        color: "var(--background)",
                        padding: "1rem 2rem",
                        borderRadius: "0.5rem",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                    }}
                    onClick={() => router.push('/')}
                    onMouseOver={() => {
                        setButtonBackground("var(--strong-green)")
                    }}

                    onMouseOut={() => {
                        setButtonBackground("var(--foreground)")
                    }}
                >
                    Go to BioAlert
                </button>
            </div>
        </div>
            
    )
}