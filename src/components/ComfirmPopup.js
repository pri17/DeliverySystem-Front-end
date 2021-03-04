import styles from "./ComfirmPopup.module.css";

const ComfirmPopup = ({ handleClose, handleDelete, show, message }) => {
  //console.log(show);
  return (
    <div className={show ? styles.displayBlock : styles.displayNone}>
      <section className={styles.modalMain}>
        {message}
        <button type="button" onClick={handleDelete}>
          Confirm
        </button>
        <button type="button" onClick={handleClose}>
          Cancel
        </button>
      </section>
    </div>
  );
};

export default ComfirmPopup;
