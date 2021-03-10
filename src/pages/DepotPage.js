import axios from "axios";
import React, { Component } from "react";
import styles from "./ProductPage.module.css";
import Popup from "../components/Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import DeliveryPriceModal from "../components/DeliveryPriceModal";
import ComfirmPopup from "../components/ComfirmPopup";

class DepotPage extends Component {
  state = {
    whs_name: null,
    whs_code: null,
    lat: null,
    lng: null,
    isLoading: false,
    id: null, // depot id
    showPopup: false,
    message: null,
    d_priceList: [],
    delivery_types: [],
    //For Modal
    addPrice: false,
    isEdit: false,
    editData: {
      price_per_mile: null,
      min_price: null,
      delivery_type_id: null,
      depot_id: null,
      price_id: null,
    },

    //for delete price
    showConfirm: false,
    message: null,
    confirmData: { id: null },
  };

  componentDidMount() {
    let id = this.props.match.params.id;

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
      });

    //get all delivery prices list
    axios
      .get(process.env.REACT_APP_PRICES_URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      })
      .then((res) => {
        this.setState({
          d_priceList: res.data,
        });
      });

    //get all type list
    axios
      .get(process.env.REACT_APP_DELIVERYTYPE_LIST_URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      })
      .then((res) => {
        this.setState({
          delivery_types: res.data,
        });
      });
  }

  handleChange = (event) => {
    if (event.target.name === "whs_name")
      this.setState({ whs_name: event.target.value });
    if (event.target.name === "whs_code")
      this.setState({ whs_code: event.target.value });
    if (event.target.name === "lat") this.setState({ lat: event.target.value });
    if (event.target.name === "lng") this.setState({ lng: event.target.value });
  };

  hideModal = () => {
    this.setState({ showPopup: false });
    this.props.history.push("/depots");
  };

  handleSubmit = () => {
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

  addNewPrice = () => {
    this.setState({
      addPrice: true,
      isEdit: false,
      editData: {
        price_per_mile: null,
        min_price: null,
        delivery_type_id: null,
        depot_id: this.state.id,
        price_id: null,
      },
    });
  };

  hidePrice = () => {
    this.setState({
      addPrice: false,
    });
  };

  openEdit = (item) => {
    this.setState({
      addPrice: true,
      isEdit: true,
      editData: {
        price_per_mile: item.price_per_mile,
        min_price: item.min_price,
        delivery_type_id: item.delivery_type_id,
        depot_id: this.state.id,
        price_id: item.id,
      },
    });
  };

  deletePrice = (id) => {
    this.setState({
      showConfirm: true,
      message: "Are you sure to delete the delivery price?",
      confirmData: { id: id },
    });
  };

  hideConfirmPopup = () => {
    this.setState({ showConfirm: false });
  };

  confirmDeleteType = () => {
    axios.delete(
      process.env.REACT_APP_PRICES_URL + "/" + this.state.confirmData.id,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    window.location.reload();
  };

  render() {
    if (this.state.isLoading) {
      return <div>Loading....</div>;
    }

    const types = [...this.state.delivery_types];

    const blistBody = !this.state.d_priceList
      ? null
      : this.state.d_priceList.map((record) => {
          var typetype = types.filter(
            (item) => item.id === record.delivery_type_id
          );

          return (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{!typetype.length ? null : typetype[0].name}</td>
              <td>{record.price_per_mile}</td>
              <td>{record.min_price}</td>
              <td>{record.created_at}</td>
              <td>{record.updated_at}</td>
              <td colspan="2">
                <button
                  className={styles.op_btn}
                  onClick={() => this.openEdit(record)}
                >
                  Edit
                </button>
                <button onClick={() => this.deletePrice(record.id)}>
                  Delete
                </button>
              </td>
            </tr>
          );
        });

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
            <button onClick={this.handleSubmit} className={styles.saveBtn}>
              Save Change
            </button>
          </div>
        </div>

        <div className={styles.PostCodeList}>
          <div className={styles.title2}>
            Delivery Prices
            <FontAwesomeIcon
              icon={faPlus}
              size="lg"
              onClick={this.addNewPrice}
              className={styles.plusBtn}
            />
          </div>

          {!this.state.d_priceList ? null : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Delivery Type </th>
                  <th>Price Per Mile</th>
                  <th>Minimum Price</th>
                  <th>Created At </th>
                  <th>Updated At </th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>{blistBody}</tbody>
            </table>
          )}
        </div>

        <DeliveryPriceModal
          showup={this.state.addPrice}
          hideup={this.hidePrice}
          isEdit={this.state.isEdit}
          editData={this.state.editData}
        />

        <Popup
          show={this.state.showPopup}
          handleClose={this.hideModal}
          message={this.state.message}
        ></Popup>

        <ComfirmPopup
          show={this.state.showConfirm}
          handleDelete={this.confirmDeleteType}
          handleClose={this.hideConfirmPopup}
          message={this.state.message}
        ></ComfirmPopup>
      </div>
    );
  }
}

export default DepotPage;
