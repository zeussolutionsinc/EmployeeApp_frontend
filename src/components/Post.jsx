import { Link, Form, redirect } from 'react-router-dom';
import { useState } from 'react';
import styles from './Post.module.css';
import clipper from '../clipper.png';
import ImageModal from './ImageModal';

function Post(props){
    const [showpopup, setShowPopup]  = useState(false)
    const weeks = ['Mon','Tue', 'Wed', 'Thur', 'Fri', 'Sat','Sun']
    const sasToken = 'sp=r&st=2024-06-13T19:41:16Z&se=2024-06-28T03:41:16Z&spr=https&sv=2022-11-02&sr=c&sig=pKxyFpfqyo1dl%2FgAzn7CJ1i6cOFVt0g%2Ffj0vAYqFvcE%3D'
    const isWeekday = date => date.getDay() % 6 !== 0;

    const addDaysToDate = (date, n) => {
        const d = new Date(date);
        d.setDate(d.getDate() + n);
        return d;
      };
    const dateDifferenceInWeekdays = (startDate, endDate) =>
        Array
          .from({ length: (endDate - startDate) / 86_400_000 })
          .filter((_, i) => isWeekday(addDaysToDate(startDate, i+1)))
          .length;

    function popupmodal(){
        setShowPopup(true)
    }
    function closepopupmodal(){
        setShowPopup(false)
    }
    return (
    <li className={styles.post}>
        <Form method='put' className={styles.putForm}>
        
        {props.imageUrl?
        <img src={clipper} alt={clipper} name={clipper} className={styles.test} style={{ width: '50px', height: '50px' }}/>
            : ''}
        <Link to={props.id}>
            <h1 className={styles.author} name={props.name}> {props.name}</h1>
            </Link>
            
            <p className={styles.days}>{dateDifferenceInWeekdays(new Date(props.vacationStartdate),new Date(props.vacationEnddate) )} days</p>
            <div className={styles.dateandweek}>
                <p className={styles.vdata}> {props.vacationStartdate}</p>
                <p className={styles.vdata} name={props.vacationStartdate}> ({weeks[new Date(props.vacationStartdate).getDay()]})</p>
            </div>
            <div className={styles.dateandweek}>
                <p className={styles.vdata}> {props.vacationEnddate}</p>
                <p className={styles.vdata} name={props.vacationEnddate}> ({weeks[new Date(props.vacationEnddate).getDay()]})</p>
            </div>
            
            
            <div className={styles.overlay}>
            <div className={styles.AimageUrl} onMouseOverCapture={popupmodal} onMouseOutCapture={closepopupmodal}>
                <a href={props.imageUrl + '?' + sasToken} target='_self'>Screenshot: <img src={props.imageUrl + '?' + sasToken} alt={props.imageUrl} className={styles.imageUrl}   width='25px' height='25px'/></a>
            {showpopup && (<div className={styles.popupmodal}><img src={props.imageUrl + '?' + sasToken} alt={props.imageUrl} className={styles.imageUrl}  /></div>)}
            </div>
            </div>
            <div className={styles.comments}><p name={props.body}>comments:  {props.body}</p></div>
            
        <h6 className={styles.astatus} name={props.approvedStatus}> {props.approvedStatus}</h6>
        <div className={styles.ctaaction}>
            
                {props.isManager? 
                
                    props.approvedStatus? <button type="button" className={styles.disablebtn}> Approved </button> : <button type='submit' className={styles.btn} name='isManager' value={true}> Approve </button>
                
                : ''}
        </div>
        </Form>
    </li>)
}

export default Post;

export async function action({request}) {
    console.log(request)
    const formData = await request.formData();
    const postData = Object.fromEntries(formData);
    // await fetch('/api/VacationAppItems/' + formData.get('id'), {
    //     method: 'PUT',
    //     body: JSON.stringify(postData),
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     });
    return redirect('/')
}