import React, { Component } from "react";
import axios from "axios";
import styles from "./DeliveryTypes.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import DeliveryTypeModal from "../components/DeliveryTypeModal";

class DeliveryTypes extends Component {
  state = {
    dTypes: [],
    addModal: false,
    ModalData: {
      id: null,
      name: null,
      enabled: null,
    },
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

  modalHide = () => {
    this.setState({
      addModal: false,
    });
  };

  addNewPopup = () => {
    this.setState({
      addModal: true,
      ModalData: {
        id: null,
        name: null,
        enabled: null,
      },
    });
  };

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
        <div className={styles.titleSection}>
          <h1>Delivery Types List</h1>
          <FontAwesomeIcon
            icon={faPlus}
            size="lg"
            onClick={this.addNewPopup}
            className={styles.plusBtn}
          />
        </div>

        <DeliveryTable data={dTypes} headers={headers} props={this.props} />

        <DeliveryTypeModal
          showup={this.state.addModal}
          hideup={this.modalHide}
          data={this.state.ModalData}
        />
      </div>
    );
  }
}

const DeliveryTable = ({ data, headers, props }) => {
  const header = headers.map((head) => {
    return <th key={head}>{head}</th>;
  });

  const handleClick = (id) => {
    // console.log(props);
    props.history.push("/deliveryTypes/" + id);
  };

  const bodyData = data.map((record) => {
    return (
      <tr onClick={() => handleClick(record.id)} key={record.id}>
        <td>{record.id}</td>
        <td>{record.name}</td>
        <td>{record.enabled}</td>
        <td>{record.created_at}</td>
        <td>{record.updated_at}</td>
      </tr>
    );
  });

  return (
    <div className={styles.content}>
      <table className={styles.table}>
        <thead>
          <tr>{header}</tr>
        </thead>
        <tbody>{bodyData}</tbody>
      </table>
    </div>
  );
};

export default DeliveryTypes;
