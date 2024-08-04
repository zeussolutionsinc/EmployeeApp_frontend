
import { useNavigate } from 'react-router-dom';
import styles from './Modal.module.css';

function Modal(props) {
  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }

  return (
    <>
      <div className={styles.backdrop} onClick={closeHandler} />
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          {props.children}
        </div>
      </div>
    </>
  );
}

export default Modal;
