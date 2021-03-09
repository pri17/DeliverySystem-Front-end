import React, { Component } from "react";
import axios from "axios";
import Popup from "../components/Popup";
import styles from "./ProductPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import ComfirmPopup from "../components/ComfirmPopup";
import BlacklistModal from "../components/BlacklistModal";

class ProductPage extends Component {
  state = {
    name: null,
    delivery_multiplier: null,
    isLoading: false,
    id: null,
    showPopup: false,
    message: null,
    delivery_blacklist: [],
    showConfirm1: false,
    addBlack: false,
  };

  componentDidMount() {
    let id = this.props.match.params.id;

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
          delivery_blacklist: res.data.deliveryBlacklists,
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

  handleDeleteProduct = () => {
    this.setState({
      showConfirm1: true,
      message: "Are you sure to delete the product?",
    });
  };

  hideConfirmPopup = () => {
    this.setState({ showConfirm1: false });
  };

  confirmDeleteProduct = () => {
    axios.delete(
      process.env.REACT_APP_PRODUCTS_LIST_URL + "/" + this.state.id,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    window.location.replace("/products");
  };

  addNewBlacklist = () => {
    this.setState({
      addBlack: true,
    });
  };

  addBlackHide = () => {
    this.setState({
      addBlack: false,
    });
  };

  render() {
    if (this.state.isLoading) {
      return <div>Loading....</div>;
    }

    const blistBody = !this.state.delivery_blacklist
      ? null
      : this.state.delivery_blacklist.map((record) => {
          return (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.delivery_type_id}</td>
              <td>{record.created_at}</td>
              <td>{record.updated_at}</td>
              <td>
                <button>Edit</button>
              </td>
              <td>
                <button>Delete</button>
              </td>
            </tr>
          );
        });

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
            <button onClick={this.handleSubmit} className={styles.saveBtn}>
              Save Change
            </button>
            <button
              className={styles.deleteBtn}
              onClick={this.handleDeleteProduct}
            >
              Delete Type
            </button>
          </div>
        </div>
        <Popup
          show={this.state.showPopup}
          handleClose={this.hideModal}
          message={this.state.message}
        ></Popup>

        <ComfirmPopup
          show={this.state.showConfirm1}
          handleDelete={this.confirmDeleteProduct}
          handleClose={this.hideConfirmPopup}
          message={this.state.message}
        ></ComfirmPopup>

        <div className={styles.PostCodeList}>
          <div className={styles.title2}>
            Delivery Blacklist
            <FontAwesomeIcon
              icon={faPlus}
              size="lg"
              onClick={this.addNewBlacklist}
              className={styles.plusBtn}
            />
          </div>

          {!this.state.delivery_blacklist ? null : (
            <table>
              <thead>
                <tr>
                  <th>Blacklist ID</th>
                  <th>Delivery Type ID</th>
                  <th>Created At </th>
                  <th>Updated At </th>
                </tr>
              </thead>
              <tbody>{blistBody}</tbody>
            </table>
          )}
        </div>

        <BlacklistModal
          showup={this.state.addBlack}
          hideup={this.addBlackHide}
          product_id={this.state.id}
        />
      </div>
    );
  }
}

export default ProductPage;
