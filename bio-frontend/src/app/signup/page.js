"use client"

import Style from "../login/Style.module.css";
import Link from "next/link";
// Rect
import { useState } from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  surname: yup.string().required("Surname is required"),
  username: yup.string().min(4, "The username has to be at least 4 characters").required("Username is required"),
  email: yup.string().email("Must be a valid email").required("Email is required"),
  password: yup.string().min(7, "Password must be at least 7 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm the password is required")
})

export default function SignIn() {

  const { register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(schema)
  })

  const [ isRegister, setIsRegister ] = useState(false)

  const onSubmit = (data) => {
    fetch("http://localhost:3001/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => console.log(error))
      .then((response) => console.log("The user was created successfully"))

    setIsRegister(true)
  }


  return (
    <div className="container__background">
        <div className="container__logReg">
            <div className={Style.container__logo}>
                <h1>BioAlert</h1>
            </div>
            <div className={Style.container__form}>
                <h2>
                    Register
                </h2>
                <form className={Style.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                    <label htmlFor="name">Name: </label>
                    <input id="name" type="text" placeholder="Name" {...register("name")}/>
                    {errors.name && <span className={Style.form__error}>{errors.name.message}</span>}

                    <label htmlFor="surname">Surname: </label>
                    <input id="surname" type="text" placeholder="Surname" {...register("surname")} />
                    {errors.surname && <span className={Style.form__error}>{errors.surname.message}</span>}

                    <label htmlFor="username">Username: </label>
                    <input id="username" type="text" placeholder=" Username" {...register("username")}/>
                    {errors.username && <span className={Style.form__error}>{errors.username.message}</span>}

                    <label htmlFor="email">Email: </label>
                    <input id="email" type="email" placeholder="Email" {...register("email")}/>
                    {errors.email && <span className={Style.form__error}>{errors.email.message}</span>}

                    <label htmlFor="password">Password: </label>
                    <input id="password" type="password" placeholder="Password" {...register("password")}/>
                    {errors.password && <span className={Style.form__error}>{errors.password.message}</span>}

                    <label htmlFor="confirmPassword">Confirm Password: </label>
                    <input id="confirmPassword" type="password" placeholder="Confirm Password" {...register("confirmPassword")}/>
                    {errors.confirmPassword && <span className={Style.form__error}>{errors.confirmPassword.message}</span>}
                    
                    <button type="submit">Register</button>
                </form>
                <div className={Style.container__register}>
                    <Link href="/login">I already have an account</Link>
                </div> 
            </div>
        </div>


        <dialog className={Style.register__message} open={isRegister}>
          <div>
            <h2>You have been successfully registered to BioAlert</h2>
            <p>You can now login to your account</p>
            <Link href="/login">Login to your account</Link>
          </div>
        </dialog>
    </div>
  );
}