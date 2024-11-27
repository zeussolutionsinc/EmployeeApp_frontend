// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import React from 'react';
import Sidebar from '../components/Sidebar';
import styles from './HomePage.module.css'; // Import the CSS module
import { useAuth0 } from "@auth0/auth0-react";


const HomePage = () => {
    const [employeeName, setEmployeeName] = useState();
    const {user} = useAuth0();
    const authId = user.sub.substring(6);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const url = `https://zeusemployeeportalbackend.azurewebsites.net/api/EmployeeLogin/${authId}`;
            const response = await fetch(url, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              mode: "cors",
            });
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const json = await response.json();
            console.log(`employee login json : ${json}`);
            if (json && json.EmployeeName) {
                
                setEmployeeName(json.EmployeeName)
              
            } else {
              throw new Error("Fetched data is not in the expected format");
            }
          } catch (error) {
            console.error("There was a problem with your fetch operation:", error);
          }
        };
    
        fetchData();
    
        // Optional: Uncomment the following lines if you want to re-fetch data periodically
        // const interval = setInterval(fetchData, 30000); // Fetch data every 30 seconds
        // return () => clearInterval(interval); // Clean up the interval on component unmount
    
      }, [authId]);

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.content}>
                <h1>Welcome, {employeeName}</h1>
                <div className={styles.links}>
                    <a href="#" className={styles.link}>Zeus Employee Handbook</a>
                    <a href="#" className={styles.link}>ADP Portal</a>
                    <a href="#" className={styles.link}>Employee Benefits</a>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
