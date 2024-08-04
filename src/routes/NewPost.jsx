import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Link, Form, redirect } from 'react-router-dom';
import styles from './NewPost.module.css';
import Modal from '../components/vacation/Modal';
import axios from 'axios';



function NewPost(){
    const { user } = useAuth0();
    const [isCustom, setIsCustom] = useState(false);
    const [isCustomHours, setIsCustomHours] = useState(false);
    const [hoursperday, setHoursperday] = useState(8);
    const [enddatehoursperday, setEndDateHoursperday] = useState(8);

    function addCustomInput(event){
        if (event.target.value === 'customInput'){
            setIsCustom(true);
        }
    }

    function displayHours(){
        setIsCustomHours(true);
    }

    function addHours(event){
        setHoursperday(event.target.value);
    }

    function addEnddateHours(event){
        setEndDateHoursperday(event.target.value);
    }

    function handleFileChange(event){
        console.log("this is file data name", event.target.files[0].name);
    }

    return (
        <Modal>
            <Form method='post' className={styles.form} encType="multipart/form-data">
                <p>
                    <label className={styles.label} htmlFor='name'>Reason</label>
                    <select className={styles.select} name="name" id="name" onChange={addCustomInput}>
                        <option value="Holidays">Holidays</option>
                        <option value="Family Trip">Family Trip</option>
                        <option value="Vacation">Vacation</option>
                        <option value="customInput">Custom</option>
                    </select>
                    {isCustom ? <input className={styles.input} type='text' id='customInput' name='customInput' placeholder='Say your reason here' required /> : ''}
                </p>
                <p>
                    <label className={styles.label} htmlFor='date'>Vacation Start Date</label>
                    <input className={styles.input} type='date' id='date' name='vacationStartdate' required onChange={displayHours} />
                </p>
                {isCustomHours ? (
                    <p>
                        <label className={styles.label} htmlFor='Starthours'>Total hours for Start Date</label>
                        <input className={styles.input} type='number' id='Starthours' name='Starthours' value={hoursperday} onChange={addHours} required />
                    </p>
                ) : ''}
                <p>
                    <label className={styles.label} htmlFor='date'>Vacation End Date</label>
                    <input className={styles.input} type='date' id='date' name='vacationEnddate' required />
                </p>
                {isCustomHours ? (
                    <p>
                        <label className={styles.label} htmlFor='Endhours'>Total hours for End Date</label>
                        <input className={styles.input} type='number' id='Endhours' name='Endhours' value={enddatehoursperday} onChange={addEnddateHours} required />
                    </p>
                ) : ''}
                <p>
                    <label className={styles.label} htmlFor='body'>Comment</label>
                    <textarea className={styles.textarea} id='body' name='body' placeholder='Add your comments here..' required rows={3} />
                </p>
                <p>
                    <label className={styles.checkboxlabel} htmlFor="agree">Client approval</label>
                    <input type="checkbox" id="agree" name="agree" value="yes" required />
                </p>
                <p>
                    <label className={styles.checkboxlabel} htmlFor="fileuploading">Upload Screenshot:</label>
                    <input type="file" id="fileupload" name="file" className={styles.customfileinput} onChange={handleFileChange} />
                    {user && (
                        <>
                            <input type='hidden' id='email' name='email' value={user.email} />
                            <input type='hidden' id='id' name='authid' value={user.sub.substring(6)} />
                        </>
                    )}
                </p>
                <div className={styles.actions}>
                    <Link to=".." type='button'>Cancel</Link>
                    <button type="submit">Submit</button>
                </div>
            </Form>
        </Modal>
    );
}

export default NewPost;

export async function action({ request }) {
    const formData = await request.formData();
    const postData = {
        "authid": formData.get("authid"),
        "email": formData.get("email"),
        "name": formData.get("name"),
        "Starthours": formData.get("Starthours"),
        "Endhours": formData.get("Endhours"),
        "vacationStartdate": formData.get("vacationStartdate"),
        "vacationEnddate": formData.get("vacationEnddate"),
        "body": formData.get("body"),
        "file": formData.get("file")
    };
    try {
        await axios.post('/api/VacationAppItems', postData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('File uploaded successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file');
    }
    return redirect('/posts');
}