import React, { Component } from "react";
import axios from "axios";
import styles from "./DeliveryTypes.module.css";

class DeliveryTypes extends Component {
  state = {
    dTypes: [],
    addBtn: false,
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

  componentDidUpdate() {
    this.componentDidMount();
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
