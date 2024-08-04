import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from '../buttons/login-button';
import { LogoutButton } from '../buttons/logout-button';
import { SignupButton } from '../buttons/signup-button';
import styles from './MainHeader.module.css';
import companyLogo from '../../zeus_logo.png';

function MainHeader({ onCreatePost }) {
    const { isAuthenticated, user } = useAuth0();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkIfUserExists = async () => {
            if (isAuthenticated && user) {
                const response = await fetch(`/api/EmployeeLogin/${user.sub.substring(6)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (!data) {
                        navigate('/signup'); // Redirect to signup if user data is not found
                    } else {
                        navigate('/home'); // Redirect to home page if user data is found
                    }
                } else {
                    navigate('/signup'); // Redirect to signup if API call fails
                }
            }
        };
        checkIfUserExists();
    }, [isAuthenticated, user, navigate]);

    // Define a mapping of routes to their corresponding header text
    const pageTitles = {
        '/home': 'Home Page',
        '/posts': 'Leave Application',
        '/timesheet': 'Timesheet',
        '/h1bform': 'H1b Form',
        '/admin': 'Admin Page',
        '/posts/create-post': 'Apply Leave',
        '/superadmin': 'Super Admin'
    };

    // Ensure that the path is matched correctly even with potential trailing slashes or case differences
    const currentPath = location.pathname.toLowerCase().replace(/\/$/, '');

    // Get the header text based on the current path
    const headerText = pageTitles[currentPath] || 'Welcome to the Employee Portal';

    // Log the current path and header text to the console
    console.log('Current Path:', currentPath);
    console.log('Header Text:', headerText);

    return (
        <>
            <header className={styles.header}>
                <img src={companyLogo} alt='companyLogo' />
                <h1 className={styles.logo}>
                    {headerText}
                </h1>
                <p>
                    {user && (<span className={styles.emailheader}>{user.email}</span>)}
                    {!isAuthenticated && (
                        <>
                            <SignupButton />
                            <LoginButton />
                        </>
                    )}
                    {isAuthenticated && (
                        <>
                            {location.pathname === '/posts' && (
                                <Link to='/posts/create-post'>
                                    <button className={styles.button} onClick={onCreatePost}>
                                        Apply Leave
                                    </button>
                                </Link>
                            )}
                        </>
                    )}
                </p>
            </header>
        </>
    )
}

export default MainHeader;
