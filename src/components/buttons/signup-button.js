import { useAuth0 } from "@auth0/auth0-react";
import styles from '../MainHeader.module.css';
import React from "react";

export const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/posts",
      },
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  return (
    <button className={styles.button} onClick={handleSignUp}>
      Sign Up
    </button>
  );
};