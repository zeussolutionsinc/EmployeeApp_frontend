import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const buttonStyle = {
    fontSize: '16px',
    backgroundColor: isHovered ? '#fff' : 'black', // Change color on hover
    color: isHovered ? 'black': '#ffff',
    padding: '10px 20px',
    border: '1px solid white',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    marginTop: 'auto',
    textAlign: 'center',
    transition: 'background-color 0.3s ease, color 0.3s ease', // Smooth transition
    fontWeight: 'bold',
  };

  return (
    <button
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleLogout}
    >
      Log Out
    </button>
  );
};
