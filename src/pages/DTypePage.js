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
  };

  componentDidMount() {
    let id = this.props.match.params.id;
    //console.log("This depot id is " + id);

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
        //console.log(this.state);
      });
  }

  handleChange = (event) => {
    if (event.target.name === "name")
      this.setState({ name: event.target.value });
    if (event.target.name === "enabled")
      this.setState({ enabled: event.target.checked });
    console.log(event.target.checked);
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
      </div>
    );
  }
}

export default DTypePage;