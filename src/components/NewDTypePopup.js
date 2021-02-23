import React, { Component } from "react";
import styles from "./NewDTypePopup.module.css";

class NewDTypePopup extends Component {
  state = {};

  hideModal = () => {
    this.props.hide();
  };

  render() {
    return <div></div>;
  }
}

export default NewDTypePopup;
