import styles from "./Popup.module.css";

const Popup = ({ handleClose, show, message }) => {
  //console.log(show);
  return (
    <div className={show ? styles.displayBlock : styles.displayNone}>
      <section className={styles.modalMain}>
        {message}
        <button type="button" onClick={handleClose}>
          Close
        </button>
      </section>
    </div>
  );
};

export default Popup;
