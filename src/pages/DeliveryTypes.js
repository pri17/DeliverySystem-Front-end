import React, { Component } from "react";

import styles from "./DeliveryTypes.module.css";

class DeliveryTypes extends Component {
  state = {};
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.title}>Delivery Types</div>
        <div className={styles.content}></div>
      </div>
    );
  }
}

export default DeliveryTypes;
