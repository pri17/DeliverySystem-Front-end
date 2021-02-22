import React, { Component } from "react";
import axios from "axios";
import Popup from "../components/Popup";
import styles from "./ProductPage.module.css";

class ProductPage extends Component {
  state = {
    name: null,
    delivery_multiplier: null,
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
      .get(process.env.REACT_APP_PRODUCTS_LIST_URL + "/" + id, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      })
      .then((res) => {
        this.setState({
          name: res.data.name,
          delivery_multiplier: res.data.delivery_multiplier,
          id: res.data.id,
          isLoading: false,
        });
      });
  }

  handleChange = (event) => {
    if (event.target.name === "name")
      this.setState({ name: event.target.value });
    if (event.target.name === "delivery_multiplier")
      this.setState({ delivery_multiplier: event.target.value });
  };

  hideModal = () => {
    this.setState({ showPopup: false });
    this.props.history.push("/products");
  };

  handleSubmit = () => {
    const params = {
      name: this.state.name,
      delivery_multiplier: this.state.delivery_multiplier,
    };

    axios
      .post(
        process.env.REACT_APP_PRODUCTS_LIST_URL + "/" + this.state.id,
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
        <div className={styles.title}>Product Page</div>
        <div className={styles.content}>
          {!this.state.name ? null : (
            <table className={styles.depotTable}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Delivery Multiplier</th>
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
                      value={this.state.delivery_multiplier}
                      type="text"
                      name="delivery_multiplier"
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

export default ProductPage;
