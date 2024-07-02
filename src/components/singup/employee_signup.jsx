import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Link, Form, redirect } from 'react-router-dom';
import styles from '../../routes/NewPost.module.css';  // Corrected path
import Modal from '../vacation/Modal';

function Employee_signup() {
    const { user } = useAuth0();
    const [timesheetFrequency, setTimesheetFrequency] = useState('weekly');

    const handleFrequencyChange = (e) => {
        setTimesheetFrequency(e.target.value);
    };

    return (
        <Modal>
            <Form method='post' className={styles.form}>
                <p>
                    <label className={styles.label} htmlFor='firstName'>First Name</label>
                    <input className={styles.input} type='text' id='firstName' name='firstName' placeholder='First Name' required />
                </p>
                <p>
                    <label className={styles.label} htmlFor='lastName'>Last Name</label>
                    <input className={styles.input} type='text' id='lastName' name='lastName' placeholder='Last Name' required />
                </p>
                <p>
                    <label className={styles.label} htmlFor='phoneNumber'>Phone Number</label>
                    <input className={styles.input} type='tel' id='phoneNumber' name='phoneNumber' placeholder='Phone Number' required />
                </p>
                <p>
                    <label className={styles.label} htmlFor='homeAddress'>Home Address</label>
                    <input className={styles.input} type='text' id='homeAddress' name='homeAddress' placeholder='Home Address' required />
                </p>
                <p>
                    <label className={styles.label} htmlFor='Tsfreq'>Timesheet Frequency</label>
                    <select className={styles.input} id='Tsfreq' name='Tsfreq' value={timesheetFrequency} onChange={handleFrequencyChange} required>
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </p>
                {user && (
                    <>
                        <input type='hidden' id='email' name='email' value={user.email} />
                        <input type='hidden' id='authid' name='authid' value={user.sub.substring(6)} />
                    </>
                )}
                <p className={styles.actions}>
                    <Link className={styles.linkactions} to=".." type='button'>Cancel</Link>
                    <button type="submit">Submit</button>
                </p>
            </Form>
        </Modal>
    );
}

export default Employee_signup;

export async function action({ request }) {
    const formData = await request.formData();
    const frequencyMap = {
        'weekly': 'W',
        'bi-weekly': 'B',
        'monthly': 'M'
    };

    const employeeData = {
        email: formData.get("email"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phoneNumber: formData.get("phoneNumber"),
        homeAddress: formData.get("homeAddress"),
        Tsfreq: frequencyMap[formData.get("Tsfreq")],
    };

    try {
        // First API call to store data in Employee table
        const employeeResponse = await fetch('/api/Employee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });

        if (!employeeResponse.ok) {
            throw new Error('Failed to submit Employee data');
        }

        const employee = await employeeResponse.json();
        const employeeId = employee.EmployeeId.toUpperCase();
        // Second API call to store data in EmployeeLogin table using the generated EmployeeId
        const loginData = {
            
            EmployeeId: employeeId,
            EmployeeEmail: formData.get("email"),
            WhatOperation: 'I', // Assuming 'I' indicates an insert operation
            AuthId: formData.get("authid")
        };
        console.log("EmpLogin:", loginData);
        const loginResponse = await fetch('/api/EmployeeLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        if (!loginResponse.ok) {
            throw new Error('Failed to submit EmployeeLogin data');
        }

        alert('Form submitted successfully');
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit form');
    }

    return redirect('/posts');
}
