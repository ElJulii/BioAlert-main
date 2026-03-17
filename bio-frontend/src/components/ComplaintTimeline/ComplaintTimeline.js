import Styles from "./ComplaintTimeline.module.css"

export default function ComplaintTimeline( { updates } ) {
    return (
        <div className={Styles.office__content}>
            <div className={Styles.container__content_header}>
                <h3>Case Updates Timeline</h3>
                <p>{updates.length} updates</p>
            </div>      
            <div className={Styles.container__content_timeline}>
                {
                    updates.map((update) => (
                        <div key={update.id} className={Styles.timeline__item_update}>
                            
                            <div className={Styles.timeline__data}>
                                <div>
                                    <p>{update.user.username}</p>
                                    <p>{update.type}</p>
                                </div>
                                <div>
                                    <p>{  new Date (update.createdAt).toLocaleString() }</p>
                                </div>
                            </div>
                            <div className={Styles.timeline__message}>
                                <p>{update.message}</p>
                            </div>
                            
                        </div>  
                    ))
                }
            </div>        
        </div>       
    )
}