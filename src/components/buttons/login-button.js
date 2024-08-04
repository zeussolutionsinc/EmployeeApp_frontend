import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import styles from '../vacation/MainHeader.module.css';

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/posts",
      },
    });
  };

  return (
    <button className={styles.button} onClick={handleLogin}>
      Log In
    </button>
  );
};