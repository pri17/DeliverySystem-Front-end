import axios from "axios";
import React, { Component } from "react";
import styles from "./DepotPage.module.css";

const DEPOT_SINGLE_RUL = "http://localhost:8080/depot/";

class DepotPage extends Component {
  state = {
    whs_name: null,
    whs_code: null,
    lat: null,
    lng: null,
    isLoading: false,
    id: null,
  };

  componentDidMount() {
    let id = this.props.match.params.id;
    //console.log("This depot id is " + id);

    this.setState({
      isLoading: true,
    });
    axios
      .get(DEPOT_SINGLE_RUL + id, {
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
        //console.log(res.data);
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
      .post(DEPOT_SINGLE_RUL + this.state.id, params, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      })
      .then((res) => {})
      .catch((error) => {});
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
      </div>
    );
  }
}

export default DepotPage;
