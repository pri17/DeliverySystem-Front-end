import React from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Navigation Lists</div>
      <div className={styles.content}>
        <nav>
          <ul>
            <li className={styles.listStyle}>
              <Link to="/depots" className={styles.links}>
                Depots
              </Link>
            </li>
            <li className={styles.listStyle}>
              <Link to="/deliveryTypes" className={styles.links}>
                Delivery Types
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Home;
