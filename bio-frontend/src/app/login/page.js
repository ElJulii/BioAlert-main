"use client"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"
import Style from "./Style.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginSchema = yup.object().shape({
    usernameOrEmail: yup.string().required("You must write your username"),
    password: yup.string().required("You must write your password")
})

export default function Login() {

    const router = useRouter();
    const [serverError, setServerError] = useState("")

    const {
        register, 
        handleSubmit, 
        formState: {errors}
    } = useForm({ resolver: yupResolver(loginSchema) })

    const onLogin = async (data) => {
        setServerError("")

        try {
            const res = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: { "content-Type": "application/json" },
                body: JSON.stringify({
                    identifier: data.usernameOrEmail,
                    password: data.password
                })
            })

            if (!res.ok) {
                const errData = await res.json()
                setServerError(errData.message || "Login failed")
                return
            }

            const result = await res.json()

            router.push("/profile/" + result.user.id)

        } catch (error) {
            console.error(error)
            setServerError("Something went wrong. Please try again later.");
        }
    }

  return (
    
    <div className="container__background">
        <div className="container__logReg">
            <div className={Style.container__logo}>
                <h1>BioAlert</h1>
            </div>
            <div className={Style.container__form}>
                <h2>
                    Login
                </h2>
                <form className={Style.form} onSubmit={handleSubmit(onLogin)} noValidate>
                    <label htmlFor="email">Username: </label>
                    <input id="email" type="text" placeholder="Email or Username" {...register("usernameOrEmail")}/>
                    <span className={Style.input__icon__user}>👤</span>
                    {errors.usernameOrEmail && <span className={Style.form__error}>{errors.usernameOrEmail.message}</span>} 

                    <label htmlFor="password">Password: </label>
                    <input id="password" type="password" placeholder="Password" {...register("password")}/>
                    <span className={Style.input__icon__lock}>🔒</span>
                    {errors.password && <span className={Style.form__error}>{errors.password.message}</span>}

                    <div className={Style.form__remember}>
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Remember me</label>
                        <span>Forgot password?</span>
                    </div>
                    
                    {serverError && <p className={Style.form__error}>{serverError}</p>}

                    <button type="submit">Login</button>
                </form>
                <div className={Style.container__register}>
                    <Link href="/signup">Not a member? Sign up</Link>
                </div> 
            </div>
        </div>
    </div>
  );
}

