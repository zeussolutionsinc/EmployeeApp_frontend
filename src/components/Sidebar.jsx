import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css'

function Sidebar() {
    return(
        <>
        <div className={styles.sidebar}>
            <div className={styles.sidebaritem}>
                <NavLink to={`/posts`}className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }><h1 className={`${styles.h1} ${styles.selected}`}>Leave Application</h1></NavLink>
                <NavLink to={`/timesheet`}className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }><h1 className={styles.h1}>Timesheet </h1></NavLink>
                <NavLink to={`/h1bform`}className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }><h1 className={styles.h1}>H1b Form </h1></NavLink>
            </div>
        </div>
        </>
    )
}

export default Sidebar;