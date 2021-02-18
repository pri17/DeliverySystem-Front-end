import React, { Component } from "react";
import axios from "axios";
import styles from "./DeliveryTypes.module.css";
import DeliveryTable from "../components/DeliveryTable";

class DeliveryTypes extends Component {
  state = {
    dTypes: [],
  };

  componentDidMount() {
    axios
      .get(process.env.REACT_APP_DELIVERYTYPE_LIST_URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        this.setState({
          dTypes: res.data,
        });
      });
  }

  render() {
    const { dTypes } = this.state;

    const headers = [
      "ID",
      "Delivery Type",
      "Is Enabled or Not",
      "Created At",
      "Updated At",
    ];

    return (
      <div className={styles.content}>
        <h1> Delivery Types List</h1>
        <DeliveryTable data={dTypes} headers={headers} props={this.props} />
      </div>
    );
  }
}

export default DeliveryTypes;
