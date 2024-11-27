import { Link, Form, redirect } from 'react-router-dom';
import { useState } from 'react';
import styles from './Post.module.css';
import clipper from '../../clipper.png';

function Post({ id, body, name, vacationStartdate, vacationEnddate, approvalStatus, isManager, imageUrl }) {
    // console.log("Props", { id, body, name, vacationStartdate, vacationEnddate, approvalStatus, isManager, imageUrl });
    const [showpopup, setShowPopup] = useState(false);
    const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const sasToken = 'sp=racw&st=2024-08-04T03:04:55Z&se=2025-09-24T11:04:55Z&spr=https&sv=2022-11-02&sr=c&sig=jtyIOzSd5pa51YCPL690XfD0PmrZcWcQgOkrrz488r4%3D';
    const isWeekday = date => date.getDay() % 6 !== 0;

    const addDaysToDate = (date, n) => {
        const d = new Date(date);
        d.setDate(d.getDate() + n);
        return d;
    };

    const dateDifferenceInWeekdays = (startDate, endDate) =>
        Array
            .from({ length: (endDate - startDate) / 86_400_000 })
            .filter((_, i) => isWeekday(addDaysToDate(startDate, i + 1)))
            .length;

    function popupmodal() {
        setShowPopup(true);
    }

    function closepopupmodal() {
        setShowPopup(false);
    }

    return (
        <li className={styles.post}>
            <Form method='put' className={styles.putForm}>
                {imageUrl && (
                    <img src={clipper} alt="clipper" className={styles.test} style={{ width: '50px', height: '50px' }} />
                )}
                <Link to={id}>
                    <h1 className={styles.author} name={name}>{name}</h1>
                </Link>
                <p className={styles.days}>{dateDifferenceInWeekdays(new Date(vacationStartdate), new Date(vacationEnddate))} days</p>
                <div className={styles.dateandweek}>
                    <p className={styles.vdata}>{vacationStartdate}</p>
                    <p className={styles.vdata} name={vacationStartdate}>({weeks[new Date(vacationStartdate).getDay()]})</p>
                </div>
                <div className={styles.dateandweek}>
                    <p className={styles.vdata}>{vacationEnddate}</p>
                    <p className={styles.vdata} name={vacationEnddate}>({weeks[new Date(vacationEnddate).getDay()]})</p>
                </div>
                <div className={styles.overlay}>
                    <div className={styles.AimageUrl} onMouseOverCapture={popupmodal} onMouseOutCapture={closepopupmodal}>
                        <a href={`${imageUrl}?${sasToken}`} target='_self'>Screenshot: <img src={`${imageUrl}?${sasToken}`} alt="screenshot" className={styles.imageUrl} width='25px' height='25px' /></a>
                        {showpopup && (<div className={styles.popupmodal}><img src={`${imageUrl}?${sasToken}`} alt="popup" className={styles.imageUrl} /></div>)}
                    </div>
                </div>
                <div className={styles.comments}><p name={body}>comments: {body}</p></div>
                <h6 className={styles.astatus} name={approvalStatus}>{approvalStatus}</h6>
                <div className={styles.ctaaction}>
                    {isManager &&
                        (approvalStatus ? <button type="button" className={styles.disablebtn}>Approved</button> : <button type='submit' className={styles.btn} name='isManager' value={true}>Approve</button>)
                    }
                </div>
            </Form>
        </li>
    );
}

export default Post;

export async function action({ request }) {
    console.log(request);
    const formData = await request.formData();
    const postData = Object.fromEntries(formData);
    await fetch('https://zeusemployeeportalbackend.azurewebsites.net/api/VacationAppItems/' + formData.get('id'), {
        method: 'PUT',
        body: JSON.stringify(postData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return redirect('/');
}
