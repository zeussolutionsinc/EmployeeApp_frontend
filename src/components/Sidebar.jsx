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

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const fetchApproverData = async () => {
        try {
          // Fetch the employee login data to get EmployeeId
          const loginResponse = await fetch(
            `/api/EmployeeLogin/${user.sub.substring(6)}`
          );
          if (!loginResponse.ok) throw new Error("Failed to fetch login data");
          const loginData = await loginResponse.json();
          console.log("Login_data:", loginData);
          const employeeId = loginData.EmployeeId;
          console.log("EmpID:", employeeId);
          // Fetch the approver data using EmployeeId
          const approverResponse = await fetch(
            `/api/Approver/employee/${employeeId}`
          );
          console.log("AP: ", approverResponse);
          if (approverResponse.ok) {
            setIsApprover(true);
          } else {
            setIsApprover(false);
          }
        const superAdminResponse = await fetch(
          `/api/SuperAdmin/authID/${user.sub.substring(6)}`
        );
        console.log("SP: ", superAdminResponse);
        if (superAdminResponse.ok) {
          setSuperIsApprover(true);
        } else {
          setSuperIsApprover(false);
        }
      } catch (error) {
        console.error("Error fetching approver data:", error);
        setIsApprover(false);
      }

      };
      fetchApproverData();
    }
  }, [isLoading, isAuthenticated, user]);

 

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
            to={`/posts`}
            className={({ isActive, isPending }) =>
              isActive ? "active" : isPending ? "pending" : ""
            }
          >
            <h1 className={`${styles.h1}  text-lg`}>
              Leave Application
            </h1>
          </NavLink>
          <NavLink
            to={`/timesheet`}
            className={({ isActive, isPending }) =>
              isActive ? "active" : isPending ? "pending" : ""
            }
          >
            <h1 className={`${styles.h1} text-lg`}>Timesheet</h1>
          </NavLink>
          <NavLink
            to={`/h1bform`}
            className={({ isActive, isPending }) =>
              isActive ? "active" : isPending ? "pending" : ""
            }
          >
            <h1 className={`${styles.h1} text-lg`}>H1B Form</h1>
          </NavLink>
          {isApprover && (
            <NavLink
              to={`/admin`}
              className={({ isActive, isPending }) =>
                isActive ? "active" : isPending ? "pending" : ""
              }
            >
              <h1 className={`${sidebarStyles.h1} text-lg`}>Admin Page</h1>
            </NavLink>
          )}
          { isSuperApprover && (
          <NavLink
            to={`/superadmin`}
            className={({ isActive, isPending }) =>
              isActive ? "active" : isPending ? "pending" : ""
            }
          >
            <h1 className={`${styles.h1} text-lg`}>Super Admin</h1>
          </NavLink>)}

          <div className={styles.logoutButtonWrapper}>
            <LogoutButton />
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
