import React, { Component } from "react";
import axios from "axios";
import Popup from "../components/Popup";
import styles from "./DTypePage.module.css";

class DTypePage extends Component {
  state = {
    name: null,
    enabled: null,
    isLoading: false,
    id: null,
    showPopup: false,
    message: null,
    postcode_list: null,
  };

  componentDidMount() {
    let id = this.props.match.params.id;

    this.setState({
      isLoading: true,
    });

    axios
      .get(process.env.REACT_APP_DELIVERYTYPE_LIST_URL + "/" + id, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      })
      .then((res) => {
        this.setState({
          name: res.data.name,
          enabled: res.data.enabled,
          id: res.data.id,
          isLoading: false,
        });
      });

    //get the postcode list by delivery type id
    axios
      .get(process.env.REACT_APP_POSTCODE_BYTYPE_URL + id, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      })
      .then((res) => {
        this.setState({
          isLoading: false,
          postcode_list: res.data,
        });
        console.log(this.state.postcode_list);
      });
  }

  handleChange = (event) => {
    if (event.target.name === "name")
      this.setState({ name: event.target.value });
    if (event.target.name === "enabled")
      this.setState({ enabled: event.target.checked });
    //console.log(event.target.checked);
  };

  hideModal = () => {
    this.setState({ showPopup: false });
    this.props.history.push("/deliveryTypes");
  };

  handleSubmit = () => {
    const params = {
      name: this.state.name,
      enabled: this.state.enabled ? "1" : "0",
    };

    axios
      .post(
        process.env.REACT_APP_DELIVERYTYPE_LIST_URL + "/" + this.state.id,
        params,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      )
      .then((res) => {
        this.setState({ showPopup: true, message: "Update Sucess!" });
      })
      .catch((error) => {
        this.setState({ showPopup: true, message: "Update Failed!" });
      });
  };

  render() {
    if (this.state.isLoading) {
      return <div>Loading....</div>;
    }

    const postcode_headers = [
      "ID",
      "Postcode Prefix",
      "Min Price",
      "Created At",
      "Updated At",
    ];

    return (
      <div className={styles.container}>
        <div className={styles.title}>Delivery Type Page</div>
        <div className={styles.content}>
          {!this.state.name ? null : (
            <table className={styles.depotTable}>
              <thead>
                <tr>
                  <th>Delivery Type</th>
                  <th>Is Enabled</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      value={this.state.name}
                      type="text"
                      name="name"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </td>
                  <td>
                    <input
                      defaultChecked={this.state.enabled}
                      type="checkbox"
                      name="enabled"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
          <div>
            <button onClick={this.handleSubmit}>Save Change</button>
          </div>
        </div>
        <Popup
          show={this.state.showPopup}
          handleClose={this.hideModal}
          message={this.state.message}
        ></Popup>

        <div className={styles.PostCodeList}>
          <div className={styles.title2}>PostCodes List</div>
          {!this.state.postcode_list ? null : (
            <PostCodeTable
              data={this.state.postcode_list}
              headers={postcode_headers}
            />
          )}
        </div>
      </div>
    );
  }
}

const PostCodeTable = ({ data, headers }) => {
  const tableHeaders = headers.map((head) => {
    return <th key={head}>{head}</th>;
  });

  console.log(data);
  const bodyData = data.map((record) => {
    return (
      <tr key={record.id}>
        <td>{record.id}</td>
        <td>{record.postcode_prefix}</td>
        <td>{record.min_price}</td>
        <td>{record.created_at}</td>
        <td>{record.updated_at}</td>
      </tr>
    );
  });

  return (
    <div className={styles.content}>
      <table className={styles.table}>
        <thead>
          <tr>{tableHeaders}</tr>
        </thead>
        <tbody>{bodyData}</tbody>
      </table>
    </div>
  );
};

export default DTypePage;
