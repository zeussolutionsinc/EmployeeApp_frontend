import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import styles from '../MainHeader.module.css';

export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <button className={styles.button} onClick={handleLogout}>
      Log Out
    </button>
  );
};