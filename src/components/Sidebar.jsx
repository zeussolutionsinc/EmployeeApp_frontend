import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { Button } from "@mui/material";
import styles from "./Sidebar.module.css";
import { LogoutButton } from "./buttons/logout-button";

const sidebarStyles = {
  sidebar: styles.sidebar,
  sidebaritem: styles.sidebaritem,
  selected: styles.selected,
  h1: styles.h1,
  closeButton: styles.closeButton,
};

function Sidebar() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isApprover, setIsApprover] = useState(false);
  const [isSuperApprover, setSuperIsApprover] = useState(false);

 

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleMouseEnter = () => {
    setIsSidebarVisible(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarVisible(false);
  };


  return (
    <>
      <Button onClick={toggleSidebar} className="sidebar-button">
        <MenuIcon style ={{color:'#a91313'}} />
      </Button>
      <div
        className={`${styles.sidebar} ${!isSidebarVisible && styles["sidebar-hidden"]}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.sidebaritem}>

        <NavLink
            to={`/home`}
            className={({ isActive, isPending }) =>
              isActive ? "active" : isPending ? "pending" : ""
            }
          >
            <h1 className={`${styles.h1}  text-lg`}>
              Home
            </h1>
          </NavLink>

          <NavLink
            to={`/h1bform`}
            className={({ isActive, isPending }) =>
              isActive ? "active" : isPending ? "pending" : ""
            }
          >
            <h1 className={`${styles.h1} text-lg`}>H1B Form</h1>
          </NavLink>
          <div className={styles.logoutButtonWrapper}>
            <LogoutButton />
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
