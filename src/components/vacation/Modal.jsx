import { useNavigate } from 'react-router-dom';
import styles from './Modal.module.css';

function Modal (props){
    const navigate = useNavigate();
    function closeHandler(){
        navigate("..")
    }
    return(
        <>
            {/* <div className={styles.backdrop} onClick={closeHandler}/> */}
            
            {/* <dialog open className={styles.modal}>
            <div className={styles.addiv}>
                <div className={styles.addivflex}>
                    <h2>Leave Application</h2>
                </div>
            </div>
            <hr />
                {props.children}
            </dialog> */}
            <div className={styles.backdropq} onClick={closeHandler} />
                <div className={styles.addiv}>
                    <div className={styles.addivflex}>
                        {props.children}
                    </div>
                </div>
        </>
    )
}

export default Modal;