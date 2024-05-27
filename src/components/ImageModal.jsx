import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ImageModal.module.css'; // Ensure you create this file for the modal styles

const ImageModal = (props) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false)
    function closeHandler(){
        navigate(".")
    }
    function openModal(){
        return !isOpen
    }

    return(
        <>
            <div className={styles.backdrop} onClick={closeHandler}/>
            <button onClick={openModal}></button>
            <dialog className={styles.modal}>
                <h2>Hello world</h2>
                {props.children}
            </dialog>
            {/* <div className={styles.backdrop} onClick={closeHandler} />
                <div className={styles.addiv}>
                    <div className={styles.addivflex}>
                        {props.children}
                    </div>
                </div> */}
        </>
    )
};

export default ImageModal;
