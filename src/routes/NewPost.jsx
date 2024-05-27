import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Link, Form, redirect } from 'react-router-dom';
import styles from './NewPost.module.css';
import Modal from '../components/Modal';
import axios from 'axios';

function NewPost(){
    const {user} = useAuth0();
    const [isCustom, setIsCustom] = useState(false)
    const [isCustomHours, setIsCustomHours] = useState(false)
    const [hoursperday, setHoursperday] = useState(8)
    const [enddatehoursperday, setEndDateHoursperday] = useState(8)
    function addCustomInput(event){
        if( event.target.value === 'customInput'){
            return setIsCustom(true)
        }
    }
    function displayHours(){
        return setIsCustomHours(true)
    }
    function addHours(event){
        return setHoursperday(event.target.value)
    }
    function addEnddateHours(event){
        return setEndDateHoursperday(event.target.value)
    }
    function handleFileChange(event){
        console.log("this is file data name")
        console.log(event.target.files[0].name)
    }

    return(
        <Modal>
            <Form method='post' className={styles.form} encType="multipart/form-data">
                <p>
                    <label className={styles.label} htmlFor='name'>Reason</label>
                    <select name="name" id="name" onChange={addCustomInput}>
                        <option value="Holidays">Holidays</option>
                        <option value="Family Trip">Family Trip</option>
                        <option value="Vacation">Vacation</option>
                        <option value="customInput">Custom</option>
                    </select>
                {isCustom? <input className={styles.input} type='text' id='customInput' name='customInput' placeholder='say your reason here' required/>: ''}
                </p>
                <p>
                    <label className={styles.label}  htmlFor='date'>Vacation Start Date</label>
                    <input className={styles.input} type='date' id='date' name='vacationStartdate' required onChange={displayHours} />
                </p>
                {isCustomHours? 
                    <p>
                        <label className={styles.label}  htmlFor='Starthours'>Total hours for Start Date</label>
                        <input className={styles.input} type='number' id='Starthours' name='Starthours' value={hoursperday} onChange={addHours} required />
                    </p>
                : ''}
                <p>
                    <label className={styles.label}  htmlFor='date'>Vacation End Date</label>
                    <input className={styles.input} type='date' id='date' name='vacationEnddate' required/>
                </p>
                {isCustomHours? 
                    <p>
                        <label className={styles.label}  htmlFor='Starthours'>Total hours for End Date</label>
                        <input className={styles.input} type='number' id='Endhours' name='Endhours' value={enddatehoursperday} onChange={addEnddateHours} required />
                    </p>
                : ''}
                <p>
                    <label className={styles.label}  htmlFor='body'>Comment</label>
                    <textarea className={styles.input} id='body' name='body' placeholder='add your comments here..' required rows={3}/>
                </p>
                <p>
                    <label className={styles.checkboxlabel}  htmlFor="agree">Client approval</label>
                    <input type="checkbox" id="agree" name="agree" value="yes" required />
                </p>

                    <label className={styles.checkboxlabel} htmlFor="fileuploading">Upload Screenshot:</label>
                    <input type="file" id="fileupload" name="file" className={styles.customfileinput} onChange={handleFileChange} />
                    {user && (<><input type='hidden' id='email' name='email' value={user.email} /><input type='hidden' id='id' name='authid' value={user.sub.substring(6)} /></>)}

                <p className={styles.actions}>
                    <Link className={styles.linkactions}  to=".." type='button'>Cancel</Link>
                    <button type="submit">Submit</button>
                </p>

            </Form>
        </Modal>
    );
}

export default NewPost;

export async function action({request}) {
    const formData = await request.formData();
    const postData = {
        "authid":formData.get("authid"),
        "email":formData.get("email"),
        "name":formData.get("name"),
        "Starthours":formData.get("Starthours"),
        "Endhours":formData.get("Endhours"),
        "vacationStartdate":formData.get("vacationStartdate"),
        "vacationEnddate":formData.get("vacationEnddate"),
        "body":formData.get("body"),
        "file":formData.get("file")
    }
    try {
        await axios.post('/api/VacationAppItems', postData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('File uploaded successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file');
    }
    return redirect('/posts')
}