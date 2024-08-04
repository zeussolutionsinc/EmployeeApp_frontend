import styles from './LandingPage.module.css';
import meeting from '../../meeting.jpg'

function LandingPage(){
    return(
        <body>
            {/* <div ><h1 className={styles.heading1}> Welcome to the Employee Portal</h1></div> */}
            <img src={meeting} />
        </body>
    )
}

export default LandingPage;