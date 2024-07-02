import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from '../buttons/login-button';
import { LogoutButton } from '../buttons/logout-button';
import { SignupButton } from '../buttons/signup-button';
import styles from './MainHeader.module.css';
import companyLogo from '../../zeus_logo.png';

function MainHeader({ onCreatePost }) {
    const { isAuthenticated, user } = useAuth0();
    const location = useLocation();

    return (
        <>
            <header className={styles.header}>
                <img src={companyLogo} alt='companyLogo' />
                <h1 className={styles.logo}>
                    Employee Portal
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
