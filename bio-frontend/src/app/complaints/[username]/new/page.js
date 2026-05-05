"use client"

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Style from "../complaints.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import NotificationLogo from "@/components/notificationsLogo/NotificationLogo";



const today = new Date();
const oneYearAgo = new Date();
oneYearAgo.setFullYear(today.getFullYear() - 1);

const schema = yup.object().shape({
    title: yup.string().required("A title is required"),
    description: yup.string().required("A description is required"),
    animal: yup.string().required("The animal that you saw is required"),
    country: yup.string().required("Please select the country"),
    city: yup.string().required("The city is required"),
    address: yup.string().required("Please, write the nearest address that you remember"),
    date: yup.date()
        .min(oneYearAgo, "The date can not be newer than 1 year ago")
        .max(today, "It can be in the future")
        .required("A date is required")
        .typeError("The date is not valid"),
    images: yup
        .mixed()
        .required("You must upload at least one image")
        .test("file-required", "You must upload at least one image", (value) => {
            return value && value.length > 0
        })
        .test("max-3", "You can upload up to 3 images", (value) => {
            return value && value.length <= 3
        })
        .test("file-type", "Only images are allowed", (value) => {
            return (
                value && Array.from(value).every((file) => file.type.startsWith("image/"))
            )
        })
})

export default function NewComplaint({ params }) {

    const { username } = React.use(params)

    const router = useRouter()
    const [ dragActive, setDragActive ] = useState(false)
    const [ uploading, setUploading ] = useState(false)

    const [ imagesPreview, setImagesPreview ] = useState([])
    const { register, handleSubmit, formState: {errors} } = useForm({
        resolver: yupResolver(schema)
    })

    const checkingLengthImages = (e) => {
        const images = Array.from(e.target.files)
        if (images.length > 3 ) {
            return
        }
        setImagesPreview(images.map((image) => URL.createObjectURL(image)))
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    }

    const handleDragLeave = () => {
        setDragActive(false);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files.length ) {
            checkingLengthImages({target: {files}})
        }
    }

    const handleDeleteImg = (i) => {
        const newImages = [...imagesPreview]
        newImages.splice(i, 1)
        setImagesPreview(newImages)
    }


    const onSubmit = async (data) => {
        setUploading(true)
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("animal", data.animal);
        formData.append("country", data.country);
        formData.append("city", data.city);
        formData.append("address", data.address);
        formData.append("date", data.date);

        Array.from(data.images).forEach((file) => {
            formData.append("evidences", file);
        });

        const res = await fetch("http://localhost:3001/reports", {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!res.ok) throw new Error("Error creating report");

        const report = await res.json();
        setUploading(false)
        router.push(`/profile/${report.userId}`);
    };

    useEffect(() => {
        if (imagesPreview.length > 3) {
            setError("images", { message: "You can upload up to 3 images" });
        }
    }, [imagesPreview])

    return (
        <div className="container">
            <Header />
            <main className={Style.complaints__new}>
                <div>
                    <h2>Report Wildlife Incident</h2> 
                </div>
                <div className={Style.complaints__new__container}>
                    <h3 style={{fontSize: "0.9rem", marginBottom: "10px"}} >🚨 INCIDENT DETAILS</h3>
                    <hr style={{marginBottom: "20px", opacity:"0.3"}}/>
                    <form className={Style.complaints__new__form} onSubmit={handleSubmit(onSubmit)} noValidate>
                        <label htmlFor="title">Incident Title</label>
                        <input type="text" id="title" name="title" placeholder="e.g,. Illegal Wildlife Trade Activity" {...register("title")}/>
                        {errors.title && <span className={Style.complaints__err}>{errors.title.message}</span>}
                        <p className={Style.form__instruction}>Brief title describing the incident</p>

                        <label htmlFor="description">Detailed Description</label>
                        <textarea id="description" name="description" placeholder="Describe what you witnessed in detail..." maxLength="800" {...register("description")}></textarea>
                        {errors.description && <span className={Style.complaints__err}>{errors.description.message}</span>}
                        <p className={Style.form__instruction}>Provide as much detail as possible to help our team</p>


                        <h3 style={{fontSize: "0.9rem", margin: "20px 0 10px"}} >&#128205; LOCATION INFORMATION</h3>
                        <hr style={{marginBottom: "20px", opacity:"0.3"}}/>

                        <div className={Style.form__group}>
                            <div>
                                <label htmlFor="country">Country</label>
                                <select id="country" name="country" {...register("country")}>
                                    <option hidden>Select a country...</option>
                                    <option value="AF">Afghanistan</option>
                                    <option value="AX">Åland Islands</option>
                                    <option value="AL">Albania</option>
                                    <option value="DZ">Algeria</option>
                                    <option value="AS">American Samoa</option>
                                    <option value="AD">Andorra</option>
                                    <option value="AO">Angola</option>
                                    <option value="AI">Anguilla</option>
                                    <option value="AQ">Antarctica</option>
                                    <option value="AG">Antigua and Barbuda</option>
                                    <option value="AR">Argentina</option>
                                    <option value="AM">Armenia</option>
                                    <option value="AW">Aruba</option>
                                    <option value="AU">Australia</option>
                                    <option value="AT">Austria</option>
                                    <option value="AZ">Azerbaijan</option>
                                    <option value="BS">Bahamas</option>
                                    <option value="BH">Bahrain</option>
                                    <option value="BD">Bangladesh</option>
                                    <option value="BB">Barbados</option>
                                    <option value="BY">Belarus</option>
                                    <option value="BE">Belgium</option>
                                    <option value="BZ">Belize</option>
                                    <option value="BJ">Benin</option>
                                    <option value="BM">Bermuda</option>
                                    <option value="BT">Bhutan</option>
                                    <option value="BO">Bolivia (Plurinational State of)</option>
                                    <option value="BA">Bosnia and Herzegovina</option>
                                    <option value="BW">Botswana</option>
                                    <option value="BV">Bouvet Island</option>
                                    <option value="BR">Brazil</option>
                                    <option value="IO">British Indian Ocean Territory</option>
                                    <option value="BN">Brunei Darussalam</option>
                                    <option value="BG">Bulgaria</option>
                                    <option value="BF">Burkina Faso</option>
                                    <option value="BI">Burundi</option>
                                    <option value="CV">Cabo Verde</option>
                                    <option value="KH">Cambodia</option>
                                    <option value="CM">Cameroon</option>
                                    <option value="CA">Canada</option>
                                    <option value="BQ">Caribbean Netherlands</option>
                                    <option value="KY">Cayman Islands</option>
                                    <option value="CF">Central African Republic</option>
                                    <option value="TD">Chad</option>
                                    <option value="CL">Chile</option>
                                    <option value="CN">China</option>
                                    <option value="CX">Christmas Island</option>
                                    <option value="CC">Cocos (Keeling) Islands</option>
                                    <option value="CO">Colombia</option>
                                    <option value="KM">Comoros</option>
                                    <option value="CG">Congo</option>
                                    <option value="CD">Congo, Democratic Republic of the</option>
                                    <option value="CK">Cook Islands</option>
                                    <option value="CR">Costa Rica</option>
                                    <option value="HR">Croatia</option>
                                    <option value="CU">Cuba</option>
                                    <option value="CW">Curaçao</option>
                                    <option value="CY">Cyprus</option>
                                    <option value="CZ">Czech Republic</option>
                                    <option value="CI">Côte d'Ivoire</option>
                                    <option value="DK">Denmark</option>
                                    <option value="DJ">Djibouti</option>
                                    <option value="DM">Dominica</option>
                                    <option value="DO">Dominican Republic</option>
                                    <option value="EC">Ecuador</option>
                                    <option value="EG">Egypt</option>
                                    <option value="SV">El Salvador</option>
                                    <option value="GQ">Equatorial Guinea</option>
                                    <option value="ER">Eritrea</option>
                                    <option value="EE">Estonia</option>
                                    <option value="SZ">Eswatini (Swaziland)</option>
                                    <option value="ET">Ethiopia</option>
                                    <option value="FK">Falkland Islands (Malvinas)</option>
                                    <option value="FO">Faroe Islands</option>
                                    <option value="FJ">Fiji</option>
                                    <option value="FI">Finland</option>
                                    <option value="FR">France</option>
                                    <option value="GF">French Guiana</option>
                                    <option value="PF">French Polynesia</option>
                                    <option value="TF">French Southern Territories</option>
                                    <option value="GA">Gabon</option>
                                    <option value="GM">Gambia</option>
                                    <option value="GE">Georgia</option>
                                    <option value="DE">Germany</option>
                                    <option value="GH">Ghana</option>
                                    <option value="GI">Gibraltar</option>
                                    <option value="GR">Greece</option>
                                    <option value="GL">Greenland</option>
                                    <option value="GD">Grenada</option>
                                    <option value="GP">Guadeloupe</option>
                                    <option value="GU">Guam</option>
                                    <option value="GT">Guatemala</option>
                                    <option value="GG">Guernsey</option>
                                    <option value="GN">Guinea</option>
                                    <option value="GW">Guinea-Bissau</option>
                                    <option value="GY">Guyana</option>
                                    <option value="HT">Haiti</option>
                                    <option value="HM">Heard Island and Mcdonald Islands</option>
                                    <option value="HN">Honduras</option>
                                    <option value="HK">Hong Kong</option>
                                    <option value="HU">Hungary</option>
                                    <option value="IS">Iceland</option>
                                    <option value="IN">India</option>
                                    <option value="ID">Indonesia</option>
                                    <option value="IR">Iran</option>
                                    <option value="IQ">Iraq</option>
                                    <option value="IE">Ireland</option>
                                    <option value="IM">Isle of Man</option>
                                    <option value="IL">Israel</option>
                                    <option value="IT">Italy</option>
                                    <option value="JM">Jamaica</option>
                                    <option value="JP">Japan</option>
                                    <option value="JE">Jersey</option>
                                    <option value="JO">Jordan</option>
                                    <option value="KZ">Kazakhstan</option>
                                    <option value="KE">Kenya</option>
                                    <option value="KI">Kiribati</option>
                                    <option value="KP">Korea, North</option>
                                    <option value="KR">Korea, South</option>
                                    <option value="XK">Kosovo</option>
                                    <option value="KW">Kuwait</option>
                                    <option value="KG">Kyrgyzstan</option>
                                    <option value="LA">Lao People's Democratic Republic</option>
                                    <option value="LV">Latvia</option>
                                    <option value="LB">Lebanon</option>
                                    <option value="LS">Lesotho</option>
                                    <option value="LR">Liberia</option>
                                    <option value="LY">Libya</option>
                                    <option value="LI">Liechtenstein</option>
                                    <option value="LT">Lithuania</option>
                                    <option value="LU">Luxembourg</option>
                                    <option value="MO">Macao</option>
                                    <option value="MK">Macedonia North</option>
                                    <option value="MG">Madagascar</option>
                                    <option value="MW">Malawi</option>
                                    <option value="MY">Malaysia</option>
                                    <option value="MV">Maldives</option>
                                    <option value="ML">Mali</option>
                                    <option value="MT">Malta</option>
                                    <option value="MH">Marshall Islands</option>
                                    <option value="MQ">Martinique</option>
                                    <option value="MR">Mauritania</option>
                                    <option value="MU">Mauritius</option>
                                    <option value="YT">Mayotte</option>
                                    <option value="MX">Mexico</option>
                                    <option value="FM">Micronesia</option>
                                    <option value="MD">Moldova</option>
                                    <option value="MC">Monaco</option>
                                    <option value="MN">Mongolia</option>
                                    <option value="ME">Montenegro</option>
                                    <option value="MS">Montserrat</option>
                                    <option value="MA">Morocco</option>
                                    <option value="MZ">Mozambique</option>
                                    <option value="MM">Myanmar (Burma)</option>
                                    <option value="NA">Namibia</option>
                                    <option value="NR">Nauru</option>
                                    <option value="NP">Nepal</option>
                                    <option value="NL">Netherlands</option>
                                    <option value="AN">Netherlands Antilles</option>
                                    <option value="NC">New Caledonia</option>
                                    <option value="NZ">New Zealand</option>
                                    <option value="NI">Nicaragua</option>
                                    <option value="NE">Niger</option>
                                    <option value="NG">Nigeria</option>
                                    <option value="NU">Niue</option>
                                    <option value="NF">Norfolk Island</option>
                                    <option value="MP">Northern Mariana Islands</option>
                                    <option value="NO">Norway</option>
                                    <option value="OM">Oman</option>
                                    <option value="PK">Pakistan</option>
                                    <option value="PW">Palau</option>
                                    <option value="PS">Palestine</option>
                                    <option value="PA">Panama</option>
                                    <option value="PG">Papua New Guinea</option>
                                    <option value="PY">Paraguay</option>
                                    <option value="PE">Peru</option>
                                    <option value="PH">Philippines</option>
                                    <option value="PN">Pitcairn Islands</option>
                                    <option value="PL">Poland</option>
                                    <option value="PT">Portugal</option>
                                    <option value="PR">Puerto Rico</option>
                                    <option value="QA">Qatar</option>
                                    <option value="RE">Reunion</option>
                                    <option value="RO">Romania</option>
                                    <option value="RU">Russian Federation</option>
                                    <option value="RW">Rwanda</option>
                                    <option value="BL">Saint Barthelemy</option>
                                    <option value="SH">Saint Helena</option>
                                    <option value="KN">Saint Kitts and Nevis</option>
                                    <option value="LC">Saint Lucia</option>
                                    <option value="MF">Saint Martin</option>
                                    <option value="PM">Saint Pierre and Miquelon</option>
                                    <option value="VC">Saint Vincent and the Grenadines</option>
                                    <option value="WS">Samoa</option>
                                    <option value="SM">San Marino</option>
                                    <option value="ST">Sao Tome and Principe</option>
                                    <option value="SA">Saudi Arabia</option>
                                    <option value="SN">Senegal</option>
                                    <option value="RS">Serbia</option>
                                    <option value="CS">Serbia and Montenegro</option>
                                    <option value="SC">Seychelles</option>
                                    <option value="SL">Sierra Leone</option>
                                    <option value="SG">Singapore</option>
                                    <option value="SX">Sint Maarten</option>
                                    <option value="SK">Slovakia</option>
                                    <option value="SI">Slovenia</option>
                                    <option value="SB">Solomon Islands</option>
                                    <option value="SO">Somalia</option>
                                    <option value="ZA">South Africa</option>
                                    <option value="GS">South Georgia and the South Sandwich Islands</option>
                                    <option value="SS">South Sudan</option>
                                    <option value="ES">Spain</option>
                                    <option value="LK">Sri Lanka</option>
                                    <option value="SD">Sudan</option>
                                    <option value="SR">Suriname</option>
                                    <option value="SJ">Svalbard and Jan Mayen</option>
                                    <option value="SE">Sweden</option>
                                    <option value="CH">Switzerland</option>
                                    <option value="SY">Syria</option>
                                    <option value="TW">Taiwan</option>
                                    <option value="TJ">Tajikistan</option>
                                    <option value="TZ">Tanzania</option>
                                    <option value="TH">Thailand</option>
                                    <option value="TL">Timor-Leste</option>
                                    <option value="TG">Togo</option>
                                    <option value="TK">Tokelau</option>
                                    <option value="TO">Tonga</option>
                                    <option value="TT">Trinidad and Tobago</option>
                                    <option value="TN">Tunisia</option>
                                    <option value="TR">Turkey (Türkiye)</option>
                                    <option value="TM">Turkmenistan</option>
                                    <option value="TC">Turks and Caicos Islands</option>
                                    <option value="TV">Tuvalu</option>
                                    <option value="UM">U.S. Outlying Islands</option>
                                    <option value="UG">Uganda</option>
                                    <option value="UA">Ukraine</option>
                                    <option value="AE">United Arab Emirates</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="US">United States</option>
                                    <option value="UY">Uruguay</option>
                                    <option value="UZ">Uzbekistan</option>
                                    <option value="VU">Vanuatu</option>
                                    <option value="VA">Vatican City Holy See</option>
                                    <option value="VE">Venezuela</option>
                                    <option value="VN">Vietnam</option>
                                    <option value="VG">Virgin Islands, British</option>
                                    <option value="VI">Virgin Islands, U.S</option>
                                    <option value="WF">Wallis and Futuna</option>
                                    <option value="EH">Western Sahara</option>
                                    <option value="YE">Yemen</option>
                                    <option value="ZM">Zambia</option>
                                    <option value="ZW">Zimbabwe</option>
                                </select>
                                {errors.country && <span className={Style.complaints__err}>{errors.country.message}</span>}
                            </div>
                            <div>
                                <label htmlFor="city" >City/Region</label>
                                <input id="city" type="text" name="city" placeholder="e.g., Moscow" {...register("city")}/>
                                {errors.city && <span className={Style.complaints__err}>{errors.city.message}</span>}
                            </div>
                        </div>

                        <label htmlFor="address">Specific Address/Location</label>
                        <input id="address" type="text" name="address" placeholder="Street address or location description" {...register("address")}/>
                        <p className={Style.form__instruction}>Be as specific as possible</p>
                        {errors.address && <span className={Style.complaints__err}>{errors.address.message}</span>}

                        <h3 style={{fontSize: "0.9rem", margin: "20px 0 10px"}} >&#129409; WILDLIFE INFORMATION</h3>
                        <hr style={{marginBottom: "10px", opacity:"0.3"}}/>

                        <label htmlFor="animal">Animal/Species </label>
                        <input id="animal" type="text" name="animal" placeholder="Select an animal or species" {...register("animal")}/>
                        <p className={Style.form__instruction}>Select the most specific animal or species that you witnessed</p>
                        {errors.animal && <span className={Style.complaints__err}>{errors.animal.message}</span>}

                        <h3 style={{fontSize: "0.9rem", margin: "20px 0 10px"}} >&#128197; WHEN DID THIS HAPPEN?</h3>
                        <hr style={{marginBottom: "10px", opacity:"0.3"}}/>

                        <label htmlFor="date">Date of incident</label>
                        <input id="date" type="date" name="date" placeholder="Date of the situation" {...register("date")}/>
                        <p className={Style.form__instruction}>Must be within the last year</p>
                        {errors.date && <span className={Style.complaints__err}>{errors.date.message}</span>}

                        <h3 style={{fontSize: "0.9rem", margin: "20px 0 10px"}} >&#128248; EVIDENCE PHOTOS</h3>
                        <hr style={{marginBottom: "10px", opacity:"0.3"}}/>

                        <label htmlFor="images" className={`${Style.form__label_img} ${dragActive ? Style.dragOver : ""}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <p>&#128247;</p>
                            Click to upload or drag images here
                            <p className={Style.form__instruction}>JPG or PNG (1-3 images)</p>
                            <input style={{opacity: "0"}} id="images" type="file" name="images" accept="image/*"  multiple {...register("images")} onChange={(e) => {checkingLengthImages(e)}} />
                        </label>
                        {errors.images && <span className={Style.complaints__err}>{errors.images.message}</span>}

                        {
                            imagesPreview.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px"}}>
                                    {
                                        imagesPreview.map((url, i) => (
                                            <div className={Style.form__img} key={i} >
                                                <img src={url} alt={i + "img"}/>
                                                <div onClick={() => handleDeleteImg(i)} className={Style.form__img_delete}>X</div>
                                            </div>
                                        ))
                                    }
                                    <p className={Style.form__instruction_img}>{imagesPreview.length} of 3 images</p>
                                </div>
                            )
                        }

                        <button type="submit">{uploading ? "Uploading..." : "Submit Report"}</button>
                    </form>
                </div>
                <NotificationLogo username={username}/>
            </main>
            <Footer />
        </div>
    )
}