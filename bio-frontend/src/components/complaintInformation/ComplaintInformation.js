import Styles from "./ComplaintInformation.module.css"

export default function ComplaintInformation( { complaint, updates } ) {
    return (
        <>
            <div className={Styles.container__updates_data}>
                    <div className={Styles.updates_data__head}>
                        <div> <p>{complaint.id}</p> </div>
                        <div className={Styles.updates_data__head_last_child}> <p>{complaint.state}</p> </div>
                        <h2>{complaint.title}</h2>
                    </div>
                    <div className={Styles.container__updates_data__body}>
                        <div>
                            <h4>ANIMAL TYPE</h4>
                            <p>{complaint.animal}</p>
                        </div>
                        <div>
                            <h4>LOCATION</h4>
                            <p>{complaint.country}, {complaint.city}</p>
                        </div>
                        <div>
                            <h4>ADDRESS</h4>
                            <p>{complaint.address}</p>
                        </div>
                        <div>
                            <h4>INCIDENT DATE</h4>
                            <p>{new Date (complaint.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h4>PUBLISHED</h4>
                            <p>{ new Date (complaint.createAt).toLocaleDateString() }</p>
                        </div>
                        <div>
                            <h4>REPORTED BY</h4>
                            <p>{complaint.user.username}</p>
                        </div>
                        <div>
                            <h4>ASSIGNED TO</h4>
                            <p>
                                {
                                    complaint.assignedTo?.name 
                                    ? `${complaint.assignedTo.surname}, ${complaint.assignedTo.name}` 
                                    : "Unassigned"
                                }   
                            </p>
                        </div>
                        <div>
                            <h4>LAST UPDATED</h4>
                            <p>{ new Date (updates[0].createdAt).toLocaleDateString() }</p>
                        </div>
                    </div>
                </div>

                <div className={Styles.container__updates_description}>
                    <div className={Styles.container__description_title}>
                        <p className={Styles.description__i}>&#128196;</p>
                        <h3>Complaint Description</h3>
                    </div>
                    <div className={Styles.container__description_des}>
                        <p>{complaint.description}</p>
                    </div>
                    <h3>AI ANALYSIS RESULT</h3>
                    <div className={Styles.container__description_ia}>
                        <div className={Styles.container__description_ia_icon}>
                            <p>&#127999;</p>
                        </div>
                        <div className={Styles.container__description_ia_results}>
                            <h4>{complaint.analysisResult.animalDetected ? "Animal detected" : "No animal detected"}</h4>
                            <p>{complaint.analysisResult.animals.length} animal/s identified by our AI</p>
                        </div>
                    </div>
                    
                    
                </div>

                <div className={Styles.container__evidence}>
                    <div className={Styles.container__evidence__head}>
                        <h3>Photographic Evidence</h3>
                    </div>
                    <div className={Styles.evidence__list}>
                        {
                            complaint.evidences.map((evidence) => (
                                <div key={evidence.id} className={Styles.evidence__item}>
                                    <img src={evidence.url} />
                                </div>
                            ))
                        }
                    </div>
                    
                </div>
        </>
    )
}