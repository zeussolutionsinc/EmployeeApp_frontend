import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import styles from '../vacation/MainHeader.module.css';

export const LogoutButton = ({  }) => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <button
      style={{
        fontSize: '16px',
        backgroundColor: '#6a4c93',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'block',
        width: '100%',
        marginTop: 'auto',
        textAlign:'center'
      }}
      onClick={handleLogout}
    >
      Log Out
    </button>
  );
};
