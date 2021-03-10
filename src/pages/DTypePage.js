import React, { Component, useState } from "react";
import axios from "axios";
import Popup from "../components/Popup";
import ComfirmPopup from "../components/ComfirmPopup";
import styles from "./ProductPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import PostCodeModal from "../components/PostCodeModal";

class DTypePage extends Component {
  state = {
    name: null,
    enabled: null,
    isLoading: false,
    id: null, // delivery type id
    showPopup: false,
    message: null,
    postcode_list: null,
    backURL: "",
    //Modal state
    modalShow: false,
    isEdit: false,
    ModalData: {
      id: null,
      postcode_prefix: null,
      min_price: null,
      delivery_type_id: null,
    },
    showConfirm1: false,
    showConfirm2: false,
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
          postcode_list: res.data.deliveryPostsCodes,
        });
      });
  }

  handleChange = (event) => {
    if (event.target.name === "name")
      this.setState({ name: event.target.value });
    if (event.target.name === "enabled")
      this.setState({ enabled: event.target.checked });
    //console.log(event.target.checked);
  };

  hidePopup = () => {
    this.setState({ showPopup: false });
    if (this.state.backURL == "deliveryTypes")
      this.props.history.push("/" + this.state.backURL);
    else {
      this.componentDidMount();
    }
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
        this.setState({
          showPopup: true,
          message: "Update Sucess!",
          backURL: "deliveryTypes",
        });
      })
      .catch((error) => {
        this.setState({
          showPopup: true,
          message: "Update Failed!",
          backURL: "deliveryTypes",
        });
      });
  };

  handleDeleteType = () => {
    this.setState({
      showConfirm1: true,
      message: "Are you sure to delete the delivery type?",
    });
  };

  confirmDeleteType = () => {
    axios.delete(
      process.env.REACT_APP_DELIVERYTYPE_LIST_URL + "/" + this.state.id,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    window.location.replace("/deliveryTypes"); //back to type list
  };

  hideConfirmPopup = () => {
    this.setState({ showConfirm1: false, showConfirm2: false });
  };

  addNewPopup = () => {
    this.setState({
      modalShow: true,
      isEdit: false,
      ModalData: {
        id: null,
        postcode_prefix: null,
        min_price: null,
        delivery_type_id: this.state.id,
      },
    });
  };

  modalHide = () => {
    this.setState({
      modalShow: false,
      ModalData: {
        id: null,
        postcode_prefix: null,
        min_price: null,
        delivery_type_id: null,
      },
    });
  };

  deletePostcode = (id) => {
    this.setState({
      showConfirm2: true,
      message: "Are you sure to delete the postcode?",
      ModalData: { id: id },
    });
  };

  confirmDeletePostcode = () => {
    axios.delete(
      process.env.REACT_APP_POSTCODE_ADD_URL + "/" + this.state.ModalData.id,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    window.location.reload();
  };

  openEdit = (record) => {
    this.setState({
      modalShow: true,
      isEdit: true,
      ModalData: {
        id: record.id,
        postcode_prefix: record.postcode_prefix,
        min_price: record.min_price,
        delivery_type_id: record.delivery_type_id,
      },
    });
  };

  render() {
    if (this.state.isLoading) {
      return <div>Loading....</div>;
    }

    const postCodeBody = !this.state.postcode_list
      ? null
      : this.state.postcode_list.map((record) => {
          return (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.postcode_prefix}</td>
              <td>{record.min_price}</td>
              <td>{record.created_at}</td>
              <td>{record.updated_at}</td>
              <td>
                <button
                  onClick={() => this.openEdit(record)}
                  className={styles.op_btn}
                >
                  Edit
                </button>

                <button onClick={() => this.deletePostcode(record.id)}>
                  Delete
                </button>
              </td>
            </tr>
          );
        });

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
            <button onClick={this.handleSubmit} className={styles.saveBtn}>
              Save Change
            </button>
            <button
              className={styles.deleteBtn}
              onClick={this.handleDeleteType}
            >
              Delete Type
            </button>
          </div>
        </div>
        <Popup
          show={this.state.showPopup}
          handleClose={this.hidePopup}
          message={this.state.message}
        ></Popup>

        <ComfirmPopup
          show={this.state.showConfirm1}
          handleDelete={this.confirmDeleteType}
          handleClose={this.hideConfirmPopup}
          message={this.state.message}
        ></ComfirmPopup>

        <div className={styles.PostCodeList}>
          <div className={styles.title2}>
            PostCodes List
            <FontAwesomeIcon
              icon={faPlus}
              size="lg"
              onClick={this.addNewPopup}
              className={styles.plusBtn}
            />
          </div>

          {!this.state.postcode_list ? null : (
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Postcode ID</th>
                  <th>Postcode Prefix</th>
                  <th>Min Price</th>
                  <th>Created At </th>
                  <th>Updated At </th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>{postCodeBody}</tbody>
            </table>
          )}
        </div>

        <PostCodeModal
          showup={this.state.modalShow}
          hideup={this.modalHide}
          data={this.state.ModalData}
          isEdit={this.state.isEdit}
        />

        <ComfirmPopup
          show={this.state.showConfirm2}
          handleDelete={this.confirmDeletePostcode}
          handleClose={this.hideConfirmPopup}
          message={this.state.message}
        ></ComfirmPopup>
      </div>
    );
  }
}

export default DTypePage;
