import axios from "axios";
import React, { Component } from "react";
import styles from "./DepotPage.module.css";
import Popup from "../components/Popup";

class DepotPage extends Component {
  state = {
    whs_name: null,
    whs_code: null,
    lat: null,
    lng: null,
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
      .get(process.env.REACT_APP_DEPOT_GET_URL + id, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      })
      .then((res) => {
        this.setState({
          whs_name: res.data.whs_name,
          whs_code: res.data.whs_code,
          lat: res.data.lat,
          lng: res.data.lng,
          id: res.data.id,
          isLoading: false,
        });
        //console.log(this.state);
      });
  }

  handleChange = (event) => {
    if (event.target.name === "whs_name")
      this.setState({ whs_name: event.target.value });
    if (event.target.name === "whs_code")
      this.setState({ whs_code: event.target.value });
    if (event.target.name === "lat") this.setState({ lat: event.target.value });
    if (event.target.name === "lng") this.setState({ lng: event.target.value });
    //console.log(this.state);
  };

  hideModal = () => {
    this.setState({ showPopup: false });
    this.props.history.push("/depots");
  };

  handleSubmit = () => {
    // const params = new URLSearchParams();
    // params.append("whs_name", this.state.whs_name);
    // params.append("whs_code", this.state.whs_code);
    // params.append("lat", this.state.lat);
    // params.append("lng", this.state.lng);

    //Alternatively
    const params = {
      whs_name: this.state.whs_name,
      whs_code: this.state.whs_code,
      lat: this.state.lat,
      lng: this.state.lng,
    };

    axios
      .post(process.env.REACT_APP_DEPOT_GET_URL + this.state.id, params, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      })
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
        <div className={styles.title}>Depot Information Page</div>
        <div className={styles.content}>
          {!this.state.whs_name ? null : (
            <table className={styles.depotTable}>
              <thead>
                <tr>
                  <th>Depot Name</th>
                  <th>Depot Code</th>
                  <th>Depot Location Latitude</th>
                  <th>Depot Location Longitude </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      value={this.state.whs_name}
                      type="text"
                      name="whs_name"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </td>
                  <td>
                    <input
                      value={this.state.whs_code}
                      type="text"
                      name="whs_code"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </td>
                  <td>
                    <input
                      value={this.state.lat}
                      type="text"
                      name="lat"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </td>
                  <td>
                    <input
                      value={this.state.lng}
                      type="text"
                      name="lng"
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

export default DepotPage;
